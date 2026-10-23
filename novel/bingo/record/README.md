# 構思紀錄 v2.0

路徑：`desk/novel/bingo/record/`

- 與賓果主頁共用 `../bingo.js`、小說／牌／格子 UID 及 `sbs_story_bingo` FictionStorage namespace。
- 上方兩個下拉選單使用軍火庫 `SlowlySelect`，保留原生 `<select>` 與 change 事件。
- 16 個題目使用軍火庫 `SlowlyAccordion`，`multiple: false`，一次展開一格，無新增頁面跳轉。
- 題目文字、返回、取消、確認使用軍火庫 `Minimal Underline`，底線長度 70%。
- 文字輸入後短暫延遲寫入 `sbs_story_bingo:record_drafts` 暫存，切換項目或返回時也會先完成暫存。
- 按「確認」才更新原格子的 `content` 正式資料，並清掉該格暫存；按「取消」則刪掉該格暫存，恢復最後已確認的文字。
- 重開頁面仍可取回未確認草稿；同名題目以不同 `cell_uid` 分別保存。
- 刪除牌或作品時，其格子下的暫存也一併刪除。
- 不涉及舊版本資料遷移、雲端帳號及額外資料庫。

所有軍火庫零件透過 HTTPS 絕對 URL 引入，不複製原始碼。CSS 與 JS 依五檔規則分開。
