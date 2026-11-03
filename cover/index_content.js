"use strict";
/* 慢慢封面｜首頁內容：文字與工具連結和作品目錄獨立。 */
(function () {
  const byId = id => document.getElementById(id);
  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value != null) node.textContent = String(value);
    return node;
  }
  async function readJSON(path) {
    const response = await fetch(path, {cache: "no-cache"});
    if (!response.ok) throw new Error(`${path}：HTTP ${response.status}`);
    return response.json();
  }
  function showTagline(value) {
    const root = byId("coverTagline");
    const text = String(value || "").trim();
    const readable = el("span", "cover-tagline-reading", text);
    root.replaceChildren(readable);
    root.hidden = !text;
    if (!text) return;
    const track = el("span", "slowly-marquee__track");
    track.setAttribute("aria-hidden", "true");
    const phrase = Array(5).fill(text).join("　　") + "　　";
    const part = el("span", "cover-tagline-cycle", phrase);
    track.append(part, part.cloneNode(true));
    root.append(track);
  }
  function addParagraphs(container, value) {
    String(value || "").split(/\n\s*\n/).filter(Boolean).forEach(p => {
      container.append(el("p", "", p.trim()));
    });
  }
  function renderNotes(items) {
    const section = byId("notesSection");
    const list = byId("noticeList");
    if (!items.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    const tree = window.TreeSelection?.create({expansion: "single"}) || null;
    const panels = items.map((item, index) => {
      const article = el("details", "notice");
      article.name = "slowly-cover-notices";
      const summary = el("summary", "notice-toggle");
      const number = el("span", "notice-index", String(index+1).padStart(2,"0"));
      number.setAttribute("aria-hidden", "true");
      summary.append(number, el("span", "notice-title", item.title || ""));
      const body = el("div", "notice-body");
      addParagraphs(body, item.text);
      article.append(summary, body);
      return {key: String(item.id || `notice-${index+1}`), article, summary};
    });
    list.replaceChildren(...panels.map(panel=>panel.article));
    if (tree) {
      panels.forEach(panel=>panel.summary.addEventListener("click", event => {
        event.preventDefault();
        tree.toggleExpanded(panel.key);
        panels.forEach(other=>other.article.open = tree.isExpanded(other.key));
      }));
    }
  }
  async function showNotes() {
    try {
      const data = await readJSON("./index_notes.json");
      showTagline(data.tagline);
      byId("searchHint").textContent = data.searchHint || "";
      renderNotes(Array.isArray(data.notes?.items) ? data.notes.items : []);
    } catch (error) {
      console.error("[SlowlyCover] 首頁文字資料載入失敗：", error);
      byId("notesSection").hidden = true;
      // The title/目录 are independent of this optional content JSON.
    }
  }
  function safeHTTPS(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : null;
    } catch { return null; }
  }
  async function showTools() {
    const root = byId("viewerEntries");
    try {
      const data = await readJSON("./viewer_content.json");
      if (!Array.isArray(data.modes)) throw new Error("工具入口清單格式不正確");
      const cards = data.modes.map(mode => {
        const href = safeHTTPS(mode.href);
        if (!href) throw new Error(`無效的工具連結：${mode.id}`);
        const card = el("section", "svg-viewer-entry");
        const copy = el("div", "svg-viewer-entry-copy");
        const heading = el("h2", "", mode.title || "");
        heading.id = `tool-${String(mode.id || "entry").replace(/[^a-z0-9-]/gi, "")}`;
        card.setAttribute("aria-labelledby", heading.id);
        if (mode.eyebrow) copy.append(el("p", "section-number", mode.eyebrow));
        copy.append(heading);
        if (mode.description) copy.append(el("p", "", mode.description));
        const link = el("a", "svg-viewer-entry-link", mode.linkText || "前往工具");
        link.href = href;
        card.append(copy, link);
        return card;
      });
      root.replaceChildren(...cards);
    } catch(error) {
      console.error("[SlowlyCover] 工具入口載入失敗：", error);
      root.replaceChildren(el("p", "search-status", "工具入口載入失敗，請重新整理。"));
    }
  }
  showNotes();
  showTools();
})();
