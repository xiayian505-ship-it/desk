"use strict";
/* 星象萬千｜直式：共用軍火庫生成器負責下載，本款模板負責全部視覺。 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const visual = global.SlowlyAsterismVisual;

  if (!library?.create || !visual?.createSVG) {
    console.error("星象萬千：缺少共用文字生成器或本款 SVG 模板。");
    return;
  }

  const generator = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", library),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 32, paddingY: 36 }
    },
    filenames: {
      svg: text => `${library.fileSafe(text)}_星象萬千.svg`,
      png: text => `${library.fileSafe(text)}_星象萬千_2x.png`,
      cover: text => `${library.fileSafe(text)}_星象萬千_書封_700x1000.png`
    }
  });

  const preview = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.vertical,
    renderSVG: text => visual.createSVG(text, "vertical", library, { animated: true })
  });

  global.SlowlyAsterismArt = Object.freeze({
    MAX: 4,
    MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || library.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: preview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
