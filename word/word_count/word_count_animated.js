"use strict";
/* 字數統計｜包含光線、資料節點與數字跳轉的自足直橫式動態 SVG。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const horizontalHelpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyWordCountVisual;

  if (!verticalLibrary?.create || !horizontalLibrary?.create || !visual?.createSVG) {
    console.error("字數統計動畫：缺少共用文字生成器或 SVG 模板。");
    return;
  }

  const vertical = verticalLibrary.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", verticalLibrary, { animated: true }),
    filenames: { svg: text => `${verticalLibrary.fileSafe(text)}_字數統計_動態.svg` }
  });

  const horizontal = horizontalLibrary.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", horizontalHelpers, { animated: true }),
    filenames: { svg: text => `${horizontalHelpers.fileSafe(text)}_字數統計_橫式_動態.svg` }
  });

  global.SlowlyWordCountAnimatedArt = Object.freeze({
    generateSVG(text, orientation = "vertical") {
      return (orientation === "horizontal" ? horizontal : vertical).generateSVG(text);
    },
    downloadSVG(text, orientation = "vertical") {
      return (orientation === "horizontal" ? horizontal : vertical).downloadSVG(text);
    }
  });
})(window);
