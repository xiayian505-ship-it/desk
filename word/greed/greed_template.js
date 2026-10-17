"use strict";
/*
 * 欲壑難填｜吞噬深淵 專屬 SVG 模板。
 * 完整、可讀、不壓縮，所有可見圖形均由 SVG 本體產生。
 * 本檔不引用其餘六款藝術字的 SVG 或 JS。
 */
(function (global) {
  const canvas = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });
  const sansFont = 'Noto Sans CJK TC, Noto Sans TC, Microsoft JhengHei, sans-serif';
  const serifFont = 'Noto Serif CJK TC, Source Han Serif TC, PMingLiU, serif';

  function xml(value) {
    return String(value).replace(/[&<>"']/g, symbol => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[symbol]));
  }

  function digits(value) {
    return Number(value.toFixed(2));
  }

  function splitLetters(raw, helpers) {
    const splitter = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const parts = typeof splitter === "function" ? splitter(raw) : Array.from(String(raw || ""));
    return Array.from(parts).slice(0, 4);
  }

  // 1～4 字都使用獨立字位；橫式另作排版，不旋轉直式畫面。
  function slots(count, direction) {
    const total = Math.max(1, Math.min(4, count));
    if (direction === "vertical") {
      const presets = {
        1: { places: [603], size: 305 },
        2: { places: [433, 753], size: 254 },
        3: { places: [354, 600, 847], size: 205 },
        4: { places: [314, 504, 694, 884], size: 176 }
      };
      return presets[total].places.map((y, index) => ({ x: 420, y, size: presets[total].size, index }));
    }
    const presets = {
      1: { places: [600], size: 318 },
      2: { places: [420, 780], size: 270 },
      3: { places: [295, 601, 907], size: 211 },
      4: { places: [219, 471, 729, 981], size: 174 }
    };
    return presets[total].places.map((x, index) => ({ x, y: 385, size: presets[total].size, index }));
  }

  function scene(direction, animated) {
    const tall = direction === "vertical";
    const width = tall ? 840 : 1200;
    const height = tall ? 1200 : 760;
    const cx = width * .5;
    const cy = height * .5;
    const rx = tall ? 310 : 515;
    const ry = tall ? 512 : 287;
    const coils = Array.from({ length: 9 }, (_, ring) => {
      const points = [];
      for (let index = 0; index <= 180; index += 1) {
        const progress = index / 180;
        const angle = progress * Math.PI * (5.2 + ring * .35) + ring * .7;
        const radius = .9 - progress * .73;
        const x = cx + Math.cos(angle) * rx * radius * (1 - ring * .047);
        const y = cy + Math.sin(angle) * ry * radius * (1 - ring * .047);
        points.push(`${index === 0 ? 'M' : 'L'}${digits(x)} ${digits(y)}`);
      }
      return `<path d="${points.join(' ')}" fill="none"
        stroke="${ring % 3 === 0 ? '#c5b172' : ring % 3 === 1 ? '#3c998d' : '#0d645f'}"
        stroke-width="${ring % 3 === 0 ? 2.7 : 4.4}" stroke-linecap="round" opacity="${.38 + ring * .046}">
        ${animated ? `<animate attributeName="stroke-dasharray" values="15 12;53 6;15 12"
          dur="${8 + ring * .5}s" repeatCount="indefinite"/>` : ''}
      </path>`;
    }).join("\n");
    const treasure = Array.from({ length: 25 }, (_, index) => {
      const angle = index * 2.399963;
      const orbit = .48 + ((index * 17) % 11) * .055;
      const x = cx + Math.cos(angle) * rx * orbit;
      const y = cy + Math.sin(angle) * ry * orbit;
      const size = 7 + (index % 5) * 3.7;
      const gem = index % 3 === 0
        ? `<path d="M0 -${size} L${size * .82} 0 L0 ${size} L-${size * .82} 0 Z" fill="#4dd8b5" stroke="#d6f8db" stroke-width="2"/>`
        : `<circle r="${size}" fill="${index % 2 ? '#a48a52' : '#e6c67a'}" stroke="#f7e7ac" stroke-width="2.5"/>
           <circle r="${size * .5}" fill="none" stroke="#5c472b" stroke-width="1.5"/>`;
      return `<g transform="translate(${digits(x)} ${digits(y)})" opacity=".95">
        ${gem}
        ${animated ? `<animateTransform attributeName="transform" additive="sum" type="rotate"
          values="0;360" dur="${10 + index % 4 * 4}s" repeatCount="indefinite"/>` : ''}
      </g>`;
    }).join("\n");
    const outline = tall
      ? "M420 87 Q704 177 740 560 Q718 947 420 1135 Q120 943 100 560 Q130 182 420 87 Z"
      : "M81 380 Q148 114 600 91 Q1052 120 1119 380 Q1050 637 600 667 Q150 637 81 380 Z";
    return `<defs>
      <radialGradient id="greed-pit">
        <stop stop-color="#00080d"/><stop offset=".14" stop-color="#000c14"/>
        <stop offset=".47" stop-color="#073741"/><stop offset=".76" stop-color="#0c3842"/>
        <stop offset="1" stop-color="#05141f"/>
      </radialGradient>
      <linearGradient id="greed-hungry-metal" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#d9f7e7"/><stop offset=".20" stop-color="#72d3c6"/>
        <stop offset=".5" stop-color="#1d746e"/><stop offset=".68" stop-color="#aad6b0"/>
        <stop offset="1" stop-color="#346962"/>
      </linearGradient>
    </defs>
    <g id="greed-bottomless-vault">
      <path d="${outline}" fill="url(#greed-pit)" stroke="#897d56" stroke-width="8"/>
      <path d="${outline}" fill="none" stroke="#d4c380" stroke-width="2" stroke-dasharray="14 11"/>
      ${coils}
      ${treasure}
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * .20}" ry="${ry * .24}"
        fill="#00070e" stroke="#0b655d" stroke-width="13"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * .1}" ry="${ry * .12}"
        fill="#000207" stroke="#bfa76d" stroke-width="1.5" opacity=".7">
        ${animated ? '<animate attributeName="rx" values="20;31;20" dur="8s" repeatCount="indefinite"/>' : ''}
      </ellipse>
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const word = xml(character);
      const focusOffset = direction === 'vertical' ? (index % 2 ? 9 : -9) : (index - 1.5) * -7;
      const actualX = x + focusOffset;
      const actualY = y + (index % 2 ? 6 : -3);
      const innerSlash = `<path d="M${actualX - size * .35} ${actualY - size * .29}
        Q${actualX + size * .1} ${actualY - size * .13} ${actualX + size * .33} ${actualY + size * .43}"
        fill="none" stroke="#d6bf73" stroke-width="2.5" opacity=".73"/>`;
      return `<g id="greed-sinking-word-${index}">
        <text x="${actualX + 11}" y="${actualY + 11}" font-family="${serifFont}" font-weight="900"
          font-size="${size}" dominant-baseline="middle" text-anchor="middle" fill="#00080c"
          stroke="#020a11" stroke-width="24" paint-order="stroke fill">${word}</text>
        <text x="${actualX}" y="${actualY}" font-family="${serifFont}" font-weight="900"
          font-size="${size}" dominant-baseline="middle" text-anchor="middle" fill="url(#greed-hungry-metal)"
          stroke="#133b39" stroke-width="9" paint-order="stroke fill">${word}</text>
        <text x="${actualX}" y="${actualY}" font-family="${serifFont}" font-weight="900"
          font-size="${size}" dominant-baseline="middle" text-anchor="middle" fill="none"
          stroke="#d3bf84" stroke-width="2" opacity=".75">${word}</text>
        ${innerSlash}
        <circle cx="${digits(actualX + size * .36)}" cy="${digits(actualY - size * .39)}" r="6"
          fill="#fff1b5" opacity=".8"/>
        ${animated ? `<animateTransform attributeName="transform" type="translate"
          values="0 -2;0 6;0 -2" dur="${7 + index * .7}s" repeatCount="indefinite"/>` : ''}
      </g>`;
    }).join("\n");
  }

  function createSVG(rawText, orientation = "vertical", helpers, options = {}) {
    const direction = orientation === "horizontal" ? "horizontal" : "vertical";
    const characters = splitLetters(rawText, helpers);
    const positions = slots(characters.length, direction);
    const animated = options.animated === true;
    const size = canvas[direction];

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜欲壑難填">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyGreedVisual = Object.freeze({ canvas, createSVG });
})(window);
