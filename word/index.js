/* 慢慢藝術字｜資料層
 * 不控制 DOM 或頁面外觀。
 * 分頁資料使用軍火庫 FictionPaginate，不複製其實作。
 * 搜尋使用軍火庫 FictionSearch，不複製其實作。
 */
(function (global) {
  "use strict";

  const PAGE_SIZE = 5;
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const rawItems = global.SlowlyWordIndex;

  if (!Array.isArray(rawItems)) {
    throw new Error("[SlowlyWord] 缺少 index_data.js 的作品目錄。");
  }

  const seen = new Set();
  const items = rawItems.map((item, index) => {
    const code = String(item.code || "").trim().toLowerCase();

    if (!/^[a-z][a-z0-9_-]*$/.test(code)) {
      throw new Error(`[SlowlyWord] 第 ${index + 1} 筆作品的 code 無效：${code}`);
    }
    if (seen.has(code)) {
      throw new Error(`[SlowlyWord] 重複的英文代號：${code}`);
    }
    if (!/^https:\/\//.test(item.href || "")) {
      throw new Error(`[SlowlyWord] ${code} 缺少 HTTPS 絕對網址。`);
    }

    seen.add(code);

    return Object.freeze({
      ...item,
      code,
      letter: code.charAt(0).toUpperCase(),
      keywords: Array.isArray(item.keywords) ? item.keywords.slice() : []
    });
  }).sort((a, b) => a.code.localeCompare(b.code, "en"));

  function getItems(letter) {
    const selected = String(letter || "").toUpperCase();
    return items.filter(item => item.letter === selected);
  }

  function getPage(letter, pageNumber = 1) {
    if (!global.FictionPaginate?.paginate) {
      throw new Error("[SlowlyWord] 軍火庫 FictionPaginate 尚未載入。");
    }
    return global.FictionPaginate.paginate(getItems(letter), {
      pageSize: PAGE_SIZE,
      page: pageNumber
    });
  }

  function search(query) {
    const terms = String(query || "").trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];

    if (!global.FictionSearch?.search) {
      throw new Error("[SlowlyWord] 軍火庫 FictionSearch 尚未載入。");
    }

    const fields = ["code", "letter", "title", "subtitle", "phrase", "desc", "keywords"];
    return terms.reduce(
      (matches, term) => global.FictionSearch.search(matches, term, fields),
      items
    );
  }

  function locate(code) {
    const entry = items.find(item => item.code === code);
    if (!entry) return null;

    const index = getItems(entry.letter).findIndex(item => item.code === code);
    return {
      letter: entry.letter,
      page: Math.floor(index / PAGE_SIZE) + 1,
      entry
    };
  }

  global.SlowlyWordCatalog = Object.freeze({
    letters: LETTERS,
    pageSize: PAGE_SIZE,
    items,
    getItems,
    getPage,
    search,
    locate
  });
})(window);
