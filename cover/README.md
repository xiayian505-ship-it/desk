# 慢慢封面｜首頁

本資料夾是獨立於 `word/` 的正式首頁基礎，入口為 `cover/index.html`。目前已有第一款正式版型《飛鴿傳輸》（`news`）；作品資料由 `index_data.js` 管理。

## 部署

將 ZIP 內的 `cover/` 原樣放到 GitHub Pages 實際提供的網站目錄；若網站根目錄就是 `cover/`，也可直接將它的內容放在部署根目錄。必須透過 HTTPS 網站開啟，以便 `fetch()` 讀取 JSON；不要直接用 `file://` 雙擊本地 HTML 測試。

首頁引用既有軍火庫與 Framework 的 HTTPS CSS／JS，需保持網路可連線。`cover/` 專案的首頁 UI、資料與卡片程式則完全獨立管理，不引用 `word/` 的 UI 程式。未包含任何 `_` 開頭的檔案或目錄。

## 新增下一款正式模板

1. 建立 `cover/<code>/index.html`（該款只定義構圖，操作介面沿用封面共用模組）。
2. 在 `index_data.js` 的 `SlowlyCoverIndex` 陣列加入一筆資料，例如 `code`、`title`、`subtitle`、`desc`、`keywords`。`code` 必須以英文字母開頭、全小寫，並對應資料夾。
3. 首頁會自動按 `code` 首字母分類，依中文名稱或代號搜尋，超過每頁五款時自動分頁；卡片連到 `./<code>/index.html`。不需修改首頁核心 JS／CSS。

`index_notes.json` 管理首頁跑馬副標及可選說明；`viewer_content.json` 管理「慢慢看」三個工具入口。首頁卡片只呈現文字與橢圓線條，不生成 SVG 縮圖。
