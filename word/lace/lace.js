"use strict";
/* 玲瓏鏤影｜直式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyLaceArtCore;
  const theme = global.SlowlyMaterialTheme_lace;
  if (!artCore || !theme) {
    console.error('玲瓏鏤影：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyLaceArt = artCore.create(theme, 'vertical');
})(window);
