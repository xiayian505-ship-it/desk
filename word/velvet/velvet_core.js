"use strict";
/* 絲絨華彩｜專屬藝術字核心。
 * 重點：酒紅絲絨主字、柔亮緞光、靜態偏光，以及白色襯衫鈕扣點綴。
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
      1: [[420, 600, 392, -2]],
      2: [[420, 350, 326, -2], [420, 860, 326, 2]],
      3: [[420, 226, 286, -2], [420, 606, 286, 2], [420, 982, 286, -1]],
      4: [[420, 170, 246, -2], [420, 454, 246, 2], [420, 742, 246, -2], [420, 1026, 246, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[600, 390, 360, 0]],
      2: [[386, 390, 318, -1], [816, 390, 318, 1]],
      3: [[258, 390, 280, -2], [600, 390, 280, 2], [942, 390, 280, -1]],
      4: [[170, 390, 244, -2], [454, 390, 244, 2], [746, 390, 244, -2], [1030, 390, 244, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.48));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.48));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.5));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.42));
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

  function buildGlyphUses(slots) {
    return slots.map(slot => {
      const scale = slot.size / 250;
      return `<use href="#glyph-${slot.index}" transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})"/>`;
    }).join('');
  }

  function buildVelvetFibers(slot, theme) {
    const scale = slot.size / 250;
    const fibers = [];
    for (let row = -5; row <= 5; row += 1) {
      const y = row * 22;
      const width = 164 - Math.abs(row) * 12;
      const lift = row % 2 === 0 ? -14 : 14;
      fibers.push(`<path d="M ${round(-width / 2)} ${round(y)} C ${round(-width * 0.25)} ${round(y + lift * 0.22)}, ${round(width * 0.16)} ${round(y - lift * 0.3)}, ${round(width / 2)} ${round(y + lift * 0.18)}" fill="none" stroke="${row % 2 === 0 ? theme.fiberA : theme.fiberB}" stroke-width="${row % 3 === 0 ? '4.4' : '3'}" stroke-linecap="round" opacity="${row % 2 === 0 ? '.12' : '.08'}"/>`);
    }
    for (let i = 0; i < 8; i += 1) {
      const x = -92 + ((i * 29) % 184);
      const y = -92 + ((i * 47) % 184);
      const len = 24 + (i % 3) * 8;
      fibers.push(`<path d="M ${round(x)} ${round(y)} q ${round(len * 0.4)} ${round(-5 + (i % 5) * 2.4)} ${round(len)} ${round((i % 4) - 1)}" fill="none" stroke="${i % 2 === 0 ? theme.fiberC : theme.fiberA}" stroke-width="1.6" stroke-linecap="round" opacity=".11"/>`);
    }
    return `<g transform="translate(${round(slot.x)} ${round(slot.y)}) scale(${round(scale)})">${fibers.join('')}</g>`;
  }

  function buildLetterTexture(slots, theme) {
    return `<g id="velvet-fibers" clip-path="url(#lettersClip)">${slots.map(slot => buildVelvetFibers(slot, theme)).join('')}</g>`;
  }

  function buildOuterSweep(bounds, theme, horizontal) {
    if (horizontal) {
      const path = `M ${round(bounds.left - 54)} ${round(bounds.centerY + 142)} C ${round(bounds.centerX - 226)} ${round(bounds.bottom + 58)}, ${round(bounds.centerX + 154)} ${round(bounds.top - 38)}, ${round(bounds.right + 64)} ${round(bounds.centerY + 112)}`;
      const path2 = `M ${round(bounds.left + 12)} ${round(bounds.centerY - 136)} C ${round(bounds.centerX - 60)} ${round(bounds.top - 54)}, ${round(bounds.centerX + 220)} ${round(bounds.centerY - 94)}, ${round(bounds.right + 46)} ${round(bounds.centerY + 52)}`;
      return `
      <g id="outer-sweep" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${path}" stroke="${theme.ribbonSoft}" stroke-width="18" opacity=".18"/>
        <path d="${path}" stroke="${theme.ribbonEdge}" stroke-width="4.4" opacity=".52"/>
        <path d="${path2}" stroke="${theme.ribbonThin}" stroke-width="2.4" opacity=".48" stroke-dasharray="11 14"/>
      </g>`;
    }
    const path = `M ${round(bounds.centerX - 182)} ${round(bounds.top + 48)} C ${round(bounds.left - 72)} ${round(bounds.centerY - 76)}, ${round(bounds.right + 52)} ${round(bounds.centerY + 34)}, ${round(bounds.centerX + 168)} ${round(bounds.bottom - 42)}`;
    const path2 = `M ${round(bounds.centerX + 160)} ${round(bounds.top + 98)} C ${round(bounds.centerX + 18)} ${round(bounds.top - 32)}, ${round(bounds.centerX - 132)} ${round(bounds.bottom + 18)}, ${round(bounds.centerX - 178)} ${round(bounds.bottom - 70)}`;
    return `
    <g id="outer-sweep" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${path}" stroke="${theme.ribbonSoft}" stroke-width="18" opacity=".18"/>
      <path d="${path}" stroke="${theme.ribbonEdge}" stroke-width="4.4" opacity=".52"/>
      <path d="${path2}" stroke="${theme.ribbonThin}" stroke-width="2.4" opacity=".46" stroke-dasharray="11 14"/>
    </g>`;
  }

  function buildPolarGlow(bounds, theme, horizontal) {
    const stripes = horizontal
      ? [
          { x: bounds.left - 16, y: bounds.top - 12, w: 190, h: bounds.height + 74, rot: -14, fill: 'url(#polarBandA)', opacity: '.42' },
          { x: bounds.centerX - 54, y: bounds.top - 30, w: 186, h: bounds.height + 96, rot: -12, fill: 'url(#polarBandB)', opacity: '.36' },
          { x: bounds.right - 88, y: bounds.top - 12, w: 166, h: bounds.height + 74, rot: -10, fill: 'url(#polarBandC)', opacity: '.32' }
        ]
      : [
          { x: bounds.left - 18, y: bounds.top - 24, w: bounds.width + 54, h: 164, rot: -12, fill: 'url(#polarBandA)', opacity: '.4' },
          { x: bounds.left - 10, y: bounds.centerY - 88, w: bounds.width + 68, h: 176, rot: -10, fill: 'url(#polarBandB)', opacity: '.34' },
          { x: bounds.left + 6, y: bounds.bottom - 150, w: bounds.width + 44, h: 156, rot: -8, fill: 'url(#polarBandC)', opacity: '.3' }
        ];
    return `<g id="polar-glow" clip-path="url(#lettersClip)" filter="url(#softBlur)">${stripes.map(item => `<rect x="${round(item.x)}" y="${round(item.y)}" width="${round(item.w)}" height="${round(item.h)}" rx="${horizontal ? 72 : 80}" ry="${horizontal ? 72 : 80}" fill="${item.fill}" opacity="${item.opacity}" transform="rotate(${item.rot} ${round(item.x + item.w / 2)} ${round(item.y + item.h / 2)})"/>`).join('')}</g>`;
  }

  function buildSheenLines(bounds, theme, horizontal) {
    if (horizontal) {
      const pathA = `M ${round(bounds.left + 12)} ${round(bounds.centerY - 82)} C ${round(bounds.centerX - 74)} ${round(bounds.top - 28)}, ${round(bounds.centerX + 102)} ${round(bounds.centerY - 10)}, ${round(bounds.right - 14)} ${round(bounds.centerY + 76)}`;
      const pathB = `M ${round(bounds.left + 48)} ${round(bounds.centerY + 80)} C ${round(bounds.centerX - 26)} ${round(bounds.centerY + 24)}, ${round(bounds.centerX + 144)} ${round(bounds.bottom + 14)}, ${round(bounds.right + 6)} ${round(bounds.centerY - 36)}`;
      return `<g id="sheen-lines" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${pathA}" stroke="${theme.sheenStrokeA}" stroke-width="3.8" opacity=".46"/>
        <path d="${pathB}" stroke="${theme.sheenStrokeB}" stroke-width="2.2" opacity=".38" stroke-dasharray="9 13"/>
      </g>`;
    }
    const pathA = `M ${round(bounds.centerX - 110)} ${round(bounds.top + 46)} C ${round(bounds.centerX + 28)} ${round(bounds.centerY - 160)}, ${round(bounds.centerX - 22)} ${round(bounds.centerY + 54)}, ${round(bounds.centerX + 126)} ${round(bounds.bottom - 48)}`;
    const pathB = `M ${round(bounds.centerX + 118)} ${round(bounds.top + 114)} C ${round(bounds.centerX - 12)} ${round(bounds.centerY - 8)}, ${round(bounds.centerX + 18)} ${round(bounds.centerY + 170)}, ${round(bounds.centerX - 98)} ${round(bounds.bottom - 98)}`;
    return `<g id="sheen-lines" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pathA}" stroke="${theme.sheenStrokeA}" stroke-width="3.8" opacity=".46"/>
      <path d="${pathB}" stroke="${theme.sheenStrokeB}" stroke-width="2.2" opacity=".38" stroke-dasharray="9 13"/>
    </g>`;
  }

  function buildButtonMarkup(cx, cy, r, index, theme) {
    const holeOffset = r * 0.34;
    const holes = index % 2 === 0
      ? [
          [cx - holeOffset, cy - holeOffset, r * 0.1],
          [cx + holeOffset, cy - holeOffset, r * 0.1],
          [cx - holeOffset, cy + holeOffset, r * 0.1],
          [cx + holeOffset, cy + holeOffset, r * 0.1]
        ]
      : [
          [cx, cy - holeOffset * 0.9, r * 0.112],
          [cx, cy + holeOffset * 0.9, r * 0.112]
        ];
    const threads = index % 2 === 0
      ? `<path d="M ${round(cx - holeOffset)} ${round(cy - holeOffset)} L ${round(cx + holeOffset)} ${round(cy + holeOffset)} M ${round(cx + holeOffset)} ${round(cy - holeOffset)} L ${round(cx - holeOffset)} ${round(cy + holeOffset)}" fill="none" stroke="${theme.buttonThread}" stroke-width="${round(r * 0.08)}" stroke-linecap="round" opacity=".5"/>`
      : `<path d="M ${round(cx)} ${round(cy - holeOffset * 1.06)} L ${round(cx)} ${round(cy + holeOffset * 1.06)}" fill="none" stroke="${theme.buttonThread}" stroke-width="${round(r * 0.08)}" stroke-linecap="round" opacity=".52"/>`;
    return `
    <g class="velvet-button velvet-button-${index}">
      <circle cx="${round(cx + r * 0.09)}" cy="${round(cy + r * 0.12)}" r="${round(r)}" fill="${theme.buttonShadow}" opacity=".16" filter="url(#buttonShadow)"/>
      <circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" fill="url(#buttonFill)" stroke="${theme.buttonStroke}" stroke-width="${round(r * 0.08)}"/>
      <circle cx="${round(cx - r * 0.18)}" cy="${round(cy - r * 0.22)}" r="${round(r * 0.64)}" fill="url(#buttonSheen)" opacity=".82"/>
      <circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r * 0.72)}" fill="none" stroke="${theme.buttonInnerRing}" stroke-width="${round(r * 0.05)}" opacity=".64"/>
      ${threads}
      ${holes.map(([hx, hy, hr]) => `<circle cx="${round(hx)}" cy="${round(hy)}" r="${round(hr)}" fill="${theme.buttonHole}" opacity=".9"/>`).join('')}
      <path d="M ${round(cx - r * 0.18)} ${round(cy + r * 0.74)} q ${round(r * 0.44)} ${round(r * 0.18)} ${round(r * 0.86)} ${round(-r * 0.08)}" fill="none" stroke="${theme.buttonStroke}" stroke-width="${round(r * 0.036)}" opacity=".32"/>
    </g>`;
  }

  function buildButtons(bounds, theme, horizontal) {
    const buttons = horizontal
      ? [
          { x: bounds.left + 42, y: bounds.top + 56, r: 31 },
          { x: bounds.centerX + 48, y: bounds.top + 6, r: 26 },
          { x: bounds.right - 6, y: bounds.bottom + 34, r: 29 }
        ]
      : [
          { x: bounds.centerX + 150, y: bounds.top + 98, r: 30 },
          { x: bounds.centerX - 164, y: bounds.centerY + 24, r: 26 },
          { x: bounds.centerX + 120, y: bounds.bottom + 18, r: 28 }
        ];
    return `<g id="buttons">${buttons.map((button, index) => buildButtonMarkup(button.x, button.y, button.r, index, theme)).join('')}</g>`;
  }

  function embedSVG(text, helpers, theme, horizontal) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const slots = horizontal ? buildHorizontalSlots(chars) : buildVerticalSlots(chars);
    const bounds = computeBounds(slots);
    const defs = buildGlyphDefs(slots, theme);
    const uses = buildGlyphUses(slots);
    const texture = buildLetterTexture(slots, theme);
    const outerSweep = buildOuterSweep(bounds, theme, horizontal);
    const polarGlow = buildPolarGlow(bounds, theme, horizontal);
    const sheenLines = buildSheenLines(bounds, theme, horizontal);
    const buttons = buildButtons(bounds, theme, horizontal);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，酒紅絲絨主字搭配偏光與白色襯衫鈕扣。</desc>
  <defs>
    <linearGradient id="velvetFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.faceLight}"/>
      <stop offset="36%" stop-color="${theme.faceMid}"/>
      <stop offset="70%" stop-color="${theme.faceDeep}"/>
      <stop offset="100%" stop-color="${theme.faceDark}"/>
    </linearGradient>
    <linearGradient id="velvetStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.strokeLight}"/>
      <stop offset="48%" stop-color="${theme.strokeMid}"/>
      <stop offset="100%" stop-color="${theme.strokeDark}"/>
    </linearGradient>
    <linearGradient id="sheenFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sheenLight}" stop-opacity=".9"/>
      <stop offset="38%" stop-color="${theme.sheenMid}" stop-opacity=".42"/>
      <stop offset="100%" stop-color="${theme.sheenDark}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="polarBandA" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.polarA}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.polarA}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.polarA2}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="polarBandB" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.polarB}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.polarB}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.polarB2}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="polarBandC" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.polarC}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.polarC}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.polarC2}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="buttonFill" x1="0" y1="0" x2="0.94" y2="1">
      <stop offset="0%" stop-color="${theme.buttonLight}"/>
      <stop offset="56%" stop-color="${theme.buttonMid}"/>
      <stop offset="100%" stop-color="${theme.buttonDark}"/>
    </linearGradient>
    <radialGradient id="buttonSheen" cx="34%" cy="26%" r="76%">
      <stop offset="0%" stop-color="${theme.buttonGlow}" stop-opacity=".96"/>
      <stop offset="100%" stop-color="${theme.buttonGlow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadowBlur" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="7.2"/></filter>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10.6"/></filter>
    <filter id="buttonShadow" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="3.4"/></filter>
    ${defs}
    <clipPath id="lettersClip">${uses}</clipPath>
  </defs>
  ${outerSweep}
  <g id="shadow" transform="translate(10 12)" fill="${theme.shadow}" opacity=".22" filter="url(#shadowBlur)">${uses}</g>
  <g id="back-glow" transform="translate(-4 -6)" fill="${theme.backGlow}" opacity=".16" filter="url(#softBlur)">${uses}</g>
  <g id="face" fill="url(#velvetFill)" stroke="url(#velvetStroke)" stroke-width="5.8" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  ${texture}
  ${polarGlow}
  <g id="sheen-layer" clip-path="url(#lettersClip)" fill="url(#sheenFill)" opacity=".92">${uses}</g>
  <g id="inner-line" fill="none" stroke="${theme.innerLine}" stroke-width="1.22" opacity=".48">${uses}</g>
  ${sheenLines}
  ${buttons}
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
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 40 : 54, paddingY: horizontal ? 62 : 46 }
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

  global.SlowlyVelvetFactory = Object.freeze({ create });
})(window);
