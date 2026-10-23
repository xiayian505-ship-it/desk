/*
 * 構思賓果｜介面互動 v2.7.0
 * 畫面繪製、視窗、操作事件與訊息回饋。遊戲資料與規則由 bingo.js 管理。
 * 共用視窗／Toast／效果直接使用慢慢軍火庫，不複製共用函式碼。
 */
(function (global) {
    "use strict";

    const core = global.StoryBingo;
    const $ = id => document.getElementById(id);
    const controlIds = [
        "novelSelect", "boardSelect", "createNovel", "renameNovel", "deleteNovel",
        "createBoard", "renameBoard", "deleteBoard", "shuffleBoard", "exportCard",
        "anotherBoard", "emptyAction"
    ];

    const ui = {
        busy: false,
        toast: null,
        burst: null,
        nameOperation: null,
        exportPreview: null,
        initialized: false,
        selects: []
    };

    function showError(error) {
        const text = error instanceof Error ? error.message : String(error);
        console.error("[構思賓果]", error);
        $("errorBanner").textContent = text;
        $("errorBanner").hidden = false;
    }

    function clearError() {
        $("errorBanner").textContent = "";
        $("errorBanner").hidden = true;
    }

    function tell(message) {
        if (!ui.toast && global.SlowlyToast) {
            ui.toast = global.SlowlyToast.create($("toastMessage"), { duration: 2500 });
        }
        ui.toast?.show(message);
    }

    function setBusy(value) {
        ui.busy = Boolean(value);
        for (const id of controlIds) {
            const control = $(id);
            if (control) control.disabled = ui.busy || control.dataset.unavailable === "true";
        }
        $("nameSubmit").disabled = ui.busy;
        $("boardSubmit").disabled = ui.busy;
        $("bingoGrid").querySelectorAll("button").forEach(button => {
            button.disabled = ui.busy;
        });
        document.querySelectorAll(".completion-style-choice").forEach(button => {
            button.disabled = ui.busy;
        });
        ui.selects.forEach(select => select.sync());
    }

    async function perform(action, successMessage = "") {
        if (ui.busy) return false;
        clearError();
        setBusy(true);
        try {
            await action();
            if (successMessage) tell(successMessage);
            return true;
        } catch (error) {
            showError(error);
            return false;
        } finally {
            setBusy(false);
        }
    }

    function setUnavailable(element, unavailable) {
        element.dataset.unavailable = unavailable ? "true" : "false";
        element.disabled = unavailable || ui.busy;
    }

    function updateSelect(element, items, activeUid, uidKey, emptyLabel) {
        const fragment = document.createDocumentFragment();
        if (!items.length) {
            const option = document.createElement("option");
            option.textContent = emptyLabel;
            option.value = "";
            fragment.append(option);
        } else {
            for (const item of items) {
                const option = document.createElement("option");
                option.value = item[uidKey];
                option.textContent = item.name;
                fragment.append(option);
            }
        }
        element.replaceChildren(fragment);
        if (activeUid) element.value = activeUid;
        setUnavailable(element, items.length === 0);
        ui.selects.forEach(select => {
            if (select.select === element) select.sync();
        });
    }

    function createTextElement(tag, className, text) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        return element;
    }

    function drawGrid(snapshot) {
        const grid = $("bingoGrid");
        const winningPositions = new Set(snapshot.lines.flatMap(line => line.positions));
        const fragment = document.createDocumentFragment();

        snapshot.cells.forEach((cell, position) => {
            const topic = core.topicById(cell.topic_id);
            const group = core.displayGroups.find(item => item.id === topic?.group_id);
            const button = document.createElement("button");
            button.type = "button";
            button.className = "bingo-cell";
            button.dataset.cellUid = cell.cell_uid;
            button.dataset.group = topic?.group_id || "unknown";
            button.setAttribute("aria-pressed", String(cell.completed === true));
            button.setAttribute("aria-label", `${topic?.label || "未知題目"}，${cell.completed ? "已完成，點擊取消" : "未完成，點擊標記"}`);
            button.title = `${group?.label || "構思項目"}｜${topic?.label || "未知題目"}`;
            button.disabled = ui.busy;

            if (winningPositions.has(position)) {
                button.classList.add("is-winning");
            }

            // 電光使用獨立子層的 ::before / ::after，避免與格子的分類色條、
            // 以及 BINGO 完成連線標記共用偽元素而互相覆蓋。
            if (snapshot.completionStyle === "electric" && cell.completed) {
                const electricLayer = document.createElement("span");
                electricLayer.className = "cell-electric-frame slowly-electric-border with-glow is-active";
                electricLayer.setAttribute("aria-hidden", "true");
                button.append(electricLayer);
            }
            button.append(
                createTextElement("span", "cell-category", group?.shortLabel || "構思"),
                createTextElement("span", "cell-topic", topic?.label || "未知題目"),
                createTextElement("span", "cell-check", "")
            );
            fragment.append(button);
        });
        grid.replaceChildren(fragment);
    }

    function render() {
        if (!ui.initialized) return;
        const snapshot = core.snapshot();
        updateSelect($("novelSelect"), snapshot.novels, snapshot.novel?.novel_uid, "novel_uid", "尚未建立小說");
        updateSelect($("boardSelect"), snapshot.boards, snapshot.board?.board_uid, "board_uid", "尚未建立賓果");

        setUnavailable($("createNovel"), false);
        setUnavailable($("renameNovel"), !snapshot.novel);
        setUnavailable($("deleteNovel"), !snapshot.novel);
        setUnavailable($("createBoard"), false);
        setUnavailable($("renameBoard"), !snapshot.board);
        setUnavailable($("deleteBoard"), !snapshot.board);

        const hasPlayableBoard = Boolean(snapshot.board && snapshot.cells.length === snapshot.total);
        $("workspace").hidden = !hasPlayableBoard;
        $("emptyState").hidden = hasPlayableBoard;

        setUnavailable($("shuffleBoard"), !hasPlayableBoard);
        setUnavailable($("exportCard"), !hasPlayableBoard);
        const recordLink = $("recordPageLink");
        recordLink.hidden = !hasPlayableBoard;
        if (hasPlayableBoard) {
            const params = new URLSearchParams({
                novel_uid: snapshot.novel.novel_uid,
                board_uid: snapshot.board.board_uid
            });
            recordLink.href = `./record/?${params}`;
        }
        setUnavailable($("anotherBoard"), false);

        $("emptyAction").textContent = "新增賓果";

        if (!hasPlayableBoard) return;
        $("boardTitle").textContent = snapshot.board.name;
        $("lineCount").textContent = String(snapshot.lines.length);
        $("progressLabel").textContent = `${snapshot.completed} / ${snapshot.total}`;
        $("bingoGrid").dataset.completionStyle = snapshot.completionStyle;
        for (const button of document.querySelectorAll(".completion-style-choice")) {
            const selected = button.dataset.completionStyle === snapshot.completionStyle;
            button.setAttribute("aria-pressed", String(selected));
            button.classList.toggle("is-active", selected);
        }
        $("bingoGrid").style.setProperty("--board-size", "4");
        $("bingoGrid").setAttribute("aria-label", "4乘4構思賓果");
        $("lineCount").nextElementSibling.textContent = `／${Math.sqrt(snapshot.total) * 2 + 2} BINGO`;
        $("progressPercent").textContent = `${snapshot.percent}%`;
        $("progressFill").style.width = `${snapshot.percent}%`;
        drawGrid(snapshot);
    }

    function openNameDialog(operation, title, label, initialValue = "") {
        ui.nameOperation = operation;
        $("nameDialogTitle").textContent = title;
        $("nameLabel").textContent = label;
        $("nameInput").value = initialValue;
        $("nameDialog").showModal();
        $("nameInput").focus();
        $("nameInput").select();
    }

    function closeNameDialog() {
        if ($("nameDialog").open) $("nameDialog").close();
    }

    function buildCustomOptions() {
        const fragment = document.createDocumentFragment();
        for (const group of core.groups) {
            const details = document.createElement("details");
            details.className = "custom-topic-group";
            details.open = group.id === "character";
            details.append(createTextElement("summary", "", group.label));

            const list = createTextElement("div", "custom-topic-list", "");
            for (const topic of group.topics) {
                const row = document.createElement("div");
                row.className = "custom-topic-row";
                row.dataset.topicId = topic.topic_id;

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "topic-check";
                checkbox.dataset.topicCheck = topic.topic_id;
                checkbox.setAttribute("aria-label", `選擇${topic.label}`);

                const name = createTextElement("span", "topic-label", topic.label);
                const quantity = document.createElement("input");
                quantity.className = "topic-quantity";
                quantity.type = "number";
                quantity.inputMode = "numeric";
                quantity.min = "1";
                quantity.max = "16";
                quantity.step = "1";
                quantity.placeholder = "自動";
                quantity.disabled = true;
                quantity.dataset.topicQuantity = topic.topic_id;
                quantity.setAttribute("aria-label", `${topic.label}出現次數；留白由系統分配`);

                row.append(checkbox, name, quantity);
                list.append(row);
            }
            details.append(list);
            fragment.append(details);
        }
        $("customTopicGroups").replaceChildren(fragment);
    }

    function currentBoardMode() {
        return $("boardForm").querySelector('input[name="boardMode"]:checked')?.value || "fixed";
    }

    function updateModeView() {
        const mode = currentBoardMode();
        $("customEditor").hidden = mode !== "custom";
        updateCustomCounter();
    }

    function collectCustomSelections() {
        return Array.from($("customTopicGroups").querySelectorAll(".custom-topic-row"))
            .filter(row => row.querySelector(".topic-check").checked)
            .map(row => ({
                topic_id: row.dataset.topicId,
                count: row.querySelector(".topic-quantity").value.trim() || null
            }));
    }

    function updateCustomCounter() {
        const selected = collectCustomSelections();
        const reserved = selected.reduce((sum, item) => sum + (item.count === null ? 1 : (Number(item.count) || 0)), 0);
        const automatic = selected.filter(item => item.count === null).length;
        const counter = $("customCounter");

        if (!selected.length) {
            counter.textContent = "尚未選擇";
        } else {
            counter.textContent = `${selected.length} 種 · ${reserved}/16${automatic ? " ＋自動" : ""}`;
        }
        counter.style.color = (reserved > 16 || selected.length > 16) ? "#aa4e48" : "";
    }


    function cleanupExportPreview() {
        if (ui.exportPreview?.objectUrl) {
            URL.revokeObjectURL(ui.exportPreview.objectUrl);
        }
        ui.exportPreview = null;
        $("previewImage").removeAttribute("src");
    }

    function openPreviewDialog(prepared) {
        cleanupExportPreview();
        ui.exportPreview = prepared;
        $("previewImage").src = prepared.objectUrl;
        $("previewDialog").showModal();
    }

    function closePreviewDialog() {
        if ($("previewDialog").open) {
            $("previewDialog").close();
        }
        cleanupExportPreview();
    }

    function openBoardDialog() {
        $("boardForm").reset();
        $("newBoardName").value = "";
        $("customTopicGroups").querySelectorAll(".topic-quantity").forEach(input => {
            input.disabled = true;
            input.value = "";
        });
        updateModeView();
        $("boardDialog").showModal();
    }

    function closeBoardDialog() {
        if ($("boardDialog").open) $("boardDialog").close();
    }

    async function confirmDelete(title, message) {
        if (!global.SlowlyConfirm) {
            throw new Error("軍火庫 SlowlyConfirm 未成功載入，為避免誤刪已取消操作。");
        }
        return global.SlowlyConfirm.show({
            title,
            message,
            confirmText: "確認刪除",
            cancelText: "取消",
            initialFocus: "cancel"
        });
    }

    function highlightBingo(newLines) {
        if (!newLines.length) return;
        tell(`BINGO ×${newLines.length} ✦`);
        if (!global.SlowlyAreaBurst) return;

        const stage = $("boardStage");
        const cells = Array.from($("bingoGrid").querySelectorAll(".bingo-cell"));
        const indexes = new Set(newLines.flatMap(line => line.positions));
        const targets = [...indexes].map(index => cells[index]).filter(Boolean);
        if (!targets.length) return;

        if (!ui.burst) {
            ui.burst = global.SlowlyAreaBurst.create(stage, { duration: 360 });
        }
        ui.burst.play({ targets, type: "block", fill: "rgba(222, 184, 117, .18)", border: "rgba(218, 166, 77, .4)" })
            .catch(error => console.warn("[構思賓果] 特效略過", error));
    }

    function registerEvents() {
        $("createNovel").addEventListener("click", () => openNameDialog("novel-create", "新增小說", "小說名稱（選填）"));
        $("renameNovel").addEventListener("click", () => {
            const novel = core.snapshot().novel;
            if (novel) openNameDialog("novel-rename", "重新命名小說", "小說名稱", novel.name);
        });
        $("deleteNovel").addEventListener("click", async () => {
            const snapshot = core.snapshot();
            if (!snapshot.novel) return;
            const agreed = await confirmDelete("刪除整部小說？", `「${snapshot.novel.name}」及所有賓果資料將刪除，無法復原。`);
            if (agreed) await perform(() => core.deleteNovel(snapshot.novel.novel_uid), "小說已刪除");
        });
        $("novelSelect").addEventListener("change", event => perform(() => core.setActiveNovel(event.target.value)));

        $("createBoard").addEventListener("click", openBoardDialog);
        $("anotherBoard").addEventListener("click", openBoardDialog);
        $("renameBoard").addEventListener("click", () => {
            const board = core.snapshot().board;
            if (board) openNameDialog("board-rename", "重新命名賓果", "賓果名稱（選填）", board.name);
        });
        $("deleteBoard").addEventListener("click", async () => {
            const board = core.snapshot().board;
            if (!board) return;
            const agreed = await confirmDelete("刪除這個賓果？", `「${board.name}」將刪除，無法復原。`);
            if (agreed) await perform(() => core.deleteBoard(board.board_uid), "賓果已刪除");
        });
        $("boardSelect").addEventListener("change", event => perform(() => core.setActiveBoard(event.target.value)));

        $("emptyAction").addEventListener("click", openBoardDialog);

        $("nameForm").addEventListener("submit", async event => {
            event.preventDefault();
            const name = $("nameInput").value.trim();
            const { novel, board } = core.snapshot();
            const operation = ui.nameOperation;
            const successful = await perform(async () => {
                if (operation === "novel-create") await core.createNovel(name);
                else if (operation === "novel-rename") await core.renameNovel(novel.novel_uid, name);
                else if (operation === "board-rename") await core.renameBoard(board.board_uid, name);
            }, "名稱已儲存");
            if (successful) closeNameDialog();
        });
        $("nameCancel").addEventListener("click", closeNameDialog);
        $("nameCancelIcon").addEventListener("click", closeNameDialog);

        $("boardForm").querySelectorAll('input[name="boardMode"]').forEach(input => {
            input.addEventListener("change", updateModeView);
        });
        $("customTopicGroups").addEventListener("change", event => {
            if (event.target.matches(".topic-check")) {
                const row = event.target.closest(".custom-topic-row");
                const quantity = row.querySelector(".topic-quantity");
                quantity.disabled = !event.target.checked;
                if (!event.target.checked) quantity.value = "";
            }
            updateCustomCounter();
        });
        $("customTopicGroups").addEventListener("input", updateCustomCounter);

        $("boardForm").addEventListener("submit", async event => {
            event.preventDefault();
            const mode = currentBoardMode();
            const settings = {
                name: $("newBoardName").value,
                mode,
                selections: mode === "custom" ? collectCustomSelections() : []
            };
            const successful = await perform(() => core.createBoard(settings), "新的構思賓果已建立！");
            if (successful) closeBoardDialog();
        });
        $("boardCancel").addEventListener("click", closeBoardDialog);
        $("boardCancelIcon").addEventListener("click", closeBoardDialog);

        $("bingoGrid").addEventListener("click", event => {
            const target = event.target.closest("button[data-cell-uid]");
            if (!target || ui.busy) return;
            perform(() => core.toggleCell(target.dataset.cellUid));
        });
        document.querySelectorAll(".completion-style-choice").forEach(button => {
            button.addEventListener("click", () => {
                perform(() => core.setCompletionStyle(button.dataset.completionStyle));
            });
        });
        $("shuffleBoard").addEventListener("click", () => perform(() => core.shuffleBoard(), "已重新排列"));
        $("exportCard").addEventListener("click", () => perform(async () => {
            const prepared = await core.prepareCurrentBoardExport();
            openPreviewDialog(prepared);
        }, "PNG 預覽已生成"));
        $("previewCancel").addEventListener("click", closePreviewDialog);
        $("previewCloseIcon").addEventListener("click", closePreviewDialog);
        $("previewDialog").addEventListener("close", cleanupExportPreview);
        $("previewDownload").addEventListener("click", async () => {
            const successful = await perform(() => core.downloadPreparedExport(ui.exportPreview), "展示卡 PNG 已輸出");
            if (successful) closePreviewDialog();
        });
    }

    async function initializeUi() {
        try {
            if (!core) throw new Error("構思賓果功能核心未載入。");
            buildCustomOptions();
            registerEvents();
            core.subscribe(event => {
                render();
                if (event.type === "cell-changed" && event.newlyCompletedLines?.length) {
                    highlightBingo(event.newlyCompletedLines);
                }
            });
            await core.initialize();
            if (!global.SlowlySelect) {
                throw new Error("慢慢軍火庫 SlowlySelect 未載入。");
            }
            ui.selects = ["novelSelect", "boardSelect"]
                .map(id => global.SlowlySelect.create($(id)))
                .filter(Boolean);
            ui.initialized = true;
            render();
        } catch (error) {
            showError(error);
            $("emptyAction").disabled = true;
        }
    }

    initializeUi();
})(window);
