"use strict";
/* 輕音流轉｜專屬藝術字核心。
 * 目標：不依賴共用 word_material_core.js，保留本款自己的旋律線、音符點綴與動態邏輯。
 */
(function (global) {
  const FONT_SERIF = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const round = value => Math.round(Number(value || 0) * 100) / 100;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const safeArrayFrom = value => Array.from(String(value || ''));
  const move = (x, y, scale, raw) => `<g transform="translate(${round(x)} ${round(y)}) scale(${round(scale)})">${raw}</g>`;
  const xmlEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  function buildVerticalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[420, 586, 408, 0]],
      2: [[420, 360, 322, -2], [420, 834, 322, 2]],
      3: [[420, 230, 288, -2], [420, 603, 288, 1], [420, 972, 288, 2]],
      4: [[420, 175, 252, -3], [420, 452, 252, 1], [420, 734, 252, -1], [420, 1015, 252, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars, layout) {
    const count = clamp(chars.length, 1, 4);
    const fallback = {
      1: [600],
      2: [390, 810],
      3: [260, 600, 940],
      4: [180, 460, 740, 1020]
    };
    const y = 410;
    return chars.map((char, index) => {
      const slot = layout?.slots?.[index] || null;
      return {
        char,
        index,
        x: slot?.x ?? fallback[count][index],
        y: slot?.y ?? y,
        size: count === 1 ? 370 : count === 2 ? 324 : count === 3 ? 272 : 236,
        rotation: [-2, 2, -1, 1][index] || 0
      };
    });
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.47));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.47));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.48));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.42));
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    return { left, right, top, bottom, centerX, centerY, width: right - left, height: bottom - top };
  }

  function buildMelodyRibbon(bounds, theme, horizontal, animated) {
    if (horizontal) {
      const topLoop = `M ${round(bounds.left - 55)} ${round(bounds.centerY + 62)} C ${round(bounds.left - 8)} ${round(bounds.top - 26)}, ${round(bounds.centerX - 180)} ${round(bounds.top - 82)}, ${round(bounds.centerX - 18)} ${round(bounds.top - 28)} S ${round(bounds.right + 22)} ${round(bounds.centerY + 36)}, ${round(bounds.right + 40)} ${round(bounds.bottom - 32)}`;
      const crossLine = `M ${round(bounds.left - 64)} ${round(bounds.centerY - 12)} C ${round(bounds.left + 88)} ${round(bounds.centerY - 42)}, ${round(bounds.centerX - 42)} ${round(bounds.centerY + 18)}, ${round(bounds.right + 65)} ${round(bounds.centerY - 8)}`;
      const innerWave = `M ${round(bounds.left + 12)} ${round(bounds.bottom - 22)} C ${round(bounds.left + 140)} ${round(bounds.centerY + 58)}, ${round(bounds.centerX + 36)} ${round(bounds.centerY + 76)}, ${round(bounds.right - 14)} ${round(bounds.top + 84)}`;
      return `
      <g id="melody-ribbon" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="${topLoop}" stroke="${theme.ribbonDark}" stroke-width="6" opacity=".28" filter="url(#ribbonBlur)">
          ${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="6.4s" repeatCount="indefinite"/>' : ''}
        </path>
        <path d="${topLoop}" stroke="${theme.ribbonMain}" stroke-width="2.8" opacity=".78">
          ${animated ? '<animate attributeName="opacity" values=".72;.96;.72" dur="5.8s" repeatCount="indefinite"/>' : ''}
        </path>
        <path d="${crossLine}" stroke="${theme.ribbonAccent}" stroke-width="2.6" opacity=".72">
          ${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 2;0 0" dur="4.8s" repeatCount="indefinite"/>' : ''}
        </path>
        <path d="${innerWave}" stroke="${theme.ribbonSoft}" stroke-width="2" opacity=".65" stroke-dasharray="10 12">
          ${animated ? '<animate attributeName="stroke-dashoffset" values="0;-34" dur="4.8s" repeatCount="indefinite"/>' : ''}
        </path>
      </g>`;
    }
    const outerLoop = `M ${round(bounds.centerX - 160)} ${round(bounds.top - 34)} C ${round(bounds.left - 80)} ${round(bounds.top + 88)}, ${round(bounds.left - 20)} ${round(bounds.centerY)}, ${round(bounds.left + 34)} ${round(bounds.bottom - 80)} S ${round(bounds.right + 86)} ${round(bounds.bottom - 30)}, ${round(bounds.centerX + 150)} ${round(bounds.bottom + 42)}`;
    const innerLoop = `M ${round(bounds.centerX + 36)} ${round(bounds.top + 10)} C ${round(bounds.centerX + 120)} ${round(bounds.top + 120)}, ${round(bounds.centerX - 110)} ${round(bounds.centerY + 18)}, ${round(bounds.centerX + 14)} ${round(bounds.bottom - 22)}`;
    const crossing = `M ${round(bounds.left - 22)} ${round(bounds.centerY - 78)} C ${round(bounds.centerX - 120)} ${round(bounds.centerY - 16)}, ${round(bounds.centerX + 95)} ${round(bounds.centerY - 20)}, ${round(bounds.right + 22)} ${round(bounds.centerY - 90)}`;
    return `
    <g id="melody-ribbon" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${outerLoop}" stroke="${theme.ribbonDark}" stroke-width="6" opacity=".26" filter="url(#ribbonBlur)">
        ${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="6.8s" repeatCount="indefinite"/>' : ''}
      </path>
      <path d="${outerLoop}" stroke="${theme.ribbonMain}" stroke-width="2.8" opacity=".82">
        ${animated ? '<animate attributeName="opacity" values=".78;1;.78" dur="5.6s" repeatCount="indefinite"/>' : ''}
      </path>
      <path d="${innerLoop}" stroke="${theme.ribbonAccent}" stroke-width="2.4" opacity=".72">
        ${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 4;0 0" dur="4.4s" repeatCount="indefinite"/>' : ''}
      </path>
      <path d="${crossing}" stroke="${theme.ribbonSoft}" stroke-width="2" opacity=".6" stroke-dasharray="9 12">
        ${animated ? '<animate attributeName="stroke-dashoffset" values="0;-30" dur="4.4s" repeatCount="indefinite"/>' : ''}
      </path>
    </g>`;
  }

  function buildTexture(slot, theme, animated) {
    const bars = [];
    for (let row = -3; row <= 3; row += 1) {
      const y = row * 34;
      const width = 172 - Math.abs(row) * 16;
      bars.push(`<path d="M ${-width / 2} ${y} Q 0 ${y - 18} ${width / 2} ${y}" fill="none" stroke="${row % 2 === 0 ? theme.textureA : theme.textureB}" stroke-width="8" stroke-linecap="round" opacity="${row % 2 === 0 ? '.26' : '.18'}"/>`);
    }
    const waves = [];
    for (let i = -4; i <= 4; i += 1) {
      const startY = i * 24;
      waves.push(`<path d="M -150 ${startY} C -80 ${startY - 14}, 20 ${startY + 12}, 150 ${startY - 10}" fill="none" stroke="${i % 2 === 0 ? theme.waveA : theme.waveB}" stroke-width="${i % 2 === 0 ? '3.2' : '2'}" opacity="${i % 2 === 0 ? '.52' : '.34'}"/>`);
    }
    const dots = [];
    for (let i = 0; i < 8; i += 1) {
      const x = -120 + (i * 41 % 240);
      const y = -98 + (i * 57 % 196);
      dots.push(`<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 4 : 2.6}" fill="${i % 2 === 0 ? theme.sparkA : theme.sparkB}" opacity="${i % 3 === 0 ? '.28' : '.18'}"/>`);
    }
    return move(slot.x, slot.y, slot.size / 250, `
      <g opacity="1">
        <rect x="-174" y="-174" width="348" height="348" fill="url(#letterTextureGlow)" opacity=".12"/>
        <g>${bars.join('')}</g>
        <g>${waves.join('')}</g>
        <g>${dots.join('')}</g>
        ${animated ? '<animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0;0 3;0 0" dur="5.2s" repeatCount="indefinite"/>' : ''}
      </g>`);
  }

  function buildSingleNote(x, y, scale, rotate, fill, stroke, opacity, animated, id) {
    return `
    <g transform="translate(${round(x)} ${round(y)}) rotate(${round(rotate)}) scale(${round(scale)})" opacity="${opacity}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="0" cy="0" rx="12" ry="8" transform="rotate(-25)"/>
      <path d="M 10 -2 V -54" fill="none"/>
      <path d="M 10 -50 Q 32 -45 36 -28" fill="none"/>
      ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 -6;0 0" dur="${4.2 + (id % 3) * 0.8}s" repeatCount="indefinite"/>` : ''}
      ${animated ? `<animate attributeName="opacity" values="${opacity};${Math.min(1, opacity + 0.18)};${opacity}" dur="${3.8 + (id % 4) * 0.7}s" repeatCount="indefinite"/>` : ''}
    </g>`;
  }

  function buildDoubleNote(x, y, scale, rotate, fill, stroke, opacity, animated, id) {
    return `
    <g transform="translate(${round(x)} ${round(y)}) rotate(${round(rotate)}) scale(${round(scale)})" opacity="${opacity}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="-10" cy="0" rx="11" ry="8" transform="rotate(-25 -10 0)"/>
      <ellipse cx="16" cy="8" rx="11" ry="8" transform="rotate(-25 16 8)"/>
      <path d="M -1 -3 V -58" fill="none"/>
      <path d="M 25 6 V -49" fill="none"/>
      <path d="M -1 -54 Q 19 -50 25 -40 V -24 Q 11 -31 -1 -28 Z"/>
      ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 5;0 0" dur="${4.8 + (id % 2) * 0.9}s" repeatCount="indefinite"/>` : ''}
      ${animated ? `<animate attributeName="opacity" values="${opacity};${Math.min(1, opacity + 0.14)};${opacity}" dur="${4.4 + (id % 3) * 0.6}s" repeatCount="indefinite"/>` : ''}
    </g>`;
  }

  function buildNotes(slots, bounds, theme, horizontal, animated) {
    const notes = [];
    slots.forEach((slot, index) => {
      const dx = horizontal ? (index % 2 === 0 ? -slot.size * 0.34 : slot.size * 0.34) : (index % 2 === 0 ? slot.size * 0.38 : -slot.size * 0.34);
      const dy = horizontal ? (index % 2 === 0 ? -slot.size * 0.3 : slot.size * 0.28) : (index % 2 === 0 ? -slot.size * 0.22 : slot.size * 0.22);
      const x = slot.x + dx;
      const y = slot.y + dy;
      if (index % 2 === 0) {
        notes.push(buildDoubleNote(x, y, slot.size / 265, horizontal ? -12 + index * 5 : 6 - index * 4, theme.noteA, theme.noteStroke, '.62', animated, index));
      } else {
        notes.push(buildSingleNote(x, y, slot.size / 290, horizontal ? 14 - index * 4 : -8 + index * 5, theme.noteB, theme.noteStroke, '.56', animated, index));
      }
    });
    const accentPositions = horizontal
      ? [
          { x: bounds.left + 38, y: bounds.centerY - 78, r: 7 },
          { x: bounds.right - 26, y: bounds.centerY + 82, r: 6 },
          { x: bounds.centerX - 10, y: bounds.top - 26, r: 5 }
        ]
      : [
          { x: bounds.centerX - 12, y: bounds.top - 16, r: 7 },
          { x: bounds.right + 18, y: bounds.centerY - 32, r: 6 },
          { x: bounds.left - 12, y: bounds.bottom - 48, r: 5 }
        ];
    accentPositions.forEach((dot, index) => {
      notes.push(`<circle cx="${round(dot.x)}" cy="${round(dot.y)}" r="${dot.r}" fill="${index % 2 === 0 ? theme.noteA : theme.noteB}" opacity=".28">${animated ? `<animate attributeName="opacity" values=".16;.34;.16" dur="${3.6 + index * 0.8}s" repeatCount="indefinite"/>` : ''}</circle>`);
    });
    return `<g id="melody-notes">${notes.join('')}</g>`;
  }

  function buildSparkles(slots, theme, animated) {
    const sparkles = [];
    slots.forEach((slot, index) => {
      const x = slot.x + (index % 2 === 0 ? slot.size * 0.1 : -slot.size * 0.12);
      const y = slot.y - slot.size * 0.36;
      sparkles.push(`
      <g transform="translate(${round(x)} ${round(y)})" opacity=".52">
        <path d="M 0 -9 V 9 M -9 0 H 9" stroke="${theme.sparkA}" stroke-width="2.1" stroke-linecap="round"/>
        ${animated ? `<animateTransform attributeName="transform" additive="sum" type="scale" values="1;1.18;1" dur="${4.5 + index * 0.5}s" repeatCount="indefinite"/>` : ''}
      </g>`);
    });
    return `<g id="melody-sparkles">${sparkles.join('')}</g>`;
  }

  function embedSVG(text, helpers, layout, theme, horizontal, animated) {
    const chars = typeof helpers?.splitCharacters === 'function' ? helpers.splitCharacters(text) : safeArrayFrom(text);
    const width = horizontal ? 1200 : 840;
    const height = horizontal ? 760 : 1200;
    const slots = horizontal ? buildHorizontalSlots(chars, layout) : buildVerticalSlots(chars);
    const bounds = computeBounds(slots);
    const fontFamily = FONT_SERIF;
    const glyphId = `xylophone-${horizontal ? 'h' : 'v'}`;
    const glyphBank = slots.map(slot => `<text id="${glyphId}-${slot.index}" x="${round(slot.x)}" y="${round(slot.y)}" text-anchor="middle" dominant-baseline="central" font-family='${xmlEscape(fontFamily)}' font-size="${slot.size}" font-weight="${theme.weight}" transform="rotate(${slot.rotation} ${round(slot.x)} ${round(slot.y)})">${xmlEscape(slot.char)}</text>`).join('');
    const uses = slots.map(slot => `<use href="#${glyphId}-${slot.index}"/>`).join('');
    const faceStops = theme.face.map((color, index) => `<stop offset="${round(index * 100 / (theme.face.length - 1))}%" stop-color="${color}"/>`).join('');
    const rimStops = theme.rim.map((color, index) => `<stop offset="${round(index * 100 / (theme.rim.length - 1))}%" stop-color="${color}"/>`).join('');
    const texture = slots.map(slot => buildTexture(slot, theme, animated)).join('');
    const ribbon = buildMelodyRibbon(bounds, theme, horizontal, animated);
    const notes = buildNotes(slots, bounds, theme, horizontal, animated);
    const sparkles = buildSparkles(slots, theme, animated);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，主題字內含柔光紋理與旋律線。</desc>
  <defs>
    <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">${faceStops}</linearGradient>
    <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">${rimStops}</linearGradient>
    <linearGradient id="innerSheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.sheenA}" stop-opacity=".9"/><stop offset=".46" stop-color="${theme.sheenB}" stop-opacity=".3"/><stop offset="1" stop-color="${theme.sheenC}" stop-opacity="0"/></linearGradient>
    <radialGradient id="letterTextureGlow" cx="50%" cy="38%" r="74%"><stop offset="0" stop-color="${theme.glowA}" stop-opacity=".55"/><stop offset=".68" stop-color="${theme.glowB}" stop-opacity=".14"/><stop offset="1" stop-color="${theme.glowC}" stop-opacity="0"/></radialGradient>
    <filter id="dropShadow" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="softGlow" x="-28%" y="-28%" width="156%" height="156%"><feGaussianBlur stdDeviation="4.4"/></filter>
    <filter id="ribbonBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.6"/></filter>
    <filter id="noteGlow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3"/></filter>
    <g id="glyphBank">${glyphBank}</g>
    <clipPath id="letterMask">${uses}</clipPath>
  </defs>
  <g id="ambient-ribbon">${ribbon}</g>
  <g id="glyph-shadow" transform="translate(8 12)" fill="${theme.shadow}" opacity=".24" filter="url(#dropShadow)">${uses}</g>
  <g id="glyph-backlight" transform="translate(0 -4)" fill="${theme.backlight}" opacity=".28" filter="url(#softGlow)">${uses}</g>
  <g id="glyph-face" fill="url(#faceGrad)" stroke="url(#rimGrad)" stroke-width="5.4" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  <g id="glyph-depth" transform="translate(-3 -4)" fill="none" stroke="${theme.depthStroke}" stroke-width="2.2" opacity=".36">${uses}</g>
  <g id="glyph-texture" clip-path="url(#letterMask)">${texture}</g>
  <g id="glyph-sheen" clip-path="url(#letterMask)">
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#innerSheen)" opacity=".48">
      ${animated ? '<animateTransform attributeName="transform" type="translate" values="-22 0;18 -18;-22 0" dur="5.8s" repeatCount="indefinite"/>' : ''}
    </rect>
  </g>
  <g id="glyph-inner-line" fill="none" stroke="${theme.innerStroke}" stroke-width="1.45" opacity=".48">${uses}</g>
  <g id="note-glow" filter="url(#noteGlow)" opacity=".24">${notes}</g>
  ${notes}
  ${sparkles}
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
      renderSVG(text, helpers, layout) {
        return embedSVG(text, helpers, layout, theme, horizontal, false);
      },
      presets: {
        png: { scale: 2 },
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 40 : 56, paddingY: horizontal ? 64 : 48 }
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
      return embedSVG(normalized, {
        splitCharacters: generator.splitCharacters,
        escapeXML: xmlEscape
      }, null, theme, horizontal, true);
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

  global.SlowlyXylophoneFactory = Object.freeze({ create });
})(window);
