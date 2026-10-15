"use strict";
/* 流沙歲月｜專屬藝術字核心。
 * 重點：描邊清楚、填色像流沙滿溢而出、依重力分布的沙粒、字與字之間以流沙連接。
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
      1: [[426, 595, 390, 0]],
      2: [[432, 350, 316, -2], [430, 850, 316, 2]],
      3: [[436, 226, 282, -3], [430, 602, 282, 1], [438, 970, 282, 2]],
      4: [[436, 170, 248, -3], [430, 452, 248, 1], [434, 736, 248, -1], [438, 1020, 248, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[600, 392, 352, 0]],
      2: [[380, 392, 296, -2], [820, 392, 296, 2]],
      3: [[248, 392, 252, -3], [600, 392, 252, 1], [952, 392, 252, 2]],
      4: [[162, 392, 224, -3], [452, 392, 224, 1], [746, 392, 224, -1], [1040, 392, 224, 2]]
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

  function buildConnectorPath(current, next, horizontal) {
    if (horizontal) {
      const sx = current.x + current.size * 0.38;
      const sy = current.y + current.size * 0.05;
      const ex = next.x + next.size * 0.34;
      const ey = next.y - next.size * 0.02;
      const cx1 = sx + (ex - sx) * 0.28;
      const cy1 = sy - current.size * 0.18;
      const cx2 = sx + (ex - sx) * 0.72;
      const cy2 = ey + next.size * 0.14;
      return `M ${round(sx)} ${round(sy)} C ${round(cx1)} ${round(cy1)}, ${round(cx2)} ${round(cy2)}, ${round(ex)} ${round(ey)}`;
    }
    const sx = current.x - current.size * 0.36;
    const sy = current.y + current.size * 0.16;
    const ex = next.x - next.size * 0.39;
    const ey = next.y - next.size * 0.18;
    const cx1 = sx - current.size * 0.24;
    const cy1 = sy + (ey - sy) * 0.22;
    const cx2 = ex - next.size * 0.12;
    const cy2 = sy + (ey - sy) * 0.74;
    return `M ${round(sx)} ${round(sy)} C ${round(cx1)} ${round(cy1)}, ${round(cx2)} ${round(cy2)}, ${round(ex)} ${round(ey)}`;
  }

  function buildSandConnectors(slots, theme, horizontal, animated) {
    if (slots.length < 2) return '';
    const groups = [];
    for (let index = 0; index < slots.length - 1; index += 1) {
      const current = slots[index];
      const next = slots[index + 1];
      const path = buildConnectorPath(current, next, horizontal);
      const grains = [];
      for (let i = 0; i < 24; i += 1) {
        const t = i / 23;
        const x = horizontal
          ? current.x + current.size * 0.38 + (next.x + next.size * 0.34 - (current.x + current.size * 0.38)) * t + (rand(500 + index * 50 + i) - 0.5) * 18
          : current.x - current.size * 0.36 + (next.x - next.size * 0.39 - (current.x - current.size * 0.36)) * t + (rand(500 + index * 50 + i) - 0.5) * 18;
        const y = horizontal
          ? current.y + current.size * 0.05 + (next.y - next.size * 0.02 - (current.y + current.size * 0.05)) * t + (rand(800 + index * 50 + i) - 0.5) * 20
          : current.y + current.size * 0.16 + (next.y - next.size * 0.18 - (current.y + current.size * 0.16)) * t + (rand(800 + index * 50 + i) - 0.5) * 20;
        const r = 2.2 + rand(900 + index * 50 + i) * 4.8;
        const fill = i % 3 === 0 ? theme.lightGold : i % 3 === 1 ? theme.midGold : theme.darkGold;
        grains.push(`<circle cx="${round(x)}" cy="${round(y)}" r="${round(r)}" fill="${fill}" opacity="${round(0.28 + rand(950 + index * 50 + i) * 0.46)}"/>`);
      }
      groups.push(`<g class="sand-connector connector-${index}">
        <path d="${path}" fill="none" stroke="url(#sandFlood)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" opacity=".94"/>
        <path d="${path}" fill="none" stroke="${theme.glowGold}" stroke-width="12" stroke-linecap="round" opacity=".24"/>
        <path d="${path}" fill="none" stroke="${theme.outline}" stroke-width="1.4" stroke-linecap="round" opacity=".22"/>
        ${grains.join('')}
        ${animated ? '<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 14;0 0" dur="6s" repeatCount="indefinite"/>' : ''}
      </g>`);
    }
    return `<g id="sand-connectors">${groups.join('')}</g>`;
  }

  function buildGrainField(slot, theme, animated) {
    const scale = slot.size / 250;
    const circles = [];
    for (let i = 0; i < 130; i += 1) {
      const rx = rand(slot.index * 500 + i * 11 + 7);
      const ry = rand(slot.index * 500 + i * 13 + 91);
      const spread = 0.66 + rand(slot.index * 500 + i * 17 + 31) * 0.28;
      const x = (-96 + rx * 192) * spread;
      const y = -104 + Math.pow(ry, 1.72) * 214;
      const radius = 1.2 + Math.pow(rand(slot.index * 500 + i * 19 + 55), 1.7) * 4.8;
      const toneRoll = rand(slot.index * 500 + i * 23 + 77);
      const fill = toneRoll < 0.28 ? theme.lightGold : toneRoll < 0.74 ? theme.midGold : theme.darkGold;
      const opacity = 0.22 + rand(slot.index * 500 + i * 29 + 99) * 0.54;
      circles.push(`<circle cx="${round(x)}" cy="${round(y)}" r="${round(radius)}" fill="${fill}" opacity="${round(opacity)}"/>`);
    }
    return `<g clip-path="url(#letterClip-${slot.index})" transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})">
      <ellipse cx="0" cy="16" rx="112" ry="132" fill="url(#sandFace)" opacity=".82"/>
      <ellipse cx="12" cy="64" rx="106" ry="84" fill="url(#sandDepth)" opacity=".30"/>
      ${circles.join('')}
      <ellipse cx="-14" cy="-52" rx="82" ry="34" fill="url(#sandHighlight)" opacity=".54"/>
      ${animated ? '<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 14;0 0" dur="6s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  function buildAllGrainFields(slots, theme, animated) {
    return slots.map(slot => buildGrainField(slot, theme, animated)).join('');
  }

  function buildOuterGrains(slots, theme, horizontal, animated) {
    const grains = [];
    slots.forEach((slot, slotIndex) => {
      for (let i = 0; i < 12; i += 1) {
        const angle = horizontal
          ? -0.7 + rand(slotIndex * 100 + i) * 1.4
          : 1.3 + rand(slotIndex * 100 + i) * 1.8;
        const baseR = slot.size * (0.42 + rand(slotIndex * 100 + i + 12) * 0.18);
        const x = slot.x + Math.cos(angle) * baseR + (horizontal ? slot.size * 0.08 : -slot.size * 0.1);
        const y = slot.y + Math.sin(angle) * baseR + slot.size * 0.16 + rand(slotIndex * 100 + i + 16) * 38;
        const radius = 2 + rand(slotIndex * 100 + i + 20) * 5.6;
        const fill = i % 3 === 0 ? theme.lightGold : i % 3 === 1 ? theme.midGold : theme.deepSand;
        grains.push(`<circle cx="${round(x)}" cy="${round(y)}" r="${round(radius)}" fill="${fill}" opacity="${round(0.28 + rand(slotIndex * 100 + i + 24) * 0.42)}"/>`);
      }
    });
    return `<g id="outer-grains">
      ${grains.join('')}
      ${animated ? '<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 14;0 0" dur="6s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  function buildShortLines(slots, theme, horizontal) {
    const lines = [];
    slots.forEach((slot, slotIndex) => {
      const sideX = horizontal ? slot.x - slot.size * 0.52 : slot.x + slot.size * 0.44;
      const directions = [-34, 0, 36];
      directions.forEach((dy, lineIndex) => {
        const len = 18 + ((slotIndex + lineIndex) % 3) * 10;
        const y = slot.y + dy;
        const x1 = horizontal ? sideX : sideX;
        const x2 = horizontal ? sideX + len : sideX + len;
        lines.push(`<line x1="${round(x1)}" y1="${round(y)}" x2="${round(x2)}" y2="${round(y)}" stroke="${theme.lineGold}" stroke-width="3" stroke-linecap="round" opacity="${lineIndex === 1 ? '.76' : '.52'}"/>`);
      });
    });
    return `<g id="short-lines">${lines.join('')}</g>`;
  }

  function buildOverflowBlobs(slots, theme, horizontal) {
    const blobs = [];
    slots.forEach((slot, index) => {
      const cx = horizontal ? slot.x + slot.size * 0.06 : slot.x - slot.size * 0.04;
      const cy = slot.y + slot.size * 0.34;
      const rx = slot.size * 0.26;
      const ry = slot.size * 0.09;
      blobs.push(`<ellipse cx="${round(cx)}" cy="${round(cy)}" rx="${round(rx)}" ry="${round(ry)}" fill="url(#sandFlood)" opacity="${index % 2 === 0 ? '.28' : '.22'}"/>`);
    });
    return `<g id="overflow-blobs">${blobs.join('')}</g>`;
  }

  function embedSVG(text, helpers, theme, horizontal, animated) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const slots = horizontal ? buildHorizontalSlots(chars) : buildVerticalSlots(chars);
    const bounds = computeBounds(slots);
    const defsGlyphs = buildGlyphDefs(slots, theme);
    const allUses = buildFaceUses(slots);
    const clips = slots.map(slot => `<clipPath id="letterClip-${slot.index}">${useGlyph(slot)}</clipPath>`).join('');
    const connectors = buildSandConnectors(slots, theme, horizontal, animated);
    const fields = buildAllGrainFields(slots, theme, animated);
    const outerGrains = buildOuterGrains(slots, theme, horizontal, animated);
    const shortLines = buildShortLines(slots, theme, horizontal);
    const overflowBlobs = buildOverflowBlobs(slots, theme, horizontal);
    const highlightBand = horizontal
      ? `<rect x="${round(bounds.left + 40)}" y="${round(bounds.top + 36)}" width="${round(bounds.width * 0.46)}" height="${round(bounds.height * 0.32)}" rx="84" ry="84" fill="url(#sandShine)" opacity=".34" transform="rotate(-12 ${round(bounds.left + bounds.width * 0.28)} ${round(bounds.top + bounds.height * 0.22)})"/>`
      : `<rect x="${round(bounds.left + 18)}" y="${round(bounds.top + 54)}" width="${round(bounds.width * 0.7)}" height="${round(bounds.height * 0.18)}" rx="84" ry="84" fill="url(#sandShine)" opacity=".34" transform="rotate(-20 ${round(bounds.centerX)} ${round(bounds.top + bounds.height * 0.18)})"/>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，描邊內部塞滿沙粒，並帶有流沙連接與局部打亮。</desc>
  <defs>
    <linearGradient id="sandFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.lightGold}"/>
      <stop offset="52%" stop-color="${theme.midGold}"/>
      <stop offset="100%" stop-color="${theme.darkGold}"/>
    </linearGradient>
    <linearGradient id="sandDepth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.midGold}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${theme.deepSand}" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="sandFlood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.lightGold}"/>
      <stop offset="58%" stop-color="${theme.midGold}"/>
      <stop offset="100%" stop-color="${theme.warmTea}"/>
    </linearGradient>
    <linearGradient id="sandHighlight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.glowGold}" stop-opacity=".86"/>
      <stop offset="100%" stop-color="${theme.glowGold}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sandShine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.glowGold}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${theme.glowGold}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${theme.glowGold}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadowBlur" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="7.6"/></filter>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5.4"/></filter>
    ${defsGlyphs}
    ${clips}
  </defs>
  ${overflowBlobs}
  ${connectors}
  ${outerGrains}
  ${shortLines}
  <g id="shadow" transform="translate(9 12)" fill="${theme.deepSand}" opacity=".18" filter="url(#shadowBlur)">${allUses}</g>
  <g id="base-face" fill="none" stroke="${theme.outline}" stroke-width="6.2" stroke-linejoin="round">${allUses}</g>
  ${fields}
  <g id="shine-overlay" clip-path="url(#letters-clip-group)"></g>
  <g id="letter-highlights" clip-path="url(#globalClip)" opacity=".84"></g>
  <g id="line-art" fill="none" stroke="${theme.outline}" stroke-width="1.26" opacity=".42">${allUses}</g>
  <g id="inner-shine" clip-path="url(#globalClip)">${highlightBand}</g>
  <g id="top-outline" fill="none" stroke="${theme.outline}" stroke-width="5.4" stroke-linejoin="round" opacity=".88">${allUses}</g>
  <g id="top-sheen" fill="none" stroke="${theme.glowGold}" stroke-width="1.3" stroke-linejoin="round" opacity=".28">${allUses}</g>
</svg>`
      .replace('<g id="shine-overlay" clip-path="url(#letters-clip-group)"></g>', `<g id="shine-overlay" clip-path="url(#globalClip)">${highlightBand}</g>`)
      .replace('<g id="letter-highlights" clip-path="url(#globalClip)" opacity=".84"></g>', `<g id="letter-highlights" clip-path="url(#globalClip)" opacity=".84">${slots.map(slot => {
        const scale = slot.size / 250;
        return `<g transform="translate(${round(slot.x)} ${round(slot.y)}) rotate(${slot.rotation}) scale(${round(scale)})"><ellipse cx="-20" cy="-64" rx="90" ry="28" fill="url(#sandHighlight)" opacity=".46"/></g>`;
      }).join('')}</g>`)
      .replace('</defs>', `<clipPath id="globalClip">${allUses}</clipPath></defs>`);
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
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 40 : 52, paddingY: horizontal ? 58 : 44 }
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

  global.SlowlyQuicksandFactory = Object.freeze({ create });
})(window);
