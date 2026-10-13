"use strict";
/* 直式：文字與鹿角由 DeerVisual 繪製，匯出由軍火庫管理。 */
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const visual = global.SlowlyDeerVisual;
  if (!lib?.create || !visual?.createSVG) {
    console.error('逐鹿中原：缺少軍火庫文字產生器或 deer_template.js。');
    return;
  }
  const MAX = 4;
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 62, paddingY: 46, roundPlacement: true }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_逐鹿中原.svg`,
      png: text => `${lib.fileSafe(text)}_逐鹿中原_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  // Original Silvarain antler tracing and title-rise, preview only.
  // Use the SAME library preview helper; downloads remain static transparent SVG/PNG.
  const previewGenerator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib, { animated: true }),
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 62, paddingY: 46, roundPlacement: true } },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_逐鹿中原.svg`,
      png: text => `${lib.fileSafe(text)}_逐鹿中原_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyDeerArt = Object.freeze({
    MAX, MAX_COUNT: MAX,
    splitCharacters: generator.splitCharacters || lib.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    outputSize: (text, scale = 1) => ({ width: Math.round(840 * scale), height: Math.round(1200 * scale) }),
    createPreview: previewGenerator.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover
  });
})(window);
