"use strict";
/*
 * 穿林打葉｜獨立的動態 SVG 下載
 * 保留直式／橫式既有靜態生成器、PNG、書封與預覽舞台。
 * 將舞台的三片飄葉以 SVG 原生動畫呈現在透明藝術字下載中，
 * 不帶入棋盤格、角框、頁面配色，也不引用網頁 CSS 或外部程式。
 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const vertical = global.SlowlyForestArt;
  const horizontal = global.SlowlyForestHorizontalArt;
  const NS = 'http://www.w3.org/2000/svg';
  if (!library?.create || !vertical?.generateSVG || !horizontal?.generateSVG) {
    console.error('穿林打葉：缺少軍火庫文字產生器或直橫式 SVG。');
    return;
  }

  function element(document, name, attributes = {}) {
    const node = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function addMotion(source, orientation) {
    const document = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (document.querySelector('parsererror')) throw new Error('穿林打葉：來源 SVG 格式有誤。');
    const svg = document.documentElement;
    if (svg.namespaceURI !== NS || svg.localName !== 'svg') throw new Error('穿林打葉：來源不是 SVG。');
    const viewBox = svg.getAttribute('viewBox')?.split(/\s+/).map(Number);
    if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite)) {
      throw new Error('穿林打葉：SVG 缺少有效畫布尺寸。');
    }
    const [,, width, height] = viewBox;
    if (!svg.querySelector('defs') || !svg.querySelectorAll('g').length) {
      throw new Error('穿林打葉：原作品圖層不完整。');
    }
    const floating = element(document, 'g', { id: 'forest-floating-leaves', 'aria-hidden': 'true' });
    const leaves = [
      { x: width * .10, y: height * .30, angle: -24, delay: '-.3s', duration: '7s', fill: '#678b5a' },
      { x: width * .87, y: height * .66, angle: 37, delay: '-1.7s', duration: '8.2s', fill: '#76985e' },
      { x: width * .15, y: height * .84, angle: -47, delay: '-3.1s', duration: '7.6s', fill: '#b19b60' }
    ];
    leaves.forEach((leaf, index) => {
      // CSS 的飄葉尺寸僅用於舞台。這裡按輸出尺寸等比重畫同樣的葉形。
      const scale = Math.min(width / 840, height / 760) * 1.65;
      const anchor = element(document, 'g', {
        transform: `translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.angle}) scale(${scale.toFixed(3)})`
      });
      const motion = element(document, 'g', { opacity: index === 2 ? '.31' : '.37' });
      const leafShape = element(document, 'path', {
        d: 'M0 0 C13 -23 26 -20 26 -7 C19 9 6 14 0 0Z', fill: leaf.fill,
        stroke: '#335a46', 'stroke-width': '.8'
      });
      const vein = element(document, 'path', {
        d: 'M3 1 Q14 -9 23 -10', fill: 'none', stroke: '#e3d5a3',
        'stroke-width': '.8', opacity: '.7'
      });
      motion.append(leafShape, vein);
      motion.appendChild(element(document, 'animateTransform', {
        attributeName: 'transform', type: 'translate',
        values: '0 0;-19 -40;3 -71', keyTimes: '0;.52;1',
        dur: leaf.duration, begin: leaf.delay, repeatCount: 'indefinite'
      }));
      motion.appendChild(element(document, 'animate', {
        attributeName: 'opacity', values: '0;.37;.32;0',
        keyTimes: '0;.14;.76;1', dur: leaf.duration, begin: leaf.delay,
        repeatCount: 'indefinite'
      }));
      anchor.appendChild(motion);
      floating.appendChild(anchor);
    });
    svg.appendChild(floating);
    const description = svg.querySelector('desc');
    if (description) description.textContent += ' 動態版本加入三片隨風緩緩飄落的葉片；作品背景保持透明。';
    return new XMLSerializer().serializeToString(document);
  }

  function makeGenerator(art, orientation, size) {
    return library.create({
      maxChars: 4,
      sourceSize: size,
      renderSVG(text) { return addMotion(art.generateSVG(text), orientation); },
      filenames: { svg: text => `${library.fileSafe(text)}_穿林打葉_${orientation === 'vertical' ? '直式' : '橫式'}_動態.svg` }
    });
  }
  const generators = Object.freeze({
    vertical: makeGenerator(vertical, 'vertical', { width: 840, height: 1200 }),
    horizontal: makeGenerator(horizontal, 'horizontal', { width: 1200, height: 760 })
  });
  function generator(orientation) {
    if (orientation !== 'vertical' && orientation !== 'horizontal') throw new Error('穿林打葉：不支援的排列方式。');
    return generators[orientation];
  }
  global.SlowlyForestAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return generator(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return generator(orientation).downloadSVG(text); }
  });
})(window);
