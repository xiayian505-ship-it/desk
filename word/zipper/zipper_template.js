"use strict";
/*
 * 開闔之間｜重生版 SVG 視覺模板（直式／橫式共用）。
 * 核心不是把拉鍊貼在字上，而是讓「開」「闔」的分界真正穿過文字。
 * 透明背景；拉鍊、鏈環與金屬光澤都包含在輸出本體。
 */
(function (global) {
  const FONT = '"Noto Sans CJK TC", "Source Han Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';
  const round = value => Math.round(value * 10) / 10;

  function splitGradient(orientation) {
    return orientation === 'horizontal'
      ? `<linearGradient id="zipBodySplit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#eff4f8"/>
          <stop offset=".34" stop-color="#ffffff"/>
          <stop offset=".53" stop-color="#dee5eb"/>
          <stop offset=".7" stop-color="#98a3ad"/>
          <stop offset="1" stop-color="#444d57"/>
        </linearGradient>`
      : `<linearGradient id="zipBodySplit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#363d45"/>
          <stop offset=".22" stop-color="#6d7783"/>
          <stop offset=".47" stop-color="#edf3f8"/>
          <stop offset=".68" stop-color="#ffffff"/>
          <stop offset="1" stop-color="#d7dee5"/>
        </linearGradient>`;
  }

  function ribbonGradient(orientation) {
    return orientation === 'horizontal'
      ? `<linearGradient id="zipRibbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".76"/>
          <stop offset=".2" stop-color="#ffd7f1" stop-opacity=".46"/>
          <stop offset=".44" stop-color="#b9f0ff" stop-opacity=".4"/>
          <stop offset=".65" stop-color="#f4ffe0" stop-opacity=".34"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity=".1"/>
        </linearGradient>`
      : `<linearGradient id="zipRibbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".72"/>
          <stop offset=".25" stop-color="#b8ecff" stop-opacity=".42"/>
          <stop offset=".5" stop-color="#f6d8ff" stop-opacity=".35"/>
          <stop offset=".78" stop-color="#f8ffe2" stop-opacity=".28"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity=".08"/>
        </linearGradient>`;
  }

  function metallicStrips(width, height, orientation) {
    const strips = [];
    if (orientation === 'horizontal') {
      for (let i = 0; i < 8; i += 1) {
        const y = height * (0.14 + i * 0.11);
        strips.push(`<path d="M-40 ${round(y)} C${round(width * .18)} ${round(y - 26)} ${round(width * .42)} ${round(y + 18)} ${round(width + 40)} ${round(y - 8)}"
          fill="none" stroke="url(#zipRibbon)" stroke-width="18" opacity="${i % 2 ? .16 : .24}"/>`);
      }
    } else {
      for (let i = 0; i < 8; i += 1) {
        const x = width * (0.12 + i * 0.11);
        strips.push(`<path d="M${round(x)} -40 C${round(x + 30)} ${round(height * .18)} ${round(x - 20)} ${round(height * .48)} ${round(x + 10)} ${round(height + 40)}"
          fill="none" stroke="url(#zipRibbon)" stroke-width="18" opacity="${i % 2 ? .12 : .22}"/>`);
      }
    }
    return strips.join('\n');
  }

  function buildGlyphs(chars, helpers, positions) {
    return positions.map(({x, y, size, angle}, index) =>
      `<text id="glyph${index}" x="${round(x)}" y="${round(y)}" text-anchor="middle" dominant-baseline="central"
        font-family='${helpers.escapeXML(FONT)}' font-size="${round(size)}" font-weight="900" letter-spacing="${round(-size * 0.05)}"
        transform="rotate(${angle || 0} ${round(x)} ${round(y)})">${helpers.escapeXML(chars[index])}</text>`
    ).join('\n');
  }

  function zipperPath(config) {
    const {orientation, width, height, positions} = config;
    if (orientation === 'horizontal') {
      const startX = positions[0].x - positions[0].size * 0.6;
      const endX = positions[positions.length - 1].x + positions[positions.length - 1].size * 0.62;
      const baseY = height * 0.51;
      return `M${round(startX)} ${round(baseY)}
        C${round(width * .2)} ${round(baseY - 56)} ${round(width * .33)} ${round(baseY + 52)} ${round(width * .46)} ${round(baseY - 8)}
        S${round(width * .72)} ${round(baseY - 66)} ${round(endX)} ${round(baseY - 6)}`;
    }
    const startY = positions[0].y - positions[0].size * 0.7;
    const endY = positions[positions.length - 1].y + positions[positions.length - 1].size * 0.68;
    const baseX = width * 0.52;
    return `M${round(baseX)} ${round(startY)}
      C${round(baseX - 72)} ${round(height * .18)} ${round(baseX + 58)} ${round(height * .34)} ${round(baseX - 16)} ${round(height * .49)}
      S${round(baseX + 70)} ${round(height * .77)} ${round(baseX + 6)} ${round(endY)}`;
  }

  function zipperTeeth(config) {
    const {orientation, width, height} = config;
    const result = [];
    if (orientation === 'horizontal') {
      const y = height * 0.51;
      const left = width * 0.16;
      const step = width * 0.047;
      for (let i = 0; i < 16; i += 1) {
        const x = left + step * i;
        result.push(`<g transform="translate(${round(x)} ${round(y + (i % 2 ? 4 : -4))}) rotate(${i % 2 ? 12 : -12})">
          <path d="M-12 -8 L0 -2 L0 9 L-12 5 Z" fill="url(#zipMetal)" stroke="#13171b" stroke-width="1.2"/>
          <path d="M12 -8 L0 -2 L0 9 L12 5 Z" fill="url(#zipMetal2)" stroke="#13171b" stroke-width="1.2"/>
          <path d="M-9 -4 L-1 -1" stroke="#ffffff" stroke-opacity=".46" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M9 -4 L1 -1" stroke="#ffffff" stroke-opacity=".34" stroke-width="1.3" stroke-linecap="round"/>
        </g>`);
      }
      return result.join('\n');
    }
    const x = width * 0.52;
    const top = height * 0.14;
    const step = height * 0.062;
    for (let i = 0; i < 16; i += 1) {
      const y = top + step * i;
      result.push(`<g transform="translate(${round(x + (i % 2 ? 5 : -5))} ${round(y)}) rotate(${i % 2 ? 76 : -76})">
        <path d="M-12 -8 L0 -2 L0 9 L-12 5 Z" fill="url(#zipMetal)" stroke="#13171b" stroke-width="1.2"/>
        <path d="M12 -8 L0 -2 L0 9 L12 5 Z" fill="url(#zipMetal2)" stroke="#13171b" stroke-width="1.2"/>
        <path d="M-9 -4 L-1 -1" stroke="#ffffff" stroke-opacity=".42" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M9 -4 L1 -1" stroke="#ffffff" stroke-opacity=".32" stroke-width="1.2" stroke-linecap="round"/>
      </g>`);
    }
    return result.join('\n');
  }

  function zipperSlider(config) {
    const {orientation, width, height} = config;
    if (orientation === 'horizontal') {
      const x = width * 0.62;
      const y = height * 0.49;
      return `<g transform="translate(${round(x)} ${round(y)}) rotate(5)">
        <path d="M-20 -27 C-31 -17 -34 18 -9 34 C4 42 25 36 32 15 C39 -7 26 -27 12 -35 Z"
          fill="url(#zipMetal2)" stroke="#0d1013" stroke-width="3"/>
        <path d="M-6 -10 C2 -13 12 -8 14 4 C17 17 6 25 -7 19 C-16 14 -18 -4 -6 -10 Z"
          fill="#1b1f24" opacity=".7"/>
        <rect x="-11" y="-46" width="22" height="18" rx="6" fill="url(#zipMetal)" stroke="#0d1013" stroke-width="2.5"/>
        <path d="M0 -46 L0 -92" stroke="url(#zipMetal)" stroke-width="9" stroke-linecap="round"/>
        <ellipse cx="0" cy="-110" rx="28" ry="20" fill="none" stroke="url(#zipMetal2)" stroke-width="9"/>
      </g>`;
    }
    const x = width * 0.52;
    const y = height * 0.55;
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(-4)">
      <path d="M-27 -18 C-34 -1 -31 25 -11 36 C2 43 19 41 29 22 C38 6 34 -17 18 -30 Z"
        fill="url(#zipMetal2)" stroke="#0d1013" stroke-width="3"/>
      <path d="M-8 -7 C2 -11 12 -4 13 7 C14 18 5 25 -6 23 C-15 21 -18 0 -8 -7 Z"
        fill="#1c2126" opacity=".72"/>
      <rect x="-14" y="-42" width="28" height="18" rx="7" fill="url(#zipMetal)" stroke="#0d1013" stroke-width="2.5"/>
      <path d="M0 -42 L0 -86" stroke="url(#zipMetal)" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="0" cy="-104" rx="22" ry="30" fill="none" stroke="url(#zipMetal2)" stroke-width="9"/>
    </g>`;
  }

  function zipperEdges(config) {
    const {orientation, width, height} = config;
    if (orientation === 'horizontal') {
      const y = height * 0.51;
      return `
      <path d="M${round(width * .11)} ${round(y - 18)} C${round(width * .25)} ${round(y - 58)} ${round(width * .44)} ${round(y + 38)} ${round(width * .89)} ${round(y - 24)}"
        fill="none" stroke="#ffffff" stroke-width="7" stroke-opacity=".38" stroke-linecap="round"/>
      <path d="M${round(width * .11)} ${round(y + 14)} C${round(width * .24)} ${round(y - 6)} ${round(width * .45)} ${round(y + 72)} ${round(width * .9)} ${round(y + 12)}"
        fill="none" stroke="#0e1215" stroke-width="9" stroke-opacity=".35" stroke-linecap="round"/>`;
    }
    const x = width * 0.52;
    return `
    <path d="M${round(x - 18)} ${round(height * .1)} C${round(x - 74)} ${round(height * .24)} ${round(x + 44)} ${round(height * .42)} ${round(x - 12)} ${round(height * .9)}"
      fill="none" stroke="#ffffff" stroke-width="7" stroke-opacity=".34" stroke-linecap="round"/>
    <path d="M${round(x + 14)} ${round(height * .1)} C${round(x - 14)} ${round(height * .25)} ${round(x + 82)} ${round(height * .45)} ${round(x + 20)} ${round(height * .91)}"
      fill="none" stroke="#11161a" stroke-width="9" stroke-opacity=".34" stroke-linecap="round"/>`;
  }

  function chainLinks(config) {
    const {orientation, positions} = config;
    const links = [];
    const makePair = (cx, cy, rotate, scale = 1) => `<g transform="translate(${round(cx)} ${round(cy)}) rotate(${rotate}) scale(${scale})" opacity=".92">
      <ellipse cx="-16" cy="0" rx="20" ry="13" fill="none" stroke="url(#zipMetal)" stroke-width="6"/>
      <ellipse cx="16" cy="0" rx="20" ry="13" fill="none" stroke="url(#zipMetal2)" stroke-width="6"/>
      <path d="M-2 -8 C3 -10 10 -10 14 -6" stroke="#ffffff" stroke-opacity=".42" stroke-width="2" stroke-linecap="round" fill="none"/>
    </g>`;
    if (orientation === 'horizontal') {
      const first = positions[0];
      const last = positions[positions.length - 1];
      links.push(makePair(first.x - first.size * 0.3, first.y - first.size * 0.72, -20, 0.9));
      links.push(makePair((first.x + last.x) / 2, first.y + first.size * 0.78, 14, 0.82));
      links.push(makePair(last.x + last.size * 0.24, last.y - last.size * 0.74, 22, 0.94));
    } else {
      const first = positions[0];
      const last = positions[positions.length - 1];
      links.push(makePair(first.x + first.size * 0.7, first.y - first.size * 0.28, 64, 0.92));
      links.push(makePair(last.x - last.size * 0.72, (first.y + last.y) / 2, -32, 0.86));
      links.push(makePair(last.x + last.size * 0.74, last.y + last.size * 0.12, 48, 0.94));
    }
    return links.join('\n');
  }

  function stitchMarks(positions) {
    return positions.map(({x, y, size}, index) => {
      const sign = index % 2 ? 1 : -1;
      return `<path d="M${round(x - size * .48)} ${round(y - size * .16)}
        q${round(size * .08)} ${round(-size * .05 * sign)} ${round(size * .16)} 0
        t${round(size * .16)} 0 t${round(size * .16)} 0"
        fill="none" stroke="#dbe2e8" stroke-width="${round(size * .016)}" stroke-linecap="round" opacity=".44"/>`;
    }).join('\n');
  }

  function renderSVG(text, helpers, config) {
    const {width, height, orientation, positions} = config;
    const chars = helpers.splitCharacters(text);
    const placed = positions.slice(0, chars.length).map((position, index) => ({...position, index}));
    const glyphs = buildGlyphs(chars, helpers, placed);
    const uses = placed.map(({index}) => `<use href="#glyph${index}"/>`).join('\n');
    const label = helpers.escapeXML(text);
    const seam = zipperPath({...config, positions: placed});
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="zipTitle zipDesc">
  <title id="zipTitle">${label}｜開闔之間藝術字</title>
  <desc id="zipDesc">${label}，緊密交錯的黑框金屬文字，共用冷調銀灰切色；拉鍊穿過字體中央，鏈環作為輔助點綴，透明背景。</desc>
  <defs>
    ${splitGradient(orientation)}
    ${ribbonGradient(orientation)}
    <linearGradient id="zipMetal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".18" stop-color="#edf1f5"/>
      <stop offset=".5" stop-color="#9ca6b2"/>
      <stop offset=".76" stop-color="#dbe1e8"/>
      <stop offset="1" stop-color="#555f6a"/>
    </linearGradient>
    <linearGradient id="zipMetal2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7faff"/>
      <stop offset=".2" stop-color="#cfd7de"/>
      <stop offset=".5" stop-color="#788390"/>
      <stop offset=".82" stop-color="#e8edf2"/>
      <stop offset="1" stop-color="#56606a"/>
    </linearGradient>
    <filter id="zipShadow" x="-30%" y="-30%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="zipSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3.2"/></filter>
    <filter id="zipGlow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="5"/></filter>
    <g id="glyphBank">${glyphs}</g>
    <clipPath id="zipMask">${uses}</clipPath>
  </defs>

  <g filter="url(#zipShadow)" opacity=".22" transform="translate(8 10)">${uses}</g>
  <g fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="14" stroke-linejoin="round">${uses}</g>
  <g fill="url(#zipBodySplit)" stroke="#0f1418" stroke-width="10" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  <g clip-path="url(#zipMask)">
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#zipBodySplit)"/>
    ${metallicStrips(width, height, orientation)}
    <path d="${seam}" fill="none" stroke="#0c0f13" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity=".34" filter="url(#zipSoft)"/>
    <path d="${seam}" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".14"/>
  </g>
  <g fill="none" stroke="#a6b0ba" stroke-width="2.6" stroke-linejoin="round" opacity=".64">${uses}</g>
  <g opacity=".98">${chainLinks({...config, positions: placed})}</g>
  <g>${stitchMarks(placed)}</g>
  <g>${zipperEdges({...config, positions: placed})}</g>
  <g>${zipperTeeth({...config, positions: placed})}</g>
  ${zipperSlider({...config, positions: placed})}
  <g filter="url(#zipGlow)" opacity=".16">
    <path d="${seam}" fill="none" stroke="url(#zipRibbon)" stroke-width="16" stroke-linecap="round"/>
  </g>
</svg>`;
  }

  global.SlowlyZipperTemplate = Object.freeze({ renderSVG });
})(window);
