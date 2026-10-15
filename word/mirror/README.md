# 鏡花水月｜慢慢藝術字（mirror v2）

- 材質方向：鏡面切片、冰銀反光與碎鏡折射
- 路徑：`word/mirror/index.html`
- 字數：1～4 字；直式 840×1200 SVG / 1680×2400 透明 PNG
- 橫式：1200×760 SVG / 2400×1520 透明 PNG
- 書封：700×1000 透明 PNG
- 動態：另外提供可下載的動態 SVG（SMIL）；普通 SVG/PNG 保持靜態。
- 軍火庫：文字產生器、Canvas PNG、Blob URL 以 HTTPS 絕對網址引用，預覽搭配 glow + lift CSS 原函式。
- 藝術字本體：改為 `mirror_core.js` 獨立繪圖，不再依賴 `word_material_core.js`。
- 版權／字型授權說明在藝術字主頁統一管理。

## 本次處理

1. 保留原本視覺設計與配色，不做重設計。
2. 拆出 `mirror_core.js`，讓直式、橫式與動態接線各自獨立。
3. `index.html` 改為載入本款核心，不再引用共用材質核心。
4. 其餘共用作品頁 UI、下載流程與軍火庫接線維持原樣。
