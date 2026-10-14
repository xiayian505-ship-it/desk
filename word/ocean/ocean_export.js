"use strict";
/*
 * 煙波浩渺｜動態 SVG 完整輸出
 * 用原 SVG 的 letterMask 限制流動薄霧在文字筆畫內；保留水波動畫。
 * 預覽仍使用原本的水波 SVG + 軍火庫 Canvas 薄霧，不額外疊一層。
 * 匯出的 SVG 可離線播放，不需要 Canvas、CSS 或外部 JavaScript。
 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const vertical = global.SlowlyOceanArt;
  const horizontal = global.SlowlyOceanHorizontalArt;
  const NS = 'http://www.w3.org/2000/svg';
  if (!library?.create || !vertical?.generateAnimatedSVG || !horizontal?.generateAnimatedSVG) {
    console.error('煙波浩渺：缺少直式／橫式動態水波 SVG。');
    return;
  }

  function element(document, name, attributes = {}) {
    const node = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }
  function addFog(source) {
    const document = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (document.querySelector('parsererror')) throw new Error('煙波浩渺：來源 SVG 格式有誤。');
    const svg = document.documentElement;
    if (svg.namespaceURI !== NS || svg.localName !== 'svg') throw new Error('煙波浩渺：來源不是 SVG。');
    if (!document.getElementById('letterMask') || !document.getElementById('oceanMistSoft')) {
      throw new Error('煙波浩渺：來源缺少文字裁切或霧化濾鏡。');
    }
    const glyphs = Array.from(document.querySelectorAll('#glyphBank text'));
    if (!glyphs.length) throw new Error('煙波浩渺：找不到文字筆畫。');
    const layer = element(document, 'g', {
      id: 'ocean-export-moving-fog', 'clip-path': 'url(#letterMask)', 'aria-hidden': 'true'
    });
    glyphs.forEach((glyph, index) => {
      const x = Number(glyph.getAttribute('x'));
      const y = Number(glyph.getAttribute('y'));
      const size = Number(glyph.getAttribute('font-size'));
      if (![x, y, size].every(Number.isFinite)) throw new Error('煙波浩渺：字形位置無法辨識。');
      const group = element(document, 'g', { opacity: index % 2 ? '.3' : '.35' });
      const cloudA = element(document, 'ellipse', {
        cx: x - size * .15, cy: y - size * .21,
        rx: size * .49, ry: size * .13, fill: '#f4ffff',
        filter: 'url(#oceanMistSoft)', opacity: '.63'
      });
      const cloudB = element(document, 'ellipse', {
        cx: x + size * .12, cy: y + size * .20,
        rx: size * .44, ry: size * .10, fill: '#c9eef4',
        filter: 'url(#oceanMistSoft)', opacity: '.55'
      });
      group.append(cloudA, cloudB);
      const duration = (9.8 + index * 1.2).toFixed(1) + 's';
      const begin = (-index * 1.3).toFixed(1) + 's';
      group.appendChild(element(document, 'animateTransform', {
        attributeName: 'transform', type: 'translate',
        values: '-18 -4;20 1;-18 -4', dur: duration, begin,
        repeatCount: 'indefinite'
      }));
      group.appendChild(element(document, 'animate', {
        attributeName: 'opacity', values: '.20;.42;.20', dur: duration, begin,
        repeatCount: 'indefinite'
      }));
      layer.appendChild(group);
    });
    // 額外霧層位在水波／雲影後方、字邊亮線前方，避免遮住文字輪廓。
    const wetRim = document.getElementById('wet-rim');
    if (!wetRim) throw new Error('煙波浩渺：找不到作品亮邊圖層。');
    svg.insertBefore(layer, wetRim);
    const description = svg.querySelector('desc');
    if (description) description.textContent += ' 動態 SVG 保留水波位移與裁切在文字筆畫內的流動霧氣。';
    return new XMLSerializer().serializeToString(document);
  }
  function makeGenerator(art, orientation, size) {
    return library.create({
      maxChars: 4,
      sourceSize: size,
      renderSVG(text) { return addFog(art.generateAnimatedSVG(text)); },
      filenames: { svg: text => `${library.fileSafe(text)}_煙波浩渺_${orientation === 'vertical' ? '直式' : '橫式'}_完整動態.svg` }
    });
  }
  const generators = Object.freeze({
    vertical: makeGenerator(vertical, 'vertical', { width: 840, height: 1200 }),
    horizontal: makeGenerator(horizontal, 'horizontal', { width: 1200, height: 760 })
  });
  function generator(orientation) {
    if (orientation !== 'vertical' && orientation !== 'horizontal') throw new Error('煙波浩渺：不支援的排列方式。');
    return generators[orientation];
  }
  global.SlowlyOceanExportArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return generator(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return generator(orientation).downloadSVG(text); }
  });
})(window);
