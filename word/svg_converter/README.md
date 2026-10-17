# SVG 動畫轉檔室｜慢慢藝術字（獨立測試版）

這是 SVG 動畫轉檔工具的網站整合版，**仍為獨立轉檔器，不抽成軍火庫零件**。介面沿用 `word/word_style.css` 的色彩、版心、頁尾和藝術字／SVG 檢視室的直角細框風格；轉檔核心與按鈕事件邏輯不因換皮而更改。

## 放置目錄和入口

正式目錄：`word/svg_converter/`（底線），在 `word/index.html` 的「慢慢看」分頁由 `viewer_content.json` 新增轉檔室入口。

網址：`https://desk.stillnessbyslowly.com/word/svg_converter/index.html`

另將檢視室從 `word/svg-viewer/` 統一為 `word/svg_viewer/`；舊中線目錄直接刪除，不保留轉址。

## 專案分工

- `index.html`：頁面語意結構及軍火庫 HTTPS 引用。
- `svg_converter.css`：預覽舞台／進度／拖曳狀態等功能樣式。
- `svg_converter.js`：SVG 解析、動畫影格擷取及圖片／影片匯出；**未更動**。
- `svg_converter_style.css`：轉檔器 UI 視覺、手機排版。
- `svg_converter_style.js`：選檔、範例、設定及操作互動；**未更動**。
- `svg_gif_encoder.js`：專用 GIF 編碼器；**未更動，尚未進軍火庫**。

其他樣式直接使用上層 `../word_style.css`，不複製軍火庫也不修改其他 36 款藝術字的樣式。

## 軍火庫引用

直接引用 `https://lib.stillnessbyslowly.com/`：

- `Image/png/canvas_png.js`、`Image/png/png_download.js`
- `data/blob/blob_url.js`、`data/file/filename_sanitize.js`
- `video/recording/mime_type.js`、`video/recording/media_recorder.js`、`video/recording/recorded_chunks.js`

## 功能與限制

支援本機載入／拖曳／貼上 SVG；預覽後可選擇 PNG、GIF、WebM、MP4。GIF 對半透明的保留有限，MP4／WebM 使用實色背景；影片輸出取決於瀏覽器支援的錄影格式。轉檔期間請保持分頁開啟及前景。SVG 的特殊動畫、外部字型與濾鏡可能無法完整保留。

PNG／GIF／影片能否在你的三星手機上順利下載與播放，仍以實際部署操作為驗收準則；本次沒有修改任何轉檔演算法。
