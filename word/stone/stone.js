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
  function jaggedPath(x, y, size, phase = 0) {
    const pts = [
      [x - size * 0.42, y - size * 0.44],
      [x - size * 0.18, y - size * (0.12 + phase * 0.03)],
      [x - size * 0.05, y - size * 0.18],
      [x + size * 0.06, y + size * 0.04],
      [x + size * 0.18, y - size * 0.03],
      [x + size * 0.28, y + size * 0.22],
      [x + size * 0.42, y + size * 0.46]
    ];
    return 'M' + pts.map(point => `${round(point[0])} ${round(point[1])}`).join(' L');
  }
  function sideCrack(x, y, size, side = 1) {
    const dir = side;
    const pts = [
      [x + dir * size * 0.06, y - size * 0.34],
      [x + dir * size * 0.18, y - size * 0.16],
      [x + dir * size * 0.04, y + size * 0.06],
      [x + dir * size * 0.16, y + size * 0.18],
      [x + dir * size * 0.08, y + size * 0.34]
    ];
    return 'M' + pts.map(point => `${round(point[0])} ${round(point[1])}`).join(' L');
  }
  function buildAuras(points) {
    return points.map(([x, y, size], index) => {
      const rx = round(size * 0.68);
      const ry = round(size * 0.34);
      return `<g transform="translate(${x} ${round(y + (index % 2 === 0 ? -2 : 12))})">
        <ellipse rx="${rx}" ry="${ry}" fill="url(#dustGlow)" opacity=".44"/>
        <ellipse rx="${round(rx * 0.54)}" ry="${round(ry * 0.46)}" fill="url(#dustGlow)" opacity=".24"/>
      </g>`;
    }).join('\n');
  }
  function buildCracks(points) {
    const lines = [];
    points.forEach(([x, y, size], index) => {
      const main = jaggedPath(x, y, size, index % 2 ? 1 : 0);
      const left = sideCrack(x, y, size, -1);
      const right = sideCrack(x, y, size, 1);
      lines.push(`<path d="${main}" fill="none" stroke="#2a1a15" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".94"/>`);
      lines.push(`<path d="${main}" fill="none" stroke="url(#magma)" stroke-width="6.4" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/>`);
      lines.push(`<path d="${left}" fill="none" stroke="#261712" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round" opacity=".86"/>`);
      lines.push(`<path d="${left}" fill="none" stroke="url(#magma)" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round" opacity=".88"/>`);
      lines.push(`<path d="${right}" fill="none" stroke="#261712" stroke-width="5.1" stroke-linecap="round" stroke-linejoin="round" opacity=".82"/>`);
      lines.push(`<path d="${right}" fill="none" stroke="url(#magma)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" opacity=".82"/>`);
      lines.push(`<path d="M${round(x - size * 0.2)} ${round(y + size * 0.18)} L${round(x - size * 0.08)} ${round(y + size * 0.02)} L${round(x + size * 0.05)} ${round(y + size * 0.1)}" fill="none" stroke="#1d1513" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity=".72"/>`);
      lines.push(`<path d="M${round(x + size * 0.04)} ${round(y - size * 0.24)} L${round(x + size * 0.18)} ${round(y - size * 0.06)} L${round(x + size * 0.28)} ${round(y - size * 0.14)}" fill="none" stroke="#1d1513" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".66"/>`);
    });
    return lines.join('\n');
  }
  function buildCrackGlow(points) {
    return points.map(([x, y, size], index) => {
      const main = jaggedPath(x, y, size, index % 2 ? 1 : 0);
      const side = sideCrack(x, y, size, index % 2 ? -1 : 1);
      return `<g>
        <path d="${main}" fill="none" stroke="url(#magma)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity=".38"/>
        <path d="${side}" fill="none" stroke="url(#magma)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".26"/>
      </g>`;
    }).join('\n');
  }
  function buildInnerChips(points) {
    const parts = [];
    points.forEach(([x, y, size], index) => {
      const chips = [
        [[x - size * 0.32, y - size * 0.08], [x - size * 0.14, y - size * 0.18], [x - size * 0.1, y + size * 0.02], [x - size * 0.24, y + size * 0.08]],
        [[x + size * 0.06, y + size * 0.1], [x + size * 0.22, y], [x + size * 0.18, y + size * 0.2], [x + size * 0.02, y + size * 0.26]],
        [[x - size * 0.02, y - size * 0.28], [x + size * 0.14, y - size * 0.36], [x + size * 0.18, y - size * 0.16], [x + size * 0.02, y - size * 0.14]]
      ];
      chips.forEach((poly, chipIndex) => {
        const pts = poly.map(point => `${round(point[0])},${round(point[1])}`).join(' ');
        parts.push(`<polygon points="${pts}" fill="${chipIndex === 1 ? '#4d4540' : '#6b635b'}" opacity="${index % 2 ? '.52' : '.46'}"/>`);
        parts.push(`<polyline points="${pts}" fill="none" stroke="#f2ebdf" stroke-width="1.1" opacity=".34"/>`);
      });
    });
    return parts.join('\n');
  }
  function fragmentPolygon(cx, cy, size, rotate = 0, tone = '#8a8179') {
    const pts = [
      [-0.42, -0.5],
      [0.32, -0.38],
      [0.46, 0.1],
      [0.04, 0.54],
      [-0.5, 0.22]
    ].map(([px, py]) => {
      const x = px * size;
      const y = py * size;
      const rad = rotate * Math.PI / 180;
      const rx = x * Math.cos(rad) - y * Math.sin(rad);
      const ry = x * Math.sin(rad) + y * Math.cos(rad);
      return `${round(cx + rx)},${round(cy + ry)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="${tone}" stroke="#ede4d4" stroke-width="1.2" opacity=".88"/>`;
  }
  function buildFragments(points) {
    const out = [];
    points.forEach(([x, y, size], index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      out.push(fragmentPolygon(x - dir * size * 0.78, y - size * 0.54, 40, -18 * dir, '#8b8177'));
      out.push(fragmentPolygon(x + dir * size * 0.82, y + size * 0.34, 30, 16 * dir, '#6c645d'));
      out.push(fragmentPolygon(x - dir * size * 0.56, y + size * 0.68, 24, -24 * dir, '#94887d'));
      out.push(`<path d="M${round(x - dir * size * 0.56)} ${round(y - size * 0.34)} Q${round(x - dir * size * 0.86)} ${round(y - size * 0.28)} ${round(x - dir * size * 1.02)} ${round(y - size * 0.5)}" fill="none" stroke="#c7b495" stroke-width="1.6" opacity=".56"/>`);
      out.push(`<path d="M${round(x + dir * size * 0.34)} ${round(y + size * 0.42)} Q${round(x + dir * size * 0.82)} ${round(y + size * 0.68)} ${round(x + dir * size * 1.04)} ${round(y + size * 0.54)}" fill="none" stroke="#df8b36" stroke-width="1.5" opacity=".46"/>`);
    });
    return out.join('\n');
  }
  function buildShocks(points) {
    const paths = [];
    points.forEach(([x, y, size], index) => {
      paths.push(`<path d="M${round(x - size * 0.92)} ${round(y + size * 0.58)} Q${x} ${round(y + size * 0.28)} ${round(x + size * 0.92)} ${round(y + size * 0.5)}" fill="none" stroke="#e0c8a2" stroke-width="2.2" opacity=".54"/>`);
      paths.push(`<path d="M${round(x - size * 0.76)} ${round(y - size * 0.5)} Q${round(x - size * 0.06)} ${round(y - size * 0.88)} ${round(x + size * 0.66)} ${round(y - size * 0.44)}" fill="none" stroke="#f2ddbc" stroke-width="1.6" opacity=".44"/>`);
      const sparks = [
        [x - size * 0.86, y - size * 0.1, 9],
        [x + size * 0.88, y - size * 0.46, 10],
        [x + size * 0.68, y + size * 0.56, 7]
      ];
      sparks.forEach(([sx, sy, r]) => {
        paths.push(`<g transform="translate(${round(sx)} ${round(sy)})" opacity=".74"><path d="M0 -${r} L0 ${r} M-${r} 0 L${r} 0" stroke="#f9e6c3" stroke-width="1.3" stroke-linecap="round"/><path d="M-${round(r * 0.68)} -${round(r * 0.68)} L${round(r * 0.68)} ${round(r * 0.68)} M-${round(r * 0.68)} ${round(r * 0.68)} L${round(r * 0.68)} -${round(r * 0.68)}" stroke="#cf7f28" stroke-width="1" stroke-linecap="round"/></g>`);
      });
    });
    return paths.join('\n');
  }
  function buildDust(points) {
    const dots = [];
    points.forEach(([x, y, size], index) => {
      const list = [
        [x - size * 0.72, y - size * 0.38, 2.2, '#f7e6c2'],
        [x + size * 0.8, y - size * 0.12, 1.8, '#f0d0a3'],
        [x + size * 0.74, y + size * 0.46, 2.5, '#f7d882'],
        [x - size * 0.46, y + size * 0.7, 2, '#d7c4ab']
      ];
      list.forEach(([sx, sy, r, fill]) => dots.push(`<circle cx="${round(sx)}" cy="${round(sy)}" r="${r}" fill="${fill}" opacity="${index % 2 ? '.82' : '.68'}"/>`));
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
      DESC: helpers.escapeXML(`${text}，裂石、震波與熔光沿著字體展開的藝術字；透明背景。`),
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
