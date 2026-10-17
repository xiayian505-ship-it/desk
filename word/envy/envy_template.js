"use strict";
/*
 * 妒火中燒｜毒藤裂鏡 專屬 SVG 模板。
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
    const centerX = w / 2;
    const centerY = h / 2;
    const mirror = tall
      ? "M420 95 L675 226 L725 575 L657 1010 L420 1130 L187 1010 L115 560 L165 224 Z"
      : "M142 190 L390 88 L805 111 L1080 241 L1104 547 L811 651 L365 669 L109 543 Z";
    const shards = Array.from({ length: 23 }, (_, index) => {
      const angle = index * 2.3999;
      const radius = tall ? 345 + (index % 4) * 41 : 465 + (index % 4) * 28;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * (tall ? radius * 1.17 : radius * .52);
      const tilt = index * 37;
      const shade = index % 3 === 0 ? '#a3f15b' : index % 3 === 1 ? '#b64b78' : '#7c8aab';
      return `<path transform="translate(${digits(x)} ${digits(y)}) rotate(${tilt})"
        d="M-13 -37 L15 -6 L2 34 L-20 5 Z" fill="${shade}" fill-opacity=".26"
        stroke="${shade}" stroke-width="1.5" opacity=".9"/>`;
    }).join("\n");
    const vines = Array.from({ length: 4 }, (_, index) => {
      const sign = index % 2 === 0 ? -1 : 1;
      const x = tall ? centerX + sign * (242 + index * 12) : 115 + index * 315;
      const y0 = tall ? 150 : 110;
      const y1 = tall ? 1080 : 670;
      const vine = `M${digits(x)} ${y0} C${digits(x + sign * -99)} ${digits(h * .25)}
        ${digits(x + sign * 108)} ${digits(h * .56)} ${digits(x + sign * -28)} ${y1}`;
      const thorns = Array.from({ length: 8 }, (_, thorn) => {
        const y = y0 + (y1 - y0) * ((thorn + .6) / 9);
        const px = x + Math.sin(thorn * 2 + index) * 29;
        return `<path d="M${digits(px)} ${digits(y)} l${sign * 25} -16 l${-sign * 13} 29 Z"
          fill="#619137" stroke="#b7ed57" stroke-width="1.5" opacity=".75"/>`;
      }).join("\n");
      return `<path d="${vine}" fill="none" stroke="#426936" stroke-width="8" opacity=".8"/>
        <path d="${vine}" fill="none" stroke="#a9eb51" stroke-width="1.8" opacity=".8"/>${thorns}`;
    }).join("\n");
    const eyeY = tall ? 110 : 125;
    const eye = `<g transform="translate(${centerX} ${eyeY})" id="envy-watchful-eye">
      <path d="M-75 0 Q0 -60 75 0 Q0 48 -75 0" fill="#1a122d" stroke="#b8ef69" stroke-width="4"/>
      <ellipse rx="29" ry="31" fill="#6fd044" stroke="#b9f77a" stroke-width="2"/>
      <ellipse rx="12" ry="29" fill="#140f22"/>
      <circle cx="10" cy="-10" r="7" fill="#ffffff" opacity=".8"/>
      ${animated ? `<animateTransform attributeName="transform" type="translate"
        values="${centerX} ${eyeY};${centerX - 10} ${eyeY};${centerX} ${eyeY}"
        dur="7s" repeatCount="indefinite"/>` : ''}
    </g>`;
    return `<defs>
      <linearGradient id="envy-glass" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#291239" stop-opacity=".89"/><stop offset=".5" stop-color="#170d26" stop-opacity=".98"/>
        <stop offset="1" stop-color="#3b1c3f" stop-opacity=".93"/>
      </linearGradient>
      <linearGradient id="envy-toxin" x1="0" y1="0" x2=".8" y2="1">
        <stop stop-color="#eefda4"/><stop offset=".23" stop-color="#aef346"/>
        <stop offset=".57" stop-color="#5a9d37"/><stop offset=".8" stop-color="#d9fd74"/>
        <stop offset="1" stop-color="#356b3b"/>
      </linearGradient>
    </defs>
    <g id="envy-fractured-reflection">
      <path d="M${centerX} 56 L${centerX - 68} ${centerY - 65} L${centerX + 89} ${centerY + 140}
        L${centerX - 124} ${h - 50} M${centerX - 330} ${h * .39} L${centerX + 128} ${h * .52}
        L${centerX + 335} ${h * .30} M${centerX + 270} ${h * .9} L${centerX - 87} ${h * .58}"
        fill="none" stroke="#b9d07c" stroke-width="3.7" opacity=".45"/>
      ${shards}
      ${vines}
      ${eye}
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const tilt = index % 2 === 0 ? -4 : 3;
      const word = xml(character);
      const thorns = Array.from({ length: 3 }, (_, tooth) => {
        const offsetX = x - size * .35 + tooth * size * .34;
        return `<path d="M${digits(offsetX)} ${digits(y - size * .42)}
          l10 -24 l11 21" stroke="#bbfa6a" stroke-width="2.5" fill="none"/>`;
      }).join("\n");
      return `<g id="envy-word-${index}" transform="rotate(${tilt} ${x} ${y})">
        <text x="${x + 6}" y="${y + 11}" font-size="${size}" font-family="${sansFont}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          stroke="#1e0d26" stroke-width="19" fill="#170d1c" paint-order="stroke fill">${word}</text>
        <text x="${x}" y="${y}" font-size="${size}" font-family="${sansFont}"
          font-weight="900" text-anchor="middle" dominant-baseline="middle"
          fill="url(#envy-toxin)" stroke="#532749" stroke-width="9" paint-order="stroke fill">${word}</text>
        <path d="M${x - size * .36} ${y + size * .20} Q${x} ${y - size * .17} ${x + size * .43} ${y + size * .10}"
          fill="none" stroke="#e7ff82" stroke-width="3" opacity=".6"/>
        ${thorns}
        <path d="M${x - size * .45} ${y + size * .36} C${x - size * .1} ${y + size * .18}
          ${x + size * .14} ${y + size * .61} ${x + size * .44} ${y + size * .25}"
          stroke="#a42f68" stroke-width="4" fill="none" opacity=".83"/>
        ${animated ? `<path d="M${x - size * .15} ${y + size * .46} Q${x} ${y + size * .7} ${x + size * .13} ${y + size * .4}"
          fill="#d4ff6d" opacity=".12"><animate attributeName="opacity" values=".12;.78;.12"
          dur="${3.8 + index * .47}s" repeatCount="indefinite"/></path>` : ""}
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
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜妒火中燒">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyEnvyVisual = Object.freeze({ canvas, createSVG });
})(window);
