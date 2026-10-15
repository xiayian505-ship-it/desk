"use strict";
/* 錦織流年｜橫式獨立生成器：上下交錯，節奏為上、下、下、上。 */
(function (global) {
  const component = global.SlowlyHorizontalTextGenerator;
  const core = global.SlowlyTextGeneratorCore;
  const template = global.SlowlyKnitTemplate;
  if (!component?.create || !core?.splitCharacters || !template?.renderSVG) {
    console.error('錦織流年：橫式產生器或專屬模板未載入。');
    return;
  }

  const WIDTH = 1200;
  const HEIGHT = 760;
  const MAX = 4;
  const arrangements = {
    1: [[601, 382, 390, 0]],
    2: [[436, 320, 346, -5], [772, 456, 346, 5]],
    3: [[298, 292, 302, -6], [598, 445, 302, 3], [904, 436, 302, 5]],
    4: [[210, 271, 268, -7], [456, 444, 268, 4], [739, 432, 268, 4], [986, 286, 268, -6]]
  };

  function renderSVG(text, helpers) {
    const characters = helpers.splitCharacters(text);
    const positions = arrangements[characters.length].map(([x, y, size, angle]) => ({ x, y, size, angle }));
    return template.renderSVG(text, helpers, { width: WIDTH, height: HEIGHT, orientation: 'horizontal', positions });
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
      svg: text => `${core.fileSafe(text)}_錦織流年_橫式.svg`,
      png: text => `${core.fileSafe(text)}_錦織流年_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_錦織流年_橫式_角角者書封_700x1000.png`
    }
  });

  global.SlowlyKnitHorizontalArt = Object.freeze({
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
