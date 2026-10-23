# 構思賓果｜規格 v0.7（4×4 極簡／名稱選填）

更新：2026-10-23；只支援 4×4 新版，不做舊版資料相容。

## 一、用途與資料

- 站點：`https://desk.stillnessbyslowly.com/novel/bingo/`，原始碼在 `desk/novel/bingo/`。
- 純前端小說構思工具，允許建立多本小說、每本任意多張賓果牌；不使用雲端資料庫。
- 每本小說 `novel_uid`、每張賓果牌 `board_uid`、每格 `cell_uid`，均獨立；同名格子不共用完成狀態。
- 題目另外以 `topic_id` 表示題目種類；未來可依 `cell_uid` 保存獨立構思筆記。初版僅有完成勾選，不開放筆記編輯。
- 本機儲存採軍火庫 `FictionStorage.create({ namespace: "sbs_story_bingo" })`；依原生規則產生 `sbs_story_bingo:novels`、`sbs_story_bingo:boards`、`sbs_story_bingo:cells`、`sbs_story_bingo:settings`。
- 軍火庫所有模組透過 HTTPS 絕對路徑載入，不在本專案複製共用函式。

### 名稱均可選填（v1.4）

- 進入空白專案可以直接按「新增賓果」，不必先建立小說。
- 按「產生賓果」時，若沒有目前小說，系統先建立一個名稱為 `構思賓果 YYYY-MM-DD` 的小說（日期取作者裝置的當地日期），然後建立賓果牌。
- 「新增小說」的名稱欄也可直接留白，套用相同預設名稱。
- 預設名稱只是一般作品名稱，可隨時重新命名；不拿名稱當識別依據。
- 自訂牌內容未通過驗證時，不先建立空白小說。
- 不新增資料重置或修改 Storage schema；保持既有 `schemaVersion = 2`，避免升版再清除現存 4×4 資料。

## 二、題庫（六類、36 種）

| 分類 | 按照題庫順序排列 | 數量 |
|---|---|---:|
| 作品基礎 | 作品名稱、故事類型、次要類型、故事主軸、故事主題、閱讀定位 | 6 |
| 世界觀與背景 | 時代背景、故事舞台、世界觀、世界規則、特殊設定 | 5 |
| 人物設定 | 主角人設、配角人設、人物背景、人物關係、人物目標、人物動機、人物弱點、角色成長 | 8 |
| 劇情與衝突 | 主線劇情、核心衝突、故事開頭、關鍵事件、劇情轉折、故事高潮、故事結局、伏筆規劃、支線劇情 | 9 |
| 敘事與風格 | 作品文風、敘事手法、敘事視角、故事節奏 | 4 |
| 篇幅與章節 | 篇幅規劃、預計字數、章節規劃、章節結構 | 4 |

## 三、牌面、抽題與重排

- **新建 4×4＝16 格**，橫4＋直4＋兩條斜線，共 **10** 條可能賓果線；不設免費格。
- **固定牌**：六類各取前兩種，每種一次，共 12 格；其餘四格加入「配角人設」。因此「配角人設」出現 5 次，其餘 11 個題目各一格。位置可洗牌。
- **隨機牌**：從全部36題逐格抽到16格，①～④類同名可重複，⑤⑥類同題目最多一次；每一抽的當前合格候選項目等機率。保留無限建牌能力。
- **自訂牌**：作者可勾選任何分類的題目，並指定同名題目的數量。每張最多 16 種不同題目，指定次數合計不得超過16；留空的已勾題目最少出現1次，其餘空位從留空題目分配。全部填數時總計須剛好16。自訂牌不限制第五與第六分類的同名次數。
- **重排**：只交換位置，保留原 `cell_uid`、完成狀態及構思內容。連線依重排後的格子重新判定。
- **舊版資料**：第一次載入 v1.2 時，將 `sbs_story_bingo` 命名空間下的所有舊小說、賓果牌、格子與設定清除，不遷移也不保留；以同一命名空間內 `settings.app.schemaVersion = 2` 標記完成。往後正常保留新版 4×4 的本機進度。

## 四、頁面 UI v1.1

- 移除所有非必要說明文字和獨立說明區，包含標語、玩法指引、備註、模式副說明、頁尾宣告、展示卡說明。
- 主頁只保留藝術字、小說／賓果牌選擇與增刪改、牌名、完成數／百分比、賓果數、4×4 棋盤、重新排列／匯出 PNG／新增牌按鈕。
- 建牌視窗只顯示牌名（選填）、固定／隨機／自訂、題目勾選與次數、確認／取消。
- 操作必要的欄位標籤、錯誤訊息、刪除不可復原確認與無障礙名稱保留。
- 手機版為單欄棋盤布局；4 欄文字與按鈕仍需上線實機檢查。

## 五、實際引用的軍火庫零件

以下由軍火庫 `index_data.js` 的**功能描述**盤點，並核對過部分核心來源；不以檔名當唯一搜尋依據。

| 用途 | 零件 | 絕對 URL |
|---|---|---|
| 唯一識別 | `RandomId.create({ prefix })` | https://lib.stillnessbyslowly.com/data/random/random_id.js |
| 本機存取 | `FictionStorage.create({ namespace })` | https://lib.stillnessbyslowly.com/fiction/Fiction_storage.js |
| 陣列重排 | `FictionShuffle.shuffle(items)` | https://lib.stillnessbyslowly.com/fiction/Fiction_shuffle.js |
| 隨機索引 | `SlowlyRandom.int(min,max)` | https://lib.stillnessbyslowly.com/data/random/random.js |
| 畫布文字換行 | `SlowlyCanvasWrappedText.buildLines` | https://lib.stillnessbyslowly.com/Image/canvas/wrapped_text.js |
| Canvas 輸出 PNG | `SlowlyCanvasPNG.toBlob` | https://lib.stillnessbyslowly.com/Image/png/canvas_png.js |
| PNG 下載 | `SlowlyPNGDownload.fromBlob` | https://lib.stillnessbyslowly.com/Image/png/png_download.js |
| 刪除前確認 | `SlowlyConfirm.show(options)` | https://lib.stillnessbyslowly.com/ui/confirm/confirm.js |
| 互動回饋 | `SlowlyToast.create(target)` | https://lib.stillnessbyslowly.com/ui/toast.js |
| 完成爆光 | `SlowlyAreaBurst.create(root)` | https://lib.stillnessbyslowly.com/effects/light/area_burst.js |
| 基本自適應 | CSS | https://lib.stillnessbyslowly.com/ui/responsive.css |

CSS 依賴另有 `confirm.css`、`toast.css`、`area_burst.css`。賓果十條線由本專案掃描，因為軍火庫 `Grid Line Match` 不支援斜線。PNG 展示卡由宿主繪製 Canvas，再引用軍火庫的換行、PNG Blob 與下載功能；`DOM Capture` 不含 HTML-to-Canvas renderer，沒有直接採用。

## 六、後續可能擴充

- 每格獨立構思筆記（依 `cell_uid`）、JSON 備份／匯入、存檔移轉及資料驗證。
- 不提供舊資料轉版、相容或還原；不影響當前版本建立的新牌本機儲存。

## 七、驗證與限制

已完成靜態語法檢查與 Node.js 隔離核心測試，涵蓋 16 格固定生成、隨機⑤⑥分類不重複、自訂次數、10 條賓果／斜線、UID 與完成狀態、新版資料儲存恢復、舊命名空間單次清空與 PNG 呼叫。瀏覽器自動化因環境對本機 URL 的攔截未能完成；不等於已完成實際裝置或軍火庫 HTTPS 連線整合驗收。
