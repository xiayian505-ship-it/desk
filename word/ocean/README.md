# 煙波浩渺｜Ocean Lettering

- 路徑：`word/ocean/index.html`
- 主題：一望無際的海洋、起伏水波、雲影、薄霧「長在文字上」
- 素材：皆由 SVG 文字模板動態生成，不依賴圖片或外部字型檔
- 軍火庫：HTTPS 載入共用文字產生器、PNG 匯出與 `effects/background/fog.js`
- 雲霧、海浪、反光、字面透明度全部在 SVG 成品內；額外的 Canvas Fog 僅強化網站預覽，而且以生成的文字 SVG 做透明遮罩
- 直式 840×1200 SVG、1680×2400 PNG；橫式 1200×760 SVG、2400×1520 PNG；書封 700×1000 透明 PNG
- 軍火庫 Canvas Fog 的動態尊重 `prefers-reduced-motion`；SVG 水線帶輕微漂移，下載 PNG 是帶波紋的靜態作品
- 不修改軍火庫原始碼、不把軍火庫 JS 複製進專案

## 一般 SVG 與動態 SVG（2026-10）

- 一般 SVG、透明 PNG、書封 PNG 均從同一份完整靜態 SVG 繪製；文字內的海浪、水紋、雲影、霧氣、反光、潮線與邊緣薄霧全部保留。
- 直式與橫式另外提供「動態 SVG」。它使用同一份構圖，只讓文字內的波線透過 SVG 原生 `<animateTransform>` 緩慢位移，下載後無須外部 CSS 或 JavaScript 即可在支援此動畫的 SVG 瀏覽器播放。
- 網頁預覽優先顯示動態 SVG；網站額外的 Canvas Fog 仍只屬於預覽視覺，不會嵌入下載。靜態輸出內已包含文字附著的霧氣筆觸。
- 動態 SVG 下載由各方向的作品產生器直接接到既有 `word/shared/word_page.js`，不修改軍火庫，不複製共用下載介面。
