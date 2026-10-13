"use strict";
/* 橫式：不同構圖、同一鹿雨森標題系統；下載依舊接軍火庫 v2。 */
(function (global) {
  const lib = global.SlowlyHorizontalTextGenerator;
  const visual = global.SlowlyDeerVisual;
  const helpers = global.SlowlyTextGeneratorCore;
  if (!lib?.create || !helpers?.splitCharacters || !visual?.createSVG) {
    console.error('逐鹿中原橫式：缺少軍火庫 v2 或鹿雨森標題模板。');
    return;
  }
  const MAX = 4;
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 1200, height: 760 },
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 46, paddingY: 60 }
    },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式_角角者書封_700x1000.png`
    }
  });
  // Original Silvarain antler tracing and title-rise, preview only.
  // Use the SAME library preview helper; downloads remain static transparent SVG/PNG.
  const previewGenerator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 1200, height: 760 },
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers, { animated: true }),
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 46, paddingY: 60 } },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式_角角者書封_700x1000.png`
    }
  });
  global.SlowlyDeerHorizontalArt = Object.freeze({
    MAX, MAX_COUNT: MAX,
    splitCharacters: generator.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    outputSize: (text, scale = 1) => ({ width: Math.round(1200 * scale), height: Math.round(760 * scale) }),
    createPreview: previewGenerator.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover
  });
})(window);
