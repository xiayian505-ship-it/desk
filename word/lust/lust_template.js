"use strict";
/*
 * 色令智昏｜迷離綢幕 專屬 SVG 模板。
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
    const cx = width / 2;
    const cy = height / 2;
    const xLeft = tall ? 97 : 50;
    const xRight = width - xLeft;
    const yTop = tall ? 80 : 88;
    const yBottom = tall ? 1115 : 676;
    const flowingVeils = Array.from({ length: 6 }, (_, index) => {
      const fraction = (index + 1) / 7;
      const startX = xLeft + (xRight - xLeft) * fraction;
      const endX = xRight - (xRight - xLeft) * fraction * .48;
      const middleX = cx + (index - 2.5) * (tall ? 43 : 69);
      const thickness = 31 + index % 3 * 14;
      const colors = ['#f5a6cb', '#7e73bb', '#ad4b98', '#ffe0d0', '#65538f', '#db6fa7'];
      return `<path id="lust-silk-ribbon-${index}"
        d="M${digits(startX)} ${yTop} C${digits(startX + 130)} ${digits(cy * .62)}
          ${digits(middleX - 180)} ${digits(cy * 1.14)} ${digits(middleX)} ${digits(cy)}
          S${digits(endX + 85)} ${digits(yBottom * .78)} ${digits(endX)} ${yBottom}"
        fill="none" stroke="${colors[index]}" stroke-width="${thickness}"
        stroke-linecap="round" opacity="${.17 + index % 3 * .07}">
        ${animated ? `<animate attributeName="opacity" values="${.13 + index % 3 * .05};.46;${.13 + index % 3 * .05}"
          dur="${7 + index * .65}s" repeatCount="indefinite"/>` : ''}
      </path>`;
    }).join("\n");
    const curtain = tall
      ? "M100 136 Q270 27 421 124 Q565 29 742 136 L705 1000 Q540 1162 420 1100 Q290 1164 134 998 Z"
      : "M77 171 Q305 28 602 118 Q901 25 1123 172 L1100 606 Q894 715 601 634 Q317 722 96 601 Z";
    const petals = Array.from({ length: 24 }, (_, index) => {
      const angle = index * 2.39996;
      const radiusX = tall ? 295 : 509;
      const radiusY = tall ? 475 : 263;
      const x = cx + Math.cos(angle) * radiusX;
      const y = cy + Math.sin(angle) * radiusY;
      const rot = digits(angle * 180 / Math.PI);
      return `<path transform="translate(${digits(x)} ${digits(y)}) rotate(${rot})"
        d="M0 -13 Q11 -6 4 12 Q-11 5 0 -13" fill="${index % 2 ? '#ffb0d0' : '#f4d6ef'}"
        opacity="${.39 + index % 4 * .10}"/>
      `;
    }).join("\n");
    const eyeY = tall ? 164 : 156;
    const mask = `<g id="lust-bewitching-gaze" opacity=".9">
      <path d="M${cx - 110} ${eyeY} Q${cx - 45} ${eyeY - 65} ${cx} ${eyeY - 10}
        Q${cx + 55} ${eyeY - 65} ${cx + 110} ${eyeY}"
        stroke="#f1a1ca" stroke-width="6" fill="none"/>
      <path d="M${cx - 83} ${eyeY + 9} Q${cx} ${eyeY + 55} ${cx + 83} ${eyeY + 9}"
        stroke="#c36baf" stroke-width="3.5" fill="none" opacity=".72"/>
      <circle cx="${cx}" cy="${eyeY + 13}" r="11" fill="#fcd2e2" opacity=".82"/>
    </g>`;
    return `<defs>
      <linearGradient id="lust-night-canvas" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#332049" stop-opacity=".94"/>
        <stop offset=".5" stop-color="#20142f" stop-opacity=".98"/>
        <stop offset="1" stop-color="#532b5d" stop-opacity=".91"/>
      </linearGradient>
      <linearGradient id="lust-velvet-rose" x1="0" y1="0" x2=".83" y2="1">
        <stop stop-color="#fff0ed"/><stop offset=".21" stop-color="#efbad7"/>
        <stop offset=".51" stop-color="#c46fab"/><stop offset=".78" stop-color="#efd0e3"/>
        <stop offset="1" stop-color="#a24e99"/>
      </linearGradient>
      <filter id="lust-silk-softening" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="7"/>
      </filter>
    </defs>
    <g id="lust-curtains-and-gaze">
      <path d="${curtain}" fill="url(#lust-night-canvas)" stroke="#654274" stroke-width="11"/>
      <path d="${curtain}" fill="none" stroke="#cf8abe" stroke-width="2.4" opacity=".8"/>
      ${flowingVeils}
      ${petals}
      ${mask}
      <path d="M${xLeft + 14} ${yBottom - 49} Q${cx} ${yBottom + 26} ${xRight - 14} ${yBottom - 49}"
        fill="none" stroke="#e8a5d2" stroke-width="3.3" opacity=".57"/>
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const letter = xml(character);
      const rotation = index % 2 === 0 ? -2 : 3;
      const sheen = `<path d="M${x - size * .36} ${y - size * .38} Q${x - size * .05} ${y - size * .56}
        ${x + size * .39} ${y + size * .26}" stroke="#ffe2f6" fill="none" stroke-width="7"
        opacity=".43" filter="url(#lust-silk-softening)"/>`;
      return `<g id="lust-silk-letter-${index}" transform="rotate(${rotation} ${x} ${y})">
        <text x="${x + 5}" y="${y + 9}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="#1a0b29" stroke="#190b27" stroke-width="20" paint-order="stroke fill">${letter}</text>
        <text x="${x}" y="${y}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="url(#lust-velvet-rose)" stroke="#552b65" stroke-width="8" paint-order="stroke fill">${letter}</text>
        ${sheen}
        <path d="M${x - size * .34} ${y + size * .42} Q${x} ${y + size * .64}
          ${x + size * .38} ${y + size * .37}" fill="none" stroke="#f2aed6"
          stroke-width="4" opacity=".57"/>
        ${animated ? `<path d="M${x - size * .44} ${y - size * .55} L${x + size * .47} ${y + size * .35}"
          stroke="#fff2fd" stroke-width="3.5" opacity=".16">
          <animate attributeName="opacity" values=".16;.84;.16" dur="${6 + index * .43}s" repeatCount="indefinite"/>
        </path>` : ''}
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
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜色令智昏">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyLustVisual = Object.freeze({ canvas, createSVG });
})(window);
