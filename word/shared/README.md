# 慢慢藝術字｜共用作品頁 v1

這是 `desk/word/` 專用的作品頁 UI，**不是軍火庫函式副本**。

## 分工

- `shared/word_page.js`：共用頁面 HTML、輸入與字數、直橫切換、預覽接線、四個下載按鈕、狀態及頁尾。
- `../word_style.css`：系列統一介面與排版樣式（原檔保留）。
- 每個作品 `index.html`：標準引用 + `<template id="word-preview-template">`，只放原本作品獨有的預覽舞台。保持作品專用 CSS 可用。
- 每個作品 `xxx_style.js`：**不再寫共用 UI**，只宣告 `window.SlowlyWordPageConfig`；若該款有特殊預覽特效，可設 `mountEffects`、`onPreview`、`onOrientation`。
- 每款繪圖、橫式、動態、SVG 模板等 JS：**保留獨立，不修改規則**。

## 設定範例（放在 xxx_style.js）

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

若動畫直接由原產生器提供，可不寫 `animated`；只有它的 `hasAnimatedSVG` 為真且 `downloadAnimatedSVG` 確實存在，動態按鈕才會啟用。未完成的作品保留第四個按鈕但停用。

每個 HTML 載入原藝術產生器及該款 `xxx_style.js` 後，再載入 `../shared/word_page.js`。直接加新作設定即可建立整頁 UI。

## 注意

共用 UI 不更動原藝術 SVG / PNG 核心。背景透明、裝飾完整匯出仍由各款產生器負責。特殊 CSS、素材及軍火庫 HTTPS 原件須依作品需要引用。

不要將此檔案當作軍火庫共用零件發佈；它包含慢慢藝術字站專用的 UI 外觀與文字。
