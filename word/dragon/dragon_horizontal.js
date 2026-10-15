"use strict";
/* 龍騰九霄｜橫式獨立生成器：雙連結線一上一下，飛躍筆勢跨字。 */
(function (global) {
  const component = global.SlowlyHorizontalTextGenerator;
  const core = global.SlowlyTextGeneratorCore;
  const template = global.SlowlyDragonTemplate;
  if (!component?.create || !core?.splitCharacters || !template?.renderSVG) {
    console.error('龍騰九霄：橫式文字生成器或獨立模板未載入。');
    return;
  }

  const WIDTH = 1200;
  const HEIGHT = 760;
  const MAX = 4;
  const arrangements = {
    1: [[600, 379, 408, 0]],
    2: [[385, 389, 357, -3], [804, 380, 357, 3]],
    3: [[274, 384, 305, -3], [600, 368, 305, 0], [927, 395, 305, 3]],
    4: [[209, 387, 264, -3], [471, 375, 264, 2], [732, 391, 264, -2], [991, 384, 264, 3]]
  };

  const instance = component.create({
    maxChars: MAX,
    sourceSize: {width: WIDTH, height: HEIGHT},
    renderSVG(text, helpers) {
      const characters = helpers.splitCharacters(text);
      const positions = arrangements[characters.length].map(([x,y,size,angle]) => ({x,y,size,angle}));
      return template.renderSVG(text, helpers, {width: WIDTH, height: HEIGHT, orientation: 'horizontal', positions});
    },
    presets: {
      png: {scale: 2},
      cover: {width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 74}
    },
    filenames: {
      svg: text => `${core.fileSafe(text)}_龍騰九霄_橫式.svg`,
      png: text => `${core.fileSafe(text)}_龍騰九霄_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_龍騰九霄_橫式_角角者書封_700x1000.png`
    }
  });

  global.SlowlyDragonHorizontalArt = Object.freeze({
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
