"use strict";
/* ==========================================================================
 * 第 48 款｜星象萬千 / Asterism
 * 北斗七星、星圖軌跡、測天刻度與銀藍冷光皆繪在自足 SVG 裡。
 * 版面四周保持透明，不使用整片夜空底板；與其他款不共享繪圖模板。
 * ========================================================================= */
(function (global) {
  const sizes = Object.freeze({
    vertical: Object.freeze({ width: 840, height: 1200 }),
    horizontal: Object.freeze({ width: 1200, height: 760 })
  });
  const fontFamily = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const goldenAngle = 137.50776405;

  function numeric(value) { return Number(value.toFixed(2)); }
  function xml(value) {
    return String(value).replace(/[&<>"']/g, match => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[match]));
  }
  function splitCharacters(text, helpers) {
    const splitter = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    return (typeof splitter === "function" ? Array.from(splitter(text)) : Array.from(String(text || ""))).slice(0, 4);
  }

  function layout(count, direction) {
    const vertical = {
      1: { points: [[420, 600]], fontSize: 372, rotations: [0] },
      2: { points: [[415, 444], [424, 740]], fontSize: 297, rotations: [-2, 2] },
      3: { points: [[414, 357], [425, 600], [417, 843]], fontSize: 274, rotations: [-2, 1, -1] },
      4: { points: [[417, 270], [425, 490], [414, 710], [426, 931]], fontSize: 244, rotations: [-2, 1.2, -1.5, 1.5] }
    };
    const horizontal = {
      1: { points: [[600, 390]], fontSize: 412, rotations: [0] },
      2: { points: [[425, 390], [776, 390]], fontSize: 321, rotations: [-2, 2] },
      3: { points: [[335, 395], [602, 379], [867, 397]], fontSize: 284, rotations: [-2, 0.8, -1.5] },
      4: { points: [[230, 389], [478, 377], [725, 393], [971, 384]], fontSize: 264, rotations: [-2, 1.1, -1.2, 1.5] }
    };
    const selected = (direction === "vertical" ? vertical : horizontal)[count];
    return selected.points.map(([x, y], index) => ({ x, y, fontSize: selected.fontSize, angle: selected.rotations[index], index }));
  }

  /* 斗形的四角依 α→β→γ→δ 串成斗身，再由 δ 引出 ε→ζ→η 斗柄。
   * 直橫版位置各自計算，絕非把同一組星圖旋轉九十度。 */
  function dipperCoordinates(direction, count) {
    const vertical = [
      [235, 268], [163, 446], [351, 499], [411, 316],
      [520, 477], [641, 648], [583, 913]
    ];
    const horizontal = [
      [152, 247], [187, 445], [369, 419], [330, 231],
      [547, 273], [823, 403], [1050, 293]
    ];
    const base = direction === "vertical" ? vertical : horizontal;
    // 文字少於四個字時，仍保留整個北斗七星，把跨度略為往文字靠近。
    const amount = count === 1 ? 0.79 : count === 2 ? 0.89 : count === 3 ? 0.95 : 1;
    const cx = direction === "vertical" ? 420 : 600;
    const cy = direction === "vertical" ? 600 : 380;
    return base.map(([x, y]) => [numeric(cx + (x - cx) * amount), numeric(cy + (y - cy) * amount)]);
  }

  function svgDefinitions(slots) {
    const clips = slots.map(({ char, fontSize, index }) => `<clipPath id="asterism-glyph-mask-${index}">
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${fontFamily}' font-size="${fontSize}" font-weight="700">${xml(char)}</text>
    </clipPath>`).join("\n");
    return `<defs>
      <linearGradient id="asterism-silver" x1="0" y1="0" x2=".92" y2="1">
        <stop offset="0" stop-color="#fbfaf0"/>
        <stop offset=".22" stop-color="#d7edf3"/>
        <stop offset=".44" stop-color="#d5e9ef"/>
        <stop offset=".65" stop-color="#95bdd0"/>
        <stop offset=".83" stop-color="#bed5df"/>
        <stop offset="1" stop-color="#789aab"/>
      </linearGradient>
      <linearGradient id="asterism-rim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f2dba7"/>
        <stop offset=".26" stop-color="#afcfdd"/>
        <stop offset=".58" stop-color="#f3f4dd"/>
        <stop offset="1" stop-color="#9fb5ce"/>
      </linearGradient>
      <linearGradient id="asterism-engrave" x1="0" y1="0" x2="1" y2=".2">
        <stop offset="0" stop-color="#e0f3fa" stop-opacity="0"/>
        <stop offset=".43" stop-color="#fff4cf" stop-opacity=".76"/>
        <stop offset=".65" stop-color="#9dd8e6" stop-opacity=".38"/>
        <stop offset="1" stop-color="#e0f3fa" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="asterism-constellation" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#b4e2e8" stop-opacity=".7"/>
        <stop offset=".56" stop-color="#f4d99b" stop-opacity=".97"/>
        <stop offset="1" stop-color="#c7f4ff" stop-opacity=".75"/>
      </linearGradient>
      <radialGradient id="asterism-star-halo">
        <stop offset="0" stop-color="#fffbe3" stop-opacity=".95"/>
        <stop offset=".19" stop-color="#fae3a8" stop-opacity=".63"/>
        <stop offset=".54" stop-color="#8ad5f0" stop-opacity=".22"/>
        <stop offset="1" stop-color="#75bcde" stop-opacity="0"/>
      </radialGradient>
      <filter id="asterism-soft-light" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <filter id="asterism-letter-halo" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="7"/>
      </filter>
      ${clips}
    </defs>`;
  }

  function singleGlyph({ x, y, char, fontSize, angle, index }, animated) {
    const size = fontSize;
    const base = `text-anchor="middle" dominant-baseline="central" font-family='${fontFamily}' font-size="${size}" font-weight="700"`;
    const engraving = Array.from({ length: 6 }, (_, line) => {
      const yLine = numeric((line - 2.45) * size * 0.2);
      return `<path d="M${numeric(-size * .72)} ${yLine} L${numeric(size * .64)} ${numeric(yLine - size * .09)}"
        stroke="url(#asterism-engrave)" stroke-width="${line % 2 === 0 ? 1.5 : 1}" opacity=".68"/>`;
    }).join("\n");
    const gleam = `<path d="M${numeric(-size * .85)} ${numeric(-size * .62)} L${numeric(-size * .25)} ${numeric(-size * .62)} L${numeric(size * .53)} ${numeric(size * .57)} L${numeric(-size * .06)} ${numeric(size * .57)} Z"
      fill="#f7f9e1" opacity=".15">
      ${animated ? `<animateTransform attributeName="transform" type="translate" values="-${numeric(size * 1.2)} 0;${numeric(size * 1.5)} 0" dur="${6.8 + index * .6}s" repeatCount="indefinite"/>` : ""}
    </path>`;
    return `<g id="asterism-letter-${index}" transform="translate(${x} ${y}) rotate(${angle})">
      <text x="0" y="2" ${base} fill="none" stroke="#7db6ce" stroke-width="${numeric(size * .048)}"
        stroke-linejoin="round" opacity=".14" filter="url(#asterism-letter-halo)">${xml(char)}</text>
      <text x="0" y="0" ${base} fill="#152d46" stroke="#d6e2df" stroke-width="${numeric(size * .044)}"
        stroke-linejoin="round" paint-order="stroke fill" opacity=".97">${xml(char)}</text>
      <text x="0" y="0" ${base} fill="url(#asterism-silver)" stroke="url(#asterism-rim)"
        stroke-width="${numeric(size * .013)}" stroke-linejoin="round" paint-order="stroke fill">${xml(char)}</text>
      <g clip-path="url(#asterism-glyph-mask-${index})">
        ${engraving}
        ${gleam}
      </g>
      <path d="M${numeric(-size * .42)} ${numeric(size * .45)} l${numeric(size * .2)} ${numeric(size * .014)}"
        fill="none" stroke="#f3d7a0" stroke-width="1.65" stroke-linecap="round" opacity=".71"/>
    </g>`;
  }

  function skyGrid(direction, animated) {
    const vertical = direction === "vertical";
    const guidePaths = vertical ? [
      "M183 157 Q419 107 657 175",
      "M176 1004 Q418 1078 657 1013"
    ] : [
      "M132 196 Q590 45 1073 198"
    ];
    const w = vertical ? 840 : 1200;
    const h = vertical ? 1200 : 760;
    const a = vertical ? { cx: 420, cy: 602, rx: 305, ry: 507 } : { cx: 600, cy: 382, rx: 518, ry: 274 };
    const ticks = [];
    for (let index = 0; index < 72; index += 1) {
      const deg = index * 5 - 90;
      // 觀測盤的刻度只落在四段短弧上；避免整個大圓框住藝術字。
      const withinSegment = (index >= 5 && index <= 17) || (index >= 24 && index <= 33) ||
        (index >= 41 && index <= 49) || (index >= 58 && index <= 67);
      if (!withinSegment) continue;
      const angle = deg * Math.PI / 180;
      const longTick = index % 6 === 0;
      const spread = longTick ? 14 : 7;
      const x1 = a.cx + a.rx * Math.cos(angle);
      const y1 = a.cy + a.ry * Math.sin(angle);
      const x2 = a.cx + (a.rx - spread) * Math.cos(angle);
      const y2 = a.cy + (a.ry - spread) * Math.sin(angle);
      ticks.push(`<path d="M${numeric(x1)} ${numeric(y1)} L${numeric(x2)} ${numeric(y2)}"
        stroke="${longTick ? '#e5c78b' : '#8fbacc'}" stroke-width="${longTick ? 1.55 : .86}" opacity="${longTick ? .8 : .5}"/>`);
    }
    const seedStars = [];
    const count = vertical ? 64 : 76;
    for (let index = 0; index < count; index += 1) {
      const angle = index * goldenAngle * Math.PI / 180;
      const distance = Math.sqrt((index + .3) / count);
      const x = w * .5 + Math.cos(angle) * (w * .455) * distance;
      const y = h * .5 + Math.sin(angle) * (h * .44) * distance;
      const radius = index % 13 === 0 ? 2.4 : index % 5 === 0 ? 1.35 : .7;
      const opacity = .26 + (index % 6) * .065;
      seedStars.push(`<circle cx="${numeric(x)}" cy="${numeric(y)}" r="${radius}" fill="${index % 3 ? '#b6dbe9' : '#f5dcaa'}" opacity="${numeric(opacity)}">
        ${animated && index % 9 === 0 ? `<animate attributeName="opacity" values=".16;.66;.16" dur="${3.3 + index * .09}s" repeatCount="indefinite"/>` : ""}
      </circle>`);
    }
    return `<g id="asterism-sky-grid" fill="none" stroke-linecap="round">
      ${guidePaths.map((path, index) => `<path d="${path}" stroke="${index % 2 ? '#d7ba82' : '#83bbd4'}" stroke-width="${index > 2 ? 1.15 : 1.65}"
        opacity="${index > 2 ? .28 : .38}" ${index > 2 ? 'stroke-dasharray="2 10"' : ''}/>`).join("\n")}
      <g id="asterism-measurement-marks">${ticks.join("\n")}</g>
      <g id="asterism-distant-stars" fill="none" stroke="none">${seedStars.join("\n")}</g>
    </g>`;
  }

  function constellation(direction, count, animated) {
    const stars = dipperCoordinates(direction, count);
    const first = stars;
    const points = group => group.map(p => p.join(",")).join(" ");
    const bowl = points([first[0], first[1], first[2], first[3], first[0]]);
    const handle = points([first[3], first[4], first[5], first[6]]);
    const greek = ["α", "β", "γ", "δ", "ε", "ζ", "η"];
    const names = ["DUBHE", "MERAK", "PHECDA", "MEGREZ", "ALIOTH", "MIZAR", "ALKAID"];
    const content = stars.map(([x, y], index) => {
      const radius = index === 3 ? 7.8 : index === 0 || index === 6 ? 10.2 : 8.6;
      const beam = index % 2 ? 19 : 23;
      const labelRight = index === 2 || index === 5 || index === 6;
      const labelDx = labelRight ? -17 : 17;
      const labelAnchor = labelRight ? "end" : "start";
      const id = `asterism-major-star-${index}`;
      return `<g id="${id}" transform="translate(${x} ${y})">
        <circle r="${numeric(radius * 3.05)}" fill="url(#asterism-star-halo)" opacity=".64">
          ${animated ? `<animate attributeName="opacity" values=".44;.91;.44" dur="${3.6 + index * .38}s" begin="-${index * .31}s" repeatCount="indefinite"/>` : ""}
        </circle>
        <circle r="${numeric(radius * 1.6)}" fill="#cceefd" opacity=".29" filter="url(#asterism-soft-light)"/>
        <path d="M${-beam} 0 H${beam} M0 ${-beam} V${beam}" stroke="#fdf3d2" stroke-width="1.35" opacity=".83"/>
        <path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke="#9ccfe1" stroke-width="1.15" opacity=".48"/>
        <circle r="${radius}" fill="#fffae8" stroke="#e1c893" stroke-width="1.2">
          ${animated ? `<animate attributeName="r" values="${numeric(radius * .82)};${numeric(radius * 1.13)};${numeric(radius * .82)}" dur="${3.8 + index * .46}s" repeatCount="indefinite"/>` : ""}
        </circle>
        <circle r="${numeric(radius * .3)}" fill="#ffffff"/>
        <text x="${labelDx}" y="${index % 2 ? -19 : -16}" text-anchor="${labelAnchor}" font-size="14"
          font-family="serif" fill="#e9ddb9" opacity=".84">${greek[index]}</text>
      </g>`;
    }).join("\n");
    const soft = `<polyline points="${bowl}"/><polyline points="${handle}"/>`;
    return `<g id="asterism-big-dipper" aria-label="北斗七星完整七星連線">
      <g fill="none" stroke="#80cfe1" stroke-width="5" opacity=".16" filter="url(#asterism-soft-light)"
        stroke-linecap="round" stroke-linejoin="round">${soft}</g>
      <g fill="none" stroke="url(#asterism-constellation)" stroke-width="1.85" opacity=".82"
        stroke-linecap="round" stroke-linejoin="round">${soft}</g>
      <g fill="none" stroke="#f6e6b9" stroke-width=".76" opacity=".62"
        stroke-dasharray="2 10" stroke-linecap="round">
        <polyline points="${bowl}"/><polyline points="${handle}"/>
        ${animated ? `<animate attributeName="stroke-dashoffset" values="0;-64" dur="11s" repeatCount="indefinite"/>` : ""}
      </g>
      ${content}
    </g>`;
  }

  function annotations(direction, animated) {
    return "";
  }

  function createSVG(text, direction, helpers, options = {}) {
    const mode = direction === "horizontal" ? "horizontal" : "vertical";
    const actual = splitCharacters(text, helpers);
    const characters = actual.length ? actual : ["星", "象", "萬", "千"];
    const positions = layout(characters.length, mode).map((slot, index) => ({ ...slot, char: characters[index] }));
    const animated = Boolean(options.animated);
    const size = sizes[mode];
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"
  viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}・星象萬千藝術字">
  <title>${xml(characters.join(""))}｜星象萬千・${mode === "vertical" ? "直式" : "橫式"}</title>
  <desc>透明背景，銀藍星象文字、北斗七星、星圖連線、天球觀測刻度與星光。</desc>
  ${svgDefinitions(positions)}
  <g id="asterism-illustration">
    ${skyGrid(mode, animated)}
    <g id="asterism-lettering">${positions.map(slot => singleGlyph(slot, animated)).join("\n")}</g>
    ${constellation(mode, characters.length, animated)}
    ${annotations(mode, animated)}
  </g>
</svg>`;
  }

  global.SlowlyAsterismVisual = Object.freeze({ canvas: sizes, createSVG });
})(window);
