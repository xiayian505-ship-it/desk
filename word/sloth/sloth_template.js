"use strict";
/*
 * 好逸惡勞｜鬆垮成形：獨立 SVG 視覺與動態模板。
 *
 * 主字不是被放在軟墊上，而是像裝滿棉絮的布字，自己失去支撐。
 * 每個字各有壓縮、傾斜和下滑的方向；小枕角、布帶與星屑跟著字的位置走。
 * 不鋪底色、不畫大背板、不產生任何與其他七宗罪共用的視覺 JS。
 * 生成與匯出仍透過慢慢軍火庫，網站介面交由 word/shared/word_page.js。
 */
(function (global) {
  const canvas = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });

  const fontStack = '"Noto Sans CJK TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif';
  const round = value => Math.round(value * 100) / 100;

  function escapeXML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[character]));
  }

  function splitCharacters(text, helpers) {
    const splitter = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const parts = typeof splitter === "function" ? splitter(text) : Array.from(String(text || ""));
    return Array.from(parts).slice(0, 4);
  }

  // 不同字數都重新安排；直式是一列東倒西歪的字，橫式像逐字癱進沙發。
  function layout(count, orientation) {
    const length = Math.min(4, Math.max(1, count));
    const vertical = {
      1: [[420, 605, 370, -11, 1.06, .83]],
      2: [[348, 418, 300, -14, 1.04, .83], [484, 807, 300, 13, 1.14, .77]],
      3: [[347, 306, 258, -12, 1.06, .88], [478, 613, 272, 13, 1.10, .77], [337, 917, 267, -16, 1.13, .78]],
      4: [[345, 252, 247, -13, 1.07, .86], [477, 467, 260, 12, 1.14, .75],
          [333, 719, 262, -16, 1.10, .78], [485, 957, 251, 15, 1.14, .76]]
    };
    const horizontal = {
      1: [[603, 426, 418, -9, 1.10, .83]],
      2: [[381, 313, 333, -13, 1.08, .81], [840, 484, 327, 12, 1.13, .78]],
      3: [[241, 293, 272, -12, 1.04, .84], [580, 444, 298, 13, 1.11, .75],
          [957, 368, 277, -14, 1.10, .77]],
      4: [[214, 298, 242, -12, 1.04, .83], [461, 440, 272, 14, 1.13, .76],
          [745, 344, 257, -12, 1.08, .79], [1020, 469, 249, 12, 1.11, .76]]
    };
    const presets = orientation === "horizontal" ? horizontal : vertical;
    return presets[length].map(([x, y, size, tilt, stretchX, squashY], index) => ({
      x, y, size, tilt, stretchX, squashY, index
    }));
  }

  function definitions() {
    return `<defs>
      <!-- 棉絨正面：亮部不做強金屬反光，而是寬、柔的布面層次。 -->
      <linearGradient id="sloth-plush-face" x1="8%" y1="0%" x2="88%" y2="100%">
        <stop offset="0%" stop-color="#fff9ef"/>
        <stop offset="17%" stop-color="#eeeaf0"/>
        <stop offset="39%" stop-color="#c3d0e2"/>
        <stop offset="63%" stop-color="#9faaca"/>
        <stop offset="80%" stop-color="#c3bbd9"/>
        <stop offset="100%" stop-color="#e9d9e3"/>
      </linearGradient>
      <linearGradient id="sloth-fabric-edge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fdfbf2"/>
        <stop offset="46%" stop-color="#b1b7d0"/>
        <stop offset="100%" stop-color="#898da9"/>
      </linearGradient>
      <linearGradient id="sloth-pillow-cotton" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fffdf2"/>
        <stop offset="51%" stop-color="#e8e1ee"/>
        <stop offset="100%" stop-color="#b2bdd4"/>
      </linearGradient>
      <linearGradient id="sloth-draped-cloth" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#efecf2" stop-opacity=".89"/>
        <stop offset="48%" stop-color="#b9afce" stop-opacity=".75"/>
        <stop offset="100%" stop-color="#8c90b2" stop-opacity=".19"/>
      </linearGradient>
      <filter id="sloth-cotton-shadow" x="-45%" y="-55%" width="190%" height="220%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>
    </defs>`;
  }

  // 每個枕頭尺寸遠小於主字，壓住個別字角，並非整幅作品的底板。
  function slippedPillow(slot, variant = 0, animated = false) {
    const width = slot.size * (variant ? .47 : .54);
    const height = slot.size * .27;
    const dx = variant ? slot.size * .47 : -slot.size * .51;
    const dy = slot.size * (variant ? .28 : .37);
    const pillowAngle = variant ? -18 : 13;
    return `<g class="sloth-small-pillow" transform="translate(${round(dx)} ${round(dy)}) rotate(${pillowAngle})">
      <path d="M${round(-width * .54)} 0
        Q${round(-width * .52)} ${round(-height * .60)} ${round(-width * .25)} ${round(-height * .52)}
        Q0 ${round(-height * .71)} ${round(width * .25)} ${round(-height * .52)}
        Q${round(width * .55)} ${round(-height * .54)} ${round(width * .54)} 0
        Q${round(width * .65)} ${round(height * .47)} ${round(width * .22)} ${round(height * .47)}
        Q0 ${round(height * .67)} ${round(-width * .27)} ${round(height * .49)}
        Q${round(-width * .65)} ${round(height * .49)} ${round(-width * .54)} 0 Z"
        fill="url(#sloth-pillow-cotton)" stroke="#aaa4bf" stroke-width="${round(slot.size * .021)}"/>
      <path d="M${round(-width * .40)} ${round(-height * .31)} Q0 ${round(-height * .45)} ${round(width * .35)} ${round(-height * .26)}
        M${round(-width * .37)} ${round(height * .27)} Q0 ${round(height * .43)} ${round(width * .37)} ${round(height * .23)}"
        fill="none" stroke="#ffffff" stroke-width="3" opacity=".86"/>
      <path d="M-9 -5 Q0 2 9 -5 M0 3 L0 11" stroke="#9c96b8" stroke-width="2.6" fill="none" opacity=".68"/>
      ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate"
        values="0 0;0 3;0 0" dur="8s" repeatCount="indefinite"/>` : ""}
    </g>`;
  }

  // 柔軟的織物從字緣下垂，不繞成幾何大框，也不橫跨整個畫布。
  function looseCloth(slot, reversed = false, animated = false) {
    const direction = reversed ? -1 : 1;
    const startX = direction * slot.size * .35;
    const startY = -slot.size * .34;
    const endX = direction * slot.size * .38;
    const endY = slot.size * .73;
    const shift = direction * slot.size * .30;
    return `<g class="sloth-hanging-fabric">
      <path d="M${round(startX)} ${round(startY)}
        C${round(startX + shift)} ${round(startY + slot.size * .13)},
         ${round(endX - shift * .8)} ${round(slot.size * .10)},
         ${round(endX)} ${round(endY)}
        L${round(endX - direction * slot.size * .17)} ${round(endY + slot.size * .14)}
        C${round(endX - shift * 1.18)} ${round(slot.size * .19)},
         ${round(startX - shift * .64)} ${round(startY + slot.size * .22)},
         ${round(startX)} ${round(startY)} Z"
        fill="url(#sloth-draped-cloth)" opacity=".78"/>
      <path d="M${round(startX + direction * 5)} ${round(startY + slot.size * .08)}
        C${round(startX + shift * .65)} ${round(startY + slot.size * .24)},
         ${round(endX - shift * .58)} ${round(slot.size * .32)},
         ${round(endX - direction * slot.size * .07)} ${round(endY + slot.size * .05)}"
        fill="none" stroke="#f8f6ed" stroke-width="3.2" opacity=".76"/>
      ${animated ? `<animate attributeName="opacity" values=".78;.56;.78" dur="11s" repeatCount="indefinite"/>` : ""}
    </g>`;
  }

  // 被壓扁的字形外緣刻意保留柔軟的棉絨感；所有褶痕裁入字形本身。
  function tiredLetter(character, slot, animated) {
    const { size, index, stretchX, squashY } = slot;
    const escaped = escapeXML(character);
    const face = `font-family='${fontStack}' font-size='${round(size)}' font-weight='900'
      text-anchor='middle' dominant-baseline='central'`;
    const text = (dx, dy, attributes = "") => `<text x="${round(dx)}" y="${round(dy)}" ${face} ${attributes}>${escaped}</text>`;
    const clip = `sloth-text-fabric-${index}`;
    const foldStart = -size * .55;
    const foldEnd = size * .50;
    const lifted = index % 2 === 0 ? -1 : 1;
    const fabricFold = `<g clip-path="url(#${clip})" opacity=".9">
      <path d="M${round(foldStart)} ${round(-size * .14)}
        Q${round(-size * .12)} ${round(-size * .02)} ${round(foldEnd)} ${round(-size * .38)}"
        stroke="#fffef8" stroke-width="${round(size * .055)}" opacity=".29" fill="none"/>
      <path d="M${round(foldStart)} ${round(size * .14)}
        Q${round(-size * .12)} ${round(size * .25)} ${round(foldEnd)} ${round(size * .04)}"
        stroke="#626f99" stroke-width="${round(size * .045)}" opacity=".13" fill="none"/>
      <path d="M${round(size * .06)} ${round(-size * .52)}
        Q${round(size * .19)} ${round(-size * .18)} ${round(-size * .16)} ${round(size * .53)}"
        stroke="#f6f2f2" stroke-width="${round(size * .016)}" opacity=".65" fill="none"/>
    </g>`;
    return `<g id="sloth-drooping-letter-${index}"
      transform="translate(${slot.x} ${slot.y}) rotate(${slot.tilt})">
      <g class="sloth-letter-linger">
        ${animated ? `<animateTransform attributeName="transform" type="translate" additive="sum"
          values="0 0;${round(lifted * 2)} ${round(4 + index)};0 0" dur="${round(7.8 + index * 1.4)}s" repeatCount="indefinite"/>` : ""}
        <!-- 柔布從局部字角滑落；枕頭只抵住一個角，不是整面靠背。 -->
        ${index % 2 === 1 ? looseCloth(slot, false, animated) : ""}
        ${index === 0 || index === 3 ? slippedPillow(slot, index % 2, animated) : ""}
        <g transform="scale(${round(stretchX)} ${round(squashY)})">
          <clipPath id="${clip}">${text(0, 0)}</clipPath>
          <g filter="url(#sloth-cotton-shadow)" opacity=".17">
            ${text(12, 16, 'fill="#5b678f"')}
          </g>
          ${text(10, 14, `fill="#8586ac" stroke="#9392b4" stroke-width="${round(size * .075)}" stroke-linejoin="round" paint-order="stroke fill" opacity=".55"`)}
          ${text(0, 0, `fill="url(#sloth-plush-face)" stroke="#727c9d" stroke-width="${round(size * .092)}" stroke-linejoin="round" paint-order="stroke fill"`)}
          ${text(-2, -3, `fill="none" stroke="url(#sloth-fabric-edge)" stroke-width="${round(size * .049)}" stroke-linejoin="round" opacity=".85"`)}
          ${fabricFold}
          <!-- 不對稱的下垂摺線：筆畫的右下角看起來像失去筋骨。 -->
          <path d="M${round(-size * .22)} ${round(size * .46)}
            Q0 ${round(size * .64)} ${round(size * .34)} ${round(size * .40)}"
            fill="none" stroke="#f7f3ed" stroke-width="${round(size * .020)}" opacity=".86"/>
        </g>
      </g>
    </g>`;
  }

  // 輕飄飄的睏倦弧線和四角星，都是自足 SVG 元素，沒有借用網頁 CSS。
  function sleepyTrail(positions, orientation, animated) {
    const vertical = orientation === "vertical";
    const primary = positions[0];
    const final = positions[positions.length - 1];
    const startX = vertical ? primary.x + primary.size * .64 : primary.x + primary.size * .50;
    const startY = primary.y - primary.size * .61;
    const yawn = Array.from({ length: 3 }, (_, index) => {
      const x = startX + index * (vertical ? 11 : 23);
      const y = startY - index * (vertical ? 52 : 25);
      const width = 35 - index * 7;
      return `<path d="M${round(x - width)} ${round(y)}
        Q${round(x)} ${round(y - 17)} ${round(x + width)} ${round(y + 1)}"
        fill="none" stroke="${index % 2 ? '#b5adc8' : '#929fbd'}"
        stroke-width="${round(4.6 - index * .7)}" stroke-linecap="round" opacity="${round(.72 - index * .15)}">
        ${animated ? `<animate attributeName="opacity" values=".20;.75;.20" dur="${6 + index}s" begin="${index * .9}s" repeatCount="indefinite"/>` : ""}
      </path>`;
    }).join("\n");

    // 星點不是固定的邊框軌道；每顆從不同字的空隙慢慢往下沉。
    const offsets = vertical
      ? [[-150, -86], [205, 22], [-225, 86], [205, 130], [-185, 183], [188, -43]]
      : [[-80, -120], [132, 134], [-157, 141], [166, -123], [-110, -147], [120, 127]];
    const drops = offsets.map(([dx, dy], index) => {
      const slot = positions[index % positions.length];
      const x = slot.x + dx;
      const y = slot.y + dy;
      const size = 7 + (index % 3) * 3;
      const tone = index % 2 === 0 ? "#f4e6cc" : "#b6b0d3";
      return `<g transform="translate(${round(x)} ${round(y)})" opacity="${round(.64 - index % 3 * .11)}">
        <path d="M0 ${-size} Q2 -2 ${size} 0 Q2 2 0 ${size} Q-2 2 ${-size} 0 Q-2 -2 0 ${-size} Z"
          fill="${tone}"/>
        <path d="M0 ${round(-size * 2.5)} v${round(-size * 1.2)}"
          fill="none" stroke="#bbb4cb" stroke-width="1.8" stroke-linecap="round" opacity=".6"/>
        ${animated ? `<animateTransform attributeName="transform" type="translate" additive="sum"
          values="0 -8;0 17;0 -8" dur="${round(8.4 + index * 1.2)}s" repeatCount="indefinite"/>` : ""}
      </g>`;
    }).join("\n");

    // 軟糯小雲只是一簇弧線，沒有大面積填色或背板。
    const cloudX = vertical ? final.x - final.size * .80 : final.x - final.size * .40;
    const cloudY = vertical ? final.y + final.size * .76 : final.y + final.size * .73;
    const cloud = `<g opacity=".58">
      <path d="M${round(cloudX - 38)} ${round(cloudY)}
        q10 -21 31 -12 q7 -28 32 -18 q22 -12 34 10 q23 -5 29 14"
        fill="none" stroke="#aaaec8" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M${round(cloudX - 11)} ${round(cloudY + 16)} q19 -6 37 0"
        fill="none" stroke="#e4dce5" stroke-width="3.3" stroke-linecap="round"/>
    </g>`;
    return `<g id="sloth-drowsiness">${yawn}${drops}${cloud}</g>`;
  }

  function createSVG(rawText, orientation = "vertical", helpers, options = {}) {
    const direction = orientation === "horizontal" ? "horizontal" : "vertical";
    const characters = splitCharacters(rawText, helpers);
    const positions = layout(characters.length, direction);
    const animated = options.animated === true;
    const size = canvas[direction];

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"
      viewBox="0 0 ${size.width} ${size.height}" role="img"
      aria-label="${escapeXML(characters.join(""))}｜好逸惡勞">
      ${definitions()}
      ${characters.map((character, index) => tiredLetter(character, positions[index], animated)).join("\n")}
      ${sleepyTrail(positions, direction, animated)}
    </svg>`;
  }

  global.SlowlySlothVisual = Object.freeze({ canvas, createSVG });
})(window);
