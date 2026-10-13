"use strict";
/* 寧折不彎橫式｜保留前字壓後字的交疊結構。 */
(function (global) {
  const component = global.SlowlyTextGenerator;
  const art = global.SlowlyUnyieldingTemplate;
  if (!component?.create || !art?.renderSVG) {
    console.error('寧折不彎：橫式零件或模板尚未載入。');
    return;
  }
  const W = 1200, H = 760, MAX = 4;

  function renderSVG(text, helpers) {
    return art.renderSVG(text, helpers, { orientation: 'horizontal', animated: false });
  }

  const instance = component.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 50, paddingY: 82 } },
    filenames: {
      svg: text => `${component.fileSafe(text)}_寧折不彎_橫式.svg`,
      png: text => `${component.fileSafe(text)}_寧折不彎_橫式_2x.png`,
      cover: text => `${component.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });

  function makeAnimated(text) {
    return art.renderSVG(text, component, { orientation: 'horizontal', animated: true });
  }

  function downloadAnimatedSVG(text) {
    const safe = instance.normalize(text);
    const content = makeAnimated(safe);
    const filename = `${component.fileSafe(safe)}_寧折不彎_橫式_animated.svg`;
    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return Promise.resolve({ filename });
  }

  global.SlowlyUnyieldingHorizontalArt = Object.freeze({
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
