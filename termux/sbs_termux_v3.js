/* SBS Termux v3｜僅保留 Termux 專屬的 Repo 驗證及 Git 指令組合。 */
(function (global) {
  "use strict";

  const REPO_ROOT = "~/storage/shared/github_projects";
  const DEFAULT_COMMIT_MESSAGE = "Update files";

  function normalizeRepo(value) {
    const name = String(value ?? "").trim();
    if (!name || name === "." || name === ".." || !/^[A-Za-z0-9._-]+$/.test(name)) {
      throw new Error("Repo 名稱只能包含英文字母、數字、點、底線和連字號，不能含路徑。");
    }
    return name;
  }

  function normalizeFolder(value) {
    const path = String(value ?? "").trim();
    if (!path) throw new Error("請輸入要上傳的資料夾，例如 資料夾/子資料夾/。");
    if (path.startsWith("/") || path.startsWith("~") || path.includes("\\") || /[\x00-\x1f\x7f]/.test(path)) {
      throw new Error("請輸入 Repo 內的相對資料夾路徑，不要輸入手機完整路徑。");
    }
    const segments = path.endsWith("/") ? path.slice(0, -1).split("/") : path.split("/");
    if (segments.some(part => !part || part === "." || part === ".." || !/^[\p{L}\p{N} _.-]+$/u.test(part))) {
      throw new Error("資料夾路徑不可包含空白層級、./、../ 或特殊指令字元。");
    }
    return path;
  }

  function normalizeMessage(value) {
    const message = String(value ?? "").trim();
    if (!message) return DEFAULT_COMMIT_MESSAGE;
    if (/[\x00-\x1f\x7f]/.test(message)) {
      throw new Error("Commit 訊息請使用單行文字。");
    }
    return message;
  }

  function shellQuote(value) {
    return "'" + String(value).replace(/'/g, "'\\''") + "'";
  }

  function makeCommands({ repo, mode = "upload", scope = "whole", folder = "", message = DEFAULT_COMMIT_MESSAGE }) {
    const name = normalizeRepo(repo);
    const commands = [
      { label: "切換 Repo", command: `cd ${REPO_ROOT}/${name}` }
    ];

    if (mode === "status") {
      commands.push({ label: "檢查狀態", command: "git status" });
      return commands;
    }

    if (mode !== "upload") throw new Error("目前只支援手機上傳到 GitHub。");

    let add = "git add -A";
    if (scope === "folder") {
      add += ` -- ${shellQuote(normalizeFolder(folder))}`;
    } else if (scope !== "whole") {
      throw new Error("上傳範圍無效。");
    }

    const commitMessage = normalizeMessage(message);
    commands.push(
      { label: "加入變更", command: add },
      { label: "檢查變更", command: "git status" },
      { label: "提交更新", command: `git commit -m ${shellQuote(commitMessage)}` },
      { label: "推送 GitHub", command: "git push origin main" }
    );
    return commands;
  }

  function copyAllText(commands) {
    if (!Array.isArray(commands) || commands.length < 1 || commands.length > 5) {
      throw new Error("每次最多產生五條指令。");
    }
    return commands.map(item => item.command).join(" && \\\n");
  }

  global.SbsTermuxV3 = Object.freeze({
    version: "3.0.0",
    normalizeRepo,
    normalizeFolder,
    makeCommands,
    copyAllText
  });
})(window);
