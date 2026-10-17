"use strict";
/* 怒焰沖天｜橫式專屬構圖，不將直式 SVG 旋轉。 */
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyWrathVisual;

  if (!library?.create || !helpers?.fileSafe || !visual?.createSVG) {
    console.error("怒焰沖天橫式：缺少軍火庫或專屬 SVG 模板。");
    return;
  }

  const generator = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", helpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 36, paddingY: 48 }
    },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_怒焰沖天_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_怒焰沖天_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_怒焰沖天_橫式_書封_700x1000.png`
    }
  });

  const animatedPreview = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", helpers, { animated: true })
  });

  global.SlowlyWrathHorizontalArt = Object.freeze({
    MAX: 4,
    MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || helpers.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: animatedPreview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
