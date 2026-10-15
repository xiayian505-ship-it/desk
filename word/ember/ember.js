"use strict";
/* 星火燎原｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyEmberFactory;
  const theme = global.SlowlyEmberTheme;
  if (!factory || !theme) {
    console.error('星火燎原：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyEmberArt = factory.create(theme, 'vertical');
})(window);
