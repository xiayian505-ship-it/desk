"use strict";
/* 羽翼生風｜直式藝術字邏輯。所有 SVG 紋理都繪入文字本身。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_wings;
  if (!artCore || !theme) {
    console.error('羽翼生風：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyWingsArt = artCore.create(theme, 'vertical');
})(window);
