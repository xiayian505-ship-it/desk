"use strict";
/* 墨染風華｜直式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyInkArtCore;
  const theme = global.SlowlyMaterialTheme_ink;
  if (!artCore || !theme) {
    console.error('墨染風華：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyInkArt = artCore.create(theme, 'vertical');
})(window);
