"use strict";
/*
 * 唯我獨尊｜冷冕高台 專屬 SVG 模板。
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
    const w = tall ? 840 : 1200;
    const h = tall ? 1200 : 760;
    const left = tall ? 114 : 66;
    const right = w - left;
    const middle = w / 2;
    const top = tall ? 74 : 92;
    const bottom = tall ? 1118 : 675;
    const archPath = tall
      ? "M145 106 L420 49 L695 106 L725 991 Q714 1110 420 1163 Q126 1110 115 991 Z"
      : "M65 288 Q150 88 600 72 Q1050 88 1135 288 L1135 584 Q1110 675 600 685 Q90 675 65 584 Z";
    const rays = Array.from({ length: 27 }, (_, index) => {
      const angle = (index / 26) * Math.PI + Math.PI;
      const origin = tall ? { x: middle, y: 288 } : { x: middle, y: 310 };
      const radius = tall ? 570 : 530;
      const outerX = origin.x + Math.cos(angle) * radius;
      const outerY = origin.y + Math.sin(angle) * radius;
      return `<path d="M${digits(origin.x)} ${digits(origin.y)} L${digits(outerX)} ${digits(outerY)}"
        fill="none" stroke="#d1c386" stroke-width="${index % 4 === 0 ? 2.5 : 0.8}"
        opacity="${index % 4 === 0 ? 0.34 : 0.15}"/>`;
    }).join("\n");
    const crownY = tall ? 133 : 128;
    const crown = `<g transform="translate(${middle} ${crownY})">
      <path d="M-94 30 L-113 -33 L-57 0 L-25 -65 L0 -11 L25 -65 L57 0 L113 -33 L94 30 Z"
        fill="url(#pride-crown-metal)" stroke="#fff6d5" stroke-width="3.5"/>
      <path d="M-95 25 Q0 49 95 25 L89 56 Q0 75 -89 56 Z" fill="#91804f" stroke="#f1e5ae" stroke-width="3"/>
      <path d="M0 -66 L10 -36 L0 -16 L-10 -36 Z" fill="#e9faff" stroke="#abcaec"/>
      <circle cx="-55" cy="3" r="7" fill="#deefff"/><circle cx="55" cy="3" r="7" fill="#deefff"/>
      ${animated ? `<animateTransform attributeName="transform" type="translate"
        values="${middle} ${crownY};${middle} ${crownY - 8};${middle} ${crownY}"
        dur="5s" repeatCount="indefinite"/>` : ""}
    </g>`;
    const spires = (tall ? [170, 670] : [135, 1065]).map((x, index) => {
      const y = tall ? 480 : 382;
      return `<g opacity=".8"><path d="M${x - 23} ${y + 220} V${y - 112} L${x} ${y - 182} L${x + 23} ${y - 112} V${y + 220}"
        fill="#151f41" stroke="#9a9aa6" stroke-width="2.3"/>
        <path d="M${x} ${y - 157} V${y + 182}" stroke="#e6dca8" stroke-width="2" opacity=".54"/>
        <path d="M${x - 30} ${y + 214} H${x + 30}" stroke="#b19c5d" stroke-width="7"/></g>`;
    }).join("\n");
    return `<defs>
      <linearGradient id="pride-palace" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#323a68"/><stop offset=".45" stop-color="#101831"/><stop offset="1" stop-color="#283656"/>
      </linearGradient>
      <linearGradient id="pride-crown-metal" x1="0" y1="0" x2="1" y2=".8">
        <stop stop-color="#fff9e0"/><stop offset=".32" stop-color="#d5c089"/><stop offset=".66" stop-color="#8c7450"/><stop offset="1" stop-color="#fbf2c5"/>
      </linearGradient>
      <linearGradient id="pride-glyph" x1="0" y1="0" x2=".75" y2="1">
        <stop stop-color="#fffdf0"/><stop offset=".21" stop-color="#f7f8fc"/>
        <stop offset=".52" stop-color="#9ea6c1"/><stop offset=".69" stop-color="#f7f3da"/>
        <stop offset="1" stop-color="#8c8fa8"/>
      </linearGradient>
      <filter id="pride-engrave-shadow" x="-20%" y="-20%" width="140%" height="150%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
    </defs>
    <g id="pride-radiant-architecture">
      <path d="${archPath}" fill="url(#pride-palace)" stroke="#101634" stroke-width="15"/>
      ${rays}
      <path d="${archPath}" fill="none" stroke="#e7d8ae" stroke-width="4" opacity=".89"/>
      <path d="${archPath}" fill="none" stroke="#a9bfd4" stroke-width="1.1" transform="translate(0 13)" opacity=".4"/>
      ${spires}
      ${crown}
      <path d="M${middle - (tall ? 115 : 177)} ${bottom - 10} L${middle + (tall ? 115 : 177)} ${bottom - 10}
        L${middle + (tall ? 150 : 207)} ${bottom + 18} L${middle - (tall ? 150 : 207)} ${bottom + 18} Z"
        fill="#d2c397" stroke="#fff5d1" stroke-width="4"/>
      <path d="M${middle - 48} ${bottom - 32} H${middle + 48}"
        stroke="#fff6cf" stroke-width="4" opacity=".9"/>
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const letter = xml(character);
      const baseline = digits(y + size * 0.036);
      const focus = `<text x="${x}" y="${baseline}" font-family="${serifFont}"
        font-size="${size}" font-weight="900" text-anchor="middle" dominant-baseline="middle">${letter}</text>`;
      const gleam = animated ? `<path d="M${x - size * .42} ${y - size * .59} L${x + size * .45} ${y + size * .48}"
        stroke="#ffffff" stroke-width="5" opacity=".65">
        <animate attributeName="opacity" values=".13;.67;.13" dur="5s" begin="${index * .42}s" repeatCount="indefinite"/>
      </path>` : "";
      return `<g id="pride-letter-${index}">
        <text x="${x + 8}" y="${baseline + 12}" font-family="${serifFont}"
          font-size="${size}" font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="#080c28" stroke="#070a1b" stroke-width="18" opacity=".8">${letter}</text>
        <text x="${x}" y="${baseline}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="url(#pride-glyph)" stroke="#332b3b" stroke-width="8" paint-order="stroke fill">${letter}</text>
        <text x="${x}" y="${baseline}" font-family="${serifFont}" font-size="${size}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="none" stroke="#e7d8aa" stroke-width="2" opacity=".78">${letter}</text>
        <path d="M${x - size * .37} ${y - size * .51} L${x - size * .29} ${y - size * .65}
           L${x - size * .21} ${y - size * .51}" fill="none" stroke="#f6e7aa" stroke-width="2.1"/>
        ${gleam}
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
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜唯我獨尊">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyPrideVisual = Object.freeze({ canvas, createSVG });
})(window);
