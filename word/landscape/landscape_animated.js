"use strict";
/* 錦繡河山｜自足動態 SVG，繡線輕晃、山間雲霧流動、金絲點點呼吸。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const horizontalHelpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyLandscapeVisual;
  if (!verticalLibrary?.create || !horizontalLibrary?.create || !visual?.createSVG) {
    console.error('錦繡河山動態：文字產生器或 SVG 模板尚未載入。');
    return;
  }
  const vertical = verticalLibrary.create({
    maxChars: 4, sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, 'vertical', verticalLibrary, { animated: true }),
    filenames: { svg: text => `${verticalLibrary.fileSafe(text)}_錦繡河山_動態.svg` }
  });
  const horizontal = horizontalLibrary.create({
    maxChars: 4, sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, 'horizontal', horizontalHelpers, { animated: true }),
    filenames: { svg: text => `${horizontalHelpers.fileSafe(text)}_錦繡河山_橫式_動態.svg` }
  });
  const selected = orientation => orientation === 'horizontal' ? horizontal : vertical;
  global.SlowlyLandscapeAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return selected(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return selected(orientation).downloadSVG(text); }
  });
})(window);
