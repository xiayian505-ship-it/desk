"use strict";
/* 御駕親征｜橫式構圖與匯出；不是將直式 SVG 旋轉。 */
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyImperialVisual;
  if (!library?.create || !helpers?.fileSafe || !visual?.createSVG) {
    console.error('御駕親征橫式：請先載入軍火庫橫式生成器與 SVG 模板。');
    return;
  }
  const size = visual.canvas.horizontal;
  const generator = library.create({
    maxChars: 4,
    sourceSize: size,
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 35, paddingY: 55 }
    },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_御駕親征_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_御駕親征_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_御駕親征_橫式_書封_700x1000.png`
    }
  });
  const animatedPreview = library.create({
    maxChars: 4, sourceSize: size,
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers, { animated: true })
  });
  global.SlowlyImperialHorizontalArt = Object.freeze({
    MAX: 4, MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || helpers.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: animatedPreview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover
  });
})(window);
