"use strict";
/* 靜默餘響：直式／橫式自足動態 SVG，包含完整花枝、文字與粒子。
 * 動態皆為原生 SVG 表現，下載後不需連回網站。
 */
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const horizontalLib = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyBluebellVisual;
  if (!lib?.create || !visual?.createSVG) return;

  const vertical = lib.create({
    maxChars: 4,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib, { animated: true }),
    filenames: { svg: text => `${lib.fileSafe(text)}_靜默餘響_動態.svg` }
  });
  const horizontal = horizontalLib?.create && helpers?.fileSafe
    ? horizontalLib.create({
        maxChars: 4,
        sourceSize: { width: 1200, height: 760 },
        renderSVG: text => visual.createSVG(text, 'horizontal', helpers, { animated: true }),
        filenames: { svg: text => `${helpers.fileSafe(text)}_靜默餘響_橫式_動態.svg` }
      })
    : null;

  function select(orientation) {
    if (orientation === 'horizontal') {
      if (!horizontal) throw new Error('橫式動態 SVG 尚未載入。');
      return horizontal;
    }
    return vertical;
  }
  global.SlowlyBluebellAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') {
      return select(orientation).generateSVG(text);
    },
    downloadSVG(text, orientation = 'vertical') {
      return select(orientation).downloadSVG(text);
    }
  });
})(window);
