"use strict";
/* 玉潤生輝｜橫式獨立生成器；首字尾筆一路延伸到末字下方。 */
(function (global) {
  const component = global.SlowlyHorizontalTextGenerator;
  const core = global.SlowlyTextGeneratorCore;
  const template = global.SlowlyJadeTemplate;
  if (!component?.create || !core?.splitCharacters || !template?.renderSVG) {
    console.error('玉潤生輝：橫式生成器或獨立模板未載入。');
    return;
  }

  const WIDTH = 1200;
  const HEIGHT = 760;
  const MAX = 4;
  const arrangements = {
    1: [[604, 370, 379, -3]],
    2: [[434, 348, 350, -4], [773, 407, 350, 3]],
    3: [[300, 354, 306, -4], [595, 414, 306, 3], [884, 348, 306, -3]],
    4: [[206, 368, 263, -5], [459, 407, 263, 3], [727, 353, 263, -4], [991, 402, 263, 3]]
  };

  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const positions = arrangements[chars.length].map(([x, y, size, angle]) => ({x, y, size, angle}));
    return template.renderSVG(text, helpers, {
      width: WIDTH, height: HEIGHT, orientation: 'horizontal', positions
    });
  }

  const instance = component.create({
    maxChars: MAX,
    sourceSize: { width: WIDTH, height: HEIGHT },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 74 }
    },
    filenames: {
      svg: text => `${core.fileSafe(text)}_玉潤生輝_橫式.svg`,
      png: text => `${core.fileSafe(text)}_玉潤生輝_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_玉潤生輝_橫式_角角者書封_700x1000.png`
    }
  });

  global.SlowlyJadeHorizontalArt = Object.freeze({
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
