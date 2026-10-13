# 慢慢藝術字｜主頁 v1

主頁部署位置：`desk/word/index.html`  
預定正式網址：`https://desk.stillnessbyslowly.com/word/index.html`

## 收錄與頁面

- 「慢慢看」：跨作品搜尋、字型／素材授權提示、SVG 與書封提醒。
- A～Z：依英文系列代號的**第一個英文字母**自動歸類。
- 各字母每頁最多 **5 款**；超過時顯示數字頁碼。
- 搜尋結果點擊後，進入正確字母及頁碼、捲至作品並標示。
- 直接連結 `#F`、`#S` 或 `#S-2` 可以開啟指定分頁與頁碼。
- 首批：Forest、Rain、Star、Thunder。空白字母仍保留分頁入口。

## 新增系列

只需要在 `index_data.js` 加一筆，建議填寫：

- `code`：英文小寫代號，如 `moon`，自動歸入 `M`。
- `title`、`subtitle`、`phrase`、`desc`、`keywords`。
- `href`：完整的 `https://desk.stillnessbyslowly.com/word/.../index.html`。
- `visual`：主頁字樣色票用的宿主 CSS class；未知 class 也不影響入口。

不要修改 A～Z 的 HTML；分頁依資料自動生效。

## 檔案責任

| 檔案 | 負責 |
| --- | --- |
| `index.html` | HTML 結構、文字授權提醒、HTTPS 零件載入 |
| `index_data.js` | 作品資料與入口網址 |
| `index.js` | 資料驗證、字母歸類、跨系列搜尋與分頁資料 |
| `index.css` | 目錄顯示與搜尋定位的必要功能 CSS |
| `index_style.css` | 宿主網頁外觀、排版、各系列識別字樣 |
| `index_style.js` | A～Z 導覽、作品卡片、搜尋介面與定位 |

## 軍火庫／Framework 引用

所有共用零件**直接載入 HTTPS 絕對路徑**，沒有複製原始碼：

- `https://framework.stillnessbyslowly.com/line/outline/outline.css`
- `https://lib.stillnessbyslowly.com/ui/responsive.css`
- `https://lib.stillnessbyslowly.com/ui/tabs/tabs.css`
- `https://lib.stillnessbyslowly.com/ui/tabs/tabs.js`
- `https://lib.stillnessbyslowly.com/fiction/Fiction_search.js`
- `https://lib.stillnessbyslowly.com/fiction/Fiction_paginate.js`

Framework 控制外殼、軍火庫控制 Tab、搜尋及分頁機制；本站自己負責卡片呈現與網址定位。

## 注意

1. 卡片目前是 CSS 製作的**風格識別字樣**，不宣稱與藝術字產生器的實際匯出圖一模一樣。之後可由宿主自行替換成正式作品圖。
2. 沒有修改 `word/forest/`、`word/rain/`、`word/star/`、`word/thunder/` 的任何檔案。
3. 此主頁不是字型授權服務，授權依實際字型／素材權利人及平台規範為準。
4. 主頁 JS/CSS 都保留完整縮排與換行，不做壓縮。
