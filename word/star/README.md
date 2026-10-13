# 筆下星辰產生器

《筆下星辰》衍生的自由輸入文字版本　｜　夏熠安　｜　Stillness by Slowly

## 功能

- 自由輸入 **1～4 個字**，即時生成直式星光藝術字。
- 會依文字長度調整畫布高度和字的排列；完整沿用原版作品的星軌、月牙、寶石、星塵、飾線及藍紫粉鍍金風格。
- 從網頁上直接下載 **SVG** 與 **2 倍透明 PNG**；PNG 實際解析度依字數而定：
  - 1 字：1640 × 1520
  - 2 字：1640 × 2050
  - 3 字：1640 × 2550
  - 4 字：1640 × 2900
- 沒有固定背景色；網頁預覽的棋盤格 **不會匯出**。
- 不用後端、資料庫、帳號或文字上傳。
- 輸入法輸入中文、貼上長字串、自動限制四字皆支援。

## 開啟／部署

解壓縮後直接用瀏覽器開啟 `index.html`，即可使用。如果部署到 GitHub Pages，將這個資料夾的檔案維持相同相對路徑上傳即可。無需建置工具、Node 或後端。

外部 HTTPS 慢慢軍火庫無法載入時，核心功能仍會以瀏覽器原生 API 生成和下載。

## 檔案

```text
筆下星辰產生器/
├── index.html                 網頁結構
├── title.css                 SVG 畫作預覽與透明棋盤格
├── title.js                  核心：文字處理、SVG 產生、PNG 輸出
├── title_style.css           網頁 UI 與響應式樣式
├── title_style.js            輸入、按鈕、即時預覽及狀態互動
├── title_template.js         《筆下星辰》原版裝飾 SVG 模板（非字型檔）
├── assets/
│   ├── 筆下星辰_原版.svg       當初專門繪製的四字向量原作
│   ├── 筆下星辰_原版.png       原作透明 PNG
│   ├── 星河入夢_範例.svg       產生器實際輸出範例
│   └── 星河入夢_範例.png       範例透明 PNG
└── README.md
```

## 慢慢軍火庫引用

只透過 HTTPS 絕對網址使用，不複製軍火庫內部邏輯；外觀由目前這個網站自己管理。

- `https://lib.stillnessbyslowly.com/Image/png/canvas_png.js`：Canvas 轉 PNG Blob。
- `https://lib.stillnessbyslowly.com/Image/png/png_download.js`：下載 PNG Blob。
- `https://lib.stillnessbyslowly.com/effects/light/glow.css`：下載按鈕的滑過光暈。

## 字體與向量格式的差別（請注意）

原版《筆下星辰》的四字是個別描好的 SVG **輪廓路徑**，所以跨裝置字形完全固定。新的「自由輸入文字」版，為了讓所有中文字都能顯示，使用 SVG 原生 `<text>` + **可用的楷體／書法風中文字型回退清單**，加上相同的原版星光、流線、漸層與描邊。

因此，**藝術效果相近，但不能保證每台裝置的楷體筆形逐筆與原版一致**。尤其 SVG 是活文字，在另一台沒有同樣字體的裝置開啟時，字形可能略變；想要固定排版外觀時，優先使用網站生成的 **PNG**。專案不攜帶或上傳任何字型檔。

## 透明確認

PNG 為 RGBA；輸出流程沒有繪製背景填色。裝飾圖案周圍的透明像素仍是 alpha = 0。SVG 本身也沒有鋪底色矩形。

## 本次新增

- 新增：角角者專用書封 PNG（700 × 1000，7:10，透明背景）


## 橫式功能（本次新增）

同一個網站可透過「直式／橫式」按鈕切換。原本的直式 SVG 模板、v1 生成方式和檔名規則都保留；橫式另外由本系列的 `title_horizontal.js` 產生不同的 SVG 構圖，不是旋轉直式圖片。

橫式使用軍火庫 v2 的 HTTPS 絕對網址：

- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_core.js`
- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_horizontal_component.js`

保留原 v1 的 `text_generator_component.js`，讓舊直式流程不受影響。共用 PNG 與書封輸出仍由軍火庫處理，宿主不複製其實作。

橫式 SVG 尺寸為 **1200 × 760**、透明 PNG 為 **2400 × 1520**、角角者書封仍為 **700 × 1000**（等比置中、透明）。字數上限四字，頁面視覺為暫定草案，日後可自行更換。
