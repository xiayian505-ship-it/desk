"use strict";
/* 字數統計｜橫式專屬資料流構圖，不旋轉直式畫面。 */
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyWordCountVisual;

  if (!library?.create || !helpers?.fileSafe || !visual?.createSVG) {
    console.error("字數統計橫式：缺少共用文字生成器或本款 SVG 模板。");
    return;
  }

  const generator = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", helpers),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 34, paddingY: 45 }
    },
    filenames: {
      svg: text => `${helpers.fileSafe(text)}_字數統計_橫式.svg`,
      png: text => `${helpers.fileSafe(text)}_字數統計_橫式_2x.png`,
      cover: text => `${helpers.fileSafe(text)}_字數統計_橫式_書封_700x1000.png`
    }
  });

  const preview = library.create({
    maxChars: 4,
    sourceSize: visual.canvas.horizontal,
    renderSVG: text => visual.createSVG(text, "horizontal", helpers, { animated: true })
  });

  global.SlowlyWordCountHorizontalArt = Object.freeze({
    MAX: 4,
    MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || helpers.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: preview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
