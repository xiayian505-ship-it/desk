# 電閃雷鳴｜慢慢文字設計系列

**部署位置**：`desk/word/thunder/`  
**正式入口（部署後）**：`https://desk.stillnessbyslowly.com/word/thunder/index.html`

這是「慢慢文字設計」第三套風格，核心概念為**雷擊、焦痕、斷裂、強筆鋒**。使用 SVG 原生向量標籤組合文字與電弧，並非把設計圖當背景貼上。

## 使用

1. 讓本資料夾內的檔案保持同層，直接開啟 `index.html`；或整個 `thunder/` 上傳到 GitHub Pages 對應位置。
2. 輸入 1～4 字，直式即時預覽。範例為「電閃雷鳴」「驚雷」「裂光」。
3. 下載透明 **靜態 SVG 840×1200**、**PNG 1680×2400**、**角角者書封透明 PNG 700×1000（7:10）**，也可以額外下載會閃光的 **動態 SVG**。
4. 棋盤格與烏雲底色只用在**預覽 UI**，不會進入輸出圖；動態雷電只存在新增的「動態 SVG」，其餘三種下載保持靜態。

## 檔案職責

- `index.html`：語義結構及引入檔案。
- `thunder.js`：字數切分、向量生圖、PNG 與 SVG 輸出。
- `thunder.css`：生成作品在預覽區的必要樣式。
- `thunder_style.css`：頁面外觀、響應式、配色與按鈕樣式。
- `thunder_style.js`：文字輸入／預覽／下載互動、輕微閃光觸發。
- `thunder_template.js`：SVG 字面金屬、裂紋、電弧圖層模板。
- `thunder_horizontal.js`：橫式文字風格模板與軍火庫 v2 橫式完成品接入。
- `thunder_animated.js`：直式／橫式可獨立播放的動態 SVG 加工。
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


## 橫式功能（本次新增）

同一個網站可透過「直式／橫式」按鈕切換。原本的直式 SVG 模板、v1 生成方式和檔名規則都保留；橫式另外由本系列的 `thunder_horizontal.js` 產生不同的 SVG 構圖，不是旋轉直式圖片。

橫式使用軍火庫 v2 的 HTTPS 絕對網址：

- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_core.js`
- `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_horizontal_component.js`

保留原 v1 的 `text_generator_component.js`，讓舊直式流程不受影響。共用 PNG 與書封輸出仍由軍火庫處理，宿主不複製其實作。

橫式 SVG 尺寸為 **1200 × 760**、透明 PNG 為 **2400 × 1520**、角角者書封仍為 **700 × 1000**（等比置中、透明）。字數上限四字，頁面視覺為暫定草案，日後可自行更換。


## 動態 SVG 下載（本次新增）

電閃雷鳴在直式、橫式都新增獨立的「動態 SVG」下載選項，**原本的三種靜態輸出完全不變**。

- `thunder_animated.js`：拿各排列現有的完整 SVG 加入原生 SVG `<animate>` 節點，製作 5.6 秒循環的雷弧、光暈與碎片閃爍。這是 **Thunder 宿主專用動畫**，不是軍火庫新零件。
- 匯出與檔名處理由已部署的軍火庫 `SlowlyTextGenerator.create` 負責，沒有複製 Blob／下載核心。
- 動態 SVG 不需要額外網頁 CSS、外部 JavaScript 或網路連線；另存為 `.svg` 後，以支援 SVG 動畫的瀏覽器開啟即可播放。
- 部分圖片編輯器、平台縮圖或轉檔工具只會顯示單張畫面，屬於工具對 SVG 動畫的支援限制。
- 動態 SVG **不會讓既有 PNG 與書封變成動畫**；兩者仍是靜態、透明輸出。
- 閃光屬動畫效果，對動態視覺敏感者請謹慎觀看。網頁的減少動態設定不一定會停用獨立 SVG 的原生動畫。

下載結果為原生可編輯 SVG，而不是 GIF 或把整張圖錄成影片。這次沒有修改任何軍火庫檔案，也沒有改 Star／Rain／Forest。
