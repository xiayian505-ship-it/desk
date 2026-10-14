"use strict";
/* 黑羽舞動｜自足動態 SVG：銀灰雨粒子、漸層光澤與斷裂外框緩慢游移。
 * 靜態 SVG / PNG / 書封不帶動畫，但含有全部裝飾圖層。
 * 通用下載機制仍引用慢慢軍火庫 HTTPS 模組。
 */
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const horizontalLib = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyFeatherVisual;
  if (!lib?.create || !visual?.createSVG) return;

  const vertical = lib.create({
    maxChars: 4,
    sourceSize: { width: 840, height: 1200 },
    renderSVG(text) { return visual.createSVG(text, 'vertical', lib, { animated: true }); },
    filenames: { svg: text => `${lib.fileSafe(text)}_黑羽舞動_動態.svg` }
  });

  const horizontal = horizontalLib?.create && helpers?.fileSafe
    ? horizontalLib.create({
        maxChars: 4,
        sourceSize: { width: 1200, height: 760 },
        renderSVG(text) { return visual.createSVG(text, 'horizontal', helpers, { animated: true }); },
        filenames: { svg: text => `${helpers.fileSafe(text)}_黑羽舞動_橫式_動態.svg` }
      })
    : null;

  function chosen(orientation) {
    if (orientation === 'horizontal') {
      if (!horizontal) throw new Error('橫式動態 SVG 尚未載入。');
      return horizontal;
    }
    return vertical;
  }
  global.SlowlyFeatherAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return chosen(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return chosen(orientation).downloadSVG(text); }
  });
})(window);
