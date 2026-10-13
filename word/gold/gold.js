"use strict";
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlyGoldTemplate;
  const lib = global.SlowlyTextGenerator;
  if (!lib?.create) {
    console.error('金碧輝煌：未載入軍火庫 text_generator_component.js。');
    return;
  }
  if (typeof TEMPLATE !== 'string') {
    console.error('金碧輝煌：未載入 SVG 模板 gold_template.js。');
    return;
  }
  const POSITIONS = Object.freeze({
    1: [[420, 585, 405, 0]],
    2: [[415, 352, 320, -2], [426, 826, 320, 2]],
    3: [[418, 228, 286, -2], [415, 598, 286, 0], [427, 968, 286, 2]],
    4: [[417, 174, 252, -3], [427, 454, 252, 1], [410, 738, 252, -1], [428, 1020, 252, 2]]
  });
  const round = n => Math.round(n * 10) / 10;
  function buildRays(points) {
    return points.map(([x, y, size], index) => {
      const radius = size * .95;
      return `<g transform="translate(${x} ${y}) rotate(${index * 17})"><ellipse cx="0" cy="0" rx="${round(radius)}" ry="${round(radius * .45)}" fill="url(#goldGlow)"/><ellipse cx="0" cy="0" rx="${round(radius * .62)}" ry="${round(radius * .18)}" fill="url(#goldGlow)" transform="rotate(90)"/></g>`;
    }).join('\n');
  }
  function buildFiligree(points) {
    const ornaments = [];
    points.forEach(([x, y, size], index) => {
      const left = x - size * .75;
      const right = x + size * .75;
      const top = y - size * .74;
      const bottom = y + size * .74;
      ornaments.push(`<path d="M${round(left - 30)} ${round(top + 10)} C${round(left - 100)} ${round(top - 54)} ${round(left - 98)} ${round(top + 112)} ${round(left - 28)} ${round(top + 70)}"/>`);
      ornaments.push(`<path d="M${round(right + 30)} ${round(bottom - 10)} C${round(right + 95)} ${round(bottom + 50)} ${round(right + 105)} ${round(bottom - 110)} ${round(right + 20)} ${round(bottom - 70)}"/>`);
      if (index === 0) {
        ornaments.push(`<path d="M${round(x - 120)} ${round(top - 65)} Q${x} ${round(top - 118)} ${round(x + 120)} ${round(top - 65)}"/>`);
      }
      if (index === points.length - 1) {
        ornaments.push(`<path d="M${round(x - 125)} ${round(bottom + 64)} Q${x} ${round(bottom + 126)} ${round(x + 125)} ${round(bottom + 64)}"/>`);
      }
    });
    return ornaments.join('\n');
  }
  function buildEtching(points) {
    return points.map(([x, y, size], index) => {
      const lines = [];
      for (let i = -3; i <= 3; i += 1) {
        lines.push(`<path d="M${round(x - 78)} ${round(y + i * 42)} Q${x} ${round(y + i * 42 - 28)} ${round(x + 80)} ${round(y + i * 42)}" stroke="#fff6cd" stroke-width="${index % 2 ? 2 : 1.5}" opacity=".28"/>`);
      }
      return lines.join('');
    }).join('\n');
  }
  function buildJewels(count) {
    const jewels = [];
    for (let i = 0; i < 10 + count * 2; i += 1) {
      const x = 106 + (i * 77) % 620;
      const y = 96 + (i * 141) % 1002;
      const fill = i % 3 === 0 ? '#f8e594' : i % 3 === 1 ? '#d7a13a' : '#fff8d0';
      jewels.push(`<g transform="translate(${x} ${y}) rotate(${(i * 19) % 90})"><rect x="-6" y="-6" width="12" height="12" rx="1" fill="${fill}" opacity=".8"/><circle cx="0" cy="0" r="2" fill="#fffbe8"/></g>`);
    }
    return jewels.join('\n');
  }
  function buildSparkles(count) {
    const stars = [];
    for (let i = 0; i < 28 + count * 7; i += 1) {
      const x = 78 + (i * 101 + 13) % 688;
      const y = 56 + (i * 157 + 29) % 1080;
      const size = 5 + (i % 4) * 2;
      stars.push(`<g transform="translate(${x} ${y})" opacity="${i % 3 === 0 ? .95 : .55}"><path d="M0 -${size} L0 ${size} M-${size} 0 L${size} 0" stroke="#fff4bc" stroke-width="1.4" stroke-linecap="round"/><path d="M-${round(size*.7)} -${round(size*.7)} L${round(size*.7)} ${round(size*.7)} M-${round(size*.7)} ${round(size*.7)} L${round(size*.7)} -${round(size*.7)}" stroke="#dba93f" stroke-width="1" stroke-linecap="round"/></g>`);
    }
    return stars.join('\n');
  }
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((char, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="goldGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(char)}</text>`;
    }).join('\n');
    const uses = chars.map((_, i) => `<use xlink:href="#goldGlyph${i}"/>`).join('\n');
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，鎏金藝術字，燙金浮雕、珠光與金色星芒；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      AURAS: buildRays(points),
      RAYS: buildRays(points),
      FILIGREE: buildFiligree(points),
      ETCHING: buildEtching(points),
      JEWELS: buildJewels(chars.length),
      SPARKLES: buildSparkles(chars.length)
    });
  }
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 58, paddingY: 42 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_金碧輝煌藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_金碧輝煌藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyGoldArt = Object.freeze({
    MAX,
    characters: lib.splitCharacters,
    splitCharacters: lib.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: generator.createPreview,
    makeURL: generator.makeURL,
    makeUrl: generator.makeURL,
    url: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover,
    formatSize: generator.formatSize,
    pngBlob: generator.pngBlob
  });
})(window);
