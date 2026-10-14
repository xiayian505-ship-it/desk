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

  // 主頁副標文字仍由 JSON 管理；重複的兩段軌道供軍火庫 Marquee 無縫循環。
  // 複本只是視覺效果，輔助工具僅讀取原句一次。
  function showTagline(value) {
    const root = byId("wordTagline");
    const text = String(value || "").trim();
    const readable = el("span", "word-tagline-reading", text);
    root.replaceChildren(readable);
    if (!text) return;

    const track = el("span", "slowly-marquee__track");
    track.setAttribute("aria-hidden", "true");
    // 一輪文字寬度大於桌機可見範圍，避免跑馬燈在寬螢幕露出空白。
    // 只重複原始副標文案，不加入星號、分隔圖示或其他裝飾字元。
    const cycleText = Array(5).fill(text).join("　　") + "　　";
    const cycle = el("span", "word-tagline-cycle", cycleText);
    track.append(cycle, cycle.cloneNode(true));
    root.append(track);
  }

  // 05 格式說明：資料只負責內容，互斥展開由軍火庫 Tree Selection 控制。
  // 此層只需要 SVG、PNG 等格式；其下的小標題單純閱讀，不再套收合。
  function appendTextBlocks(target, value) {
    String(value || '').split(/\n\s*\n/).filter(Boolean).forEach(paragraph => {
      target.append(el("p", "", paragraph.trim()));
    });
  }

  function buildFormats(formats) {
    const root = el("div", "notice-format-list");
    const formatTree = window.TreeSelection?.create({ expansion: "single" }) || null;
    const panels = [];

    formats.forEach((format, index) => {
      const key = String(format.id || `format-${index + 1}`);
      const article = el("details", "notice-format");
      article.name = "slowly-download-formats";
      const header = el("summary", "notice-format-toggle", format.title || "");
      const body = el("div", "notice-format-body");
      appendTextBlocks(body, format.intro);

      (Array.isArray(format.variants) ? format.variants : []).forEach(variant => {
        const section = el("section", "notice-format-variant");
        section.append(el("h4", "notice-format-variant-title", variant.title || ""));
        appendTextBlocks(section, variant.text);
        body.append(section);
      });
      article.append(header, body);
      root.append(article);
      panels.push({ key, article, header });
    });

    if (formatTree) {
      panels.forEach(({ key, header }) => {
        header.addEventListener("click", event => {
          event.preventDefault();
          formatTree.toggleExpanded(key);
          panels.forEach(panel => {
            panel.article.open = formatTree.isExpanded(panel.key);
          });
        });
      });
    } // 軍火庫暫時無法載入時，原生 details + name 仍可互斥收合。
    return root;
  }

  async function showNotes() {
    const heading = byId("notesTitle");
    const list = byId("noticeList");
    try {
      const data = await readJSON("./index_notes.json");
      if (!data.notes || !Array.isArray(data.notes.items)) throw new Error("說明資料格式不正確");
      showTagline(data.tagline);
      byId("searchHint").textContent = data.searchHint || "";
      const notesTitle = String(data.notes.title || "").trim();
      heading.textContent = notesTitle;
      heading.hidden = !notesTitle;
      if (!notesTitle) {
        const section = list.closest(".notes");
        section?.removeAttribute("aria-labelledby");
        section?.setAttribute("aria-label", "藝術字授權與說明");
      }

      // 只借用軍火庫 Tree Selection 的展開狀態；宿主負責 HTML、CSS 與文字。
      // 若外部零件暫時讀不到，仍保留原生 details 的基本收合功能。
      const tree = window.TreeSelection?.create({ expansion: "single" }) || null;
      const panels = [];
      const nodes = data.notes.items.map((item, index) => {
        const key = String(item.id || `item-${index + 1}`);
        const id = `notice-content-${index + 1}`;
        const article = el("details", "notice");
        article.name = "slowly-notices";
        const header = el("summary", "notice-toggle");
        const num = el("span", "notice-index", String(index + 1).padStart(2, "0"));
        num.setAttribute("aria-hidden", "true");
        const title = el("span", "notice-title", item.title || "");
        header.append(num, title);

        const body = el("div", "notice-body");
        body.id = id;
        // 正式授權與一般文案仍使用純文字欄位，不解讀 HTML。
        appendTextBlocks(body, item.text);
        if (Array.isArray(item.formats)) body.append(buildFormats(item.formats));
        article.append(header, body);
        panels.push({ key, article, header });
        return article;
      });
      list.replaceChildren(...nodes);

      if (tree) {
        panels.forEach(({ key, header }) => {
          header.addEventListener("click", event => {
            event.preventDefault();
            tree.toggleExpanded(key);
            panels.forEach(panel => {
              panel.article.open = tree.isExpanded(panel.key);
            });
          });
        });
      } else {
        console.warn("[慢慢看] Tree Selection 暫時無法載入，改用瀏覽器原生收合。");
      }
    } catch (error) {
      console.error("[慢慢看] 說明 JSON 讀取失敗：", error);
      heading.textContent = "";
      heading.hidden = true;
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
        const description = el("p", "", mode.description || "");
        if (mode.eyebrow) copy.append(el("p", "section-number", mode.eyebrow));
        copy.append(heading, description);
        const link = el("a", "svg-viewer-entry-link", mode.linkText || "開啟檢視室");
        link.href = href;
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
