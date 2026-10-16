"use strict";
/* ========================================================================
 * 投我一票｜專屬 SVG 藝術字模板
 * 主體：飽和鮮黃的漫畫立體字；配合重描邊、錯位色塊與輕微的跳字韻律。
 * 畫面：笑臉投票箱、打勾選票、卡通爆炸星、紙彩帶與彎曲動勢線。
 * 所有畫面元素都在 SVG 中，網頁棋盤格只作透明背景辨認用。
 * ======================================================================== */
(function (global) {
  const CANVAS = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });
  const LETTER_FONT = "Arial Rounded MT Bold, Noto Sans CJK TC, Noto Sans TC, Microsoft JhengHei, sans-serif";
  const PALETTE = Object.freeze({
    outline: "#25204e",
    purple: "#7357c8",
    pink: "#f85b8c",
    aqua: "#40d6c5",
    white: "#fff9e7",
    orange: "#f99516"
  });

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[ch]));
  }

  // 製作重點：字數少時放大主體，保留投票箱與動線的構圖位置。
  function createSlots(length, mode) {
    const tilt = [-5, 5, -4, 5];
    if (mode === "vertical") {
      const patterns = {
        1: { y: [584], size: 304 },
        2: { y: [433, 738], size: 246 },
        3: { y: [336, 574, 806], size: 203 },
        4: { y: [280, 475, 670, 866], size: 182 }
      };
      const preset = patterns[length];
      return preset.y.map((y, index) => ({
        x: 417 + (length === 1 ? 0 : [-23, 19, -17, 23][index]),
        y, size: preset.size, tilt: tilt[index]
      }));
    }
    const patterns = {
      1: { x: [600], size: 350 },
      2: { x: [408, 788], size: 284 },
      3: { x: [270, 596, 920], size: 235 },
      4: { x: [182, 460, 738, 1014], size: 204 }
    };
    const preset = patterns[length];
    return preset.x.map((x, index) => ({
      x, y: 361 + (length === 1 ? 0 : [-9, 15, -7, 11][index]),
      size: preset.size, tilt: tilt[index]
    }));
  }

  function spark(x, y, scale, fill, angle = 0, animated = false) {
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" fill="${fill}"
      stroke="${PALETTE.outline}" stroke-width="4.6" stroke-linejoin="round">
      <path d="M0 -29 L9 -9 L32 0 L9 9 L0 30 L-9 9 L-32 0 L-9 -9 Z"/>
      ${animated ? '<animateTransform attributeName="transform" type="rotate" additive="sum" values="0;16;0;-16;0" dur="3.2s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  function burst(x, y, scale, angle, color) {
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"
        fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round">
      <path d="M-50 -13 L-80 -24 M-55 14 L-89 23 M-4 -46 L-4 -78 M27 -43 L43 -70 M38 33 L61 53"/>
    </g>`;
  }

  function confetti(mode, animated) {
    const isVertical = mode === "vertical";
    const width = CANVAS[mode].width;
    const height = CANVAS[mode].height;
    const colors = ["#f9768f", "#53cfc8", "#ffb822", "#a686e4", "#fff7e0"];
    let bits = "";
    for (let i = 0; i < 41; i += 1) {
      const x = 49 + ((i * 179 + 71) % (width - 98));
      const y = 52 + ((i * 137 + 29) % (height - 104));
      // 中央字形區少放雜物，避免把漢字變成彩紙堆。
      if (isVertical && x > 245 && x < 595 && y > 165 && y < 993) continue;
      if (!isVertical && x > 135 && x < 1065 && y > 195 && y < 505) continue;
      const color = colors[i % colors.length];
      const angle = (i * 29) % 120;
      const rotate = animated ? `<animateTransform attributeName="transform" type="rotate" additive="sum"
        values="0;28;0" dur="${3 + (i % 5)}s" begin="-${i % 3}s" repeatCount="indefinite"/>` : "";
      bits += `<g transform="translate(${x} ${y}) rotate(${angle})">
        <rect x="-6" y="-3" width="12" height="6" rx="2" fill="${color}" stroke="${PALETTE.outline}" stroke-width="1.3"/>
        ${rotate}
      </g>`;
    }
    return `<g id="ballot-confetti">${bits}</g>`;
  }

  function swoosh(mode, animated) {
    const isVertical = mode === "vertical";
    const primary = isVertical
      ? "M115 309 C62 484 107 736 205 920 S438 1048 535 1059"
      : "M96 531 C280 623 470 561 610 546 C782 527 971 624 1115 514";
    const secondary = isVertical
      ? "M659 218 C758 376 741 665 655 837"
      : "M101 216 Q228 156 368 180 M843 187 Q1006 127 1124 241";
    return `<g fill="none" stroke-linecap="round">
       <path d="${primary}" stroke="${PALETTE.outline}" stroke-width="17" opacity=".94"/>
       <path d="${primary}" stroke="#ffffff" stroke-width="11" stroke-dasharray="28 21" opacity=".98">
          ${animated ? '<animate attributeName="stroke-dashoffset" values="0;-196" dur="3s" repeatCount="indefinite"/>' : ''}
       </path>
       <path d="${secondary}" stroke="#7c58d0" stroke-width="6" stroke-dasharray="5 17" opacity=".75"/>
     </g>`;
  }

  function glowBlobs(mode) {
    if (mode === "vertical") {
      return `<g opacity=".87">
        <ellipse cx="410" cy="568" rx="250" ry="452" fill="#fff0a2" opacity=".28"/>
        <circle cx="188" cy="575" r="71" fill="#fcaacc" opacity=".52"/>
        <circle cx="648" cy="451" r="77" fill="#80e6da" opacity=".58"/>
        <circle cx="682" cy="878" r="66" fill="#efd8ff" opacity=".69"/>
      </g>`;
    }
    return `<g opacity=".85">
      <ellipse cx="604" cy="360" rx="532" ry="216" fill="#fff1a6" opacity=".28"/>
      <circle cx="265" cy="484" r="60" fill="#fcaacc" opacity=".54"/>
      <circle cx="967" cy="242" r="73" fill="#8fe9d9" opacity=".55"/>
      <circle cx="615" cy="182" r="51" fill="#dec9fd" opacity=".59"/>
    </g>`;
  }

  function checkMark(x, y, scale = 1) {
    return `<path d="M${x-15*scale} ${y} L${x-3*scale} ${y+12*scale} L${x+19*scale} ${y-17*scale}"
      fill="none" stroke="#208472" stroke-width="${6 * scale}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  function ballotBox(x, y, scale, animated) {
    // 嗨！笑臉票箱和打勾選票屬於作品圖層，因此所有下載模式都保留它們。
    return `<g id="ballot-box" transform="translate(${x} ${y}) scale(${scale})">
      <g id="ballot-paper" transform="translate(7 -79) rotate(-16)">
        <rect x="-35" y="-56" width="70" height="82" rx="7" fill="#fffef8"
          stroke="${PALETTE.outline}" stroke-width="7"/>
        <path d="M-21 -33 H19 M-21 -21 H14" stroke="#b9aee3" stroke-width="5" stroke-linecap="round"/>
        ${checkMark(0, 1, 1)}
        ${animated ? '<animateTransform attributeName="transform" type="translate" additive="sum" values="0 -15;0 5;0 -15" dur="1.8s" repeatCount="indefinite"/>' : ''}
      </g>
      <g id="ballot-box-body">
        <path d="M-86 -51 L76 -51 L96 -20 L-102 -20 Z" fill="#8065d8" stroke="${PALETTE.outline}" stroke-width="8" stroke-linejoin="round"/>
        <path d="M-79 -21 H82 Q94 -21 94 -7 V97 Q94 111 80 111 H-77 Q-91 111 -91 97 V-7 Q-91 -21 -79 -21Z"
          fill="url(#ballotBoxColor)" stroke="${PALETTE.outline}" stroke-width="9"/>
        <path d="M-73 -6 H-49 M62 -6 H75" stroke="#fdf8f2" stroke-width="6" stroke-linecap="round"/>
        <rect x="-42" y="-42" width="84" height="12" rx="6" fill="${PALETTE.outline}"/>
        <g id="ballot-box-face">
          <ellipse cx="-28" cy="35" rx="9" ry="12" fill="${PALETTE.outline}"/>
          <ellipse cx="29" cy="35" rx="9" ry="12" fill="${PALETTE.outline}"/>
          <ellipse cx="-52" cy="53" rx="14" ry="7" fill="#f77c98"/>
          <ellipse cx="53" cy="53" rx="14" ry="7" fill="#f77c98"/>
          <path d="M-17 65 Q0 84 18 64" fill="none" stroke="${PALETTE.outline}" stroke-width="7" stroke-linecap="round"/>
        </g>
        <path d="M-61 93 H62" stroke="#a392ec" stroke-width="5" opacity=".75" stroke-linecap="round"/>
      </g>
      ${animated ? '<animateTransform attributeName="transform" type="rotate" additive="sum" values="-3;2;-3" dur="2.4s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  function noteSticker(mode, animated) {
    const x = mode === "vertical" ? 165 : 148;
    const y = mode === "vertical" ? 153 : 135;
    const sc = mode === "vertical" ? 1.02 : 1.08;
    return `<g id="ballot-mini-vote-sticker" transform="translate(${x} ${y}) rotate(-12) scale(${sc})">
      <rect x="-62" y="-49" width="124" height="98" rx="23" fill="#ffffff" stroke="${PALETTE.outline}" stroke-width="8"/>
      <rect x="-51" y="-39" width="102" height="78" rx="17" fill="#fff0a0"/>
      <circle cx="-23" cy="0" r="19" fill="#ffffff" stroke="${PALETTE.outline}" stroke-width="5"/>
      ${checkMark(-23, 3, .67)}
      <path d="M7 -12 H40 M7 2 H29 M7 16 H34" stroke="#6847c4" stroke-width="6" stroke-linecap="round"/>
      ${animated ? '<animateTransform attributeName="transform" type="rotate" additive="sum" values="0;-6;0;6;0" dur="4s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  function decorations(mode, animated) {
    if (mode === "vertical") {
      return `<g id="ballot-cartoony-icons">
        ${spark(667, 192, 1.05, "#ffbe37", 15, animated)}
        ${spark(138, 794, 1.2, "#ff76a1", -10, animated)}
        ${spark(697, 696, .85, "#4bd5c4", 10, animated)}
        ${spark(225, 1064, .7, "#ffdd27", 20, animated)}
        ${burst(199, 328, .77, -24, "#ff7392")}
        ${burst(694, 513, .67, 9, "#6b56cb")}
        ${noteSticker(mode, animated)}
        ${ballotBox(653, 1038, .72, animated)}
      </g>`;
    }
    return `<g id="ballot-cartoony-icons">
      ${spark(208, 137, 1.0, "#ffcf35", -5, animated)}
      ${spark(988, 124, 1.05, "#f37aaa", 12, animated)}
      ${spark(617, 652, .88, "#69dcc7", 9, animated)}
      ${spark(349, 590, .74, "#ffe04b", -15, animated)}
      ${burst(118, 365, .64, 4, "#f76d9f")}
      ${burst(1103, 380, .65, 40, "#6752cb")}
      ${noteSticker(mode, animated)}
      ${ballotBox(1020, 605, .64, animated)}
    </g>`;
  }

  function letter(slot, character, index, animated) {
    const safeChar = escapeText(character);
    const text = (fill, stroke, width, extra = "") =>
      `<text x="0" y="0" text-anchor="middle" dominant-baseline="central"
      font-family="${LETTER_FONT}" font-weight="900" font-size="${slot.size}"
      paint-order="stroke fill" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"
      fill="${fill}" ${extra}>${safeChar}</text>`;
    // 粗輪廓、歪斜的實心色塊和白色高光：即使無外部字型也能形成漫畫字感。
    const fill = index % 2 === 0 ? "url(#ballotLemon)" : "url(#ballotMango)";
    const bloom = index % 2 === 0 ? "#ff714f" : "#7c58ca";
    return `<g id="ballot-letter-${index+1}" transform="translate(${slot.x} ${slot.y}) rotate(${slot.tilt})">
      <g>${animated ? `<animateTransform attributeName="transform" type="translate"
        values="0 0;0 -9;0 0" dur="${2.4+index*.23}s" begin="-${index*.21}s" repeatCount="indefinite"/>` : ""}
        <g transform="translate(12 18)">${text(bloom, PALETTE.outline, 20)}</g>
        <g transform="translate(6 9)">${text("#7b5bda", PALETTE.outline, 18)}</g>
        ${text(fill, PALETTE.outline, 18)}
        ${text("none", "#fff9eb", 4, 'opacity=".95"')}
        <path d="M-${slot.size*.29} -${slot.size*.34} q${slot.size*.17} -${slot.size*.10} ${slot.size*.30} -${slot.size*.03}"
          fill="none" stroke="#fffef7" stroke-width="${Math.max(7,slot.size*.052)}"
          stroke-linecap="round" opacity=".93"/>
        <circle cx="${slot.size*.36}" cy="-${slot.size*.31}" r="${Math.max(5, slot.size*.036)}"
          fill="#ffffff" opacity=".86"/>
      </g>
    </g>`;
  }

  function createSVG(rawText, orientation = "vertical", helpers = {}, options = {}) {
    const mode = orientation === "horizontal" ? "horizontal" : "vertical";
    const canvas = CANVAS[mode];
    const segment = helpers.splitCharacters || (value => Array.from(String(value)));
    const chars = segment(rawText).slice(0,4);
    if (!chars.length) throw new Error("請輸入 1～4 個字元。");
    const animated = Boolean(options.animated);
    const slots = createSlots(chars.length,mode);
    const svgText = chars.map((character,index) => letter(slots[index],character,index,animated)).join("\n");
    return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"
  viewBox="0 0 ${canvas.width} ${canvas.height}" role="img" aria-labelledby="ballotTitle ballotDesc">
  <title id="ballotTitle">${escapeText(chars.join(""))}｜投我一票</title>
  <desc id="ballotDesc">鮮黃色漫畫立體字、打勾選票、笑臉投票箱、爆炸星星與漂浮彩紙。背景透明。</desc>
  <defs>
    <linearGradient id="ballotLemon" x1=".15" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#fffeb0"/><stop offset=".29" stop-color="#fff332"/>
      <stop offset=".67" stop-color="#ffda00"/><stop offset="1" stop-color="#ffae16"/>
    </linearGradient>
    <linearGradient id="ballotMango" x1=".16" y1="0" x2=".82" y2="1">
      <stop offset="0" stop-color="#fffccc"/><stop offset=".29" stop-color="#ffed4f"/>
      <stop offset=".77" stop-color="#ffca21"/><stop offset="1" stop-color="#ffa524"/>
    </linearGradient>
    <linearGradient id="ballotBoxColor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c8b6ff"/><stop offset=".52" stop-color="#9078e9"/>
      <stop offset="1" stop-color="#7051cd"/>
    </linearGradient>
  </defs>
  ${glowBlobs(mode)}
  ${swoosh(mode,animated)}
  ${confetti(mode,animated)}
  <g id="ballot-big-cartoon-lettering">${svgText}</g>
  ${decorations(mode,animated)}
</svg>`;
  }

  global.SlowlyBallotVisual = Object.freeze({
    canvas: CANVAS,
    colors: PALETTE,
    createSVG
  });
})(window);
