"use strict";
/* 極光漫舞｜直式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyAuroraArtCore;
  const theme = global.SlowlyMaterialTheme_aurora;
  if (!artCore || !theme) {
    console.error('極光漫舞：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyAuroraArt = artCore.create(theme, 'vertical');
})(window);
