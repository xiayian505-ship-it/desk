"use strict";
/* 青花入夢｜橫式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyPorcelainFactory;
  const theme = global.SlowlyPorcelainTheme;
  if (!factory || !theme) {
    console.error('青花入夢：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyPorcelainHorizontalArt = factory.create(theme, 'horizontal');
})(window);
