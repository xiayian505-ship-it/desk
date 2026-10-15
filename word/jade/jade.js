"use strict";
/* 玉潤生輝｜直式獨立生成器；逐字銜接的玉質筆畫。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const template = global.SlowlyJadeTemplate;
  if (!component?.create || !template?.renderSVG) {
    console.error('玉潤生輝：直式生成器或獨立模板未載入。');
    return;
  }

  const WIDTH = 840;
  const HEIGHT = 1200;
  const MAX = 4;
  const arrangements = {
    1: [[423, 589, 390, -4]],
    2: [[365, 363, 337, -4], [478, 824, 337, 3]],
    3: [[366, 261, 294, -4], [474, 602, 294, 3], [374, 949, 294, -3]],
    4: [[370, 178, 260, -4], [470, 453, 260, 3], [370, 733, 260, -3], [473, 1005, 260, 3]]
  };

  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const positions = arrangements[chars.length].map(([x, y, size, angle]) => ({x, y, size, angle}));
    return template.renderSVG(text, helpers, {
      width: WIDTH, height: HEIGHT, orientation: 'vertical', positions
    });
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
      svg: text => `${component.fileSafe(text)}_玉潤生輝.svg`,
      png: text => `${component.fileSafe(text)}_玉潤生輝_2x.png`,
      cover: text => `${component.fileSafe(text)}_玉潤生輝_角角者書封_700x1000.png`
    }
  });

  global.SlowlyJadeArt = Object.freeze({
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
