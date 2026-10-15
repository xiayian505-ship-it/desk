"use strict";
/* 絲絨華彩｜直式藝術字邏輯。 */
(function (global) {
  const factory = global.SlowlyVelvetFactory;
  const theme = global.SlowlyVelvetTheme;
  if (!factory || !theme) {
    console.error('絲絨華彩：直式藝術字零件載入失敗。');
    return;
  }
  global.SlowlyVelvetArt = factory.create(theme, 'vertical');
})(window);
