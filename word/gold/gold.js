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
  function buildAuras(points) {
    return points.map(([x, y, size], index) => {
      const rx = round(size * 0.67);
      const ry = round(size * 0.38);
      const offsetY = index % 2 === 0 ? -10 : 16;
      return `<g transform="translate(${x} ${y + offsetY})">
        <ellipse rx="${rx}" ry="${ry}" fill="url(#goldGlow)" opacity=".94"/>
        <ellipse rx="${round(rx * 0.72)}" ry="${round(ry * 0.5)}" fill="url(#goldGlow)" opacity=".48"/>
      </g>`;
    }).join('\n');
  }
  function buildRays(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const lift = size * 0.6;
      const width = size * 0.88;
      parts.push(`<path d="M${round(x - width)} ${round(y - lift)} Q${x} ${round(y - lift - 42)} ${round(x + width)} ${round(y - lift)}" stroke="url(#goldStroke)" stroke-width="2.1" fill="none" opacity=".42"/>`);
      parts.push(`<path d="M${round(x - width * 0.94)} ${round(y + lift)} Q${x} ${round(y + lift + 42)} ${round(x + width * 0.94)} ${round(y + lift)}" stroke="url(#goldStroke)" stroke-width="2.1" fill="none" opacity=".28"/>`);
      parts.push(`<path d="M${round(x - width * 0.62)} ${round(y - 12)} Q${x} ${round(y - 50)} ${round(x + width * 0.62)} ${round(y - 12)}" stroke="url(#goldGlow)" stroke-width="10" fill="none" opacity=".22"/>`);
    });
    const first = points[0], last = points[points.length - 1];
    parts.push(`<path d="M${round(first[0] - 138)} ${round(first[1] - first[2] * 0.96)} Q${first[0]} ${round(first[1] - first[2] * 1.25)} ${round(first[0] + 138)} ${round(first[1] - first[2] * 0.96)}" stroke="url(#goldStroke)" stroke-width="3.4" fill="none" opacity=".54"/>`);
    parts.push(`<path d="M${round(last[0] - 146)} ${round(last[1] + last[2] * 0.98)} Q${last[0]} ${round(last[1] + last[2] * 1.28)} ${round(last[0] + 146)} ${round(last[1] + last[2] * 0.98)}" stroke="url(#goldStroke)" stroke-width="3.4" fill="none" opacity=".46"/>`);
    return parts.join('\n');
  }
  function buildFiligree(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const sw = size * 0.92;
      const sh = size * 0.42;
      const left = x - sw;
      const right = x + sw;
      const upper = y - sh;
      const lower = y + sh;
      parts.push(`<path d="M${round(left)} ${round(y - 10)} C${round(left - 48)} ${round(upper - 46)} ${round(left - 66)} ${round(lower + 30)} ${round(left - 8)} ${round(lower - 10)} C${round(left - 38)} ${round(lower + 14)} ${round(left - 33)} ${round(lower + 55)} ${round(left + 8)} ${round(lower + 62)}"/>`);
      parts.push(`<path d="M${round(right)} ${round(y + 10)} C${round(right + 48)} ${round(lower + 46)} ${round(right + 66)} ${round(upper - 30)} ${round(right + 8)} ${round(upper + 10)} C${round(right + 38)} ${round(upper - 14)} ${round(right + 33)} ${round(upper - 55)} ${round(right - 8)} ${round(upper - 62)}"/>`);
      parts.push(`<path d="M${round(x - size * 0.58)} ${round(y + size * 0.7)} Q${x} ${round(y + size * 0.46)} ${round(x + size * 0.58)} ${round(y + size * 0.7)}" opacity="${index % 2 ? '.48' : '.34'}"/>`);
    });
    const first = points[0], last = points[points.length - 1];
    parts.push(`<path d="M${round(first[0] - 88)} ${round(first[1] - first[2] * 1.1)} Q${first[0] - 24} ${round(first[1] - first[2] * 1.32)} ${first[0]} ${round(first[1] - first[2] * 1.05)} Q${first[0] + 24} ${round(first[1] - first[2] * 1.32)} ${round(first[0] + 88)} ${round(first[1] - first[2] * 1.1)}"/>`);
    parts.push(`<path d="M${round(last[0] - 96)} ${round(last[1] + last[2] * 1.14)} Q${last[0] - 32} ${round(last[1] + last[2] * 1.38)} ${last[0]} ${round(last[1] + last[2] * 1.08)} Q${last[0] + 32} ${round(last[1] + last[2] * 1.38)} ${round(last[0] + 96)} ${round(last[1] + last[2] * 1.14)}"/>`);
    return parts.join('\n');
  }
  function buildEtching(points) {
    return points.map(([x, y, size], index) => {
      const lines = [];
      for (let i = -3; i <= 3; i += 1) {
        const offset = i * size * 0.14;
        lines.push(`<path d="M${round(x - size * 0.32)} ${round(y + offset)} Q${x} ${round(y + offset - 28)} ${round(x + size * 0.33)} ${round(y + offset)}" stroke="#fff7d8" stroke-width="${index % 2 ? 1.8 : 1.4}" opacity=".34"/>`);
      }
      lines.push(`<path d="M${round(x - size * 0.22)} ${round(y - size * 0.28)} Q${round(x + size * 0.02)} ${round(y - size * 0.4)} ${round(x + size * 0.24)} ${round(y - size * 0.18)}" stroke="#fffef0" stroke-width="2.2" opacity=".36"/>`);
      return lines.join('');
    }).join('\n');
  }
  function buildJewels(points) {
    return points.map(([x, y, size], index) => {
      const d = size * 0.55;
      const flip = index % 2 === 0 ? 1 : -1;
      return `<g>
        <g transform="translate(${round(x - d)} ${round(y - size * 0.42)}) rotate(-12)">
          <path d="M0 -10 L7 0 L0 10 L-7 0Z" fill="#fff7d5" stroke="#ca9731" stroke-width="1.3"/>
          <circle cx="0" cy="0" r="2" fill="#fffef6"/>
        </g>
        <g transform="translate(${round(x + d * 0.92)} ${round(y + size * 0.34)}) rotate(16)">
          <path d="M0 -8 L5.5 0 L0 8 L-5.5 0Z" fill="#f5d46f" stroke="#b57d16" stroke-width="1.1"/>
          <circle cx="0" cy="0" r="1.7" fill="#fff6d5"/>
        </g>
        <path d="M${round(x - d * 0.88)} ${round(y - size * 0.34)} Q${round(x - d * 0.25)} ${round(y - size * 0.51)} ${round(x + d * 0.58)} ${round(y - size * 0.14)}" fill="none" stroke="#efd27e" stroke-width="1.1" stroke-dasharray="1.2 5.8" opacity=".65"/>
        <path d="M${round(x + d * 0.55)} ${round(y + size * 0.14)} Q${round(x + d * 0.14)} ${round(y + size * 0.5)} ${round(x - d * 0.72)} ${round(y + size * 0.25)}" fill="none" stroke="#efd27e" stroke-width="1.1" stroke-dasharray="1.2 5.8" opacity=".55"/>
      </g>`;
    }).join('\n');
  }
  function buildSparkles(points) {
    const stars = [];
    points.forEach(([x, y, size], index) => {
      const placements = [
        [x - size * 0.78, y - size * 0.18, 7],
        [x + size * 0.67, y - size * 0.54, 9],
        [x + size * 0.7, y + size * 0.45, 6],
        [x - size * 0.54, y + size * 0.62, 5]
      ];
      placements.forEach(([sx, sy, r], pIndex) => {
        const glow = pIndex === 1 ? '#fff8dd' : '#ffe9a6';
        stars.push(`<g transform="translate(${round(sx)} ${round(sy)})" opacity="${index % 2 && pIndex === 3 ? '.55' : '.85'}"><path d="M0 -${r} L0 ${r} M-${r} 0 L${r} 0" stroke="${glow}" stroke-width="1.5" stroke-linecap="round"/><path d="M-${round(r * 0.68)} -${round(r * 0.68)} L${round(r * 0.68)} ${round(r * 0.68)} M-${round(r * 0.68)} ${round(r * 0.68)} L${round(r * 0.68)} -${round(r * 0.68)}" stroke="#d89d2a" stroke-width="1.05" stroke-linecap="round"/></g>`);
      });
    });
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
      DESC: helpers.escapeXML(`${text}，鎏金藝術字，燙金浮雕、珠光寶石與金紋流光；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      AURAS: buildAuras(points),
      RAYS: buildRays(points),
      FILIGREE: buildFiligree(points),
      ETCHING: buildEtching(points),
      JEWELS: buildJewels(points),
      SPARKLES: buildSparkles(points)
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
