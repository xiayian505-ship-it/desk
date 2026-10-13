"use strict";
/* 影隨形動｜橫式藝術字邏輯。由軍火庫橫式產生器提供排版與輸出。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_umbra;
  if (!artCore || !theme) {
    console.error('影隨形動：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyUmbraHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
