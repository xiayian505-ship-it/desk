"use strict";
/* 御駕親征｜獨立 SVG 繪圖模板。
 * 本款所有旗、龍紋、金光、印璽和文字都屬於 SVG 本體，下載時不依賴頁面 CSS。
 * 明皇黃為主色，玄墨與朱紅襯托金字；背景一律透明。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Noto Serif TC", "Songti TC", "PMingLiU", serif';
  const CANVASES = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });
  const round = number => Math.round(number * 10) / 10;

  function textSlots(count, orientation) {
    if (orientation === 'vertical') {
      const presets = {
        1: { size: 385, ys: [612] },
        2: { size: 310, ys: [422, 810] },
        3: { size: 262, ys: [286, 607, 925] },
        4: { size: 224, ys: [221, 477, 733, 989] }
      };
      const preset = presets[count];
      return preset.ys.map((y, index) => ({ x: 420 + (index % 2 ? 5 : -5), y, size: preset.size, angle: index % 2 ? 1.3 : -1.3 }));
    }
    const presets = {
      1: { size: 378, xs: [600] },
      2: { size: 307, xs: [407, 793] },
      3: { size: 250, xs: [317, 600, 883] },
      4: { size: 222, xs: [221, 473, 727, 979] }
    };
    const preset = presets[count];
    return preset.xs.map((x, index) => ({ x, y: 390 + (index % 2 ? 5 : -5), size: preset.size, angle: index % 2 ? -1.2 : 1.2 }));
  }

  /* 龍紋以原生貝茲曲線手繪，像旗袍繡紋；不是外部圖片或字型素材。 */
  function dragonCloud(x, y, scale, flipped = false) {
    return `<g transform="translate(${x} ${y}) scale(${flipped ? -scale : scale} ${scale})" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-92 33 C-83 -18 -50 -45 -10 -30 C18 -20 18 18 48 17 C75 16 91 -22 70 -45 C52 -67 19 -59 18 -80 C18 -101 48 -105 57 -89"
            stroke="#c88922" stroke-width="8" opacity=".58"/>
      <path d="M-87 33 C-74 -16 -46 -32 -18 -18 C8 -7 10 28 45 28 C89 28 104 -13 83 -42"
            stroke="#fff0a1" stroke-width="2.4" opacity=".82"/>
      <path d="M50 -91 l-7 -25 22 18 18 -10 -11 25 M63 -91 l28 -8 -14 20"
            stroke="#b7771f" stroke-width="4" opacity=".75"/>
      <path d="M84 -42 l14 4 -13 7 M-90 34 l-11 16 M-71 19 l-15 6 M-52 -12 l-15 -8"
            stroke="#8e4d19" stroke-width="3" opacity=".6"/>
      <circle cx="71" cy="-80" r="3.6" fill="#9b2518" stroke="none"/>
    </g>`;
  }

  /* 軍旗由桿、鎏金旗首、朱紅裂尾帛面與纓穗組成。 */
  function warBanner(x, y, scale, flip = false, animated = false) {
    const flagMotion = animated
      ? `<animateTransform attributeName="transform" type="skewX" values="0;-3;2;0" dur="4.6s" repeatCount="indefinite"/>`
      : '';
    return `<g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})">
      <path d="M0 -67 V235" stroke="#452a21" stroke-width="8" stroke-linecap="round"/>
      <path d="M-2 -64 V233" stroke="#ffe18b" stroke-width="2.3" opacity=".75"/>
      <path d="M0 -99 L14 -78 0 -56 -14 -78 Z" fill="url(#imperialFlagFinial)" stroke="#512612" stroke-width="2.3"/>
      <g>${flagMotion}
        <path d="M5 -54 Q66 -77 155 -47 L136 10 158 58 Q66 34 5 54 Z" fill="url(#imperialVermilion)" stroke="#6d1e16" stroke-width="4"/>
        <path d="M14 -42 Q62 -58 138 -36 L124 5 139 42 Q62 20 14 39 Z" fill="none" stroke="#ffcb61" stroke-width="2.3" opacity=".85"/>
        <path d="M56 -48 Q74 -14 56 32 M95 -44 Q116 -12 95 37" fill="none" stroke="#ffa747" stroke-width="4" opacity=".45"/>
        <path d="M63 -9 l16 -19 18 19 -18 19 Z M72 -9 H86" fill="none" stroke="#f7cb6c" stroke-width="2.6"/>
      </g>
      <path d="M5 54 Q19 84 12 102 M5 54 Q-11 85 -2 105" fill="none" stroke="#d69a28" stroke-width="2.5"/>
      <circle cx="12" cy="107" r="4" fill="#cf9e3f"/><circle cx="-2" cy="110" r="4" fill="#cf9e3f"/>
    </g>`;
  }

  function militarySeal(x, y, size, animated = false) {
    return `<g transform="translate(${x} ${y}) rotate(-8) scale(${size / 72})">
      <rect x="-36" y="-36" width="72" height="72" rx="5" fill="#a52d1b" stroke="#f1bd57" stroke-width="4"/>
      <rect x="-27" y="-27" width="54" height="54" rx="2" fill="none" stroke="#ffe3a2" stroke-width="2.4"/>
      <path d="M-12 -18 H13 V-5 H0 V9 H18 V22 H-18 V9 H-8 V-5 H-20 V-18 Z" fill="#fbd58a" opacity=".85"/>
      ${animated ? '<animateTransform attributeName="transform" additive="sum" type="rotate" values="-1 0 0;1 0 0;-1 0 0" dur="8s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  function gildedSpear(x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90;
    const length = Math.hypot(x2 - x1, y2 - y1);
    return `<g transform="translate(${round(x1)} ${round(y1)}) rotate(${round(angle)})">
      <path d="M0 0 V${round(length)}" stroke="#4e3021" stroke-width="9" stroke-linecap="round"/>
      <path d="M-1 6 V${round(length - 2)}" stroke="#ffd571" stroke-width="2.1" opacity=".9"/>
      <path d="M0 -42 Q-12 -22 -9 -6 L0 5 9 -6 Q12 -22 0 -42 Z" fill="url(#imperialFlagFinial)" stroke="#78420e" stroke-width="2"/>
      <path d="M-11 12 Q-25 29 -12 49 M11 12 Q28 33 11 51" fill="none" stroke="#a4291d" stroke-width="6"/>
    </g>`;
  }

  function cloudSwirls(orientation) {
    if (orientation === 'vertical') {
      return `<g fill="none" stroke="#bf872c" stroke-linecap="round" opacity=".43">
        <path d="M77 376 C120 335 134 396 180 370 S252 349 251 376 C251 410 203 409 199 383" stroke-width="3.1"/>
        <path d="M591 575 C624 537 652 578 694 557 S764 553 750 579 C736 605 702 600 708 582" stroke-width="3.1"/>
        <path d="M87 909 Q135 862 178 892 T253 888 M587 1002 Q634 970 690 993" stroke-width="2"/>
      </g>`;
    }
    return `<g fill="none" stroke="#ba7f29" stroke-linecap="round" opacity=".46">
      <path d="M235 147 Q272 112 311 149 T406 142 M765 158 Q810 122 851 155 T953 153" stroke-width="2.5"/>
      <path d="M103 532 Q152 486 196 522 T299 512 M894 530 Q945 494 991 529 T1102 510" stroke-width="2.8"/>
    </g>`;
  }

  function marchingDust(orientation, animated) {
    const width = CANVASES[orientation].width;
    const height = CANVASES[orientation].height;
    const total = 24;
    return Array.from({ length: total }, (_, index) => {
      const x = 75 + ((index * 157 + 43) % (width - 150));
      const y = 66 + ((index * 239 + 31) % (height - 132));
      const radius = round(index % 5 === 0 ? 3.6 : 1.5 + (index % 3) * .55);
      const fill = index % 3 === 0 ? '#b73520' : index % 3 === 1 ? '#ffe6a0' : '#c78b2a';
      const motion = animated ? `<animate attributeName="opacity" values=".1;.7;.2;.1" dur="${3 + index % 5}s" begin="-${round(index * .25)}s" repeatCount="indefinite"/>` : '';
      return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" opacity="${index % 4 === 0 ? .45 : .29}">${motion}</circle>`;
    }).join('');
  }

  function ornaments(orientation, animated) {
    if (orientation === 'vertical') {
      return {
        back: `<g id="imperial-battlefield-background">
            <ellipse cx="420" cy="600" rx="339" ry="522" fill="none" stroke="#d5a13a" stroke-width="2.4" stroke-dasharray="10 20" opacity=".43"/>
            <ellipse cx="420" cy="600" rx="319" ry="502" fill="none" stroke="#fbd678" stroke-width="1.7" opacity=".55"/>
            <path d="M420 68 l17 35 h-34 z M420 1132 l16 -32 h-32 z" fill="#e1aa35" opacity=".75"/>
            ${dragonCloud(172, 335, .8)}${dragonCloud(668, 947, .8, true)}
            ${cloudSwirls(orientation)}
            ${warBanner(95, 183, .9, false, animated)}
            ${warBanner(744, 741, .9, true, animated)}
            <g opacity=".66">${gildedSpear(163, 1030, 294, 1176)}${gildedSpear(669, 1052, 557, 1174)}</g>
          </g>`,
        front: `<g id="imperial-battle-seal">${militarySeal(667, 125, 55, animated)}
            <path d="M314 1103 Q417 1135 526 1103" fill="none" stroke="#f4c75a" stroke-width="5" opacity=".7"/>
            <path d="M350 1119 H487" stroke="#8e4321" stroke-width="2.3" opacity=".7"/>
          </g>`
      };
    }
    return {
      back: `<g id="imperial-battlefield-background">
          <ellipse cx="600" cy="385" rx="521" ry="286" fill="none" stroke="#d2a13a" stroke-width="2.4" stroke-dasharray="12 21" opacity=".45"/>
          <ellipse cx="600" cy="385" rx="500" ry="265" fill="none" stroke="#fbd678" stroke-width="1.7" opacity=".52"/>
          ${warBanner(86, 187, .91, false, animated)}
          ${warBanner(1114, 182, .91, true, animated)}
          ${dragonCloud(309, 165, .65)}${dragonCloud(895, 165, .65, true)}
          ${cloudSwirls(orientation)}
          <path d="M209 594 Q602 654 999 593" fill="none" stroke="#cb8424" stroke-width="5" opacity=".62"/>
          <path d="M231 611 Q600 667 970 610" fill="none" stroke="#ffdf8f" stroke-width="1.7" opacity=".77"/>
        </g>`,
      front: `<g id="imperial-battle-seal">${militarySeal(601, 98, 59, animated)}
            <path d="M533 685 H668" stroke="#a14f20" stroke-width="3" opacity=".7"/>
          </g>`
    };
  }

  /* 輸入文字逐字構圖；字數 1～4 對應獨立尺寸與位置，絕不單純縮放四字結果。 */
  function createSVG(rawText, orientation = 'vertical', helpers = {}, options = {}) {
    const mode = orientation === 'horizontal' ? 'horizontal' : 'vertical';
    const canvas = CANVASES[mode];
    const splitCharacters = helpers.splitCharacters || (value => Array.from(String(value)));
    const escapeXML = helpers.escapeXML || (value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[char])));
    const characters = splitCharacters(String(rawText || '')).slice(0, 4);
    if (!characters.length) throw new Error('請輸入一至四個字。');
    const slots = textSlots(characters.length, mode);
    const glyphs = characters.map((character, index) => {
      const slot = slots[index];
      return `<text id="imperialGlyph${index}" x="${slot.x}" y="${slot.y}" font-family='${escapeXML(FONT)}'
                    font-size="${slot.size}" font-weight="900" text-anchor="middle" dominant-baseline="central"
                    transform="rotate(${slot.angle} ${slot.x} ${slot.y})">${escapeXML(character)}</text>`;
    }).join('\n');
    const glyphUses = characters.map((_, index) => `<use href="#imperialGlyph${index}" xlink:href="#imperialGlyph${index}"/>`).join('\n');
    const background = ornaments(mode, !!options.animated);
    const animated = !!options.animated;
    const gradientMotion = animated
      ? `<animate attributeName="x1" values="0;${canvas.width};0" dur="7s" repeatCount="indefinite"/>
         <animate attributeName="x2" values="${canvas.width};${canvas.width * 2};${canvas.width}" dur="7s" repeatCount="indefinite"/>`
      : '';
    const shiningInk = `<linearGradient id="imperialGold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${canvas.width}" y2="${canvas.height}">
       <stop offset="0" stop-color="#a85b0f"/><stop offset=".13" stop-color="#e9a323"/>
       <stop offset=".30" stop-color="#ffda55"/><stop offset=".43" stop-color="#fff5bc"/>
       <stop offset=".55" stop-color="#ffb61e"/><stop offset=".71" stop-color="#e79b18"/>
       <stop offset=".86" stop-color="#ffe68d"/><stop offset="1" stop-color="#a45f18"/>${gradientMotion}
     </linearGradient>`;
    const title = escapeXML(characters.join(''));
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}"
     role="img" aria-labelledby="imperialTitle imperialDescription">
  <title id="imperialTitle">${title}｜御駕親征</title>
  <desc id="imperialDescription">明皇黃御筆金字、玄墨雕邊、朱紅御前旌旗、金龍盤雲與軍令印璽，透明背景。</desc>
  <defs>
    ${shiningInk}
    <linearGradient id="imperialVermilion" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="#591a16"/><stop offset=".4" stop-color="#b4301e"/><stop offset=".7" stop-color="#e35c31"/><stop offset="1" stop-color="#80180d"/></linearGradient>
    <linearGradient id="imperialFlagFinial" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4b0"/><stop offset=".5" stop-color="#ffc536"/><stop offset="1" stop-color="#a76917"/></linearGradient>
    <filter id="imperialGlyphShadow" x="-30%" y="-30%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <!-- 金龍、軍旗、雲紋都在 SVG 本體；背景不包含任何填色矩形。 -->
  ${background.back}
  <g id="imperial-golden-dust">${marchingDust(mode, animated)}</g>
  <defs><g id="imperial-glyph-forms">${glyphs}</g></defs>
  <g id="imperial-ink-shadow" fill="#2b1109" stroke="#2b1109" stroke-width="21" stroke-linejoin="round"
     opacity=".28" transform="translate(8 11)" filter="url(#imperialGlyphShadow)">${glyphUses}</g>
  <g id="imperial-lacquered-outline" fill="#431e12" stroke="#431e12" stroke-width="15" stroke-linejoin="round">${glyphUses}</g>
  <g id="imperial-vermilion-edge" fill="none" stroke="#a32e19" stroke-width="8" stroke-linejoin="round" opacity=".95">${glyphUses}</g>
  <g id="imperial-gold-lettering" fill="url(#imperialGold)" stroke="#593017" stroke-width="3.3" stroke-linejoin="round">${glyphUses}</g>
  <g id="imperial-engraved-line" fill="none" stroke="#fff2a9" stroke-width="1.7" stroke-linejoin="round" opacity=".86"
     transform="translate(-1.4 -2)">${glyphUses}</g>
  ${background.front}
  ${animated ? `<g id="imperial-light-sweep" fill="none" stroke="#fff8d7" stroke-width="2.2" opacity=".3">
     <path d="M-140 0 L${canvas.width - 140} ${canvas.height}" stroke-dasharray="70 85">
       <animateTransform attributeName="transform" type="translate" values="-180 0;320 0;-180 0" dur="7s" repeatCount="indefinite"/>
     </path></g>` : ''}
</svg>`;
  }
  global.SlowlyImperialVisual = Object.freeze({ createSVG, font: FONT, canvas: CANVASES });
})(window);
