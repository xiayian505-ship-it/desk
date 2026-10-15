"use strict";
/* 羽翼生風｜專屬藝術字核心。
 * 重點：白羽飛揚、碎半羽毛、高透明度大量羽毛、局部炫彩偏光，並保留動態 SVG。
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
      1: [[420, 590, 392, -8]],
      2: [[398, 352, 322, -10], [442, 848, 322, 8]],
      3: [[388, 226, 286, -12], [426, 596, 286, 6], [452, 970, 286, 10]],
      4: [[366, 170, 246, -14], [424, 452, 246, 4], [394, 736, 246, -6], [454, 1020, 246, 12]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[600, 388, 360, -6]],
      2: [[372, 384, 314, -8], [822, 400, 314, 8]],
      3: [[244, 376, 276, -12], [598, 396, 276, 4], [952, 408, 276, 10]],
      4: [[160, 370, 238, -14], [444, 390, 238, 2], [746, 404, 238, -4], [1038, 418, 238, 10]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.5));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.5));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.5));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.43));
    return {
      left, right, top, bottom,
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

  function featherShape(x, y, length, width, rotation, fill, stroke, opacity, broken, animated, index) {
    const tip = -length * (broken ? 0.88 : 1);
    const tail = length * 0.16;
    const leftCtrl = -width * 0.92;
    const rightCtrl = width * 0.92;
    const split = broken ? `
      <path d="M 0 ${round(-length * 0.18)} C ${round(leftCtrl * 0.4)} ${round(-length * 0.06)}, ${round(leftCtrl * 0.8)} ${round(length * 0.08)}, ${round(leftCtrl * 0.86)} ${round(length * 0.26)}" fill="none" stroke="${stroke}" stroke-width="1.1" opacity=".34" stroke-linecap="round"/>` : '';
    const barbs = [];
    for (let i = 0; i < 7; i += 1) {
      const py = tip * 0.74 + i * ((Math.abs(tip) + tail) / 7.2);
      const barb = width * (0.86 - i * 0.1);
      barbs.push(`<path d="M 0 ${round(py)} q ${round(-barb)} ${round(10 + i * 2)} ${round(-barb * 0.98)} ${round(18 + i * 4)}" fill="none" stroke="${stroke}" stroke-width="1" opacity=".28" stroke-linecap="round"/>`);
      if (!broken || i < 4) {
        barbs.push(`<path d="M 0 ${round(py + 2)} q ${round(barb)} ${round(8 + i * 1.6)} ${round(barb * 0.94)} ${round(16 + i * 3.8)}" fill="none" stroke="${stroke}" stroke-width="1" opacity=".25" stroke-linecap="round"/>`);
      }
    }
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(${round(rotation)})" opacity="${opacity}">
      <path d="M 0 ${round(tip)} C ${round(leftCtrl)} ${round(-length * 0.72)}, ${round(leftCtrl * 0.94)} ${round(length * 0.12)}, 0 ${round(length * 0.4)} C ${round(rightCtrl * 0.92)} ${round(length * 0.08)}, ${round(rightCtrl)} ${round(-length * 0.72)}, 0 ${round(tip)} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
      <path d="M 0 ${round(tip)} C ${round(-width * 0.16)} ${round(-length * 0.34)}, ${round(-width * 0.12)} ${round(length * 0.05)}, 0 ${round(length * 0.52)}" fill="none" stroke="${stroke}" stroke-width="2.2" opacity=".46" stroke-linecap="round"/>
      <path d="M 0 ${round(tip)} C ${round(width * 0.12)} ${round(-length * 0.28)}, ${round(width * 0.09)} ${round(length * 0.06)}, 0 ${round(length * 0.46)}" fill="none" stroke="${stroke}" stroke-width="1.3" opacity=".22" stroke-linecap="round"/>
      ${barbs.join('')}
      ${split}
      ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;${(index % 3) - 1} ${-8 - (index % 4) * 2};0 0" dur="${4.8 + (index % 5) * 0.4}s" repeatCount="indefinite"/>` : ''}
      ${animated ? `<animateTransform attributeName="transform" additive="sum" type="rotate" values="0 0 0;${(index % 2 === 0 ? 4 : -4)} 0 0;0 0 0" dur="${5.6 + (index % 4) * 0.45}s" repeatCount="indefinite"/>` : ''}
      ${animated ? `<animate attributeName="opacity" values="${Math.max(0.08, opacity - 0.08)};${Math.min(0.95, opacity + 0.08)};${Math.max(0.08, opacity - 0.08)}" dur="${5.2 + (index % 4) * 0.3}s" repeatCount="indefinite"/>` : ''}
    </g>`;
  }

  function buildFeatherCloud(bounds, theme, horizontal, animated) {
    const positions = horizontal
      ? [
          [bounds.left - 12, bounds.top + 46, 86, 28, -34, false], [bounds.left + 92, bounds.top - 6, 64, 20, -18, true],
          [bounds.left + 188, bounds.top + 40, 56, 18, 10, false], [bounds.centerX - 84, bounds.top - 16, 70, 22, 18, false],
          [bounds.centerX + 42, bounds.top - 28, 92, 30, 26, true], [bounds.right - 112, bounds.top + 18, 76, 24, 34, false],
          [bounds.right + 12, bounds.top + 94, 68, 22, 44, true], [bounds.left + 48, bounds.centerY - 84, 82, 26, -48, false],
          [bounds.centerX - 156, bounds.centerY + 12, 54, 18, -24, true], [bounds.centerX + 174, bounds.centerY - 14, 76, 24, 22, false],
          [bounds.right + 26, bounds.centerY + 82, 90, 28, 52, false], [bounds.right - 68, bounds.centerY + 152, 58, 18, 70, true],
          [bounds.centerX - 22, bounds.bottom + 24, 96, 30, 100, false], [bounds.centerX - 172, bounds.bottom + 30, 62, 20, 142, true],
          [bounds.left + 136, bounds.bottom + 64, 74, 22, 126, false], [bounds.right - 22, bounds.bottom + 54, 70, 22, 112, false],
          [bounds.centerX + 148, bounds.bottom + 8, 52, 16, 78, true], [bounds.left - 22, bounds.centerY + 146, 66, 20, 118, false],
          [bounds.centerX - 32, bounds.centerY - 142, 50, 16, -8, true], [bounds.centerX + 38, bounds.centerY + 126, 48, 16, 98, true],
          [bounds.right + 58, bounds.top + 12, 44, 14, 26, true], [bounds.left - 54, bounds.bottom - 10, 46, 14, 156, true]
        ]
      : [
          [bounds.centerX - 118, bounds.top + 8, 82, 26, -24, false], [bounds.centerX + 64, bounds.top - 32, 62, 20, 18, true],
          [bounds.centerX + 148, bounds.top + 82, 74, 24, 34, false], [bounds.left - 34, bounds.top + 116, 66, 22, -48, true],
          [bounds.right + 30, bounds.top + 226, 92, 28, 36, false], [bounds.left - 24, bounds.centerY - 124, 72, 24, -36, false],
          [bounds.centerX + 168, bounds.centerY - 84, 56, 18, 18, true], [bounds.centerX - 162, bounds.centerY + 26, 84, 26, -18, false],
          [bounds.right + 32, bounds.centerY + 34, 70, 22, 26, false], [bounds.centerX + 148, bounds.centerY + 184, 76, 24, 72, true],
          [bounds.centerX - 124, bounds.bottom + 28, 96, 30, 104, false], [bounds.centerX + 54, bounds.bottom + 50, 66, 22, 126, false],
          [bounds.left + 24, bounds.bottom - 34, 52, 16, 134, true], [bounds.right - 42, bounds.bottom - 16, 54, 16, 84, true],
          [bounds.centerX - 10, bounds.top + 178, 46, 14, 8, true], [bounds.centerX + 26, bounds.centerY + 96, 48, 14, 48, true],
          [bounds.centerX - 176, bounds.centerY + 164, 50, 16, 118, true], [bounds.centerX + 182, bounds.top + 154, 44, 14, 34, true],
          [bounds.left - 52, bounds.top + 18, 42, 14, -24, true], [bounds.right + 58, bounds.bottom + 12, 46, 14, 104, true]
        ];
    return `<g id="feather-cloud">${positions.map((item, index) => featherShape(item[0], item[1], item[2], item[3], item[4], theme.featherFill, theme.featherStroke, item[5] ? '.26' : '.38', item[5], animated, index)).join('')}</g>`;
  }

  function buildInnerFeatherTexture(slots, theme, animated) {
    const pieces = [];
    slots.forEach((slot, slotIndex) => {
      const scale = slot.size / 250;
      const local = [];
      for (let i = 0; i < 8; i += 1) {
        const x = -78 + (i * 24 % 156);
        const y = -96 + (i * 37 % 194);
        const len = 48 - (i % 3) * 4;
        const wid = 15 - (i % 2) * 2;
        local.push(`<g transform="translate(${round(x)} ${round(y)}) rotate(${(i % 2 === 0 ? -26 : 28) + slotIndex * 5}) scale(${round((0.74 + (i % 3) * 0.08))})">
          <path d="M 0 ${round(-len)} C ${round(-wid)} ${round(-len * 0.6)}, ${round(-wid * 0.9)} ${round(len * 0.1)}, 0 ${round(len * 0.3)} C ${round(wid * 0.9)} ${round(len * 0.08)}, ${round(wid)} ${round(-len * 0.6)}, 0 ${round(-len)} Z" fill="${i % 2 === 0 ? theme.innerFeatherA : theme.innerFeatherB}" opacity="${i % 3 === 0 ? '.22' : '.16'}"/>
          <path d="M 0 ${round(-len)} C 0 ${round(-len * 0.2)}, 0 ${round(-len * 0.08)}, 0 ${round(len * 0.36)}" fill="none" stroke="${theme.innerFeatherStroke}" stroke-width="1.1" opacity=".24" stroke-linecap="round"/>
        </g>`);
      }
      pieces.push(`<g transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})">${local.join('')}${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 ${-3 - slotIndex};0 0" dur="${5.6 + slotIndex * 0.4}s" repeatCount="indefinite"/>` : ''}</g>`);
    });
    return `<g id="inner-feathers" clip-path="url(#lettersClip)">${pieces.join('')}</g>`;
  }

  function buildIridescentBands(bounds, theme, horizontal, animated) {
    const bands = horizontal
      ? [
          [bounds.left + 20, bounds.top - 10, bounds.width * 0.34, bounds.height + 46, -16, 'url(#iridescentA)', '.36'],
          [bounds.centerX - 40, bounds.top - 24, bounds.width * 0.3, bounds.height + 64, -12, 'url(#iridescentB)', '.26'],
          [bounds.right - 110, bounds.top + 8, bounds.width * 0.24, bounds.height + 34, -8, 'url(#iridescentC)', '.22']
        ]
      : [
          [bounds.left - 6, bounds.top + 24, bounds.width + 26, 120, -12, 'url(#iridescentA)', '.34'],
          [bounds.left - 12, bounds.centerY - 54, bounds.width + 34, 144, -10, 'url(#iridescentB)', '.28'],
          [bounds.left + 14, bounds.bottom - 114, bounds.width + 8, 112, -8, 'url(#iridescentC)', '.22']
        ];
    return `<g id="iridescent-bands" clip-path="url(#lettersClip)" filter="url(#softBlur)">${bands.map((band, index) => `<rect x="${round(band[0])}" y="${round(band[1])}" width="${round(band[2])}" height="${round(band[3])}" rx="72" ry="72" fill="${band[5]}" opacity="${band[6]}" transform="rotate(${band[4]} ${round(band[0] + band[2] / 2)} ${round(band[1] + band[3] / 2)})">${animated ? `<animate attributeName="opacity" values="${Math.max(0.12, Number(band[6]) - 0.08)};${Math.min(0.54, Number(band[6]) + 0.08)};${Math.max(0.12, Number(band[6]) - 0.08)}" dur="${6 + index}s" repeatCount="indefinite"/>` : ''}</rect>`).join('')}</g>`;
  }

  function buildWindTrails(bounds, theme, horizontal, animated) {
    if (horizontal) {
      const pathA = `M ${round(bounds.left - 46)} ${round(bounds.centerY + 136)} C ${round(bounds.centerX - 152)} ${round(bounds.centerY + 44)}, ${round(bounds.centerX - 30)} ${round(bounds.centerY - 46)}, ${round(bounds.right + 30)} ${round(bounds.centerY + 52)}`;
      const pathB = `M ${round(bounds.left + 26)} ${round(bounds.centerY - 126)} C ${round(bounds.centerX - 16)} ${round(bounds.top - 26)}, ${round(bounds.centerX + 166)} ${round(bounds.centerY - 18)}, ${round(bounds.right + 44)} ${round(bounds.centerY + 104)}`;
      return `<g id="wind-trails" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${pathA}" stroke="${theme.windA}" stroke-width="2.6" opacity=".34" stroke-dasharray="10 14">${animated ? '<animate attributeName="stroke-dashoffset" values="0;-44" dur="5.4s" repeatCount="indefinite"/>' : ''}</path>
        <path d="${pathB}" stroke="${theme.windB}" stroke-width="1.8" opacity=".28" stroke-dasharray="8 12">${animated ? '<animate attributeName="stroke-dashoffset" values="0;40" dur="5.8s" repeatCount="indefinite"/>' : ''}</path>
      </g>`;
    }
    const pathA = `M ${round(bounds.centerX - 188)} ${round(bounds.top + 108)} C ${round(bounds.left - 84)} ${round(bounds.centerY - 26)}, ${round(bounds.centerX + 56)} ${round(bounds.centerY + 16)}, ${round(bounds.centerX + 162)} ${round(bounds.bottom - 36)}`;
    const pathB = `M ${round(bounds.centerX + 172)} ${round(bounds.top + 22)} C ${round(bounds.centerX + 26)} ${round(bounds.centerY - 88)}, ${round(bounds.centerX - 50)} ${round(bounds.centerY + 84)}, ${round(bounds.centerX - 160)} ${round(bounds.bottom - 6)}`;
    return `<g id="wind-trails" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pathA}" stroke="${theme.windA}" stroke-width="2.6" opacity=".34" stroke-dasharray="10 14">${animated ? '<animate attributeName="stroke-dashoffset" values="0;-44" dur="5.4s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${pathB}" stroke="${theme.windB}" stroke-width="1.8" opacity=".28" stroke-dasharray="8 12">${animated ? '<animate attributeName="stroke-dashoffset" values="0;40" dur="5.8s" repeatCount="indefinite"/>' : ''}</path>
    </g>`;
  }

  function embedSVG(text, helpers, theme, horizontal, animated) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const slots = horizontal ? buildHorizontalSlots(chars) : buildVerticalSlots(chars);
    const bounds = computeBounds(slots);
    const defs = buildGlyphDefs(slots, theme);
    const uses = buildGlyphUses(slots);
    const feathers = buildFeatherCloud(bounds, theme, horizontal, animated);
    const innerTexture = buildInnerFeatherTexture(slots, theme, animated);
    const iridescent = buildIridescentBands(bounds, theme, horizontal, animated);
    const wind = buildWindTrails(bounds, theme, horizontal, animated);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，白羽交錯飛揚，局部帶有淡紫偏光與大量高透明羽毛。</desc>
  <defs>
    <linearGradient id="faceFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.faceLight}"/>
      <stop offset="42%" stop-color="${theme.faceMid}"/>
      <stop offset="100%" stop-color="${theme.faceDark}"/>
    </linearGradient>
    <linearGradient id="strokeFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.strokeLight}"/>
      <stop offset="54%" stop-color="${theme.strokeMid}"/>
      <stop offset="100%" stop-color="${theme.strokeDark}"/>
    </linearGradient>
    <linearGradient id="sheenFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sheenLight}" stop-opacity=".88"/>
      <stop offset="48%" stop-color="${theme.sheenMid}" stop-opacity=".26"/>
      <stop offset="100%" stop-color="${theme.sheenDark}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="iridescentA" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.iridescentA1}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.iridescentA2}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.iridescentA3}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="iridescentB" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.iridescentB1}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.iridescentB2}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.iridescentB3}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="iridescentC" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.iridescentC1}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.iridescentC2}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.iridescentC3}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadowBlur" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="7.4"/></filter>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8.2"/></filter>
    ${defs}
    <clipPath id="lettersClip">${uses}</clipPath>
  </defs>
  ${feathers}
  ${wind}
  <g id="shadow" transform="translate(10 12)" fill="${theme.shadow}" opacity=".18" filter="url(#shadowBlur)">${uses}</g>
  <g id="back-glow" transform="translate(-4 -4)" fill="${theme.backGlow}" opacity=".22" filter="url(#softBlur)">${uses}</g>
  <g id="face" fill="url(#faceFill)" stroke="url(#strokeFill)" stroke-width="5.4" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  ${innerTexture}
  ${iridescent}
  <g id="sheen-layer" clip-path="url(#lettersClip)" fill="url(#sheenFill)" opacity=".86">${uses}</g>
  <g id="inner-line" fill="none" stroke="${theme.innerLine}" stroke-width="1.2" opacity=".54">${uses}</g>
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

  global.SlowlyWingsFactory = Object.freeze({ create });
})(window);
