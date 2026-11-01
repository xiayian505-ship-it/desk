"use strict";
/* 靜默餘響：直式生成器。下載與動態預覽沿用慢慢軍火庫文字產生器。 */
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const visual = global.SlowlyBluebellVisual;
  if (!lib?.create || !visual?.createSVG) {
    console.error('靜默餘響：缺少軍火庫文字生成器或 SVG 模板。');
    return;
  }
  const MAX = 4;
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 44, paddingY: 44, roundPlacement: true }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_靜默餘響.svg`,
      png: text => `${lib.fileSafe(text)}_靜默餘響_2x.png`,
      cover: text => `${lib.fileSafe(text)}_靜默餘響_書封_700x1000.png`
    }
  });
  const preview = lib.create({
    maxChars: MAX,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib, { animated: true })
  });
  global.SlowlyBluebellArt = Object.freeze({
    MAX, MAX_COUNT: MAX,
    splitCharacters: generator.splitCharacters || lib.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    outputSize: (text, scale = 1) => ({ width: 840 * scale, height: 1200 * scale }),
    createPreview: preview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover
  });
})(window);
