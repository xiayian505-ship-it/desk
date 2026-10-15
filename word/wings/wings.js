"use strict";
/* 羽翼生風｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyWingsFactory;
  const theme = global.SlowlyWingsTheme;
  if (!factory || !theme) {
    console.error('羽翼生風：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyWingsArt = factory.create(theme, 'vertical');
})(window);
