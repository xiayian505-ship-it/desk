"use strict";
/* 靜默餘響｜專屬 SVG 繪圖模板
 * 藍鈴花由 path、ellipse、line、circle 等向量圖形構成，不使用圖片素材。
 * 直式、橫式分別繪圖；靜態與動態 SVG 共用相同作品圖層。
 * 軍火庫 CSS 仍由作品頁以正式 HTTPS 引用，離線匯出則以原生 SVG 表現。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Noto Serif TC", "Songti TC", serif';
  const SIZES = Object.freeze({ vertical: [840, 1200], horizontal: [1200, 760] });
  const round = value => Number(value.toFixed(2));

  function positions(count, vertical) {
    if (vertical) {
      const specs = {
        1: { ys: [604], size: 340 },
        2: { ys: [411, 818], size: 296 },
        3: { ys: [295, 610, 929], size: 259 },
        4: { ys: [211, 470, 730, 989], size: 218 }
      };
      const spec = specs[count];
      return spec.ys.map(y => ({ x: 409, y, size: spec.size }));
    }
    const specs = {
      1: { xs: [600], size: 360 },
      2: { xs: [427, 774], size: 309 },
      3: { xs: [316, 600, 884], size: 256 },
      4: { xs: [220, 472, 728, 981], size: 211 }
    };
    const spec = specs[count];
    return spec.xs.map(x => ({ x, y: 367, size: spec.size }));
  }

  // 每個鈴鐺的花冠、五枚略外翻的瓣緣、花蕊與細脈都是獨立向量。
  // 局部座標：花梗接點 (0,0)，鈴鐺向下開口。
  function bell({ x, y, size = 1, tilt = 0, tone = 0 }, animated, index) {
    const palettes = [
      ['url(#bellPetal)', '#a5a7d9'],
      ['url(#bellPetalPale)', '#b6b6e0'],
      ['url(#bellPetalDeep)', '#848fc3']
    ];
    const [fill, edge] = palettes[tone % palettes.length];
    const sway = animated
      ? `<animateTransform attributeName="transform" type="rotate" values="0 0 0;${index % 2 ? -3 : 3} 0 0;0 0 0" dur="${round(5.2 + index * .37)}s" begin="-${round(index * .41)}s" repeatCount="indefinite" additive="sum"/>`
      : '';
    return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${size})">
      <g>${sway}
        <path d="M-5 0 Q0 -10 5 0 L5 10 Q0 16 -5 10 Z" fill="#829c91" opacity=".85"/>
        <path d="M-6 9 C-16 15 -21 32 -23 49 C-23 57 -30 64 -36 62
                 C-33 76 -21 80 -15 65 C-12 75 -5 80 0 67
                 C6 79 15 76 17 64 C26 78 37 71 38 60
                 C28 65 26 55 23 46 C20 29 15 17 6 9
                 Q0 13 -6 9 Z" fill="${fill}" stroke="#7d8fb9" stroke-width="1.7" stroke-linejoin="round"/>
        <path d="M-6 12 C-15 25 -16 44 -15 61 C-13 68 -18 77 -23 75" fill="none" stroke="${edge}" stroke-width="2.7" opacity=".76" stroke-linecap="round"/>
        <path d="M2 12 C-2 29 -3 47 0 65 C1 72 -2 76 -5 76" fill="none" stroke="#e5e4fc" stroke-width="2.6" opacity=".68" stroke-linecap="round"/>
        <path d="M9 14 C16 33 15 47 17 60 C20 71 27 73 31 67" fill="none" stroke="#737fba" stroke-width="2" opacity=".65" stroke-linecap="round"/>
        <path d="M-14 52 Q0 59 19 51" fill="none" stroke="#f3f1ff" stroke-width="1.6" opacity=".6"/>
        <path d="M0 64 Q2 70 0 81" fill="none" stroke="#ece8cd" stroke-width="1.6" opacity=".62"/>
        <ellipse cx="0" cy="83" rx="2.3" ry="3.5" fill="#dad7ac" opacity=".78"/>
      </g>
    </g>`;
  }

  function bud(x, y, rotate, scale = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})">
      <path d="M0 0 C-10 9 -11 23 0 34 C11 23 10 9 0 0 Z" fill="url(#budFill)" stroke="#92a3bf" stroke-width="1.5"/>
      <path d="M0 4 Q-4 18 0 30" fill="none" stroke="#e9e8fa" stroke-width="1.6" opacity=".8"/>
    </g>`;
  }

  // 花枝的曲線是自行繪製的貝茲曲線，不使用圖片、Canvas 或外部素材。
  // flowers 中每朵都有自己的花梗，花序隨主莖柔和下垂。
  function bloomSpray(spec, animated, label) {
    const { stem, twigs, bells, buds, transform = '' } = spec;
    const connections = twigs.map(d => `<path d="${d}" stroke="url(#stemShine)" stroke-width="2.7" fill="none" stroke-linecap="round"/>`).join('');
    const blossom = bells.map((item, index) => bell(item, animated, index)).join('');
    const immature = buds.map(item => bud(...item)).join('');
    return `<g id="${label}" ${transform ? `transform="${transform}"` : ''}>
      <path d="${stem}" stroke="#4e6f6c" stroke-width="7.5" fill="none" stroke-linecap="round" opacity=".21"/>
      <path d="${stem}" stroke="url(#stemShine)" stroke-width="3.7" fill="none" stroke-linecap="round"/>
      ${connections}${immature}${blossom}
    </g>`;
  }

  // 藍鈴花改為直接貼近文字下方：不再遠距離垂掛，而是像花枝托住文字。
  function verticalFlowerSpecs(slots) {
    return slots.map((slot, index) => {
      const width = slot.size * 0.70;
      const baseY = slot.y + slot.size * 0.39;
      const centerX = slot.x + (index % 2 ? 10 : -10);
      const left = round(centerX - width * 0.52);
      const midL = round(centerX - width * 0.27);
      const midR = round(centerX + width * 0.08);
      const right = round(centerX + width * 0.42);
      const stem = `M${left} ${round(baseY)} C${round(centerX - width * 0.26)} ${round(baseY + 4)} ${round(centerX - width * 0.02)} ${round(baseY + 6)} ${right} ${round(baseY - 2)}`;
      const twigs = [
        `M${midL} ${round(baseY + 4)} Q${round(midL - 4)} ${round(baseY + 20)} ${round(midL - 7)} ${round(baseY + 34)}`,
        `M${round(centerX)} ${round(baseY + 7)} Q${round(centerX + 2)} ${round(baseY + 25)} ${round(centerX + 4)} ${round(baseY + 40)}`,
        `M${midR} ${round(baseY + 3)} Q${round(midR + 4)} ${round(baseY + 18)} ${round(midR + 8)} ${round(baseY + 31)}`
      ];
      const bells = [
        { x: round(midL - 9), y: round(baseY + 33), size: .48 + (index % 2) * .02, tilt: 16, tone: index % 3 },
        { x: round(centerX + 4), y: round(baseY + 40), size: .55, tilt: -3, tone: (index + 1) % 3 },
        { x: round(midR + 10), y: round(baseY + 31), size: .46, tilt: -18, tone: (index + 2) % 3 }
      ];
      const buds = [
        [round(left - 4), round(baseY), -18, .39],
        [round(right + 3), round(baseY - 2), 16, .36]
      ];
      return { stem, twigs, bells, buds };
    });
  }

  function horizontalFlowerSpecs(slots) {
    const first = slots[0];
    const last = slots[slots.length - 1];
    const baseY = round(first.y + first.size * 0.39);
    const left = round(first.x - first.size * 0.48);
    const right = round(last.x + last.size * 0.48);
    const span = right - left;
    const centers = slots.map(slot => round(slot.x));
    const main = {
      stem: `M${left} ${baseY} C${round(left + span * 0.22)} ${round(baseY + 8)} ${round(left + span * 0.48)} ${round(baseY + 10)} ${right} ${round(baseY)}`,
      twigs: centers.map((cx, i) => `M${cx} ${round(baseY + (i % 2 ? 5 : 3))} Q${round(cx + (i % 2 ? -4 : 4))} ${round(baseY + 18)} ${round(cx + (i % 2 ? -10 : 10))} ${round(baseY + 35 + (i % 2 ? 6 : 0))}`),
      bells: centers.map((cx, i) => ({ x: round(cx + (i % 2 ? -10 : 10)), y: round(baseY + 34 + (i % 2 ? 6 : 0)), size: .50 + ((i + 1) % 2) * .03, tilt: i % 2 ? 16 : -16, tone: i % 3 })),
      buds: [[left + 8, baseY, -18, .40], [right - 8, baseY, 18, .40]]
    };
    const side = {
      stem: `M${round(left + span * 0.18)} ${round(baseY + 31)} C${round(left + span * 0.34)} ${round(baseY + 43)} ${round(left + span * 0.60)} ${round(baseY + 39)} ${round(left + span * 0.77)} ${round(baseY + 29)}`,
      twigs: [
        `M${round(left + span * 0.34)} ${round(baseY + 40)} Q${round(left + span * 0.33)} ${round(baseY + 54)} ${round(left + span * 0.30)} ${round(baseY + 66)}`,
        `M${round(left + span * 0.59)} ${round(baseY + 39)} Q${round(left + span * 0.61)} ${round(baseY + 55)} ${round(left + span * 0.64)} ${round(baseY + 67)}`
      ],
      bells: [
        { x: round(left + span * 0.30), y: round(baseY + 66), size: .44, tilt: 14, tone: 1 },
        { x: round(left + span * 0.64), y: round(baseY + 67), size: .44, tilt: -16, tone: 2 }
      ],
      buds: []
    };
    return [main, side];
  }
  function flowers(orientation, animated, slots) {
    const specs = orientation === 'vertical' ? verticalFlowerSpecs(slots) : horizontalFlowerSpecs(slots);
    return specs.map((spray, i) => bloomSpray(spray, animated, `bluebell-spray-${i + 1}`)).join('');
  }

  function echoes(orientation, animated) {
    const paths = orientation === 'vertical' ? [
      ['M580 160 C544 205 553 264 570 309', .42],
      ['M572 335 C556 403 567 442 584 487', .34],
      ['M246 756 C270 801 264 855 252 902', .36],
      ['M213 966 C233 1000 227 1041 207 1080', .23]
    ] : [
      ['M260 180 C330 161 370 174 422 177', .33],
      ['M455 176 C504 174 532 187 575 192', .20],
      ['M742 588 C807 575 831 567 871 550', .33],
      ['M490 584 C548 593 592 585 626 574', .22]
    ];
    return `<g id="gentle-echoes" fill="none" stroke-linecap="round">
      ${paths.map(([d, opacity], i) => `<path d="${d}" stroke="url(#echoFade)" stroke-width="${i % 2 ? 1.6 : 2.2}" opacity="${opacity}">${animated ? `<animate attributeName="opacity" values="${opacity};${round(opacity * .42)};${opacity}" dur="${5.6 + i * .8}s" repeatCount="indefinite"/>` : ''}</path>`).join('')}
    </g>`;
  }

  function particles(orientation, animated) {
    const points = orientation === 'vertical' ? [
      [589, 176, 3.5], [614, 299, 2.1], [770, 333, 2.5], [589, 454, 3],
      [765, 537, 2], [618, 686, 2.4], [226, 743, 2.4], [206, 886, 2],
      [248, 958, 3.2], [190, 1097, 2], [546, 1045, 1.9], [527, 250, 2]
    ] : [
      [70, 291, 2.3], [269, 238, 3], [96, 388, 2], [263, 440, 2.5],
      [1004, 494, 2.7], [1143, 476, 2.2], [864, 592, 2.1], [813, 713, 2.4],
      [596, 174, 2], [735, 606, 2.4], [424, 562, 1.9], [1068, 693, 2]
    ];
    return `<g id="floating-silver-motes">
      ${points.map(([cx, cy, radius], i) => {
        const opacity = round(.24 + (i % 4) * .08);
        const duration = round(4.1 + (i % 5) * .57);
        const animation = animated ? `<animate attributeName="cy" values="${cy};${cy - 15};${cy}" dur="${duration}s" begin="-${round(i * .31)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="${opacity};${round(opacity * .30)};${opacity}" dur="${duration}s" begin="-${round(i * .31)}s" repeatCount="indefinite"/>` : '';
        return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${i % 2 ? '#cad2ec' : '#f6f8ff'}" opacity="${opacity}">${animation}</circle>`;
      }).join('')}
    </g>`;
  }

  function createSVG(input, orientation, helpers, options = {}) {
    if (!Object.prototype.hasOwnProperty.call(SIZES, orientation)) throw new Error('不支援此文字排列方式。');
    const chars = helpers.splitCharacters(input).slice(0, 4);
    if (!chars.length) throw new Error('請輸入至少一個字。');
    const vertical = orientation === 'vertical';
    const [width, height] = SIZES[orientation];
    const animated = options.animated === true;
    const slots = positions(chars.length, vertical);
    const esc = helpers.escapeXML;
    const glyphs = chars.map((char, i) => {
      const slot = slots[i];
      return `<text x="${slot.x}" y="${slot.y}" font-size="${slot.size}" text-anchor="middle" dominant-baseline="central" font-family="${esc(FONT)}" font-weight="700" paint-order="stroke fill">${esc(char)}</text>`;
    }).join('');
    const widthStroke = vertical ? 8 : 7;
    const gradientMotion = animated ? `<animateTransform attributeName="gradientTransform" type="translate" values="-80 0;140 0;-80 0" dur="19s" repeatCount="indefinite"/>` : '';
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="bluebellTitle bluebellDescription">
  <title id="bluebellTitle">${esc(chars.join(''))}｜靜默餘響</title>
  <desc id="bluebellDescription">英國藍鈴花沿文字側邊低垂，花瓣全由 SVG 曲線繪製；霧藍銀白漸層主字、微光粒子及漸隱聲音線條。透明背景。</desc>
  <defs>
    <linearGradient id="quietInk" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#607990"/>
      <stop offset=".19" stop-color="#c5d3e2"/>
      <stop offset=".37" stop-color="#f4f5fa"/>
      <stop offset=".57" stop-color="#859bb1"/>
      <stop offset=".72" stop-color="#d9e3f0"/>
      <stop offset="1" stop-color="#667d9b"/>
      ${gradientMotion}
    </linearGradient>
    <linearGradient id="bellPetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e0ddfa"/><stop offset=".42" stop-color="#a6a5d7"/><stop offset="1" stop-color="#687db5"/>
    </linearGradient>
    <linearGradient id="bellPetalPale" x1="0" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#f0eaff"/><stop offset=".47" stop-color="#b5b0dc"/><stop offset="1" stop-color="#8698c7"/>
    </linearGradient>
    <linearGradient id="bellPetalDeep" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c8c7ec"/><stop offset=".53" stop-color="#8895c7"/><stop offset="1" stop-color="#6777ac"/>
    </linearGradient>
    <linearGradient id="stemShine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#94aca2"/><stop offset=".5" stop-color="#537d76"/><stop offset="1" stop-color="#b5c7b5"/>
    </linearGradient>
    <linearGradient id="budFill" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c5cee7"/><stop offset="1" stop-color="#708bae"/>
    </linearGradient>
    <linearGradient id="echoFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9db4bf" stop-opacity="0"/>
      <stop offset=".45" stop-color="#7c95b5" stop-opacity=".85"/>
      <stop offset="1" stop-color="#93b1c4" stop-opacity="0"/>
    </linearGradient>
    <filter id="quietShadow" x="-20%" y="-20%" width="145%" height="145%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
  </defs>
  <!-- 所有視覺內容皆存在於 SVG 本體；沒有任何圖片檔或外部 CSS 相依。 -->
  ${echoes(orientation, animated)}
  <g id="quiet-glyph-shadow" fill="#4b607c" opacity=".16" filter="url(#quietShadow)" transform="translate(7 9)">${glyphs}</g>
  <g id="quiet-glyphs" fill="url(#quietInk)" stroke="#4e647e" stroke-width="${widthStroke}" stroke-linejoin="round">${glyphs}</g>
  <g id="outer-silver-outline" fill="none" stroke="#e6edf6" stroke-width="3" stroke-linejoin="round" stroke-dasharray="91 26 73 34" stroke-dashoffset="14" opacity=".87">${glyphs}</g>
  <g id="inner-blue-outline" fill="none" stroke="#7895b2" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="79 32 56 28" stroke-dashoffset="61" opacity=".75">${glyphs}</g>
  ${flowers(orientation, animated, slots)}
  ${particles(orientation, animated)}
</svg>`;
  }

  global.SlowlyBluebellVisual = Object.freeze({ createSVG, font: FONT });
})(window);
