/* SBS Termux v3｜僅保留 Termux 專屬的 Repo 驗證及 Git 指令組合。 */
(function (global) {
  "use strict";

  const REPO_ROOT = "~/storage/shared/github_projects";
  const SAFE_REPO_ROOT = "/storage/emulated/0/github_projects";
  const DEFAULT_COMMIT_MESSAGE = "Update files";

  function normalizeRepo(value) {
    const name = String(value ?? "").trim();
    if (!name || name === "." || name === ".." || !/^[A-Za-z0-9._-]+$/.test(name)) {
      throw new Error("Repo 名稱只能包含英文字母、數字、點、底線和連字號，不能含路徑。");
    }
    return name;
  }

  function normalizeOwner(value) {
    const owner = String(value ?? "").trim();
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(owner)) {
      throw new Error("請輸入 GitHub 帳號／組織名稱（英數字、連字號，不能包含網址或路徑）。");
    }
    return owner;
  }

  function normalizeFolder(value) {
    const path = String(value ?? "").trim();
    if (!path) throw new Error("請輸入資料夾，例如 資料夾/子資料夾/。");
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

  function makeCommands({ repo, mode = "upload", scope = "whole", folder = "", message = DEFAULT_COMMIT_MESSAGE, owner = "" }) {
    const name = normalizeRepo(repo);
    if (mode === "clone") {
      const githubOwner = normalizeOwner(owner);
      const directory = shellQuote(name);
      const sshUrl = shellQuote(`git@github.com:${githubOwner}/${name}.git`);
      return [
        {
          label: "確認手機儲存空間並建立專案目錄",
          command: `(test -d ~/storage/shared || { echo '請先執行 termux-setup-storage 並授權儲存空間。' >&2; false; }) && mkdir -p ${REPO_ROOT}`
        },
        { label: "切換到專案目錄", command: `cd ${REPO_ROOT}` },
        {
          label: "確認手機沒有同名資料夾",
          command: `(test ! -e ${directory} && test ! -L ${directory} || { echo '手機已有同名資料夾，已停止首次下載，避免覆蓋。' >&2; false; })`
        },
        { label: "透過 SSH 首次下載 Repo", command: `git clone -- ${sshUrl} ${directory}` },
        { label: "信任手機 Repo 目錄", command: `git config --global --add safe.directory ${shellQuote(`${SAFE_REPO_ROOT}/${name}`)}` },
        { label: "檢查下載完成的 Repo", command: `git -C ${directory} status` }
      ];
    }
    if (mode === "trust") {
      return [{
        label: "設定信任目錄",
        command: `git config --global --add safe.directory ${SAFE_REPO_ROOT}/${name}`
      }];
    }
    const commands = [
      { label: "切換 Repo", command: `cd ${REPO_ROOT}/${name}` }
    ];

    if (mode === "status") {
      commands.push({ label: "檢查狀態", command: "git status" });
      return commands;
    }

    if (mode === "download") {
      if (scope !== "whole" && scope !== "folder") throw new Error("下載範圍無效。");
      // 全 Repo 使用安全快轉；指定資料夾只取回遠端檔案，不偷改其他資料夾或本機 HEAD。
      commands.push(
        {
          label: "確認 main 分支",
          command: `(test "$(git branch --show-current)" = main || { echo '目前不是 main 分支，已停止下載。' >&2; false; })`
        },
        {
          label: "確認沒有未提交修改",
          command: `(test -z "$(git status --porcelain)" || { git status --short; echo '手機 Repo 有尚未提交或未追蹤的檔案，已停止下載。' >&2; false; })`
        }
      );
      if (scope === "whole") {
        commands.push(
          { label: "下載並快轉 main", command: "git pull --ff-only origin main" },
          { label: "檢查下載結果", command: "git status" }
        );
      } else {
        const target = shellQuote(normalizeFolder(folder));
        commands.push(
          { label: "取得 GitHub 最新 main", command: "git fetch origin main" },
          { label: "只取回指定資料夾", command: `git restore --source=FETCH_HEAD --worktree -- ${target}` },
          { label: "檢查取回的變更", command: "git status --short" }
        );
      }
      return commands;
    }

    if (mode !== "upload") throw new Error("不支援的操作模式。");

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
    if (!Array.isArray(commands) || commands.length < 1 || commands.length > 6) {
      throw new Error("每次最多產生六條指令。");
    }
    return commands.map(item => item.command).join(" && \\\n");
  }

  global.SbsTermuxV3 = Object.freeze({
    version: "3.2.0",
    normalizeRepo,
    normalizeOwner,
    normalizeFolder,
    makeCommands,
    copyAllText
  });
})(window);
