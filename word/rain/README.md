# 雨你相遇產生器｜Rain Lettering

作者：夏熠安｜Stillness by Slowly（慢慢）

《筆下星辰》星辰版的姊妹工具，但這一版採用 **濕墨書法、雨痕、雨水滴落、漣漪與暈染**，不是將星辰版改顏色。

## 放置路徑

將 ZIP 解壓縮後，整個 `word/rain/` 放進 `desk` 網站儲存庫，入口為 `word/rain/index.html`。

## 功能

- 自由輸入 1～4 個字，超過四字自動截斷（支援中文輸入法組字）。
- 直式藝術字即時預覽。
- 下載 SVG，畫布 840 × 1200，透明背景。
- 下載高清透明 PNG，1680 × 2400。
- 下載角角者專用書封 PNG，**700 × 1000（7:10）**，藝術字等比置中，透明背景。
- 預覽格紋與網頁雨幕僅用於頁面展示，不寫入任何下載檔案。
- 可用於手機瀏覽器，無後端、無會員、無上傳服務。

## 資料夾結構

```text
word/
└── rain/
    ├── index.html        # 網頁 HTML
    ├── rain.css          # 功能預覽區 CSS
    ├── rain.js           # 文字渲染與匯出
    ├── rain_style.css    # 網頁 UI 樣式
    ├── rain_style.js     # UI 控制與互動
    ├── rain_template.js  # 雨系 SVG 視覺模板
    ├── assets/
    │   ├── 雨你相遇_範例.svg
    │   ├── 雨你相遇_範例.png
    │   └── 雨你相遇_角角者書封_700x1000.png
    └── README.md
```

## 軍火庫使用

不複製軍火庫原始碼，而透過 HTTPS 絕對網址直接引用：

- `https://lib.stillnessbyslowly.com/Image/png/canvas_png.js`（PNG 產生）
- `https://lib.stillnessbyslowly.com/Image/png/png_download.js`（PNG 下載）
- `https://lib.stillnessbyslowly.com/effects/background/rain.js`（網站雨幕）

下載功能設有原生瀏覽器 API 備援；網站雨幕若無法載入，不影響圖檔產生。

## 字體與授權

本網站不隨附第三方字型檔，而是使用使用者裝置可用的系統書法字型，並按序回退至 CJK Serif。SVG 使用 `<text>` 文字物件，**不同裝置的字形可能略有差異**；若需要固定畫面，建議下載 PNG。

本工具不提供第三方付費字型或轉授權。使用者自行使用其他字型、素材或輸出作品時，應自行確認取得適當的使用權利與授權；聲明不代表免除依法可能負有的責任。

## 開啟方式

本機開啟 `index.html` 或部署到 GitHub Pages 即可。純前端，不需建置工具。外部軍火庫需要網路才能載入；離線時仍可使用核心匯出功能備援。


## 橫式功能（本次新增）

同一個網站可透過「直式／橫式」按鈕切換。原本的直式 SVG 模板、v1 生成方式和檔名規則都保留；橫式另外由本系列的 `rain_horizontal.js` 產生不同的 SVG 構圖，不是旋轉直式圖片。

橫式使用軍火庫 v2 的 HTTPS 絕對網址：

- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_core.js`
- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_horizontal_component.js`

保留原 v1 的 `text_generator_component.js`，讓舊直式流程不受影響。共用 PNG 與書封輸出仍由軍火庫處理，宿主不複製其實作。

橫式 SVG 尺寸為 **1200 × 760**、透明 PNG 為 **2400 × 1520**、角角者書封仍為 **700 × 1000**（等比置中、透明）。字數上限四字，頁面視覺為暫定草案，日後可自行更換。


## 動態 SVG 輸出（2026-10）

- `rain_animated.js` 新增直式／橫式動態 SVG 下載；原生 SVG 的雨絲落下與漣漪、水滴微動，可以離線獨立播放。此動畫不依賴網站用的 Canvas 雨幕、外部 CSS 或 JavaScript。
- 一般 SVG、透明 PNG、書封 PNG 的原版構圖和下載規格均不變；直式 SVG **840 × 1200**／PNG **1680 × 2400**，橫式 SVG **1200 × 760**／PNG **2400 × 1520**，書封 **700 × 1000**。
- 第四個下載位置使用既有共用作品頁，僅設定本款動態生成器，不複製共用 UI 或軍火庫程式。
