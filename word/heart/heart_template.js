"use strict";
/* 相濡以沫｜愛心流線藝術字 SVG 核心。 */
(function (global) {
  // 和其他藝術字（如穿林打葉、鳥語花香）使用相同的系統中文字體堆疊。
  // 字型不依賴從 Google Fonts 載入；SVG <img> / Blob 顯示時也能正常回退。
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const SIZE = Object.freeze({ vertical: { width: 840, height: 1200 }, horizontal: { width: 1200, height: 760 } });

  function n(value) { return Math.round(value * 10) / 10; }

  function getVerticalSlots(length) {
    const map = {
      1: { xs: [420], ys: [628], size: 350 },
      2: { xs: [420, 420], ys: [410, 860], size: 292 },
      3: { xs: [420, 420, 420], ys: [282, 630, 980], size: 248 },
      4: { xs: [420, 420, 420, 420], ys: [210, 474, 740, 1006], size: 220 }
    }[length];
    return map.xs.map((x, index) => ({ x, y: map.ys[index], size: map.size }));
  }

  function getHorizontalSlots(length) {
    const map = {
      1: { xs: [600], y: 410, size: 312 },
      2: { xs: [455, 745], y: 410, size: 272 },
      3: { xs: [332, 600, 868], y: 412, size: 232 },
      4: { xs: [238, 480, 720, 962], y: 412, size: 208 }
    }[length];
    return map.xs.map(x => ({ x, y: map.y, size: map.size }));
  }

  function heartPath(cx, cy, scale) {
    return `M${n(cx)} ${n(cy + 12 * scale)} C${n(cx - 24 * scale)} ${n(cy - 12 * scale)} ${n(cx - 52 * scale)} ${n(cy + 4 * scale)} ${n(cx)} ${n(cy + 46 * scale)} C${n(cx + 52 * scale)} ${n(cy + 4 * scale)} ${n(cx + 24 * scale)} ${n(cy - 12 * scale)} ${n(cx)} ${n(cy + 12 * scale)} Z`;
  }

  function tinyHeart(cx, cy, scale) {
    // 原本的小實心愛心統一放大兩號：大小由宿主模板管理。
    const d = heartPath(cx, cy, n(scale * 1.58));
    return `<path d="${d}" fill="url(#heartFill)" opacity=".92"/>`;
  }

  function outlinedHearts(slots, orientation) {
    const hearts = [];
    if (orientation === 'horizontal') {
      if (slots.length >= 2) {
        hearts.push({ cx: (slots[0].x + slots[1].x) / 2, cy: slots[0].y - slots[0].size * .62, scale: 1.04 });
      }
      if (slots.length >= 4) {
        hearts.push({ cx: (slots[2].x + slots[3].x) / 2, cy: slots[2].y + slots[2].size * .18, scale: 1.04 });
      } else if (slots.length === 3) {
        hearts.push({ cx: (slots[1].x + slots[2].x) / 2, cy: slots[1].y + slots[1].size * .2, scale: 1.0 });
      }
    } else {
      if (slots.length >= 2) {
        hearts.push({ cx: slots[0].x + slots[0].size * .48, cy: (slots[0].y + slots[1].y) / 2 - slots[0].size * .34, scale: 1.02 });
      }
      if (slots.length >= 4) {
        hearts.push({ cx: slots[2].x - slots[2].size * .46, cy: (slots[2].y + slots[3].y) / 2 + slots[2].size * .02, scale: 1.02 });
      } else if (slots.length === 3) {
        hearts.push({ cx: slots[1].x - slots[1].size * .46, cy: (slots[1].y + slots[2].y) / 2 + slots[1].size * .04, scale: .98 });
      }
    }
    return hearts.map(item => `<path d="${heartPath(item.cx, item.cy, item.scale)}" fill="none" stroke="url(#heartOutline)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>`).join('');
  }

  function scatterHearts(slots, orientation) {
    const items = [];
    if (orientation === 'horizontal') {
      const y = slots[0].y;
      items.push(
        { x: slots[0].x - slots[0].size * .5, y: y - slots[0].size * .48, s: .2 },
        { x: slots[1] ? slots[1].x + slots[1].size * .36 : slots[0].x + slots[0].size * .42, y: y - slots[0].size * .2, s: .18 },
        { x: slots[Math.max(0, slots.length - 1)].x + slots[0].size * .38, y: y + slots[0].size * .34, s: .22 },
        { x: slots[Math.max(0, slots.length - 2)].x - slots[0].size * .2, y: y + slots[0].size * .48, s: .16 },
        { x: slots[0].x + slots[0].size * .18, y: y - slots[0].size * .74, s: .14 },
        { x: slots[Math.max(0, slots.length - 1)].x - slots[0].size * .22, y: y - slots[0].size * .64, s: .14 }
      );
    } else {
      items.push(
        { x: 420 - slots[0].size * .78, y: slots[0].y - slots[0].size * .36, s: .2 },
        { x: 420 + slots[0].size * .6, y: slots[0].y + slots[0].size * .06, s: .16 },
        { x: 420 - slots[Math.min(1, slots.length - 1)].size * .68, y: slots[Math.min(1, slots.length - 1)].y + slots[0].size * .12, s: .14 },
        { x: 420 + slots[Math.max(0, slots.length - 1)].size * .58, y: slots[Math.max(0, slots.length - 1)].y - slots[0].size * .24, s: .18 },
        { x: 420 - slots[Math.max(0, slots.length - 1)].size * .52, y: slots[Math.max(0, slots.length - 1)].y + slots[0].size * .22, s: .16 },
        { x: 420 + slots[Math.max(0, slots.length - 2)].size * .46, y: slots[Math.max(0, slots.length - 2)].y + slots[0].size * .42, s: .14 }
      );
    }
    return items.map(item => tinyHeart(item.x, item.y, item.s)).join('');
  }

  function wavePath(slots, orientation) {
    if (orientation === 'horizontal') {
      const first = slots[0];
      const last = slots[slots.length - 1];
      const y = n(first.y - first.size * .33);
      const x1 = n(first.x - first.size * .96);
      const x2 = n(last.x + last.size * .88);
      const q1 = n(x1 + (x2 - x1) * .18);
      const q2 = n(x1 + (x2 - x1) * .36);
      const q3 = n(x1 + (x2 - x1) * .56);
      const q4 = n(x1 + (x2 - x1) * .76);
      return `M${x1} ${y} Q${q1} ${n(y - 26)} ${q2} ${y} Q${q3} ${n(y + 24)} ${q4} ${y} Q${n(x1 + (x2 - x1) * .9)} ${n(y - 18)} ${x2} ${y}`;
    }
    const first = slots[0];
    const last = slots[slots.length - 1];
    // 長線穿過字體約左側三分之一，而不是留在字的外面。
    const x = n(first.x - first.size * .31);
    const y1 = n(first.y - first.size * .82);
    const y2 = n(last.y + last.size * .74);
    const d = y2 - y1;
    return `M${x} ${y1} C${n(x - 38)} ${n(y1 + d * .13)} ${n(x + 30)} ${n(y1 + d * .22)} ${x} ${n(y1 + d * .35)} C${n(x - 30)} ${n(y1 + d * .48)} ${n(x + 32)} ${n(y1 + d * .60)} ${x} ${n(y1 + d * .72)} C${n(x - 32)} ${n(y1 + d * .85)} ${n(x + 20)} ${n(y1 + d * .92)} ${x} ${y2}`;
  }

  function createGlyphs(chars, slots, escapeXML) {
    const font = escapeXML(FONT);
    const shadow = [];
    const main = [];
    const gloss = [];
    chars.forEach((char, index) => {
      const slot = slots[index];
      const attrs = `x="${slot.x}" y="${slot.y}" text-anchor="middle" dominant-baseline="central" font-family="${font}" font-size="${slot.size}" font-weight="900"`;
      shadow.push(`<text ${attrs} fill="#5a1d34" opacity=".36" transform="translate(10 14)">${escapeXML(char)}</text>`);
      main.push(`<text ${attrs} fill="url(#titleInk)" stroke="url(#titleStroke)" stroke-width="2" paint-order="stroke fill">${escapeXML(char)}</text>`);
      gloss.push(`<text ${attrs} fill="none" stroke="#ffd7e5" stroke-width="1.1" opacity=".72">${escapeXML(char)}</text>`);
    });
    return { shadow: shadow.join(''), main: main.join(''), gloss: gloss.join('') };
  }

  /**
   * 導出用的 SVG 原生對應圖層。
   * 軍火庫 decorative_glow.css 使用 DOM 偽元素，不能隨 SVG / PNG 下載；
   * 在此用 SVG 徑向漸層保留兩束光，無背景矩形、無外部樣式依賴。
   */
  function dualGlow(orientation, animated) {
    const horizontal = orientation === 'horizontal';
    const a = horizontal
      ? { cx: 380, cy: 295, rx: 250, ry: 205 }
      : { cx: 325, cy: 345, rx: 320, ry: 360 };
    const b = horizontal
      ? { cx: 855, cy: 500, rx: 275, ry: 215 }
      : { cx: 540, cy: 895, rx: 290, ry: 335 };
    const pulse = animated ? `<animate attributeName="opacity" values=".78;1;.78" dur="6.6s" repeatCount="indefinite"/>` : '';
    return `<g id="heart-dual-glow" aria-label="Decorative Dual Glow" opacity="1">${pulse}
      <ellipse cx="${a.cx}" cy="${a.cy}" rx="${a.rx}" ry="${a.ry}" fill="url(#dualGlowPink)"/>
      <ellipse cx="${b.cx}" cy="${b.cy}" rx="${b.rx}" ry="${b.ry}" fill="url(#dualGlowWine)"/>
    </g>`;
  }

  /**
   * 導出用的 Enso Ring：不靠軍火庫網站 CSS 才能保留可攜性。
   * 動態版加入原生 SVG SMIL，靜態版完整露出圓環缺口。
   */
  function ensoRing(orientation, animated) {
    const horizontal = orientation === 'horizontal';
    const center = horizontal ? { x: 600, y: 390 } : { x: 420, y: 600 };
    const scale = horizontal ? `translate(${center.x} ${center.y}) scale(1.46 .72)` : `translate(${center.x} ${center.y}) scale(.92 1.34)`;
    const radius = horizontal ? 335 : 335;
    const circleA = `<circle r="${radius}" pathLength="100" stroke="url(#ensoWine)" stroke-width="5.1" stroke-linecap="round" stroke-dasharray="85 15" stroke-dashoffset="${animated ? '100' : '12'}" opacity=".33">${animated ? '<animate attributeName="stroke-dashoffset" from="100" to="12" dur="3.4s" begin=".2s" fill="freeze"/>' : ''}</circle>`;
    const circleB = `<circle r="${radius+11}" pathLength="100" stroke="#ffc3d6" stroke-width="1.7" stroke-linecap="round" stroke-dasharray="83 17" stroke-dashoffset="${animated ? '100' : '11'}" opacity=".39">${animated ? '<animate attributeName="stroke-dashoffset" from="100" to="11" dur="3.4s" begin=".7s" fill="freeze"/>' : ''}</circle>`;
    const spin = animated ? '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="90s" repeatCount="indefinite" additive="sum"/>' : '';
    return `<g id="heart-enso-ring" aria-label="Enso Ring" fill="none" transform="${scale}"><g transform="rotate(-24)">${spin}${circleA}${circleB}</g></g>`;
  }

  function createSVG(rawText, orientation, helpers, options = {}) {
    const size = SIZE[orientation];
    if (!size) throw new Error('不支援的排列方式。');
    const text = helpers.splitCharacters(String(rawText || '')).slice(0, 4).join('');
    if (!text) throw new Error('請輸入至少一個字。');
    const chars = helpers.splitCharacters(text);
    const slots = orientation === 'horizontal' ? getHorizontalSlots(chars.length) : getVerticalSlots(chars.length);
    const xml = helpers.escapeXML || (value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]));
    const glyphs = createGlyphs(chars, slots, xml);
    const hearts = outlinedHearts(slots, orientation);
    const scatter = scatterHearts(slots, orientation);
    const wave = wavePath(slots, orientation);
    const safeText = xml(text);
    const animated = !!options.animated;
    const halo = dualGlow(orientation, animated);
    const ring = ensoRing(orientation, animated);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}" role="img" aria-labelledby="title desc">
  <title id="title">${safeText}｜相濡以沫藝術字</title>
  <desc id="desc">${safeText}：酒紅粉紅漸層、雙光暈、描邊圓環、空心及實心愛心、穿字圓潤流線。整張透明 SVG 自帶所有視覺圖層。</desc>
  <defs>
    <linearGradient id="titleInk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffe0ea"/>
      <stop offset=".24" stop-color="#f8a0ba"/>
      <stop offset=".58" stop-color="#b13c62"/>
      <stop offset="1" stop-color="#6f1737"/>
    </linearGradient>
    <linearGradient id="titleStroke" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff1f5"/>
      <stop offset="1" stop-color="#e17998"/>
    </linearGradient>
    <linearGradient id="heartOutline" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffc3d4"/>
      <stop offset="1" stop-color="#9f224d"/>
    </linearGradient>
    <linearGradient id="heartFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd0dd"/>
      <stop offset="1" stop-color="#b42656"/>
    </linearGradient>
    <linearGradient id="lineInk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f4aac1"/>
      <stop offset="1" stop-color="#7b193b"/>
    </linearGradient>
    <radialGradient id="dualGlowPink">
      <stop offset="0" stop-color="#ff95b7" stop-opacity=".23"/>
      <stop offset=".34" stop-color="#f3a1b8" stop-opacity=".08"/>
      <stop offset=".74" stop-color="#ffbdd2" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dualGlowWine">
      <stop offset="0" stop-color="#a72a57" stop-opacity=".22"/>
      <stop offset=".36" stop-color="#c85780" stop-opacity=".07"/>
      <stop offset=".76" stop-color="#bd4b75" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ensoWine" x1="0" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#7b1b3f"/>
      <stop offset=".52" stop-color="#d1668f"/>
      <stop offset="1" stop-color="#f0a1bb"/>
    </linearGradient>
    <filter id="shadowBlur" x="-30%" y="-30%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="glow" x="-30%" y="-30%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2"/></filter>
  </defs>
  <!-- SVG 內的光暈、圓環是作品本體，不是網站背景。 -->
  ${halo}
  ${ring}
  <g filter="url(#shadowBlur)">${glyphs.shadow}</g>
  <g fill="none" opacity=".24" filter="url(#glow)">${glyphs.main}</g>
  <g>${glyphs.main}</g>
  <g>${glyphs.gloss}</g>
  <g>${hearts}</g>
  <g>${scatter}</g>
  <g fill="none" stroke="url(#lineInk)" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round" opacity=".94"><path d="${wave}"/></g>
  <g fill="none" stroke="#ffdce7" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".72"><path d="${wave}"/></g>
</svg>`;
  }

  global.SlowlyHeartVisual = Object.freeze({ createSVG, font: FONT });
})(window);
