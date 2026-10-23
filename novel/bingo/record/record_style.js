/*
 * 構思紀錄｜介面互動 v2.0
 * 使用軍火庫 SlowlySelect 與互斥 SlowlyAccordion。
 * 草稿自動暫存（FictionStorage）；按確認才寫入正式格子內容，取消可還原。
 */
(function (global) {
    "use strict";

    const record = global.StoryBingoRecord;
    const $ = id => document.getElementById(id);
    const DRAFT_DELAY_MS = 320;

    const ui = {
        accordion: null,
        selectInstances: [],
        activeUid: null,
        confirmedText: "",
        draftTimer: null,
        writeTail: Promise.resolve(),
        busy: false
    };

    function showError(error) {
        console.error("[構思紀錄]", error);
        const element = $("recordError");
        element.textContent = error instanceof Error ? error.message : String(error);
        element.hidden = false;
    }

    function clearError() {
        $("recordError").textContent = "";
        $("recordError").hidden = true;
    }

    function setStatus(text, state = "") {
        const element = $("recordSaveStatus");
        element.textContent = text;
        element.dataset.state = state;
    }

    function queueWrite(action) {
        const current = ui.writeTail.then(action);
        ui.writeTail = current.catch(() => {});
        return current;
    }

    function syncSelects() {
        ui.selectInstances.forEach(instance => instance.sync());
    }

    function fillSelect(select, items, key, selectedValue, emptyText) {
        const fragment = document.createDocumentFragment();
        if (!items.length) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = emptyText;
            fragment.append(option);
        } else {
            for (const item of items) {
                const option = document.createElement("option");
                option.value = item[key];
                option.textContent = item.name;
                fragment.append(option);
            }
        }
        select.replaceChildren(fragment);
        if (selectedValue) select.value = selectedValue;
        select.disabled = ui.busy || !items.length;
        syncSelects();
    }

    function setBusy(value) {
        ui.busy = Boolean(value);
        $("recordNovelSelect").disabled = ui.busy || !record.snapshot().novels.length;
        $("recordBoardSelect").disabled = ui.busy || !record.snapshot().boards.length;
        $("recordContent").disabled = ui.busy || !ui.activeUid;
        $("recordCancel").disabled = ui.busy || !ui.activeUid;
        $("recordConfirm").disabled = ui.busy || !ui.activeUid;
        syncSelects();
    }

    async function runBusy(action) {
        if (ui.busy) return false;
        setBusy(true);
        clearError();
        try {
            await action();
            return true;
        } catch (error) {
            showError(error);
            setStatus("儲存失敗", "error");
            return false;
        } finally {
            setBusy(false);
        }
    }

    function updateStatus() {
        if (!ui.activeUid) return;
        if ($("recordContent").value !== ui.confirmedText) {
            setStatus("草稿未暫存");
        } else {
            setStatus("已確認");
        }
    }

    async function persistDraft(uid, text, confirmedText) {
        await queueWrite(async () => {
            if (text === confirmedText) {
                await record.discardDraft(uid);
            } else {
                await record.saveDraft(uid, text);
            }
        });
        if (ui.activeUid === uid && $("recordContent").value === text) {
            setStatus(text === confirmedText ? "已確認" : "草稿已暫存");
        }
    }

    async function flushDraft() {
        if (ui.draftTimer !== null) {
            clearTimeout(ui.draftTimer);
            ui.draftTimer = null;
        }
        if (!ui.activeUid) {
            await ui.writeTail;
            return;
        }
        const uid = ui.activeUid;
        const text = $("recordContent").value;
        await persistDraft(uid, text, ui.confirmedText);
    }

    function scheduleDraft() {
        if (!ui.activeUid || ui.busy) return;
        if (ui.draftTimer !== null) clearTimeout(ui.draftTimer);
        clearError();
        updateStatus();
        ui.draftTimer = setTimeout(() => {
            ui.draftTimer = null;
            void flushDraft().catch(showError);
        }, DRAFT_DELAY_MS);
    }

    function makeSummary(cell, index) {
        const topic = record.topicById(cell.topic_id);
        const group = record.groups.find(item => item.id === topic?.group_id);
        const summary = document.createElement("summary");
        summary.className = "record-summary";
        summary.dataset.cellUid = cell.cell_uid;
        summary.setAttribute("aria-label", `${index + 1}，${topic?.label || "構思項目"}`);

        const number = document.createElement("span");
        number.className = "item-position";
        number.textContent = String(index + 1).padStart(2, "0");
        const category = document.createElement("span");
        category.className = "item-group";
        category.textContent = group?.shortLabel || "構思";
        const title = document.createElement("span");
        title.className = "item-topic slowly-underline";
        title.textContent = topic?.label || "未知題目";
        const mark = document.createElement("span");
        mark.className = "item-saved";
        mark.textContent = cell.content ? "●" : "";
        mark.setAttribute("aria-hidden", "true");
        summary.append(number, category, title, mark);
        return summary;
    }

    function renderItems() {
        if (ui.accordion) {
            ui.accordion.destroy();
            ui.accordion = null;
        }
        ui.activeUid = null;
        // 編輯器是唯一實例。重建題目清單前先移回容器，避免隨舊 details 被刪除。
        const editor = $("recordEditor");
        if (editor) $("recordWorkspace").append(editor);
        const fragment = document.createDocumentFragment();
        record.snapshot().cells.forEach((cell, index) => {
            const details = document.createElement("details");
            details.className = "record-detail";
            details.dataset.accordionId = cell.cell_uid;
            details.append(makeSummary(cell, index));
            fragment.append(details);
        });
        $("recordItems").replaceChildren(fragment);
        if (!global.SlowlyAccordion) {
            throw new Error("慢慢軍火庫 SlowlyAccordion 未成功載入。");
        }
        ui.accordion = global.SlowlyAccordion.create($("recordItems"), { multiple: false });
        $("recordEditor").hidden = true;
    }

    async function openEditor(uid) {
        const cell = record.snapshot().cells.find(item => item.cell_uid === uid);
        if (!cell) throw new Error("找不到構思格子。");
        record.chooseCell(uid);
        const topic = record.topicById(cell.topic_id);
        const group = record.groups.find(item => item.id === topic?.group_id);
        const draft = await record.readDraft(uid);
        ui.activeUid = uid;
        ui.confirmedText = typeof cell.content === "string" ? cell.content : "";

        $("recordTopicTitle").textContent = topic?.label || "構思內容";
        $("recordTopicGroup").textContent = group?.label || "";
        $("recordContent").value = draft === null ? ui.confirmedText : draft.content;
        ui.accordion.open(uid);
        const node = $("recordItems").querySelectorAll("details[data-accordion-id]");
        const detail = Array.from(node).find(item => item.dataset.accordionId === uid);
        detail.append($("recordEditor"));
        $("recordEditor").hidden = false;
        setStatus(draft === null || draft.content === ui.confirmedText ? "已確認" : "草稿已暫存");
        // 移動裝置不自動叫出鍵盤，作者點文字區才開始輸入。
    }

    async function handleSummaryClick(event) {
        const summary = event.target.closest("summary[data-cell-uid]");
        if (!summary || ui.busy) return;
        event.preventDefault();
        const uid = summary.dataset.cellUid;

        await runBusy(async () => {
            await flushDraft();
            if (ui.activeUid === uid) {
                ui.accordion.close(uid);
                ui.activeUid = null;
                $("recordEditor").hidden = true;
            } else {
                await openEditor(uid);
            }
        });
    }

    function updateSavedMark(uid) {
        const cell = record.snapshot().cells.find(item => item.cell_uid === uid);
        const details = Array.from($("recordItems").querySelectorAll(".record-detail"))
            .find(item => item.dataset.accordionId === uid);
        const mark = details?.querySelector(".item-saved");
        if (mark) mark.textContent = cell?.content?.trim() ? "●" : "";
    }

    async function confirmContent() {
        if (!ui.activeUid) return;
        await runBusy(async () => {
            await flushDraft();
            const uid = ui.activeUid;
            const text = $("recordContent").value;
            await queueWrite(async () => {
                if (text !== ui.confirmedText) await record.saveContent(uid, text);
                await record.discardDraft(uid);
            });
            ui.confirmedText = text;
            setStatus("已確認");
            updateSavedMark(uid);
        });
    }

    async function cancelContent() {
        if (!ui.activeUid) return;
        await runBusy(async () => {
            if (ui.draftTimer !== null) {
                clearTimeout(ui.draftTimer);
                ui.draftTimer = null;
            }
            const uid = ui.activeUid;
            await queueWrite(() => record.discardDraft(uid));
            $("recordContent").value = ui.confirmedText;
            setStatus("已取消草稿");
        });
    }

    function render() {
        const state = record.snapshot();
        fillSelect($("recordNovelSelect"), state.novels, "novel_uid", state.novel?.novel_uid, "尚無小說");
        fillSelect($("recordBoardSelect"), state.boards, "board_uid", state.board?.board_uid, "尚無賓果牌");
        const canEdit = Boolean(state.board && state.cells.length === 16);
        $("recordWorkspace").hidden = !canEdit;
        $("recordEmpty").hidden = canEdit;
        if (!canEdit) return;
        $("recordBoardTitle").textContent = state.board.name;
        renderItems();
    }

    async function switchContext(change) {
        await runBusy(async () => {
            await flushDraft();
            await change();
            render();
        });
        renderSelections();
    }

    function renderSelections() {
        const state = record.snapshot();
        $("recordNovelSelect").value = state.novel?.novel_uid || "";
        $("recordBoardSelect").value = state.board?.board_uid || "";
        syncSelects();
    }

    function bindEvents() {
        $("recordContent").addEventListener("input", scheduleDraft);
        $("recordContent").addEventListener("blur", () => {
            if (!ui.busy) void flushDraft().catch(showError);
        });
        $("recordItems").addEventListener("click", event => {
            void handleSummaryClick(event).catch(showError);
        });
        $("recordCancel").addEventListener("click", () => { void cancelContent(); });
        $("recordConfirm").addEventListener("click", () => { void confirmContent(); });
        $("recordNovelSelect").addEventListener("change", event => {
            const uid = event.target.value;
            void switchContext(() => record.chooseNovel(uid));
        });
        $("recordBoardSelect").addEventListener("change", event => {
            const uid = event.target.value;
            void switchContext(() => record.chooseBoard(uid));
        });
        $("backToBingo").addEventListener("click", async event => {
            event.preventDefault();
            if (await runBusy(() => flushDraft())) {
                global.location.assign($("backToBingo").href);
            }
        });
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") void flushDraft().catch(showError);
        });
        global.addEventListener("pagehide", () => { void flushDraft().catch(() => {}); });
    }

    async function initializeUi() {
        try {
            if (!record || !global.SlowlySelect || !global.SlowlyAccordion) {
                throw new Error("構思紀錄或軍火庫零件未載入。");
            }
            bindEvents();
            await record.initialize();
            ui.selectInstances = ["recordNovelSelect", "recordBoardSelect"]
                .map(id => global.SlowlySelect.create($(id)))
                .filter(Boolean);
            render();
        } catch (error) {
            showError(error);
        }
    }

    initializeUi();
})(window);
