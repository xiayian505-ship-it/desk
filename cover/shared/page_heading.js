"use strict";
/* 慢慢封面｜所有作品共用的「點標題返回首頁」功能。
 * 各模板保留 <header class="word-heading"><h1>作品名稱</h1></header>，
 * 引入這一個共用模組即可，不必逐款自行加入連結或複製事件邏輯。
 * 主頁位置從此模組的路徑解析，不綁死部署網域。
 */
(function (global) {
  const script = document.currentScript;
  const homeURL = new URL("../index.html", script.src).href;

  function mount(root = document) {
    const heading = root.querySelector(".word-heading h1");
    if (!heading) return;
    const title = heading.textContent.trim();
    if (!title) return;

    // 如果頁面已經有連結，也統一交由共用元件決定目的地。
    let anchor = heading.querySelector(":scope > a");
    if (!anchor) {
      anchor = document.createElement("a");
      while (heading.firstChild) anchor.appendChild(heading.firstChild);
      heading.appendChild(anchor);
    }
    anchor.href = homeURL;
    anchor.setAttribute("aria-label", `${title}，返回慢慢封面首頁`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => mount(), { once: true });
  } else {
    mount();
  }
  global.SlowlyCoverPageHeading = Object.freeze({ mount });
})(window);
