/* 慢慢封面｜資料層
 * 搜尋與分頁由軍火庫 FictionSearch / FictionPaginate 執行。
 * 無 DOM 操作；新增模板不修改本檔。
 */
(function (global) {
  "use strict";
  const PAGE_SIZE = 5;
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const rawItems = global.SlowlyCoverIndex;

  if (!Array.isArray(rawItems)) {
    throw new Error("[SlowlyCover] 缺少 index_data.js 的封面目錄。");
  }

  const seen = new Set();
  const items = rawItems.map((item, index) => {
    const code = String(item.code || "").trim();
    if (!/^[a-z][a-z0-9_-]*$/.test(code)) {
      throw new Error(`[SlowlyCover] 第 ${index + 1} 筆模板的 code 必須為英文小寫：${code}`);
    }
    if (seen.has(code)) {
      throw new Error(`[SlowlyCover] 重複的英文代號：${code}`);
    }
    if (!String(item.title || "").trim()) {
      throw new Error(`[SlowlyCover] ${code} 缺少中文顯示名稱。`);
    }
    seen.add(code);
    return Object.freeze({
      code,
      title: String(item.title).trim(),
      subtitle: String(item.subtitle || ""),
      desc: String(item.desc || ""),
      keywords: Array.isArray(item.keywords) ? item.keywords.slice() : [],
      href: `./${code}/index.html`,
      letter: code.charAt(0).toUpperCase()
    });
  }).sort((a,b) => a.code.localeCompare(b.code, "en"));

  function getItems(letter) {
    const selected = String(letter || "").toUpperCase();
    return items.filter(item => item.letter === selected);
  }

  function getPage(letter, pageNumber = 1) {
    if (!global.FictionPaginate?.paginate) {
      throw new Error("[SlowlyCover] 軍火庫 FictionPaginate 尚未載入。");
    }
    return global.FictionPaginate.paginate(getItems(letter), {
      pageSize: PAGE_SIZE, page: pageNumber
    });
  }

  function search(query) {
    const terms = String(query || "").trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    if (!global.FictionSearch?.search) {
      throw new Error("[SlowlyCover] 軍火庫 FictionSearch 尚未載入。");
    }
    const fields = ["code", "letter", "title", "subtitle", "desc", "keywords"];
    return terms.reduce((matches, term) => global.FictionSearch.search(matches, term, fields), items);
  }

  function locate(code) {
    const entry = items.find(item => item.code === code);
    if (!entry) return null;
    const position = getItems(entry.letter).findIndex(item => item.code === code);
    return {
      letter: entry.letter,
      page: Math.floor(position / PAGE_SIZE) + 1,
      entry
    };
  }

  global.SlowlyCoverCatalog = Object.freeze({
    letters: LETTERS, pageSize: PAGE_SIZE, items,
    getItems, getPage, search, locate
  });
})(window);
