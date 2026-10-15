"use strict";
/* 龍騰九霄｜直式獨立生成器：雙龍脈分列兩側，字筆逐級飛躍。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const template = global.SlowlyDragonTemplate;
  if (!component?.create || !template?.renderSVG) {
    console.error('龍騰九霄：直式文字生成器或獨立模板未載入。');
    return;
  }

  const WIDTH = 840;
  const HEIGHT = 1200;
  const MAX = 4;
  const arrangements = {
    1: [[414, 588, 430, 0]],
    2: [[398, 385, 345, -3], [445, 796, 345, 3]],
    3: [[400, 247, 310, -3], [437, 593, 310, 2], [400, 941, 310, -2]],
    4: [[408, 158, 263, -3], [422, 444, 263, 2], [414, 732, 263, -2], [424, 1013, 263, 3]]
  };

  const instance = component.create({
    maxChars: MAX,
    sourceSize: {width: WIDTH, height: HEIGHT},
    renderSVG(text, helpers) {
      const characters = helpers.splitCharacters(text);
      const positions = arrangements[characters.length].map(([x,y,size,angle]) => ({x,y,size,angle}));
      return template.renderSVG(text, helpers, {width: WIDTH, height: HEIGHT, orientation: 'vertical', positions});
    },
    presets: {
      png: {scale: 2},
      cover: {width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 48}
    },
    filenames: {
      svg: text => `${component.fileSafe(text)}_龍騰九霄.svg`,
      png: text => `${component.fileSafe(text)}_龍騰九霄_2x.png`,
      cover: text => `${component.fileSafe(text)}_龍騰九霄_角角者書封_700x1000.png`
    }
  });

  global.SlowlyDragonArt = Object.freeze({
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
