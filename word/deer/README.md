# 逐鹿中原｜鹿雨森分支標題款

慢慢藝術字系列的獨立項目，標題視覺直接延伸自使用者自己的《鹿雨森》世界觀標誌。

## 對照來源

- 鹿角來源：`silvarain/game/game_style.js` 的 `makeAntlers()`；保留原 seed=5、branch 遞迴與鏡射方式。
- 官網文字與色系：`silvarain/index_style.css`、`silvarain/index.css`、`silvarain/game/game_style.css`；採用 Noto Serif TC、`#dfefe9`、`#87cfb9`、`#071213`。
- 網站預覽森林：與 `silvarain/index.js` 相同的軍火庫 `SlowlyPineForest`、`SlowlyCanvasFog`、`SlowlyCanvasRain`，以及原本的星點層，全部使用 HTTPS 絕對網址。不複製庫的 JS。

## 操作

- `desk/word/deer/index.html`：既有慢慢藝術字 UI，不新增其他導覽、文案或標題欄位。
- `deer_template.js`：統一生成直式／橫式鹿雨森標題 SVG；完整標題＋鹿角＋極簡林線為透明向量內容；動態預覽另含遊戲入口式鹿角逐枝描線與文字浮現。
- `deer.js`：直式共用文字匯出 v1。
- `deer_horizontal.js`：橫式共用文字匯出 v2。
- `deer.css`：鹿雨森式預覽舞台；不修改 `../word_style.css`。
- `deer_scene.js`：實際用軍火庫畫背景；這些畫布不納入透明下載。
- `deer_style.js`：沿用同系列現有輸入、排版切換、SVG／PNG／700 × 1000 書封下載。

背景只屬於**預覽舞台**，下載的 SVG / PNG 一律不帶背景。因 SVG 採文字節點而不封裝字型，其他裝置若缺少 Noto Serif TC 會依字體串列回退；PNG 外觀最一致。
