"use strict";
/*
 * 怒焰沖天｜爆裂衝擊 專屬 SVG 模板。
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
    const cx = tall ? 420 : 600;
    const cy = tall ? 598 : 384;
    const spreadX = tall ? 346 : 535;
    const spreadY = tall ? 500 : 300;
    const shock = Array.from({ length: 38 }, (_, index) => {
      const angle = index * (Math.PI * 2 / 38) - Math.PI / 2;
      const inner = .56 + ((index * 13) % 11) / 50;
      const outer = 1.02 + ((index * 7) % 13) / 44;
      const x1 = cx + Math.cos(angle) * spreadX * inner;
      const y1 = cy + Math.sin(angle) * spreadY * inner;
      const x2 = cx + Math.cos(angle) * spreadX * outer;
      const y2 = cy + Math.sin(angle) * spreadY * outer;
      const color = index % 5 ? '#ed5736' : '#ffd666';
      return `<path d="M${digits(x1)} ${digits(y1)} L${digits(x2)} ${digits(y2)}" fill="none"
        stroke="${color}" stroke-width="${index % 6 === 0 ? 12 : 3.6}" opacity="${index % 4 === 0 ? .86 : .59}"/>`;
    }).join("\n");
    const blades = Array.from({ length: 19 }, (_, index) => {
      const angle = (index * 137.508) * Math.PI / 180;
      const radial = .77 + (index % 6) * .065;
      const x = cx + Math.cos(angle) * spreadX * radial;
      const y = cy + Math.sin(angle) * spreadY * radial;
      const rotation = angle * 180 / Math.PI;
      return `<g transform="translate(${digits(x)} ${digits(y)}) rotate(${digits(rotation)})">
        <path d="M-8 -19 L20 0 L-8 20 L-1 0 Z" fill="${index % 3 ? '#ad2622' : '#ffbb48'}"
          stroke="#ffce78" stroke-width="1.7" opacity=".86"/>
        ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;15 0;0 0" dur="${2.3 + index % 6 * .43}s" repeatCount="indefinite"/>` : ""}
      </g>`;
    }).join("\n");
    // 鋸齒狀熔岩爆心，不使用封閉的徽章／盾牌構圖。
    const blastShape = Array.from({ length: 30 }, (_, index) => {
      const angle = index / 30 * Math.PI * 2 - Math.PI / 2;
      const jagged = .68 + ((index * 7) % 8) * .065;
      const px = cx + Math.cos(angle) * spreadX * jagged;
      const py = cy + Math.sin(angle) * spreadY * jagged;
      return `${index === 0 ? 'M' : 'L'}${digits(px)} ${digits(py)}`;
    }).join(' ') + ' Z';
    return `<defs>
      <radialGradient id="wrath-pressure-core">
        <stop stop-color="#ae2920" stop-opacity=".93"/><stop offset=".50" stop-color="#561018" stop-opacity=".98"/>
        <stop offset="1" stop-color="#1b080d" stop-opacity=".99"/>
      </radialGradient>
      <linearGradient id="wrath-ignited-metal" x1="0" y1="0" x2=".85" y2="1">
        <stop stop-color="#ffed85"/><stop offset=".23" stop-color="#ff9d39"/>
        <stop offset=".5" stop-color="#d93d20"/><stop offset=".73" stop-color="#ffb046"/>
        <stop offset="1" stop-color="#6e1520"/>
      </linearGradient>
    </defs>
    <g id="wrath-detonation">
      ${shock}
      <path d="${blastShape}" fill="url(#wrath-pressure-core)" stroke="#1d050b" stroke-width="11"/>
      <path d="${blastShape}" fill="none" stroke="#ff7a32" stroke-width="3.5" opacity=".88"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${spreadX * .81}" ry="${spreadY * .75}"
        fill="none" stroke="#ff8b46" stroke-width="18" opacity=".15"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${spreadX * .92}" ry="${spreadY * .86}"
        fill="none" stroke="#eac15f" stroke-width="4" stroke-dasharray="36 21" opacity=".58">
        ${animated ? '<animate attributeName="stroke-dashoffset" values="0;114" dur="2.4s" repeatCount="indefinite"/>' : ''}
      </ellipse>
      ${blades}
      <path d="M${cx - 28} ${cy - spreadY} L${cx + 20} ${cy - spreadY * .68} L${cx - 7} ${cy - spreadY * .37}"
        fill="none" stroke="#fff1a7" stroke-width="8" opacity=".65"/>
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const letter = xml(character);
      const slip = index % 2 === 0 ? -4 : 4;
      const fissures = Array.from({ length: 3 }, (_, chip) => {
        const px = x - size * .35 + chip * size * .34;
        const py = y + (chip - 1) * size * .2;
        return `<path d="M${digits(px)} ${digits(py - 21)} l13 20 l-12 15 l21 23"
          fill="none" stroke="#ffe99a" stroke-width="${chip === 1 ? 5 : 3}" opacity=".82"/>`;
      }).join("\n");
      return `<g id="wrath-riven-letter-${index}" transform="skewX(${slip})">
        <text x="${x + 9}" y="${y + 13}" font-family="${sansFont}" font-weight="900" font-size="${size}"
          text-anchor="middle" dominant-baseline="middle" fill="#170909"
          stroke="#100508" stroke-width="21" paint-order="stroke fill">${letter}</text>
        <text x="${x}" y="${y}" font-family="${sansFont}" font-weight="900" font-size="${size}"
          text-anchor="middle" dominant-baseline="middle" fill="url(#wrath-ignited-metal)"
          stroke="#49151a" stroke-width="10" paint-order="stroke fill">${letter}</text>
        <path d="M${x - size * .46} ${y + size * .51} L${x - size * .31} ${y + size * .33}
          L${x - size * .11} ${y + size * .55} L${x + size * .08} ${y + size * .24}
          L${x + size * .34} ${y + size * .52}" fill="none" stroke="#ffca58" stroke-width="6"/>
        ${fissures}
        ${animated ? `<path d="M${x - size * .4} ${y - size * .45} L${x + size * .35} ${y + size * .45}"
          fill="none" stroke="#fff5aa" stroke-width="5" opacity=".14">
          <animate attributeName="opacity" values=".14;.73;.14" dur="${1.7 + index * .2}s" repeatCount="indefinite"/>
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
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜怒焰沖天">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyWrathVisual = Object.freeze({ canvas, createSVG });
})(window);
