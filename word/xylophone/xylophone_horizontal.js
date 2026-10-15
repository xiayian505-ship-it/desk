"use strict";
/* 輕音流轉｜橫式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyXylophoneFactory;
  const theme = global.SlowlyXylophoneTheme;
  if (!factory || !theme) {
    console.error('輕音流轉：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyXylophoneHorizontalArt = factory.create(theme, 'horizontal');
})(window);
