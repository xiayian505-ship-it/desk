"use strict";
/* 雨你相遇：此檔只保留作品設定與專屬預覽特效。介面統一由 ../_shared/word_page.js 管理。 */
window.SlowlyWordPageConfig = Object.freeze({
  title: "雨你相遇",
  initial: "雨你相遇",
  placeholder: "例如：聽雨",
  examples: ["雨你相遇", "聽雨", "雨"],
  vertical: "SlowlyRainArt",
  horizontal: "SlowlyRainHorizontalArt",
  mountEffects() {
    let rain = null;
    try {
      if (window.SlowlyCanvasRain?.create) {
        rain = window.SlowlyCanvasRain.create({ canvas: '#page-rain', count: 95, color: '#3b7487', opacity: .36, speed: .48, wind: .07, length: .6 });
        rain.start();
      }
    } catch (error) { console.warn('雨你相遇：雨幕未啟動', error); }
    return () => rain?.destroy();
  },
});
