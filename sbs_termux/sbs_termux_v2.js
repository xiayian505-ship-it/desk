/* 功能本體：輸入驗證與任務流程。這裡不操作 DOM，也不執行終端機指令。 */
(function (global) {
  'use strict';
  const freeze = Object.freeze;
  function text(value) { return String(value ?? '').trim(); }
  function shell(value) { if (value.startsWith("~/")) return '"$HOME"/' + shell(value.slice(2)); return "'" + value.replace(/'/g, "'\\''") + "'"; }
  function absolutePath(value, label = '目錄') {
    const path = text(value).replace(/\/+$/, '');
    if (!path || !/^(~\/|\/)/.test(path) || /[\x00-\x1f\x7f'"`$\\]/.test(path) || /(^|\/)\.\.?($|\/)/.test(path) || /[;&|<>]/.test(path)) {
      throw new Error(`${label}須以 ~/ 或 / 開頭，且不能含有引號、指令符號、換行或 .／.. 路徑段。`);
    }
    return path;
  }
  function relativePath(value) {
    const path = text(value).replace(/^\.\//, '').replace(/\/+$/, '');
    if (!path || path.startsWith('/') || /[\x00-\x1f\x7f'"`$\\;&|<>]/.test(path) || /(^|\/)\.\.?($|\/)/.test(path) || path.startsWith('-')) {
      throw new Error('子目錄必須是相對於 repo 根目錄的路徑，不可含有 ..、引號或指令符號。');
    }
    return path;
  }
  function paths(value) {
    const entries = String(value ?? '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    return [...new Set(entries.map(relativePath))];
  }
  function repository(value) {
    const raw = text(value);
    let name = raw;
    if (/^https?:\/\//i.test(raw)) {
      let url;
      try { url = new URL(raw); } catch { throw new Error('請貼上 GitHub 專案首頁的完整網址。'); }
      if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com' || url.search || url.hash) {
        throw new Error('請貼上 https://github.com/帳號/專案名稱 格式的網址。');
      }
      name = url.pathname.replace(/\/+$/, '').replace(/\.git$/i, '').replace(/^\//, '');
    }
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(name) || name.split('/').some(x => x === '.' || x === '..')) {
      throw new Error('請貼上 GitHub 專案首頁網址，例如 https://github.com/帳號/專案名稱。');
    }
    return name;
  }
  function branch(value) {
    const name = text(value);
    if (!name || name.startsWith('-') || name.startsWith('/') || name.endsWith('/') || name.endsWith('.') || /[\x00-\x20~^:?*\[\\'"`$;&|<>]/.test(name) || name.includes('..') || name.includes('@{') || name.includes('//')) {
      throw new Error('分支名稱不符合安全格式，請使用例如 main 或 feature/update。');
    }
    return name;
  }
  function sharedPath(value) {
    const raw = text(value).replace(/\\/g, '/');
    const prefix = '~/storage/shared/';
    let suffix = raw;
    if (raw.startsWith(prefix)) suffix = raw.slice(prefix.length);
    else if (raw.startsWith('/data/data/com.termux/files/home/storage/shared/')) suffix = raw.slice('/data/data/com.termux/files/home/storage/shared/'.length);
    else if (raw.startsWith('/storage/emulated/0/')) suffix = raw.slice('/storage/emulated/0/'.length);
    else if (raw.startsWith('/') || raw.startsWith('~/')) throw new Error('這個欄位只接受手機共用儲存空間 shared/ 裡的資料夾。');
    if (!suffix || /(^|\/)\.\.?($|\/)/.test(suffix) || /[\x00-\x1f\x7f'"`$\\;&|<>]/.test(suffix)) {
      throw new Error('請填 shared/ 後面的資料夾位置，例如 github_projects/desk。');
    }
    return absolutePath(prefix + suffix.replace(/^\/+|\/+$/g, ''));
  }
  function step(title, command, expected, caution = '') { return { title, command, expected, caution }; }
  function makeSetup(input) {
    const location = sharedPath(input.location);
    const repo = repository(input.repository);
    const folder = text(input.folder) || repo.split('/')[1];
    relativePath(folder);
    if (folder.includes('/')) throw new Error('Clone 的資料夾名稱只能有一層；子目錄請在後續流程填寫。');
    return [
      step('更新套件清單', 'pkg update', '出現更新結果或確認提示；若要求確認，請先閱讀。'),
      step('安裝 Git 與 OpenSSH', 'pkg install git openssh', '安裝完成；已安裝時可能顯示無須更新。'),
      step('取得手機共享儲存空間權限', 'termux-setup-storage', 'Android 若跳出授權視窗，允許後即可存取 ~/storage/shared。', '已授權過可略過；Android 權限視窗須由你自行操作。'),
      step('檢查工作位置', `ls -ld ${shell(location)}`, '顯示你準備存放專案的資料夾資訊。', '若顯示 No such file or directory，先確認實際路徑；本工具不會替你建立目錄。'),
      step('檢查 Git 與 SSH', 'git --version\nssh -V', '顯示 Git 和 OpenSSH 版本。'),
      step('檢查是否已有 SSH 金鑰', 'ls -la ~/.ssh', '只會顯示檔案名稱；id_ed25519.pub 是常見的公鑰檔名，不是網站取得你的公鑰。', '這一步不會讀取或上傳金鑰內容。私鑰（沒有 .pub 的檔案）不可分享；已能使用 GitHub SSH 的人可以略過。'),
      step('測試 GitHub SSH', 'ssh -T git@github.com', '驗證成功時 GitHub 會顯示認證成功訊息，但不提供 shell 存取。', '首次連線時先核對 GitHub 公布的主機金鑰指紋；未設定金鑰時請先在 GitHub 完成 SSH 設定。'),
      step('確認 Clone 目標尚未存在', `ls -ld ${shell(location + '/' + folder)}`, '若顯示不存在，才能使用下一步 clone；若已存在，請改走「GitHub → 本機／更新既有副本」。', '不要在已有資料的同名資料夾上直接 clone。'),
      step('Clone GitHub 專案', `cd ${shell(location)} && \
git clone ${shell('git@github.com:' + repo + '.git')} ${shell(folder)}`, '完成後出現新的專案資料夾。', '只有確認目標資料夾不存在、SSH 已通過，才執行此步。'),
      step('確認副本', `cd ${shell(location + '/' + folder)} && \
pwd && \
git status && \
git remote -v`, '看到正確路徑、Git 狀態及 GitHub 遠端。')
    ];
  }
  function makeUpload(input) {
    const root = sharedPath(input.location);
    const scopes = paths(input.subpaths);
    const message = text(input.message);
    if (!message || /[\x00-\x1f\x7f]/.test(message)) throw new Error('請填寫不含換行的提交訊息。');
    const target = scopes.length ? scopes.map(shell).join(' ') : '';
    return [
      step('進入專案並確認位置', `cd ${shell(root)} && \
pwd && \
git rev-parse --show-toplevel`, 'Git 應顯示你預期的專案資料夾；如果不是，先停止。'),
      step('檢查目前修改', `cd ${shell(root)} && \
git status --short && \
git diff --stat && \
git diff --cached --name-only`, '確認新增、修改、刪除，以及原本就已暫存的檔案。', '後續 commit 會包含所有已暫存檔案；若已有其他暫存內容，請先處理。'),
      step('確認分支及遠端', `cd ${shell(root)} && \
git branch --show-current && \
git remote -v`, '確認目前分支及 origin 都是你要更新的目標。', '若分支空白（detached HEAD）或遠端不對，先停止。'),
      step(scopes.length ? '暫存指定子目錄的變更' : '暫存整個 repo 的變更', `cd ${shell(root)} && \
git add -A${scopes.length ? ' -- ' + target : ''}`, scopes.length ? `只暫存指定的 ${scopes.length} 筆路徑（含新增、修改與刪除）。` : '暫存整個 repo 的新增、修改及刪除。', scopes.length ? '指定路徑以 repo 根目錄為準；若路徑不在此 repo 或不存在且未受 Git 追蹤，Git 可能報錯。' : '整個 repo 都在範圍內，請留意敏感檔案。'),
      step('核對實際準備提交的內容', `cd ${shell(root)} && \
git diff --cached --stat && \
git diff --cached --name-status && \
git status`, '逐一核對暫存清單，尤其是刪除項目。', '清單不正確就先停止，不要執行 commit。'),
      step('提交這次修改', `cd ${shell(root)} && \
git commit -m ${shell(message)}`, '顯示新的 commit 摘要；若沒有可提交內容，Git 會提示。', '只會提交當下已暫存的內容。'),
      step('推送目前分支', `cd ${shell(root)} && \
git push origin "$(git branch --show-current)"`, '推送成功後顯示遠端分支更新。', '請先確認前面 commit 成功，且目前分支與遠端正確；若遠端已有新提交，先處理同步問題。'),
      step('最後確認', `cd ${shell(root)} && \
git status && \
git log -1 --oneline`, '確認工作樹狀態及最新 commit。')
    ];
  }
  function makeDownload(input) {
    const mode = input.mode === 'clone' ? 'clone' : 'pull';
    if (mode === 'clone') {
      const repo = repository(input.repository);
      const parent = sharedPath(input.location);
      const folder = text(input.folder) || repo.split('/')[1];
      relativePath(folder);
      if (folder.includes('/')) throw new Error('Clone 資料夾名稱只能有一層。');
      return [
        step('檢查 Git 與 SSH', 'git --version\nssh -T git@github.com', 'Git 可用，且 GitHub SSH 認證成功。', '若 SSH 尚未設定，請先完成「開始之前」。'),
        step('檢查存放位置及目標名稱', `ls -ld ${shell(parent)}\nls -ld ${shell(parent + '/' + folder)}`, '存放位置存在，且目標資料夾尚未存在。', '第二行若顯示資料夾已存在，請勿 clone 覆蓋。'),
        step('下載完整 repo', `cd ${shell(parent)} && \
git clone ${shell('git@github.com:' + repo + '.git')} ${shell(folder)}`, 'Clone 完成並建立專案資料夾。'),
        step('核對下載結果', `cd ${shell(parent + '/' + folder)} && \
pwd && \
git status && \
git remote -v && \
ls -la`, '看到預期的專案路徑、遠端和檔案。')
      ];
    }
    const root = sharedPath(input.location);
    const selected = branch(input.branch || 'main');
    const scopes = paths(input.subpaths);
    const result = [
      step('確認本機 repo', `cd ${shell(root)} && \
pwd && \
git rev-parse --show-toplevel && \
git status`, '確認目前在正確 repo，且工作樹沒有未處理的修改。', '有未提交修改或正在合併時，先處理，不要直接 pull。'),
      step('確認分支與遠端', `cd ${shell(root)} && \
git branch --show-current && \
git remote -v`, `目前分支應是 ${selected}，origin 應指向正確 GitHub repo。`, '本工具不會自動切換分支。'),
      step('取得遠端資訊', `cd ${shell(root)} && \
git fetch origin`, '更新遠端追蹤資訊，不會直接改動工作檔案。'),
      step('查看本機與遠端差異', `cd ${shell(root)} && \
git log --oneline HEAD..${shell('origin/' + selected)} && \
git status`, '確認遠端是否有新提交，以及本機是否有未處理修改。'),
      step('快轉更新目前分支', `cd ${shell(root)} && \
git pull --ff-only origin ${shell(selected)}`, '能快轉時完成更新；若分支分歧，Git 會拒絕而非自動合併。', '執行前確認目前分支正確、工作樹乾淨；分歧時不要強制覆蓋。')
    ];
    if (scopes.length) result.push(step('查看指定子目錄', `cd ${shell(root)} && \
${scopes.map(p => 'ls -la -- ' + shell(p)).join(' && \
')}`, '查看你關心的子目錄是否已更新。', 'Git pull 仍會更新整個 repo，不是只下載這些子目錄。'));
    result.push(step('確認更新結果', `cd ${shell(root)} && \
git status && \
git log -1 --oneline`, '確認目前狀態及最新提交。'));
    return result;
  }
  function generate(kind, input) {
    if (kind === 'setup') return makeSetup(input);
    if (kind === 'upload') return makeUpload(input);
    if (kind === 'download') return makeDownload(input);
    throw new Error('請選擇要做的事情。');
  }
  global.SBSTermuxV2 = freeze({ generate, absolutePath, sharedPath, relativePath, paths, repository, branch });
})(window);
