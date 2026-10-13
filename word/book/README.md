# 開卷有益｜Book Lettering

- 系列代號：`book`（藝術字主頁 B 分頁，與 bloom 共列）
- 入口：`https://desk.stillnessbyslowly.com/word/book/index.html`
- 代表文字：開卷有益
- 直式：840 × 1200 SVG / 1680 × 2400 PNG
- 橫式：1200 × 760 SVG / 2400 × 1520 PNG
- 書封：700 × 1000 透明 PNG

## 風格原則

紙張泛黃、茶色舊墨、書頁纖維、捲頁折角與疊頁紙緣都沿著文字生成。
沒有全幅古書、紙張矩形背景或預覽背景；所以透明 SVG/PNG 也保留古書感。
特效視覺由此系列 SVG 模板提供，軍火庫負責文字拆分、橫式定位、SVG / PNG / 書封輸出。

## 分工

- `book_template.js`：字體模板、紙張筆畫材質、近字頁片與捲頁動勢；直橫共用
- `book.js`：直式生成，獨立呼叫軍火庫直式完成品
- `book_horizontal.js`：橫式生成，獨立呼叫軍火庫橫式完成品
- `book.css`：預覽樣式
- `book_style.css`：宿主介面局部配色
- `book_style.js`：介面事件、即時預覽與下載
- `index.html`：入口

## 依賴

軍火庫的 Blob URL、PNG、直式文字產生器、Core、橫式文字產生器全部用 HTTPS 絕對路徑引用；
不複製零件、不修改軍火庫，不附字型檔。
