"use strict";
(function (global) {
  const lib = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyFeatherVisual;
  if (!lib?.create || !helpers?.splitCharacters || !visual?.createSVG) {
    console.error('黑羽舞動橫式：缺少軍火庫 v2 或 feather_template.js。');
    return;
  }
  const MAX = 4;
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 1200, height: 760 },
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 44, paddingY: 60 }
    },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_黑羽舞動_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_黑羽舞動_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_黑羽舞動_橫式_角角者書封_700x1000.png`
    }
  });
  // 橫式動態預覽；產出的透明 PNG、書封仍走靜態完整 SVG。
  const previewGenerator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 1200, height: 760 },
    renderSVG: text => visual.createSVG(text, 'horizontal', helpers, { animated: true })
  });
  global.SlowlyFeatherHorizontalArt = Object.freeze({
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
