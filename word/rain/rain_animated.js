"use strict";
/*
 * 雨你相遇｜直式、橫式可獨立播放的動態 SVG
 * 網站預覽用 Canvas 雨幕原封不動保留；輸出使用 SVG 原生動畫，
 * 不引用網頁 CSS、Canvas、外部 JavaScript 或網路素材。
 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const vertical = global.SlowlyRainArt;
  const horizontal = global.SlowlyRainHorizontalArt;
  const NS = 'http://www.w3.org/2000/svg';
  if (!library?.create || !vertical?.generateSVG || !horizontal?.generateSVG) {
    console.error('雨你相遇動態輸出：缺少共用生成器或直橫式 SVG。');
    return;
  }

  function element(document, name, attributes) {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    return node;
  }
  function animate(document, node, attributes) {
    if (node) node.appendChild(element(document, 'animate', attributes));
  }
  function translate(document, node, attributes) {
    if (node) node.appendChild(element(document, 'animateTransform', {
      attributeName: 'transform', type: 'translate', repeatCount: 'indefinite', ...attributes
    }));
  }

  function rainLayer(document, svg, width, height) {
    // 原生雨絲插在畫面後層：不更動任何原有字、漣漪或濕墨圖層。
    const layer = element(document, 'g', {
      id: 'rain-animated-streaks', fill: 'none', 'stroke-linecap': 'round', 'aria-hidden': 'true'
    });
    for (let i = 0; i < 56; i++) {
      const x = 44 + ((i * 179 + 31) % (width - 88));
      const y = -110 + ((i * 131 + 23) % (height + 220));
      const length = 30 + (i % 6) * 7;
      const opacity = 0.16 + (i % 5) * 0.034;
      const duration = (3.4 + (i % 9) * 0.26).toFixed(2) + 's';
      const begin = (-((i * 19) % 51) / 10).toFixed(2) + 's';
      const line = element(document, 'path', {
        d: `M${x} ${y} l-8 ${length}`,
        stroke: i % 4 ? '#7295a3' : '#a8c6ce',
        'stroke-width': i % 3 ? '1.15' : '1.8', opacity: opacity.toFixed(2)
      });
      translate(document, line, {
        values: '0 -130;12 180', dur: duration, begin
      });
      animate(document, line, {
        attributeName: 'opacity', values: `0;${opacity.toFixed(2)};${opacity.toFixed(2)};0`,
        keyTimes: '0;.18;.78;1', dur: duration, begin, repeatCount: 'indefinite'
      });
      layer.appendChild(line);
    }
    const defs = Array.from(svg.children).find(child => child.localName === 'defs');
    if (!defs) throw new Error('雨你相遇：SVG 缺少圖層定義。');
    svg.insertBefore(layer, defs.nextSibling);
  }

  function rippleMotion(document, node, index) {
    const original = Number(node.getAttribute('opacity') || 0.6);
    const low = (original * 0.65).toFixed(3);
    animate(document, node, {
      attributeName: 'opacity', values: `${original};${low};${original}`,
      dur: (4.1 + index % 4 * 0.65).toFixed(2) + 's',
      begin: (-index * .3).toFixed(2) + 's', repeatCount: 'indefinite'
    });
    translate(document, node, {
      values: '0 0;0 5;0 0', dur: (5.7 + index % 3).toFixed(2) + 's',
      begin: (-index * .46).toFixed(2) + 's'
    });
  }

  function addMotion(source, orientation) {
    const document = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (document.querySelector('parsererror')) throw new Error('雨你相遇：原始 SVG 格式有誤。');
    const svg = document.documentElement;
    if (svg.namespaceURI !== NS || svg.localName !== 'svg') throw new Error('雨你相遇：來源不是 SVG。');
    const verticalMode = orientation === 'vertical';
    if (!verticalMode && orientation !== 'horizontal') throw new Error('雨你相遇：不支援的排列方式。');
    rainLayer(document, svg, verticalMode ? 840 : 1200, verticalMode ? 1200 : 760);

    if (verticalMode) {
      const ripples = svg.querySelectorAll('g[stroke="#4b7786"]');
      if (!ripples.length) throw new Error('雨你相遇：直式漣漪圖層不存在。');
      ripples.forEach((node, i) => rippleMotion(document, node, i));
      svg.querySelectorAll('path[fill="#719bab"]').forEach((node, i) => {
        translate(document, node, {
          values: '0 -3;0 5;0 -3', dur: (3.8 + i % 3 * .5).toFixed(2) + 's',
          begin: (-i * .41).toFixed(2) + 's'
        });
      });
    } else {
      const ripples = svg.querySelectorAll('path[stroke="#7197a5"]');
      if (!ripples.length) throw new Error('雨你相遇：橫式漣漪圖層不存在。');
      ripples.forEach((node, i) => rippleMotion(document, node, i));
    }
    const desc = svg.querySelector('desc');
    if (desc) desc.textContent += ' 動態版本包含緩緩落下的雨絲、水面漣漪與水滴微動，能離線獨立播放。';
    return new XMLSerializer().serializeToString(document);
  }

  function makeGenerator(art, orientation, size) {
    return library.create({
      maxChars: 4,
      sourceSize: size,
      renderSVG(text) { return addMotion(art.generateSVG(text), orientation); },
      filenames: {
        svg: text => `${library.fileSafe(text)}_雨你相遇_${orientation === 'vertical' ? '直式' : '橫式'}_動態.svg`
      }
    });
  }
  const generators = Object.freeze({
    vertical: makeGenerator(vertical, 'vertical', { width: 840, height: 1200 }),
    horizontal: makeGenerator(horizontal, 'horizontal', { width: 1200, height: 760 })
  });
  function select(orientation) {
    if (!Object.hasOwn(generators, orientation)) throw new Error('雨你相遇：不支援的排列方式。');
    return generators[orientation];
  }
  global.SlowlyRainAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return select(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return select(orientation).downloadSVG(text); }
  });
})(window);
