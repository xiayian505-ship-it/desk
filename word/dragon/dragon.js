"use strict";
/* 龍騰九霄｜直式藝術字邏輯。所有 SVG 紋理都繪入文字本身。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_dragon;
  if (!artCore || !theme) {
    console.error('龍騰九霄：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyDragonArt = artCore.create(theme, 'vertical');
})(window);
