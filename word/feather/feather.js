"use strict";
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const visual = global.SlowlyFeatherVisual;
  if (!lib?.create || !visual?.createSVG) {
    console.error('黑羽舞動：缺少軍火庫文字產生器或 feather_template.js。');
    return;
  }
  const MAX = 4;
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 54, paddingY: 44, roundPlacement: true }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_黑羽舞動.svg`,
      png: text => `${lib.fileSafe(text)}_黑羽舞動_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  // 預覽可播放 Shine Text 對應的 SVG 炫光；各種靜態下載仍使用固定完整構圖。
  const previewGenerator = lib.create({
    maxChars: MAX,
    sourceSize: { width: 840, height: 1200 },
    renderSVG: text => visual.createSVG(text, 'vertical', lib, { animated: true })
  });
  global.SlowlyFeatherArt = Object.freeze({
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
