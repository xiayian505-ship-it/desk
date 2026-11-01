"use strict";
/* 靜默餘響：橫式生成器，使用獨立橫向花枝構圖。 */
(function (global) {
  const lib = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyBluebellVisual;
  if (!lib?.create || !helpers?.splitCharacters || !visual?.createSVG) {
    console.error('靜默餘響橫式：缺少軍火庫文字生成器或 SVG 模板。');
    return;
  }
  const MAX = 4;
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 1200, height: 760 },
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 44, paddingY: 60, roundPlacement: true }
    },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_靜默餘響_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_靜默餘響_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_靜默餘響_橫式_書封_700x1000.png`
    }
  });
  const preview = lib.create({
    maxChars: MAX,
    sourceSize: { width: 1200, height: 760 },
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers, { animated: true })
  });
  global.SlowlyBluebellHorizontalArt = Object.freeze({
    MAX, MAX_COUNT: MAX,
    splitCharacters: generator.splitCharacters || helpers.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    outputSize: (text, scale = 1) => ({ width: 1200 * scale, height: 760 * scale }),
    createPreview: preview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover
  });
})(window);
