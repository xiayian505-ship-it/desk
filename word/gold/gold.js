"use strict";
/* 直式字形布局；立體燙金浮雕與金砂交給 gold_visual.js 統一生成。 */
(function (global) {
  const lib = global.SlowlyTextGenerator;
  const visual = global.SlowlyGoldVisual;
  if (!lib?.create || !visual?.renderSVG) {
    throw new Error("金碧輝煌：請先載入軍火庫文字產生器與 gold_visual.js。");
  }
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const POSITIONS = Object.freeze({
    1: [[420, 585, 405, 0]],
    2: [[415, 352, 320, -2], [426, 826, 320, 2]],
    3: [[418, 228, 286, -2], [415, 598, 286, 0], [427, 968, 286, 2]],
    4: [[417, 174, 252, -3], [427, 454, 252, 1], [410, 738, 252, -1], [428, 1020, 252, 2]]
  });

  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const slots = chars.map((char, index) => {
      const [x, y, size, angle] = POSITIONS[chars.length][index];
      return { char, x, y, size, angle };
    });
    return visual.renderSVG({ text, slots, width: W, height: H, escapeXML: helpers.escapeXML });
  }

  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 58, paddingY: 42 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_金碧輝煌藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_金碧輝煌藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });

  global.SlowlyGoldArt = Object.freeze({
    MAX,
    characters: lib.splitCharacters,
    splitCharacters: lib.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: generator.createPreview,
    makeURL: generator.makeURL,
    makeUrl: generator.makeURL,
    url: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover,
    formatSize: generator.formatSize,
    pngBlob: generator.pngBlob
  });
})(window);
