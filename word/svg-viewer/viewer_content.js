"use strict";
/* SVG 檢視室｜文字內容來自 word/viewer_content.json。
 * 不改動 File API、安全驗證、預覽或下載程式；JSON 只管理頁面說明。
 */
(async function () {
  try {
    const response = await fetch("../viewer_content.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const page = data.pages?.svg;
    if (!page) throw new Error("缺少 pages.svg 說明資料");
    const fields = {
      viewerPageTitle: "title",
      viewerEyebrow: "eyebrow",
      viewerLead: "lead",
      "viewer-privacy": "privacy",
      "viewer-placeholder": "placeholder"
    };
    for (const [id, key] of Object.entries(fields)) {
      const node = document.getElementById(id);
      if (node) node.textContent = page[key] || "";
    }
  } catch (error) {
    console.error("[SVG 檢視室] 文字 JSON 讀取失敗：", error);
    const lead = document.getElementById("viewerLead");
    if (lead) lead.textContent = "檢視室說明載入失敗，請重新整理。檔案仍只會在本機檢視。";
    const placeholder = document.getElementById("viewer-placeholder");
    if (placeholder) placeholder.textContent = "請選擇 SVG 檔案。";
    const privacy = document.getElementById("viewer-privacy");
    if (privacy) privacy.textContent = "檔案不會上傳；重新整理即清空。";
  }
})();
