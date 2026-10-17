"use strict";
/* 海底隧道｜自足式動態 SVG：導引燈帶、遠處艙門與冷光掃描。 */
(function (global) {
  const verticalLibrary = global.SlowlyTextGenerator;
  const horizontalLibrary = global.SlowlyHorizontalTextGenerator;
  const textHelpers = global.SlowlyTextGeneratorCore;
  const design = global.SlowlyUnderseaTunnelVisual;

  if (!verticalLibrary?.create || !horizontalLibrary?.create || !design?.createSVG) {
    console.error("海底隧道動畫：文字生成器或 SVG 模板尚未載入。");
    return;
  }

  const vertical = verticalLibrary.create({
    maxChars: 4,
    sourceSize: design.canvas.vertical,
    renderSVG: text => design.createSVG(text, "vertical", verticalLibrary, { animated: true }),
    filenames: {
      svg: text => `${verticalLibrary.fileSafe(text)}_海底隧道_動態.svg`
    }
  });

  const horizontal = horizontalLibrary.create({
    maxChars: 4,
    sourceSize: design.canvas.horizontal,
    renderSVG: text => design.createSVG(text, "horizontal", textHelpers, { animated: true }),
    filenames: {
      svg: text => `${textHelpers.fileSafe(text)}_海底隧道_橫式_動態.svg`
    }
  });

  function selected(orientation) {
    return orientation === "horizontal" ? horizontal : vertical;
  }

  global.SlowlyUnderseaTunnelAnimatedArt = Object.freeze({
    generateSVG(text, orientation = "vertical") {
      return selected(orientation).generateSVG(text);
    },
    downloadSVG(text, orientation = "vertical") {
      return selected(orientation).downloadSVG(text);
    }
  });
})(window);
