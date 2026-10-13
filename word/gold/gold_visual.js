"use strict";
/* 金碧輝煌｜獨立美術機制。直式與橫式共用浮雕、金砂與輕微字外陰影。 */
(function (global) {
  const TEMPLATE = global.SlowlyGoldTemplate;
  if (typeof TEMPLATE !== "string") {
    throw new Error("金碧輝煌：gold_template.js 必須先載入。");
  }

  const FONT_STACK = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const round = number => Math.round(number * 10) / 10;

  // 確保相同文字每次生成的金砂位置一致，且不依賴隨機外部資源。
  function seededRandom(seed) {
    let value = seed >>> 0;
    return function next() {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function makeGlyphs(slots, escapeXML) {
    return slots.map(({ char, x, y, size, angle }, index) => {
      return `<text id="goldGlyph${index}" x="${round(x)}" y="${round(y)}"
        text-anchor="middle" dominant-baseline="central"
        font-family="${escapeXML(FONT_STACK)}" font-size="${round(size)}" font-weight="800"
        transform="rotate(${angle} ${round(x)} ${round(y)})">${escapeXML(char)}</text>`;
    }).join("\n");
  }

  function makeExtrusion(uses) {
    const depthLayers = [];
    for (let depth = 12; depth >= 2; depth -= 2) {
      const tone = depth > 8 ? "#5e3408" : depth > 4 ? "#8b5914" : "#ba8528";
      depthLayers.push(`<g transform="translate(${round(depth * 0.53)} ${round(depth * 0.88)})"
        fill="url(#sideGold)" stroke="${tone}" stroke-width="4.5"
        stroke-linejoin="round" opacity=".96">${uses}</g>`);
    }
    return depthLayers.join("\n");
  }

  function makeRelief(slots) {
    const lines = [];
    slots.forEach(({ x, y, size }, index) => {
      for (let n = -3; n <= 3; n += 1) {
        const yy = y + n * size * 0.13;
        lines.push(`<path d="M${round(x - size * 0.45)} ${round(yy)}
          Q${round(x - size * 0.06)} ${round(yy - size * 0.12)} ${round(x + size * 0.43)} ${round(yy - size * 0.04)}"
          fill="none" stroke="url(#reliefLine)" stroke-width="${index % 2 ? 2.3 : 1.9}" opacity=".52"/>`);
      }
      lines.push(`<path d="M${round(x - size * 0.44)} ${round(y - size * 0.26)}
        Q${round(x)} ${round(y - size * 0.42)} ${round(x + size * 0.38)} ${round(y - size * 0.2)}"
        fill="none" stroke="#fffce5" stroke-width="3" opacity=".38"/>`);
    });
    return lines.join("\n");
  }

  function makeGoldDust(slots) {
    const dust = [];
    const palette = ["#fffbe3", "#fff1b1", "#ffdf6e", "#f6c34f", "#bd8424", "#ffe79a"];
    slots.forEach(({ char, x, y, size }, index) => {
      const seed = 20261013 + index * 997 + char.codePointAt(0) * 31 + Math.round(size * 17);
      const random = seededRandom(seed);
      const count = 118;
      for (let i = 0; i < count; i += 1) {
        const dx = (random() - .5) * size * 1.04;
        const dy = (random() - .5) * size * 1.08;
        const xPos = x + dx;
        const yPos = y + dy;
        const nearTop = i % 9 === 0;
        const radius = size * (nearTop ? .010 + random() * .0038 : .0028 + random() * .0046);
        const fill = palette[Math.floor(random() * palette.length)];
        const opacity = .43 + random() * .5;
        dust.push(`<circle cx="${round(xPos)}" cy="${round(yPos)}"
          r="${round(radius)}" fill="${fill}" opacity="${round(opacity)}"/>`);
      }
      // 少數極細金砂紋理：亦被字形裁切，絕不形成周邊星光或背景粒子。
      for (let i = 0; i < 15; i += 1) {
        const px = x + (random() - .5) * size * .85;
        const py = y + (random() - .5) * size * .89;
        const length = size * (.012 + random() * .022);
        dust.push(`<path d="M${round(px)} ${round(py)} l${round(length)} ${round(-length * .32)}"
          fill="none" stroke="#fff8d6" stroke-width="${round(size * .0045)}"
          stroke-linecap="round" opacity="${round(.36 + random() * .4)}"/>`);
      }
    });
    return dust.join("\n");
  }

  function renderSVG({ text, slots, width, height, escapeXML }) {
    if (!Array.isArray(slots) || slots.length < 1 || slots.length > 4) {
      throw new Error("金碧輝煌：字數必須為 1～4 字。");
    }
    const glyphs = makeGlyphs(slots, escapeXML);
    const uses = slots.map((_, index) => `<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#goldGlyph${index}"/>`).join("\n");
    const values = {
      WIDTH: width,
      HEIGHT: height,
      TITLE: escapeXML(text),
      DESC: escapeXML(`${text}：立體金色浮雕藝術字，細密金砂藏在燙金筆畫內，字外只有輕微陰影。透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      EXTRUSION: makeExtrusion(uses),
      RELIEF: makeRelief(slots),
      GOLD_DUST: makeGoldDust(slots)
    };
    return TEMPLATE.replace(/@@([A-Z_]+)@@/g, (match, key) => {
      if (!Object.prototype.hasOwnProperty.call(values, key)) {
        throw new Error(`金碧輝煌 SVG 模板缺少替換值：${key}`);
      }
      return String(values[key]);
    });
  }

  global.SlowlyGoldVisual = Object.freeze({ renderSVG });
})(window);
