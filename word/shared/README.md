# 慢慢藝術字｜共用作品頁 v1・接入與維護指南

> **位置：`desk/word/shared/README.md`**  
> **建議閱讀順序：先讀 `desk/word/word_readme.md`（全系列規則），涉及作品頁／新增作品時再讀本檔。**  
> 這是 `desk/word/` 專用的 UI；**不是慢慢軍火庫函式副本**。

## 一、讀檔方式與修改範圍

收到整包 `word/` ZIP，**不要直接逐款讀完全部生成器**。先確認使用者指定的最新基底版本，優先閱讀以下必要檔案，再依需求展開。

| 修改目標 | 優先看 | 不需要順手改 |
| --- | --- | --- |
| 全系列標題、輸入框、下載位置、頁尾 | `word/shared/word_page.js`、`word/word_style.css`、`word/shared/footer.css`；首頁及檢視室頁尾亦分別在自己的 `index.html` | 各款 SVG 模板／視覺效果 |
| 單款精修 | 該作品的 `index.html`、`_style.js`、繪圖 JS／SVG 模板、必要 CSS | 其他全部作品 |
| 新款接入共用頁 | `word/word_readme.md`、本檔、現有單款的接入範例、首頁目錄資料 | 複製一整套舊版 UI |
| 單款特效有問題 | 該款預覽 `<template>`、`_style.js`、專用 CSS／軍火庫引用 | 共用頁樣式（除非確定是共通問題） |
| SVG／PNG 真實下載內容不完整 | 該款生成器、模板、匯出流程 | 把問題只修在網站預覽 CSS |
| SVG 檢視室問題 | `word/svg-viewer/` | 其他藝術字生成器 |

**基底優先權：本次使用者指定的最新 ZIP／檔案優先；未指定時才檢查目前 GitHub 版本。** 不拿較舊的檔案蓋回最新變更。共用功能出問題、涉及多款相依時，再擴大檢查範圍。

## 二、正式分工

- **`word/shared/word_page.js`**：共用 HTML、標題、輸入與字數、直橫切換、預覽控制、四個下載按鈕、狀態提示和頁尾。
- **`word/word_style.css`**：全系列共用的作品頁外觀與排版，由宿主網站管理。
- **`word/shared/footer.css`**：全站共同頁尾樣式。首頁單獨引用，作品頁及 SVG 檢視室由 `word_style.css` 引用。左側品牌名稱連到主站，右側「夏熠安」純文字連到個人頁，不使用箭頭或社群圖示。
- **每款 `index.html`**：引用共用樣式、軍火庫與本款生成器、作品設定；`<template id="word-preview-template">` 內只保留本款特別需要的預覽舞台 DOM。
- **每款 `<代號>_style.js`**：設定 `window.SlowlyWordPageConfig`；必要時增加預覽特效回呼，**不要再複製共用輸入與下載事件**。
- **每款繪圖／橫式／動態／SVG 模板 JS**：專屬的字體、配色、構圖、效果與實際匯出內容；不因修改 UI 而重寫。

**重要：路徑必須使用 `word/shared/`，不要改回 `word/_shared/`。** GitHub Pages 預設 Jekyll 可能不發布 `_` 開頭的目錄；先前因此造成作品頁無法出現。

## 三、新作品設定範例

放在該款的 `<代號>_style.js`，以《黑羽舞動》示意：

```js
"use strict";
window.SlowlyWordPageConfig = Object.freeze({
  title: "黑羽舞動",
  initial: "黑羽舞動",
  placeholder: "例如：黑羽",
  examples: ["黑羽舞動", "羽翼", "黑羽"],
  vertical: "SlowlyFeatherArt",
  horizontal: "SlowlyFeatherHorizontalArt",
  animated: "SlowlyFeatherAnimatedArt",
  previewMode: "controller"
});
```

- `vertical`、`horizontal`、`animated` 是既有生成器掛在 `window` 上的**實際名稱**，不是 JS 檔案路徑；要先核對程式輸出名稱。
- `previewMode: "controller"` 適用於生成器提供 `createPreview(image)` 的款式；其他既有款式以原本設定和生成器行為為準，不要為統一而破壞原有預覽。
- 本款預覽若需特殊功能，可依現有介面提供 `mountEffects`、`onPreview`、`onOrientation`。專屬特效在本款檔案接線，不寫入全系列控制器。
- 在 `index.html` 裡，先載入軍火庫正式 HTTPS 原件與本款生成器，再載入 `<代號>_style.js`，**最後**引用 `../shared/word_page.js`。必須保留 `word-preview-template` 和其中 `id="art-image"` 預覽元素。
- 共用 UI 是網站宿主元件，不應搬進軍火庫；軍火庫零件保持以正式 HTTPS 絕對路徑引用，**不建立副本**。

## 四、下載區定案：四個位置永遠保留

按鈕固定由共用 `word_page.js` 建立，順序不因作品而改變：

1. SVG
2. 透明 PNG
3. 書封 PNG（700 × 1000）
4. 動態 SVG

**尚未製作動態 SVG 的舊款，第 4 個按鈕仍顯示但停用。** 不要因為統一 UI 就宣稱全部既有作品已經有動畫，也不做假下載。

目前共用控制器判斷動態下載可用的方式：

- 設定了 `animated`，且相應的 `window[設定名稱].downloadSVG` 存在；或
- 當前生成器 `hasAnimatedSVG` 為真，且有 `downloadAnimatedSVG()` 可用。

新增動態 SVG 時，把真正可工作的生成器接上即可；不需要改共用下載區 HTML。

> 四個位置固定是**UI 規格**。SVG、PNG、書封和動態 SVG 的**畫面內容**，仍由各款生成器負責。作品要求的描邊、筆畫、線條、羽毛、粒子、光暈等必須完整包含於透明輸出，不可只做在網頁 CSS 預覽。

## 五、維護／部署注意事項

- **只改需要修改的層**。精修藝術字時，預設不動共用 UI；改共用 UI 時，預設不動藝術字生成器或 SVG 模板。
- 對全系列共用檔的改動，至少抽樣驗證一般款和有獨立特效的款式；有缺陷再針對受影響範圍擴大檢查。
- 修改共用頁時，確認手機版輸入、直橫切換、四個按鈕狀態，以及預覽舞台的專屬效果不受影響。
- 使用者以手機解壓 ZIP **全覆蓋**再用 Termux 同步 Git。ZIP 覆蓋不等於刪檔；**交付時必須列出需要手動刪除的檔案／目錄，即使為 0 也要說明**。
- 文件或小範圍更新時，提供只含必要檔案的 ZIP，避免用舊的完整 `word/` 蓋掉使用者之後的修改。
- 本次對共用元素的工作僅限既有**作品頁 UI**；要再抽其他功能或把新零件收入軍火庫，先討論，不自動重構。

## 六、文件位置總覽

- **`word/word_readme.md`**：**第一入口**；全系列設計需求、交付規則、任務導向讀檔指引。
- **`word/shared/README.md`**（本檔）：**第二入口**；共用 UI 接入方式與維護規則。
- **`word/<代號>/README.md`**（若存在）：只在修改該款時需要讀取。
- **`word/README_接入前請看.md`**（如有）：早期接軍火庫的歷史紀錄，非目前共用 UI 的規則來源。

在新的對話裡，只要附上最新 `word/` ZIP 並指定「**先讀 `word/word_readme.md` 與 `word/shared/README.md`，只檢查本次要修改的部分**」，即可清楚表達工作範圍；但文件不會自己跨對話自動載入，仍需當次有檔案或可讀取的儲存庫。
