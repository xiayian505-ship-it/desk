"use strict";
/*
 * 星河入夢｜直式、橫式獨立動態 SVG 輸出
 * 原作品的字形、配色、星軌與靜態下載保持不變；
 * 只在「動態 SVG」版本加入 SVG 原生 SMIL，無需網站 CSS／JS 或字型檔。
 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const vertical = global.SlowlyStarArt;
  const horizontal = global.SlowlyStarHorizontalArt;
  const NS = 'http://www.w3.org/2000/svg';

  if (!library?.create || !vertical?.generateSVG || !horizontal?.generateSVG) {
    console.error('星河入夢動態輸出：缺少共用生成器或直橫式 SVG。');
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

  function floatingArtwork(document, svg) {
    // 只包住畫作圖層，不移動 defs、title、desc，保留現有構圖與向量內容。
    const art = element(document, 'g', { id: 'star-animated-artwork' });
    for (const child of Array.from(svg.children)) {
      if (!['title', 'desc', 'defs', 'metadata', 'style'].includes(child.localName)) art.appendChild(child);
    }
    art.insertBefore(element(document, 'animateTransform', {
      attributeName: 'transform', type: 'translate',
      values: '0 5;0 -5;0 5', dur: '9s', repeatCount: 'indefinite'
    }), art.firstChild);
    svg.appendChild(art);
    return art;
  }

  function twinkle(document, circle, index) {
    const base = Number(circle.getAttribute('opacity') || 1);
    const low = Math.max(0.12, base * 0.43).toFixed(3);
    const high = Math.min(1, base * 1.18).toFixed(3);
    const duration = (3.1 + (index % 7) * 0.59).toFixed(2);
    const begin = (-((index * 7) % 25) / 5).toFixed(2);
    animate(document, circle, {
      attributeName: 'opacity', values: `${base};${low};${high};${base}`,
      keyTimes: '0;0.36;0.76;1', dur: duration + 's', begin: begin + 's',
      repeatCount: 'indefinite'
    });
  }

  function addMotion(source, orientation) {
    const document = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (document.querySelector('parsererror')) throw new Error('星河入夢：原始 SVG 格式有誤。');
    const svg = document.documentElement;
    if (svg.namespaceURI !== NS || svg.localName !== 'svg') throw new Error('星河入夢：來源不是 SVG。');
    const artwork = floatingArtwork(document, svg);

    if (orientation === 'vertical') {
      const stars = Array.from(artwork.querySelectorAll('#field-stars circle'));
      if (!stars.length) throw new Error('星河入夢：找不到星點圖層。');
      // 只讓部分星點錯峰閃爍，不干擾原字形與所有細節。
      stars.forEach((circle, index) => { if (index % 17 === 0) twinkle(document, circle, index); });
      animate(document, artwork.querySelector('#celestial-ribbons'), {
        attributeName: 'opacity', values: '1;.74;1', dur: '7.8s', repeatCount: 'indefinite'
      });
      animate(document, artwork.querySelector('#signature-stars'), {
        attributeName: 'opacity', values: '1;.68;1', dur: '5.6s', repeatCount: 'indefinite'
      });
    } else if (orientation === 'horizontal') {
      const topGroup = Array.from(artwork.children).find(child => child.localName === 'g');
      const stars = topGroup ? Array.from(topGroup.querySelectorAll('circle')) : [];
      if (!stars.length) throw new Error('星河入夢：橫式星點圖層不存在。');
      stars.forEach((circle, index) => { if (index % 3 === 0) twinkle(document, circle, index); });
      const glow = artwork.querySelector('g[filter="url(#starGlow)"]');
      animate(document, glow, {
        attributeName: 'opacity', values: '.55;.85;.55', dur: '6.8s', repeatCount: 'indefinite'
      });
    } else {
      throw new Error('星河入夢：不支援的排列方式。');
    }
    const desc = svg.querySelector('desc');
    if (desc) desc.textContent += ' 動態版本包含緩慢浮動與星點微光，以 SVG 原生動畫獨立播放。';
    return new XMLSerializer().serializeToString(document);
  }

  function makeGenerator(art, orientation, size) {
    return library.create({
      maxChars: 4,
      sourceSize: size,
      renderSVG(text) { return addMotion(art.generateSVG(text), orientation); },
      filenames: {
        svg: text => `${library.fileSafe(text)}_星河入夢_${orientation === 'vertical' ? '直式' : '橫式'}_動態.svg`
      }
    });
  }

  const generators = Object.freeze({
    vertical: makeGenerator(vertical, 'vertical', { width: 840, height: 1200 }),
    horizontal: makeGenerator(horizontal, 'horizontal', { width: 1200, height: 760 })
  });
  function select(orientation) {
    if (!Object.hasOwn(generators, orientation)) throw new Error('星河入夢：不支援的排列方式。');
    return generators[orientation];
  }
  global.SlowlyStarAnimatedArt = Object.freeze({
    generateSVG(text, orientation = 'vertical') { return select(orientation).generateSVG(text); },
    downloadSVG(text, orientation = 'vertical') { return select(orientation).downloadSVG(text); }
  });
})(window);
