"use strict";
/* 怒焰沖天｜含全套裝飾、可獨立開啟的直橫式動態 SVG。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const horizontalHelpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyWrathVisual;

  if (!verticalLibrary?.create || !horizontalLibrary?.create || !visual?.createSVG) {
    console.error("怒焰沖天動態檔案：必要生成器尚未載入。");
    return;
  }

  const vertical = verticalLibrary.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", verticalLibrary, { animated: true }),
    filenames: { svg: text => `${verticalLibrary.fileSafe(text)}_怒焰沖天_動態.svg` }
  });

  const horizontal = horizontalLibrary.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", horizontalHelpers, { animated: true }),
    filenames: { svg: text => `${horizontalHelpers.fileSafe(text)}_怒焰沖天_橫式_動態.svg` }
  });

  global.SlowlyWrathAnimatedArt = Object.freeze({
    generateSVG(text, orientation = "vertical") {
      return (orientation === "horizontal" ? horizontal : vertical).generateSVG(text);
    },
    downloadSVG(text, orientation = "vertical") {
      return (orientation === "horizontal" ? horizontal : vertical).downloadSVG(text);
    }
  });
})(window);
