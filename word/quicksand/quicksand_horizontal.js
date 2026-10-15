"use strict";
/* 流沙歲月｜橫式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyQuicksandFactory;
  const theme = global.SlowlyQuicksandTheme;
  if (!factory || !theme) {
    console.error('流沙歲月：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyQuicksandHorizontalArt = factory.create(theme, 'horizontal');
})(window);
