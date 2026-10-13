"use strict";
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlyStoneTemplate;
  const lib = global.SlowlyTextGenerator;
  if (!lib?.create) {
    console.error('石破天驚：未載入軍火庫 text_generator_component.js。');
    return;
  }
  if (typeof TEMPLATE !== 'string') {
    console.error('石破天驚：未載入 SVG 模板 stone_template.js。');
    return;
  }
  const POSITIONS = Object.freeze({
    1: [[420, 586, 392, 0]],
    2: [[417, 350, 314, -2], [425, 826, 314, 2]],
    3: [[418, 228, 282, -2], [407, 598, 282, 1], [430, 968, 282, -1]],
    4: [[417, 174, 248, -3], [430, 454, 248, 1], [405, 736, 248, -2], [430, 1018, 248, 2]]
  });
  const round = value => Math.round(value * 10) / 10;
  function mainCrack(x, y, size, phase = 0) {
    const pts = [
      [x - size * 0.38, y - size * 0.46],
      [x - size * 0.18, y - size * (0.18 + phase * 0.04)],
      [x - size * 0.02, y - size * 0.2],
      [x + size * 0.1, y + size * 0.02],
      [x + size * 0.18, y - size * 0.02],
      [x + size * 0.28, y + size * 0.18],
      [x + size * 0.4, y + size * 0.48]
    ];
    return 'M' + pts.map(point => `${round(point[0])} ${round(point[1])}`).join(' L');
  }
  function branchCrack(x, y, size, side = 1, upper = false) {
    const dir = side;
    const pts = upper
      ? [
        [x + dir * size * 0.06, y - size * 0.34],
        [x + dir * size * 0.16, y - size * 0.14],
        [x + dir * size * 0.28, y - size * 0.22]
      ]
      : [
        [x - dir * size * 0.04, y + size * 0.04],
        [x - dir * size * 0.18, y + size * 0.18],
        [x - dir * size * 0.08, y + size * 0.34]
      ];
    return 'M' + pts.map(point => `${round(point[0])} ${round(point[1])}`).join(' L');
  }
  function chipPath(cx, cy, scale, rotate = 0) {
    const shape = [[-0.48, -0.38], [0.26, -0.46], [0.52, -0.04], [0.08, 0.46], [-0.44, 0.12]];
    const rad = rotate * Math.PI / 180;
    return shape.map(([px, py]) => {
      const x = px * scale;
      const y = py * scale;
      const rx = x * Math.cos(rad) - y * Math.sin(rad);
      const ry = x * Math.sin(rad) + y * Math.cos(rad);
      return `${round(cx + rx)},${round(cy + ry)}`;
    }).join(' ');
  }
  function buildAuras(points) {
    return points.map(([x, y, size], index) => {
      const rx = round(size * 0.64);
      const ry = round(size * 0.3);
      return `<g transform="translate(${x} ${round(y + (index % 2 ? 10 : -2))})">
        <ellipse rx="${rx}" ry="${ry}" fill="url(#dustGlow)" opacity=".3"/>
        <ellipse rx="${round(rx * 0.5)}" ry="${round(ry * 0.44)}" fill="url(#dustGlow)" opacity=".14"/>
      </g>`;
    }).join('\n');
  }
  function buildCrackGlow(points) {
    return points.map(([x, y, size], index) => {
      const main = mainCrack(x, y, size, index % 2 ? 1 : 0);
      return `<g>
        <path d="${main}" fill="none" stroke="url(#emberVein)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".2"/>
        <path d="${main}" fill="none" stroke="#d1a15a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".15"/>
      </g>`;
    }).join('\n');
  }
  function buildCracks(points) {
    const lines = [];
    points.forEach(([x, y, size], index) => {
      const main = mainCrack(x, y, size, index % 2 ? 1 : 0);
      const upper = branchCrack(x, y, size, index % 2 ? -1 : 1, true);
      const lower = branchCrack(x, y, size, index % 2 ? 1 : -1, false);
      lines.push(`<path d="${main}" fill="none" stroke="#211a17" stroke-width="8.8" stroke-linecap="round" stroke-linejoin="round" opacity=".94"/>`);
      lines.push(`<path d="${main}" fill="none" stroke="#c18a45" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" opacity=".48"/>`);
      lines.push(`<path d="${upper}" fill="none" stroke="#281f1b" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity=".78"/>`);
      lines.push(`<path d="${lower}" fill="none" stroke="#281f1b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".72"/>`);
      lines.push(`<path d="${upper}" fill="none" stroke="#b2793a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".3"/>`);
      lines.push(`<path d="${lower}" fill="none" stroke="#a96f32" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity=".26"/>`);
      lines.push(`<path d="M${round(x - size * 0.22)} ${round(y + size * 0.18)} L${round(x - size * 0.08)} ${round(y + size * 0.02)} L${round(x + size * 0.04)} ${round(y + size * 0.1)}" fill="none" stroke="#201916" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".54"/>`);
      lines.push(`<path d="M${round(x + size * 0.02)} ${round(y - size * 0.26)} L${round(x + size * 0.16)} ${round(y - size * 0.08)} L${round(x + size * 0.26)} ${round(y - size * 0.14)}" fill="none" stroke="#201916" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".48"/>`);
    });
    return lines.join('\n');
  }
  function buildInnerChips(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const chips = [
        [x - size * 0.28, y - size * 0.04, size * 0.14, -18],
        [x + size * 0.14, y + size * 0.16, size * 0.13, 12],
        [x + size * 0.06, y - size * 0.28, size * 0.11, -8]
      ];
      chips.forEach(([cx, cy, scale, rotate], chipIndex) => {
        const pts = chipPath(cx, cy, scale, rotate);
        parts.push(`<polygon points="${pts}" fill="${chipIndex === 1 ? '#574f49' : '#766c62'}" opacity="${index % 2 ? '.48' : '.42'}"/>`);
        parts.push(`<polyline points="${pts}" fill="none" stroke="#ede4d4" stroke-width=".9" opacity=".24"/>`);
      });
    });
    return parts.join('\n');
  }
  function buildFragments(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      const frags = [
        [x - dir * size * 0.74, y - size * 0.48, size * 0.15, -14 * dir, '#91867a'],
        [x + dir * size * 0.76, y + size * 0.3, size * 0.12, 11 * dir, '#6d655d'],
        [x - dir * size * 0.48, y + size * 0.62, size * 0.09, -22 * dir, '#a29587']
      ];
      frags.forEach(([cx, cy, scale, rotate, fill]) => {
        parts.push(`<polygon points="${chipPath(cx, cy, scale, rotate)}" fill="${fill}" stroke="#ece2d2" stroke-width="1.1" opacity=".84"/>`);
      });
      parts.push(`<path d="M${round(x - dir * size * 0.54)} ${round(y - size * 0.32)} Q${round(x - dir * size * 0.86)} ${round(y - size * 0.2)} ${round(x - dir * size * 0.98)} ${round(y - size * 0.4)}" fill="none" stroke="url(#dustLine)" stroke-width="1.2" opacity=".42"/>`);
      parts.push(`<path d="M${round(x + dir * size * 0.22)} ${round(y + size * 0.34)} Q${round(x + dir * size * 0.72)} ${round(y + size * 0.56)} ${round(x + dir * size * 0.96)} ${round(y + size * 0.44)}" fill="none" stroke="#b58e61" stroke-width="1.1" opacity=".34"/>`);
    });
    return parts.join('\n');
  }
  function buildShocks(points) {
    const paths = [];
    points.forEach(([x, y, size]) => {
      paths.push(`<path d="M${round(x - size * 0.82)} ${round(y + size * 0.52)} Q${x} ${round(y + size * 0.3)} ${round(x + size * 0.82)} ${round(y + size * 0.46)}" fill="none" stroke="url(#dustLine)" stroke-width="1.6" opacity=".34"/>`);
      paths.push(`<path d="M${round(x - size * 0.66)} ${round(y - size * 0.42)} Q${round(x - size * 0.06)} ${round(y - size * 0.68)} ${round(x + size * 0.6)} ${round(y - size * 0.36)}" fill="none" stroke="#d9c6aa" stroke-width="1.2" opacity=".26"/>`);
    });
    return paths.join('\n');
  }
  function buildDust(points) {
    const dots = [];
    points.forEach(([x, y, size], index) => {
      const list = [
        [x - size * 0.66, y - size * 0.34, 2.1, '#e8d9be'],
        [x + size * 0.72, y - size * 0.1, 1.8, '#d2b48b'],
        [x + size * 0.64, y + size * 0.42, 2.2, '#cda36b'],
        [x - size * 0.4, y + size * 0.64, 1.9, '#c5b29b']
      ];
      list.forEach(([sx, sy, r, fill]) => dots.push(`<circle cx="${round(sx)}" cy="${round(sy)}" r="${r}" fill="${fill}" opacity="${index % 2 ? '.78' : '.64'}"/>`));
    });
    return dots.join('\n');
  }
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((char, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="stoneGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(char)}</text>`;
    }).join('\n');
    const uses = chars.map((_, i) => `<use xlink:href="#stoneGlyph${i}"/>`).join('\n');
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，古碑震裂派藝術字。風化石刻、裂紋、崩口與塵霧都沿著字體本身展開；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      AURAS: buildAuras(points),
      CRACK_GLOW: buildCrackGlow(points),
      CRACKS: buildCracks(points),
      INNER_CHIPS: buildInnerChips(points),
      FRAGMENTS: buildFragments(points),
      SHOCKS: buildShocks(points),
      DUST: buildDust(points)
    });
  }
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 54, paddingY: 44 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_石破天驚藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_石破天驚藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyStoneArt = Object.freeze({
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
