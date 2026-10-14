"use strict";
/* 開闔之間橫式｜重生版：四字高低交錯，共用整體上下切色。 */
(function (global) {
  const component = global.SlowlyHorizontalTextGenerator;
  const core = global.SlowlyTextGeneratorCore;
  const art = global.SlowlyZipperTemplate;
  if (!component?.create || !core?.splitCharacters || !art?.renderSVG) {
    console.error('開闔之間：橫式零件或模板尚未載入。');
    return;
  }
  const W = 1200, H = 760, MAX = 4;
  function renderSVG(text, helpers, layout) {
    const slots = layout.slots;
    const size = [0, 368, 310, 264, 224][slots.length];
    const positions = slots.map((slot, index) => ({
      x: slot.x,
      y: slot.y + (index % 2 === 0 ? -54 : 56),
      size,
      angle: [ -6, 5, -4, 6 ][index] || 0
    }));
    return art.renderSVG(text, helpers, { width: W, height: H, orientation: 'horizontal', positions });
  }
  const instance = component.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 74 } },
    filenames: {
      svg: text => `${core.fileSafe(text)}_開闔之間_橫式.svg`,
      png: text => `${core.fileSafe(text)}_開闔之間_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_開闔之間_橫式_角角者書封_700x1000.png`
    }
  });
  global.SlowlyZipperHorizontalArt = Object.freeze({
    MAX,
    characters: core.splitCharacters,
    normalize: instance.normalize,
    generateSVG: instance.generateSVG,
    makeURL: instance.makeURL,
    downloadSVG: instance.downloadSVG,
    downloadPNG: text => instance.downloadPNG(text, 'png'),
    downloadCover: instance.downloadCover
  });
})(window);
