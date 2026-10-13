"use strict";
/* 寧折不彎直式｜自訂黑鐵冷光藝術字。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const art = global.SlowlyUnyieldingTemplate;
  if (!component?.create || !art?.renderSVG) {
    console.error('寧折不彎：直式零件或模板尚未載入。');
    return;
  }
  const W = 840, H = 1200, MAX = 4;

  function renderSVG(text, helpers) {
    return art.renderSVG(text, helpers, { orientation: 'vertical', animated: false });
  }

  const instance = component.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 54, paddingY: 48 } },
    filenames: {
      svg: text => `${component.fileSafe(text)}_寧折不彎.svg`,
      png: text => `${component.fileSafe(text)}_寧折不彎_2x.png`,
      cover: text => `${component.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });

  function makeAnimated(text) {
    return art.renderSVG(text, component, { orientation: 'vertical', animated: true });
  }

  function downloadAnimatedSVG(text) {
    const safe = instance.normalize(text);
    const content = makeAnimated(safe);
    const filename = `${component.fileSafe(safe)}_寧折不彎_animated.svg`;
    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return Promise.resolve({ filename });
  }

  global.SlowlyUnyieldingArt = Object.freeze({
    MAX,
    hasAnimatedSVG: true,
    characters: component.splitCharacters,
    normalize: instance.normalize,
    generateSVG: instance.generateSVG,
    generateAnimatedSVG: makeAnimated,
    makeURL: instance.makeURL,
    downloadSVG: instance.downloadSVG,
    downloadAnimatedSVG,
    downloadPNG: text => instance.downloadPNG(text, 'png'),
    downloadCover: instance.downloadCover
  });
})(window);
