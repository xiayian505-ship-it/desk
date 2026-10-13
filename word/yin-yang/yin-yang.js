"use strict";
/* 陰陽相生｜直式藝術字邏輯。所有 SVG 紋理都繪入文字本身。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_yin_yang;
  if (!artCore || !theme) {
    console.error('陰陽相生：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyYinYangArt = artCore.create(theme, 'vertical');
})(window);
