"use strict";
/* 青花入夢｜直式藝術字邏輯。所有 SVG 紋理都繪入文字本身。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_porcelain;
  if (!artCore || !theme) {
    console.error('青花入夢：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyPorcelainArt = artCore.create(theme, 'vertical');
})(window);
