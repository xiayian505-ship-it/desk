"use strict";
/* 鏡花水月｜直式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyMirrorArtCore;
  const theme = global.SlowlyMaterialTheme_mirror;
  if (!artCore || !theme) {
    console.error('鏡花水月：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyMirrorArt = artCore.create(theme, 'vertical');
})(window);
