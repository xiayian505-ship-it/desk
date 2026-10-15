/* 慢慢藝術字｜頁面 UI
 * A～Z 切頁：慢慢軍火庫 SlowlyTabs。
 * 每頁五筆：SlowlyWordCatalog 呼叫軍火庫 FictionPaginate。
 * 搜尋：SlowlyWordCatalog 呼叫軍火庫 FictionSearch。
 * 宿主自己負責卡片呈現、URL hash、搜尋結果定位，不複製零件原始碼。
 */
(function (global) {
  "use strict";

  const catalog = global.SlowlyWordCatalog;
  const root = document.getElementById("wordTabs");
  const tabList = document.getElementById("wordTabList");
  const panelContainer = document.getElementById("letterPanels");
  const searchInput = document.getElementById("wordSearch");
  const searchStatus = document.getElementById("searchStatus");
  const searchResults = document.getElementById("searchResults");
  const bootMessage = document.getElementById("bootMessage");
  const collectionCount = document.getElementById("collectionCount");

  const missing = [
    ["SlowlyWordCatalog", catalog],
    ["SlowlyWordCover.create", global.SlowlyWordCover?.create],
    ["SlowlyTabs.create", global.SlowlyTabs?.create],
    ["FictionSearch.search", global.FictionSearch?.search],
    ["FictionPaginate.paginate", global.FictionPaginate?.paginate]
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missing.length) {
    const message = `主頁未能載入必要零件：${missing.join("、")}。請確認軍火庫 HTTPS 連結。`;
    console.error("[SlowlyWord]", message);
    bootMessage.hidden = false;
    bootMessage.textContent = message;
    return;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text != null) element.textContent = String(text);
    return element;
  }

  function createCard(item) {
    const card = createElement("article", "word-card");
    card.dataset.code = item.code;

    // 共用封面：只替換作品名稱，不再維護 33 種專屬色卡。
    const visual = global.SlowlyWordCover.create(item);

    const content = createElement("div", "card-content");
    const top = createElement("div", "card-top");
    top.append(
      createElement("span", "card-code", item.code.toUpperCase()),
      createElement("span", "card-subtitle", item.subtitle)
    );

    const heading = createElement("h3", "", item.title);
    const desc = createElement("p", "", item.desc);
    const link = createElement("a", "card-entry", "進入藝術字產生器");
    link.href = item.href;
    link.setAttribute("aria-label", `進入 ${item.title} 產生器`);

    content.append(top, heading, desc, link);
    card.append(visual, content);
    return card;
  }

  function getPanel(letter) {
    return document.getElementById(`letter-panel-${letter}`);
  }

  function getHash(letter, page) {
    if (!letter || letter === "directory") return "";
    return `#${letter}${page > 1 ? `-${page}` : ""}`;
  }

  function updateHash(letter, page = 1) {
    const url = new URL(global.location.href);
    const hash = getHash(letter, page);
    if (url.hash === hash) return;
    url.hash = hash;
    global.history.replaceState(null, "", url.href);
  }

  function renderLetter(letter, pageNumber = 1, highlightCode = null) {
    const panel = getPanel(letter);
    if (!panel) return;

    const result = catalog.getPage(letter, pageNumber);
    const count = catalog.getItems(letter).length;
    const countText = panel.querySelector(".letter-count");
    const list = panel.querySelector(".letter-list");
    const pagination = panel.querySelector(".pagination");

    countText.textContent = count ? `${count} 款藝術字` : "尚未收錄";
    list.replaceChildren();
    pagination.replaceChildren();

    if (!count) {
      const empty = createElement("p", "empty-letter", `${letter} 分頁還沒有作品。慢慢來，留一個位置給未來。`);
      list.append(empty);
    } else {
      result.data.forEach(item => list.append(createCard(item)));
    }

    if (result.totalPages > 1) {
      pagination.hidden = false;

      for (let number = 1; number <= result.totalPages; number += 1) {
        const button = createElement("button", "page-button", number);
        button.type = "button";
        button.setAttribute("aria-label", `${letter} 分頁第 ${number} 頁`);
        if (number === result.page) button.setAttribute("aria-current", "page");
        button.addEventListener("click", () => {
          renderLetter(letter, number);
          updateHash(letter, number);
          panel.scrollIntoView({
            behavior: global.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start"
          });
        });
        pagination.append(button);
      }
    } else {
      pagination.hidden = true;
    }

    if (highlightCode) {
      const target = Array.from(list.querySelectorAll(".word-card"))
        .find(card => card.dataset.code === highlightCode);

      if (target) {
        target.scrollIntoView({
          behavior: global.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "center"
        });
        target.classList.remove("search-target");
        void target.offsetWidth;
        target.classList.add("search-target");
        global.setTimeout(() => target.classList.remove("search-target"), 1900);
      }
    }

    return result;
  }

  catalog.letters.forEach(letter => {
    const tab = createElement("button", "", letter);
    tab.type = "button";
    tab.dataset.viewTarget = letter;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", "false");
    tabList.append(tab);

    const panel = createElement("section", "view-panel letter-panel");
    panel.dataset.viewPanel = letter;
    panel.id = `letter-panel-${letter}`;
    panel.hidden = true;

    const header = createElement("div", "section-heading");
    const info = createElement("div");
    info.append(
      createElement("p", "section-number", `${letter} / LETTERING`),
      createElement("h2", "", `${letter} 系列`)
    );
    header.append(info, createElement("p", "section-side-note letter-count"));

    const list = createElement("div", "letter-list");
    const pagination = createElement("nav", "pagination");
    pagination.setAttribute("aria-label", `${letter} 系列作品頁碼`);
    panel.append(header, list, pagination);
    panelContainer.append(panel);
  });

  collectionCount.textContent = `目前收錄 ${catalog.items.length} 款`;

  const tabs = global.SlowlyTabs.create(root, {
    initial: "directory",
    onChange({ name }) {
      if (name === "directory") {
        updateHash("directory");
      } else {
        renderLetter(name, 1);
        updateHash(name, 1);
      }
    }
  });

  function openLetter(letter, pageNumber = 1, highlightCode = null) {
    if (!catalog.letters.includes(letter)) return;
    tabs.show(letter);
    const result = renderLetter(letter, pageNumber, highlightCode);
    updateHash(letter, result?.page || 1);
  }

  function renderSearch(value) {
    const query = String(value || "").trim();
    searchResults.replaceChildren();
    searchStatus.textContent = "";
    if (!query) return;

    const matches = catalog.search(query);
    searchStatus.textContent = matches.length
      ? `找到 ${matches.length} 款藝術字` : "目前沒有符合的作品。";

    matches.forEach(item => {
      const location = catalog.locate(item.code);
      const button = createElement("button", "search-result");
      button.type = "button";
      const info = createElement("span");
      info.append(
        createElement("strong", "", item.title),
        createElement("small", "", `${item.code.toUpperCase()} · ${location.letter} 分頁`)
      );
      button.append(info);
      button.setAttribute("aria-label", `前往 ${item.title}，${location.letter} 分頁`);
      button.addEventListener("click", () => openLetter(location.letter, location.page, item.code));
      searchResults.append(button);
    });
  }

  function readHash() {
    const hash = decodeURIComponent(global.location.hash.slice(1));
    const match = /^([a-z])(?:-(\d+))?$/i.exec(hash);
    if (!match) return null;
    return {
      letter: match[1].toUpperCase(),
      page: Number(match[2] || 1)
    };
  }

  const initial = readHash();
  if (initial) openLetter(initial.letter, initial.page);

  global.addEventListener("hashchange", () => {
    const target = readHash();
    if (target) openLetter(target.letter, target.page);
    else tabs.show("directory");
  });

  searchInput.addEventListener("input", () => renderSearch(searchInput.value));
})(window);
