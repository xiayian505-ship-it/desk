"use strict";
/* 海底隧道｜直式文字生成器；輸出交由正式 HTTPS 軍火庫原件。 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const design = global.SlowlyUnderseaTunnelVisual;

  if (!library?.create || !design?.createSVG) {
    console.error("海底隧道：缺少直式文字生成器或作品 SVG 模板。");
    return;
  }

  const generator = library.create({
    maxChars: 4,
    sourceSize: design.canvas.vertical,
    renderSVG: text => design.createSVG(text, "vertical", library),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 40, paddingY: 32 }
    },
    filenames: {
      svg: text => `${library.fileSafe(text)}_海底隧道.svg`,
      png: text => `${library.fileSafe(text)}_海底隧道_2x.png`,
      cover: text => `${library.fileSafe(text)}_海底隧道_書封_700x1000.png`
    }
  });

  // 動態預覽的控制器與正式靜態下載器分離。
  const animatedPreview = library.create({
    maxChars: 4,
    sourceSize: design.canvas.vertical,
    renderSVG: text => design.createSVG(text, "vertical", library, { animated: true })
  });

  global.SlowlyUnderseaTunnelArt = Object.freeze({
    MAX: 4,
    MAX_COUNT: 4,
    splitCharacters: generator.splitCharacters || library.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: animatedPreview.createPreview,
    makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
