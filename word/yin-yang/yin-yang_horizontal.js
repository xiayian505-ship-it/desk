"use strict";
/* 陰陽相生｜橫式藝術字邏輯。由軍火庫橫式產生器提供排版與輸出。 */
(function (global) {
  const artCore = global.SlowlyMaterialArtCore;
  const theme = global.SlowlyMaterialTheme_yin_yang;
  if (!artCore || !theme) {
    console.error('陰陽相生：橫式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyYinYangHorizontalArt = artCore.create(theme, 'horizontal');
})(window);
