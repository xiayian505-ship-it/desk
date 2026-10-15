"use strict";
/* 慢慢藝術字｜共用作品封面（DOM 結構）
 * 所有作品使用完全相同的封面排版，唯一的可變內容是作品名稱。
 * 要調整外觀請修改 word_cover.css；這裡只負責將文字放進封面。
 * 不依賴任何作品的 SVG 繪圖核心，也不冒充作品的實際生成效果。
 */
(function (global) {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function create(item) {
    const title = String(item?.phrase || item?.title || "慢慢藝術字").trim();
    const chars = Array.from(title);
    const cover = el("div", "word-cover");
    cover.setAttribute("role", "img");
    cover.setAttribute("aria-label", `${title}｜慢慢藝術字系列封面`);

    const header = el("div", "word-cover__header");
    header.setAttribute("aria-hidden", "true");
    header.append(
      el("span", "word-cover__brand", "慢慢藝術字"),
      el("span", "word-cover__edition", "SBS / LETTERING")
    );

    const stage = el("div", "word-cover__stage");
    stage.setAttribute("aria-hidden", "true");
    stage.append(el("span", "word-cover__orbit"));

    const name = el("span", "word-cover__name");
    name.dataset.length = String(chars.length);

    // 中文 1～4 字的通用封面：四字以兩行、每行兩字排版。
    // 不另外列出各款專屬 CSS；若有更長的名稱則依每兩字換行。
    for (let i = 0; i < chars.length; i += 2) {
      const row = el("span", "word-cover__row");
      chars.slice(i, i + 2).forEach(char => {
        row.append(el("span", "word-cover__glyph", char));
      });
      name.append(row);
    }

    stage.append(name);

    const footer = el("div", "word-cover__footer");
    footer.setAttribute("aria-hidden", "true");
    footer.append(
      el("span", "word-cover__signature", "STILLNESS BY SLOWLY"),
      el("span", "word-cover__mark", "◇")
    );

    cover.append(header, stage, footer);
    return cover;
  }

  global.SlowlyWordCover = Object.freeze({ create });
})(window);
