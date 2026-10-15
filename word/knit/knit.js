"use strict";
/* 錦織流年｜直式獨立生成器：左右交錯，節奏為左、右、右、左。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const template = global.SlowlyKnitTemplate;
  if (!component?.create || !template?.renderSVG) {
    console.error('錦織流年：直式產生器或專屬模板未載入。');
    return;
  }

  const WIDTH = 840;
  const HEIGHT = 1200;
  const MAX = 4;
  const arrangements = {
    1: [[420, 590, 384, -2]],
    2: [[363, 366, 332, -4], [482, 826, 332, 4]],
    3: [[343, 255, 292, -5], [485, 603, 292, 3], [490, 947, 292, 2]],
    4: [[334, 174, 262, -6], [485, 445, 262, 4], [486, 736, 262, 2], [334, 1010, 262, -5]]
  };

  function renderSVG(text, helpers) {
    const characters = helpers.splitCharacters(text);
    const positions = arrangements[characters.length].map(([x, y, size, angle]) => ({ x, y, size, angle }));
    return template.renderSVG(text, helpers, { width: WIDTH, height: HEIGHT, orientation: 'vertical', positions });
  }

  const instance = component.create({
    maxChars: MAX,
    sourceSize: { width: WIDTH, height: HEIGHT },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 48 }
    },
    filenames: {
      svg: text => `${component.fileSafe(text)}_錦織流年.svg`,
      png: text => `${component.fileSafe(text)}_錦織流年_2x.png`,
      cover: text => `${component.fileSafe(text)}_錦織流年_角角者書封_700x1000.png`
    }
  });

  global.SlowlyKnitArt = Object.freeze({
    MAX,
    characters: component.splitCharacters,
    normalize: instance.normalize,
    generateSVG: instance.generateSVG,
    makeURL: instance.makeURL,
    downloadSVG: instance.downloadSVG,
    downloadPNG: text => instance.downloadPNG(text, 'png'),
    downloadCover: instance.downloadCover
  });
})(window);
