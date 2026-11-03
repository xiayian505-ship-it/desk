"use strict";
/* 慢慢封面｜首頁純名稱卡片
 * 只顯示作品名稱與橢圓細線，不產生 SVG 縮圖。
 */
(function (global) {
  function create(item) {
    const title = String(item?.title || "慢慢封面").trim();
    const cover = document.createElement("div");
    cover.className = "cover-card-art";
    cover.setAttribute("role", "img");
    cover.setAttribute("aria-label", `${title}｜慢慢封面`);

    const stage = document.createElement("div");
    stage.className = "cover-card-art__stage";
    stage.setAttribute("aria-hidden", "true");

    const orbit = document.createElement("span");
    orbit.className = "cover-card-art__orbit";

    const name = document.createElement("span");
    name.className = "cover-card-art__name";
    name.dataset.length = String(Array.from(title).length);
    name.textContent = title;

    stage.append(orbit, name);
    cover.append(stage);
    return cover;
  }
  global.SlowlyCoverCard = Object.freeze({ create });
})(window);
