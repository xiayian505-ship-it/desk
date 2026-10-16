"use strict";
/* 御駕親征｜自足動態 SVG，旗面輕揚、鎏金流光、點點金塵。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const horizontalHelpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyImperialVisual;
  if (!verticalLibrary?.create || !horizontalLibrary?.create || !visual?.createSVG) {
    console.error('御駕親征動態：文字產生器或 SVG 模板尚未載入。');
    return;
  }
  const vertical = verticalLibrary.create({
    maxChars: 4, sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, 'vertical', verticalLibrary, { animated: true }),
    filenames: { svg: text => `${verticalLibrary.fileSafe(text)}_御駕親征_動態.svg` }
  });
  const horizontal = horizontalLibrary.create({
    maxChars: 4, sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, 'horizontal', horizontalHelpers, { animated: true }),
    filenames: { svg: text => `${horizontalHelpers.fileSafe(text)}_御駕親征_橫式_動態.svg` }
  });
  const selected = orientation => orientation === 'horizontal' ? horizontal : vertical;
  global.SlowlyImperialAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return selected(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return selected(orientation).downloadSVG(text); }
  });
})(window);
