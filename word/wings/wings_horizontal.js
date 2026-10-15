"use strict";
/* 羽翼生風｜橫式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyWingsFactory;
  const theme = global.SlowlyWingsTheme;
  if (!factory || !theme) {
    console.error('羽翼生風：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyWingsHorizontalArt = factory.create(theme, 'horizontal');
})(window);
