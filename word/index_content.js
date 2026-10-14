"use strict";
/* 慢慢看｜純文案載入：作品目錄仍由 index_data.js 管理。
 * 兩份 JSON 各自獨立載入，任一份失敗都不會阻斷作品搜尋及分頁。
 */
(function () {
  function byId(id) { return document.getElementById(id); }

  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value != null) node.textContent = String(value);
    return node;
  }

  async function readJSON(path) {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`${path}：HTTP ${response.status}`);
    return response.json();
  }

  async function showNotes() {
    const heading = byId("notesTitle");
    const list = byId("noticeList");
    try {
      const data = await readJSON("./index_notes.json");
      if (!data.notes || !Array.isArray(data.notes.items)) throw new Error("說明資料格式不正確");
      byId("wordTagline").textContent = data.tagline || "";
      byId("searchHint").textContent = data.searchHint || "";
      heading.textContent = data.notes.title || "";
      list.replaceChildren();
      data.notes.items.forEach((item, index) => {
        const article = el("article", "notice");
        const num = el("span", "notice-index", String(index + 1).padStart(2, "0"));
        num.setAttribute("aria-hidden", "true");
        const copy = document.createElement("div");
        copy.append(el("h3", "", item.title || ""), el("p", "", item.text || ""));
        article.append(num, copy);
        list.append(article);
      });
    } catch (error) {
      console.error("[慢慢看] 說明 JSON 讀取失敗：", error);
      heading.textContent = "使用前，看一下";
      list.replaceChildren(el("p", "search-status", "說明文字載入失敗，請稍後重新整理。"));
    }
  }

  function safeLocalHref(value) {
    if (typeof value !== "string" || !value.startsWith("./")) return null;
    const url = new URL(value, document.baseURI);
    const base = new URL("./", document.baseURI);
    return url.origin === base.origin && url.pathname.startsWith(base.pathname) ? url.href : null;
  }

  async function showViewers() {
    const root = byId("viewerEntries");
    try {
      const data = await readJSON("./viewer_content.json");
      if (!Array.isArray(data.modes)) throw new Error("檢視室資料格式不正確");
      const cards = data.modes.map(mode => {
        const href = safeLocalHref(mode.href);
        if (!href) throw new Error(`檢視室連結有誤：${mode.id || "unknown"}`);
        const card = el("section", "svg-viewer-entry");
        const copy = el("div", "svg-viewer-entry-copy");
        const heading = el("h2", "", mode.title || "");
        heading.id = `viewer-mode-${String(mode.id || "item").replace(/[^a-z0-9-]/gi, "")}`;
        card.setAttribute("aria-labelledby", heading.id);
        const eyebrow = el("p", "section-number", mode.eyebrow || "");
        const description = el("p", "", mode.description || "");
        copy.append(eyebrow, heading, description);
        const link = el("a", "svg-viewer-entry-link", mode.linkText || "開啟檢視室");
        link.href = href;
        link.append(el("span", "", " →"));
        card.append(copy, link);
        return card;
      });
      root.replaceChildren(...cards);
    } catch (error) {
      console.error("[慢慢看] 檢視室 JSON 讀取失敗：", error);
      root.replaceChildren(el("p", "search-status", "檢視室入口載入失敗，請稍後重新整理。"));
    }
  }

  showNotes();
  showViewers();
})();
