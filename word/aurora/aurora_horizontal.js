"use strict";
/* 極光漫舞｜橫式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyAuroraArtCore;
  const theme = global.SlowlyMaterialTheme_aurora;
  if (!artCore || !theme) {
    console.error('極光漫舞：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyAuroraHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
