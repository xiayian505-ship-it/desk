"use strict";
/* 影隨形動｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyUmbraFactory;
  const theme = global.SlowlyUmbraTheme;
  if (!factory || !theme) {
    console.error('影隨形動：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyUmbraArt = factory.create(theme, 'vertical');
})(window);
