"use strict";
/*
 * 饕餮盛宴｜過量盛宴 專屬 SVG 模板。
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
    const rx = tall ? 336 : 550;
    const ry = tall ? 525 : 300;
    const serving = tall
      ? "M420 60 Q699 60 749 394 L749 833 Q700 1132 420 1140 Q141 1132 91 833 L91 394 Q141 60 420 60 Z"
      : "M600 77 Q1053 77 1142 285 L1142 491 Q1053 684 600 685 Q146 684 58 491 L58 285 Q146 77 600 77 Z";
    const bronzeFret = Array.from({ length: 40 }, (_, index) => {
      const angle = index / 40 * 2 * Math.PI;
      const x = cx + Math.cos(angle) * rx * .94;
      const y = cy + Math.sin(angle) * ry * .91;
      const rotation = digits(angle * 180 / Math.PI + 90);
      return `<path transform="translate(${digits(x)} ${digits(y)}) rotate(${rotation})"
        d="M-12 0 H12 V9 H1 V-3 H-7 V6" stroke="#b68a50" stroke-width="2.3"
        fill="none" opacity=".75"/>`;
    }).join("\n");
    const banquetMarks = Array.from({ length: 19 }, (_, index) => {
      const a = index * 2.39996;
      const x = cx + Math.cos(a) * rx * .77;
      const y = cy + Math.sin(a) * ry * .75;
      return `<g transform="translate(${digits(x)} ${digits(y)})" opacity=".8">
        <path d="M0 -11 Q9 -5 11 1 Q3 9 0 15 Q-7 4 -11 1 Q-7 -4 0 -11"
          fill="${index % 3 === 0 ? '#cf6f3d' : index % 3 === 1 ? '#d7b77b' : '#76a58d'}"
          stroke="#f6dfb0" stroke-width="1.4"/>
      </g>`;
    }).join("\n");
    const goblets = [tall ? 117 : 120, tall ? 722 : 1080].map((x, index) => {
      const y = tall ? 560 : 392;
      const dir = index === 0 ? -1 : 1;
      return `<g transform="translate(${x} ${y})" opacity=".94">
        <path d="M-31 -62 L31 -62 Q24 -4 0 3 Q-24 -4 -31 -62 Z" fill="#82243a"
          stroke="#d8b37c" stroke-width="4"/>
        <path d="M-25 -45 Q0 -53 25 -45" stroke="#edbb75" stroke-width="4" fill="none"/>
        <path d="M0 5 V60 M-22 64 H22" stroke="#c5a06b" stroke-width="5" fill="none"/>
        <path d="M${dir * -23} -90 Q${dir * 10} -113 0 -138" fill="none" stroke="#e9d9ad"
          stroke-width="3" opacity=".52"/>
      </g>`;
    }).join("\n");
    const steamLines = Array.from({ length: 7 }, (_, index) => {
      const x = cx - 225 + 75 * index;
      const y = tall ? 199 : 173;
      return `<g id="gluttony-aromatic-steam-${index}">
        <path d="M${x} ${y + 88} C${x - 25} ${y + 49} ${x + 29} ${y + 24} ${x} ${y - 10}
          S${x + 16} ${y - 67} ${x} ${y - 87}" stroke="#fae2bc" stroke-width="${index % 2 ? 4.3 : 3}"
          fill="none" opacity=".36"/>
        ${animated ? `<animateTransform attributeName="transform" type="translate"
          values="0 10;0 -22;0 10" dur="${5 + index % 4}s" repeatCount="indefinite"/>` : ""}
      </g>`;
    }).join("\n");
    return `<defs>
      <linearGradient id="gluttony-banquet-plate" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#8b2943"/><stop offset=".39" stop-color="#4e162d"/>
        <stop offset=".66" stop-color="#651d36"/><stop offset="1" stop-color="#2c1b30"/>
      </linearGradient>
      <linearGradient id="gluttony-honey-letter" x1="0" y1="0" x2=".72" y2="1">
        <stop stop-color="#fff1bc"/><stop offset=".26" stop-color="#f7c977"/>
        <stop offset=".58" stop-color="#c28342"/><stop offset=".78" stop-color="#f3bf65"/>
        <stop offset="1" stop-color="#a55b39"/>
      </linearGradient>
    </defs>
    <g id="gluttony-banquet-scene">
      <path d="${serving}" fill="url(#gluttony-banquet-plate)" stroke="#51301f" stroke-width="20"/>
      <path d="${serving}" fill="none" stroke="#d3ae7b" stroke-width="8" opacity=".9"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * .79}" ry="${ry * .72}"
        fill="none" stroke="#527d6d" stroke-width="10" opacity=".7"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * .74}" ry="${ry * .69}"
        fill="none" stroke="#d9b17f" stroke-width="3" stroke-dasharray="3 11" opacity=".85"/>
      ${bronzeFret}
      ${banquetMarks}
      ${goblets}
      ${steamLines}
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const word = xml(character);
      const apron = `<path d="M${x - size * .32} ${y + size * .40}
        Q${x - size * .19} ${y + size * .62} ${x - size * .09} ${y + size * .49}
        Q${x + size * .03} ${y + size * .59} ${x + size * .15} ${y + size * .45}
        Q${x + size * .29} ${y + size * .65} ${x + size * .32} ${y + size * .39}"
        fill="none" stroke="#efb55e" stroke-width="${size * .06}" stroke-linecap="round"/>
        <circle cx="${digits(x - size * .18)}" cy="${digits(y + size * .60)}" r="${digits(size * .045)}"
          fill="#eeba65"/>`;
      return `<g id="gluttony-feast-letter-${index}">
        <text x="${x + 8}" y="${y + 11}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="#320b1a" stroke="#330c1b" stroke-width="20" paint-order="stroke fill">${word}</text>
        <text x="${x}" y="${y}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="url(#gluttony-honey-letter)" stroke="#5e2c30" stroke-width="8" paint-order="stroke fill">${word}</text>
        <text x="${x}" y="${y}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="none" stroke="#fff5c6" stroke-width="1.9" opacity=".68">${word}</text>
        ${apron}
        <path d="M${x - size * .35} ${y - size * .50} Q${x} ${y - size * .69}
          ${x + size * .35} ${y - size * .50}" fill="none" stroke="#a3ae85"
          stroke-width="4" opacity=".78"/>
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
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜饕餮盛宴">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyGluttonyVisual = Object.freeze({ canvas, createSVG });
})(window);
