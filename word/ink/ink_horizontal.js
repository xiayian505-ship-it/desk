"use strict";
/* 墨染風華｜橫式藝術字邏輯。由軍火庫橫式產生器提供排版與輸出。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_ink;
  if (!artCore || !theme) {
    console.error('墨染風華：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyInkHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
