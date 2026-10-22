"use strict";
/* ============================================================================
 * 車水馬龍｜第 47 款・霓虹車流 SVG 專屬繪圖模板
 *
 * 構圖核心：中間主字 + 上下兩道霓虹流光帶。
 * 透明背景；字體採 Electric Border 的四組官方預設 RGB 顏色，
 * 並將其轉換成自足 SVG 筆畫漸層與流動動畫，完整保留下載內容。
 * 不改成容器四邊框，不把彩色線放到文字左右，維持既定上下車流。
 * ============================================================================ */
(function (global) {
  const canvas = Object.freeze({
    vertical: Object.freeze({ width: 840, height: 1200 }),
    horizontal: Object.freeze({ width: 1200, height: 760 })
  });
  const font = '"Noto Sans CJK TC", "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';

  function fixed(value) {
    return Number(value.toFixed(2));
  }

  function escapeXML(text) {
    return String(text).replace(/[&<>"']/g, symbol => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[symbol]));
  }

  function split(text, helpers) {
    const fn = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const result = typeof fn === "function" ? fn(text) : Array.from(String(text || ""));
    return Array.from(result).slice(0, 4);
  }

  // 參考《星河入夢》的緊密字距：讓相鄰字真正貼近、部分筆畫交疊。
  // 文字像塞滿夜間車道的車潮，而不是四個互不相干的路標。
  // 兩種方向各自有專屬位置；1～4 字皆維持中心構圖及上下車軌。
  function positions(count, direction) {
    if (direction === "vertical") {
      const presets = {
        1: { y: [586], x: [420], size: [365] },
        2: { y: [475, 711], x: [411, 430], size: [350, 346] },
        3: { y: [379, 579, 779], x: [410, 432, 414], size: [310, 306, 312] },
        4: { y: [350, 514, 678, 842], x: [410, 428, 411, 429], size: [260, 257, 262, 258] }
      };
      const rule = presets[count];
      return rule.y.map((y, index) => ({
        x: rule.x[index],
        y,
        size: rule.size[index],
        angle: count === 1 ? 0 : [-4, 3, -3, 4][index],
        index
      }));
    }

    const presets = {
      1: { x: [600], y: [390], size: [365] },
      2: { x: [489, 714], y: [381, 402], size: [355, 355] },
      3: { x: [388, 600, 815], y: [379, 405, 382], size: [310, 306, 310] },
      4: { x: [286, 491, 701, 914], y: [377, 399, 380, 400], size: [264, 261, 267, 263] }
    };
    const rule = presets[count];
    return rule.x.map((x, index) => ({
      x,
      y: rule.y[index],
      size: rule.size[index],
      angle: count === 1 ? 0 : [-3, 3, -2, 4][index],
      index
    }));
  }

  function defs(letters, animated) {
    const clips = letters.map((slot, index) => `<clipPath id="traffic-letter-clip-${index}">
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${slot.size}" font-weight="900" letter-spacing="${fixed(slot.size * 0.03)}">${escapeXML(slot.char)}</text>
    </clipPath>`).join("\n");

    return `<defs>
      <linearGradient id="traffic-neon-fill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#111c39"/>
        <stop offset="0.38" stop-color="#17305e"/>
        <stop offset="0.7" stop-color="#142547"/>
        <stop offset="1" stop-color="#0f1630"/>
      </linearGradient>
      <!-- Electric Border in the official library uses these exact four default colors.
           That effect targets a host element's box edge. For self-contained SVG
           downloads, this artwork uses an SVG gradient with that official palette. -->
      <linearGradient id="traffic-electric-rgb" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="rgb(255, 70, 120)"/>
        <stop offset=".28" stop-color="rgb(80, 210, 255)"/>
        <stop offset=".57" stop-color="rgb(175, 90, 255)"/>
        <stop offset=".82" stop-color="rgb(90, 255, 180)"/>
        <stop offset="1" stop-color="rgb(255, 70, 120)"/>
        ${animated ? `<animateTransform attributeName="gradientTransform" type="rotate"
          values="0 .5 .5;360 .5 .5" dur="9s" repeatCount="indefinite"/>` : ""}
      </linearGradient>
      <linearGradient id="traffic-road-cyan" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#38f7ff" stop-opacity=".28"/>
        <stop offset="0.55" stop-color="#7fefff" stop-opacity=".95"/>
        <stop offset="1" stop-color="#fff27a" stop-opacity=".8"/>
      </linearGradient>
      <linearGradient id="traffic-road-magenta" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffd06a" stop-opacity=".18"/>
        <stop offset="0.3" stop-color="#ffe269" stop-opacity=".92"/>
        <stop offset="0.65" stop-color="#55f2ff" stop-opacity=".95"/>
        <stop offset="1" stop-color="#7090ff" stop-opacity=".24"/>
      </linearGradient>
      <filter id="traffic-soft-glow" x="-180%" y="-180%" width="460%" height="460%">
        <feGaussianBlur stdDeviation="10"/>
      </filter>
      <filter id="traffic-hard-glow" x="-180%" y="-180%" width="460%" height="460%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <filter id="traffic-lane-glow" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="7"/>
      </filter>
      ${clips}
    </defs>`;
  }

  function letterGroup(slot, direction, animated) {
    const x = slot.x;
    const y = slot.y;
    const size = slot.size;
    const char = escapeXML(slot.char);
    const segmentGap = direction === "horizontal" ? 11 : 10;
    const glowShift = slot.index % 2 ? -8 : 8;

    // 字體材質、RGB 邊緣、光暈與內部道標都直接繪進 SVG。
    // Electric Border 是 CSS 宿主邊框零件，不能直接套用在 glyph 的 SVG path。
    // 此處精確沿用 Electric Border 四組預設色，絕不在頁面自行畫額外四邊框。
    return `<g transform="translate(${x} ${y}) rotate(${slot.angle})" id="traffic-letter-${slot.index}">
      <text x="${glowShift}" y="${glowShift * .42}" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="#081126" opacity=".4">${char}</text>
      <text x="${fixed(glowShift * .42)}" y="${fixed(glowShift * .16)}" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="#14264c" opacity=".22">${char}</text>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="none" stroke="url(#traffic-electric-rgb)" stroke-width="${fixed(size * .135)}"
        stroke-linejoin="round" stroke-linecap="round" opacity=".48" filter="url(#traffic-hard-glow)">${char}</text>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="url(#traffic-neon-fill)" stroke="url(#traffic-electric-rgb)"
        stroke-width="${fixed(size * .098)}" stroke-linejoin="round" paint-order="stroke fill">${char}</text>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="#f5fbff">${char}</text>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="url(#traffic-electric-rgb)" opacity=".25">${char}</text>
      <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${font}' font-size="${size}" font-weight="900" letter-spacing="${fixed(size * .03)}"
        fill="none" stroke="url(#traffic-electric-rgb)" stroke-width="${fixed(size * .026)}"
        stroke-linejoin="round" stroke-linecap="round" opacity=".72">${char}</text>
      <g clip-path="url(#traffic-letter-clip-${slot.index})">
        <path d="M${-size * .65} ${-size * .21} H${size * .66}
          M${-size * .48} ${size * .06} H${size * .48}
          M${-size * .3} ${size * .29} H${size * .34}"
          fill="none" stroke="url(#traffic-electric-rgb)" stroke-width="${fixed(size * .04)}"
          stroke-linecap="round" stroke-dasharray="${fixed(size * .14)} ${segmentGap}" opacity=".79"/>
        <path d="M${-size * .08} ${-size * .54} V${size * .56}"
          fill="none" stroke="url(#traffic-electric-rgb)" stroke-width="${fixed(size * .017)}"
          stroke-linecap="round" opacity=".78"/>
        <ellipse cx="${fixed(size * .12)}" cy="${fixed(-size * .18)}"
          rx="${fixed(size * .42)}" ry="${fixed(size * .12)}"
          fill="url(#traffic-road-cyan)" opacity=".15" filter="url(#traffic-soft-glow)"/>
        ${animated ? `<path d="M${-size * .75} ${-size * .17} H${size * .74}"
          fill="none" stroke="#ffffff" stroke-width="${fixed(size * .028)}"
          opacity=".9" stroke-dasharray="${fixed(size * .12)} ${fixed(size * 1.36)}">
          <animate attributeName="stroke-dashoffset" values="0;-${fixed(size * 1.48)}"
            dur="${5.2 + slot.index * .65}s" repeatCount="indefinite"/>
        </path>` : ""}
      </g>
      <path d="M${-size * .74} ${size * .45} H${size * .74}"
        fill="none" stroke="url(#traffic-electric-rgb)" stroke-width="${fixed(size * .016)}"
        opacity=".3" filter="url(#traffic-hard-glow)"/>
    </g>`;
  }

  function laneSet(direction, position, animated) {
    const vertical = direction === "vertical";
    const top = position === "top";
    const pathId = `traffic-${direction}-${position}-path`;
    let lanePath = "";
    let accentPath = "";
    let dotPath = "";
    if (vertical) {
      if (top) {
        lanePath = `M108 258 C174 175 276 146 420 146 S664 176 732 264`;
        accentPath = `M122 284 C205 208 295 190 420 188 S638 205 715 279`;
        dotPath = `M128 318 C221 228 307 216 420 214 S617 228 706 312`;
      } else {
        lanePath = `M108 944 C176 1016 280 1047 420 1052 S664 1016 732 944`;
        accentPath = `M122 914 C203 980 298 993 420 995 S639 979 715 916`;
        dotPath = `M126 878 C208 944 302 960 420 962 S632 944 714 882`;
      }
    } else {
      if (top) {
        lanePath = `M82 176 C198 112 374 96 600 98 S1002 122 1116 178`;
        accentPath = `M92 214 C221 151 388 138 600 140 S980 158 1106 215`;
        dotPath = `M108 246 C237 184 399 173 600 175 S967 186 1091 248`;
      } else {
        lanePath = `M82 582 C196 641 374 664 600 666 S1004 645 1118 584`;
        accentPath = `M92 544 C218 601 386 615 600 617 S982 602 1107 548`;
        dotPath = `M108 513 C237 568 398 579 600 580 S965 568 1091 514`;
      }
    }

    const carDur = top ? [6.6, 8.2, 9.4] : [7.4, 9.6, 6.8];
    const dashDur = top ? 7.2 : 8.1;
    // 靜態檔讓車燈固定在光軌上；動態檔才沿路徑行駛。
    const parkedLights = vertical
      ? (top ? [[265, 168], [420, 146], [575, 168]] : [[265, 1022], [420, 1052], [575, 1022]])
      : (top ? [[300, 123], [600, 98], [903, 134]] : [[300, 630], [600, 666], [900, 634]]);

    return `<g id="${pathId}-group" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path id="${pathId}" d="${lanePath}" stroke="#55efff" stroke-width="${vertical ? 10 : 12}" opacity=".18" filter="url(#traffic-lane-glow)"/>
      <path d="${lanePath}" stroke="url(#traffic-road-cyan)" stroke-width="${vertical ? 4.2 : 4.8}" opacity=".95"/>
      <path d="${accentPath}" stroke="#1f1f4f" stroke-width="${vertical ? 7 : 8}" opacity=".5"/>
      <path d="${accentPath}" stroke="url(#traffic-road-magenta)" stroke-width="${vertical ? 2.6 : 3}" opacity=".95" stroke-dasharray="34 18 10 16">
        ${animated ? `<animate attributeName="stroke-dashoffset" values="0;-156" dur="${dashDur}s" repeatCount="indefinite"/>` : ""}
      </path>
      <path d="${dotPath}" stroke="#fff58d" stroke-width="${vertical ? 1.8 : 2.1}" opacity=".88" stroke-dasharray="20 24 54 16"/>
      ${movingLight(pathId, top ? '#ffe76f' : '#54f1ff', vertical ? 7 : 8, carDur[0], top ? .95 : .8, animated, parkedLights[0])}
      ${movingLight(pathId, top ? '#7dff86' : '#6f8cff', vertical ? 5 : 6, carDur[1], .9, animated, parkedLights[1])}
      ${movingLight(pathId, top ? '#59f6ff' : '#fff6b1', vertical ? 4.5 : 5, carDur[2], .85, animated, parkedLights[2])}
    </g>`;
  }

  function movingLight(pathId, color, radius, duration, opacity, animated, parkedPosition) {
    // 未啟用動畫時不能留下 animateMotion；也不能把車燈卡在 SVG 原點。
    const [parkedX, parkedY] = parkedPosition;
    const motion = animated ? `<animateMotion dur="${duration}s" repeatCount="indefinite" rotate="auto">
      <mpath href="#${pathId}"/>
    </animateMotion>` : "";
    return `<g opacity="${opacity}">
      <circle cx="${animated ? 0 : parkedX}" cy="${animated ? 0 : parkedY}" r="${radius}" fill="${color}" filter="url(#traffic-hard-glow)">
        ${motion}
      </circle>
      <circle cx="${animated ? 0 : parkedX}" cy="${animated ? 0 : parkedY}" r="${fixed(radius * 1.85)}" fill="${color}" opacity=".2" filter="url(#traffic-soft-glow)">
        ${motion}
      </circle>
    </g>`;
  }

  // 上下流光兩側的短裝飾弧保留；移除左右長弧線。
  function shortLaneAccents(direction, animated) {
    const vertical = direction === "vertical";
    const paths = vertical ? [
      { d: 'M157 252 C204 221 248 216 283 236', color: '#ffd66d', width: 2.4, dash: '' },
      { d: 'M557 962 C603 938 648 939 692 965', color: '#8b7aff', width: 2.4, dash: '' }
    ] : [
      { d: 'M176 188 C240 154 318 155 381 190', color: '#ffd66d', width: 2.4, dash: '' },
      { d: 'M820 573 C886 607 955 606 1027 572', color: '#8b7aff', width: 2.4, dash: '' }
    ];
    return `<g id="traffic-short-lane-accents" fill="none" stroke-linecap="round">
      ${paths.map((item, index) => `<path d="${item.d}" stroke="${item.color}" stroke-width="${item.width}" opacity=".44" ${item.dash ? `stroke-dasharray="${item.dash}"` : ''}>
        ${animated && item.dash ? `<animate attributeName="stroke-dashoffset" values="0;-${index % 2 ? 62 : 88}" dur="${5.8 + index}s" repeatCount="indefinite"/>` : ''}
      </path>`).join("\n")}
    </g>`;
  }

  function particles(direction, animated) {
    const vertical = direction === "vertical";
    const points = vertical ? [
      [138, 176, '#50edff', 4], [236, 202, '#82ff8d', 3], [604, 187, '#ffe36d', 4], [694, 212, '#79ffe2', 3],
      [184, 366, '#5ee9ff', 3], [658, 392, '#ffd66d', 3], [108, 566, '#ffe36d', 2.6], [734, 632, '#63f0ff', 3],
      [161, 822, '#82ff8d', 3], [648, 876, '#ffe36d', 3.5], [250, 1022, '#53f4ff', 2.8], [591, 1044, '#ae87ff', 3.2],
      [417, 126, '#ffffff', 3.4], [420, 1076, '#ffffff', 3.4]
    ] : [
      [112, 138, '#53f4ff', 4], [256, 120, '#81ff8a', 3], [462, 96, '#ffe36d', 3.4], [738, 96, '#53f4ff', 3.4],
      [942, 122, '#ffd66d', 3.4], [1083, 144, '#fff291', 3.2], [132, 612, '#ffe36d', 3.5], [278, 639, '#82ff8d', 3],
      [508, 663, '#53f4ff', 3.2], [700, 664, '#ffffff', 3], [938, 641, '#ae87ff', 3.2], [1081, 612, '#53f4ff', 3]
    ];
    const rectangles = vertical ? [
      [176, 242, '#66efff', 20, 6, -12], [654, 258, '#ffd66d', 17, 6, 15], [208, 943, '#fff08a', 18, 5, -15], [625, 921, '#8f78ff', 16, 6, 14]
    ] : [
      [196, 194, '#66efff', 18, 6, -12], [355, 566, '#ffd66d', 16, 5, 13], [827, 192, '#fff08a', 18, 5, -14], [997, 552, '#8f78ff', 16, 6, 14]
    ];
    return `<g id="traffic-particles">
      ${points.map(([x, y, color, size], index) => `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity=".88">
        ${animated ? `<animate attributeName="opacity" values=".24;.95;.24" dur="${3 + index * .35}s" repeatCount="indefinite"/>` : ''}
      </circle>`).join("\n")}
      ${rectangles.map(([x, y, color, w, h, angle], index) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${fixed(h / 2)}" fill="${color}" opacity=".82" transform="rotate(${angle} ${x + w / 2} ${y + h / 2})">
        ${animated ? `<animate attributeName="opacity" values=".14;.88;.14" dur="${4.8 + index}s" repeatCount="indefinite"/>` : ''}
      </rect>`).join("\n")}
    </g>`;
  }

  function skylineHints(direction) {
    const vertical = direction === "vertical";
    const hints = vertical ? [
      { x: 190, y: 165, w: 24, h: 66 }, { x: 219, y: 177, w: 13, h: 52 }, { x: 612, y: 160, w: 22, h: 60 },
      { x: 637, y: 183, w: 14, h: 44 }, { x: 199, y: 981, w: 20, h: 55 }, { x: 625, y: 982, w: 22, h: 58 }
    ] : [
      { x: 160, y: 108, w: 18, h: 48 }, { x: 186, y: 116, w: 12, h: 38 }, { x: 996, y: 108, w: 20, h: 48 },
      { x: 1022, y: 116, w: 12, h: 38 }, { x: 156, y: 606, w: 18, h: 42 }, { x: 1010, y: 606, w: 20, h: 42 }
    ];
    return `<g id="traffic-skyline-hints" opacity=".45">
      ${hints.map(item => `<rect x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" rx="4" fill="#112042" stroke="#5cecff" stroke-width="1.2"/>
        <path d="M${item.x + 4} ${item.y + 10} H${item.x + item.w - 4} M${item.x + 4} ${item.y + 22} H${item.x + item.w - 4}" stroke="#ffe86e" stroke-width="1.2" opacity=".9"/>`).join("\n")}
    </g>`;
  }

  function createSVG(text, direction, helpers, options = {}) {
    const chars = split(text, helpers);
    const animated = Boolean(options.animated);
    const safeChars = chars.length ? chars : ["車", "水", "馬", "龍"];
    const size = canvas[direction];
    const layout = positions(safeChars.length, direction).map((slot, index) => ({ ...slot, char: safeChars[index] || safeChars[safeChars.length - 1] }));

    const letters = layout.map(slot => letterGroup(slot, direction, animated)).join("\n");
    const topLane = laneSet(direction, "top", animated);
    const bottomLane = laneSet(direction, "bottom", animated);
    const arcs = shortLaneAccents(direction, animated);
    const dots = particles(direction, animated);
    const hints = skylineHints(direction);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${size.height}" width="${size.width}" height="${size.height}" aria-label="${escapeXML(text || '車水馬龍')}" role="img">
  ${defs(layout, animated)}
  <g id="traffic-lettering-root">
    ${hints}
    ${topLane}
    ${bottomLane}
    ${arcs}
    <g id="traffic-letters">${letters}</g>
    ${dots}
  </g>
</svg>`;
  }

  global.SlowlyTrafficVisual = Object.freeze({
    canvas,
    createSVG
  });
})(window);
