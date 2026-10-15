"use strict";
/* 霓虹夜語｜直式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyNeonArtCore;
  const theme = global.SlowlyMaterialTheme_neon;
  if (!artCore || !theme) {
    console.error('霓虹夜語：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyNeonArt = artCore.create(theme, 'vertical');
})(window);
