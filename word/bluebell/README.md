# 慢慢藝術字｜靜默餘響（Bluebell Lettering）

- 作品代號：`bluebell`；位於 `word/bluebell/`。
- 預設：`靜默餘響`；範例：`靜默餘響`、`回聲`、`消散`。
- 文字輸入 1～4 字元；獨立直式／橫式構圖；畫布規格與全系列相同。
- **藍鈴花為主、聲音軌跡為輔。** 所有花瓣、花梗、花莖、聲音細線與微光粒子皆由 `bluebell_template.js` 原生 SVG 向量繪製，禁止插畫、生成圖、內嵌點陣圖。
- `bluebell.js`、`bluebell_horizontal.js`、`bluebell_animated.js` 分別處理直式、橫式、兩種方向的動態 SVG；均引用軍火庫官方文字生成與下載零件，**不複製軍火庫原始碼**。
- 網頁端 CSS 特效透過正式 `https://lib.stillnessbyslowly.com/` 呼叫。自足 SVG 內則由本款模板以 SVG 漸層、透明度、動畫表現相應視覺效果；不得把外部 CSS 當成輸出素材。
- 預覽使用與動態 SVG 相同的繪圖模板；靜態 SVG、透明 PNG 與書封 PNG 使用相同模板的靜態畫面。每種輸出都含完整作品元素，透明背景。
- 作品頁共用既有 `word/shared/word_page.js`、`word/word_style.css`；主頁作品資料在 `word/index_data.js`，不新增 UI 功能。

## 交付與使用

將交付 ZIP 內的 `word/` 覆蓋到網站專案既有 `word/` 目錄。勿將整份軍火庫程式碼複製進此作品。ZIP 未包含未變動的其他藝術字或共用 UI。

- SVG：直式 840×1200；橫式 1200×760。
- 透明 PNG：直式 1680×2400；橫式 2400×1520。
- 書封 PNG：700×1000，等比置入透明畫布。
- 動態 SVG：直／橫式均為自足作品。

字型顯示方式沿用全系列，沒有新增字型轉 Path、字型內嵌等要求。
