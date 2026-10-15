"use strict";
/* 清音流轉｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyXylophoneFactory;
  const theme = global.SlowlyXylophoneTheme;
  if (!factory || !theme) {
    console.error('清音流轉：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyXylophoneArt = factory.create(theme, 'vertical');
})(window);
