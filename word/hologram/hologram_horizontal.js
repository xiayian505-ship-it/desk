"use strict";
/* 虛實交映｜橫式藝術字邏輯。 */
(function (global) {
  const artCore = global.SlowlyHologramArtCore;
  const theme = global.SlowlyMaterialTheme_hologram;
  if (!artCore || !theme) {
    console.error('虛實交映：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyHologramHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
