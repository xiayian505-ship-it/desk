"use strict";
/* 黑羽舞動｜SVG 繪圖本體。靜態與動態輸出均自足，不依賴頁面 CSS。 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Noto Serif TC", "Songti TC", serif';
  const SIZES = Object.freeze({ vertical: [840, 1200], horizontal: [1200, 760] });
  const n = value => Math.round(value * 10) / 10;

  function positions(length, orientation) {
    if (orientation === 'vertical') {
      const maps = {
        1: { y: [620], size: 376 },
        2: { y: [402, 857], size: 306 },
        3: { y: [302, 637, 972], size: 263 },
        4: { y: [207, 474, 741, 1007], size: 231 }
      };
      const spec = maps[length];
      return spec.y.map(y => ({ x: 425, y, size: spec.size }));
    }
    const maps = {
      1: { x: [600], size: 370 },
      2: { x: [432, 768], size: 312 },
      3: { x: [319, 600, 881], size: 256 },
      4: { x: [226, 475, 724, 973], size: 223 }
    };
    const spec = maps[length];
    return spec.x.map(x => ({ x, y: 385, size: spec.size }));
  }

  // 黑色實心羽毛：完整封閉輪廓，筆管是極淡細線，隨機位置固定以免打字時閃爍。
  const FEATHER = 'M0 0 Q-13 -17 -19 -31 L-29 -32 L-18 -42 L-29 -49 L-14 -51 L-21 -63 L-7 -71 Q5 -93 12 -116 Q29 -91 27 -70 L36 -60 L25 -56 L34 -47 L20 -42 L24 -33 L13 -31 Q9 -13 0 0 Z';
  function feathers(orientation, count, animated) {
    const vertical = orientation === 'vertical';
    const layout = vertical ? [
      [230, 315, -32, .55], [619, 354, 54, .44], [145, 449, -62, .39], [667, 500, 36, .53],
      [224, 563, -20, .49], [573, 629, -43, .54], [95, 721, 41, .4], [670, 758, -14, .57],
      [205, 870, 53, .61], [609, 907, -61, .48], [115, 1010, -35, .55], [524, 1077, 23, .46],
      [291, 1144, -29, .42], [728, 1050, 38, .40], [370, 770, -70, .31], [497, 428, 75, .30],
      [325, 1010, 25, .32], [563, 1133, -60, .35], [725, 655, -24, .30], [162, 612, 58, .31]
    ] : [
      [110, 272, -40, .48], [295, 285, 43, .4], [487, 310, -59, .44], [740, 276, 66, .40],
      [1055, 293, -20, .53], [172, 403, 32, .46], [396, 454, -48, .51], [582, 487, 37, .44],
      [895, 434, -62, .58], [1100, 489, 28, .40], [146, 569, 53, .52], [313, 608, -27, .42],
      [548, 624, 26, .55], [764, 603, -42, .48], [1004, 645, 58, .48], [230, 707, -66, .36],
      [412, 710, 60, .30], [885, 702, -44, .35], [680, 367, 30, .3], [1097, 709, -25, .3]
    ];
    return layout.map(([x, y, rotate, scale], i) => {
      // 透明度高：黑灰羽毛像殘影，字始終是前景。
      const opacity = i % 4 === 0 ? .26 : i % 4 === 1 ? .19 : i % 4 === 2 ? .15 : .23;
      return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" opacity="${opacity}"${animated ? ` class="feather-drift" style="animation-delay:${n(i * .23)}s"` : ''}>
        <path d="${FEATHER}" fill="${i % 3 === 0 ? '#121316' : i % 3 === 1 ? '#34363b' : '#07090b'}" />
        <path d="M0 2 Q2 -42 12 -110" stroke="#a5a8ae" stroke-width="1.6" opacity=".48" fill="none"/>
      </g>`;
    }).join('');
  }

  function scatter(orientation, animated) {
    const vertical = orientation === 'vertical';
    const coords = vertical ? [
      [155, 256, 2], [675, 311, 3], [204, 493, 1.9], [613, 531, 2.3], [119, 664, 2.5],
      [706, 715, 1.6], [196, 822, 2.1], [565, 885, 3], [179, 1095, 2.6], [672, 1070, 2.3],
      [341, 386, 1.8], [518, 982, 2.2], [754, 854, 1.4], [279, 1180, 1.5], [618, 1184, 1.9]
    ] : [
      [93, 236, 2.3], [283, 301, 1.7], [524, 284, 2.8], [746, 313, 1.9], [1046, 241, 2.4],
      [103, 467, 2.3], [349, 503, 1.8], [574, 497, 2.5], [907, 500, 2.1], [1102, 482, 2.8],
      [169, 658, 1.7], [478, 687, 2.1], [778, 657, 1.7], [1031, 689, 2.8], [644, 359, 1.5]
    ];
    return coords.map(([cx, cy, r], i) => {
      const fill = i % 3 === 0 ? '#8b8d92' : i % 3 === 1 ? '#35373e' : '#e9eaf0';
      const attrs = animated ? `<animate attributeName="cy" values="${cy - 48};${cy + 70}" dur="${n(3.4 + (i % 4) * .55)}s" begin="-${n(i % 7 * .39)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.58;.24;0" keyTimes="0;.15;.75;1" dur="${n(3.4 + (i % 4) * .55)}s" begin="-${n(i % 7 * .39)}s" repeatCount="indefinite"/>` : '';
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${n(.22 + (i % 4) * .08)}">${attrs}</circle>`;
    }).join('');
  }

  // 單一道雙箭頭穿過文字前景。起點靠第一字上方，終點落於最後一字下方。
  function doubleArrow(slots, orientation) {
    const vertical = orientation === 'vertical';
    let x1, y1, x2, y2;
    if (vertical) {
      x1 = 574; y1 = Math.max(32, slots[0].y - slots[0].size * .96);
      x2 = 235; y2 = Math.min(1182, slots[slots.length - 1].y + slots[0].size * .74);
    } else {
      x1 = Math.max(48, slots[0].x - slots[0].size * .78);
      y1 = 197;
      x2 = Math.min(1165, slots[slots.length - 1].x + slots[0].size * .77);
      y2 = 549;
    }
    // 在字前方的一條輕微彎曲的斜箭線，雙頭不是分離線。
    const cx = vertical ? (x1 + x2) / 2 + 75 : (x1 + x2) / 2 + 8;
    const cy = vertical ? (y1 + y2) / 2 : (y1 + y2) / 2 - 44;
    const path = `M${n(x1)} ${n(y1)} Q${n(cx)} ${n(cy)} ${n(x2)} ${n(y2)}`;
    function head(x, y, angle, length) {
      const wing = .49;
      return `<path d="M${n(x + Math.cos(angle + wing) * length)} ${n(y + Math.sin(angle + wing) * length)} L${n(x)} ${n(y)} L${n(x + Math.cos(angle - wing) * length)} ${n(y + Math.sin(angle - wing) * length)}" fill="none" stroke="url(#arrowLight)" stroke-width="5.7" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    // 兩端箭頭的折線都朝向筆畫內側回收，形成真正的雙向箭頭。
    const initial = Math.atan2(cy - y1, cx - x1);
    const ending = Math.atan2(cy - y2, cx - x2);
    return `<g class="feather-double-arrow">
      <path d="${path}" stroke="#050608" stroke-width="11" opacity=".32" fill="none" stroke-linecap="round" transform="translate(4 5)"/>
      <path d="${path}" stroke="url(#arrowInk)" stroke-width="5.6" fill="none" stroke-linecap="round"/>
      <path d="${path}" stroke="#f5f6fa" stroke-width="1.25" fill="none" opacity=".75" stroke-linecap="round"/>
      ${head(x1, y1, initial, 25)}
      ${head(x2, y2, ending, 25)}
    </g>`;
  }

  function createSVG(raw, orientation, helpers, options = {}) {
    const dims = SIZES[orientation];
    if (!dims) throw new Error('無效的排列方式。');
    const characters = helpers.splitCharacters(raw).slice(0, 4);
    if (!characters.length) throw new Error('請輸入至少一個字。');
    const [width, height] = dims;
    const escape = helpers.escapeXML;
    const title = escape(characters.join(''));
    const slots = positions(characters.length, orientation);
    const font = escape(FONT);
    const attrs = (slot, char) => `x="${slot.x}" y="${slot.y}" font-size="${slot.size}" text-anchor="middle" dominant-baseline="central" font-weight="700" font-family="${font}" paint-order="stroke fill"`;
    const glyphs = characters.map((char, i) => `<text ${attrs(slots[i], char)}>${escape(char)}</text>`).join('');
    const staticFeathers = feathers(orientation, characters.length, !!options.animated);
    const staticParticles = scatter(orientation, !!options.animated);
    const arrow = doubleArrow(slots, orientation);
    const motion = options.animated ? `<style>
      @keyframes shimmer { to { transform: translate(620px, 0); } }
      @keyframes featherFloat { 0%,100% { opacity: .9; } 50% { opacity: .5; } }
      .feather-drift { animation: featherFloat 4.5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) { .feather-drift { animation: none; } }
    </style>` : '';
    // SVG Shine Text：CSS background-clip:text 不適用離線匯出，改在 SVG 色彩填色內定義同一段流動亮帶。
    const shine = options.animated ? `<animateTransform attributeName="gradientTransform" type="translate" values="-310 0;410 0;-310 0" dur="6.5s" repeatCount="indefinite"/>` : '';
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="featherTitle featherDesc">
 <title id="featherTitle">${title}｜黑羽舞動</title>
 <desc id="featherDesc">黑灰銀白炫彩字體、雙層錯位斷裂輪廓、貫穿文字的斜向雙箭頭、大片錯位黑羽、銀灰粒子雨。透明背景，自足 SVG。</desc>
 ${motion}
 <defs>
   <linearGradient id="shineInk" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
     <stop offset="0" stop-color="#131419"/><stop offset=".18" stop-color="#555761"/><stop offset=".36" stop-color="#f5f6fc"/>
     <stop offset=".49" stop-color="#a5a8b7"/><stop offset=".57" stop-color="#e2daed"/><stop offset=".66" stop-color="#6a7680"/>
     <stop offset=".79" stop-color="#f9fafc"/><stop offset="1" stop-color="#151519"/>${shine}
   </linearGradient>
   <linearGradient id="rimInk" x1="0" y1="0" x2="1" y2="1">
     <stop offset="0" stop-color="#15161b"/><stop offset=".22" stop-color="#f4f5f7"/><stop offset=".47" stop-color="#5c606a"/>
     <stop offset=".74" stop-color="#e7e7f0"/><stop offset="1" stop-color="#101216"/>
   </linearGradient>
   <linearGradient id="arrowInk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#181a20"/><stop offset=".4" stop-color="#b5b9c4"/><stop offset=".65" stop-color="#f1f2f6"/><stop offset="1" stop-color="#101116"/></linearGradient>
   <linearGradient id="arrowLight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16171b"/><stop offset=".6" stop-color="#e7e8ec"/><stop offset="1" stop-color="#3b3e46"/></linearGradient>
   <filter id="glyphShadow" x="-25%" y="-25%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
 </defs>
 <!-- 每一筆裝飾都在 SVG 本體；沒有背景矩形或外部資源。 -->
 <g id="black-feathers">${staticFeathers}</g>
 <g id="silver-rain-particles">${staticParticles}</g>
 <g id="glyph-shadow" fill="#09090c" opacity=".26" filter="url(#glyphShadow)" transform="translate(12 17)">${glyphs}</g>
 <g id="glyph-base" fill="url(#shineInk)" stroke="#1a1a20" stroke-width="13" stroke-linejoin="round">${glyphs}</g>
 <!-- 70% 可視的斷續外框：兩層相位錯開，借鑑 Minimal Underline 的線長比例與展開機制。 -->
 <g id="outer-broken-outline" fill="none" stroke="#f9f9fc" stroke-width="5.3" stroke-dasharray="72 32 70 32" stroke-dashoffset="17" opacity=".87" stroke-linecap="butt" stroke-linejoin="round">${glyphs}${options.animated ? `<animate attributeName="stroke-dashoffset" values="17;-143" dur="13s" repeatCount="indefinite"/>` : ''}</g>
 <g id="inner-broken-outline" fill="none" stroke="#181920" stroke-width="2.4" stroke-dasharray="46 20 80 32" stroke-dashoffset="72" opacity=".88" stroke-linecap="butt" stroke-linejoin="round">${glyphs}${options.animated ? `<animate attributeName="stroke-dashoffset" values="72;232" dur="15s" repeatCount="indefinite"/>` : ''}</g>
 <g id="inner-silver-cut" fill="none" stroke="#dfe1e9" stroke-width="1.1" stroke-dasharray="77 24 61 36" stroke-dashoffset="47" opacity=".75" stroke-linecap="round">${glyphs}</g>
 ${arrow}
</svg>`;
  }
  global.SlowlyFeatherVisual = Object.freeze({ createSVG, font: FONT });
})(window);
