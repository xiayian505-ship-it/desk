# Star / Rain / Thunder 接入慢慢軍火庫完成品（尚未部署）

這是供對比與日後替換的**接入版本**，不是已經上線的網站。

## 必要順序

1. **先**將另一個 ZIP 的 `component/text_generator/` 放入軍火庫並上線。
2. 確定完成品可從 `https://lib.stillnessbyslowly.com/component/text_generator/text_generator_component.js` 讀取。
3. **再**把本包三個資料夾覆蓋到 `desk/word/star/`、`desk/word/rain/`、`desk/word/thunder/`。
4. 三個站的 `index.html` 都使用軍火庫的 **HTTPS 絕對連結**，不包含任何軍火庫 JS 副本。

## 改動範圍

- `index.html`：增加 Blob URL 與共用 Text Generator 的兩個 HTTPS script 引用。
- 主功能 JS（`title.js`、`rain.js`、`thunder.js`）：**刪除重複的下載／Canvas 匯出流程**；保留各自文字定位與風格生成，呼叫共用完成品。
- 原本的 SVG 模板 JS、UI CSS、功能 CSS、UI JS、README 原封保留。
- 三站仍維持目前對外的 `SlowlyStarArt`、`SlowlyRainArt`、`SlowlyThunderArt` 呼叫方式，UI 不必同步改寫。
- `assets/` 不在本包，原始提供的 `word.zip` 也沒有 `assets/`，網站不依賴它。

## 差異驗證

用原始 `word.zip` 做過比對，Star / Rain / Thunder 在 6 組輸入文字下輸出的 SVG 字串完全相同；書封圖片排版的 Canvas 繪製座標亦一致。

**瀏覽器測試**：使用 Chromium 直接載入三站及軍火庫程式內容，三站各自 SVG、PNG、700×1000 下載均成功（共 9 次）；每站檢查了 PNG 透明度與 390px 手機版無橫向溢出。因測試環境阻擋本機 HTTP 網址，改以內嵌程式方式執行。正式 GitHub Pages／CDN 部署仍需上線後驗證 URL。
