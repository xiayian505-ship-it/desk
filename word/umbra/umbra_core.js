"use strict";
/* 影隨形動｜專屬藝術字核心。
 * 重點：黑白雙生、交錯飛躍、雙線描邊、偏光漸層，以及底部大量交疊圓形。
 */
(function (global) {
  const FONT_SERIF = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const round = value => Math.round(Number(value || 0) * 100) / 100;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const xmlEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeArrayFrom = value => Array.from(String(value || ''));
  const rand = seed => {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  function buildVerticalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[420, 592, 398, -4]],
      2: [[374, 398, 318, -10], [470, 774, 314, 8]],
      3: [[326, 278, 280, -14], [430, 560, 268, 6], [534, 852, 274, -8]],
      4: [[296, 222, 252, -16], [392, 442, 238, 8], [486, 686, 236, -10], [582, 916, 246, 10]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[604, 390, 360, -4]],
      2: [[402, 338, 300, -10], [800, 452, 296, 8]],
      3: [[254, 316, 254, -14], [596, 394, 242, 6], [936, 470, 248, -8]],
      4: [[150, 296, 228, -16], [420, 354, 216, 8], [720, 426, 214, -10], [1016, 492, 222, 10]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.58));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.58));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.58));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.48));
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

  function buildGhostLayers(slots, theme) {
    const back = [];
    const front = [];
    slots.forEach((slot, index) => {
      const scale = slot.size / 250;
      const backDx = index % 2 === 0 ? -24 : 24;
      const backDy = index % 2 === 0 ? 18 : -18;
      const frontDx = index % 2 === 0 ? 14 : -14;
      const frontDy = index % 2 === 0 ? -12 : 12;
      back.push(`<use href="#glyph-${slot.index}" transform="translate(${round(slot.x + backDx)} ${round(slot.y + backDy)}) rotate(${slot.rotation}) scale(${round(scale)})"/>`);
      front.push(`<use href="#glyph-${slot.index}" transform="translate(${round(slot.x + frontDx)} ${round(slot.y + frontDy)}) rotate(${slot.rotation}) scale(${round(scale)})"/>`);
    });
    return {
      back: `<g id="ghost-back" fill="${theme.shadowTone}" opacity=".34">${back.join('')}</g>`,
      front: `<g id="ghost-front" fill="${theme.lightGhost}" opacity=".18">${front.join('')}</g>`
    };
  }

  function buildBottomCircles(bounds, theme, horizontal) {
    const circles = [];
    const count = horizontal ? 36 : 34;
    const baseY = horizontal ? bounds.bottom + 18 : bounds.bottom + 36;
    const span = horizontal ? bounds.width + 180 : bounds.width + 90;
    for (let i = 0; i < count; i += 1) {
      const t = i / Math.max(1, count - 1);
      const x = bounds.centerX - span / 2 + span * t + (rand(400 + i) - 0.5) * (horizontal ? 48 : 34);
      const y = baseY - (horizontal ? 16 : 22) + rand(500 + i) * (horizontal ? 150 : 176);
      const radius = (horizontal ? 28 : 24) + rand(600 + i) * (horizontal ? 66 : 62);
      const opacity = 0.14 + rand(700 + i) * 0.26;
      const fillRoll = rand(800 + i);
      const fill = fillRoll < 0.2 ? theme.deepShadow : fillRoll < 0.44 ? theme.shadowTone : fillRoll < 0.72 ? theme.softWhite : theme.lightGhost;
      circles.push(`<circle cx="${round(x)}" cy="${round(y)}" r="${round(radius)}" fill="${fill}" opacity="${round(opacity)}"/>`);
    }
    // a few larger visual anchors
    const anchors = horizontal
      ? [
          [bounds.centerX - 180, bounds.bottom + 84, 110],
          [bounds.centerX + 10, bounds.bottom + 128, 136],
          [bounds.centerX + 220, bounds.bottom + 76, 92]
        ]
      : [
          [bounds.centerX - 118, bounds.bottom + 92, 104],
          [bounds.centerX + 22, bounds.bottom + 148, 132],
          [bounds.centerX + 136, bounds.bottom + 82, 86]
        ];
    anchors.forEach((item, index) => {
      const fill = index === 0 ? theme.softWhite : index === 1 ? theme.shadowTone : theme.lightGhost;
      circles.push(`<circle cx="${round(item[0])}" cy="${round(item[1])}" r="${item[2]}" fill="${fill}" opacity="${index === 1 ? '.2' : '.16'}"/>`);
    });
    return `<g id="bottom-circles">${circles.join('')}</g>`;
  }

  function buildBottomGlow(bounds, theme, horizontal) {
    const x = horizontal ? bounds.centerX - bounds.width * 0.4 : bounds.centerX - bounds.width * 0.34;
    const y = bounds.bottom + (horizontal ? 28 : 44);
    const w = horizontal ? bounds.width * 0.84 : bounds.width * 0.72;
    const h = horizontal ? 170 : 200;
    return `<g id="bottom-glow" filter="url(#softBlur)">
      <ellipse cx="${round(bounds.centerX)}" cy="${round(y + h * 0.34)}" rx="${round(w * 0.42)}" ry="${round(h * 0.34)}" fill="${theme.lightGhost}" opacity=".14"/>
      <rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" rx="${round(h * 0.45)}" ry="${round(h * 0.45)}" fill="url(#bottomSheen)" opacity=".18"/>
    </g>`;
  }

  function buildPolarSheen(slots, theme) {
    return slots.map(slot => {
      const scale = slot.size / 250;
      return `<g clip-path="url(#letterClip-${slot.index})" transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})">
        <rect x="-142" y="-126" width="108" height="272" rx="58" ry="58" fill="url(#polarA)" opacity=".38" transform="rotate(-18 -88 10)"/>
        <rect x="-12" y="-148" width="118" height="286" rx="64" ry="64" fill="url(#polarB)" opacity=".28" transform="rotate(-10 44 0)"/>
      </g>`;
    }).join('');
  }

  function buildDualOutline(allUses, theme) {
    return `
      <g id="outline-outer" fill="none" stroke="${theme.outerStroke}" stroke-width="6.4" stroke-linejoin="round" opacity=".92">${allUses}</g>
      <g id="outline-inner" fill="none" stroke="${theme.innerStroke}" stroke-width="2.5" stroke-linejoin="round" opacity=".8">${allUses}</g>`;
  }

  function embedSVG(text, helpers, theme, horizontal) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const slots = horizontal ? buildHorizontalSlots(chars) : buildVerticalSlots(chars);
    const bounds = computeBounds(slots);
    const defsGlyphs = buildGlyphDefs(slots, theme);
    const allUses = buildFaceUses(slots);
    const clips = slots.map(slot => `<clipPath id="letterClip-${slot.index}">${useGlyph(slot)}</clipPath>`).join('');
    const ghost = buildGhostLayers(slots, theme);
    const circles = buildBottomCircles(bounds, theme, horizontal);
    const glow = buildBottomGlow(bounds, theme, horizontal);
    const polar = buildPolarSheen(slots, theme);
    const dualOutline = buildDualOutline(allUses, theme);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，黑白雙影、雙線描邊與底部大量交疊圓形。</desc>
  <defs>
    <linearGradient id="umbraFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.topWhite}"/>
      <stop offset="38%" stop-color="${theme.lightGray}"/>
      <stop offset="72%" stop-color="${theme.grayPurple}"/>
      <stop offset="100%" stop-color="${theme.deepShadow}"/>
    </linearGradient>
    <linearGradient id="bottomSheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.softWhite}" stop-opacity="0"/>
      <stop offset="46%" stop-color="${theme.softWhite}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.grayPurple}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="polarA" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.softWhite}" stop-opacity="0"/>
      <stop offset="52%" stop-color="${theme.softWhite}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.lightGhost}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="polarB" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.topWhite}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.grayPurple}" stop-opacity=".92"/>
      <stop offset="100%" stop-color="${theme.shadowTone}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadowBlur" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="7.6"/></filter>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8.6"/></filter>
    ${defsGlyphs}
    ${clips}
  </defs>
  ${glow}
  ${circles}
  <g id="soft-shadow" transform="translate(10 14)" fill="${theme.deepShadow}" opacity=".18" filter="url(#shadowBlur)">${allUses}</g>
  ${ghost.back}
  <g id="face" fill="url(#umbraFace)">${allUses}</g>
  ${ghost.front}
  ${polar}
  ${dualOutline}
  <g id="inner-shine" fill="none" stroke="${theme.topWhite}" stroke-width="1.1" opacity=".38">${allUses}</g>
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
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 40 : 52, paddingY: horizontal ? 56 : 40 }
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

  global.SlowlyUmbraFactory = Object.freeze({ create });
})(window);
