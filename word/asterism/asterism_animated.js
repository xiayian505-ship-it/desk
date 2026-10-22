"use strict";
/* 星象萬千｜北斗主星呼吸、星光與字內掃光緩慢移動的自足直橫式動態 SVG。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const horizontalHelpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyAsterismVisual;

  if (!verticalLibrary?.create || !horizontalLibrary?.create || !visual?.createSVG) {
    console.error("星象萬千動畫：缺少共用文字生成器或 SVG 模板。");
    return;
  }

  const vertical = verticalLibrary.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", verticalLibrary, { animated: true }),
    filenames: { svg: text => `${verticalLibrary.fileSafe(text)}_星象萬千_動態.svg` }
  });

  const horizontal = horizontalLibrary.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", horizontalHelpers, { animated: true }),
    filenames: { svg: text => `${horizontalHelpers.fileSafe(text)}_星象萬千_橫式_動態.svg` }
  });

  global.SlowlyAsterismAnimatedArt = Object.freeze({
    generateSVG(text, orientation = "vertical") {
      return (orientation === "horizontal" ? horizontal : vertical).generateSVG(text);
    },
    downloadSVG(text, orientation = "vertical") {
      return (orientation === "horizontal" ? horizontal : vertical).downloadSVG(text);
    }
  });
})(window);
