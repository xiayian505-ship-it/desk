# 穿林打葉｜林風藝術字產生器（word/forest）

慢慢文字設計系列第 4 款。由夏熠安主導，走苔綠、木刻、紙雕、葉脈、古銅風痕的視覺方向，不沿用 Star / Rain / Thunder 的視覺模板。

## 網站功能

- 輸入一至四個字，即時生成直式藝術字。
- SVG 840 × 1200，透明背景。
- PNG 1680 × 2400，透明背景。
- 角角者專用 PNG 700 × 1000，7:10，等比置中，透明背景。
- 預覽上的格紋和飄葉不會出現在圖片輸出中。
- 自行指定字型、色碼、模板；目前預設字體使用裝置可用的繁中字型堆疊，不提供字型檔。

## 檔案責任

- `index.html`：網頁結構。
- `forest.css`：藝術字的預覽舞台樣式。
- `forest.js`：**本系列專有**的枝葉、文字排版、木刻與風痕規則，呼叫軍火庫完成品。
- `forest_style.css`：網站 UI 排版與外觀。
- `forest_style.js`：輸入框、範例、預覽與下載按鈕事件。
- `forest_template.js`：林風 SVG 視覺模板。
- `assets/`：額外範例，網頁不會載入這個資料夾；不部署也能正常使用。

## 軍火庫：絕對路徑

頁面透過 HTTPS 絕對路徑引用，不把軍火庫原始碼複製進專案：

- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_component.js`
- `https://lib.stillnessbyslowly.com/data/blob/blob_url.js`
- `https://lib.stillnessbyslowly.com/Image/png/canvas_png.js`
- `https://lib.stillnessbyslowly.com/Image/png/png_download.js`
- `https://lib.stillnessbyslowly.com/effects/particle/float.css`

其中 **SlowlyTextGenerator** 負責 SVG 生成流程、預覽 URL 與 PNG／書封匯出；宿主獨立掌控圖像樣式。若共用完成品沒有上線，網站會明確顯示載入問題，不會暗中使用複製版。

## 部署與測試

將資料夾檔案放到 `desk/word/forest/`，網址預計為：

`https://desk.stillnessbyslowly.com/word/forest/index.html`

本地端可透過測試瀏覽器將相同的 HTTPS 路徑映射到已確認的軍火庫原版檔案，驗證依賴介面；正式 GitHub Pages 部署後，仍需測試網路實際載入是否成功。

## 字型與權利

網站只提供生成與排版機制。若使用者自行提供或變更字型／其他素材，應自行確認合法來源與使用授權。SVG 仍使用字型名稱，跨裝置可能有字形差異；PNG 則固定當下瀏覽器繪出的效果。網站沒有上傳字型檔的功能，也不附帶第三方字型檔。
