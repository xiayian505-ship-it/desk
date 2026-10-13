"use strict";
/* 相濡以沫｜自足動態 SVG。圓環以 SVG SMIL 描線與旋轉，光暈緩慢呼吸。
 * 靜態 SVG / PNG / 書封不帶動畫，但含有全部裝飾圖層。
 * 通用下載機制仍引用慢慢軍火庫 HTTPS 模組。
 */
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const horizontalLib = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyHeartVisual;
  if (!lib?.create || !visual?.createSVG) return;

  const vertical = lib.create({
    maxChars: 4,
    sourceSize: { width: 840, height: 1200 },
    renderSVG(text) { return visual.createSVG(text, 'vertical', lib, { animated: true }); },
    filenames: { svg: text => `${lib.fileSafe(text)}_相濡以沫_動態.svg` }
  });

  const horizontal = horizontalLib?.create && helpers?.fileSafe
    ? horizontalLib.create({
        maxChars: 4,
        sourceSize: { width: 1200, height: 760 },
        renderSVG(text) { return visual.createSVG(text, 'horizontal', helpers, { animated: true }); },
        filenames: { svg: text => `${helpers.fileSafe(text)}_相濡以沫_橫式_動態.svg` }
      })
    : null;

  function chosen(orientation) {
    if (orientation === 'horizontal') {
      if (!horizontal) throw new Error('橫式動態 SVG 尚未載入。');
      return horizontal;
    }
    return vertical;
  }
  global.SlowlyHeartAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return chosen(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return chosen(orientation).downloadSVG(text); }
  });
})(window);
