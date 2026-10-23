# 構思賓果｜第一版

> 專案：`desk/novel/bingo/`  
> 網址（部署目標）：`https://desk.stillnessbyslowly.com/novel/bingo/`  
> 日期：2026-10-23  
> 本版狀態：已建立可操作的五檔前端程式，尚未替使用者提交 GitHub。

## 1. 如何使用

把此資料夾放進 `desk` 的 `novel/bingo/`，GitHub Pages 更新後開啟上述網址。網頁必須能連線至 `https://lib.stillnessbyslowly.com/`，因為核心 ID、Storage、洗牌、隨機、PNG 及回饋功能都**直接引用軍火庫**。本專案沒有複製或打包軍火庫程式。

初次開啟先建立一部小說，再新增賓果牌。建立賓果牌可選「固定」、「隨機」或「自訂」。點擊格子即可勾選完成，點第二次取消。建立的作品、賓果牌與格子可以獨立命名、管理、重新排列；可匯出僅含題目和完成狀態的 PNG 展示卡。

## 2. 已實作規則

- 題庫：六大類、36 種；不要求個人化 OOP 或任何制式寫作流程。
- 棋盤：5×5／25 格；橫列 5 條、直欄 5 條、對角線 2 條，最多 12 條賓果。
- 固定牌：每類前四個題目各 1 格（24 格），再加 1 個「配角人設」，該題共 2 格。
- 隨機牌：前四**類**的題目允許重複，最後兩類每種題目在同張牌最多出現 1 次。為避免擅自制定權重，本版每一步都從當時符合條件的題目中**等機率**抽取，直到 25 格；不保證各類數量平均。
- 自訂牌：跨六類勾選，逐題指定出現次數。未填次數的已勾選題目先保留 1 格，再隨機分配剩餘格數；全數填寫時加總須等於 25。自訂不受隨機模式⑤⑥類不可重複的限制。
- 同名題目每個實體格子都具有獨立 `cell_uid`、獨立勾選狀態，未來可各自容納不同構思筆記。
- 每本小說可新增任意張數的賓果牌（仍受瀏覽器本機空間限制）；同名小說、同名牌亦以 UID 區分。
- 重新排列只調換現有格子 UID 的順序，不重新建立或清空格子。重新排列後以新位置重算 12 條連線。
- 本版不直接替換已存在格子的題目；需要新題目時請另建賓果牌，避免日後誤刪構思筆記。
- 本版不實作「偏向未完成項目」的抽題權重：因同名實體的進度各自獨立，該權重的語意仍需再議。

## 3. 本機儲存

依軍火庫 `FictionStorage` 原生 `namespace:collectionName` 的格式：

| localStorage Key | 内容 |
|---|---|
| `sbs_story_bingo:novels` | 小說基本紀錄；`novel_uid` 為鍵 |
| `sbs_story_bingo:boards` | 牌的資料、名稱、所屬小說與 `cell_uids` 排列 |
| `sbs_story_bingo:cells` | 每一實體格子的 `cell_uid`、`topic_id`、`completed`、預留 `content` |
| `sbs_story_bingo:settings` | 使用者最近開啟的小說與賓果牌 |

小說、牌、格子 UID 由 `RandomId.create({ prefix })` 建立，分別以 `novel-`、`board-`、`cell-` 開頭。**UID 不由顯示名稱生成，勾選進度不依同名題目同步**。

所有構思資料由瀏覽器本機保存。**清除網站資料、換瀏覽器或換裝置可能造成資料遺失**；完整 JSON 備份／匯入與每格文字筆記留待後續版，尚未提供。因此在此版不應存入無法承擔遺失的唯一原稿。

## 4. 檔案分工

```text
novel/bingo/
├── index.html           結構、SEO、外部軍火庫連結
├── bingo.css            功能必要樣式：格子、完成／連線
├── bingo.js             題庫、生成、UID、Storage、賓果判定、PNG 繪製
├── bingo_style.css      版面、字型、配色、手機響應式
├── bingo_style.js       UI、選題介面、CRUD 操作、訊息回饋
└── README.md            本文件
```

CSS／JS 保留完整縮排與註解，不採用壓縮、單行或內嵌軍火庫副本。

## 5. 使用到的慢慢軍火庫零件

根據 `index_data.js` **描述內容**查找，並依原始碼與已提供的規格 MD 核對：

- UID：`https://lib.stillnessbyslowly.com/data/random/random_id.js`
- 隨機：`https://lib.stillnessbyslowly.com/data/random/random.js`
- 洗牌：`https://lib.stillnessbyslowly.com/fiction/Fiction_shuffle.js`
- 本機儲存：`https://lib.stillnessbyslowly.com/fiction/Fiction_storage.js`
- Canvas 多行字：`https://lib.stillnessbyslowly.com/Image/canvas/wrapped_text.js`
- Canvas → PNG：`https://lib.stillnessbyslowly.com/Image/png/canvas_png.js`
- PNG 下載：`https://lib.stillnessbyslowly.com/Image/png/png_download.js`
- 刪除確認：`https://lib.stillnessbyslowly.com/ui/confirm/confirm.js`、對應 CSS
- Toast：`https://lib.stillnessbyslowly.com/ui/toast.js`、對應 CSS
- 慶祝爆亮：`https://lib.stillnessbyslowly.com/effects/light/area_burst.js`、對應 CSS
- 響應式基礎：`https://lib.stillnessbyslowly.com/ui/responsive.css`

賓果判定為宿主自己掃描固定的 12 條線。沒有硬接三消的 Grid Line Match，因為它無法判斷對角線；也沒有用不具備 DOM → Canvas renderer 的 DOM Capture 冒充整頁截圖。展示卡以宿主 Canvas 直接繪製、再引用軍火庫轉檔和下載。

## 6. 測試與注意事項

- 已完成 JavaScript 語法檢查。
- 已在隔離瀏覽器中，用**僅限測試的軍火庫 API 模擬介面**驗證固定牌格數／配角數、隨機牌後兩類不重複、自訂精確次數、格子獨立 UID、重新排列保留已勾選格子，以及全部 25 格完成會形成 12 條連線。
- 測試時沒有把這些模擬介面寫進交付專案或取代軍火庫。
- **尚未完成遠端實際軍火庫的瀏覽器端整合驗收**，因測試環境對本機網址及外站請求有限制。部署後仍需檢查 HTTPS 資源載入、真實 localStorage 寫入／重開、手機裝置與 PNG 下載。
- 實作只將已確認的基礎需求落地；尚待決定的隨機加權、資料備份／匯入與筆記編輯不會偷加規則。

## 7. 已知後續工作

1. 實機驗收：Samsung／其他手機瀏覽器、資料跨重新整理與網頁關閉後保留、匯出 PNG。
2. 定義「未完成優先抽題」的具體行為；同名但不同 UID 的完成狀態不得混為一談。
3. 完整 JSON 備份／匯入（版號、Schema、UID 重複與失敗回滾）。
4. 每個格子的構思筆記編輯；以原 `cell_uid` 做保存索引，不覆寫其他同名格子。
5. 刪除／新增多筆資料的原子性與更強的恢復流程，以及儲存空間不足時的保障。
