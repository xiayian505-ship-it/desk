"use strict";
/* 絲絨華彩｜橫式藝術字邏輯。由軍火庫橫式產生器提供排版與輸出。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_velvet;
  if (!artCore || !theme) {
    console.error('絲絨華彩：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyVelvetHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
