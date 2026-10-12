# 電閃雷鳴｜慢慢文字設計系列

**部署位置**：`desk/word/thunder/`  
**正式入口（部署後）**：`https://desk.stillnessbyslowly.com/word/thunder/index.html`

這是「慢慢文字設計」第三套風格，核心概念為**雷擊、焦痕、斷裂、強筆鋒**。使用 SVG 原生向量標籤組合文字與電弧，並非把設計圖當背景貼上。

## 使用

1. 讓本資料夾內的檔案保持同層，直接開啟 `index.html`；或整個 `thunder/` 上傳到 GitHub Pages 對應位置。
2. 輸入 1～4 字，直式即時預覽。範例為「電閃雷鳴」「驚雷」「裂光」。
3. 下載透明 **SVG 840×1200**、**PNG 1680×2400**，或 **角角者書封透明 PNG 700×1000（7:10）**。
4. 網頁棋盤格、烏雲底色、動態閃光只用在**預覽 UI**，不會進入輸出圖。

## 檔案職責

- `index.html`：語義結構及引入檔案。
- `thunder.js`：字數切分、向量生圖、PNG 與 SVG 輸出。
- `thunder.css`：生成作品在預覽區的必要樣式。
- `thunder_style.css`：頁面外觀、響應式、配色與按鈕樣式。
- `thunder_style.js`：文字輸入／預覽／下載互動、輕微閃光觸發。
- `thunder_template.js`：SVG 字面金屬、裂紋、電弧圖層模板。
- `assets/`：非必要；只放範例輸出，刪除不影響網站。

## 慢慢軍火庫（HTTPS 絕對引用）

- `https://lib.stillnessbyslowly.com/effects/light/glow.css`
- `https://lib.stillnessbyslowly.com/effects/light/electric_border.css`
- `https://lib.stillnessbyslowly.com/effects/celebration/flash_shake.css`
- `https://lib.stillnessbyslowly.com/Image/png/canvas_png.js`
- `https://lib.stillnessbyslowly.com/Image/png/png_download.js`

外部軍火庫不控制本站的文字、顏色、尺寸與排版。若軍火庫暫時載入失敗，核心 SVG、PNG 生成功能仍有瀏覽器原生方法可以備援（動態邊框則自然略過）。

## 字體與授權

本站**不打包第三方字型檔**，使用裝置已有的系統字體。下載的 SVG 保留 `<text>`，所以**不同裝置可能呈現不同字型**；若要外觀一致，選 PNG。未來若新增「自行上傳字型」，使用者須確認字型授權；本站不代替使用者授權，免責說明也不會自動排除法律責任。

## 設計原則

- `star` 星光夢幻、`rain` 雨墨詩意、`thunder` 雷擊力量感，彼此區隔。
- 後續可新增選色、字型、雷光強度，但**第一版不擅自擴充 UI**。
- 雷光 SVG 產生邏輯暫留專案內，往後真的有多系列共用需求，才抽成 `lib` 零件。
- 請保留專案分檔，不要因為主程式檔案較長而強制切碎。
