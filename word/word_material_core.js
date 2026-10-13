"use strict";
/* 慢慢藝術字批次系列：共用幾何、遮罩、輸出接線。
 * 字面／圖騰／附著裝飾由每一款的 xxx_template.js 定義；不複製軍火庫。
 * 宿主保有字色、材質、動態和 UI 的完整控制權。
 */
(function (global) {
  const FONT_SERIF = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const FONT_SANS = '"Noto Sans CJK TC", "Microsoft JhengHei", sans-serif';
  const round = n => Math.round(n * 100) / 100;
  const move = (x, y, scale, raw) => `<g transform="translate(${round(x)} ${round(y)}) scale(${round(scale)})">${raw}</g>`;

  function motif(type, index) {
    const i = index;
    const lines = [];
    switch (type) {
      case 'aurora':
        for (let k = -3; k <= 3; k++) {
          lines.push(`<path d="M${-148 + k * 18} -150 C${-126 + k * 16} -24 ${-18 + k * 12} -18 ${k * 28} 152" fill="none" stroke="${k % 2 ? '#e9faff' : '#f1b4ff'}" stroke-width="${20 - Math.abs(k) * 2}" opacity=".37"/>`);
        }
        break;
      case 'crystal':
        for (let k = 0; k < 12; k++) {
          const x = -132 + (k % 4) * 86;
          const y = -132 + Math.floor(k / 4) * 118;
          lines.push(`<polygon points="${x},${y} ${x + 62},${y - 15} ${x + 87},${y + 66} ${x + 25},${y + 104}" fill="${k % 2 ? '#ffffff' : '#6bc9e9'}" fill-opacity=".25" stroke="#f6ffff" stroke-width="2" opacity=".78"/>`);
        }
        break;
      case 'dragon':
        for (let row = -2; row <= 2; row++) for (let col = -2; col <= 2; col++) {
          const x = col * 66 + (row % 2 ? 32 : 0), y = row * 67;
          lines.push(`<path d="M${x - 31} ${y - 8} Q${x} ${y - 33} ${x + 31} ${y - 8} Q${x + 28} ${y + 28} ${x} ${y + 40} Q${x - 28} ${y + 28} ${x - 31} ${y - 8}Z" fill="${(row + col) % 2 ? '#b4d49a' : '#073c39'}" opacity=".32" stroke="#ead8a4" stroke-width="1.8"/>`);
        }
        break;
      case 'ember':
        for (let k = 0; k < 12; k++) {
          const x = -140 + (k * 67 % 290), y = -145 + (k * 83 % 280);
          lines.push(`<path d="M${x} ${y} q15 -35 4 -56 q39 42 12 69" fill="none" stroke="${k % 2 ? '#ffb352' : '#ffcfc0'}" stroke-width="${5 + k % 3}" opacity=".65"/>`);
        }
        break;
      case 'hologram':
        for (let k = -12; k <= 12; k++) {
          const y = k * 14;
          lines.push(`<path d="M-178 ${y} H178" stroke="${k % 3 ? '#e3ffff' : '#ff8efb'}" stroke-width="${k % 4 ? 2 : 5}" opacity=".52"/>`);
        }
        lines.push('<path d="M-150 -70 H154 M-150 72 H154" stroke="#fff" stroke-width="9" opacity=".16"/>');
        break;
      case 'ink':
        for (let k = 0; k < 32; k++) {
          const x = -154 + (k * 89 % 308), y = -148 + (k * 137 % 296);
          lines.push(`<ellipse cx="${x}" cy="${y}" rx="${2 + k % 7}" ry="${2 + (k * 3) % 6}" fill="${k % 3 ? '#edf1eb' : '#15262c'}" opacity=".32"/>`);
        }
        lines.push('<path d="M-150 78 C-54 16 35 55 154 -34" fill="none" stroke="#d7e1d9" stroke-width="14" opacity=".14"/>');
        break;
      case 'jade':
        for (let k = -3; k <= 3; k++) {
          lines.push(`<path d="M${k * 46 - 37} -160 Q${k * 48 + 58} -42 ${k * 32 - 28} 160" fill="none" stroke="${k % 2 ? '#e9ffdb' : '#205c55'}" stroke-width="${2 + Math.abs(k % 3)}" opacity=".42"/>`);
        }
        break;
      case 'knit':
        for (let k = -8; k <= 8; k++) {
          const x = k * 23;
          lines.push(`<path d="M${x} -160 Q${x + 15} -126 ${x} -92 T${x} -24 T${x} 44 T${x} 112 T${x} 180" fill="none" stroke="${k % 2 ? '#ffe8d7' : '#9f424b'}" stroke-width="7" opacity=".48"/>`);
        }
        for (let k = -5; k <= 5; k++) lines.push(`<path d="M-172 ${k * 29} H172" stroke="#ffe7e0" stroke-width="3" opacity=".2"/>`);
        break;
      case 'lace':
        for (let k = -3; k <= 3; k++) for (let l = -3; l <= 3; l++) {
          lines.push(`<circle cx="${k * 52}" cy="${l * 48}" r="${12 + (k + l + 14) % 3 * 4}" fill="none" stroke="#ffffff" stroke-width="3" opacity=".55"/>`);
        }
        break;
      case 'mirror':
        for (let k = 0; k < 11; k++) {
          const x = -145 + (k * 81 % 305), y = -146 + (k * 109 % 290);
          lines.push(`<path d="M${x} ${y} l58 -28 l-22 81 Z" fill="${k % 2 ? '#ffffff' : '#6f9bac'}" opacity=".25" stroke="#e6faff" stroke-width="1.6"/>`);
        }
        break;
      case 'neon':
        for (let k = -6; k <= 6; k++) lines.push(`<path d="M-160 ${k * 26} Q0 ${k * 26 - 23} 160 ${k * 26}" fill="none" stroke="${k % 2 ? '#ff9ae7' : '#8cf1ff'}" stroke-width="2.4" opacity=".34"/>`);
        break;
      case 'porcelain':
        for (let k = 0; k < 7; k++) {
          const x = -110 + (k * 51 % 230), y = -120 + (k * 89 % 235);
          lines.push(`<path d="M${x} ${y + 32} Q${x - 27} ${y} ${x} ${y - 27} Q${x + 30} ${y} ${x} ${y + 32}Z" fill="none" stroke="#164c91" stroke-width="4" opacity=".65"/>`);
          lines.push(`<circle cx="${x}" cy="${y}" r="5" fill="#1e569a" opacity=".75"/>`);
        }
        break;
      case 'quicksand':
        for (let k = 0; k < 130; k++) {
          const x = -146 + (k * 47 % 292), y = -144 + (k * 113 % 286);
          lines.push(`<circle cx="${x}" cy="${y}" r="${1.1 + (k % 4) * .6}" fill="${k % 3 ? '#ffefbc' : '#8e653d'}" opacity="${k % 2 ? .45 : .7}"/>`);
        }
        break;
      case 'umbra':
        for (let k = -4; k <= 4; k++) lines.push(`<path d="M${k * 34} -150 L${k * 34 - 64} 155" stroke="${k % 2 ? '#e1d7cc' : '#292738'}" stroke-width="13" opacity=".18"/>`);
        break;
      case 'velvet':
        for (let k = -9; k <= 9; k++) {
          lines.push(`<path d="M${k * 21} -156 q22 42 0 80 t0 80 t0 80 t0 80" fill="none" stroke="${k % 2 ? '#ffb3ba' : '#390925'}" stroke-width="5" opacity=".24"/>`);
        }
        break;
      case 'wings':
        for (let k = 0; k < 25; k++) {
          const x = -150 + (k * 59 % 300), y = -140 + (k * 91 % 280);
          lines.push(`<path d="M${x} ${y} q${24 + k % 3 * 8} -18 ${30 + k % 3 * 8} -70 q-46 12 -64 67 q13 16 ${34 - k % 3 * 4} 3Z" fill="${k % 2 ? '#ffffff' : '#b4a7d1'}" stroke="#fafaff" stroke-width="1.2" opacity=".42"/>`);
        }
        break;
      case 'xylophone':
        for (let k = -5; k <= 5; k++) {
          const x = k * 28;
          lines.push(`<rect x="${x - 7}" y="-163" width="14" height="326" rx="5" fill="${k % 3 === 0 ? '#edc394' : '#704532'}" opacity=".37"/>`);
          lines.push(`<circle cx="${x}" cy="-100" r="4.5" fill="#e5d6b8" opacity=".6"/>`);
        }
        break;
      case 'yin-yang':
        lines.push('<path d="M0 -168 Q-120 -64 0 8 Q120 64 0 168" fill="none" stroke="#fffefa" stroke-width="28" opacity=".34"/>');
        lines.push('<circle cx="-60" cy="-64" r="34" fill="#fffefa" opacity=".48"/>');
        lines.push('<circle cx="60" cy="64" r="34" fill="#0e1115" opacity=".4"/>');
        break;
      case 'zipper':
        for (let k = -12; k <= 12; k++) {
          const y = k * 13;
          lines.push(`<rect x="-20" y="${y - 5}" width="16" height="9" rx="2" fill="#e8f1f2" stroke="#515e68" stroke-width="1.4" opacity=".83"/>`);
          lines.push(`<rect x="5" y="${y - 5}" width="16" height="9" rx="2" fill="#d1dce4" stroke="#495862" stroke-width="1.4" opacity=".85"/>`);
        }
        lines.push('<path d="M0 -166 V170" stroke="#e6e8e7" stroke-width="2" opacity=".75"/>');
        break;
    }
    return lines.join('\n');
  }

  function outerDecoration(type, slots) {
    // 克制的字旁裝飾：必須貼近每一字的筆畫，不延伸成背景。
    return slots.map(({ x, y, size }, i) => {
      const s = size / 250;
      let d = '';
      const k = t => round(t);
      const sparkle = `<path d="M0 -10 L0 10 M-10 0 L10 0" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`;
      switch (type) {
        case 'aurora':
          d = '<path d="M-114 35 Q-154 -55 -85 -124 M93 -110 Q154 -20 115 100" fill="none" stroke="#adeee6" stroke-width="4" opacity=".55"/>';
          break;
        case 'crystal':
          d = '<path d="M-113 -76 L-133 -48 L-107 -23Z M103 55 L131 78 L102 102Z" fill="#d8f8ff" stroke="#9acbe8" stroke-width="2" opacity=".85"/>';
          break;
        case 'dragon':
          d = '<path d="M-116 -30 C-164 -130 -30 -147 -38 -174 M105 46 C155 146 68 150 92 172" fill="none" stroke="#d3b774" stroke-width="3.1" opacity=".66"/>';
          break;
        case 'ember':
          d = '<path d="M-113 60 q-31 -48 -2 -94 q-6 39 16 61 M105 -63 q27 -37 2 -76" fill="none" stroke="#ff8648" stroke-width="4" opacity=".72"/>';
          break;
        case 'hologram':
          d = '<path d="M-126 -60 H-99 M99 56 H127" stroke="#ff7de0" stroke-width="4" opacity=".85"/>';
          break;
        case 'ink':
          d = '<circle cx="-122" cy="47" r="5" fill="#29313a" opacity=".5"/><circle cx="118" cy="-68" r="3" fill="#29313a" opacity=".34"/>';
          break;
        case 'jade':
          d = '<path d="M-117 -24 Q-136 24 -101 88 M104 -98 Q145 -37 115 26" fill="none" stroke="#e2d39b" stroke-width="2" opacity=".52"/>';
          break;
        case 'knit':
          d = '<path d="M-115 -65 Q-150 -98 -138 -40 Q-120 -8 -109 -34" fill="none" stroke="#f7c9ac" stroke-width="5" opacity=".55"/>';
          break;
        case 'lace':
          d = '<path d="M-118 -14 Q-144 -46 -118 -78 Q-92 -50 -118 -14 M113 18 Q140 48 114 80 Q90 50 113 18" fill="none" stroke="#fdf8e9" stroke-width="2" opacity=".75"/>';
          break;
        case 'mirror':
          d = '<path d="M-123 -56 L-136 -26 L-117 -19 M120 25 L140 56 L122 70" fill="none" stroke="#d7e9f8" stroke-width="2.5" opacity=".7"/>';
          break;
        case 'neon':
          d = `<g transform="translate(-115 -58)">${sparkle}</g><g transform="translate(120 68)">${sparkle}</g>`;
          break;
        case 'porcelain':
          d = '<path d="M-125 16 q-22 -30 0 -52 q21 26 0 52 M112 -42 q18 -24 0 -43 q-18 22 0 43" fill="none" stroke="#4276a9" stroke-width="2.4" opacity=".56"/>';
          break;
        case 'quicksand':
          d = Array.from({length:12},(_,n)=>`<circle cx="${-140+(n*37%280)}" cy="${106+(n*13%52)}" r="${1+n%3}" fill="#d8b979" opacity=".48"/>`).join('');
          break;
        case 'umbra':
          d = '<path d="M-114 -70 Q-140 -16 -111 48" fill="none" stroke="#a39da2" stroke-width="6" opacity=".24"/>';
          break;
        case 'velvet':
          d = '<path d="M-115 35 Q-145 -46 -99 -113 M107 -108 Q146 -24 112 64" fill="none" stroke="#e6b19e" stroke-width="2.7" opacity=".35"/>';
          break;
        case 'wings':
          d = '<path d="M-110 -52 Q-154 -98 -128 -136 Q-106 -122 -110 -52 M111 37 Q164 0 143 -46 Q117 -32 111 37" fill="#f4f2fc" stroke="#bbb5d0" stroke-width="1.8" opacity=".7"/>';
          break;
        case 'xylophone':
          d = '<path d="M-122 28 Q-158 0 -128 -33 Q-100 -50 -105 -9 M113 -40 Q153 -3 123 35" fill="none" stroke="#e5b873" stroke-width="3" opacity=".55"/>';
          break;
        case 'yin-yang':
          d = '<path d="M-118 -38 Q-138 -3 -118 36 M118 38 Q138 3 118 -36" fill="none" stroke="#a0a4a3" stroke-width="3" opacity=".38"/>';
          break;
        case 'zipper':
          d = '<path d="M-126 -28 H-104 M105 30 H126" stroke="#ebeff3" stroke-width="3" opacity=".5"/>';
          break;
      }
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
    const motifContent = slots.map(s => move(s.x, s.y, s.size / 250, motif(theme.code, s.index))).join('\n');
    const extras = outerDecoration(theme.code, slots);
    const edge = theme.code === 'neon' ? 7.2 : theme.code === 'lace' ? 2.5 : 4.6;
    const highlight = theme.code === 'ink' ? '.22' : '.64';
    const depthOffset = theme.code === 'neon' ? 0 : 8;
    const special = theme.code === 'umbra'
      ? `<g fill="#e4dad3" opacity=".35" transform="translate(-6 -4)">${uses}</g><g fill="#16141c" opacity=".48" transform="translate(4 5)">${uses}</g>`
      : theme.code === 'mirror'
      ? `<g fill="none" stroke="#e9ffff" stroke-width="2" transform="translate(0 -6)" opacity=".5">${uses}</g>`
      : '';
    const innerDetail = theme.code === 'neon'
      ? `<g fill="none" stroke="${theme.highlight}" stroke-width="1.4" opacity=".9">${uses}</g>`
      : `<g fill="none" stroke="${theme.highlight}" stroke-width="1.35" opacity="${highlight}">${uses}</g>`;
    const animationPlaceholder = '<!--SLOWLY_MOTION-->';
    // 霓虹燈管、火光、極光等使用單獨的動態 SVG；靜態 PNG 永遠繪製不動版本。
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safe(text + ' ' + theme.title)}">
  <title>${safe(text)}｜${safe(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${safe(theme.detail)}；透明背景，所有紋理在字體上。</desc>
  <defs>${defs}</defs>
  <g id="backshadow" transform="translate(5 ${depthOffset})" opacity="${theme.code === 'neon' ? '.16' : '.21'}" fill="${theme.shadow}" filter="url(#materialShadow)">${uses}</g>
  ${special}
  <g id="glyph-face" fill="url(#faceGrad)" stroke="url(#outlineGrad)" stroke-width="${edge}" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  <g id="material-motion" clip-path="url(#letterMask)">${motifContent}${animationPlaceholder}</g>
  ${innerDetail}
  <g id="attached-decor">${extras}</g>
</svg>`;
  }

  const MOTIONS = {
    aurora: `<animateTransform attributeName="transform" type="translate" values="-6 0;10 -12;-6 0" dur="7s" repeatCount="indefinite"/>`,
    ember: `<animate attributeName="opacity" values=".65;1;.73;.95;.65" dur="3.2s" repeatCount="indefinite"/>`,
    hologram: `<animateTransform attributeName="transform" type="translate" values="0 0;3 -8;0 0;-2 6;0 0" dur="4.6s" repeatCount="indefinite"/>`,
    mirror: `<animate attributeName="opacity" values=".6;1;.72;.95;.6" dur="5.4s" repeatCount="indefinite"/>`,
    neon: `<animate attributeName="opacity" values="1;.84;1;.97;.73;1" dur="4.2s" repeatCount="indefinite"/>`,
    quicksand: `<animateTransform attributeName="transform" type="translate" values="0 0;0 14;0 0" dur="6s" repeatCount="indefinite"/>`,
    wings: `<animateTransform attributeName="transform" type="translate" values="0 0;5 -10;0 0" dur="5.8s" repeatCount="indefinite"/>`,
    xylophone: `<animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="2.8s" repeatCount="indefinite"/>`,
    'yin-yang': `<animate attributeName="opacity" values=".55;.9;.55" dur="5.2s" repeatCount="indefinite"/>`
  };

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
    const animationEnabled = Boolean(MOTIONS[theme.code]);
    function generateAnimatedSVG(text) {
      if (!animationEnabled) throw new Error('本系列沒有動態 SVG 模式。');
      return generator.generateSVG(text).replace('<!--SLOWLY_MOTION-->', MOTIONS[theme.code]);
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
      // Keep URL alive until next frame; revoke after user interaction has processed the click.
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
  global.SlowlyMaterialArtCore = Object.freeze({ create });
})(window);
