"use strict";
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlySnowTemplate;
  const lib = global.SlowlyTextGenerator;
  if (!lib?.create) {
    console.error('大雪紛飛：未載入軍火庫 text_generator_component.js。');
    return;
  }
  if (typeof TEMPLATE !== 'string') {
    console.error('大雪紛飛：未載入 SVG 模板 snow_template.js。');
    return;
  }
  const POSITIONS = Object.freeze({
    1: [[420, 585, 395, 0]],
    2: [[418, 352, 315, -2], [424, 826, 315, 2]],
    3: [[420, 226, 280, -2], [408, 598, 280, 1], [426, 970, 280, -1]],
    4: [[418, 172, 248, -3], [430, 452, 248, 1], [402, 736, 248, -2], [430, 1018, 248, 2]]
  });
  const round = n => Math.round(n * 10) / 10;
  function flake(x, y, r, tone = '#ffffff') {
    return `<g transform="translate(${round(x)} ${round(y)})"><path d="M0 -${r} V${r} M-${r} 0 H${r} M-${round(r * 0.72)} -${round(r * 0.72)} L${round(r * 0.72)} ${round(r * 0.72)} M-${round(r * 0.72)} ${round(r * 0.72)} L${round(r * 0.72)} -${round(r * 0.72)}" stroke="${tone}" stroke-width="1.3" stroke-linecap="round" opacity=".88"/><circle cx="0" cy="0" r="${round(r * 0.18)}" fill="#f4fbff"/></g>`;
  }
  function buildMist(points) {
    return points.map(([x, y, size], index) => `<g transform="translate(${x} ${round(y + (index % 2 === 0 ? -4 : 12))})"><ellipse rx="${round(size * 0.66)}" ry="${round(size * 0.32)}" fill="url(#mistGlow)" opacity=".84"/><ellipse rx="${round(size * 0.46)}" ry="${round(size * 0.2)}" fill="url(#mistGlow)" opacity=".48"/></g>`).join('\n');
  }
  function buildCrystals(points) {
    const items = [];
    points.forEach(([x, y, size], index) => {
      const d = size * 0.62;
      items.push(`<g transform="translate(${round(x - d)} ${round(y - size * 0.34)}) rotate(${index % 2 === 0 ? -12 : 12})" opacity=".78"><path d="M0 -28 L16 0 L0 28 L-16 0Z" fill="#eef8ff" stroke="#a6c8e6" stroke-width="1.7"/><path d="M0 -16 L9 0 L0 16 L-9 0Z" fill="#d8ecff" opacity=".75"/></g>`);
      items.push(`<g transform="translate(${round(x + d * 0.82)} ${round(y + size * 0.22)}) rotate(${index % 2 === 0 ? 18 : -18})" opacity=".72"><path d="M0 -24 L14 0 L0 24 L-14 0Z" fill="#f4fbff" stroke="#b1cee7" stroke-width="1.5"/><path d="M0 -14 L8 0 L0 14 L-8 0Z" fill="#dcedff" opacity=".7"/></g>`);
      items.push(`<path d="M${round(x - size * 0.76)} ${round(y + size * 0.12)} Q${round(x - size * 0.5)} ${round(y - size * 0.06)} ${round(x - size * 0.22)} ${round(y - size * 0.24)}" fill="none" stroke="#d9efff" stroke-width="2.2" opacity=".56"/>`);
      items.push(`<path d="M${round(x + size * 0.22)} ${round(y + size * 0.24)} Q${round(x + size * 0.5)} ${round(y + size * 0.06)} ${round(x + size * 0.76)} ${round(y - size * 0.12)}" fill="none" stroke="#d9efff" stroke-width="2.2" opacity=".48"/>`);
    });
    return items.join('\n');
  }
  function buildSnowflakes(points) {
    const flakes = [];
    points.forEach(([x, y, size], index) => {
      flakes.push(flake(x - size * 0.7, y - size * 0.58, 8 + (index % 2) * 2));
      flakes.push(flake(x + size * 0.76, y - size * 0.18, 6.5, '#e9f7ff'));
      flakes.push(flake(x + size * 0.54, y + size * 0.56, 5.8, '#f7fcff'));
      flakes.push(flake(x - size * 0.46, y + size * 0.64, 5.2, '#e4f3ff'));
    });
    return flakes.join('\n');
  }
  function buildFrost(points) {
    return points.map(([x, y, size], index) => {
      const parts = [];
      for (let i = -3; i <= 3; i += 1) {
        const off = i * size * 0.14;
        parts.push(`<path d="M${round(x - size * 0.32)} ${round(y + off)} Q${round(x - size * 0.06)} ${round(y + off - 24)} ${x} ${round(y + off)} Q${round(x + size * 0.06)} ${round(y + off + 24)} ${round(x + size * 0.32)} ${round(y + off)}" stroke="${index % 2 ? '#f7fdff' : '#ddecfa'}" stroke-width="1.8" opacity=".38"/>`);
      }
      parts.push(`<path d="M${round(x - size * 0.18)} ${round(y - size * 0.3)} L${round(x + size * 0.08)} ${round(y - size * 0.08)} L${round(x + size * 0.22)} ${round(y - size * 0.24)}" stroke="#fafeff" stroke-width="2" opacity=".32"/>`);
      return parts.join('');
    }).join('\n');
  }
  function buildFlurries(points) {
    const dots = [];
    const curves = [];
    points.forEach(([x, y, size], index) => {
      curves.push(`<path d="M${round(x - size * 0.84)} ${round(y + size * 0.42)} Q${x} ${round(y + size * 0.12)} ${round(x + size * 0.82)} ${round(y + size * 0.34)}" fill="none" stroke="#eff8ff" stroke-width="2" opacity=".52"/>`);
      curves.push(`<path d="M${round(x - size * 0.62)} ${round(y - size * 0.34)} Q${round(x - size * 0.12)} ${round(y - size * 0.48)} ${round(x + size * 0.54)} ${round(y - size * 0.18)}" fill="none" stroke="#dff1ff" stroke-width="1.5" opacity=".42"/>`);
      const near = [
        [x - size * 0.58, y - size * 0.48, 1.7],
        [x + size * 0.62, y - size * 0.42, 1.4],
        [x + size * 0.7, y + size * 0.28, 1.8],
        [x - size * 0.46, y + size * 0.54, 1.5]
      ];
      near.forEach(([sx, sy, r]) => dots.push(`<circle cx="${round(sx)}" cy="${round(sy)}" r="${r}" fill="${index % 2 ? '#ffffff' : '#dff0ff'}" opacity=".75"/>`));
    });
    return curves.join('\n') + '\n' + dots.join('\n');
  }
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((char, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="snowGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(char)}</text>`;
    }).join('\n');
    const uses = chars.map((_, i) => `<use xlink:href="#snowGlyph${i}"/>`).join('\n');
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，雪晶藝術字，冰紋入字、雪花貼近筆畫、冷霜與雪晶相伴；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      MIST: buildMist(points),
      CRYSTALS: buildCrystals(points),
      SNOWFLAKES: buildSnowflakes(points),
      FROST: buildFrost(points),
      FLURRIES: buildFlurries(points)
    });
  }
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 54, paddingY: 46 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_大雪紛飛藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_大雪紛飛藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlySnowArt = Object.freeze({
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
