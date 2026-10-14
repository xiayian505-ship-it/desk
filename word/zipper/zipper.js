"use strict";
/* 開闔之間直式｜重生版：獨立生成器，不再依賴共用材質核心。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const art = global.SlowlyZipperTemplate;
  if (!component?.create || !art?.renderSVG) {
    console.error('開闔之間：直式零件或模板尚未載入。');
    return;
  }
  const W = 840, H = 1200, MAX = 4;
  const arrangements = {
    1: [[420, 596, 408, 0]],
    2: [[362, 384, 338, -6], [478, 832, 338, 6]],
    3: [[360, 254, 294, -7], [486, 598, 294, 4], [355, 948, 294, -4]],
    4: [[352, 202, 258, -7], [494, 454, 258, 5], [344, 728, 258, -5], [498, 1002, 258, 6]]
  };
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const positions = arrangements[chars.length].map(([x, y, size, angle]) => ({ x, y, size, angle }));
    return art.renderSVG(text, helpers, { width: W, height: H, orientation: 'vertical', positions });
  }
  const instance = component.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 48 } },
    filenames: {
      svg: text => `${component.fileSafe(text)}_開闔之間.svg`,
      png: text => `${component.fileSafe(text)}_開闔之間_2x.png`,
      cover: text => `${component.fileSafe(text)}_開闔之間_角角者書封_700x1000.png`
    }
  });
  global.SlowlyZipperArt = Object.freeze({
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
