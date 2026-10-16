"use strict";
/* 投我一票｜自足動態 SVG，主字彈跳、勾選票紙浮動、票箱搖晃與彩紙飄舞。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const horizontalHelpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyBallotVisual;
  if (!verticalLibrary?.create || !horizontalLibrary?.create || !visual?.createSVG) {
    console.error('投我一票動態：文字產生器或 SVG 模板尚未載入。');
    return;
  }
  const vertical = verticalLibrary.create({
    maxChars: 4, sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, 'vertical', verticalLibrary, { animated: true }),
    filenames: { svg: text => `${verticalLibrary.fileSafe(text)}_投我一票_動態.svg` }
  });
  const horizontal = horizontalLibrary.create({
    maxChars: 4, sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, 'horizontal', horizontalHelpers, { animated: true }),
    filenames: { svg: text => `${horizontalHelpers.fileSafe(text)}_投我一票_橫式_動態.svg` }
  });
  const selected = orientation => orientation === 'horizontal' ? horizontal : vertical;
  global.SlowlyBallotAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return selected(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return selected(orientation).downloadSVG(text); }
  });
})(window);
