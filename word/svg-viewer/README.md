# SVG 檢視室｜慢慢藝術字

## 入口

- 首頁：「慢慢看」內新增 **SVG 檢視室** 入口。
- 網址：`https://desk.stillnessbyslowly.com/word/svg-viewer/index.html`

## 功能

- 在本機選擇或拖曳 `.svg` 檔案。
- 使用 `<img src="blob:...">` 預覽 SVG；支援瀏覽器可播放的 SVG 原生動畫／CSS 動畫。
- 200%、400%、800% 向量縮放、透明棋盤／白色／深色背景。
- 顯示名稱、大小、尺寸、ViewBox、動畫標記。
- 清空預覽或重新整理後不保留任何已選取資料。
- 無上傳 API，無 localStorage／sessionStorage／IndexedDB，無資料庫，無檔案紀錄。

## 安全與限制

- 透過 `File.text()` 於瀏覽器本機讀取，使用 `Blob URL` 渲染成**圖片**，不將外來 SVG 注入頁面 DOM，也不使用 `<object>`／`<iframe>` 執行外來內容。
- 限制 15 MB，拒絕有 XML DTD、ENTITY 或 script 的檔案。需要 JS 執行的 SVG 不在支援範圍。
- 某些 SVG 需要裝置未安裝的字體、外部資源或特定瀏覽器能力，仍可能在不同裝置上有差異。
- 瀏覽器放大是**視覺檢查**，不是改變或輸出任何檔案；沒有 SVG 編輯器與下載功能。
- 此功能適合 GitHub Pages 純靜態部署。

## 檔案分工

- `index.html`：頁面 HTML 與預覽元素
- `viewer.css`：讀檔、卷軸與縮放的必要樣式
- `viewer.js`：檔案驗證、安全圖片顯示與生命週期
- `viewer_style.css`：網站 UI 外觀
- `viewer_style.js`：UI 操作與資訊更新

首頁僅修改 `word/index.html` 與 `word/index_style.css`，其他作品產生器不變。
