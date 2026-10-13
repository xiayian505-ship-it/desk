"use strict";
/* 逐鹿中原｜動態 SVG 下載
 * 直接使用鹿雨森分支標題模板的原生 SVG 動畫版本，
 * 不依賴頁面 CSS，也不把預覽背景一起下載。
 */
(function (global) {
  const vertical = global.SlowlyDeerArt;
  const horizontal = global.SlowlyDeerHorizontalArt;
  const library = global.SlowlyTextGenerator;
  const helpers = global.SlowlyTextGeneratorCore;
  const visual = global.SlowlyDeerVisual;

  if (!library?.create || !visual?.createSVG || !helpers?.fileSafe) {
    console.error('逐鹿中原動態 SVG：缺少軍火庫或鹿雨森分支模板。');
    return;
  }

  function makeVertical() {
    if (!vertical?.normalize) return null;
    return library.create({
      maxChars: 4,
      sourceSize: { width: 840, height: 1200 },
      renderSVG(text) {
        return visual.createSVG(text, 'vertical', library, { animated: true });
      },
      filenames: {
        svg: text => `${library.fileSafe(text)}_逐鹿中原_動態.svg`
      }
    });
  }

  function makeHorizontal() {
    if (!horizontal?.normalize || !global.SlowlyHorizontalTextGenerator?.create) return null;
    return global.SlowlyHorizontalTextGenerator.create({
      maxChars: 4,
      sourceSize: { width: 1200, height: 760 },
      renderSVG(text) {
        return visual.createSVG(text, 'horizontal', helpers, { animated: true });
      },
      filenames: {
        svg: text => `${helpers.fileSafe(text)}_逐鹿中原_橫式_動態.svg`
      }
    });
  }

  const verticalGenerator = makeVertical();
  const horizontalGenerator = makeHorizontal();

  function getGenerator(orientation) {
    if (orientation === 'horizontal') {
      if (!horizontalGenerator) throw new Error('橫式動態 SVG 尚未載入。');
      return horizontalGenerator;
    }
    if (!verticalGenerator) throw new Error('直式動態 SVG 尚未載入。');
    return verticalGenerator;
  }

  global.SlowlyDeerAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') {
      return getGenerator(orientation).generateSVG(text);
    },
    downloadSVG(text, orientation = 'vertical') {
      return getGenerator(orientation).downloadSVG(text);
    }
  });
})(window);
