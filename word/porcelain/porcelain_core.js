"use strict";
/* 青花入夢｜專屬藝術字核心。
 * 重點：白藍水彩釉色、青花紋樣、冰裂紋，以及前字壓後字的交疊構圖。
 */
(function (global) {
  const FONT_SERIF = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const round = value => Math.round(Number(value || 0) * 100) / 100;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const xmlEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeArrayFrom = value => Array.from(String(value || ''));

  function buildVerticalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[420, 590, 392, -4]],
      2: [[360, 372, 308, -8], [484, 740, 308, 6]],
      3: [[336, 254, 272, -10], [424, 560, 266, 3], [520, 856, 270, 7]],
      4: [[318, 206, 252, -12], [400, 444, 244, 2], [484, 680, 240, -3], [566, 920, 248, 7]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[604, 392, 356, -4]],
      2: [[418, 360, 288, -8], [746, 430, 286, 6]],
      3: [[282, 334, 248, -10], [564, 390, 242, 2], [850, 448, 248, 7]],
      4: [[176, 310, 228, -11], [420, 358, 220, 2], [684, 412, 218, -3], [956, 468, 226, 7]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.52));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.52));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.56));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.46));
    return {
      left,
      right,
      top,
      bottom,
      centerX: (left + right) / 2,
      centerY: (top + bottom) / 2,
      width: right - left,
      height: bottom - top
    };
  }

  function buildGlyphDefs(slots, theme) {
    return slots.map(slot => `<text id="glyph-${slot.index}" x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family='${xmlEscape(FONT_SERIF)}' font-size="250" font-weight="${theme.weight}">${xmlEscape(slot.char)}</text>`).join('');
  }

  function useGlyph(slot) {
    const scale = slot.size / 250;
    return `<use href="#glyph-${slot.index}" transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})"/>`;
  }

  function buildFaceUses(slots) {
    return slots.map(useGlyph).join('');
  }

  function buildLetterTexture(slot, theme) {
    const scale = slot.size / 250;
    const motifs = [];
    // 青花曲線與花瓣感圖樣
    motifs.push(`<path d="M -94 -26 C -64 -90, 28 -82, 58 -26 S 90 54 34 88" fill="none" stroke="${theme.cobaltBlue}" stroke-width="8" stroke-linecap="round" opacity=".56"/>`);
    motifs.push(`<path d="M -70 70 C -36 28, -18 -16, 24 -54" fill="none" stroke="${theme.cobaltBlueSoft}" stroke-width="6.6" stroke-linecap="round" opacity=".42"/>`);
    motifs.push(`<path d="M -20 14 q 18 -24 34 0 q -16 22 -34 0 Z" fill="none" stroke="${theme.cobaltBlue}" stroke-width="4.2" opacity=".44"/>`);
    motifs.push(`<path d="M 30 36 q 16 -20 30 0 q -14 16 -30 0 Z" fill="none" stroke="${theme.cobaltBlue}" stroke-width="4" opacity=".4"/>`);
    motifs.push(`<circle cx="-76" cy="-64" r="7" fill="${theme.cobaltBlue}" opacity=".42"/>`);
    motifs.push(`<circle cx="78" cy="52" r="6" fill="${theme.cobaltBlueSoft}" opacity=".38"/>`);
    motifs.push(`<circle cx="-12" cy="-82" r="4.6" fill="${theme.deepBlue}" opacity=".34"/>`);

    // 水彩白藍暈染塊
    motifs.push(`<ellipse cx="-22" cy="-8" rx="76" ry="42" fill="${theme.washBlue}" opacity=".20"/>`);
    motifs.push(`<ellipse cx="52" cy="34" rx="54" ry="30" fill="${theme.translucentWhite}" opacity=".28"/>`);

    // 冰裂紋／釉裂
    const crackPaths = [
      'M -90 -16 L -48 -40 L -12 -8 L 22 -34 L 74 -20',
      'M -40 82 L -18 40 L 26 18 L 54 54',
      'M 8 -96 L 26 -58 L 64 -48 L 86 -18',
      'M -86 26 L -42 8 L -8 36 L 18 18'
    ];
    crackPaths.forEach((d, index) => {
      motifs.push(`<path d="${d}" fill="none" stroke="${index % 2 === 0 ? theme.crackBlue : theme.crackWhite}" stroke-width="${index % 2 === 0 ? '1.8' : '1.3'}" opacity="${index % 2 === 0 ? '.22' : '.34'}" stroke-linecap="round" stroke-linejoin="round"/>`);
    });

    return `<g clip-path="url(#letterClip-${slot.index})" transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})">${motifs.join('')}</g>`;
  }

  function buildAllTextures(slots, theme) {
    return slots.map(slot => buildLetterTexture(slot, theme)).join('');
  }

  function buildGlazeHighlights(slots, theme) {
    return slots.map(slot => {
      const scale = slot.size / 250;
      return `<g clip-path="url(#letterClip-${slot.index})" transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})">
        <ellipse cx="-28" cy="-56" rx="112" ry="48" fill="url(#glazeHighlight)" opacity=".78"/>
        <ellipse cx="44" cy="26" rx="72" ry="28" fill="url(#glazeShadow)" opacity=".18"/>
      </g>`;
    }).join('');
  }

  function buildOuterCurves(bounds, theme, horizontal) {
    if (horizontal) {
      const pathA = `M ${round(bounds.left - 42)} ${round(bounds.centerY + 120)} C ${round(bounds.centerX - 206)} ${round(bounds.centerY + 18)}, ${round(bounds.centerX + 42)} ${round(bounds.centerY - 72)}, ${round(bounds.right + 52)} ${round(bounds.centerY + 18)}`;
      const pathB = `M ${round(bounds.left + 18)} ${round(bounds.centerY + 148)} C ${round(bounds.centerX - 126)} ${round(bounds.bottom + 56)}, ${round(bounds.centerX + 116)} ${round(bounds.top - 30)}, ${round(bounds.right + 34)} ${round(bounds.centerY - 36)}`;
      return `<g id="outer-curves" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${pathA}" stroke="${theme.curveBlue}" stroke-width="4.8" opacity=".74"/>
        <path d="${pathB}" stroke="${theme.curveBlueSoft}" stroke-width="2.4" opacity=".52" stroke-dasharray="10 12"/>
      </g>`;
    }
    const pathA = `M ${round(bounds.left - 36)} ${round(bounds.top + 46)} C ${round(bounds.centerX - 176)} ${round(bounds.centerY - 120)}, ${round(bounds.centerX + 78)} ${round(bounds.centerY - 22)}, ${round(bounds.centerX + 132)} ${round(bounds.bottom - 34)}`;
    const pathB = `M ${round(bounds.left + 22)} ${round(bounds.top + 112)} C ${round(bounds.centerX - 54)} ${round(bounds.centerY + 12)}, ${round(bounds.centerX + 102)} ${round(bounds.centerY + 146)}, ${round(bounds.right + 16)} ${round(bounds.bottom - 8)}`;
    return `<g id="outer-curves" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pathA}" stroke="${theme.curveBlue}" stroke-width="4.8" opacity=".72"/>
      <path d="${pathB}" stroke="${theme.curveBlueSoft}" stroke-width="2.4" opacity=".50" stroke-dasharray="10 12"/>
    </g>`;
  }

  function buildPorcelainDots(bounds, theme, horizontal) {
    const dots = horizontal
      ? [
          [bounds.left + 24, bounds.top + 18, 7], [bounds.centerX - 40, bounds.top - 10, 5], [bounds.centerX + 104, bounds.centerY + 36, 6],
          [bounds.right + 18, bounds.centerY - 34, 7], [bounds.left + 148, bounds.bottom + 26, 6], [bounds.right - 26, bounds.bottom + 4, 5]
        ]
      : [
          [bounds.left + 10, bounds.top + 42, 6], [bounds.centerX + 136, bounds.top + 102, 5], [bounds.centerX - 92, bounds.centerY - 18, 7],
          [bounds.right + 12, bounds.centerY + 68, 5], [bounds.centerX + 122, bounds.bottom + 12, 7], [bounds.left + 36, bounds.bottom - 24, 5]
        ];
    return `<g id="porcelain-dots">${dots.map(dot => `<circle cx="${round(dot[0])}" cy="${round(dot[1])}" r="${dot[2]}" fill="${theme.cobaltBlue}" opacity=".34"/>`).join('')}</g>`;
  }

  function embedSVG(text, helpers, theme, horizontal) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const slots = horizontal ? buildHorizontalSlots(chars) : buildVerticalSlots(chars);
    const drawOrder = [...slots].reverse(); // 後字先畫，前字最後畫，形成前字壓後字。
    const bounds = computeBounds(slots);
    const defsGlyphs = buildGlyphDefs(slots, theme);
    const allUses = buildFaceUses(drawOrder);
    const clips = slots.map(slot => `<clipPath id="letterClip-${slot.index}">${useGlyph(slot)}</clipPath>`).join('');
    const textures = buildAllTextures(drawOrder, theme);
    const glaze = buildGlazeHighlights(drawOrder, theme);
    const curves = buildOuterCurves(bounds, theme, horizontal);
    const dots = buildPorcelainDots(bounds, theme, horizontal);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，白藍水彩釉面、青花紋樣與冰裂紋全部輸出。</desc>
  <defs>
    <linearGradient id="porcelainFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.porcelainWhite}"/>
      <stop offset="34%" stop-color="${theme.paleBlue}"/>
      <stop offset="70%" stop-color="${theme.cobaltBlueSoft}"/>
      <stop offset="100%" stop-color="${theme.waterBlue}"/>
    </linearGradient>
    <linearGradient id="porcelainStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.deepBlue}"/>
      <stop offset="100%" stop-color="${theme.cobaltBlue}"/>
    </linearGradient>
    <linearGradient id="glazeHighlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.translucentWhite}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.translucentWhite}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="glazeShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.waterBlue}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${theme.deepBlue}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadowBlur" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="7.4"/></filter>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6.8"/></filter>
    ${defsGlyphs}
    ${clips}
  </defs>
  ${curves}
  ${dots}
  <g id="shadow" transform="translate(10 12)" fill="${theme.shadowBlue}" opacity=".16" filter="url(#shadowBlur)">${allUses}</g>
  <g id="back-glow" transform="translate(-3 -4)" fill="${theme.translucentWhite}" opacity=".42" filter="url(#softBlur)">${allUses}</g>
  <g id="face" fill="url(#porcelainFill)" stroke="url(#porcelainStroke)" stroke-width="5.2" stroke-linejoin="round" paint-order="stroke fill">${allUses}</g>
  ${textures}
  ${glaze}
  <g id="inner-outline" fill="none" stroke="${theme.glazeWhite}" stroke-width="1.2" opacity=".55">${allUses}</g>
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
        return embedSVG(text, helpers, theme, horizontal);
      },
      presets: {
        png: { scale: 2 },
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 42 : 54, paddingY: horizontal ? 58 : 42 }
      },
      filenames: {
        svg: text => `${core.fileSafe(text)}_${theme.code}_${orientation}.svg`,
        png: text => `${core.fileSafe(text)}_${theme.code}_${orientation}_2x.png`,
        cover: text => `${core.fileSafe(text)}_${theme.code}_${orientation}_cover_700x1000.png`
      }
    });

    return Object.freeze({
      MAX: 4,
      characters: generator.splitCharacters,
      splitCharacters: generator.splitCharacters,
      normalize: generator.normalize,
      generateSVG: generator.generateSVG,
      hasAnimatedSVG: false,
      makeURL: generator.makeURL,
      makeUrl: generator.makeURL,
      url: generator.makeURL,
      createPreview: generator.createPreview,
      downloadSVG: generator.downloadSVG,
      downloadPNG: text => generator.downloadPNG(text, 'png'),
      downloadCover: generator.downloadCover,
      formatSize: generator.formatSize
    });
  }

  global.SlowlyPorcelainFactory = Object.freeze({ create });
})(window);
