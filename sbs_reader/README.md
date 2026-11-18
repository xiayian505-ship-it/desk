# 慢 慢 | EPUB 閱讀器

給小說校稿時使用的本機 EPUB 預覽工具。

## 使用

1. 解壓縮整個資料夾，直接開啟 `index.html`。如手機不方便直接開啟本地網頁，可以把整個資料夾部署到 Cloudflare Pages 等靜態網站空間。
2. 點「開啟 EPUB」，選擇剛從製作器匯出的 `.epub`。
3. 用目錄跳章；可切換「翻頁／捲動」、調整字級、使用上一頁／下一頁。
4. 修改原稿並重新匯出 EPUB 後，**再點一次「開啟 EPUB」選新檔**。即使檔名一樣，也會重新讀取，不會偷偷使用舊版。

## 隱私與架構

- 純 HTML／CSS／JavaScript，沒有外部服務、資料庫、登入或第三方程式庫。
- EPUB 完全由瀏覽器本機讀取；不會上傳到網站或儲存到伺服器。
- 不會改寫 EPUB 內容，僅解析並顯示，書內 XHTML 與 CSS 仍由原 EPUB 提供。
- 支援一般 EPUB 3 的 OPF／nav 目錄、基本 EPUB 2 NCX、內嵌圖片、字型與 CSS。
- 支援一般 ZIP STORE、DEFLATE；壓縮型 EPUB 需要瀏覽器支援原生 `DecompressionStream('deflate-raw')`。建議用新版 Chrome。
- 內嵌腳本被禁用；外部網路資源不載入。

## 注意：它不是讀墨模擬器

這個工具用來快速檢查 **章節文字、段落、縮排、行距、章名、內嵌圖片與一般換頁**。

- 「翻頁」是瀏覽器 CSS 多欄排版的近似預覽，**不能保證和 Readmoo 一模一樣**。
- 字體、頁面切分、閱讀器自行覆蓋的行距、分頁規則等，正式上架前仍需回到 Readmoo／mooPub 實機檢查。
- EPUB 的程式碼、HTML 內未支援的內容，不會在這個工具內被執行。
- 目前不提供校稿編輯、不自動存書、不做檔案上架驗證；只負責閱讀預覽。
- 不支援加密／DRM EPUB、ZIP64 和特別複雜的排版。

## 檔案結構

```text
index.html
css/
    style.css
js/
    zip_reader.js
    epub_reader.js
    app.js
README.md
```

所有檔案均使用完整縮排與具意義的 snake_case 命名，沒有 minify。
