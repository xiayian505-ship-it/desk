"use strict";
/* 錦繡河山｜獨立 SVG 模板
 * 山、河、霧色、金線織紋全部在 SVG 字形與畫布中。
 * 下載不依賴預覽樣式，不含實心背景；1～4 字直橫各有自己的排版。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Noto Serif TC", "Songti TC", "PMingLiU", serif';
  const CANVAS = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });
  const fixed = number => Number(number.toFixed(2));

  function slotsFor(count, orientation) {
    if (orientation === 'vertical') {
      const presets = {
        1: { size: 360, centers: [599] },
        2: { size: 310, centers: [410, 798] },
        3: { size: 258, centers: [305, 595, 885] },
        4: { size: 225, centers: [229, 477, 729, 977] }
      };
      const current = presets[count];
      return current.centers.map((y, index) => ({
        x: 420 + (index % 2 === 0 ? -4 : 4), y, size: current.size,
        rotate: index % 2 === 0 ? -0.8 : 0.8
      }));
    }
    const presets = {
      1: { size: 355, centers: [600] },
      2: { size: 301, centers: [415, 785] },
      3: { size: 252, centers: [303, 600, 897] },
      4: { size: 217, centers: [202, 467, 732, 997] }
    };
    const current = presets[count];
    return current.centers.map((x, index) => ({
      x, y: 385 + (index % 2 ? 3 : -3), size: current.size,
      rotate: index % 2 === 0 ? -.5 : .5
    }));
  }

  /* 每一個字形都是一片可閱讀的青綠山河：山峰、江流、雲霧與織紋被剪裁在字內。 */
  function landscapeInsideGlyph(slot, index, animated) {
    const size = slot.size;
    const r = fraction => fixed(size * fraction);
    const motion = animated
      ? `<animateTransform attributeName="transform" type="translate" values="0 0;${r(.065)} 0;0 0" dur="${6.8 + index * .7}s" repeatCount="indefinite"/>`
      : '';
    const weave = Array.from({ length: 14 }, (_, number) => {
      const x = r(-.64 + number * .095);
      return `<path d="M${x} ${r(-.65)} l${r(.38)} ${r(1.32)}" stroke="#f9e6ad" stroke-width="${r(.009)}" opacity="${number % 3 === 0 ? '.29' : '.13'}"/>`;
    }).join('');
    return `<g clip-path="url(#landscapeClip${index})" transform="translate(${slot.x} ${slot.y}) rotate(${slot.rotate})">
      <rect x="${r(-.8)}" y="${r(-.8)}" width="${r(1.6)}" height="${r(1.6)}" fill="url(#landscapeJade)"/>
      <path d="M${r(-.8)} ${r(-.13)} L${r(-.53)} ${r(-.42)} L${r(-.35)} ${r(-.19)} L${r(-.07)} ${r(-.59)} L${r(.2)} ${r(-.24)} L${r(.43)} ${r(-.46)} L${r(.8)} ${r(-.08)} L${r(.8)} ${r(.76)} H${r(-.8)} Z"
        fill="#a5cbb0" opacity=".95"/>
      <path d="M${r(-.8)} ${r(.13)} Q${r(-.58)} ${r(-.17)} ${r(-.42)} ${r(.005)} L${r(-.2)} ${r(-.34)} L${r(.02)} ${r(-.055)} L${r(.28)} ${r(-.42)} L${r(.62)} ${r(.015)} L${r(.8)} ${r(-.16)} V${r(.8)} H${r(-.8)} Z"
        fill="#407c61"/>
      <path d="M${r(-.8)} ${r(.34)} Q${r(-.43)} ${r(-.02)} ${r(-.19)} ${r(.21)} Q${r(.12)} ${r(-.07)} ${r(.43)} ${r(.23)} L${r(.8)} ${r(.035)} V${r(.8)} H${r(-.8)} Z"
        fill="#164e43"/>
      <path d="M${r(-.67)} ${r(-.22)} L${r(-.35)} ${r(-.19)} L${r(-.07)} ${r(-.59)} M${r(-.20)} ${r(-.34)} L${r(.02)} ${r(-.055)} L${r(.28)} ${r(-.42)}"
        stroke="#eff7d1" stroke-width="${r(.013)}" fill="none" opacity=".88"/>
      <!-- 江水在山色之間穿行，始終局限在文字的筆畫中。 -->
      <g fill="none" stroke-linecap="round">
        <path d="M${r(-.93)} ${r(.42)} C${r(-.49)} ${r(.08)} ${r(-.44)} ${r(.68)} ${r(-.06)} ${r(.37)} S${r(.49)} ${r(.22)} ${r(.92)} ${r(.51)}"
          stroke="#c8f1e2" stroke-width="${r(.21)}" opacity=".94"/>
        <path d="M${r(-.93)} ${r(.42)} C${r(-.49)} ${r(.08)} ${r(-.44)} ${r(.68)} ${r(-.06)} ${r(.37)} S${r(.49)} ${r(.22)} ${r(.92)} ${r(.51)}"
          stroke="url(#landscapeRiver)" stroke-width="${r(.13)}"/>
        <path d="M${r(-.93)} ${r(.39)} C${r(-.49)} ${r(.05)} ${r(-.44)} ${r(.65)} ${r(-.06)} ${r(.34)} S${r(.49)} ${r(.19)} ${r(.92)} ${r(.48)}"
          stroke="#effffa" stroke-width="${r(.019)}" opacity=".82"/>
      </g>
      <g opacity=".5" fill="none" stroke="#d4efce" stroke-width="${r(.01)}">
        <path d="M${r(-.56)} ${r(-.06)} L${r(-.36)} ${r(.13)} L${r(-.17)} ${r(-.12)}"/>
        <path d="M${r(.08)} ${r(.08)} L${r(.29)} ${r(-.12)} L${r(.51)} ${r(.12)}"/>
      </g>
      <g fill="none">${weave}</g>
      <g opacity=".22" fill="none" stroke="#fcf7d2" stroke-width="${r(.007)}">${motion}
        <path d="M${r(-.8)} ${r(-.04)} Q0 ${r(-.22)} ${r(.8)} ${r(-.06)}"/>
        <path d="M${r(-.8)} ${r(.03)} Q0 ${r(-.16)} ${r(.8)} ${r(.01)}"/>
      </g>
    </g>`;
  }

  /* 菱花、雙線和錦緞回紋，全部以 SVG 向量畫出，不使用背景圖片。 */
  function threadedBand(x1, x2, y, flip = false) {
    const length = x2 - x1;
    const motifCount = Math.max(3, Math.floor(length / 33));
    const diamonds = Array.from({ length: motifCount }, (_, index) => {
      const x = fixed(x1 + (index + .5) * length / motifCount);
      const alpha = index % 3 === 0 ? .75 : .42;
      return `<path d="M${x} ${y - 6} l6 6 -6 6 -6 -6 Z" fill="none" stroke="#c8a25b" stroke-width="1" opacity="${alpha}"/>`;
    }).join('');
    return `<g class="landscape-embroidered-band">
      <path d="M${x1} ${y - 12} H${x2} M${x1} ${y + 12} H${x2}" stroke="#ab8658" stroke-width="1.2" opacity=".58"/>
      <path d="M${x1} ${y - 8} H${x2} M${x1} ${y + 8} H${x2}" stroke="#e7d2a0" stroke-width="2.2" opacity=".82"/>
      <path d="M${x1} ${y} H${x2}" stroke="#236b59" stroke-width=".9" opacity=".61"/>
      ${diamonds}
    </g>`;
  }

  function embroideryKnot(x, y, scale = 1, animated = false) {
    const motion = animated ? '<animateTransform attributeName="transform" type="rotate" values="0;2;0;-2;0" dur="9s" repeatCount="indefinite" additive="sum"/>' : '';
    return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke-linecap="round" stroke-linejoin="round">${motion}
      <path d="M0 -25 Q26 -10 0 0 Q-26 10 0 25 Q26 13 0 0 Q-26 -13 0 -25 Z" stroke="#c4a05e" stroke-width="2.7"/>
      <path d="M-27 0 Q-12 -23 0 0 Q13 23 27 0 Q11 -23 0 0 Q-13 23 -27 0 Z" stroke="#1f795b" stroke-width="2.2"/>
      <circle r="4" fill="#f7e7b3" stroke="#a9884a" stroke-width="1.3"/>
      <path d="M-6 -29 Q-8 -41 0 -45 Q8 -41 6 -29 M-5 30 Q-13 42 0 48 Q13 41 5 30" stroke="#c6a365" stroke-width="1.5"/>
    </g>`;
  }

  function cloudThread(x, y, scale, inverted = false) {
    return `<g transform="translate(${x} ${y}) scale(${inverted ? -scale : scale} ${scale})" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-84 10 Q-57 -15 -31 4 Q-21 16 -4 4 Q23 -33 59 -14 Q81 -2 74 20 Q67 35 46 22 Q37 16 45 7" stroke="#2d7c6b" stroke-width="4" opacity=".52"/>
      <path d="M-84 7 Q-57 -18 -31 1 Q-21 13 -4 1 Q23 -36 59 -17 Q81 -5 74 17 Q67 32 46 19" stroke="#ecd9a9" stroke-width="1.5" opacity=".9"/>
      <path d="M-37 7 Q-17 25 4 14 M-5 6 Q13 -4 32 4" stroke="#d0b477" stroke-width="1.4" opacity=".72"/>
    </g>`;
  }

  function leafThread(x, y, angle, scale, animated) {
    return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" fill="none" stroke="#9cb99a" stroke-linecap="round">
      <path d="M0 -47 C-4 -16 1 18 0 49" stroke="#bda06e" stroke-width="2"/>
      <path d="M0 -29 Q-29 -49 -28 -18 Q-16 -4 0 -4 Q27 -46 26 -19 Q16 0 0 5 Q-32 1 -24 27 Q-13 35 0 24 Q31 -1 26 31 Q17 42 0 39"
        stroke="#328066" stroke-width="1.9"/>
      <path d="M-28 -18 Q-13 -18 0 -4 M26 -19 Q13 -7 0 5 M-24 27 Q-12 25 0 24 M26 31 Q13 32 0 39" stroke="#efd6a2" stroke-width="1.1"/>
      ${animated ? '<animate attributeName="opacity" values=".75;1;.75" dur="5.2s" repeatCount="indefinite"/>' : ''}
    </g>`;
  }

  /* 緞繡花朵由絲線針腳勾出，襯托錦繡而不遮住山河字形。 */
  function silkBloom(x, y, scale, flip = false) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})" fill="none" stroke-linejoin="round" stroke-linecap="round">
      <g stroke="#c7a166" stroke-width="2.2" opacity=".89">
        <path d="M0 0 Q-25 -27 -6 -39 Q9 -40 0 0 Q23 -32 38 -17 Q38 -2 0 0 Q29 21 11 36 Q-5 33 0 0 Q-22 30 -35 12 Q-33 -3 0 0"/>
        <path d="M-8 -44 Q0 -64 12 -46 M37 -20 Q57 -27 52 -10 M13 35 Q21 56 0 52 M-35 10 Q-53 13 -50 -10" stroke-width="1.1"/>
      </g>
      <path d="M0 -7 Q-15 -24 -7 -34 M7 4 Q25 10 29 -15 M3 8 Q13 26 9 30 M-7 5 Q-22 20 -27 11" stroke="#4b9c81" stroke-width="2.0"/>
      <circle r="5" fill="#f7e7b3" stroke="#b59b60" stroke-width="1.2"/>
    </g>`;
  }

  function stitchDust(orientation, animated) {
    const canvas = CANVAS[orientation];
    return Array.from({ length: 30 }, (_, index) => {
      const x = 56 + ((index * 117 + 31) % (canvas.width - 112));
      const y = 82 + ((index * 173 + 53) % (canvas.height - 164));
      const radius = index % 4 === 0 ? 2.3 : 1.15;
      return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${index % 2 ? '#d7b879' : '#a5cfaf'}" opacity="${index % 4 === 0 ? '.64' : '.35'}">${animated ? `<animate attributeName="opacity" values=".17;.67;.17" dur="${4 + (index % 5)}s" begin="-${index % 4}s" repeatCount="indefinite"/>` : ''}</circle>`;
    }).join('');
  }

  function frameFor(orientation, animated) {
    if (orientation === 'vertical') {
      return `<g id="landscape-vertical-scroll-embroidery">
        ${threadedBand(102, 738, 75)}
        ${threadedBand(102, 738, 1125)}
        <path d="M115 145 Q87 315 110 474 Q78 611 112 746 Q87 930 117 1056" stroke="#c4a475" stroke-width="2.2" fill="none" opacity=".62"/>
        <path d="M725 145 Q753 315 730 474 Q762 611 728 746 Q753 930 723 1056" stroke="#c4a475" stroke-width="2.2" fill="none" opacity=".62"/>
        <path d="M127 155 Q112 315 133 478 Q112 614 136 741 Q110 930 128 1050" stroke="#275d4c" stroke-width="1" fill="none" opacity=".31"/>
        <path d="M713 155 Q728 315 707 478 Q728 614 704 741 Q730 930 712 1050" stroke="#275d4c" stroke-width="1" fill="none" opacity=".31"/>
        ${embroideryKnot(421, 74, .70, animated)}
        ${embroideryKnot(420, 1127, .70, animated)}
        ${cloudThread(224, 162, .66)} ${cloudThread(608, 1039, .66, true)}
        ${silkBloom(165, 333, .67)} ${silkBloom(676, 861, .67, true)}
        ${leafThread(151, 692, -18, .74, animated)} ${leafThread(688, 477, 195, .73, animated)}
        <path d="M185 274 Q275 238 354 278 M490 912 Q588 874 655 911" stroke="#e4cea1" stroke-width="2" fill="none" opacity=".59" stroke-dasharray="4 8"/>
      </g>`;
    }
    return `<g id="landscape-horizontal-scroll-embroidery">
      ${threadedBand(100, 1100, 82)}
      ${threadedBand(100, 1100, 678)}
      <path d="M69 132 Q49 280 74 387 Q51 517 76 628 M1131 132 Q1151 280 1126 387 Q1149 517 1124 628" stroke="#c7a572" stroke-width="2.1" fill="none" opacity=".67"/>
      ${embroideryKnot(599, 82, .77, animated)}
      ${embroideryKnot(599, 678, .77, animated)}
      ${cloudThread(233, 165, .8)} ${cloudThread(966, 165, .8, true)}
      ${silkBloom(160, 164, .64)} ${silkBloom(1040, 166, .64, true)}
      ${leafThread(141, 575, -52, .76, animated)} ${leafThread(1046, 564, 45, .76, animated)}
      <path d="M243 594 Q602 638 965 592" stroke="#e7d1a2" stroke-width="2" fill="none" opacity=".61"/>
    </g>`;
  }

  /* 畫布沒有底色；絲線框是作品元素，而非網頁背景。 */
  function createSVG(rawText, orientation = 'vertical', helpers = {}, options = {}) {
    const mode = orientation === 'horizontal' ? 'horizontal' : 'vertical';
    const canvas = CANVAS[mode];
    const splitCharacters = helpers.splitCharacters || (value => Array.from(String(value)));
    const escapeXML = helpers.escapeXML || (value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char])));
    const characters = splitCharacters(rawText).slice(0, 4);
    if (!characters.length) throw new Error('請輸入 1～4 個字。');
    const slots = slotsFor(characters.length, mode);
    const animated = !!options.animated;
    const letterDefs = characters.map((character, index) => {
      const slot = slots[index];
      return `<g id="landscapeGlyph${index}"><text x="${slot.x}" y="${slot.y}" text-anchor="middle" dominant-baseline="central"
           font-family='${escapeXML(FONT)}' font-size="${slot.size}" font-weight="900"
           transform="rotate(${slot.rotate} ${slot.x} ${slot.y})">${escapeXML(character)}</text></g>`;
    }).join('');
    const glyphUses = characters.map((_, index) => `<use href="#landscapeGlyph${index}" xlink:href="#landscapeGlyph${index}"/>`).join('');
    const clips = characters.map((character, index) => `<clipPath id="landscapeClip${index}"><text x="0" y="0" text-anchor="middle" dominant-baseline="central" font-family='${escapeXML(FONT)}' font-size="${slots[index].size}" font-weight="900">${escapeXML(character)}</text></clipPath>`).join('');
    const textures = characters.map((_, index) => landscapeInsideGlyph(slots[index], index, animated)).join('');
    const title = escapeXML(characters.join(''));
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvas.width}" height="${canvas.height}"
     viewBox="0 0 ${canvas.width} ${canvas.height}" role="img" aria-labelledby="landscapeTitle landscapeDesc">
  <title id="landscapeTitle">${title}｜錦繡河山</title>
  <desc id="landscapeDesc">青山綠水生於文字筆畫之中，金絲錦紋與繡雲環繞，透明背景。</desc>
  <defs>
    <linearGradient id="landscapeJade" x1=".1" x2=".7" y1="0" y2="1">
      <stop offset="0" stop-color="#f4ecc6"/><stop offset=".28" stop-color="#b5dcb2"/>
      <stop offset=".57" stop-color="#367e65"/><stop offset="1" stop-color="#0e483e"/>
    </linearGradient>
    <linearGradient id="landscapeRiver" x1="0" x2="1" y1="0" y2=".6">
      <stop stop-color="#b0e6df"/><stop offset=".45" stop-color="#3bafab"/><stop offset=".75" stop-color="#e2fff3"/>
      <stop offset="1" stop-color="#228d89"/>
    </linearGradient>
    <linearGradient id="landscapeGoldThread" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#72532f"/><stop offset=".21" stop-color="#b99550"/><stop offset=".43" stop-color="#fff2b9"/>
      <stop offset=".65" stop-color="#ceae70"/><stop offset="1" stop-color="#805c32"/>
    </linearGradient>
    <filter id="landscapeSoftShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    ${letterDefs}
    ${clips}
  </defs>
  ${frameFor(mode, animated)}
  <g id="landscape-gold-stitches">${stitchDust(mode, animated)}</g>
  <g id="landscape-deep-ink-shadow" fill="#102b2c" stroke="#123a36" stroke-linejoin="round" stroke-width="20"
     opacity=".25" transform="translate(6 9)" filter="url(#landscapeSoftShadow)">${glyphUses}</g>
  <g id="landscape-forest-outline" fill="#17483e" stroke="#17483e" stroke-width="13" stroke-linejoin="round">${glyphUses}</g>
  <g id="landscape-embroidered-gold-outline" fill="none" stroke="url(#landscapeGoldThread)" stroke-width="7" stroke-linejoin="round">${glyphUses}</g>
  <g id="landscape-character-jade" fill="url(#landscapeJade)">${glyphUses}</g>
  <g id="landscape-scenes-inside-characters">${textures}</g>
  <g id="landscape-light-engraved-edge" fill="none" stroke="#ebd9a6" stroke-width="1.5" opacity=".92" stroke-linejoin="round">${glyphUses}</g>
  ${animated ? `<g opacity=".38"><path d="M70 ${canvas.height / 2} Q${canvas.width / 2} ${canvas.height / 2 - 65} ${canvas.width - 70} ${canvas.height / 2}" stroke="#ecf8d2" stroke-width="1.9" fill="none" stroke-dasharray="20 21"><animate attributeName="stroke-dashoffset" values="0;-164" dur="13s" repeatCount="indefinite"/></path></g>` : ''}
</svg>`;
  }

  global.SlowlyLandscapeVisual = Object.freeze({ createSVG, canvas: CANVAS, font: FONT });
})(window);
