"use strict";
/* 饕餮盛宴｜直式 SVG/PNG/書封；專屬視覺只來自 gluttony_template.js。 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const visual = global.SlowlyGluttonyVisual;

  if (!library?.create || !visual?.createSVG) {
    console.error("饕餮盛宴：軍火庫文字生成器或專屬 SVG 模板尚未載入。");
    return;
  }

  const generator = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", library),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 44, paddingY: 36 }
    },
    filenames: {
      svg: text => `${library.fileSafe(text)}_饕餮盛宴.svg`,
      png: text => `${library.fileSafe(text)}_饕餮盛宴_2x.png`,
      cover: text => `${library.fileSafe(text)}_饕餮盛宴_書封_700x1000.png`
    }
  });

  const animatedPreview = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", library, { animated: true })
  });

  global.SlowlyGluttonyArt = Object.freeze({
    MAX: 4,
    MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || library.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: animatedPreview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
