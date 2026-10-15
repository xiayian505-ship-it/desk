"use strict";
/* 琉璃幻彩｜直式獨立生成器：側向虹拱，不旋轉整張橫版。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const template = global.SlowlyCrystalTemplate;
  if (!component?.create || !template?.renderSVG) {
    console.error('琉璃幻彩：直式產生器或專屬模板未載入。');
    return;
  }

  const WIDTH = 840;
  const HEIGHT = 1200;
  const MAX = 4;
  // 側向彩虹拱形：首末字偏左，中間字向右拱起，字體本身保持正向。
  const arrangements = {
    1: [[414, 589, 390, 0]],
    2: [[378, 413, 339, -3], [475, 782, 339, 3]],
    3: [[344, 278, 300, -5], [505, 595, 300, 0], [345, 912, 300, 5]],
    4: [[335, 178, 274, -5], [474, 447, 274, -2], [474, 743, 274, 2], [335, 1015, 274, 5]]
  };

  function renderSVG(text, helpers) {
    const characters = helpers.splitCharacters(text);
    const positions = arrangements[characters.length].map(([x,y,size,angle]) => ({x,y,size,angle}));
    return template.renderSVG(text, helpers, {width: WIDTH, height: HEIGHT, orientation: 'vertical', positions});
  }

  const instance = component.create({
    maxChars: MAX,
    sourceSize: {width: WIDTH, height: HEIGHT},
    renderSVG,
    presets: {
      png: {scale: 2},
      cover: {width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 48}
    },
    filenames: {
      svg: text => `${component.fileSafe(text)}_琉璃幻彩.svg`,
      png: text => `${component.fileSafe(text)}_琉璃幻彩_2x.png`,
      cover: text => `${component.fileSafe(text)}_琉璃幻彩_角角者書封_700x1000.png`
    }
  });
  global.SlowlyCrystalArt = Object.freeze({
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
