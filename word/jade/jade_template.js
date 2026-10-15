"use strict";
/*
 * 玉潤生輝｜獨立 SVG 繪圖模板 v2
 *
 * 本檔獨立決定玉石文字、礦脈、局部打亮、玉鐲與筆畫銜接。
 * 不依賴 word_material_core.js；不改共用作品頁或下載控制器。
 * 直橫式使用不同構圖，SVG 全部內容自足，背景透明。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const fixed = number => (Math.round(number * 10) / 10).toString();
  const xy = (x, y) => `${fixed(x)} ${fixed(y)}`;

  function stoneGradient(index) {
    const lightFirst = index % 2 === 0;
    return `<linearGradient id="jadeStone${index}" x1="${lightFirst ? '8%' : '92%'}" y1="0%" x2="${lightFirst ? '91%' : '8%'}" y2="100%">
      <stop offset="0" stop-color="#f7ffe9"/>
      <stop offset=".13" stop-color="#d4f4d5"/>
      <stop offset=".31" stop-color="#8dccab"/>
      <stop offset=".48" stop-color="#4b9a79"/>
      <stop offset=".62" stop-color="#c5edd0"/>
      <stop offset=".77" stop-color="#72bb9c"/>
      <stop offset="1" stop-color="#236f5c"/>
    </linearGradient>`;
  }

  function defs(chars, helpers) {
    const glyphDefs = chars.map((char, index) => `
      <text id="jadeGlyph${index}" x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${helpers.escapeXML(FONT)}' font-size="100" font-weight="800">${helpers.escapeXML(char)}</text>
      <clipPath id="jadeMask${index}"><use href="#jadeGlyph${index}"/></clipPath>
      ${stoneGradient(index)}`);
    return `<defs>
      ${glyphDefs.join('\n')}
      <linearGradient id="jadeBrush" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eaffdf"/>
        <stop offset=".2" stop-color="#7ac6a3"/>
        <stop offset=".47" stop-color="#3b9478"/>
        <stop offset=".7" stop-color="#bfeac5"/>
        <stop offset="1" stop-color="#236f5d"/>
      </linearGradient>
      <linearGradient id="jadeBrushLight" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".03"/>
        <stop offset=".35" stop-color="#f3ffe8" stop-opacity=".72"/>
        <stop offset=".76" stop-color="#b6e8c4" stop-opacity=".34"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity=".02"/>
      </linearGradient>
      <linearGradient id="jadeBangle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e9ffe1"/>
        <stop offset=".16" stop-color="#8dceae"/>
        <stop offset=".38" stop-color="#267d66"/>
        <stop offset=".58" stop-color="#bee8be"/>
        <stop offset=".81" stop-color="#4c9d7e"/>
        <stop offset="1" stop-color="#dbf9d5"/>
      </linearGradient>
      <linearGradient id="jadeArc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e8fbd8" stop-opacity=".66"/>
        <stop offset=".35" stop-color="#65b18f" stop-opacity=".82"/>
        <stop offset=".7" stop-color="#257f6b" stop-opacity=".74"/>
        <stop offset="1" stop-color="#d2eed0" stop-opacity=".38"/>
      </linearGradient>
      <radialGradient id="jadeMilk">
        <stop offset="0" stop-color="#fcfff1" stop-opacity=".65"/>
        <stop offset=".43" stop-color="#c6efd0" stop-opacity=".26"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="jadeDeep">
        <stop offset="0" stop-color="#1b6f5f" stop-opacity=".35"/>
        <stop offset="1" stop-color="#1b6f5f" stop-opacity="0"/>
      </radialGradient>
      <filter id="jadeHaze" x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur stdDeviation="4"/>
      </filter>
    </defs>`;
  }

  // 不規則玉鐲圓環：只使用透明空心 SVG 路徑，內部不會出現背景色塊。
  function bangle(cx, cy, radius, angle, strength = 1) {
    return `<g transform="translate(${fixed(cx)} ${fixed(cy)}) rotate(${angle}) scale(${fixed(strength)})">
      <ellipse cx="0" cy="2" rx="${fixed(radius)}" ry="${fixed(radius * .88)}" fill="none"
        stroke="#195d50" stroke-width="${fixed(radius * .22)}" opacity=".12" filter="url(#jadeHaze)"/>
      <path d="M${xy(-radius * .93, -radius * .13)}
        C${xy(-radius * 1.12, -radius * .77)} ${xy(-radius * .47, -radius * 1.12)} ${xy(radius * .22, -radius * .91)}
        C${xy(radius * .97, -radius * .77)} ${xy(radius * 1.12, -radius * .09)} ${xy(radius * .85, radius * .48)}
        C${xy(radius * .54, radius * 1.11)} ${xy(-radius * .26, radius * 1.02)} ${xy(-radius * .73, radius * .63)}
        C${xy(-radius * .93, radius * .43)} ${xy(-radius * .98, radius * .11)} ${xy(-radius * .93, -radius * .13)} Z"
        fill="none" stroke="url(#jadeBangle)" stroke-width="${fixed(radius * .19)}" stroke-linecap="round"/>
      <path d="M${xy(-radius * .8, -radius * .43)} C${xy(-radius * .56, -radius * .92)} ${xy(radius * .02, -radius * 1.05)} ${xy(radius * .49, -radius * .72)}"
        fill="none" stroke="#f8ffef" stroke-opacity=".76" stroke-width="${fixed(radius * .052)}" stroke-linecap="round"/>
      <path d="M${xy(radius * .77, radius * .5)} C${xy(radius * .34, radius * 1.04)} ${xy(-radius * .43, radius * .97)} ${xy(-radius * .7, radius * .54)}"
        fill="none" stroke="#276b59" stroke-opacity=".42" stroke-width="${fixed(radius * .048)}" stroke-linecap="round"/>
      <path d="M${xy(-radius * .4, -radius * .89)} Q${xy(-radius * .31, -radius * .84)} ${xy(-radius * .18, -radius * .9)}"
        fill="none" stroke="#ffffff" stroke-width="${fixed(radius * .025)}" opacity=".72"/>
    </g>`;
  }

  function ornaments(config) {
    const {orientation, positions} = config;
    const count = positions.length;
    const first = positions[0];
    const last = positions[count - 1];
    if (orientation === 'horizontal') {
      const center = positions[Math.floor((count - 1) / 2)];
      return [
        bangle(first.x - first.size * .42, first.y - first.size * .31, 39, -22, .92),
        bangle(last.x + last.size * .37, last.y + last.size * .27, 50, 17, .94),
        ...(count > 2 ? [bangle(center.x + center.size * .12, center.y - center.size * .72, 21, 22, .81)] : [])
      ].join('\n');
    }
    const middle = positions[Math.min(1, count - 1)];
    const lower = positions[Math.min(2, count - 1)];
    return [
      bangle(first.x - first.size * .48, first.y - first.size * .28, 42, -17, .96),
      bangle(middle.x + middle.size * .56, ((middle.y + lower.y) / 2), 54, 12, .92),
      ...(count > 2 ? [bangle(last.x - last.size * .47, last.y + last.size * .31, 32, 20, .86)] : [])
    ].join('\n');
  }

  // 二字一組的半圓弧線：不做規則的幾何半圓，而是斜下的手繪波形。
  function arcs(config) {
    const {orientation, positions} = config;
    const result = [];
    for (let i = 0; i < positions.length; i += 2) {
      const first = positions[i];
      const second = positions[Math.min(i + 1, positions.length - 1)];
      const one = first.size;
      const d = orientation === 'horizontal'
        ? `M${xy(first.x - one * .47, first.y - one * .59)}
          C${xy(first.x - one * .38, first.y - one * 1.03)} ${xy(first.x + one * .22, first.y - one * .93)} ${xy(first.x + one * .38, first.y - one * .19)}
          S${xy(second.x + one * .35, second.y + one * .70)} ${xy(second.x + one * .56, second.y + one * .49)}`
        : `M${xy(first.x - one * .62, first.y - one * .40)}
          C${xy(first.x - one * .94, first.y + one * .07)} ${xy(first.x - one * .47, first.y + one * .71)} ${xy(first.x + one * .18, first.y + one * .45)}
          S${xy(second.x + one * .66, second.y + one * .40)} ${xy(second.x + one * .65, second.y + one * .53)}`;
      result.push(`<g opacity="${i === 0 ? '.83' : '.7'}">
        <path d="${d}" fill="none" stroke="#337b68" stroke-opacity=".18" stroke-width="12" filter="url(#jadeHaze)"/>
        <path d="${d}" fill="none" stroke="url(#jadeArc)" stroke-width="${orientation === 'horizontal' ? '8' : '7'}" stroke-linecap="round"/>
        <path d="${d}" fill="none" stroke="#f7ffec" stroke-opacity=".44" stroke-width="1.5" stroke-linecap="round"/>
      </g>`);
    }
    return result.join('\n');
  }

  // 字間連筆獨立於字形名稱：不靠漢字本身的文字值判斷效果。
  function connectingStrokes(config) {
    const {orientation, positions} = config;
    if (positions.length < 2) return '';
    if (orientation === 'horizontal') {
      // 從首字右下筆勢伸出，在其餘文字下方延展，末端藏在最後一字下緣。
      const first = positions[0];
      const last = positions[positions.length - 1];
      const startX = first.x + first.size * .16;
      const startY = first.y + first.size * .37;
      const endX = last.x + last.size * .41;
      const endY = last.y + last.size * .42;
      const span = endX - startX;
      const main = `M${xy(startX, startY - 10)}
        C${xy(startX + span * .20, startY + 25)} ${xy(startX + span * .35, startY - 46)} ${xy(startX + span * .51, startY + 9)}
        S${xy(startX + span * .83, endY + 29)} ${xy(endX, endY - 5)}
        Q${xy(endX + 15, endY + 6)} ${xy(endX + 9, endY + 13)}
        C${xy(startX + span * .78, endY + 15)} ${xy(startX + span * .39, startY + 45)} ${xy(startX, startY + 8)} Z`;
      const gleam = `M${xy(startX + 11, startY - 1)}
        C${xy(startX + span * .24, startY + 18)} ${xy(startX + span * .35, startY - 26)} ${xy(startX + span * .53, startY + 15)}
        S${xy(startX + span * .85, endY + 11)} ${xy(endX - 12, endY + 3)}`;
      return `<g>
        <path d="${main}" fill="#245c4f" opacity=".15" filter="url(#jadeHaze)" transform="translate(1 5)"/>
        <path d="${main}" fill="url(#jadeBrush)" opacity=".94"/>
        <path d="${gleam}" fill="none" stroke="url(#jadeBrushLight)" stroke-width="5" stroke-linecap="round"/>
      </g>`;
    }
    return positions.slice(0, -1).map((position, index) => {
      const next = positions[index + 1];
      const s = position.size;
      const x1 = position.x + s * .19;
      const y1 = position.y + s * .41;
      const x2 = next.x - next.size * .27;
      const y2 = next.y - next.size * .42;
      const middle = (y1 + y2) / 2;
      const d = `M${xy(x1 - 5, y1 - 9)}
        C${xy(x1 + 40, middle - 3)} ${xy(x2 - 33, middle + 14)} ${xy(x2 + 9, y2 - 6)}
        Q${xy(x2 + 22, y2 - 10)} ${xy(x2 + 14, y2 + 4)}
        C${xy(x2 - 50, middle + 25)} ${xy(x1 + 36, middle + 20)} ${xy(x1 + 6, y1 + 12)} Z`;
      const gleam = `M${xy(x1, y1 - 3)} C${xy(x1 + 29, middle - 9)} ${xy(x2 - 28, middle + 8)} ${xy(x2 + 7, y2)}`;
      return `<g>
        <path d="${d}" fill="#225d51" opacity=".19" transform="translate(3 5)" filter="url(#jadeHaze)"/>
        <path d="${d}" fill="url(#jadeBrush)" opacity=".91"/>
        <path d="${gleam}" fill="none" stroke="#efffe7" stroke-opacity=".42" stroke-width="2.7" stroke-linecap="round"/>
      </g>`;
    }).join('\n');
  }

  function veins(index) {
    // 以字的局部座標畫紋理，再用該字的精確剪裁限制在文字內。
    const sway = index % 2 ? -1 : 1;
    const lines = [
      `M-62 -37 C-28 -51 -30 -11 -4 -11 S30 -42 68 -29`,
      `M-57 -24 C-20 -38 -29 4 -1 -1 S35 -28 62 -15`,
      `M-64 10 C-33 -4 -19 17 4 6 S28 -7 62 7`,
      `M-53 25 C-22 12 -19 45 15 24 S34 16 57 38`,
      `M-35 -62 C-45 -19 -10 -26 -20 8 S-12 29 -8 68`,
      `M17 -67 C5 -40 39 -18 22 7 S37 46 28 67`,
      `M-63 49 C-26 40 -19 67 15 50 S38 45 62 64`
    ];
    const veins = lines.map((d, i) => {
      const main = i % 3 === 0 ? '#ecffe2' : i % 3 === 1 ? '#186b5b' : '#d7f7d5';
      const amount = (i % 3 === 0 ? .39 : i % 3 === 1 ? .22 : .29);
      return `<path d="${d}" transform="translate(${sway * (i % 2 ? 2 : -2)} 0)" fill="none" stroke="${main}"
        stroke-opacity="${amount}" stroke-width="${i % 2 ? 1.05 : 1.8}" stroke-linecap="round"/>`;
    }).join('\n');
    const knots = `<path d="M-24 -36 C-5 -51 18 -39 24 -26 C31 -4 8 4 -4 -5 C-13 -11 -5 -25 9 -22"
      fill="none" stroke="#f9fff1" stroke-opacity=".37" stroke-width="2.5"/>
      <path d="M-27 29 C-11 22 4 26 18 14" fill="none" stroke="#1f715f" stroke-opacity=".22" stroke-width="3.4"/>`;
    return `<g clip-path="url(#jadeMask${index})">
      <ellipse cx="-18" cy="-29" rx="74" ry="50" fill="url(#jadeMilk)"/>
      <ellipse cx="35" cy="42" rx="62" ry="47" fill="url(#jadeDeep)"/>
      <path d="M-85 -10 C-31 -51 -2 -9 41 -37 L88 -4 L86 21 C32 -9 19 30 -83 38 Z"
        fill="#f0ffe7" opacity=".14"/>
      ${veins}
      ${knots}
      <path d="M-66 -64 C-25 -79 1 -55 32 -63" fill="none" stroke="#ffffff" stroke-opacity=".53"
        stroke-width="7.4" stroke-linecap="round" filter="url(#jadeHaze)"/>
      <path d="M-61 -56 C-22 -67 -7 -53 19 -59" fill="none" stroke="#f8fff0" stroke-opacity=".52"
        stroke-width="1.8" stroke-linecap="round"/>
    </g>`;
  }

  function positionsToGlyphs(positions, chars) {
    return positions.slice(0, chars.length).map((position, index) => {
      const {x, y, size, angle = 0} = position;
      const factor = size / 100;
      return `<g transform="translate(${xy(x, y)}) rotate(${fixed(angle)}) scale(${fixed(factor)})">
        <use href="#jadeGlyph${index}" fill="url(#jadeStone${index})" stroke="none"/>
        ${veins(index)}
      </g>`;
    }).join('\n');
  }

  function renderSVG(text, helpers, config) {
    const chars = helpers.splitCharacters(text);
    const positions = config.positions.slice(0, chars.length);
    const layout = {...config, positions};
    const title = helpers.escapeXML(text);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}"
  viewBox="0 0 ${config.width} ${config.height}" role="img" aria-labelledby="jadeTitle jadeDescription">
  <title id="jadeTitle">${title}｜玉潤生輝藝術字</title>
  <desc id="jadeDescription">${title}，交錯玉石文字與天然礦脈，筆畫相互銜接；不規則玉鐲弧線與青綠玉環，透明背景。</desc>
  ${defs(chars, helpers)}
  ${ornaments(layout)}
  ${arcs(layout)}
  ${connectingStrokes(layout)}
  ${positionsToGlyphs(layout.positions, chars)}
</svg>`;
  }

  global.SlowlyJadeTemplate = Object.freeze({ renderSVG });
})(window);
