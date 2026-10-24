"use strict";
/* ============================================================================
 * 死於非命｜第 46 款・幽冥咒印 SVG 專屬繪圖模板
 *
 * 以先前產生的「骨白殘裂字、幽藍冷光、破符、月輪、細繩與陰氣」設計為參考。
 * 嚴禁任何大型底板或大片連續的煙霧填色；所有元素直接繪入透明 SVG。
 * 此 SVG 包含自己的字體、碎裂、咒印與動畫；不複製軍火庫程式碼。
 * ============================================================================ */
(function (global) {
  const canvas = Object.freeze({
    vertical: Object.freeze({ width: 840, height: 1200 }),
    horizontal: Object.freeze({ width: 1200, height: 760 })
  });
  const font = '"Noto Serif CJK TC", "Noto Serif TC", "Source Han Serif TC", "PMingLiU", serif';
  const fixed = value => Number(value.toFixed(2));

  function escapeXML(text) {
    return String(text).replace(/[&<>"']/g, symbol => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[symbol]));
  }

  function split(text, helpers) {
    const fn = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const result = typeof fn === "function" ? fn(text) : Array.from(String(text || ""));
    return Array.from(result).slice(0, 4);
  }

  // 根據實際字數重排，避免把四字畫面的裝飾座標套在單字作品上。
  function positions(count, direction) {
    if (direction === "vertical") {
      const presets = {
        1: { y: [575], size: [370], x: [420] },
        2: { y: [399, 783], size: [310, 306], x: [408, 442] },
        3: { y: [315, 603, 887], size: [255, 265, 261], x: [410, 441, 404] },
        4: { y: [260, 481, 723, 953], size: [226, 228, 245, 230], x: [416, 443, 406, 441] }
      };
      const rule = presets[count];
      return rule.y.map((y, index) => ({
        x: rule.x[index], y, size: rule.size[index],
        tilt: [-6, 3, -3, 5][index], index
      }));
    }
    const presets = {
      1: { x: [605], size: [350], y: [385] },
      2: { x: [423, 794], size: [298, 294], y: [385, 402] },
      3: { x: [294, 604, 915], size: [265, 267, 263], y: [385, 412, 380] },
      4: { x: [187, 456, 744, 1009], size: [221, 225, 232, 224], y: [382, 398, 377, 397] }
    };
    const rule = presets[count];
    return rule.x.map((x, index) => ({
      x, y: rule.y[index], size: rule.size[index],
      tilt: [-6, 2, -3, 5][index], index
    }));
  }

  function definitions(letters) {
    return `<defs>
      <linearGradient id="ill-fate-bone" x1=".18" y1="0" x2=".78" y2="1">
        <stop stop-color="#fcfff8"/>
        <stop offset=".22" stop-color="#dbded8"/>
        <stop offset=".47" stop-color="#a8b8b9"/>
        <stop offset=".55" stop-color="#f7f4e7"/>
        <stop offset=".81" stop-color="#d3d8d1"/>
        <stop offset="1" stop-color="#566874"/>
      </linearGradient>
      <linearGradient id="ill-fate-bone-edge" x1="0" y1="0" x2="1" y2=".95">
        <stop stop-color="#0b121b"/>
        <stop offset=".33" stop-color="#4c5a61"/>
        <stop offset=".73" stop-color="#1b2530"/>
        <stop offset="1" stop-color="#0b1119"/>
      </linearGradient>
      <linearGradient id="ill-fate-seal-paper" x1="0" y1="0" x2=".9" y2="1">
        <stop stop-color="#e1dbca"/><stop offset=".45" stop-color="#a9a99f"/>
        <stop offset="1" stop-color="#676a66"/>
      </linearGradient>
      <linearGradient id="ill-fate-spectral" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#d4faff" stop-opacity=".20"/>
        <stop offset=".48" stop-color="#8fc9df" stop-opacity=".8"/>
        <stop offset="1" stop-color="#c9faff" stop-opacity=".10"/>
      </linearGradient>
      <filter id="ill-fate-small-glow" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="3.5"/>
      </filter>
      <filter id="ill-fate-letter-haze" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
      ${letters.map((slot, index) => `<clipPath id="ill-fate-letter-clip-${index}">
        <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
          font-family='${font}' font-size="${slot.size}" font-weight="900">${escapeXML(slot.char)}</text>
      </clipPath>`).join("\n")}
    </defs>`;
  }

  function moonAndOmen(direction, count, animated) {
    const vertical = direction === "vertical";
    const topX = vertical ? 411 : 302;
    const topY = vertical ? 185 : 345;
    const ringWidth = vertical ? 222 : 190;
    const ringHeight = vertical ? 115 : 160;
    const secondX = vertical ? 402 : 819;
    const secondY = vertical ? 795 : 382;
    return `<g id="ill-fate-broken-moon" fill="none" stroke-linecap="round">
      <path d="M${topX - ringWidth} ${topY + 25}
        C${topX - ringWidth - 28} ${topY - ringHeight} ${topX - 35} ${topY - ringHeight - 57}
          ${topX + 62} ${topY - ringHeight + 12}"
        stroke="#2a3541" stroke-width="20" opacity=".33"/>
      <path d="M${topX - ringWidth + 5} ${topY + 12}
        C${topX - ringWidth - 23} ${topY - ringHeight} ${topX - 36} ${topY - ringHeight - 56}
          ${topX + 59} ${topY - ringHeight + 13}"
        stroke="#c0d7d8" stroke-width="2.8" opacity=".64"/>
      <path d="M${topX + 95} ${topY - ringHeight + 26}
        C${topX + 180} ${topY - 88} ${topX + 192} ${topY + 39} ${topX + 137} ${topY + 57}"
        stroke="#6f8791" stroke-width="3" opacity=".47"/>
      <path d="M${secondX - 213} ${secondY + 69}
        C${secondX - 251} ${secondY - 61} ${secondX - 99} ${secondY - 126}
          ${secondX + 60} ${secondY - 88}
        M${secondX + 135} ${secondY - 37}
        C${secondX + 270} ${secondY + 88} ${secondX + 45} ${secondY + 158}
          ${secondX - 112} ${secondY + 111}"
        stroke="url(#ill-fate-spectral)" stroke-width="5.2" opacity=".8"
        stroke-dasharray="290 42 92 28">
        ${animated ? '<animate attributeName="stroke-dashoffset" values="0;-452" dur="15s" repeatCount="indefinite"/>' : ""}
      </path>
    </g>`;
  }

  // 全部是細線陰氣，不以一塊不透明的黑灰形狀撐起背景。
  function driftingMist(direction, count, animated) {
    const vertical = direction === "vertical";
    const width = vertical ? 840 : 1200;
    const height = vertical ? 1200 : 760;
    const paths = vertical ? [
      "M214 180 C138 230 158 293 238 296 S310 359 190 427 S122 539 246 570",
      "M621 132 C704 199 694 252 613 288 S581 379 668 428 S733 519 629 566",
      "M229 595 C133 684 182 730 285 747 S336 827 231 896 S150 1032 281 1067",
      "M605 581 C735 644 693 743 610 774 S557 873 651 943 S677 1062 548 1120",
      "M320 106 C271 159 292 211 349 230 M496 1039 C550 1090 513 1156 452 1182",
      "M170 420 Q105 479 151 544 M694 854 Q765 905 705 977"
    ] : [
      "M104 220 C153 148 248 190 285 251 S375 318 431 220 S558 174 597 226",
      "M605 155 C688 104 752 156 784 220 S866 311 940 229 S1098 160 1121 232",
      "M116 506 C210 591 285 542 330 509 S454 482 503 559 S631 608 682 533",
      "M677 561 C743 637 841 577 869 511 S1008 455 1103 536",
      "M285 107 Q352 73 416 117 M750 642 Q861 697 929 627",
      "M108 355 Q39 395 110 450 M1108 324 Q1180 379 1107 446"
    ];
    return `<g id="ill-fate-thin-mist" fill="none" stroke-linecap="round">
      ${paths.map((d, index) => `<g opacity="${index % 3 === 0 ? ".39" : ".27"}">
        <path d="${d}" stroke="#273748" stroke-width="${index % 3 === 0 ? 11 : 7}" opacity=".3"/>
        <path d="${d}" stroke="${index % 2 ? "#9bc7d5" : "#aeb9b5"}"
          stroke-width="${index % 3 === 0 ? 2.9 : 2}" stroke-dasharray="13 7 78 19"/>
        ${animated ? `<animateTransform attributeName="transform" type="translate"
          values="0 0;${index % 2 ? 9 : -12} ${index % 2 ? -11 : 8};0 0"
          dur="${9 + index * 1.15}s" repeatCount="indefinite"/>` : ""}
      </g>`).join("\n")}
    </g>`;
  }

  function talisman(x, y, scale, angle, id, animated) {
    return `<g id="ill-fate-hanging-talisman-${id}" transform="translate(${x} ${y})">
      <g>
        ${animated ? `<animateTransform attributeName="transform" type="rotate"
          values="-2 0 -106;${id % 2 ? 3.4 : -4.5} 0 -106;-2 0 -106" dur="${7 + id}s"
          repeatCount="indefinite"/>` : ""}
        <g transform="rotate(${angle}) scale(${scale})">
          <path d="M0 -146 L0 -108" fill="none" stroke="#6e8792" stroke-width="1.8"/>
          <circle cx="0" cy="-106" r="5.5" fill="#13232e" stroke="#b5bcb4" stroke-width="1.7"/>
          <path d="M-22 -101 L20 -103 L25 12 L5 4 L-10 21 L-21 8 Z"
            fill="url(#ill-fate-seal-paper)" stroke="#27343b" stroke-width="3"/>
          <path d="M-12 -88 H12 M-12 -72 H12 M-12 -56 H12
            M0 -34 V-10 M-12 -22 H12" fill="none" stroke="#39454b" stroke-width="2.2" opacity=".87"/>
          <path d="M-14 -94 L-14 -30 M15 -30 L16 -4" stroke="#e7eee3" stroke-width="1" opacity=".62"/>
          <path d="M-9 15 L-7 36 M8 7 L12 28" stroke="#72858b" stroke-width="1.4"/>
        </g>
      </g>
    </g>`;
  }

  function charms(direction, animated) {
    const charms = direction === "vertical" ? [
      [669, 345, .9, 7], [165, 759, .77, -14], [654, 1055, .58, 11]
    ] : [
      [110, 384, .73, -11], [641, 216, .68, 12], [1106, 575, .78, 8]
    ];
    return `<g id="ill-fate-ritual-charms">
      ${charms.map(([x, y, scale, angle], index) => talisman(x, y, scale, angle, index + 1, animated)).join("\n")}
    </g>`;
  }

  function runeCoin(x, y, size, index, animated) {
    return `<g transform="translate(${x} ${y})" id="ill-fate-coin-${index}">
      <circle r="${size}" fill="none" stroke="#1c2934" stroke-width="${fixed(size * .21)}"/>
      <circle r="${size}" fill="none" stroke="#b8c6c3" stroke-width="1.5" opacity=".88"/>
      <rect x="${-size * .26}" y="${-size * .26}" width="${size * .52}" height="${size * .52}"
        fill="none" stroke="#9bb7c0" stroke-width="1.8"/>
      <path d="M0 ${-size * 1.9} V${-size * 1.18}" stroke="#627781" stroke-width="1.5"/>
      ${animated ? `<animate attributeName="opacity" values=".7;1;.7" dur="${5 + index}s" repeatCount="indefinite"/>` : ""}
    </g>`;
  }

  function sideOrnaments(direction, animated) {
    const vertical = direction === "vertical";
    const dots = vertical
      ? [[105, 183], [723, 163], [113, 490], [744, 568], [88, 843], [742, 954], [254, 1111], [572, 1144]]
      : [[76, 146], [198, 614], [457, 82], [624, 679], [949, 96], [1113, 603], [1143, 263], [85, 520]];
    const coins = vertical
      ? [[623, 159, 16], [194, 623, 10], [663, 882, 12]]
      : [[349, 125, 15], [780, 629, 12], [1064, 173, 11]];
    const slashPoints = vertical
      ? [[195, 225, -16], [662, 485, 14], [218, 890, -8], [643, 1021, 21]]
      : [[228, 201, -19], [513, 545, -6], [814, 212, 11], [1019, 555, 18]];
    return `<g id="ill-fate-fragments">
      ${slashPoints.map(([x, y, deg], i) => `<g transform="translate(${x} ${y}) rotate(${deg})">
        <path d="M-33 -8 L24 -24 L42 -16 L14 0 L-23 16 Z"
          fill="${i % 2 ? "#bcc9c8" : "#68777d"}" stroke="#303c46"
          stroke-width="1.7" opacity=".72"/>
        <path d="M-17 -3 L14 -13" stroke="#edf5ea" stroke-width="1.4" opacity=".72"/>
      </g>`).join("\n")}
      ${coins.map(([x, y, size], i) => runeCoin(x, y, size, i, animated)).join("\n")}
      ${dots.map(([x, y], i) => `<g>
        <circle cx="${x}" cy="${y}" r="${i % 2 ? 2.6 : 3.6}"
          fill="${i % 3 ? "#a2b0bd" : "#d9faff"}" opacity=".7"/>
        <path d="M${x - 11} ${y} H${x + 11} M${x} ${y - 11} V${y + 11}"
          stroke="#9fcee0" stroke-width="1" opacity=".24"/>
        ${animated ? `<animate attributeName="opacity" values=".25;1;.25"
          dur="${3.4 + i * .5}s" repeatCount="indefinite"/>` : ""}
      </g>`).join("\n")}
    </g>`;
  }

  function letterCracks(size, number, animated) {
    const s = fixed(size / 220);
    // 斷裂線只裁切在字形內，文字仍是依使用者輸入動態生成。
    return `<g clip-path="url(#ill-fate-letter-clip-${number})" fill="none">
      <g transform="scale(${s}) rotate(${number * 13 - 7})" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-74 -96 L-59 -88 L-66 -76 L-85 -82 Z
          M64 -37 L93 -42 L79 -23 L63 -24 Z
          M-37 57 L-12 46 L7 60 L-18 65 Z
          M55 82 L73 72 L88 81 L69 92 Z"
          fill="#27333c" opacity=".27" stroke="none"/>
        <path d="M-111 -63 L-51 -33 L-20 9 L35 21 L100 85
          M66 -102 L45 -55 L-11 -12 L-25 40 L-77 100
          M-110 49 L-46 36 L-9 62 L35 53 L110 39"
          stroke="#17252f" stroke-width="6" opacity=".78"/>
        <path d="M-110 -65 L-52 -36 L-21 6 L36 18 L103 83
          M68 -99 L46 -53 L-9 -10 L-22 42 L-74 102"
          stroke="#e7f6f1" stroke-width="1.7" opacity=".78"/>
        <path d="M-95 -90 L-22 -70 M15 -92 L103 -33 M-105 88 L-55 72 M64 78 L105 112
          M-88 0 L-30 10 M18 -8 L80 5 M-7 31 L22 49"
          stroke="#52646c" stroke-width="2.8" opacity=".63"/>
        <path d="M-97 -112 L-65 101 M2 -111 L-3 107 M86 -112 L72 109"
          stroke="#eaf7f3" stroke-width=".85" stroke-dasharray="1 12 5 14" opacity=".68"/>
        <path d="M-110 12 Q-20 -45 115 -11" stroke="#e1fbff" stroke-width="6"
          opacity="${animated ? ".12" : ".08"}" filter="url(#ill-fate-small-glow)"/>
        ${animated ? `<path d="M-112 12 Q-20 -45 115 -11" stroke="#bde8f6" stroke-width="2"
          stroke-dasharray="24 215" opacity=".8">
          <animate attributeName="stroke-dashoffset" values="260;-260" dur="8s" repeatCount="indefinite"/>
        </path>` : ""}
      </g>
    </g>`;
  }

  function lettering(chars, slots, animated) {
    return chars.map((char, index) => {
      const { x, y, size, tilt } = slots[index];
      const value = escapeXML(char);
      const text = (dx, dy, attrs) => `<text x="${dx}" y="${dy}" font-size="${size}"
        font-family='${font}' font-weight="900" text-anchor="middle"
        dominant-baseline="central" stroke-linejoin="round" paint-order="stroke fill"
        ${attrs}>${value}</text>`;
      const shardY = fixed(size * .49);
      return `<g id="ill-fate-letter-${index + 1}" transform="translate(${x} ${y}) rotate(${tilt})">
        ${text(12, 13, 'fill="#0a141e" stroke="#0b131d" stroke-width="22" opacity=".8"')}
        ${text(0, 0, 'fill="url(#ill-fate-bone)" stroke="url(#ill-fate-bone-edge)" stroke-width="18"')}
        ${text(0, 0, 'fill="url(#ill-fate-bone)" stroke="#dbe0d8" stroke-width="1.8"')}
        ${letterCracks(size, index, animated)}
        <!-- 斷裂筆畫的碎屑：只在字的邊角，不構成背景塊。 -->
        <path d="M${fixed(-size * .45)} ${fixed(size * .2)} l-19 15 l28 -8 Z
          M${fixed(size * .34)} ${fixed(-size * .36)} l21 -13 l-7 22 Z
          M${fixed(size * .36)} ${shardY} l13 18 l-22 7 Z"
          fill="#c6d2ce" stroke="#34414a" stroke-width="2" opacity=".85"/>
        <path d="M${fixed(-size * .34)} ${fixed(-size * .45)} l-21 -19
          M${fixed(size * .38)} ${fixed(size * .31)} l16 27"
          stroke="#8fb2bb" stroke-width="2" stroke-linecap="round" opacity=".64"/>
      </g>`;
    }).join("\n");
  }

  function finalSeal(direction, count, animated) {
    const vertical = direction === "vertical";
    const x = vertical ? 431 : 608;
    const y = vertical ? 1138 : 653;
    const s = vertical ? 1 : .82;
    return `<g id="ill-fate-final-seal" transform="translate(${x} ${y}) scale(${s})"
      fill="none" stroke-linecap="round">
      <path d="M0 -47 V37 M-29 0 H29" stroke="#879aa0" stroke-width="1.8" opacity=".7"/>
      <circle r="15" stroke="#d2f8fa" stroke-width="2.2"/>
      <circle r="9" stroke="#61869b" stroke-width="1.4"/>
      <path d="M0 -27 L5 -6 L26 0 L5 6 L0 27 L-5 6 L-26 0 L-5 -6 Z"
        stroke="#caedf3" stroke-width="1.6"/>
      ${animated ? `<circle r="15" stroke="#ccf9ff" stroke-width="3" opacity=".35"
        filter="url(#ill-fate-small-glow)">
        <animate attributeName="opacity" values=".1;.6;.1" dur="5s" repeatCount="indefinite"/>
      </circle>` : ""}
    </g>`;
  }

  function createSVG(rawText, orientation = "vertical", helpers, options = {}) {
    const direction = orientation === "horizontal" ? "horizontal" : "vertical";
    const chars = split(rawText, helpers);
    const slots = positions(Math.max(1, chars.length), direction)
      .map((position, index) => ({ ...position, char: chars[index] || "" }));
    const size = canvas[direction];
    const animated = options.animated === true;
    const decorativeScale = direction === "vertical"
      ? [0, .69, .84, .95, 1][Math.min(chars.length, 4)]
      : [0, .76, .88, .96, 1][Math.min(chars.length, 4)];
    const centerX = size.width / 2;
    const centerY = size.height / 2;
    // 只有咒印周邊裝飾隨字數收攏，主字按獨立字位呈現，不拉伸文字。
    const decorativeTransform = `translate(${centerX} ${centerY}) scale(${decorativeScale}) translate(${-centerX} ${-centerY})`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"
      viewBox="0 0 ${size.width} ${size.height}" role="img"
      aria-label="${escapeXML(chars.join(""))}・死於非命藝術字">
      ${definitions(slots)}
      <!-- 嚴禁大底板；只留懸空輪廓、細煙、殘符與咒字。 -->
      <g id="ill-fate-surrounding-charms" transform="${decorativeTransform}">
        ${moonAndOmen(direction, chars.length, animated)}
        ${driftingMist(direction, chars.length, animated)}
        ${sideOrnaments(direction, animated)}
        ${charms(direction, animated)}
        ${finalSeal(direction, chars.length, animated)}
      </g>
      <g id="ill-fate-cracked-bone-letters">${lettering(chars, slots, animated)}</g>
    </svg>`;
  }

  global.SlowlyIllFateVisual = Object.freeze({ canvas, createSVG });
})(window);
