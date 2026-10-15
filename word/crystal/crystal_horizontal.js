"use strict";
/* 琉璃幻彩｜橫式獨立生成器：文字沿向上的彩虹拱形排列。 */
(function (global) {
  const component = global.SlowlyHorizontalTextGenerator;
  const core = global.SlowlyTextGeneratorCore;
  const template = global.SlowlyCrystalTemplate;
  if (!component?.create || !core?.splitCharacters || !template?.renderSVG) {
    console.error('琉璃幻彩：橫式產生器或專屬模板未載入。');
    return;
  }

  const WIDTH = 1200;
  const HEIGHT = 760;
  const MAX = 4;
  // 紅虹拱（∩）：首末字較低，中間字抬高。相鄰字距略緊，字不互相遮蔽。
  const arrangements = {
    1: [[601, 380, 395, 0]],
    2: [[426, 415, 355, -4], [779, 415, 355, 4]],
    3: [[284, 443, 300, -9], [602, 318, 300, 0], [921, 443, 300, 9]],
    4: [[211, 434, 270, -12], [468, 327, 270, -4], [730, 327, 270, 4], [989, 434, 270, 12]]
  };

  function renderSVG(text, helpers) {
    const characters = helpers.splitCharacters(text);
    const positions = arrangements[characters.length].map(([x,y,size,angle]) => ({x,y,size,angle}));
    return template.renderSVG(text, helpers, {width: WIDTH, height: HEIGHT, orientation: 'horizontal', positions});
  }

  const instance = component.create({
    maxChars: MAX,
    sourceSize: {width: WIDTH, height: HEIGHT},
    renderSVG,
    presets: {
      png: {scale: 2},
      cover: {width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 74}
    },
    filenames: {
      svg: text => `${core.fileSafe(text)}_琉璃幻彩_橫式.svg`,
      png: text => `${core.fileSafe(text)}_琉璃幻彩_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_琉璃幻彩_橫式_角角者書封_700x1000.png`
    }
  });
  global.SlowlyCrystalHorizontalArt = Object.freeze({
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
