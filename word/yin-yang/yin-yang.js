"use strict";
/* 陰陽相生｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyYinYangFactory;
  const theme = global.SlowlyYinYangTheme;
  if (!factory || !theme) {
    console.error('陰陽相生：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyYinYangArt = factory.create(theme, 'vertical');
})(window);
