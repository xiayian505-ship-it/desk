"use strict";
/* 流沙歲月｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyQuicksandFactory;
  const theme = global.SlowlyQuicksandTheme;
  if (!factory || !theme) {
    console.error('流沙歲月：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyQuicksandArt = factory.create(theme, 'vertical');
})(window);
