"use strict";
/* 慢慢藝術字｜共用作品封面（精簡版）
 * 封面僅顯示橢圓線條與單行作品名稱。
 * 作品名稱由首頁既有資料提供，不額外製作圖片或獨立模板。
 * 本檔只建立結構；封面外觀集中在 word_cover.css。
 */
(function (global) {
  function create(item) {
    const title = String(item?.phrase || item?.title || "慢慢藝術字").trim();
    const cover = document.createElement("div");
    cover.className = "word-cover";
    cover.setAttribute("role", "img");
    cover.setAttribute("aria-label", `${title}｜慢慢藝術字封面`);

    const stage = document.createElement("div");
    stage.className = "word-cover__stage";
    stage.setAttribute("aria-hidden", "true");

    const orbit = document.createElement("span");
    orbit.className = "word-cover__orbit";

    const name = document.createElement("span");
    name.className = "word-cover__name";
    name.dataset.length = String(Array.from(title).length);
    name.textContent = title;

    stage.append(orbit, name);
    cover.append(stage);
    return cover;
  }

  global.SlowlyWordCover = Object.freeze({ create });
})(window);
