"use strict";
/*
 * 唯我獨尊｜高位孤冕（第二版）— 本款完全獨立的 SVG 構圖與材質。
 *
 * 視覺核心：不是「文字貼在王座底板」，而是字形本身構成冷白金的高塔。
 * 第一個字俯視其他字；其餘字漸小、漸低，形成不可逆的權力落差。
 * 空白是作品的一部分：沒有填滿畫面的盾形、圓盤或底部色塊。
 * 每一款七宗罪只使用自己的 SVG 繪圖檔；此檔不引用其他作品的模板。
 */
(function (global) {
  const CANVAS = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });

  // 匯出 SVG 使用系統合法字型，由瀏覽器選擇可用的中文字型。
  const LETTER_FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Noto Serif TC", "PMingLiU", serif';
  const DARK_BLUE = "#141a3c";
  const SHADOW_BLUE = "#10152e";
  const SILVER = "#f5f9ff";
  const FROST_GOLD = "#e7d69a";

  const round = number => Number(number.toFixed(2));

  function escapeXML(value) {
    return String(value).replace(/[&<>"']/g, symbol => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;"
    }[symbol]));
  }

  function charactersOf(text, helpers) {
    const split = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const characters = typeof split === "function" ? split(text) : Array.from(String(text || ""));
    return Array.from(characters).slice(0, 4);
  }

  // 每種字數都有自己的一組比例。若文字裡包含「我」，則由「我」站上最高位並戴上王冠。
  function letterPositions(letters, direction) {
    const total = Math.max(1, Math.min(4, letters.length || 0));
    const dominantIndex = letters.indexOf("我") >= 0 ? letters.indexOf("我") : 0;

    const verticalPresets = {
      1: {
        0: [[420, 614, 345]]
      },
      2: {
        0: [[393, 450, 314], [478, 850, 248]],
        1: [[336, 470, 236], [452, 580, 332]]
      },
      3: {
        0: [[370, 356, 280], [426, 665, 245], [495, 952, 210]],
        1: [[308, 404, 218], [440, 533, 314], [508, 890, 214]],
        2: [[316, 355, 216], [392, 672, 248], [493, 566, 308]]
      },
      4: {
        0: [[330, 320, 262], [392, 560, 228], [463, 794, 204], [528, 1008, 180]],
        1: [[296, 352, 184], [434, 514, 318], [478, 792, 224], [523, 1016, 194]],
        2: [[294, 304, 186], [361, 540, 214], [486, 520, 314], [542, 958, 196]],
        3: [[296, 290, 182], [360, 512, 212], [436, 740, 228], [548, 604, 310]]
      }
    };

    const horizontalPresets = {
      1: {
        0: [[602, 446, 412]]
      },
      2: {
        0: [[354, 362, 350], [858, 502, 272]],
        1: [[332, 430, 238], [710, 360, 352]]
      },
      3: {
        0: [[255, 330, 306], [633, 426, 255], [968, 526, 220]],
        1: [[212, 430, 222], [546, 346, 328], [929, 470, 230]],
        2: [[214, 332, 218], [512, 456, 246], [848, 344, 324]]
      },
      4: {
        0: [[198, 307, 274], [486, 396, 246], [758, 468, 215], [1025, 523, 187]],
        1: [[182, 414, 188], [438, 315, 322], [738, 426, 234], [1001, 512, 196]],
        2: [[176, 318, 188], [412, 422, 218], [706, 318, 320], [997, 492, 198]],
        3: [[182, 300, 184], [406, 404, 214], [670, 484, 232], [956, 324, 320]]
      }
    };

    const family = direction === "vertical" ? verticalPresets : horizontalPresets;
    const variants = family[total] || family[1];
    const selected = variants[dominantIndex] || variants[0];
    return selected.map(([x, y, size], index) => ({ x, y, size, index, dominant: index === dominantIndex }));
  }

  function defs() {
    return `<defs>
      <!-- 冷白銀像刀鋒一樣穿過金屬正面；霜金只留在細節。 -->
      <linearGradient id="pride-front-metal" x1="7%" y1="0%" x2="89%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="15%" stop-color="#e4eefa"/>
        <stop offset="32%" stop-color="#a9b5d3"/>
        <stop offset="41%" stop-color="#fcffff"/>
        <stop offset="61%" stop-color="#c9c9d8"/>
        <stop offset="70%" stop-color="#fff5d5"/>
        <stop offset="100%" stop-color="#7885a8"/>
      </linearGradient>
      <linearGradient id="pride-cut-depth" x1="0%" y1="0%" x2="100%" y2="95%">
        <stop offset="0%" stop-color="#7785aa"/>
        <stop offset="42%" stop-color="#323a74"/>
        <stop offset="100%" stop-color="#17132e"/>
      </linearGradient>
      <linearGradient id="pride-crown-wire" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffffa"/>
        <stop offset="38%" stop-color="#dfc783"/>
        <stop offset="73%" stop-color="#f0f5ff"/>
        <stop offset="100%" stop-color="#a29176"/>
      </linearGradient>
      <linearGradient id="pride-beam" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f9f2ca" stop-opacity=".85"/>
        <stop offset="35%" stop-color="#b4c1e1" stop-opacity=".42"/>
        <stop offset="100%" stop-color="#d8e6ff" stop-opacity="0"/>
      </linearGradient>
      <filter id="pride-shadow" x="-40%" y="-40%" width="185%" height="195%">
        <feGaussianBlur stdDeviation="4.1"/>
      </filter>
      <filter id="pride-highlight-bloom" x="-90%" y="-90%" width="280%" height="280%">
        <feGaussianBlur stdDeviation="3"/>
      </filter>
    </defs>`;
  }

  // 絲線般的尖拱只在首字上方形成殘影，沒有圍出任何封閉的「背板」。
  function crown(position, direction, animated) {
    const crownX = position.x - position.size * 0.09;
    const crownY = position.y - position.size * (direction === "vertical" ? 0.87 : 0.84)
      + (direction === "vertical" ? 43 : 62 + (position.size > 300 ? 20 : 0));
    const scale = Math.min(1.14, position.size / 272);
    const entering = animated ? `<animateTransform attributeName="transform" type="translate"
      values="0 0;0 -7;0 0" dur="5.8s" repeatCount="indefinite"/>` : "";
    const wire = `<g id="pride-floating-crown" transform="translate(${round(crownX)} ${round(crownY)}) scale(${round(scale)})">
      <g>
        ${entering}
        <g transform="rotate(-9)">
        <!-- 真正懸空的鏤空王冕：不使用實心盾底或皇冠底板。 -->
        <path d="M-94 6 L-109 -58 L-60 -24 L-27 -95 L0 -37 L27 -95 L61 -24 L109 -58 L93 6"
          stroke="#22254b" stroke-width="12" stroke-linejoin="round" fill="none" opacity=".93"/>
        <path d="M-94 6 L-109 -58 L-60 -24 L-27 -95 L0 -37 L27 -95 L61 -24 L109 -58 L93 6"
          stroke="url(#pride-crown-wire)" stroke-width="6.5" stroke-linejoin="round" fill="none"/>
        <path d="M-91 16 Q0 32 93 16" stroke="#22254b" stroke-width="11" fill="none" stroke-linecap="round"/>
        <path d="M-91 16 Q0 32 93 16" stroke="#fbf8e6" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M-85 29 Q0 43 88 29" stroke="#a5aec6" stroke-width="2" fill="none"/>
        <path d="M0 -94 L12 -71 L0 -47 L-12 -71 Z" fill="#f3fdff" stroke="#c9b879" stroke-width="2.7"/>
        <path d="M-27 -95 L-27 -111 M27 -95 L27 -111"
          stroke="#eae0b7" stroke-width="2" stroke-linecap="round"/>
        <circle cx="-60" cy="-24" r="5" fill="#dfeeff"/>
        <circle cx="61" cy="-24" r="5" fill="#dfeeff"/>
        </g>
      </g>
    </g>`;
    return wire;
  }

  // 尖形視線像由王冕向下俯瞰；只留下稀疏開放的直線，不填充大面積背景。
  function shafts(position, direction, animated) {
    const vertical = direction === "vertical";
    const originY = position.y - position.size * .97;
    const axisX = position.x;
    const span = vertical ? 252 : 258;
    const paths = [-1, 1].map((sign, i) => {
      const firstX = axisX + sign * (span * 0.46);
      const topX = axisX + sign * (span * 0.17);
      const endX = axisX + sign * (span * (vertical ? 0.78 : 0.62));
      const endY = position.y + position.size * (vertical ? 1.12 : .86);
      return `<path d="M${round(topX)} ${round(originY + 6)} L${round(firstX)} ${round(originY + 55)} L${round(endX)} ${round(endY)}"
        fill="none" stroke="url(#pride-beam)" stroke-width="${i === 0 ? 4 : 3.1}" opacity=".86"/>
      <path d="M${round(topX + sign * 11)} ${round(originY + 28)} L${round(firstX + sign * 18)} ${round(originY + 78)}"
        fill="none" stroke="#8272a0" stroke-width="1.7" opacity=".67"/>`;
    });
    const axis = `<path d="M${round(axisX)} ${round(originY + 26)} L${round(axisX)} ${round(position.y - position.size * .49)}"
      stroke="#fef8e1" stroke-width="1.25" stroke-dasharray="2 11" opacity=".76"/>`;
    const mark = animated ? `<circle cx="${round(axisX)}" cy="${round(originY + 26)}" r="3.1" fill="#ffffff">
      <animate attributeName="opacity" values=".4;1;.4" dur="4.8s" repeatCount="indefinite"/>
    </circle>` : "";
    return `<g id="pride-open-light-rays">${paths.join("\n")}${axis}${mark}</g>`;
  }

  // 在文字之間而不是文字下方繪出斷裂的「光階」：只剩細小金線，不形成平台塊。
  function floatingTreads(positions, direction, animated) {
    const isVertical = direction === "vertical";
    return positions.map((slot, index) => {
      if (index === 0) return "";
      const prev = positions[index - 1];
      const x = isVertical ? slot.x - slot.size * .66 : (prev.x + slot.x) / 2;
      const y = isVertical ? (prev.y + slot.y) / 2 : Math.min(prev.y, slot.y) - 50;
      const length = isVertical ? 36 - index * 6 : 27 - index * 3;
      const line = `<path d="M${round(x - length)} ${round(y + 12)} L${round(x)} ${round(y + 12)} L${round(x + 17)} ${round(y - 3)}"
        fill="none" stroke="#e9dca9" stroke-width="2.2" opacity="${round(.66 - index * .08)}" stroke-linecap="square"/>
      <path d="M${round(x - length + 7)} ${round(y + 20)} L${round(x - 8)} ${round(y + 20)}"
        fill="none" stroke="#91a7cf" stroke-width="1.2" opacity=".48"/>`;
      const flash = animated ? `<path d="M${round(x - length)} ${round(y + 12)} L${round(x)} ${round(y + 12)}"
        stroke="#fffefa" stroke-width="2" stroke-dasharray="${round(length)}"
        fill="none" opacity=".2"><animate attributeName="opacity"
          values=".16;.82;.16" dur="4.8s" begin="${index * .45}s" repeatCount="indefinite"/></path>` : "";
      return `<g id="pride-light-step-${index}">${line}${flash}</g>`;
    }).join("\n");
  }

  // 漸小的每個字都擁有自己的鋒面、側牆與斜切面，建築感直接長在筆畫上。
  function monumentalLetter(character, slot, animated) {
    const { x, y, size, index } = slot;
    const escaped = escapeXML(character);
    const font = `font-family='${LETTER_FONT}' font-size='${round(size)}' font-weight='900' text-anchor='middle' dominant-baseline='central'`;
    const rawText = (dx = 0, dy = 0, attrs = "") => `<text x="${round(x + dx)}" y="${round(y + dy)}" ${font} ${attrs}>${escaped}</text>`;
    const clipName = `pride-letter-clip-${index}`;
    const extrusions = [];
    // 投下銳利的斜向樓體陰影（直接沿字形描繪，不畫任何矩形面板）。
    for (let step = 9; step >= 1; step -= 1) {
      extrusions.push(rawText(step * 1.8, step * 2.5,
        `fill="${step % 2 ? DARK_BLUE : "#212348"}" stroke="${SHADOW_BLUE}" stroke-width="${round(5 + step * .75)}" paint-order="stroke fill" opacity="${round(.94 - step * .035)}"`));
    }
    const bevelLight = rawText(-3.5, -4.7, `fill="none" stroke="#feffff" stroke-width="${round(Math.max(1.3, size * .017))}"
      paint-order="stroke fill" opacity=".72"`);
    const edge = rawText(0, 0, `fill="url(#pride-front-metal)" stroke="${DARK_BLUE}" stroke-width="${round(Math.max(5.4, size * .039))}" paint-order="stroke fill"`);
    const goldHairline = rawText(0, 0, `fill="none" stroke="${FROST_GOLD}" stroke-width="${round(Math.max(1.05, size * .009))}" opacity=".84"`);
    const lo = x - size * .55;
    const hi = x + size * .55;
    const top = y - size * .57;
    const lower = y + size * .63;
    const facet = `<g clip-path="url(#${clipName})" id="pride-letter-facets-${index}">
      <path d="M${round(lo)} ${round(top + size * .32)} L${round(hi)} ${round(top - size * .26)}
        L${round(hi)} ${round(top + size * .09)} L${round(lo)} ${round(lower - size * .23)} Z"
        fill="#ffffff" opacity=".28"/>
      <path d="M${round(lo)} ${round(lower - size * .19)} L${round(hi)} ${round(top + size * .15)}"
        stroke="#fffcf0" stroke-width="${round(size * .032)}" opacity=".24"/>
      <path d="M${round(x + size * .14)} ${round(top)} L${round(x - size * .21)} ${round(lower)}"
        stroke="#536287" stroke-width="${round(size * .12)}" opacity=".13"/>
      <path d="M${round(lo)} ${round(y + size * .09)} L${round(hi)} ${round(y - size * .24)}"
        stroke="#fffbee" stroke-width="${round(size * .008)}" opacity=".57"/>
    </g>`;
    const flash = animated ? `<path d="M${round(lo)} ${round(y - size * .42)} L${round(hi)} ${round(y + size * .4)}"
      stroke="#fff9df" stroke-width="${round(size * .042)}" opacity="0"
      clip-path="url(#${clipName})">
      <animate attributeName="opacity" values="0;0;.65;0;0" dur="6.8s"
        begin="${round(index * .52)}s" repeatCount="indefinite"/>
    </path>` : "";
    // 四個字的體積由字本身負責；明顯的空白會留在筆畫以外。
    return `<g id="pride-monument-letter-${index}">
      <clipPath id="${clipName}">${rawText()}</clipPath>
      <g filter="url(#pride-shadow)" opacity=".22">${rawText(14, 20, 'fill="#14132d"')}</g>
      ${extrusions.join("\n")}
      ${bevelLight}
      ${edge}
      ${facet}
      ${goldHairline}
      ${flash}
      <path d="M${round(x - size * .46)} ${round(top - 10)} L${round(x - size * .34)} ${round(top - 27)}"
        stroke="#e6d7a2" stroke-width="1.8" opacity=".73"/>
    </g>`;
  }

  function emptySpaceAccents(positions, direction, animated) {
    const main = positions[0];
    const vertical = direction === "vertical";
    const lower = positions[positions.length - 1];
    const markers = [
      [main.x + main.size * .65, main.y - main.size * .55, .88],
      [main.x - main.size * (vertical ? .72 : .48), main.y + main.size * .22, .55],
      [lower.x + lower.size * .67, lower.y + lower.size * .13, .54]
    ];
    const sparks = markers.map(([x,y,scale],i) => `<g transform="translate(${round(x)} ${round(y)}) scale(${scale})"
      opacity="${round(.82 - i*.15)}">
        <path d="M0 -19 L3 -3 L17 0 L3 3 L0 19 L-3 3 L-17 0 L-3 -3 Z"
          fill="#faf8e8" stroke="#b0bdd7" stroke-width=".8"/>
        ${animated ? `<animate attributeName="opacity" values=".32;.9;.32"
          dur="${5.2 + i * .8}s" begin="${i * .65}s" repeatCount="indefinite"/>` : ""}
      </g>`).join("\n");
    // 四散的孤傲刻度採不同方向；不使用整圈外框或完整底座。
    const x1 = vertical ? 140 : 1030;
    const y1 = vertical ? 463 : 170;
    const tip = `<path d="M${x1} ${y1} l-24 49 m0 -21 l-18 0 M${x1+19} ${y1+11} l-14 31"
      stroke="#c7c4d3" stroke-width="1.65" opacity=".37" fill="none"/>`;
    return `<g id="pride-floating-dust">${sparks}${tip}</g>`;
  }

  function createSVG(text, orientation = "vertical", helpers, options = {}) {
    const direction = orientation === "horizontal" ? "horizontal" : "vertical";
    const letters = charactersOf(text, helpers);
    const positions = letterPositions(letters, direction);
    const animated = options.animated === true;
    const surface = CANVAS[direction];
    const crownedSlot = positions.find(position => position.dominant) || positions[0];

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${surface.width}" height="${surface.height}"
      viewBox="0 0 ${surface.width} ${surface.height}" role="img"
      aria-label="${escapeXML(letters.join(""))}｜唯我獨尊">
      ${defs()}
      ${shafts(crownedSlot, direction, animated)}
      ${floatingTreads(positions, direction, animated)}
      ${letters.map((letter, index) => monumentalLetter(letter, positions[index], animated)).join("\n")}
      ${crown(crownedSlot, direction, animated)}
      ${emptySpaceAccents(positions, direction, animated)}
    </svg>`;
  }

  global.SlowlyPrideVisual = Object.freeze({ canvas: CANVAS, createSVG });
})(window);
