/*
 * 構思賓果｜功能核心 v1.6.0
 * 負責題庫、小說／賓果牌／格子 UID、抽題、完成狀態、賓果判定、本機保存與 PNG 資料繪製。
 * 網頁介面與事件由 bingo_style.js 負責；共用功能只呼叫慢慢軍火庫的 HTTPS 零件。
 */
(function (global) {
    "use strict";

    const BOARD_SIZE = 4;
    const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
    const STORAGE_NAMESPACE = "sbs_story_bingo";
    const VERSION = "1.6.0";
    const STORAGE_SCHEMA_VERSION = 2;

    const TOPIC_GROUPS = Object.freeze([
        {
            id: "foundation",
            label: "作品基礎",
            shortLabel: "作品",
            topics: [
                ["work_title", "作品名稱"],
                ["primary_genre", "故事類型"],
                ["secondary_genre", "次要類型"],
                ["premise", "故事主軸"],
                ["theme", "故事主題"],
                ["audience", "閱讀定位"]
            ]
        },
        {
            id: "world",
            label: "世界觀與背景",
            shortLabel: "世界",
            topics: [
                ["era", "時代背景"],
                ["setting", "故事舞台"],
                ["worldbuilding", "世界觀"],
                ["rules", "世界規則"],
                ["special", "特殊設定"]
            ]
        },
        {
            id: "character",
            label: "人物設定",
            shortLabel: "人物",
            topics: [
                ["protagonist", "主角人設"],
                ["supporting", "配角人設"],
                ["backstory", "人物背景"],
                ["relationships", "人物關係"],
                ["goals", "人物目標"],
                ["motives", "人物動機"],
                ["flaws", "人物弱點"],
                ["growth", "角色成長"]
            ]
        },
        {
            id: "plot",
            label: "劇情與衝突",
            shortLabel: "劇情",
            topics: [
                ["main_plot", "主線劇情"],
                ["conflict", "核心衝突"],
                ["opening", "故事開頭"],
                ["key_events", "關鍵事件"],
                ["twist", "劇情轉折"],
                ["climax", "故事高潮"],
                ["ending", "故事結局"],
                ["foreshadow", "伏筆規劃"],
                ["subplots", "支線劇情"]
            ]
        },
        {
            id: "narrative",
            label: "敘事與風格",
            shortLabel: "敘事",
            topics: [
                ["prose", "作品文風"],
                ["technique", "敘事手法"],
                ["pov", "敘事視角"],
                ["pacing", "故事節奏"]
            ]
        },
        {
            id: "structure",
            label: "篇幅與章節",
            shortLabel: "篇幅",
            topics: [
                ["length", "篇幅規劃"],
                ["word_count", "預計字數"],
                ["chapter_plan", "章節規劃"],
                ["chapter_structure", "章節結構"]
            ]
        }
    ].map(group => Object.freeze({
        ...group,
        topics: Object.freeze(group.topics.map(([key, label]) => Object.freeze({
            topic_id: `${group.id}.${key}`,
            group_id: group.id,
            label
        })))
    })));

    const ALL_TOPICS = Object.freeze(TOPIC_GROUPS.flatMap(group => group.topics));
    const TOPIC_BY_ID = new Map(ALL_TOPICS.map(topic => [topic.topic_id, topic]));

    const state = {
        store: null,
        collections: null,
        novels: [],
        boards: [],
        cells: [],
        activeNovelUid: null,
        activeBoardUid: null,
        initialized: false
    };

    const listeners = new Set();

    function requireWarehouse() {
        const required = [
            "FictionStorage",
            "RandomId",
            "FictionShuffle",
            "SlowlyRandom",
            "SlowlyCanvasPNG",
            "SlowlyPNGDownload",
            "SlowlyCanvasWrappedText"
        ];
        const missing = required.filter(name => !global[name]);

        if (missing.length) {
            throw new Error(`慢慢軍火庫載入失敗：${missing.join("、")}。請確認網路及 HTTPS 來源。`);
        }
    }

    function emit(type, detail = {}) {
        listeners.forEach(listener => {
            try {
                listener({ type, ...detail });
            } catch (error) {
                console.error("[構思賓果] 狀態監聽器發生錯誤", error);
            }
        });
    }

    function normalizeName(value, fallback = "") {
        return String(value ?? "").trim().slice(0, 90) || fallback;
    }

    function defaultNovelName(date = new Date()) {
        // 使用作者裝置的當地日期，避免午夜前後因 UTC 而顯示錯誤日期。
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `構思賓果 ${year}-${month}-${day}`;
    }

    function createUniqueUid(prefix, existingIds) {
        for (let attempt = 0; attempt < 12; attempt += 1) {
            const uid = global.RandomId.create({ prefix });
            if (!existingIds.has(uid)) {
                existingIds.add(uid);
                return uid;
            }
        }
        throw new Error("無法產生不重複的 UID，請重新嘗試。");
    }

    function findCurrentNovel() {
        return state.novels.find(novel => novel.novel_uid === state.activeNovelUid) || null;
    }

    function findCurrentBoard() {
        return state.boards.find(board =>
            board.board_uid === state.activeBoardUid &&
            board.novel_uid === state.activeNovelUid
        ) || null;
    }

    function listBoardsForNovel(novelUid) {
        return state.boards.filter(board => board.novel_uid === novelUid);
    }

    function resolveCells(board) {
        if (!board || !Array.isArray(board.cell_uids)) {
            return [];
        }

        const cellMap = new Map(
            state.cells.filter(cell => cell.board_uid === board.board_uid)
                .map(cell => [cell.cell_uid, cell])
        );

        return board.cell_uids.map(uid => cellMap.get(uid)).filter(Boolean);
    }

    function currentSnapshot() {
        const novel = findCurrentNovel();
        const board = findCurrentBoard();
        const cells = resolveCells(board);
        const completed = cells.filter(cell => cell.completed).length;
        const expectedCount = CELL_COUNT;
        const lines = cells.length === expectedCount ? getCompletedLines(cells) : [];

        return {
            novels: state.novels.slice(),
            boards: novel ? listBoardsForNovel(novel.novel_uid) : [],
            novel,
            board,
            cells,
            completed,
            total: expectedCount,
            lines,
            percent: Math.round(completed / expectedCount * 100)
        };
    }

    function getCompletedLines(cells) {
        if (!Array.isArray(cells) || cells.length !== CELL_COUNT) {
            return [];
        }
        const size = BOARD_SIZE;

        const lines = [];
        const candidates = [];

        for (let row = 0; row < size; row += 1) {
            candidates.push({ type: "row", index: row, positions: Array.from({ length: size }, (_, col) => row * size + col) });
        }
        for (let col = 0; col < size; col += 1) {
            candidates.push({ type: "column", index: col, positions: Array.from({ length: size }, (_, row) => row * size + col) });
        }
        candidates.push({ type: "diagonal", index: 0, positions: Array.from({ length: size }, (_, pos) => pos * size + pos) });
        candidates.push({ type: "diagonal", index: 1, positions: Array.from({ length: size }, (_, pos) => pos * size + size - 1 - pos) });

        for (const candidate of candidates) {
            if (candidate.positions.every(index => cells[index]?.completed === true)) {
                lines.push(candidate);
            }
        }
        return lines;
    }

    function randomArrayItem(items) {
        if (!items.length) {
            throw new Error("找不到可供抽取的構思題目。");
        }
        return items[global.SlowlyRandom.int(0, items.length - 1)];
    }

    function shuffled(items) {
        return global.FictionShuffle.shuffle(items);
    }

    function fixedTopics() {
        // 4×4 版：每類先取前 2 種 (共 12 格)，剩下 4 格補「配角人設」。
        // 延續固定牌的原則：先涵蓋六類，空位優先配角。
        const topics = TOPIC_GROUPS.flatMap(group => group.topics.slice(0, 2));
        for (let i = topics.length; i < CELL_COUNT; i += 1) {
            topics.push(TOPIC_BY_ID.get("character.supporting"));
        }
        return shuffled(topics);
    }

    function randomTopics() {
        const topics = [];
        const usedOnce = new Set();

        while (topics.length < CELL_COUNT) {
            const candidates = ALL_TOPICS.filter(topic =>
                !["narrative", "structure"].includes(topic.group_id) ||
                !usedOnce.has(topic.topic_id)
            );
            const next = randomArrayItem(candidates);
            topics.push(next);

            if (["narrative", "structure"].includes(next.group_id)) {
                usedOnce.add(next.topic_id);
            }
        }
        return shuffled(topics);
    }

    function customTopics(selections) {
        if (!Array.isArray(selections) || selections.length === 0) {
            throw new Error("請先勾選至少一種構思項目。");
        }
        if (selections.length > CELL_COUNT) {
            throw new Error(`一張牌只有${CELL_COUNT}格，最多能勾選${CELL_COUNT}種不同題目。`);
        }

        const seen = new Set();
        const result = [];
        const automatic = [];

        for (const selection of selections) {
            const topic = TOPIC_BY_ID.get(selection.topic_id);
            if (!topic || seen.has(selection.topic_id)) {
                throw new Error("自訂題目有重複或不在36種題庫內。");
            }
            seen.add(selection.topic_id);

            if (selection.count === null || selection.count === "" || selection.count === undefined) {
                result.push(topic);
                automatic.push(topic);
            } else {
                const count = Number(selection.count);
                if (!Number.isInteger(count) || count < 1 || count > CELL_COUNT) {
                    throw new Error(`「${topic.label}」的出現次數必須是1～${CELL_COUNT}的整數。`);
                }
                for (let i = 0; i < count; i += 1) {
                    result.push(topic);
                }
            }
        }

        if (result.length > CELL_COUNT) {
            throw new Error(`目前已指定${result.length}格，超過${CELL_COUNT}格。`);
        }
        if (result.length < CELL_COUNT && automatic.length === 0) {
            throw new Error(`目前只有${result.length}格；請把次數加到${CELL_COUNT}，或留一些題目次數空白交給系統補齊。`);
        }
        while (result.length < CELL_COUNT) {
            result.push(randomArrayItem(automatic));
        }
        return shuffled(result);
    }

    function generateTopicInstances(mode, selections = []) {
        if (mode === "fixed") return fixedTopics();
        if (mode === "random") return randomTopics();
        if (mode === "custom") return customTopics(selections);
        throw new Error("未知的賓果牌類型。");
    }

    async function storeSelections() {
        const record = {
            id: "app",
            schemaVersion: STORAGE_SCHEMA_VERSION,
            activeNovelUid: state.activeNovelUid,
            activeBoardUid: state.activeBoardUid
        };
        await state.collections.settings.upsert(record);
    }

    function restoreSelection() {
        const novelExists = state.novels.some(novel => novel.novel_uid === state.activeNovelUid);
        if (!novelExists) {
            state.activeNovelUid = state.novels[0]?.novel_uid || null;
        }

        const boardExists = state.boards.some(board =>
            board.board_uid === state.activeBoardUid &&
            board.novel_uid === state.activeNovelUid
        );
        if (!boardExists) {
            state.activeBoardUid = listBoardsForNovel(state.activeNovelUid)[0]?.board_uid || null;
        }
    }

    async function initialize() {
        if (state.initialized) return currentSnapshot();
        requireWarehouse();

        state.store = global.FictionStorage.create({ namespace: STORAGE_NAMESPACE });
        state.collections = {
            novels: state.store.collection("novels", { idField: "novel_uid" }),
            boards: state.store.collection("boards", { idField: "board_uid" }),
            cells: state.store.collection("cells", { idField: "cell_uid" }),
            settings: state.store.collection("settings", { idField: "id" })
        };

        // 舊測試版資料不相容，也不做遷移。只在首次進入 v1.2 時清空本專案資料。
        // schemaVersion 存在同一個 FictionStorage 命名空間，後續重開不會再清除新資料。
        let settings = await state.collections.settings.get("app");
        if (settings?.schemaVersion !== STORAGE_SCHEMA_VERSION) {
            await state.store.clearAll();
            settings = await state.collections.settings.add({
                id: "app",
                schemaVersion: STORAGE_SCHEMA_VERSION,
                activeNovelUid: null,
                activeBoardUid: null
            });
        }

        const [novels, boards, cells] = await Promise.all([
            state.collections.novels.all(),
            state.collections.boards.all(),
            state.collections.cells.all()
        ]);

        state.novels = novels;
        state.boards = boards;
        state.cells = cells;
        state.activeNovelUid = settings?.activeNovelUid || null;
        state.activeBoardUid = settings?.activeBoardUid || null;
        restoreSelection();
        state.initialized = true;
        emit("initialized");
        return currentSnapshot();
    }

    function ready() {
        if (!state.initialized) {
            throw new Error("構思賓果尚未完成初始化。");
        }
    }

    async function createNovel(name) {
        ready();
        // 作品名稱可留白；作者日後仍可使用重新命名功能修改。
        const title = normalizeName(name, defaultNovelName());

        const ids = new Set(state.novels.map(novel => novel.novel_uid));
        const novel = {
            novel_uid: createUniqueUid("novel-", ids),
            name: title
        };
        const stored = await state.collections.novels.add(novel);
        state.novels.push(stored);
        state.activeNovelUid = stored.novel_uid;
        state.activeBoardUid = null;
        await storeSelections();
        emit("novel-created");
        return stored;
    }

    async function renameNovel(uid, name) {
        ready();
        const title = normalizeName(name);
        if (!title) throw new Error("小說名稱不能留白。");
        const record = await state.collections.novels.update(uid, { name: title });
        state.novels = state.novels.map(novel => novel.novel_uid === uid ? record : novel);
        emit("novel-renamed");
    }

    async function deleteNovel(uid) {
        ready();
        const novel = state.novels.find(item => item.novel_uid === uid);
        if (!novel) throw new Error("找不到要刪除的小說。");
        const boards = state.boards.filter(board => board.novel_uid === uid);

        for (const board of boards) {
            for (const cell of state.cells.filter(item => item.board_uid === board.board_uid)) {
                await state.collections.cells.remove(cell.cell_uid);
            }
            await state.collections.boards.remove(board.board_uid);
        }
        await state.collections.novels.remove(uid);

        state.cells = state.cells.filter(cell => !boards.some(board => board.board_uid === cell.board_uid));
        state.boards = state.boards.filter(board => board.novel_uid !== uid);
        state.novels = state.novels.filter(item => item.novel_uid !== uid);
        restoreSelection();
        await storeSelections();
        emit("novel-deleted");
    }

    async function setActiveNovel(uid) {
        ready();
        if (!state.novels.some(novel => novel.novel_uid === uid)) {
            throw new Error("找不到這部小說。");
        }
        state.activeNovelUid = uid;
        state.activeBoardUid = listBoardsForNovel(uid)[0]?.board_uid || null;
        await storeSelections();
        emit("selection-changed");
    }

    function defaultBoardName(mode, excludeBoardUid = null) {
        const names = { fixed: "固定賓果", random: "隨機賓果", custom: "自訂賓果" };
        const title = names[mode] || "構思賓果";
        const existingNames = new Set(
            listBoardsForNovel(state.activeNovelUid)
                .filter(board => board.board_uid !== excludeBoardUid)
                .map(board => board.name)
        );

        let count = 1;
        while (existingNames.has(`${title} ${count}`)) {
            count += 1;
        }
        return `${title} ${count}`;
    }

    async function createBoard({ name, mode, selections = [] } = {}) {
        ready();
        const topicInstances = generateTopicInstances(mode, selections);
        if (topicInstances.length !== CELL_COUNT) throw new Error(`賓果牌沒有產生完整${CELL_COUNT}格。`);

        // 不需預先輸入作品名稱；第一次直接建牌時，自動建立日期命名的小說。
        if (!findCurrentNovel()) {
            await createNovel("");
        }

        const boardIds = new Set(state.boards.map(board => board.board_uid));
        const cellIds = new Set(state.cells.map(cell => cell.cell_uid));
        const boardUid = createUniqueUid("board-", boardIds);
        const cellRecords = topicInstances.map(topic => ({
            cell_uid: createUniqueUid("cell-", cellIds),
            board_uid: boardUid,
            topic_id: topic.topic_id,
            completed: false,
            content: ""
        }));
        const board = {
            board_uid: boardUid,
            novel_uid: state.activeNovelUid,
            name: normalizeName(name, defaultBoardName(mode)),
            mode,
            size: BOARD_SIZE,
            cell_uids: cellRecords.map(cell => cell.cell_uid)
        };

        // 新增資料先落盤，成功後才切換畫面。失敗時嘗試清理本次新增內容。
        let boardSaved = false;
        const savedCellIds = [];
        try {
            await state.collections.boards.add(board);
            boardSaved = true;
            for (const cell of cellRecords) {
                await state.collections.cells.add(cell);
                savedCellIds.push(cell.cell_uid);
            }
        } catch (error) {
            for (const uid of savedCellIds) {
                try { await state.collections.cells.remove(uid); } catch (cleanupError) { console.error(cleanupError); }
            }
            if (boardSaved) {
                try { await state.collections.boards.remove(boardUid); } catch (cleanupError) { console.error(cleanupError); }
            }
            throw new Error(`建立賓果牌失敗，已嘗試復原：${error.message}`);
        }

        state.boards.push(board);
        state.cells.push(...cellRecords);
        state.activeBoardUid = boardUid;
        await storeSelections();
        emit("board-created");
        return board;
    }

    async function renameBoard(uid, name) {
        ready();
        const board = state.boards.find(item => item.board_uid === uid);
        if (!board) throw new Error("找不到要重新命名的賓果牌。");
        // 建牌及改名均可留白；由系統產生名稱，UID 不變。
        const title = normalizeName(name, defaultBoardName(board.mode, uid));
        const record = await state.collections.boards.update(uid, { name: title });
        state.boards = state.boards.map(board => board.board_uid === uid ? record : board);
        emit("board-renamed");
    }

    async function deleteBoard(uid) {
        ready();
        const board = state.boards.find(item => item.board_uid === uid);
        if (!board) throw new Error("找不到要刪除的賓果牌。");
        const cells = state.cells.filter(cell => cell.board_uid === uid);

        for (const cell of cells) {
            await state.collections.cells.remove(cell.cell_uid);
        }
        await state.collections.boards.remove(uid);

        state.cells = state.cells.filter(cell => cell.board_uid !== uid);
        state.boards = state.boards.filter(item => item.board_uid !== uid);
        restoreSelection();
        await storeSelections();
        emit("board-deleted");
    }

    async function setActiveBoard(uid) {
        ready();
        if (!listBoardsForNovel(state.activeNovelUid).some(board => board.board_uid === uid)) {
            throw new Error("這張賓果牌不屬於目前小說。");
        }
        state.activeBoardUid = uid;
        await storeSelections();
        emit("selection-changed");
    }

    async function toggleCell(uid) {
        ready();
        const board = findCurrentBoard();
        if (!board || !board.cell_uids.includes(uid)) throw new Error("找不到這個賓果格子。");
        const oldCells = resolveCells(board);
        const oldLines = getCompletedLines(oldCells);
        const original = state.cells.find(cell => cell.cell_uid === uid);
        const updated = await state.collections.cells.update(uid, { completed: !original.completed });
        state.cells = state.cells.map(cell => cell.cell_uid === uid ? updated : cell);
        const newLines = getCompletedLines(resolveCells(board));
        const newlyCompletedLines = newLines.filter(line => !oldLines.some(old =>
            old.type === line.type && old.index === line.index
        ));
        emit("cell-changed", { newlyCompletedLines });
        return { newlyCompletedLines, completed: updated.completed };
    }

    async function shuffleBoard() {
        ready();
        const board = findCurrentBoard();
        if (!board) throw new Error("請先選擇賓果牌。");
        let next = shuffled(board.cell_uids);
        if (next.every((id, index) => id === board.cell_uids[index])) {
            next = shuffled(board.cell_uids);
        }
        const stored = await state.collections.boards.update(board.board_uid, { cell_uids: next });
        state.boards = state.boards.map(item => item.board_uid === board.board_uid ? stored : item);
        emit("board-shuffled");
    }

    function sizeForLines() {
        return BOARD_SIZE * 2 + 2;
    }

    function modeLabel(mode) {
        return { fixed: "固定牌", random: "隨機牌", custom: "自訂牌" }[mode] || "賓果牌";
    }

    function roundedRectangle(context, x, y, w, h, radius) {
        context.beginPath();
        context.roundRect(x, y, w, h, radius);
    }

    async function buildCurrentBoardExportCanvas() {
        ready();
        const { novel, board, cells, completed, total, lines } = currentSnapshot();
        if (!novel || !board || cells.length !== total) {
            throw new Error("請先選擇一張完整的賓果牌。");
        }
        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("目前瀏覽器無法建立展示卡 Canvas。");
        canvas.width = 1500;
        canvas.height = 1880;

        const width = canvas.width;
        const height = canvas.height;
        context.fillStyle = "#eeeae5";
        context.fillRect(0, 0, width, height);

        context.fillStyle = "#19242c";
        context.fillRect(0, 0, width, 345);
        context.fillStyle = "rgba(255,255,255,.045)";
        for (let i = 0; i < 9; i += 1) {
            context.beginPath();
            context.arc(106 + i * 173, 80 + (i % 3) * 67, 3 + (i % 3), 0, Math.PI * 2);
            context.fill();
        }

        context.fillStyle = "#cfcbc2";
        context.font = '400 32px "Noto Sans TC", sans-serif';
        context.fillText(novel.name.slice(0, 36), 124, 158);

        roundedRectangle(context, 113, 376, 1274, 1443, 30);
        context.fillStyle = "#fffefa";
        context.fill();

        context.fillStyle = "#2c343a";
        context.font = '700 40px "Noto Sans TC", sans-serif';
        context.fillText(board.name.slice(0, 38), 143, 443);
        context.fillStyle = "#7b807e";
        context.font = "500 27px system-ui, sans-serif";
        context.fillText(`${modeLabel(board.mode)}  ·  ${completed}/${total} 完成  ·  ${lines.length}/${sizeForLines()} 連線`, 143, 493);

        const size = BOARD_SIZE;
        const cellWidth = 302;
        const cellHeight = 254;
        const gap = 14;
        const originX = 125;
        const originY = 560;
        const groupColor = {
            foundation: "#665968",
            world: "#48666b",
            character: "#79604c",
            plot: "#765d64",
            narrative: "#586b57",
            structure: "#686773"
        };

        cells.forEach((cell, index) => {
            const topic = TOPIC_BY_ID.get(cell.topic_id);
            const row = Math.floor(index / size);
            const col = index % size;
            const x = originX + col * (cellWidth + gap);
            const y = originY + row * (cellHeight + gap);

            roundedRectangle(context, x, y, cellWidth, cellHeight, 20);
            context.fillStyle = cell.completed ? "#263d3b" : "#f4f3f0";
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = cell.completed ? "#416760" : "#dfded9";
            context.stroke();

            context.fillStyle = cell.completed ? "#b8d4cb" : (groupColor[topic?.group_id] || "#747474");
            context.font = '500 22px "Noto Sans TC", sans-serif';
            const groupLabel = TOPIC_GROUPS.find(group => group.id === topic?.group_id)?.shortLabel || "構思";
            context.fillText(groupLabel, x + 20, y + 34);

            context.fillStyle = cell.completed ? "#f7fff9" : "#202d31";
            context.font = '700 39px "Noto Sans TC", "Microsoft JhengHei", sans-serif';
            const textLines = global.SlowlyCanvasWrappedText.buildLines(context, topic?.label || "未知題目", cellWidth - 34, 3);
            const lineHeight = 47;
            const top = y + cellHeight * .55 - (textLines.length - 1) * lineHeight / 2;
            textLines.forEach((line, lineIndex) => {
                const textWidth = context.measureText(line).width;
                context.fillText(line, x + (cellWidth - textWidth) / 2, top + lineIndex * lineHeight);
            });

            if (cell.completed) {
                context.beginPath();
                context.arc(x + cellWidth - 26, y + 26, 13, 0, Math.PI * 2);
                context.fillStyle = "#bfdad0";
                context.fill();
                context.lineWidth = 3;
                context.strokeStyle = "#26423f";
                context.beginPath();
                context.moveTo(x + cellWidth - 32, y + 26);
                context.lineTo(x + cellWidth - 27, y + 31);
                context.lineTo(x + cellWidth - 19, y + 21);
                context.stroke();
            }
        });

        context.strokeStyle = "rgba(218, 168, 82, .88)";
        context.lineWidth = 9;
        context.lineCap = "round";
        const center = index => ({
            x: originX + (index % size) * (cellWidth + gap) + cellWidth / 2,
            y: originY + Math.floor(index / size) * (cellHeight + gap) + cellHeight / 2
        });
        lines.forEach(line => {
            const first = center(line.positions[0]);
            const last = center(line.positions[line.positions.length - 1]);
            context.beginPath();
            context.moveTo(first.x, first.y);
            context.lineTo(last.x, last.y);
            context.stroke();
        });

        context.fillStyle = "#66706c";
        context.font = '400 24px "Noto Sans TC", sans-serif';
        context.textAlign = "right";
        context.fillText("慢 慢 | Stillness by Slowly", 1350, 1770);
        context.textAlign = "left";

        const filename = `${normalizeName(novel.name, "小說")}_${normalizeName(board.name, "構思賓果")}.png`;
        return { canvas, filename };
    }

    async function prepareCurrentBoardExport() {
        const { canvas, filename } = await buildCurrentBoardExportCanvas();
        const blob = await global.SlowlyCanvasPNG.toBlob(canvas);
        const objectUrl = URL.createObjectURL(blob);
        return { canvas, blob, filename, objectUrl };
    }

    async function downloadPreparedExport(prepared) {
        if (!prepared?.blob || !prepared?.filename) {
            throw new Error("找不到可下載的 PNG 資料。");
        }
        return global.SlowlyPNGDownload.fromBlob(prepared.blob, prepared.filename);
    }

    async function exportCurrentBoardPng() {
        const prepared = await prepareCurrentBoardExport();
        try {
            return await downloadPreparedExport(prepared);
        } finally {
            if (prepared.objectUrl) URL.revokeObjectURL(prepared.objectUrl);
        }
    }

    global.StoryBingo = Object.freeze({
        version: VERSION,
        storageNamespace: STORAGE_NAMESPACE,
        groups: TOPIC_GROUPS,
        topics: ALL_TOPICS,
        topicById(topicId) { return TOPIC_BY_ID.get(topicId) || null; },
        subscribe(listener) {
            if (typeof listener !== "function") throw new TypeError("listener 必須是函式。");
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        initialize,
        snapshot: currentSnapshot,
        getCompletedLines,
        generateTopicInstances,
        defaultNovelName,
        defaultBoardName,
        createNovel,
        renameNovel,
        deleteNovel,
        setActiveNovel,
        defaultBoardName,
        createBoard,
        renameBoard,
        deleteBoard,
        setActiveBoard,
        toggleCell,
        shuffleBoard,
        prepareCurrentBoardExport,
        downloadPreparedExport,
        exportCurrentBoardPng,
        modeLabel
    });
})(window);
