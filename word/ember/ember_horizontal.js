"use strict";
/* 星火燎原｜橫式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyEmberFactory;
  const theme = global.SlowlyEmberTheme;
  if (!factory || !theme) {
    console.error('星火燎原：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyEmberHorizontalArt = factory.create(theme, 'horizontal');
})(window);
