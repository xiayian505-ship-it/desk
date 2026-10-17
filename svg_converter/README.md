# SVG 動畫轉檔室（獨立測試版）

這是從 Claude 的 `svg-converter.zip` 重新整理的測試網頁。**尚未抽成軍火庫，也沒有修改任何慢慢軍火庫檔案。**

## 如何部署

把整個 `svg-converter/` 資料夾上傳到 GitHub Pages 網站，然後開啟 `index.html`。這是靜態前端工具；不需要後端。網頁要能存取 `https://lib.stillnessbyslowly.com/`，才可使用 PNG 和影片匯出零件。

`index.html` 是此獨立資料夾的首頁，不會修改原有 `word/` 網站。

## 五檔拆分與其他檔案

- `index.html`：網頁 HTML 結構與軍火庫 HTTPS 引用
- `svg_converter.css`：Canvas／預覽及操作狀態所需的功能樣式
- `svg_converter.js`：SVG 安全解析、SMIL/CSS 動畫取樣、PNG/GIF/影片產生與下載流程
- `svg_converter_style.css`：網頁的顏色、版面、響應式排版
- `svg_converter_style.js`：按鈕互動、拖曳、來源編輯、狀態與錯誤訊息
- `svg_gif_encoder.js`：本專案必需的獨立 GIF 編碼器（屬功能，未放進軍火庫）

`README.md` 僅為本次交付的使用說明。

## 會引用的軍火庫零件

全部透過 HTTPS，沒有儲存軍火庫副本：

- `Image/png/canvas_png.js`、`Image/png/png_download.js`
- `data/blob/blob_url.js`、`data/file/filename_sanitize.js`
- `video/recording/mime_type.js`
- `video/recording/media_recorder.js`
- `video/recording/recorded_chunks.js`

原本軍火庫 `video/capture/capture_stream.js` 是擷取 **video 元素**，不能直接擷取 SVG；因此本工具使用瀏覽器原生 Canvas `captureStream()`，再把串流交給軍火庫 MediaRecorder，沒有重寫現有錄影器。

## 轉檔原理與目前限制

原版透過 `<img>` 渲染動態 SVG，再對同一張圖片重複 `drawImage`，可能抓到一樣的影格。本版將 SVG 掛到頁面，調整 SMIL / CSS 動畫時間，讀取當下的動畫屬性與計算樣式，凍結成單幀 SVG，再繪製到 Canvas。

這種方式可以處理多數基礎 SMIL `<animate>`、`<animateTransform>`、CSS keyframes 改變的視覺樣式；**不保證**支援所有動態 SVG：例如 `<animateMotion>`、複雜路徑變形、JavaScript 驅動動畫、外部網路圖片／字型或特別複雜的遮罩。如果輸出動畫與預覽不同，就先不要把此工具當正式轉檔服務。

- PNG：可以選擇透明或實色，取指定秒數的單一畫格。
- GIF：可以透明，但只有 256 色與二值透明；寬度上限 640px、影格總 RAM 預算上限 100 MB。
- WebM／MP4：輸出成實色背景。**只有瀏覽器宣告支援該 MIME 才顯示可按**，不是 WebM 轉名成 MP4。影片需要即時錄製，請不要切到背景分頁。
- GIF / 影片若偵測到來源動畫、但抽出的影格全部相同，會顯示錯誤而不是假裝轉換成功。
- 輸入 SVG 會刪掉 script、事件屬性、foreignObject 和外部 HTTP 載入內容。僅供受信任作品測試，不能當作完整的 SVG 防毒或清洗系統。
- 輸出字型受當下裝置可用字體影響；文字未轉 path 時換裝置可能不同。

## 建議實際部署驗收

1. 開啟頁面，預設就能看到轉動的虛線圓環、會脈動的黃色中心圓。
2. 預設寬度 400px，先下載 PNG、GIF。確認 GIF 輪播時，虛線與中心圓**真的有變化**。
3. 依瀏覽器支援狀況分別下載 WebM、MP4，打開播放至少 3 秒，確認有移動且背景符合設定。
4. 再上傳你的《投我一票》直、橫式動態 SVG，檢查中文主字、票箱、選票、星星是否完整，尤其是動畫有沒有輸出。
5. 另拿一般靜態 SVG、1 字／4 字、不同尺寸測試；在 Samsung / Chrome 等真實使用環境再驗收。

### 注意

- ZIP 內的**五檔是骨架**，GIF 編碼另拆一支檔案；沒有為了湊五檔把編碼器塞進網頁互動檔。
- 本次與既有網站/軍火庫均無覆蓋關係；需要手動刪除的路徑：**0 個**。
- 如正式部署發現問題，請回傳 SVG 原始檔與輸出檔，才能精準針對動畫語法修正，而不是猜測。
