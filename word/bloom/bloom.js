"use strict";
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlyBloomTemplate;
  const lib = global.SlowlyTextGenerator;
  if (!lib?.create) {
    console.error('鳥語花香：未載入軍火庫 text_generator_component.js。');
    return;
  }
  if (typeof TEMPLATE !== 'string') {
    console.error('鳥語花香：未載入 SVG 模板 bloom_template.js。');
    return;
  }
  const POSITIONS = Object.freeze({
    1: [[420, 585, 398, -1]],
    2: [[412, 352, 316, -3], [426, 824, 316, 2]],
    3: [[423, 230, 280, -4], [406, 598, 280, 2], [432, 968, 280, -1]],
    4: [[416, 176, 248, -4], [430, 454, 248, 1], [402, 734, 248, -3], [432, 1012, 248, 2]]
  });
  const round = n => Math.round(n * 10) / 10;
  function flower(x, y, scale, rotate, palette = 0) {
    const petals = [
      ['#fce9ee', '#f5c8d3', '#f1b2c0'],
      ['#fff0f1', '#f7d7dc', '#e7b6c2'],
      ['#f7e4e9', '#efc0cd', '#d6a4b4']
    ][palette % 3];
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(${rotate}) scale(${scale})">
      <path d="M0 -26 C10 -26 18 -14 18 -4 C18 8 8 14 0 12 C-8 14 -18 8 -18 -4 C-18 -14 -10 -26 0 -26Z" fill="${petals[0]}"/>
      <path d="M24 -2 C24 8 11 15 1 15 C-11 15 -15 6 -13 -4 C-15 -14 -11 -25 1 -25 C11 -25 24 -14 24 -2Z" fill="${petals[1]}"/>
      <path d="M0 24 C-10 24 -18 12 -18 1 C-18 -11 -8 -15 0 -13 C8 -15 18 -11 18 1 C18 12 10 24 0 24Z" fill="${petals[0]}"/>
      <path d="M-24 -2 C-24 -14 -11 -25 -1 -25 C11 -25 15 -14 13 -4 C15 6 11 15 -1 15 C-11 15 -24 8 -24 -2Z" fill="${petals[1]}"/>
      <circle cx="0" cy="0" r="7.6" fill="${petals[2]}" stroke="#fff8fb" stroke-width="1.2"/>
    </g>`;
  }
  function leaf(x, y, scale, rotate, fill = '#8baa77') {
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(${rotate}) scale(${scale})"><path d="M0 0 C18 -14 40 -11 58 0 C39 13 18 16 0 0Z" fill="${fill}" opacity=".86"/><path d="M4 0 Q24 0 53 0" fill="none" stroke="#dfeacc" stroke-width="1.6" opacity=".72" stroke-linecap="round"/></g>`;
  }
  function bird(x, y, scale, flip = 1, tone = '#907983') {
    return `<g transform="translate(${round(x)} ${round(y)}) scale(${round(flip * scale)} ${scale})"><path d="M0 0 C19 -37 64 -34 84 -8 C51 -1 32 5 14 26 C9 14 6 6 0 0Z" fill="${tone}" opacity=".9"/><path d="M78 -6 L108 -18 L90 10 Z" fill="#d8a772" opacity=".78"/><path d="M18 12 Q42 3 70 2" fill="none" stroke="#f5e7ec" stroke-width="2" opacity=".32"/><circle cx="57" cy="-13" r="2.7" fill="#3a2f31"/></g>`;
  }
  function buildBranches(points) {
    const spine = [];
    const startX = points[0][0] - 156;
    const startY = points[0][1] + 26;
    spine.push(`M${round(startX)} ${round(startY)}`);
    points.forEach(([x, y], index) => {
      const bendX = x + (index % 2 === 0 ? 82 : -74);
      const bendY = y + 26;
      spine.push(`Q${round(bendX)} ${round(bendY)} ${round(x)} ${round(y + 46)}`);
    });
    const branchPaths = [`<path d="${spine.join(' ')}" fill="none" stroke="#89a174" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>`];
    points.forEach(([x, y, size], index) => {
      const dir = index % 2 === 0 ? -1 : 1;
      branchPaths.push(`<path d="M${round(x + dir * 12)} ${round(y - 10)} Q${round(x + dir * (size * 0.5))} ${round(y - size * 0.38)} ${round(x + dir * (size * 0.82))} ${round(y - size * 0.56)}" fill="none" stroke="#97af80" stroke-width="3.4" stroke-linecap="round"/>`);
      branchPaths.push(`<path d="M${round(x - dir * 16)} ${round(y + size * 0.16)} Q${round(x - dir * (size * 0.34))} ${round(y + size * 0.44)} ${round(x - dir * (size * 0.7))} ${round(y + size * 0.66)}" fill="none" stroke="#91a879" stroke-width="2.8" stroke-linecap="round"/>`);
    });
    return branchPaths.join('\n');
  }
  function buildBlossoms(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const d = size * 0.54;
      parts.push(flower(x - d, y - size * 0.38, 0.62, -18 + index * 10, index));
      parts.push(flower(x + d * 0.82, y + size * 0.2, 0.52, 20 - index * 8, index + 1));
      if (index % 2 === 0) parts.push(flower(x + size * 0.2, y - size * 0.63, 0.48, 12, index + 2));
    });
    return parts.join('\n');
  }
  function buildPetals(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      parts.push(leaf(x - dir * size * 0.72, y - size * 0.18, 0.7, -18 * dir, '#a1b78d'));
      parts.push(leaf(x + dir * size * 0.82, y + size * 0.34, 0.56, 26 * dir, '#809a73'));
      parts.push(`<g transform="translate(${round(x + dir * size * 0.55)} ${round(y - size * 0.72)}) rotate(${18 * dir})" opacity=".58"><path d="M0 0 C12 -9 21 -7 24 2 C22 12 9 20 0 18 C-9 20 -19 12 -22 2 C-19 -7 -12 -10 0 0Z" fill="#f6d8df"/></g>`);
      parts.push(`<g transform="translate(${round(x - dir * size * 0.62)} ${round(y + size * 0.62)}) rotate(${-20 * dir})" opacity=".52"><path d="M0 0 C10 -8 18 -6 20 2 C18 11 8 18 0 17 C-8 18 -17 11 -19 2 C-17 -6 -10 -9 0 0Z" fill="#f1c4d0"/></g>`);
    });
    return parts.join('\n');
  }
  function buildBirds(points) {
    const birds = [];
    if (points.length) {
      const [x, y, size] = points[0];
      birds.push(bird(x + size * 0.62, y - size * 0.72, 0.68, 1));
    }
    if (points.length > 2) {
      const [x, y, size] = points[points.length - 1];
      birds.push(bird(x - size * 0.76, y + size * 0.2, 0.52, -1, '#8c707d'));
    }
    return birds.join('\n');
  }
  function buildVeins(points) {
    return points.map(([x, y, size], index) => {
      const lines = [];
      for (let i = -2; i <= 2; i += 1) {
        lines.push(`<path d="M${round(x - size * 0.3)} ${round(y + i * size * 0.15)} Q${x} ${round(y + i * size * 0.15 - 26)} ${round(x + size * 0.3)} ${round(y + i * size * 0.15)}" stroke="${index % 2 ? '#fff1f4' : '#f2d7de'}" stroke-width="1.9" opacity=".28"/>`);
      }
      lines.push(`<path d="M${round(x - size * 0.2)} ${round(y - size * 0.26)} Q${round(x + size * 0.03)} ${round(y - size * 0.38)} ${round(x + size * 0.22)} ${round(y - size * 0.16)}" stroke="#fff8fa" stroke-width="2" opacity=".24"/>`);
      return lines.join('');
    }).join('\n');
  }
  function buildSparks(points) {
    const dots = [];
    points.forEach(([x, y, size], index) => {
      const near = [
        [x - size * 0.52, y - size * 0.56, 2.1, '#f5dce1'],
        [x + size * 0.48, y - size * 0.34, 1.6, '#e2efcc'],
        [x + size * 0.62, y + size * 0.42, 2.4, '#f2ccd5'],
        [x - size * 0.38, y + size * 0.58, 1.8, '#d9e8c4']
      ];
      near.forEach(([sx, sy, r, fill]) => dots.push(`<circle cx="${round(sx)}" cy="${round(sy)}" r="${r}" fill="${fill}" opacity="${index % 2 ? '.72' : '.6'}"/>`));
    });
    return dots.join('\n');
  }
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((char, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="bloomGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(char)}</text>`;
    }).join('\n');
    const uses = chars.map((_, i) => `<use xlink:href="#bloomGlyph${i}"/>`).join('\n');
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，春花藝術字，花枝穿字、鳥停花間、花瓣與春色相伴；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      BRANCHES: buildBranches(points),
      BLOSSOMS: buildBlossoms(points),
      PETALS: buildPetals(points),
      BIRDS: buildBirds(points),
      VEINS: buildVeins(points),
      BLOSSOM_SPARKS: buildSparks(points)
    });
  }
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 58, paddingY: 48 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_鳥語花香藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_鳥語花香藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyBloomArt = Object.freeze({
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
