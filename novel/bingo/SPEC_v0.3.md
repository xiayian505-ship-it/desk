# 構思賓果｜功能規格與慢慢軍火庫對照

> 文件版本：v0.3（第一版實作註記）  
> 整理日期：2026-10-23  
> 專案狀態：**已建立純前端第一版五檔程式；尚未直接部署 GitHub**  
> 確認標記：✅ 已談定／🔍 已核對軍火庫源碼或目錄／💡 建議實作方法／⏳ 尚待決定

## 0. 專案資訊與原則

| 欄位 | 內容 |
|---|---|
| 名稱 | **構思賓果**（說明用名：小說構思賓果） |
| 用途 | 協助小說作者透過賓果格子構思、標記寫作準備進度；不是限制寫作方式的檢查表 |
| GitHub 專案 | `desk` |
| 預定目錄 | `novel/bingo/` |
| 預定網址 | `https://desk.stillnessbyslowly.com/novel/bingo/` |
| 實作形態 | 純前端、手機優先、無雲端資料庫、無須帳號 |
| 儲存 | 瀏覽器本機保存、更新後仍能找回原小說／原賓果牌／原格子 |
| 軍火庫 | `https://lib.stillnessbyslowly.com/`，只透過 **HTTPS 絕對 URL** 引用模組，**不得複製零件原碼或建立副本** |
| 主視覺 | 「構思賓果」陰陽相生藝術字 PNG，地址見文末資產欄 |

設計原則：**36 種是題目種類、6 大類是題庫分類、5×5 是每張牌尺寸；賓果牌的建立總數不受這些數字限制。** 任何同名格子都可以有各自的 UID、完成狀態，以及未來的構思內容。

## 1. ✅ 構思題庫：6 類、36 種

順序在「固定牌」模式具有意義：**每一類依下表順序取前四項**。

| 分類 | 類別代碼（建議） | 依序排列的構思題目 | 數量 |
|---|---|---|---:|
| ① 作品基礎 | `foundation` | 1. 作品名稱；2. 故事類型；3. 次要類型；4. 故事主軸；5. 故事主題；6. 閱讀定位 | 6 |
| ② 世界觀與背景 | `world` | 1. 時代背景；2. 故事舞台；3. 世界觀；4. 世界規則；5. 特殊設定 | 5 |
| ③ 人物設定 | `character` | 1. 主角人設；2. 配角人設；3. 人物背景；4. 人物關係；5. 人物目標；6. 人物動機；7. 人物弱點；8. 角色成長 | 8 |
| ④ 劇情與衝突 | `plot` | 1. 主線劇情；2. 核心衝突；3. 故事開頭；4. 關鍵事件；5. 劇情轉折；6. 故事高潮；7. 故事結局；8. 伏筆規劃；9. 支線劇情 | 9 |
| ⑤ 敘事與風格 | `narrative` | 1. 作品文風；2. 敘事手法；3. 敘事視角；4. 故事節奏 | 4 |
| ⑥ 篇幅與章節 | `structure` | 1. 篇幅規劃；2. 預計字數；3. 章節規劃；4. 章節結構 | 4 |
| **合計** | | | **36** |

**題目名稱只是顯示文字，不可作為資料唯一識別鍵。** 💡 建議每一種題目另設穩定的 `topic_id`，以便日後修改顯示名稱，而不破壞既有構思資料。

這些題目源自既有寫作手冊討論，但面向一般作者：**不強制**個人化 OOP／Oulipo／工程術語與流程，也不要求作者寫之前一定決定文風、篇幅等。

## 2. ✅ 賓果共通規則

- 牌面：**5 列 × 5 欄＝25 格**，不設免費格。
- 完成條件：橫列 5 條、直欄 5 條、兩條對角線，共 **12 條**可能的賓果連線。
- 點擊格子切換「完成／未完成」，再次點擊可取消；每格獨立保存。
- 相同名稱允許在同一張牌上出現多次；例如 7 個「配角人設」皆為不同格子。
- 原則上顯示完成格數、完成比例、已達成賓果線數；連線狀態由目前格子的完成值計算。
- 一張牌可持續累積多條賓果，不會因先完成一條而結束該牌。
- 小說可有多張牌，且可有多張同主題、同題目配置的牌；**不設定賓果牌數量上限**（仍受裝置儲存容量所限）。
- 六大分類只是題庫分組；**同一張牌可以跨全部六大類**。

## 3. ✅ 牌面產生方式

### 3.1 固定牌（已確定）

1. **六大類各取前 4 種**，每一項出現 **1 次**：`6 × 4 = 24` 格。
2. **第 25 格額外加入「配角人設」**：共 `24 + 1 = 25` 格。
3. 所以固定牌中「配角人設」出現 **2 次**，其餘選中的 23 個題目各 1 次。
4. 固定的意思是**題目組成固定**；位置可以打亂，且打亂後保留格子的原 UID。

**固定牌實際題目清單（25 格）**：

| 來源 | 題目 |
|---|---|
| 作品基礎（4） | 作品名稱、故事類型、次要類型、故事主軸 |
| 世界觀與背景（4） | 時代背景、故事舞台、世界觀、世界規則 |
| 人物設定（4） | 主角人設、配角人設、人物背景、人物關係 |
| 劇情與衝突（4） | 主線劇情、核心衝突、故事開頭、關鍵事件 |
| 敘事與風格（4） | 作品文風、敘事手法、敘事視角、故事節奏 |
| 篇幅與章節（4） | 篇幅規劃、預計字數、章節規劃、章節結構 |
| 額外補格（1） | **配角人設** |

### 3.2 完全隨機牌（已確定）

由 36 種題目形成 25 格；依分類執行以下重複限制：

| 分類 | 自動隨機時的重複規則 |
|---|---|
| ① 作品基礎 | **允許重複**同題目 |
| ② 世界觀與背景 | **允許重複**同題目 |
| ③ 人物設定 | **允許重複**同題目 |
| ④ 劇情與衝突 | **允許重複**同題目 |
| ⑤ 敘事與風格 | **同題目不可重複**（每種最多 1 格） |
| ⑥ 篇幅與章節 | **同題目不可重複**（每種最多 1 格） |

**重要**：這是「前四**類**可重複；後兩**類**不可重複」，**不是**每類只從前四個題目選。六類各自的所有題目均在隨機題庫中。

因此前四類共有 `6+5+8+9=28` 種可重複題目；後兩類共有 `4+4=8` 種不能重複的題目。系統抽滿 **25 格**，其中可重複的題目每次出現仍各自取得新 `cell_uid`。

⏳ **尚未指定**六大類的出現比例、各題目的權重，以及「優先未完成」的精確演算法；實作時不得自行假定每類一定抽取相同格數。先前提過可優先抽未完成題目，但由於同名格子完成狀態彼此獨立，**不得只看同名文字就判斷所有格子都已完成**。

### 3.3 作者自訂牌（已確定）

- 作者可在 **36 種題目中跨分類自由勾選**，不是只能在單一類裡選。
- 可替**每一個勾選題目**指定在本張牌出現幾次（同名次數）。
- 可全部指定總數 **恰好 25 格**；也可只指定某些題目的數量，由系統在所勾選項目中安排餘額。
- 必須防止指定次數超過 25、選項為空卻要求自動補格等不合理情況。
- 💡 隨機模式「⑤⑥類不可重複」是**自動隨機牌的規則**；自訂牌由作者直接指定出現次數。若要連自訂模式也限制 ⑤⑥，須再另行討論，不要暗自加限制。

例如：主角人設 6、配角人設 8、人物關係 5、核心衝突 4、伏筆規劃 2，剛好 25 格。

## 4. ✅ 小說、賓果牌與格子 UID

共三層獨立身分：

| 資料層級 | UID 欄位建議 | 建立時機 | 行為 |
|---|---|---|---|
| 小說 | `novel_uid` | 建立小說 | 改名不變、其下所有牌關聯此 UID |
| 賓果牌 | `board_uid` | 新增一張賓果牌 | 同名牌可並存且 UID 不同 |
| 格子 | `cell_uid` | 實際產生新格子 | 同名格子不同 UID；後續構思內容以此定位 |

- ✅ 參考《朕的接龍帝國》的 UID 產生概念；軍火庫已查到 **`RandomId.create({ prefix: "..." })`**。
- 💡 建議前綴：`novel-`、`board-`、`cell-`；實際資料鍵名以最終實作決定。
- 每個格子需保有 `topic_id`（題目種類）與 `cell_uid`（格子實體），這兩者**不可混用**。
- 同一小說中可有多個「主角人設」，它們是獨立的創作事項；完成一格，**不得同步勾選所有同名格子**。
- **重新排列牌面**時移動整筆格子資料，不重新產生 UID，不清空勾選或筆記。
- **真正替換題目**時才建立新格子 UID；既有格子的內容不可未經處理直接捨棄。
- 💡 複製牌（若日後提供）需另生成 `board_uid` 及新 `cell_uid`，避免兩張牌共用相同資料識別。
- 🔍 來源模組 `RandomId` 優先使用 `crypto.randomUUID()`，不支援時退回時間戳加隨機片段；**不代替儲存或去重驗證**。

### 4.1 💡 資料結構草案（非已定 API）

```json
{
  "novel_uid": "novel-<uuid>",
  "name": "小說暫定名稱",
  "boards": [
    {
      "board_uid": "board-<uuid>",
      "name": "人物構思賓果 1",
      "mode": "custom",
      "size": 5,
      "cells": [
        {
          "cell_uid": "cell-<uuid>",
          "topic_id": "character.supporting_profile",
          "completed": false,
          "content": ""
        }
      ]
    }
  ]
}
```

範例只是表達「小說／牌／格子相互關聯」，**不是規定一定把所有資料塞進同一筆 localStorage**；使用 `FictionStorage` 時可按作品／牌／格子拆 collection。`content` 欄位是預留欄位，初版不開放編輯。

## 5. ✅ 初版與後續擴充

| 項目 | 初版 | 備註 |
|---|---|---|
| 多小說建檔、命名、切換 | ✅ | 同名也靠 UID 區分 |
| 賓果牌新增、命名、切換、刪除 | ✅ | 任意張數；刪除資料前要確認 |
| 固定牌／隨機牌／自訂牌 | ✅ | 依第 3 節規則 |
| 5×5 完成切換與 12 條連線判定 | ✅ | 以格子實例完成狀態為準 |
| 重新排列格子 | ✅ | UID 與狀態跟著格子走 |
| 本機儲存與重開恢復 | ✅ | 不能依賴登入、雲端 DB |
| 完成格數、賓果線數／基本慶祝回饋 | ✅ | 效果可引用軍火庫；不影響邏輯 |
| 賓果 PNG 展示卡 | ✅ | **只呈現題目與完成情況，不公開私人構思筆記** |
| 每格詳細構思筆記 | 後續版本 | 以 `cell_uid` 為記錄主鍵 |
| 完整 JSON 備份／匯入 | 後續規劃 | 裝置本機資料應可移轉；需要備份版本與驗證 |

## 6. 🔍 軍火庫盤點方式與結果

### 6.1 查找方法

1. 使用既有 GitHub 軍火庫 `xiayian505-ship-it/stillnessbyslowly_data_core` 的 **`index_data.js`**：此檔為 `window.SlowlyLibraryIndex` 首頁索引。
2. **以 `desc` 功能描述閱讀與搜尋**：隨機、洗牌、唯一識別、資料 CRUD、連線、Canvas、多行文字、PNG、確認視窗、彈出視窗、表單等，再核對其標題及連結；沒有只按檔名猜。
3. 本次在索引中解析到 **333 筆有描述的目錄條目、992 筆連結紀錄（978 個不重複 URL）**。這是**首頁索引統計**，**不是宣稱軍火庫全部原始檔只有 333 個，也不是將 992 筆連結視為 992 個零件**。
4. 對核心候選零件另外抓取實際 JavaScript 來源，確認公開 API 與責任邊界；並對照作者提供的舊版三消 `match3_v1.html`／`match3_v1.js` 如何引用。
5. 本次是**原始碼／索引核對，不是瀏覽器整合測試**。正式實作前需再次檢查最新軍火庫與使用說明頁。

### 6.2 🔍 已確認可用、優先引用的零件

以下每一列均附上軍火庫 **HTTPS 絕對網址**；可直接作為 HTML 的外部 `<script src>` 或 `<link rel="stylesheet">` 來源，**不應複製內容到宿主專案**。

| 賓果需求 | 軍火庫零件與直接引用網址 | 核對結果／API | 建議程度 |
|---|---|---|---|
| 小說、牌、格子 UID | [Random ID](https://lib.stillnessbyslowly.com/data/random/random_id.js) | `RandomId.create({ prefix })`，優先 `crypto.randomUUID()`；不負責保存、查重 | **優先** |
| 格子／牌資料本機 CRUD | [Fiction Storage](https://lib.stillnessbyslowly.com/fiction/Fiction_storage.js) | `FictionStorage.create({ namespace })`、`.collection(name, { idField })`；可 `add/get/all/update/remove/...`，底層 localStorage | **優先** |
| 題目／既有格子打亂 | [Fiction Shuffle](https://lib.stillnessbyslowly.com/fiction/Fiction_shuffle.js) | `FictionShuffle.shuffle(items)` 回傳**新陣列**；原陣列不直接改動，物件參考隨排列保留 | **優先** |
| 隨機挑題與補格 | [Random](https://lib.stillnessbyslowly.com/data/random/random.js) | `SlowlyRandom.int(min, max)` 等；負責隨機數，**不內建前四類可重複／後兩類不可重複** | **優先** |
| PNG 匯出資料 | [Canvas PNG](https://lib.stillnessbyslowly.com/Image/png/canvas_png.js) | `SlowlyCanvasPNG.toBlob(canvas)`／`toDataURL(canvas)`，只做 **Canvas → PNG** | **優先** |
| PNG 下載 | [PNG Download](https://lib.stillnessbyslowly.com/Image/png/png_download.js) | `SlowlyPNGDownload.fromBlob(blob, filename)`／`fromDataURL(...)` | **優先** |
| 展示卡長文字換行 | [Wrapped Text](https://lib.stillnessbyslowly.com/Image/canvas/wrapped_text.js) | `SlowlyCanvasWrappedText.buildLines`、`draw`；Canvas 文字排版，不負責畫整張賓果 | **優先** |
| 網頁基本適配 | [Responsive Base](https://lib.stillnessbyslowly.com/ui/responsive.css) | 基礎跨裝置安全規則；實際 5×5 造型與字體仍由宿主設計 | **優先** |
| 覆寫／刪除前確認 | [Confirm JS](https://lib.stillnessbyslowly.com/ui/confirm/confirm.js)＋[CSS](https://lib.stillnessbyslowly.com/ui/confirm/confirm.css) | `SlowlyConfirm.show(options)` 回傳 `Promise<boolean>`；確認後執行何種操作由宿主決定 | **優先** |
| 互動回饋訊息 | [Toast JS](https://lib.stillnessbyslowly.com/ui/toast.js)＋[CSS](https://lib.stillnessbyslowly.com/ui/toast.css) | `SlowlyToast.create(target)`、`instance.show(message)`；樣式自訂 | **優先** |

> `FictionStorage` 自身也能幫缺少 ID 的記錄補 ID；本專案仍以**統一的 `RandomId` 預先建立三層 UID**為主，避免同名格子被當成同筆資料。`idField` 與資料欄位需在實作時對齊。

### 6.3 🔍 已確認有對應能力，但是否接入依 UI／效果而定

| 使用情境 | 可引用的零件 | 已確認的限制／判斷 |
|---|---|---|
| 依已完成格子掃橫、直線 | [Grid Line Match](https://lib.stillnessbyslowly.com/game/grid/line_match.js) | `SlowlyGridLineMatch.find(grid, { minLength, getValue, isBlocked })` 僅掃 **橫／直**，**不含斜線**；賓果斜線需宿主補足，也可宿主直接計算全部 12 條 |
| 條件式反覆打亂棋盤 | [Grid Shuffle Until](https://lib.stillnessbyslowly.com/game/grid/shuffle_until.js) | `SlowlyGridShuffleUntil.run(grid, { shuffle, accept, maxAttempts })`；會重排原 2D grid；**單純打亂不需要**此零件，用 `FictionShuffle` 即可 |
| 同名格子與實體格子區分 | [Card Instance Identity](https://lib.stillnessbyslowly.com/game/card/strategy/card_instance_identity.js) | `CardInstanceIdentity.findDuplicateInstanceIds`／`groupByCardType` 等；**不產生 ID**、資料欄位偏向卡牌。可參考「種類 ID／實體 ID」概念，**不強制接入** |
| 賓果連線動畫 | [Sweep Line JS](https://lib.stillnessbyslowly.com/effects/line/sweep_line.js)＋[CSS](https://lib.stillnessbyslowly.com/effects/line/sweep_line.css) | `SlowlySweepLine.create(root).play(...)`；只支援**水平／垂直**方向，**不能直接畫對角賓果線** |
| 完成線爆光 | [Area Burst JS](https://lib.stillnessbyslowly.com/effects/light/area_burst.js)＋[CSS](https://lib.stillnessbyslowly.com/effects/light/area_burst.css) | `SlowlyAreaBurst.create(root).play(...)`；可在目標格／區域爆亮，**不幫忙判定賓果** |
| 作者選題的彈出面板 | [Modal](https://lib.stillnessbyslowly.com/ui/modal/modal.js) | `SlowlyModal.create(dialog)`，基於 `<dialog>`；宿主自行放入「36項跨類勾選與次數」介面 |
| 分類切換／多頁管理 | [Tabs JS](https://lib.stillnessbyslowly.com/ui/tabs/tabs.js)＋[CSS](https://lib.stillnessbyslowly.com/ui/tabs/tabs.css) | 負責同頁分頁操作，不負責小說／賓果資料持久化 |
| 類別下拉 | [Custom Select JS](https://lib.stillnessbyslowly.com/ui/custom_select.js)＋[CSS](https://lib.stillnessbyslowly.com/ui/custom_select.css) | 適合**單值下拉**，不是多選36項的直接替代；多選題目可用宿主 checkbox |
| 編輯／刪除選單 | [Action Menu JS](https://lib.stillnessbyslowly.com/ui/menu/action_menu.js)＋[CSS](https://lib.stillnessbyslowly.com/ui/menu/action_menu.css) | 只負責操作選單，不負責業務操作 |
| 分類折疊列表 | [Accordion](https://lib.stillnessbyslowly.com/ui/accordion/accordion.js) | 可用於 6 大分類選題區；也可用原生 `<details>` 而不額外引 JS |
| 展示完成百分比 | [Stat Bar CSS](https://lib.stillnessbyslowly.com/ui/progress/stat_bar.css) | 僅為 CSS 進度條外觀；計算 `已完成 / 25` 由宿主負責 |
| 備份 JSON | [Data Backup](https://lib.stillnessbyslowly.com/data/Data_backup.js) | `DataBackup.createPayload`／`downloadJson`／`readJsonFile`；備份匯入的驗證策略由宿主負責 |
| JSON 匯入驗證與回退 | [JSON Safe Import](https://lib.stillnessbyslowly.com/data/json/json_safe_import.js)、[Import Rollback](https://lib.stillnessbyslowly.com/data/import/import_rollback.js)、[Import Merge](https://lib.stillnessbyslowly.com/data/import/import_merge.js) | 適合日後 JSON 備份匯入；**不能直接等同於已完成本專案的 schema 驗證與 UID 衝突處理** |
| DOM 畫面轉圖流程 | [DOM Capture](https://lib.stillnessbyslowly.com/Image/dom_capture.js) | 接受外部 `renderer` 才能轉成 Canvas／Blob；**不含 DOM → Canvas 的 renderer**，不可誤以為可直接截圖 |
| 裝置系統分享 | [Web Share](https://lib.stillnessbyslowly.com/ui/share/web_share.js) | 可選，用於 PNG 完成後交給手機系統分享；需考慮相容性 |

**展示卡較穩定的做法（💡 建議）**：由宿主把 5×5 牌面、題目文字、完成狀態**直接繪製到 Canvas** → 軍火庫 `Wrapped Text` 協助換行 → `Canvas PNG` 轉 Blob → `PNG Download` 下載。避免以為 `DOM Capture` 自己就能完成 HTML 截圖。

### 6.4 不應為了「有零件」就硬接的功能

- **Grid Gravity／Grid Swap Search／Grid Chain Expand**：處理三消掉落、相鄰交換、連鎖；構思賓果不是三消，不需要。
- **Grid Line Match** 不支援斜線；**Sweep Line** 不支援斜線。兩者不能各自單獨完成完整的 12 線賓果邏輯與動畫。
- **Deck** 處理抽牌、手牌、棄牌堆；本專案只需打亂／抽題，通常不必建立完整牌庫生命週期。
- **Card Instance Identity** 是概念與查重候選，不應取代 `RandomId`，也不應把格子強行當策略卡牌。
- **Fiction Select Or Create** 會考慮同名既有 ID 的回用情境，與本專案「同名可不同實體 UID」不同，**不可直接用它來決定格子 UID**。

## 7. 🔍 舊版三消（`match3_v1`）對照

提供的 `match3_v1.html` 以 `https://lib.stillnessbyslowly.com/...` 分開載入 `SlowlyRandom`、`FictionShuffle`、`FictionStorage`、`SlowlyGridLineMatch`、`SlowlyGridShuffleUntil`、`SlowlySweepLine`、`SlowlyAreaBurst` 等。

`match3_v1.js` 的可參考呼叫方式：

- 隨機整數：`SlowlyRandom.int(0, COLORS - 1)`。
- 排列：`FictionShuffle.shuffle(values)`。
- 需限制新排列條件的棋盤洗牌：`SlowlyGridShuffleUntil.run(grid, { shuffle, accept, maxAttempts })`；**賓果純排列通常不需要 accept 迴圈**。
- 本機儲存：`FictionStorage.create({ namespace: "SBS_match3_rank_v2" })` 與 `.collection(...)`。
- 掃描三消橫／直連線：`SlowlyGridLineMatch.find(...)`；**不能直接當完整賓果判定**。
- 效果：`SlowlySweepLine.create(...)`／`SlowlyAreaBurst.create(...)`。

此三消為**參考程式**，不是要把其 8×8、交換糖果、特殊糖、倒數計時、排行榜或計分規則搬到賓果。

## 8. 💡 建議實作責任分界

依使用者既有習慣，功能與 UI 從初期即分離；**五檔起手**可參考：

```text
desk/
└── novel/
    └── bingo/
        ├── index.html          # 5×5 結構與外部軍火庫引入
        ├── bingo.css           # 賓果格子／完成／連線等功能必要樣式
        ├── bingo.js            # 題庫、生成規則、UID、狀態、儲存、判定
        ├── bingo_style.css     # 排版、色彩、響應式、外觀
        └── bingo_style.js      # 分頁、面板、UI 操作、展示卡互動
```

五檔是建議骨架，**不是**已同意的最終檔名；若核心邏輯未來變大，再依責任拆檔。CSS 與 JS 全部正常分行縮排，**禁止 minify 或壓成單行**。只從軍火庫直接引用已存在的功能，不複製其程式到 `vendor`、`arsenal`、`lib` 等專案副本。

### 8.1 格子完成與賓果判定

1. 畫面顯示時，由 `board_uid` 讀出當張牌，再依每格 `cell_uid` 對應其完成狀態。
2. 點格子：只切換該 **cell_uid** 的 `completed`，立刻同步儲存。
3. 以當下 5×5 格子的完成值，驗算 **5 橫 + 5 直 + 2 斜**，求出所有已完成線。
4. 新增完成線時觸發慶祝動畫；取消完成則重新計算線數，不應繼續錯誤顯示達成。
5. 改變格子位置後重新判斷賓果；**完成狀態跟著 UID 走，賓果連線結果則會隨位置變化**。

### 8.2 安全保存

- 本機儲存應區隔專案 namespace，避免與其他慢慢網站資料撞鍵。
- 新建賓果：先完整產生 25 格與 UID，驗證數量及 UID 唯一性，成功再儲存。
- 操作儲存失敗（例如容量不足）應提示作者，**不可默默當成成功**。
- 更新或改名不可改掉已有 UID；刪牌、替換題目、批次重新抽題前應提供保護。
- 未來匯入備份需處理版號、結構合法性、UID 衝突、回復；資料已含筆記時，絕不能當成純文字題庫任意覆蓋。

## 9. ⏳ 仍需在實作前決定／測試的事項

1. **隨機抽選權重與分類比例**：已定「前四類可重複、後兩類不重複」，但每類比例、是否偏向未完成仍未形成確切演算法。
2. **自訂牌剩餘格數分配**：作者只指定部分次數時，剩餘格子是否每個已勾題目保底 1 格、是否平均，待定。
3. **重新抽題與已儲存筆記**：區分「重排舊格子」與「抽出新格子」，針對被替換的舊格子要有保留／封存／復原方案；筆記版推出前就應避免不可逆覆蓋。
4. **賓果斜線動畫**：判定可由宿主完成；視覺可用其他合適軍火庫零件或自有 UI，實作前再核對，不能把只支援橫／直的 Sweep Line 當斜線繪製器。
5. **PNG 展示卡規格**：版面、色系、藝術字如何安置、文字過長省略策略，以及是否顯示作品名／賓果牌名。
6. **UID 附加驗證與備份版本**：考量極少數 ID 衝突或匯入重號；即使 `randomUUID()` 也要妥善處理既有 ID。
7. **實際裝置測試**：5×5 手機觸控、密集文字可讀性、不同螢幕寬度、`prefers-reduced-motion`、瀏覽器關閉後本機資料恢復。
8. **軍火庫最新版本再核對**：正式施工前重新讀 `index_data.js` 的**描述**、相關 usage/demo/test 頁、實際來源 API 與依賴；此文件記錄的是 2026-10-23 的查驗結果。

## 10. 原始資料、資產與檢查入口

- 軍火庫：[首頁](https://lib.stillnessbyslowly.com/)｜[GitHub 索引 `index_data.js`](https://github.com/xiayian505-ship-it/stillnessbyslowly_data_core/blob/main/index_data.js)（實際預設分支以 GitHub 為準）。
- 內部參考：使用者提供 `match3_v1.html`、`match3_v1.js`、`match3_v1.css`（舊版三消；已閱讀其軍火庫引用和洗牌／儲存／連線用法）。
- 內部參考：使用者先前提供《小說構思操作手冊 v1.3》以及 `Fiction_v3_0`；**本賓果使用本文件36題，而非直接把 `Fiction_v3_0` 的小說類型清單替代這36題**。
- 視覺資產：[構思賓果陰陽橫式 PNG](https://img.stillnessbyslowly.com/images/2026/10/f1226ede-34dd-4107-a659-da1d1db89897_%E6%A7%8B%E6%80%9D%E8%B3%93%E6%9E%9C_yin-yang_horizontal_2x.png)（主視覺／預覽可使用；SVG 化尚未定案）。

---

**本文件用途：作為已建立的構思賓果 v1.0.0 第一版工程規格依據；尚未修改使用者的 GitHub 專案或軍火庫。**


## 11. v0.3 實作補充（2026-10-23）

> 以下是第一版落地後的具體實作選擇；優先保留前文已定規格，不將尚待決定的構思規則默認為使用者已認可的要求。詳細安裝、資料與測試方式見 `README.md`。

- 已建立 `index.html`、`bingo.css`、`bingo.js`、`bingo_style.css`、`bingo_style.js`；軍火庫透過 HTTPS 絕對路徑直接載入，沒有複製或 vendor 其程式。
- 使用**軍火庫原生 namespace 格式**：`FictionStorage.create({ namespace: "sbs_story_bingo" })`；實際 localStorage keys 是 `sbs_story_bingo:novels`、`:boards`、`:cells`、`:settings`。
- 牌 UID、小說 UID、格子 UID 分別使用 `RandomId.create({ prefix: "board-" })`、`novel-`、`cell-`；題目的 `topic_id` 是穩定型別代碼而非實體 UID。
- 已完成固定／隨機／自訂三模式。自訂題目留白次數的項目保底一格、剩餘格數於這些未指定題目間隨機分配。這是本版明示的簡單策略，可以後續修訂。
- **隨機選題暫用符合規則的候選題目等機率抽取**；前四類可重複、後兩類不可重複。**未完成優先加權功能沒有做**，因前文仍未決定跨不同 cell_uid 的優先意義。
- 初版不提供覆蓋舊格子重新抽題的功能：新增新牌可再抽一批，已有牌僅重新排列（保留 UID／完成狀態）。
- 展示卡只畫小說名、牌名、25題、完成勾選與賓果連線；Canvas 由宿主繪製，軍火庫處理文字換行／PNG 轉換／下載；沒有把未來的私人筆記混入圖片。
- 已通過 JS 靜態語法檢查與隔離瀏覽器互動測試（使用測試限定的軍火庫 API 模擬器）：固定牌 25 格與配角重複、隨機模式 ⑤⑥ 不重複、自訂指定次數、打亂保留 UID 與完成狀態、滿牌 12 條賓果及 PNG 處理流程。**尚須部署後以真實軍火庫驗證網路載入、localStorage 與手機 PNG。**
- 尚未實作每格構思筆記與 JSON 備份／匯入。作者清除網站資料可能失去資料，不能把此版當唯一原稿保存位置。
