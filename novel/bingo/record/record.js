/* 構思紀錄｜功能核心 v2.0.0
 * 直接沿用賓果的 UID、題庫與 FictionStorage 實例。
 * 本檔只管理「目前選哪個格子」，不重新實作儲存引擎。
 */
(function (global) {
    "use strict";

    const bingo = global.StoryBingo;
    let selectedCellUid = null;
    let draftCollection = null;

    function snapshot() {
        return bingo.snapshot();
    }

    function selectedCell() {
        return snapshot().cells.find(cell => cell.cell_uid === selectedCellUid) || null;
    }

    function chooseFirstCell() {
        selectedCellUid = snapshot().cells[0]?.cell_uid || null;
    }

    async function initialize() {
        if (!bingo) throw new Error("構思賓果功能核心未載入。");
        await bingo.initialize();
        const draftStore = global.FictionStorage.create({ namespace: bingo.storageNamespace });
        draftCollection = draftStore.collection("record_drafts", { idField: "cell_uid" });

        const params = new URLSearchParams(global.location.search);
        const novelUid = params.get("novel_uid");
        const boardUid = params.get("board_uid");
        const cellUid = params.get("cell_uid");

        if (novelUid && snapshot().novels.some(item => item.novel_uid === novelUid)) {
            if (snapshot().novel?.novel_uid !== novelUid) {
                await bingo.setActiveNovel(novelUid);
            }
        }
        if (boardUid && snapshot().boards.some(item => item.board_uid === boardUid)) {
            if (snapshot().board?.board_uid !== boardUid) {
                await bingo.setActiveBoard(boardUid);
            }
        }
        selectedCellUid = snapshot().cells.some(cell => cell.cell_uid === cellUid)
            ? cellUid
            : (snapshot().cells[0]?.cell_uid || null);
        return snapshot();
    }

    async function chooseNovel(uid) {
        await bingo.setActiveNovel(uid);
        chooseFirstCell();
        return snapshot();
    }

    async function chooseBoard(uid) {
        await bingo.setActiveBoard(uid);
        chooseFirstCell();
        return snapshot();
    }

    function chooseCell(uid) {
        if (!snapshot().cells.some(cell => cell.cell_uid === uid)) {
            throw new Error("找不到選取的構思格子。");
        }
        selectedCellUid = uid;
        return selectedCell();
    }

    async function saveContent(uid, content) {
        return bingo.updateCellContent(uid, content);
    }

    async function readDraft(uid) {
        return draftCollection.get(uid);
    }

    async function saveDraft(uid, content) {
        const cell = snapshot().cells.find(item => item.cell_uid === uid);
        if (!cell) throw new Error("找不到要暫存的格子。");
        return draftCollection.upsert({
            cell_uid: uid,
            content: String(content),
            updated_at: new Date().toISOString()
        });
    }

    async function discardDraft(uid) {
        const existing = await draftCollection.get(uid);
        if (existing) await draftCollection.remove(uid);
    }

    global.StoryBingoRecord = Object.freeze({
        initialize,
        snapshot,
        selectedCell,
        selectedCellUid() { return selectedCellUid; },
        chooseNovel,
        chooseBoard,
        chooseCell,
        saveContent,
        readDraft,
        saveDraft,
        discardDraft,
        topicById: bingo.topicById,
        groups: bingo.groups
    });
})(window);
