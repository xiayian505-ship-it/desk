"use strict";
/* 墨染風華｜直式藝術字邏輯。所有 SVG 紋理都繪入文字本身。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_ink;
  if (!artCore || !theme) {
    console.error('墨染風華：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyInkArt = artCore.create(theme, 'vertical');
})(window);
