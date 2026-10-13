"use strict";
/* 橫式布局使用軍火庫定位，共用 gold_visual.js 的相同金砂浮雕美術。 */
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  const core = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyGoldVisual;
  if (!library?.create || !core || !visual?.renderSVG) {
    throw new Error("金碧輝煌橫式：請先載入軍火庫 core、horizontal 與 gold_visual.js。");
  }
  const W = 1200;
  const H = 760;
  const MAX = 4;

  function renderSVG(text, helpers, layout) {
    const chars = core.splitCharacters(text);
    const size = chars.length === 1 ? 336 : chars.length === 2 ? 292 : chars.length === 3 ? 252 : 222;
    const angles = [-2, 1, -1, 2];
    const slots = chars.map((char, index) => {
      const { x, y } = layout.slots[index];
      return { char, x, y, size, angle: angles[index] };
    });
    return visual.renderSVG({ text, slots, width: W, height: H, escapeXML: helpers.escapeXML });
  }

  const generator = library.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 42, paddingY: 65 }
    },
    filenames: {
      svg: text => `${core.fileSafe(text)}_金碧輝煌_橫式.svg`,
      png: text => `${core.fileSafe(text)}_金碧輝煌_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_金碧輝煌_橫式_角角者書封_700x1000.png`
    }
  });

  global.SlowlyGoldHorizontalArt = Object.freeze({
    MAX_COUNT: MAX,
    MAX,
    sourceSize: { width: W, height: H },
    outputSize: scale => ({ width: Math.round(W * scale), height: Math.round(H * scale) }),
    splitCharacters: generator.splitCharacters,
    characters: generator.splitCharacters,
    chars: generator.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    makeURL: generator.makeURL,
    makeUrl: generator.makeURL,
    url: generator.makeURL,
    createPreview: generator.createPreview,
    formatSize: generator.formatSize,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover,
    downloadKadokadoCover: generator.downloadCover
  });
})(window);
