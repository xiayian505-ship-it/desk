"use strict";
/* ============================================================================
 * 字數統計｜第 45 款專屬 SVG 設計
 *
 * 創作方向：翡翠青綠的數位字元逐格被解析，字形本身為資料本體。
 * 背景沒有整片深色面板；數據編號、掃描刻度、字形內部紋理、節點
 * 都是自足 SVG 的內容，靜態與動畫下載共用一份視覺模板。
 * 橫式、直式採用獨立的資料流佈局，不旋轉整幅畫面。
 * ============================================================================ */
(function (global) {
  const CANVAS = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });

  const TYPEFACE = '"Noto Sans CJK TC", "Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
  const DIGIT_FACE = '"IBM Plex Mono", "SFMono-Regular", Consolas, "Noto Sans Mono", monospace';
  const decimal = value => Number(value.toFixed(2));

  function escapeXML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[character]));
  }

  function splitCharacters(text, helpers) {
    const split = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const value = typeof split === "function" ? split(text) : Array.from(String(text || ""));
    return Array.from(value).slice(0, 4);
  }

  function positions(count, mode) {
    const total = Math.max(1, Math.min(4, count));
    if (mode === "vertical") {
      const arrangements = {
        1: { ys: [600], sizes: [353], xs: [418] },
        2: { ys: [449, 742], sizes: [294, 291], xs: [412, 426] },
        3: { ys: [345, 601, 858], sizes: [236, 239, 237], xs: [410, 429, 408] },
        4: { ys: [245, 470, 696, 920], sizes: [207, 210, 207, 209], xs: [409, 430, 407, 422] }
      };
      const setting = arrangements[total];
      return setting.ys.map((y, index) => ({
        x: setting.xs[index], y, size: setting.sizes[index], index
      }));
    }
    const arrangements = {
      1: { xs: [600], sizes: [368], ys: [382] },
      2: { xs: [390, 805], sizes: [304, 304], ys: [383, 378] },
      3: { xs: [285, 602, 919], sizes: [243, 248, 243], ys: [382, 377, 383] },
      4: { xs: [194, 463, 733, 1001], sizes: [207, 212, 208, 205], ys: [377, 384, 376, 383] }
    };
    const setting = arrangements[total];
    return setting.xs.map((x, index) => ({
      x, y: setting.ys[index], size: setting.sizes[index], index
    }));
  }

  function definitions(chars, slots) {
    const letterClips = chars.map((character, index) => {
      const slot = slots[index];
      return `<clipPath id="word-count-glyph-${index}">
        <text x="${slot.x}" y="${slot.y}" text-anchor="middle" dominant-baseline="central"
          font-family='${TYPEFACE}' font-weight="900" font-size="${slot.size}">${escapeXML(character)}</text>
      </clipPath>`;
    }).join("\n");

    return `<defs>
      <linearGradient id="word-count-emerald" x1=".03" y1=".03" x2=".93" y2="1">
        <stop offset="0" stop-color="#c7fff0"/>
        <stop offset=".17" stop-color="#64f4d1"/>
        <stop offset=".40" stop-color="#1fc4ac"/>
        <stop offset=".69" stop-color="#067c76"/>
        <stop offset=".89" stop-color="#085c65"/>
        <stop offset="1" stop-color="#a3fff0"/>
      </linearGradient>
      <linearGradient id="word-count-edge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ddfff8"/>
        <stop offset=".45" stop-color="#24d6bd"/>
        <stop offset="1" stop-color="#074b5a"/>
      </linearGradient>
      <linearGradient id="word-count-scan-glow" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#c7fff7" stop-opacity="0"/>
        <stop offset=".46" stop-color="#f3fffd" stop-opacity=".75"/>
        <stop offset=".53" stop-color="#c7fff7" stop-opacity=".95"/>
        <stop offset="1" stop-color="#b9fff0" stop-opacity="0"/>
      </linearGradient>
      <filter id="word-count-soft-halo" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      ${letterClips}
    </defs>`;
  }

  function cornerMarks(slot, mode) {
    const { x, y, size } = slot;
    const half = size * 0.66;
    const yhalf = size * .60;
    const corners = [
      { x: x - half, y: y - yhalf, dx: 1, dy: 1 },
      { x: x + half, y: y - yhalf, dx: -1, dy: 1 },
      { x: x - half, y: y + yhalf, dx: 1, dy: -1 },
      { x: x + half, y: y + yhalf, dx: -1, dy: -1 }
    ];
    const reach = mode === "vertical" ? 21 : 17;
    return `<g class="word-count-registration" fill="none" stroke="#259d97" stroke-width="2.2" opacity=".75">
      ${corners.map(c => `<path d="M${decimal(c.x)} ${decimal(c.y + c.dy * reach)} L${decimal(c.x)} ${decimal(c.y)} L${decimal(c.x + c.dx * reach)} ${decimal(c.y)}"/>`).join("\n")}
    </g>`;
  }

  function digitalLetter(character, slot, mode, animated) {
    const { x, y, size, index } = slot;
    const label = escapeXML(character);
    const outline = (dx, dy, attributes) => `<text x="${decimal(x + dx)}" y="${decimal(y + dy)}"
      font-family='${TYPEFACE}' font-weight="900" font-size="${size}"
      text-anchor="middle" dominant-baseline="central" paint-order="stroke fill"
      ${attributes}>${label}</text>`;
    const clip = `url(#word-count-glyph-${index})`;
    const left = x - size * .55;
    const top = y - size * .65;
    const span = size * 1.1;
    const lines = Array.from({ length: 16 }, (_, item) => {
      const lineY = top + item * (size * .083);
      return `<path d="M${decimal(left - 14)} ${decimal(lineY)} h${decimal(span + 28)}"
        fill="none" stroke="${item % 4 === 0 ? '#dafff5' : '#003b48'}"
        stroke-width="${item % 4 === 0 ? 2.2 : .95}" opacity="${item % 4 === 0 ? .54 : .20}"/>`;
    }).join("\n");
    const pixelDots = Array.from({ length: 28 }, (_, n) => {
      const col = n % 7;
      const row = Math.floor(n / 7);
      return `<rect x="${decimal(x - size*.4 + col*size*.12)}" y="${decimal(y - size*.36 + row*size*.24)}"
        width="${decimal(size*.024)}" height="${decimal(size*.024)}" rx=".8"
        fill="#dcfff7" opacity="${.16 + ((index + col) % 4)*.10}"/>`;
    }).join("\n");
    const beam = animated ? (mode === "vertical"
      ? `<rect x="${decimal(left - 18)}" y="${decimal(top - 24)}" width="${decimal(span + 38)}"
          height="${decimal(size*.30)}" fill="url(#word-count-scan-glow)" opacity=".9">
          <animate attributeName="y" values="${decimal(top - 40)};${decimal(top + size*1.3)};${decimal(top - 40)}"
            keyTimes="0;.72;1" dur="6s" begin="${index * .68}s" repeatCount="indefinite"/>
        </rect>`
      : `<rect x="${decimal(left - size*.22)}" y="${decimal(top - 24)}"
          width="${decimal(size*.22)}" height="${decimal(size*1.5)}"
          fill="#d5fff7" opacity=".52">
          <animate attributeName="x" values="${decimal(left - size*.22)};${decimal(left + span)};${decimal(left - size*.22)}"
            keyTimes="0;.72;1" dur="6s" begin="${index * .64}s" repeatCount="indefinite"/>
        </rect>`) : "";
    const underline = `<path d="M${decimal(x-size*.33)} ${decimal(y+size*.42)}
      H${decimal(x-size*.08)} m${decimal(size*.065)} 0 H${decimal(x+size*.37)}"
      fill="none" stroke="#c8fff5" stroke-width="2" opacity=".72"/>`;
    const dotX = x + size*.46;
    const dotY = y - size*.45;

    return `<g id="word-count-character-${index+1}">
      <!-- 字形以深層內芯與翡翠青綠雙層筆鋒構成；不是單純套材質色塊。 -->
      ${outline(8, 10, 'fill="#043e47" stroke="#043e47" stroke-width="23" stroke-linejoin="round"')}
      ${outline(3, 4, 'fill="#087c7c" stroke="#00525b" stroke-width="19" stroke-linejoin="round"')}
      ${outline(0, 0, 'fill="url(#word-count-emerald)" stroke="#00535d" stroke-width="14" stroke-linejoin="round"')}
      ${outline(0, 0, 'fill="none" stroke="url(#word-count-edge)" stroke-width="4" stroke-linejoin="round"')}
      <!-- 點陣標記、紋理與掃描只在文字筆畫內可見。 -->
      <g clip-path="${clip}">
        ${lines}
        ${pixelDots}
        ${beam}
      </g>
      ${underline}
      <circle cx="${decimal(dotX)}" cy="${decimal(dotY)}" r="7" fill="#d7fff6" stroke="#137d82" stroke-width="3"/>
      <circle cx="${decimal(dotX)}" cy="${decimal(dotY)}" r="13" fill="none"
        stroke="#3bdbca" stroke-width="1.5" opacity=".72">
        ${animated ? '<animate attributeName="r" values="12;19;12" dur="3.6s" repeatCount="indefinite"/>' : ''}
      </circle>
      ${cornerMarks(slot, mode)}
    </g>`;
  }

  function verticalUnits(chars, slots, animated) {
    return chars.map((character, index) => {
      const slot = slots[index];
      const { x, y, size } = slot;
      const code = character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
      const number = String(index+1).padStart(2, "0");
      const labelY = y + Math.min(82, size*.34);
      const yTop = y - size*.38;
      const yBottom = y + size*.40;
      const lit = animated ? `<circle cx="155" cy="${decimal(y)}" r="4" fill="#d0fff5">
        <animate attributeName="opacity" values=".15;1;.15" dur="4.8s" begin="${index*.72}s" repeatCount="indefinite"/>
      </circle>` : '';
      return `<g id="word-count-unit-${index+1}">
        <!-- 左側進度軸以刻度連至文字，右側 Unicode 資料對應輸入字元。 -->
        <path d="M155 ${decimal(yTop)} V${decimal(yBottom)}" fill="none"
          stroke="#168f90" stroke-width="2.5" opacity=".72"/>
        <path d="M145 ${decimal(y)} H${decimal(x-size*.71-15)}" fill="none"
          stroke="#2ebbb2" stroke-width="2" opacity=".70"/>
        <path d="M145 ${decimal(yTop)} h20 M145 ${decimal(yBottom)} h20"
          fill="none" stroke="#137d86" stroke-width="2" opacity=".68"/>
        ${Array.from({length:7},(_,n)=>`<path d="M${n%3===0?135:143} ${decimal(yTop+n*(yBottom-yTop)/6)} h${n%3===0?19:11}" fill="none" stroke="#40c5ba" stroke-width="1.1" opacity=".44"/>`).join('')}
        <text x="124" y="${decimal(y-14)}" text-anchor="end" font-size="19" letter-spacing=".08em"
          font-family='${DIGIT_FACE}' font-weight="700" fill="#0a6f74">${number}</text>
        ${lit}
        ${digitalLetter(character, slot, "vertical", animated)}
        <path d="M${decimal(x+size*.69+8)} ${decimal(y+size*.14)} H${decimal(x+size*.73+44)}"
          fill="none" stroke="#249994" stroke-width="2" opacity=".7"/>
        <circle cx="${decimal(x+size*.73+44)}" cy="${decimal(y+size*.14)}" r="3.5" fill="#44cfbf"/>
        <text x="${decimal(x+size*.73+42)}" y="${decimal(labelY+39)}" text-anchor="end"
          font-size="12.4" font-family='${DIGIT_FACE}' letter-spacing=".05em" fill="#0b7778">U+${code}</text>
      </g>`;
    }).join("\n");
  }

  function horizontalUnits(chars, slots, animated) {
    return chars.map((character, index) => {
      const slot = slots[index];
      const { x, y, size } = slot;
      const code = character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
      const number = String(index+1).padStart(2, "0");
      const t = y-size*.71;
      const bottom = y+size*.68;
      return `<g id="word-count-unit-${index+1}">
        <path d="M${decimal(x-size*.42)} ${decimal(t-15)} H${decimal(x+size*.46)}"
          fill="none" stroke="#258e8f" stroke-width="2" opacity=".66"/>
        <path d="M${decimal(x-size*.42)} ${decimal(t-22)} v14 M${decimal(x+size*.46)} ${decimal(t-22)} v14"
          fill="none" stroke="#2cb9af" stroke-width="2.3" opacity=".75"/>
        <text x="${decimal(x-size*.40)}" y="${decimal(t-26)}" font-size="18"
          font-family='${DIGIT_FACE}' font-weight="700" fill="#097579">${number}</text>
        ${digitalLetter(character, slot, "horizontal", animated)}
        <path d="M${decimal(x)} ${decimal(bottom-8)} v23" stroke="#2facab"
          stroke-width="2" opacity=".82"/>
        <circle cx="${decimal(x)}" cy="${decimal(bottom+16)}" r="4" fill="#0fb8a4"/>
        <text x="${decimal(x)}" y="${decimal(bottom+38)}" text-anchor="middle"
          font-family='${DIGIT_FACE}' font-size="13.3" letter-spacing=".04em" fill="#0a7779">U+${code}</text>
      </g>`;
    }).join("\n");
  }

  function topTelemetry(mode, count, animated) {
    const vertical = mode === "vertical";
    const edge = vertical ? 840 : 1200;
    const left = vertical ? 118 : 105;
    const right = edge-left;
    const labelY = vertical ? 65 : 78;
    const progressY = vertical ? 88 : 105;
    const sections = Array.from({length:20},(_,n) => {
      const total = right-left;
      const w = total/20;
      const alpha = n < count*5 ? .45+(n%4)*.12 : .19;
      return `<rect x="${decimal(left+n*w+1)}" y="${progressY}" width="${decimal(w-4)}"
        height="${n%5===0?7:4}" rx="1.5" fill="${n<count*5?'#159f9a':'#55b9ab'}"
        opacity="${decimal(alpha)}"/>`;
    }).join("\n");
    const caption = `<text x="${left}" y="${labelY}" font-family='${DIGIT_FACE}'
      font-size="14.5" font-weight="700" letter-spacing="1.5" fill="#09696f">TXT / ANALYSIS</text>
      <text x="${right}" y="${labelY}" text-anchor="end" font-family='${DIGIT_FACE}'
        font-size="14.5" letter-spacing="1.7" fill="#068b88">${String(count).padStart(2,'0')} UNITS</text>`;
    const pulse = animated ? `<circle cx="${right-99}" cy="${labelY-4}" r="3.5" fill="#1dccb8">
      <animate attributeName="opacity" values=".15;1;.15" dur="2.6s" repeatCount="indefinite"/>
    </circle>` : '';
    return `<g id="word-count-telemetry">${caption}${sections}${pulse}</g>`;
  }

  function bottomTelemetry(mode, count, animated) {
    const vertical = mode === 'vertical';
    const y = vertical ? 1131 : 689;
    const left = vertical ? 124 : 105;
    const right = vertical ? 712 : 1095;
    const terminalX = vertical ? 710 : 1090;
    const ready = String(count).padStart(3,'0');
    const countAnimation = animated ? `<text x="${terminalX}" y="${y+24}" text-anchor="end"
      font-family='${DIGIT_FACE}' font-size="25" letter-spacing=".08em" fill="#087b7a" opacity=".98">000
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.12;.24;1" dur="6s" repeatCount="indefinite"/>
      </text>
      <text x="${terminalX}" y="${y+24}" text-anchor="end"
        font-family='${DIGIT_FACE}' font-size="25" letter-spacing=".08em" fill="#087b7a" opacity="0">${ready}
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.12;.24;1" dur="6s" repeatCount="indefinite"/>
      </text>` : `<text x="${terminalX}" y="${y+24}" text-anchor="end" font-family='${DIGIT_FACE}'
        font-size="25" letter-spacing=".08em" fill="#087b7a">${ready}</text>`;
    return `<g id="word-count-counter">
      <path d="M${left} ${y} H${right}" fill="none" stroke="#237e82" stroke-width="1.7" opacity=".6"/>
      <path d="M${left} ${y-9} v18 M${right} ${y-9} v18" fill="none"
        stroke="#30a39d" stroke-width="2"/>
      <text x="${left}" y="${y+24}" font-family='${DIGIT_FACE}' font-size="13" letter-spacing=".07em"
        fill="#0b6d75">SCAN / COMPLETE</text>
      ${countAnimation}
    </g>`;
  }

  function createSVG(rawText, orientation = 'vertical', helpers, options = {}) {
    const mode = orientation === 'horizontal' ? 'horizontal' : 'vertical';
    const chars = splitCharacters(rawText, helpers);
    const animated = options.animated === true;
    const canvas = CANVAS[mode];
    const slots = positions(chars.length, mode);
    const details = mode === 'vertical'
      ? verticalUnits(chars, slots, animated)
      : horizontalUnits(chars, slots, animated);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"
      viewBox="0 0 ${canvas.width} ${canvas.height}" role="img"
      aria-label="${escapeXML(chars.join(''))}字數統計藝術字">
      ${definitions(chars, slots)}
      ${topTelemetry(mode, chars.length, animated)}
      <g id="word-count-parsed-glyphs">${details}</g>
      ${bottomTelemetry(mode, chars.length, animated)}
    </svg>`;
  }

  global.SlowlyWordCountVisual = Object.freeze({ canvas: CANVAS, createSVG });
})(window);
