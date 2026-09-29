/* SBS Termux v3｜頁面互動與軍火庫零件組合；不複製共用函式。 */
(function (global) {
  "use strict";

  const $ = id => document.getElementById(id);
  const core = global.SbsTermuxV3;
  const feedback = $("feedback");

  function showFeedback(message, isError = false) {
    feedback.textContent = String(message);
    feedback.dataset.error = String(Boolean(isError));
    feedback.hidden = false;
  }

  function clearFeedback() {
    feedback.textContent = "";
    feedback.hidden = true;
  }

  async function init() {
    const required = [
      ["SlowlyTabs", global.SlowlyTabs?.create],
      ["FictionStorage", global.FictionStorage?.create],
      ["SelectOrCreate", global.SelectOrCreate],
      ["SlowlyClipboardCopy", global.SlowlyClipboardCopy?.copy],
      ["SlowlyToast", global.SlowlyToast?.create],
      ["SbsTermuxV3", core?.makeCommands]
    ];
    const missing = required.filter(([, value]) => typeof value !== "function").map(([name]) => name);
    if (missing.length) {
      showFeedback(`必要零件載入失敗：${missing.join("、")}。請檢查網路或軍火庫網址。`, true);
      $("repoConfirm").disabled = true;
      return;
    }

    const toast = global.SlowlyToast.create("#toast", { duration: 1700 });
    global.SlowlyTabs.create("#termuxTabs", { initial: "upload" });

    const repoName = $("repoName");
    const repoSuggestions = $("repoSuggestions");
    const toolArea = $("toolArea");
    const folderWrap = $("folderWrap");
    const folderName = $("folderName");
    const commitMessage = $("commitMessage");
    const resultArea = $("resultArea");
    const commandOutput = $("commandOutput");
    const singleCopies = $("singleCopies");
    const resultNote = $("resultNote");
    const resultHint = document.querySelector(".result-hint");

    let activeRepo = null;
    let scope = "whole";
    let latestCommands = [];

    function clearResult() {
      latestCommands = [];
      commandOutput.value = "";
      singleCopies.replaceChildren();
      resultNote.hidden = true;
      resultNote.textContent = "";
      resultArea.hidden = true;
    }

    function clearCurrentInput() {
      // 只清除本次操作，不刪除 FictionStorage 裡記住的 Repo。
      chooser.clearSelection();
      activeRepo = null;
      repoName.value = "";
      $("activeRepo").textContent = "";
      repoSuggestions.replaceChildren();
      repoSuggestions.hidden = true;
      toolArea.hidden = true;
      scope = "whole";
      document.querySelectorAll("[data-scope]").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.scope === "whole"));
      });
      folderWrap.hidden = true;
      folderName.value = "";
      commitMessage.value = commitMessage.defaultValue;
      clearResult();
      clearFeedback();
      toast.show("已清除本次輸入");
    }

    function selectRepo(item) {
      activeRepo = item.name;
      repoName.value = item.name;
      $("activeRepo").textContent = item.name;
      toolArea.hidden = false;
      repoSuggestions.hidden = true;
      repoSuggestions.replaceChildren();
      clearResult();
      clearFeedback();
    }

    let chooser;
    try {
      const store = global.FictionStorage.create({ namespace: "sbs_termux_v3" });
      const repos = store.collection("repos");
      chooser = new global.SelectOrCreate({
        items: await repos.all(),
        maxResults: 8,
        getName: item => item.name,
        onCreate: item => repos.add(item),
        onSelect: selectRepo
      });
    } catch (error) {
      showFeedback(`Repo 記憶讀取失敗：${error.message}`, true);
      $("repoConfirm").disabled = true;
      return;
    }

    function renderSuggestions() {
      const value = repoName.value.trim();
      const matches = chooser.search(value);
      repoSuggestions.replaceChildren();
      if (!value || !matches.length) {
        repoSuggestions.hidden = true;
        return;
      }
      matches.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "repo-suggestion";
        button.textContent = item.name;
        button.addEventListener("click", () => chooser.selectById(item.id));
        repoSuggestions.appendChild(button);
      });
      repoSuggestions.hidden = false;
    }

    repoName.addEventListener("input", () => {
      if (activeRepo !== null) {
        activeRepo = null;
        toolArea.hidden = true;
        clearResult();
      }
      clearFeedback();
      renderSuggestions();
    });
    repoName.addEventListener("keydown", event => {
      if (event.key === "Escape") repoSuggestions.hidden = true;
    });
    document.addEventListener("click", event => {
      if (!$("repoForm").contains(event.target)) repoSuggestions.hidden = true;
    });

    $("repoForm").addEventListener("submit", async event => {
      event.preventDefault();
      const button = $("repoConfirm");
      button.disabled = true;
      try {
        const name = core.normalizeRepo(repoName.value);
        const result = await chooser.addOrSelect(name);
        if (!result.item) throw new Error("請輸入 Repo 名稱。");
        toast.show(result.created ? "已記住 Repo" : "已選擇 Repo");
      } catch (error) {
        showFeedback(error.message, true);
      } finally {
        button.disabled = false;
      }
    });
    $("repoClear").addEventListener("click", clearCurrentInput);

    document.querySelectorAll("[data-scope]").forEach(button => {
      button.addEventListener("click", () => {
        scope = button.dataset.scope;
        document.querySelectorAll("[data-scope]").forEach(item => {
          item.setAttribute("aria-pressed", String(item === button));
        });
        folderWrap.hidden = scope !== "folder";
        clearResult();
        clearFeedback();
      });
    });
    folderName.addEventListener("input", clearResult);
    commitMessage.addEventListener("input", clearResult);

    function renderCommands(commands, isPartial = false) {
      latestCommands = commands;
      commandOutput.value = core.copyAllText(commands);
      commandOutput.rows = Math.min(11, Math.max(4, commands.length * 2));
      resultHint.textContent = commands.length === 1
        ? "先確認上方指令，再按複製。"
        : "複製內容就是上方顯示的整段指令；使用 && 串接，前一步失敗就不繼續。";
      singleCopies.replaceChildren();
      for (const [index, item] of commands.entries()) {
        const card = document.createElement("div");
        card.className = "command-item";
        const header = document.createElement("div");
        header.className = "command-step";
        const label = document.createElement("span");
        label.className = "command-step-label";
        label.textContent = `${index + 1}・${item.label}`;
        const command = document.createElement("pre");
        command.className = "command-line";
        command.textContent = item.command;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "command-copy";
        button.textContent = "複製這條";
        button.setAttribute("aria-label", `單獨複製：${item.label}`);
        button.addEventListener("click", () => copyText(command.textContent));
        header.append(label);
        // 先顯示實際指令，再顯示複製按鈕。
        card.append(header, command, button);
        singleCopies.appendChild(card);
      }
      resultNote.hidden = !isPartial;
      resultNote.textContent = isPartial
        ? "注意：指定資料夾只限制 git add 的範圍；若之前已暫存其他檔案，git commit 仍可能一併提交。執行前請看 git status。"
        : "";
      resultArea.hidden = false;
      clearFeedback();
      resultArea.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    $("generateUpload").addEventListener("click", () => {
      try {
        if (!activeRepo) throw new Error("請先選擇 Repo。");
        renderCommands(core.makeCommands({
          repo: activeRepo,
          mode: "upload",
          scope,
          folder: folderName.value,
          message: commitMessage.value
        }), scope === "folder");
      } catch (error) {
        clearResult();
        showFeedback(error.message, true);
      }
    });
    $("generateStatus").addEventListener("click", () => {
      try {
        if (!activeRepo) throw new Error("請先選擇 Repo。");
        renderCommands(core.makeCommands({ repo: activeRepo, mode: "status" }));
      } catch (error) {
        clearResult();
        showFeedback(error.message, true);
      }
    });

    $("generateTrust").addEventListener("click", () => {
      try {
        if (!activeRepo) throw new Error("請先選擇 Repo。");
        renderCommands(core.makeCommands({ repo: activeRepo, mode: "trust" }));
      } catch (error) {
        clearResult();
        showFeedback(error.message, true);
      }
    });

    async function copyText(value) {
      try {
        await global.SlowlyClipboardCopy.copy(value);
        toast.show("已複製指令");
      } catch (error) {
        showFeedback(`複製失敗：${error.message}`, true);
      }
    }
    $("copyAll").addEventListener("click", () => {
      if (!latestCommands.length) return;
      copyText(commandOutput.value);
    });
  }

  init().catch(error => showFeedback(`初始化失敗：${error.message}`, true));
})(window);
