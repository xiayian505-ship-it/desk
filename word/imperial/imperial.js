"use strict";
/* 御駕親征｜直式生成器；下載與預覽交由軍火庫正式文字產生器處理。 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const visual = global.SlowlyImperialVisual;
  if (!library?.create || !visual?.createSVG) {
    console.error('御駕親征：文字產生器或專屬 SVG 模板尚未載入。');
    return;
  }
  const size = visual.canvas.vertical;
  const options = {
    maxChars: 4,
    sourceSize: size,
    renderSVG: text => visual.createSVG(text, 'vertical', library),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 45, paddingY: 35 }
    },
    filenames: {
      svg: text => `${library.fileSafe(text)}_御駕親征.svg`,
      png: text => `${library.fileSafe(text)}_御駕親征_2x.png`,
      cover: text => `${library.fileSafe(text)}_御駕親征_書封_700x1000.png`
    }
  };
  const generator = library.create(options);
  const animatedPreview = library.create({
    maxChars: 4, sourceSize: size,
    renderSVG: text => visual.createSVG(text, 'vertical', library, { animated: true })
  });
  global.SlowlyImperialArt = Object.freeze({
    MAX: 4, MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || library.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: animatedPreview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover
  });
})(window);
