"use strict";
/* 陰陽相生｜橫式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyYinYangFactory;
  const theme = global.SlowlyYinYangTheme;
  if (!factory || !theme) {
    console.error('陰陽相生：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyYinYangHorizontalArt = factory.create(theme, 'horizontal');
})(window);
