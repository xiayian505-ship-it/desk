"use strict";
/* 星火燎原｜專屬藝術字核心。
 * 重點：燃燒主字、字內火焰紋理、外圍火星與以「火」字為主的裝飾元素。
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
      1: [[420, 600, 410, -1]],
      2: [[420, 360, 328, -2], [420, 846, 328, 2]],
      3: [[420, 234, 292, -2], [420, 604, 292, 2], [420, 972, 292, -1]],
      4: [[420, 176, 254, -2], [420, 454, 254, 2], [420, 736, 254, -2], [420, 1018, 254, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function buildHorizontalSlots(chars) {
    const count = clamp(chars.length, 1, 4);
    const map = {
      1: [[600, 398, 370, 0]],
      2: [[390, 398, 330, -1], [810, 398, 330, 1]],
      3: [[258, 398, 288, -2], [600, 398, 288, 2], [942, 398, 288, -1]],
      4: [[174, 398, 248, -2], [454, 398, 248, 2], [746, 398, 248, -2], [1028, 398, 248, 2]]
    };
    return chars.map((char, index) => {
      const [x, y, size, rotation] = map[count][index];
      return { char, index, x, y, size, rotation };
    });
  }

  function computeBounds(slots) {
    const left = Math.min(...slots.map(slot => slot.x - slot.size * 0.48));
    const right = Math.max(...slots.map(slot => slot.x + slot.size * 0.48));
    const top = Math.min(...slots.map(slot => slot.y - slot.size * 0.49));
    const bottom = Math.max(...slots.map(slot => slot.y + slot.size * 0.42));
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;
    return { left, right, top, bottom, centerX, centerY, width: right - left, height: bottom - top };
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

  function buildFlames(bounds, theme, horizontal, animated) {
    const flames = [];
    const count = horizontal ? 11 : 13;
    const span = horizontal ? bounds.width / (count - 1) : bounds.width / (count - 1);
    for (let i = 0; i < count; i += 1) {
      const x = bounds.left + i * span;
      const baseY = bounds.bottom - (horizontal ? 10 : 18) + ((i % 3) - 1) * 8;
      const h1 = (horizontal ? 95 : 110) + (i % 4) * 26;
      const w1 = 34 + (i % 3) * 8;
      const path = `M ${round(x - w1)} ${round(baseY)} C ${round(x - w1 * 0.84)} ${round(baseY - h1 * 0.38)}, ${round(x - 8)} ${round(baseY - h1 * 0.9)}, ${round(x)} ${round(baseY - h1)} C ${round(x + 4)} ${round(baseY - h1 * 0.72)}, ${round(x + w1 * 0.94)} ${round(baseY - h1 * 0.4)}, ${round(x + w1)} ${round(baseY)} Z`;
      const small = `M ${round(x - w1 * 0.46)} ${round(baseY)} C ${round(x - w1 * 0.36)} ${round(baseY - h1 * 0.28)}, ${round(x - 4)} ${round(baseY - h1 * 0.55)}, ${round(x)} ${round(baseY - h1 * 0.66)} C ${round(x + 2)} ${round(baseY - h1 * 0.48)}, ${round(x + w1 * 0.44)} ${round(baseY - h1 * 0.24)}, ${round(x + w1 * 0.42)} ${round(baseY)} Z`;
      flames.push(`<path d="${path}" fill="url(#flameGrad${i % 3})" opacity="${i % 2 === 0 ? '.86' : '.74'}">${animated ? `<animateTransform attributeName="transform" type="translate" values="0 0;0 ${-4 - (i % 3)};0 0" dur="${3.4 + i * 0.12}s" repeatCount="indefinite"/>` : ''}${animated ? `<animate attributeName="opacity" values="${i % 2 === 0 ? '.76;.94;.76' : '.64;.82;.64'}" dur="${2.6 + i * 0.09}s" repeatCount="indefinite"/>` : ''}</path>`);
      flames.push(`<path d="${small}" fill="${theme.flameCore}" opacity=".54">${animated ? `<animate attributeName="opacity" values=".38;.62;.38" dur="${2.9 + i * 0.08}s" repeatCount="indefinite"/>` : ''}</path>`);
    }
    return `<g id="inner-flames" clip-path="url(#lettersClip)">${flames.join('')}</g>`;
  }

  function buildTexture(slots, theme, animated) {
    const lines = [];
    const embers = [];
    slots.forEach((slot, index) => {
      const scale = slot.size / 250;
      const body = [];
      for (let row = -3; row <= 3; row += 1) {
        const y = row * 28;
        const width = 170 - Math.abs(row) * 20;
        body.push(`<path d="M ${-width / 2} ${y} C ${-width * 0.18} ${y - 14}, ${width * 0.18} ${y + 12}, ${width / 2} ${y - 2}" fill="none" stroke="${row % 2 === 0 ? theme.crackLight : theme.crackDark}" stroke-width="${row % 2 === 0 ? '5.4' : '3.4'}" stroke-linecap="round" opacity="${row % 2 === 0 ? '.18' : '.16'}"/>`);
      }
      const sparkCount = 7;
      const sparks = [];
      for (let i = 0; i < sparkCount; i += 1) {
        const sx = -104 + (i * 37 % 208);
        const sy = -112 + (i * 49 % 224);
        sparks.push(`<circle cx="${sx}" cy="${sy}" r="${i % 3 === 0 ? '4.6' : '2.8'}" fill="${i % 2 === 0 ? theme.sparkA : theme.sparkB}" opacity="${i % 3 === 0 ? '.28' : '.18'}"/>`);
      }
      lines.push(`<g transform="translate(${round(slot.x)} ${round(slot.y)}) scale(${round(scale)})">${body.join('')}${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 -4;0 0;0 3;0 0" dur="${4.6 + index * 0.4}s" repeatCount="indefinite"/>` : ''}</g>`);
      embers.push(`<g transform="translate(${round(slot.x)} ${round(slot.y)}) scale(${round(scale)})">${sparks.join('')}</g>`);
    });
    return `<g id="letter-cracks" clip-path="url(#lettersClip)">${lines.join('')}</g><g id="letter-embers" clip-path="url(#lettersClip)">${embers.join('')}</g>`;
  }

  function buildSparkField(bounds, theme, horizontal, animated) {
    const sparks = [];
    const count = horizontal ? 24 : 28;
    for (let i = 0; i < count; i += 1) {
      const x = bounds.left - 30 + (i * 57 % (bounds.width + 60));
      const y = bounds.top - 36 + (i * 83 % (bounds.height + 100));
      const r = i % 4 === 0 ? 5.2 : i % 3 === 0 ? 3.2 : 2.2;
      const fill = i % 2 === 0 ? theme.sparkA : theme.sparkB;
      const dur = 3.2 + (i % 5) * 0.5;
      sparks.push(`<circle cx="${round(x)}" cy="${round(y)}" r="${r}" fill="${fill}" opacity="${i % 4 === 0 ? '.44' : '.28'}">${animated ? `<animate attributeName="opacity" values=".12;${i % 4 === 0 ? '.54' : '.36'};.12" dur="${dur}s" repeatCount="indefinite"/>` : ''}${animated ? `<animateTransform attributeName="transform" type="translate" values="0 0;${(i % 3) - 1} ${-10 - (i % 4) * 2};0 0" dur="${dur}s" repeatCount="indefinite"/>` : ''}</circle>`);
    }
    return `<g id="spark-field">${sparks.join('')}</g>`;
  }

  function buildFireGlyphs(bounds, theme, horizontal, animated) {
    const positions = horizontal
      ? [
          { x: bounds.left - 42, y: bounds.top + 64, size: 82, rot: -16, flipX: 1, flipY: 1, opacity: .42 },
          { x: bounds.left + 32, y: bounds.bottom + 34, size: 72, rot: 14, flipX: -1, flipY: 1, opacity: .34 },
          { x: bounds.centerX - 54, y: bounds.top - 24, size: 68, rot: -8, flipX: 1, flipY: -1, opacity: .3 },
          { x: bounds.centerX + 66, y: bounds.bottom + 28, size: 74, rot: 12, flipX: -1, flipY: -1, opacity: .3 },
          { x: bounds.right + 44, y: bounds.centerY - 88, size: 88, rot: 10, flipX: 1, flipY: 1, opacity: .4 },
          { x: bounds.right + 24, y: bounds.centerY + 96, size: 64, rot: -18, flipX: -1, flipY: 1, opacity: .28 }
        ]
      : [
          { x: bounds.centerX - 138, y: bounds.top + 34, size: 84, rot: -14, flipX: 1, flipY: 1, opacity: .38 },
          { x: bounds.centerX + 138, y: bounds.top + 146, size: 66, rot: 18, flipX: -1, flipY: 1, opacity: .3 },
          { x: bounds.right + 54, y: bounds.centerY - 110, size: 90, rot: 12, flipX: 1, flipY: -1, opacity: .42 },
          { x: bounds.left - 54, y: bounds.centerY + 26, size: 72, rot: -18, flipX: -1, flipY: 1, opacity: .32 },
          { x: bounds.centerX + 128, y: bounds.bottom - 30, size: 82, rot: 10, flipX: -1, flipY: -1, opacity: .34 },
          { x: bounds.centerX - 136, y: bounds.bottom + 56, size: 70, rot: -12, flipX: 1, flipY: 1, opacity: .28 }
        ];
    return `<g id="fire-glyphs">${positions.map((item, index) => {
      const scale = item.size / 100;
      return `<g transform="translate(${round(item.x)} ${round(item.y)}) rotate(${item.rot}) scale(${round(scale * item.flipX)} ${round(scale * item.flipY)})" opacity="${item.opacity}">
        <text x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family='${xmlEscape(FONT_SERIF)}' font-size="100" font-weight="900" fill="url(#fireGlyphGrad)" stroke="${theme.fireGlyphStroke}" stroke-width="2.2" paint-order="stroke fill">火</text>
        ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate" values="0 0;0 ${-8 - index};0 0" dur="${4 + index * 0.36}s" repeatCount="indefinite"/>` : ''}
        ${animated ? `<animate attributeName="opacity" values="${Math.max(0.18, item.opacity - 0.1)};${Math.min(0.68, item.opacity + 0.1)};${Math.max(0.18, item.opacity - 0.1)}" dur="${3.8 + index * 0.28}s" repeatCount="indefinite"/>` : ''}
      </g>`;
    }).join('')}</g>`;
  }

  function buildTailSmears(bounds, theme, horizontal, animated) {
    const pathA = horizontal
      ? `M ${round(bounds.left - 30)} ${round(bounds.centerY + 94)} C ${round(bounds.centerX - 120)} ${round(bounds.bottom + 74)}, ${round(bounds.centerX + 10)} ${round(bounds.bottom + 60)}, ${round(bounds.right + 50)} ${round(bounds.centerY + 50)}`
      : `M ${round(bounds.centerX - 150)} ${round(bounds.bottom + 40)} C ${round(bounds.centerX - 84)} ${round(bounds.bottom - 30)}, ${round(bounds.centerX + 50)} ${round(bounds.bottom - 16)}, ${round(bounds.centerX + 138)} ${round(bounds.bottom + 20)}`;
    const pathB = horizontal
      ? `M ${round(bounds.left - 20)} ${round(bounds.centerY - 102)} C ${round(bounds.centerX - 60)} ${round(bounds.top - 40)}, ${round(bounds.centerX + 110)} ${round(bounds.top - 22)}, ${round(bounds.right + 66)} ${round(bounds.centerY - 72)}`
      : `M ${round(bounds.centerX + 150)} ${round(bounds.top - 24)} C ${round(bounds.centerX + 86)} ${round(bounds.top + 28)}, ${round(bounds.centerX - 36)} ${round(bounds.top + 14)}, ${round(bounds.centerX - 144)} ${round(bounds.top - 8)}`;
    return `<g id="smear-lines" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pathA}" stroke="${theme.smearA}" stroke-width="5.8" opacity=".28">${animated ? '<animate attributeName="opacity" values=".18;.34;.18" dur="3.8s" repeatCount="indefinite"/>' : ''}</path>
      <path d="${pathB}" stroke="${theme.smearB}" stroke-width="4.4" opacity=".24">${animated ? '<animate attributeName="opacity" values=".16;.3;.16" dur="4.2s" repeatCount="indefinite"/>' : ''}</path>
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
    const flames = buildFlames(bounds, theme, horizontal, animated);
    const texture = buildTexture(slots, theme, animated);
    const sparkField = buildSparkField(bounds, theme, horizontal, animated);
    const fireGlyphs = buildFireGlyphs(bounds, theme, horizontal, animated);
    const smears = buildTailSmears(bounds, theme, horizontal, animated);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${xmlEscape(text + ' ' + theme.title)}">
  <title>${xmlEscape(text)}｜${xmlEscape(theme.title)}${horizontal ? '橫式' : '直式'}藝術字</title>
  <desc>${xmlEscape(theme.detail)}；透明背景，內含火焰、火星與以「火」字為主的點綴符號。</desc>
  <defs>
    <linearGradient id="mainFaceGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.faceTop}"/>
      <stop offset="42%" stop-color="${theme.faceMid}"/>
      <stop offset="100%" stop-color="${theme.faceBottom}"/>
    </linearGradient>
    <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.rimLight}"/>
      <stop offset="48%" stop-color="${theme.rimMid}"/>
      <stop offset="100%" stop-color="${theme.rimDark}"/>
    </linearGradient>
    <linearGradient id="innerSheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.sheenA}" stop-opacity=".88"/>
      <stop offset="52%" stop-color="${theme.sheenB}" stop-opacity=".3"/>
      <stop offset="100%" stop-color="${theme.sheenC}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="flameGrad0" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${theme.flameBase}"/>
      <stop offset="50%" stop-color="${theme.flameMid}"/>
      <stop offset="100%" stop-color="${theme.flameTip}"/>
    </linearGradient>
    <linearGradient id="flameGrad1" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${theme.flameBase2}"/>
      <stop offset="56%" stop-color="${theme.flameMid}"/>
      <stop offset="100%" stop-color="${theme.flameTip}"/>
    </linearGradient>
    <linearGradient id="flameGrad2" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${theme.flameBase}"/>
      <stop offset="48%" stop-color="${theme.flameMid2}"/>
      <stop offset="100%" stop-color="${theme.flameTip2}"/>
    </linearGradient>
    <linearGradient id="fireGlyphGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${theme.fireGlyphBottom}"/>
      <stop offset="54%" stop-color="${theme.fireGlyphMid}"/>
      <stop offset="100%" stop-color="${theme.fireGlyphTop}"/>
    </linearGradient>
    <filter id="shadowBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7.8"/></filter>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.4"/></filter>
    ${defs}
    <clipPath id="lettersClip">${uses}</clipPath>
  </defs>
  ${smears}
  ${sparkField}
  ${fireGlyphs}
  <g id="shadow" transform="translate(8 11)" fill="${theme.shadow}" opacity=".26" filter="url(#shadowBlur)">${uses}</g>
  <g id="backGlow" transform="translate(-3 -4)" fill="${theme.backGlow}" opacity=".22" filter="url(#softGlow)">${uses}</g>
  <g id="mainFace" fill="url(#mainFaceGrad)" stroke="url(#rimGrad)" stroke-width="5.8" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  ${flames}
  ${texture}
  <g id="sheen" clip-path="url(#lettersClip)"><rect x="0" y="0" width="${width}" height="${height}" fill="url(#innerSheen)" opacity=".36">${animated ? '<animateTransform attributeName="transform" type="translate" values="-20 0;18 -16;-20 0" dur="4.8s" repeatCount="indefinite"/>' : ''}</rect></g>
  <g id="innerOutline" fill="none" stroke="${theme.innerOutline}" stroke-width="1.45" opacity=".42">${uses}</g>
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
        cover: { width: 700, height: 1000, fit: 'contain', paddingX: horizontal ? 40 : 52, paddingY: horizontal ? 62 : 44 }
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

  global.SlowlyEmberFactory = Object.freeze({ create });
})(window);
