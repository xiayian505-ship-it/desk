"use strict";
/* 鏡花水月｜獨立藝術字核心。保留原視覺，不再依賴共用材質核心。 */
(function (global) {
  const FONT_SERIF = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const FONT_SANS = '"Noto Sans CJK TC", "Microsoft JhengHei", sans-serif';
  const round = n => Math.round(n * 100) / 100;
  const move = (x, y, scale, raw) => `<g transform="translate(${round(x)} ${round(y)}) scale(${round(scale)})">${raw}</g>`;

  function motif() {
    const lines = [];
    for (let k = 0; k < 11; k++) {
          const x = -145 + (k * 81 % 305), y = -146 + (k * 109 % 290);
          lines.push(`<path d="M${x} ${y} l58 -28 l-22 81 Z" fill="${k % 2 ? '#ffffff' : '#6f9bac'}" opacity=".25" stroke="#e6faff" stroke-width="1.6"/>`);
        }
    return lines.join('\n');
  }

  function outerDecoration(slots) {
    return slots.map(({ x, y, size }) => {
      const s = size / 250;
      const d = (() => {
        return '<path d="M-123 -56 L-136 -26 L-117 -19 M120 25 L140 56 L122 70" fill="none" stroke="#d7e9f8" stroke-width="2.5" opacity=".7"/>';
      })();
      return move(x, y, s, d);
    }).join('\n');
  }

  function embedSVG(text, helpers, layout, theme, horizontal) {
    const chars = helpers.splitCharacters ? helpers.splitCharacters(text) : global.SlowlyTextGeneratorCore.splitCharacters(text);
    const count = chars.length;
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const POS = {
      1: [[420, 585, 400, 0]],
      2: [[416, 355, 315, -2], [424, 828, 315, 2]],
      3: [[418, 230, 283, -2], [414, 600, 283, 1], [426, 965, 283, 2]],
      4: [[418, 172, 248, -3], [426, 452, 248, 1], [410, 735, 248, -1], [425, 1020, 248, 2]]
    };
    const slots = chars.map((char, i) => {
      const [x, y, size, rot] = horizontal
        ? [layout.slots[i].x, layout.slots[i].y, count === 1 ? 336 : count === 2 ? 292 : count === 3 ? 248 : 222, [-2, 2, -1, 1][i]]
        : POS[count][i];
      return { char, x, y, size, rot, index: i };
    });
    const baseId = `m${theme.code}`;
    const font = theme.font === 'sans' ? FONT_SANS : FONT_SERIF;
    const safe = helpers.escapeXML;
    const glyphBank = slots.map(s => `<text id="${baseId}g${s.index}" x="${round(s.x)}" y="${round(s.y)}" text-anchor="middle" dominant-baseline="central" font-family='${safe(font)}' font-size="${s.size}" font-weight="${theme.weight || 850}" transform="rotate(${s.rot} ${s.x} ${s.y})">${safe(s.char)}</text>`).join('\n');
    const uses = slots.map(s => `<use href="#${baseId}g${s.index}"/>`).join('\n');
    const gradient = theme.colors.map((c, i) => `<stop offset="${Math.round(i * 100 / (theme.colors.length - 1))}%" stop-color="${c}"/>`).join('');
    const defs = `<linearGradient id="faceGrad" x1=".08" y1=".04" x2=".88" y2=".94">${gradient}</linearGradient>
      <linearGradient id="outlineGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.highlight}"/><stop offset=".52" stop-color="${theme.outline}"/><stop offset="1" stop-color="${theme.highlight}"/></linearGradient>
      <filter id="materialShadow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="4.2"/></filter>
      <filter id="materialGlow" x="-26%" y="-26%" width="152%" height="152%"><feGaussianBlur stdDeviation="4.8"/></filter>
      <g id="glyphBank">${glyphBank}</g>
      <clipPath id="letterMask">${uses}</clipPath>`;
    const motifContent = slots.map(s => move(s.x, s.y, s.size / 250, motif())).join('\n');
    const extras = outerDecoration(slots);
    const edge = 4.6;
    const highlight = .64;
    const depthOffset = 8;
    const special = `<g fill="none" stroke="#e9ffff" stroke-width="2" transform="translate(0 -6)" opacity=".5">${uses}</g>`;
    const innerDetail = `<g fill="none" stroke="${theme.highlight}" stroke-width="1.35" opacity="${highlight}">${uses}</g>`;
    const animationPlaceholder = '<!--SLOWLY_MOTION-->';
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safe(text + ' ' + theme.title)}">
  <title>${safe(text)}｜${safe(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${safe(theme.detail)}；透明背景，所有紋理在字體上。</desc>
  <defs>${defs}</defs>
  <g id="backshadow" transform="translate(5 ${depthOffset})" opacity=".21" fill="${theme.shadow}" filter="url(#materialShadow)">${uses}</g>
  ${special}
  <g id="glyph-face" fill="url(#faceGrad)" stroke="url(#outlineGrad)" stroke-width="${edge}" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  <g id="material-motion" clip-path="url(#letterMask)">${motifContent}${animationPlaceholder}</g>
  ${innerDetail}
  <g id="attached-decor">${extras}</g>
</svg>`;
  }

  const MOTION = `<animate attributeName="opacity" values=".6;1;.72;.95;.6" dur="5.4s" repeatCount="indefinite"/>`;

  function create(theme, orientation) {
    const horizontal = orientation === 'horizontal';
    const lib = horizontal ? global.SlowlyHorizontalTextGenerator : global.SlowlyTextGenerator;
    const core = global.SlowlyTextGeneratorCore;
    if (!lib?.create || !core) {
      console.error(`慢慢藝術字 ${theme.code}：軍火庫文字產生器未載入。`);
      return null;
    }
    const generator = lib.create({
      maxChars: 4,
      sourceSize: horizontal ? { width: 1200, height: 760 } : { width: 840, height: 1200 },
      renderSVG(text, helpers, layout) {
        return embedSVG(text, helpers, layout, theme, horizontal);
      },
      presets: {
        png: { scale: 2 },
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 42 : 54, paddingY: horizontal ? 62 : 44 }
      },
      filenames: {
        svg: text => `${core.fileSafe(text)}_${theme.code}_${orientation}.svg`,
        png: text => `${core.fileSafe(text)}_${theme.code}_${orientation}_2x.png`,
        cover: text => `${core.fileSafe(text)}_${theme.code}_${orientation}_cover_700x1000.png`
      }
    });
    const animationEnabled = Boolean(MOTION);
    function generateAnimatedSVG(text) {
      if (!animationEnabled) throw new Error('本系列沒有動態 SVG 模式。');
      return generator.generateSVG(text).replace('<!--SLOWLY_MOTION-->', MOTION);
    }
    function downloadAnimatedSVG(text) {
      if (!animationEnabled) throw new Error('本系列沒有動態 SVG 模式。');
      const normalized = generator.normalize(text);
      if (!normalized) throw new Error('請先輸入文字。');
      const blob = new Blob([generateAnimatedSVG(normalized)], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const filename = `${core.fileSafe(normalized)}_${theme.code}_${orientation}_animated.svg`;
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      return Promise.resolve({ filename });
    }
    return Object.freeze({
      MAX: 4,
      characters: generator.splitCharacters,
      splitCharacters: generator.splitCharacters,
      normalize: generator.normalize,
      generateSVG: generator.generateSVG,
      makeURL: generator.makeURL,
      makeUrl: generator.makeURL,
      url: generator.makeURL,
      createPreview: generator.createPreview,
      downloadSVG: generator.downloadSVG,
      downloadPNG: text => generator.downloadPNG(text, 'png'),
      downloadCover: generator.downloadCover,
      formatSize: generator.formatSize,
      hasAnimatedSVG: animationEnabled,
      generateAnimatedSVG,
      downloadAnimatedSVG
    });
  }

  global.SlowlyMirrorArtCore = Object.freeze({ create });
})(window);
