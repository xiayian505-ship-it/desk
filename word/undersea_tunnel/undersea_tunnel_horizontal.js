"use strict";
/* 海底隧道｜橫式構圖及匯出；獨立生成，不旋轉直式畫布。 */
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  const textHelpers = global.SlowlyTextGeneratorCore;
  const design = global.SlowlyUnderseaTunnelVisual;

  if (!library?.create || !textHelpers?.fileSafe || !design?.createSVG) {
    console.error("海底隧道：缺少橫式文字生成器、核心助手或作品模板。");
    return;
  }

  const generator = library.create({
    maxChars: 4,
    sourceSize: design.canvas.horizontal,
    renderSVG: text => design.createSVG(text, "horizontal", textHelpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 35, paddingY: 52 }
    },
    filenames: {
      svg: text => `${textHelpers.fileSafe(text)}_海底隧道_橫式.svg`,
      png: text => `${textHelpers.fileSafe(text)}_海底隧道_橫式_2x.png`,
      cover: text => `${textHelpers.fileSafe(text)}_海底隧道_橫式_書封_700x1000.png`
    }
  });

  const animatedPreview = library.create({
    maxChars: 4,
    sourceSize: design.canvas.horizontal,
    renderSVG: text => design.createSVG(text, "horizontal", textHelpers, { animated: true })
  });

  global.SlowlyUnderseaTunnelHorizontalArt = Object.freeze({
    MAX: 4,
    MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || textHelpers.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: animatedPreview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
