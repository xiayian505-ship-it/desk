"use strict";
/* 霓虹夜語｜橫式藝術字邏輯。由軍火庫橫式產生器提供排版與輸出。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_neon;
  if (!artCore || !theme) {
    console.error('霓虹夜語：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyNeonHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
