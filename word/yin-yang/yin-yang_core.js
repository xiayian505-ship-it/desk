"use strict";
/* 陰陽相生｜專屬藝術字核心。
 * 改為獨立核心：黑白互生、鏡像構圖、太極旋流與動態 SVG 全部由此產生。
 */
(function (global) {
  const FONT_SERIF = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const round = value => Math.round(Number(value || 0) * 100) / 100;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const safeArrayFrom = value => Array.from(String(value || ''));
  const xmlEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function buildVerticalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[420, 598, 420, 0]],
      2: [[420, 356, 330, -1], [420, 838, 330, 1]],
      3: [[420, 234, 294, -2], [420, 600, 294, 2], [420, 968, 294, -1]],
      4: [[420, 178, 258, -2], [420, 452, 258, 2], [420, 736, 258, -2], [420, 1016, 258, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[600, 392, 376, 0]],
      2: [[386, 392, 334, -2], [814, 392, 334, 2]],
      3: [[260, 392, 292, -2], [600, 392, 292, 2], [938, 392, 292, -1]],
      4: [[178, 392, 252, -2], [456, 392, 252, 2], [744, 392, 252, -2], [1024, 392, 252, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function applyMirrorModes(slots) {
    const count = slots.length;
    const modeMap = {
      1: ['normal'],
      2: ['normal', 'flipX'],
      3: ['normal', 'flipX', 'flipY'],
      4: ['normal', 'flipX', 'flipY', 'normal']
    };
    const modes = modeMap[count] || modeMap[4];
    return slots.map((slot, index) => ({ ...slot, mirror: modes[index] || 'normal' }));
  }

  function transformForSlot(slot) {
    const scale = slot.size / 250;
    const sx = slot.mirror === 'flipX' ? -scale : scale;
    const sy = slot.mirror === 'flipY' ? -scale : scale;
    return `translate(${round(slot.x)} ${round(slot.y)}) rotate(${round(slot.rotation)}) scale(${round(sx)} ${round(sy)})`;
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.48));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.48));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.48));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.43));
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    return { left, right, top, bottom, centerX, centerY, width: right - left, height: bottom - top };
  }

  function buildGlyphDefs(slots, theme) {
    return slots.map(slot => `<text id="glyph-${slot.index}" x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family='${xmlEscape(FONT_SERIF)}' font-size="250" font-weight="${theme.weight}">${xmlEscape(slot.char)}</text>`).join('');
  }

  function buildGlyphUses(slots) {
    return slots.map(slot => `<use href="#glyph-${slot.index}" transform="${transformForSlot(slot)}"/>`).join('');
  }

  function buildOuterRibbons(bounds, theme, horizontal, animated) {
    if (horizontal) {
      const darkPath = `M ${round(bounds.left - 70)} ${round(bounds.centerY - 16)} C ${round(bounds.left + 80)} ${round(bounds.top - 84)}, ${round(bounds.centerX - 162)} ${round(bounds.top + 12)}, ${round(bounds.centerX - 14)} ${round(bounds.centerY - 22)} S ${round(bounds.right + 16)} ${round(bounds.bottom + 74)}, ${round(bounds.right + 76)} ${round(bounds.centerY + 24)}`;
      const lightPath = `M ${round(bounds.left - 52)} ${round(bounds.centerY + 72)} C ${round(bounds.left + 118)} ${round(bounds.bottom + 44)}, ${round(bounds.centerX - 52)} ${round(bounds.centerY + 24)}, ${round(bounds.centerX + 50)} ${round(bounds.centerY + 58)} S ${round(bounds.right - 18)} ${round(bounds.top - 30)}, ${round(bounds.right + 56)} ${round(bounds.top + 90)}`;
      return `
      <g id="outer-ribbons" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${darkPath}" stroke="${theme.ribbonDarkGlow}" stroke-width="8" opacity=".2" filter="url(#blurBig)">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="6.2s" repeatCount="indefinite"/>' : ''}</path>
        <path d="${darkPath}" stroke="${theme.ribbonDark}" stroke-width="3" opacity=".92">${animated ? '<animate attributeName="opacity" values=".82;.98;.82" dur="5.4s" repeatCount="indefinite"/>' : ''}</path>
        <path d="${lightPath}" stroke="${theme.ribbonLightGlow}" stroke-width="8" opacity=".2" filter="url(#blurBig)">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 0" dur="6.8s" repeatCount="indefinite"/>' : ''}</path>
        <path d="${lightPath}" stroke="${theme.ribbonLight}" stroke-width="3" opacity=".95">${animated ? '<animate attributeName="opacity" values=".86;1;.86" dur="5.1s" repeatCount="indefinite"/>' : ''}</path>
      </g>`;
    }
    const darkPath = `M ${round(bounds.centerX - 180)} ${round(bounds.top - 44)} C ${round(bounds.left - 110)} ${round(bounds.top + 130)}, ${round(bounds.left - 14)} ${round(bounds.centerY - 28)}, ${round(bounds.left + 28)} ${round(bounds.bottom - 112)} S ${round(bounds.right + 86)} ${round(bounds.bottom - 18)}, ${round(bounds.centerX + 164)} ${round(bounds.bottom + 56)}`;
    const lightPath = `M ${round(bounds.centerX + 154)} ${round(bounds.top - 8)} C ${round(bounds.right + 36)} ${round(bounds.top + 144)}, ${round(bounds.right - 6)} ${round(bounds.centerY + 12)}, ${round(bounds.centerX + 26)} ${round(bounds.centerY + 82)} S ${round(bounds.left - 70)} ${round(bounds.bottom - 38)}, ${round(bounds.centerX - 150)} ${round(bounds.bottom + 18)}`;
    return `
    <g id="outer-ribbons" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${darkPath}" stroke="${theme.ribbonDarkGlow}" stroke-width="8" opacity=".18" filter="url(#blurBig)">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="6.5s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${darkPath}" stroke="${theme.ribbonDark}" stroke-width="3" opacity=".92">${animated ? '<animate attributeName="opacity" values=".82;.98;.82" dur="5.6s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${lightPath}" stroke="${theme.ribbonLightGlow}" stroke-width="8" opacity=".2" filter="url(#blurBig)">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 4;0 0" dur="6.9s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${lightPath}" stroke="${theme.ribbonLight}" stroke-width="3" opacity=".96">${animated ? '<animate attributeName="opacity" values=".86;1;.86" dur="5.2s" repeatCount="indefinite"/>' : ''}</path>
    </g>`;
  }

  function buildTexture(bounds, theme, animated) {
    const darkField = `M ${round(bounds.left - 120)} ${round(bounds.top - 80)} C ${round(bounds.centerX - 150)} ${round(bounds.top + 10)}, ${round(bounds.centerX - 130)} ${round(bounds.centerY - 34)}, ${round(bounds.left + 20)} ${round(bounds.bottom + 60)} L ${round(bounds.left - 120)} ${round(bounds.bottom + 140)} Z`;
    const lightField = `M ${round(bounds.right + 120)} ${round(bounds.bottom + 80)} C ${round(bounds.centerX + 158)} ${round(bounds.bottom - 8)}, ${round(bounds.centerX + 126)} ${round(bounds.centerY + 30)}, ${round(bounds.right - 18)} ${round(bounds.top - 48)} L ${round(bounds.right + 120)} ${round(bounds.top - 140)} Z`;
    const innerDark = `M ${round(bounds.left + 14)} ${round(bounds.centerY + 42)} C ${round(bounds.centerX - 50)} ${round(bounds.bottom - 48)}, ${round(bounds.centerX - 86)} ${round(bounds.centerY + 16)}, ${round(bounds.centerX - 12)} ${round(bounds.top + 72)} C ${round(bounds.centerX + 36)} ${round(bounds.top + 110)}, ${round(bounds.centerX + 26)} ${round(bounds.centerY + 8)}, ${round(bounds.left + 14)} ${round(bounds.centerY + 42)} Z`;
    const innerLight = `M ${round(bounds.right - 14)} ${round(bounds.centerY - 38)} C ${round(bounds.centerX + 50)} ${round(bounds.top + 52)}, ${round(bounds.centerX + 88)} ${round(bounds.centerY - 10)}, ${round(bounds.centerX + 10)} ${round(bounds.bottom - 74)} C ${round(bounds.centerX - 34)} ${round(bounds.bottom - 106)}, ${round(bounds.centerX - 20)} ${round(bounds.centerY - 16)}, ${round(bounds.right - 14)} ${round(bounds.centerY - 38)} Z`;
    const stripeYs = [-3, -2, -1, 0, 1, 2, 3];
    const stripes = stripeYs.map((row, index) => {
      const y = bounds.centerY + row * 36;
      const path = `M ${round(bounds.left - 28)} ${round(y)} C ${round(bounds.centerX - 100)} ${round(y - 26)}, ${round(bounds.centerX + 82)} ${round(y + 24)}, ${round(bounds.right + 30)} ${round(y - 10)}`;
      return `<path d="${path}" fill="none" stroke="${index % 2 === 0 ? theme.stripeLight : theme.stripeDark}" stroke-width="${index % 2 === 0 ? 6 : 4}" opacity="${index % 2 === 0 ? '.18' : '.16'}" stroke-linecap="round"/>`;
    }).join('');
    return `
    <g id="inner-flow" clip-path="url(#lettersClip)">
      <rect x="0" y="0" width="100%" height="100%" fill="url(#faceBase)" opacity="1"/>
      <g opacity=".96"> 
        <path d="${darkField}" fill="${theme.fieldDark}" opacity=".9">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;18 -8;0 0" dur="9s" repeatCount="indefinite"/>' : ''}</path>
        <path d="${lightField}" fill="${theme.fieldLight}" opacity=".92">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;-18 8;0 0" dur="9.6s" repeatCount="indefinite"/>' : ''}</path>
      </g>
      <path d="${innerDark}" fill="${theme.innerDark}" opacity=".42">${animated ? '<animate attributeName="opacity" values=".3;.5;.3" dur="5.2s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${innerLight}" fill="${theme.innerLight}" opacity=".56">${animated ? '<animate attributeName="opacity" values=".42;.62;.42" dur="5.8s" repeatCount="indefinite"/>' : ''}</path>
      ${stripes}
      <circle cx="${round(bounds.centerX - bounds.width * 0.14)}" cy="${round(bounds.centerY - bounds.height * 0.13)}" r="${round(Math.max(18, bounds.width * 0.045))}" fill="${theme.dotLight}" opacity=".94">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;4 -2;0 0" dur="5.4s" repeatCount="indefinite"/>' : ''}</circle>
      <circle cx="${round(bounds.centerX + bounds.width * 0.16)}" cy="${round(bounds.centerY + bounds.height * 0.12)}" r="${round(Math.max(18, bounds.width * 0.045))}" fill="${theme.dotDark}" opacity=".94">${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;-4 2;0 0" dur="5.4s" repeatCount="indefinite"/>' : ''}</circle>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#sheenGrad)" opacity=".34">${animated ? '<animateTransform attributeName="transform" type="translate" values="-18 0;18 -14;-18 0" dur="6.4s" repeatCount="indefinite"/>' : ''}</rect>
    </g>`;
  }

  function buildInnerTrails(bounds, theme, horizontal, animated) {
    if (horizontal) {
      const pathA = `M ${round(bounds.left + 6)} ${round(bounds.centerY - 88)} C ${round(bounds.centerX - 110)} ${round(bounds.centerY - 8)}, ${round(bounds.centerX + 14)} ${round(bounds.centerY + 12)}, ${round(bounds.right - 6)} ${round(bounds.centerY + 92)}`;
      const pathB = `M ${round(bounds.left + 16)} ${round(bounds.centerY + 88)} C ${round(bounds.centerX - 18)} ${round(bounds.centerY + 18)}, ${round(bounds.centerX + 110)} ${round(bounds.centerY - 16)}, ${round(bounds.right - 14)} ${round(bounds.centerY - 92)}`;
      return `
      <g id="inner-trails" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${pathA}" stroke="${theme.trailDark}" stroke-width="2.2" opacity=".48" stroke-dasharray="8 12">${animated ? '<animate attributeName="stroke-dashoffset" values="0;-36" dur="4.8s" repeatCount="indefinite"/>' : ''}</path>
        <path d="${pathB}" stroke="${theme.trailLight}" stroke-width="2.2" opacity=".56" stroke-dasharray="8 12">${animated ? '<animate attributeName="stroke-dashoffset" values="0;36" dur="4.8s" repeatCount="indefinite"/>' : ''}</path>
      </g>`;
    }
    const pathA = `M ${round(bounds.centerX - 110)} ${round(bounds.top + 24)} C ${round(bounds.centerX - 16)} ${round(bounds.centerY - 120)}, ${round(bounds.centerX + 30)} ${round(bounds.centerY - 16)}, ${round(bounds.centerX + 102)} ${round(bounds.bottom - 20)}`;
    const pathB = `M ${round(bounds.centerX + 112)} ${round(bounds.top + 54)} C ${round(bounds.centerX + 18)} ${round(bounds.centerY - 20)}, ${round(bounds.centerX - 26)} ${round(bounds.centerY + 94)}, ${round(bounds.centerX - 100)} ${round(bounds.bottom - 40)}`;
    return `
    <g id="inner-trails" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pathA}" stroke="${theme.trailDark}" stroke-width="2.2" opacity=".46" stroke-dasharray="8 12">${animated ? '<animate attributeName="stroke-dashoffset" values="0;-34" dur="4.6s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${pathB}" stroke="${theme.trailLight}" stroke-width="2.2" opacity=".58" stroke-dasharray="8 12">${animated ? '<animate attributeName="stroke-dashoffset" values="0;34" dur="4.6s" repeatCount="indefinite"/>' : ''}</path>
    </g>`;
  }

  function buildOuterDots(bounds, theme, horizontal, animated) {
    const positions = horizontal
      ? [
          { x: bounds.left - 20, y: bounds.centerY - 58, r: 11, fill: theme.dotDark },
          { x: bounds.right + 20, y: bounds.centerY + 58, r: 11, fill: theme.dotLight },
          { x: bounds.centerX, y: bounds.top - 18, r: 7, fill: theme.dotLight }
        ]
      : [
          { x: bounds.centerX - 126, y: bounds.top + 48, r: 10, fill: theme.dotDark },
          { x: bounds.centerX + 128, y: bounds.bottom - 62, r: 10, fill: theme.dotLight },
          { x: bounds.right + 14, y: bounds.centerY - 18, r: 7, fill: theme.dotDark }
        ];
    return `<g id="outer-dots">${positions.map((dot, index) => `<circle cx="${round(dot.x)}" cy="${round(dot.y)}" r="${dot.r}" fill="${dot.fill}" opacity=".82">${animated ? `<animate attributeName="opacity" values=".58;.9;.58" dur="${4.2 + index * 0.7}s" repeatCount="indefinite"/>` : ''}</circle>`).join('')}</g>`;
  }

  function embedSVG(text, helpers, theme, horizontal, animated) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const rawSlots = horizontal ? buildHorizontalSlots(chars) : buildVerticalSlots(chars);
    const slots = applyMirrorModes(rawSlots);
    const bounds = computeBounds(slots);
    const defs = buildGlyphDefs(slots, theme);
    const uses = buildGlyphUses(slots);
    const ribbons = buildOuterRibbons(bounds, theme, horizontal, animated);
    const texture = buildTexture(bounds, theme, animated);
    const innerTrails = buildInnerTrails(bounds, theme, horizontal, animated);
    const outerDots = buildOuterDots(bounds, theme, horizontal, animated);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，黑白互生，字位帶有鏡像構圖與太極旋流。</desc>
  <defs>
    <linearGradient id="faceBase" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.faceLight}"/>
      <stop offset="48%" stop-color="${theme.faceMid}"/>
      <stop offset="100%" stop-color="${theme.faceDark}"/>
    </linearGradient>
    <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.strokeLight}"/>
      <stop offset="52%" stop-color="${theme.strokeMid}"/>
      <stop offset="100%" stop-color="${theme.strokeDark}"/>
    </linearGradient>
    <linearGradient id="sheenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sheenLight}" stop-opacity=".8"/>
      <stop offset="52%" stop-color="${theme.sheenMid}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${theme.sheenDark}" stop-opacity="0"/>
    </linearGradient>
    <filter id="blurBig" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="5.2"/></filter>
    <filter id="shadowBlur" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="8.2"/></filter>
    ${defs}
    <clipPath id="lettersClip">${uses}</clipPath>
  </defs>
  ${ribbons}
  <g id="shadow" transform="translate(9 10)" fill="${theme.shadow}" opacity=".22" filter="url(#shadowBlur)">${uses}</g>
  <g id="back-glow" transform="translate(-3 -5)" fill="${theme.backGlow}" opacity=".18" filter="url(#blurBig)">${uses}</g>
  <g id="face" fill="url(#faceBase)" stroke="url(#strokeGrad)" stroke-width="5.8" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  ${texture}
  <g id="inner-stroke" fill="none" stroke="${theme.innerLine}" stroke-width="1.35" opacity=".5">${uses}</g>
  ${innerTrails}
  ${outerDots}
</svg>`;
  }

  function create(theme, orientation) {
    const horizontal = orientation === 'horizontal';
    const lib = horizontal ? global.SlowlyHorizontalTextGenerator : global.SlowlyTextGenerator;
    const core = global.SlowlyTextGeneratorCore;
    if (!lib?.create || !core) {
      console.error(`${theme.title}：軍火庫文字產生器未載入。`);
      return null;
    }
    const generator = lib.create({
      maxChars: 4,
      sourceSize: horizontal ? { width: 1200, height: 760 } : { width: 840, height: 1200 },
      renderSVG(text, helpers) {
        return embedSVG(text, helpers, theme, horizontal, false);
      },
      presets: {
        png: { scale: 2 },
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 40 : 54, paddingY: horizontal ? 62 : 46 }
      },
      filenames: {
        svg: text => `${core.fileSafe(text)}_${theme.code}_${orientation}.svg`,
        png: text => `${core.fileSafe(text)}_${theme.code}_${orientation}_2x.png`,
        cover: text => `${core.fileSafe(text)}_${theme.code}_${orientation}_cover_700x1000.png`
      }
    });

    function generateAnimatedSVG(text) {
      const normalized = generator.normalize(text);
      if (!normalized) throw new Error('請先輸入文字。');
      return embedSVG(normalized, { splitCharacters: generator.splitCharacters }, theme, horizontal, true);
    }

    function downloadAnimatedSVG(text) {
      const normalized = generator.normalize(text);
      if (!normalized) throw new Error('請先輸入文字。');
      const blob = new Blob([generateAnimatedSVG(normalized)], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const filename = `${core.fileSafe(normalized)}_${theme.code}_${orientation}_animated.svg`;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      return Promise.resolve({ filename });
    }

    return Object.freeze({
      MAX: 4,
      characters: generator.splitCharacters,
      splitCharacters: generator.splitCharacters,
      normalize: generator.normalize,
      generateSVG: generator.generateSVG,
      generateAnimatedSVG,
      hasAnimatedSVG: true,
      makeURL: generator.makeURL,
      makeUrl: generator.makeURL,
      url: generator.makeURL,
      createPreview: generator.createPreview,
      downloadSVG: generator.downloadSVG,
      downloadPNG: text => generator.downloadPNG(text, 'png'),
      downloadCover: generator.downloadCover,
      downloadAnimatedSVG,
      formatSize: generator.formatSize
    });
  }

  global.SlowlyYinYangFactory = Object.freeze({ create });
})(window);
