"use strict";
/* 玲瓏鏤影｜橫式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyLaceArtCore;
  const theme = global.SlowlyMaterialTheme_lace;
  if (!artCore || !theme) {
    console.error('玲瓏鏤影：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyLaceHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
