# 相濡以沫｜慢慢藝術字 v5（透明完整匯出版）

以 `word.zip` 的相同網站介面規格為基底；只更新 heart 系列。

## 交付項目

- 直式 840×1200 SVG / 2x PNG，橫式 1200×760 SVG / 2x PNG。
- 700×1000 角角者書封 PNG。
- 動態 SVG：圓環描線及慢速旋轉、雙光暈緩慢呼吸。
- 文字、陰影、兩顆空心愛心、放大兩號的小實心愛心、圓潤流線，均在 SVG 自身內，並與 PNG 一同匯出。
- 兩種 SVG 的背底透明；網頁格線與淺粉預覽底色不是匯出內容。

## 使用軍火庫的方式

- 網站的文字生成、PNG、Blob URL 仍透過 `https://lib.stillnessbyslowly.com/` HTTPS 絕對網址載入，不建立模組副本。
- 雙光暈引用 `https://lib.stillnessbyslowly.com/effects/light/decorative_glow.css`。
- Enso Ring 引用 `https://lib.stillnessbyslowly.com/effects/line/enso_ring.css`（原件為頁面 CSS）。
- **網頁 CSS 偽元素與外部樣式不會自動變成 SVG 或 PNG 的內容。** 因此對應的「雙光暈」和「描線圓環」改在本系列 SVG 中以原生形狀、漸層和可攜的 SVG 動畫輸出；不複製軍火庫 CSS 原始檔，也不在下載的 SVG 中依賴外部 CSS。

## 檔案

- `index.html`：作品頁 UI、軍火庫 HTTPS 引用、下載按鈕。
- `heart.css`：預覽舞台 CSS（不作為輸出作品內容）。
- `heart_template.js`：文字、愛心、流線、光暈、Enso 圓環全部視覺內容。
- `heart.js`：直式產生、匯出。
- `heart_horizontal.js`：橫式產生、匯出。
- `heart_animated.js`：自足動態 SVG 匯出。
- `heart_style.js`：輸入、切換、下載互動。
