"use strict";
/* 霓虹夜語｜直式藝術字邏輯。所有 SVG 紋理都繪入文字本身。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_neon;
  if (!artCore || !theme) {
    console.error('霓虹夜語：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyNeonArt = artCore.create(theme, 'vertical');
})(window);
