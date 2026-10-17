"use strict";
/* =====================================================================
 * 海底隧道｜專屬透明 SVG 繪圖模板
 * 觀察主題：深海耐壓玻璃隧道、透視環形艙壁、導引燈與金屬字。
 * 與《煙波浩渺》區隔：不用浪紋、海平線、雲霧或墨色水流。
 * 畫面上可見的一切均寫進 SVG，並隨靜態、動態檔案輸出。
 * ===================================================================== */
(function (global) {
  const CANVAS = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });

  const COLORS = Object.freeze({
    abyss: "#030f20",
    indigo: "#102a49",
    midnight: "#06172c",
    steel: "#1c4c68",
    teal: "#37d5d1",
    frost: "#d9fff5",
    lamp: "#8df4da",
    signal: "#ffd18a",
    shadow: "#071224"
  });

  const FONT = '"Noto Sans CJK TC", "Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
  const round = number => Number(number.toFixed(2));

  function escapeXML(value) {
    return String(value).replace(/[&<>"']/g, symbol => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[symbol]));
  }

  function characters(text, helpers) {
    const splitter = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const value = typeof splitter === "function" ? splitter(text) : Array.from(String(text || ""));
    return Array.from(value).slice(0, 4);
  }

  function letterSlots(count, orientation) {
    if (orientation === "vertical") {
      const variants = {
        1: { positions: [594], size: 318 },
        2: { positions: [438, 748], size: 255 },
        3: { positions: [344, 589, 834], size: 207 },
        4: { positions: [302, 494, 686, 878], size: 181 }
      };
      const variant = variants[count];
      return variant.positions.map((y, index) => ({
        x: 420,
        y,
        size: variant.size,
        index
      }));
    }

    const variants = {
      1: { positions: [600], size: 332 },
      2: { positions: [415, 785], size: 274 },
      3: { positions: [296, 600, 904], size: 222 },
      4: { positions: [218, 471, 729, 983], size: 183 }
    };
    const variant = variants[count];
    return variant.positions.map((x, index) => ({
      x,
      y: 382,
      size: variant.size,
      index
    }));
  }

  // 艙體兩個方向分別繪製，橫式並非把直式旋轉九十度。
  function hullShape(orientation) {
    if (orientation === "vertical") {
      return "M420 60 C565 60 640 176 665 334 L715 926 C738 1080 621 1151 420 1151 C219 1151 102 1080 125 926 L175 334 C200 176 275 60 420 60 Z";
    }
    return "M90 381 C90 248 204 147 371 130 C530 112 750 132 893 166 C1037 198 1130 273 1130 381 C1130 489 1037 564 893 596 C750 630 530 650 371 632 C204 615 90 514 90 381 Z";
  }

  function contentDefinitions(orientation, textContent) {
    const hull = hullShape(orientation);
    return `<defs>
      <linearGradient id="tunnel-sea-metal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f1fffa"/>
        <stop offset=".19" stop-color="#90ede1"/>
        <stop offset=".43" stop-color="#2b9cae"/>
        <stop offset=".59" stop-color="#0f5a80"/>
        <stop offset=".83" stop-color="#72cdd0"/>
        <stop offset="1" stop-color="#c8f9e9"/>
      </linearGradient>
      <linearGradient id="tunnel-sea-depth" x1="0" y1="0" x2=".84" y2="1">
        <stop offset="0" stop-color="#153b57"/>
        <stop offset=".23" stop-color="#081b36"/>
        <stop offset=".68" stop-color="#041127"/>
        <stop offset="1" stop-color="#102b43"/>
      </linearGradient>
      <linearGradient id="tunnel-sea-rail" x1="0" y1="0" x2="1" y2=".8">
        <stop offset="0" stop-color="#a9fff2" stop-opacity=".9"/>
        <stop offset=".42" stop-color="#21a4b8" stop-opacity=".76"/>
        <stop offset="1" stop-color="#16314b" stop-opacity=".96"/>
      </linearGradient>
      <radialGradient id="tunnel-sea-aperture">
        <stop offset="0" stop-color="#aefff1" stop-opacity=".92"/>
        <stop offset=".25" stop-color="#49ced0" stop-opacity=".43"/>
        <stop offset=".68" stop-color="#18738b" stop-opacity=".14"/>
        <stop offset="1" stop-color="#0a1a34" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="tunnel-sea-shell-light">
        <stop offset="0" stop-color="#6bf1e4" stop-opacity=".16"/>
        <stop offset="1" stop-color="#092038" stop-opacity="0"/>
      </radialGradient>
      <filter id="tunnel-sea-glow" x="-55%" y="-55%" width="210%" height="210%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
      <clipPath id="tunnel-sea-hull-clip"><path d="${hull}"/></clipPath>
      <clipPath id="tunnel-sea-letter-clip">${textContent}</clipPath>
    </defs>`;
  }

  function stationAperture(orientation, animated) {
    const vertical = orientation === "vertical";
    const x = vertical ? 420 : 1040;
    const y = vertical ? 160 : 381;
    const size = vertical ? 1 : 0.72;
    return `<g id="tunnel-sea-far-door" transform="translate(${x} ${y}) scale(${size})">
      <ellipse rx="130" ry="72" fill="url(#tunnel-sea-aperture)"/>
      <ellipse rx="98" ry="56" fill="none" stroke="#1f647d" stroke-width="17"/>
      <ellipse rx="91" ry="49" fill="none" stroke="#b7fff2" stroke-width="3" opacity=".73"/>
      <ellipse rx="61" ry="32" fill="#64d8da" opacity=".12"/>
      <path d="M-34 -15 L-10 0 L-34 15 M-2 -15 L22 0 L-2 15 M31 -15 L55 0 L31 15"
        stroke="#afffed" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" fill="none" opacity=".73"/>
      ${animated ? `<ellipse rx="70" ry="38" fill="#83ffe9" opacity=".04">
        <animate attributeName="opacity" values=".04;.19;.04" dur="4s" repeatCount="indefinite"/>
      </ellipse>` : ""}
    </g>`;
  }

  function verticalArchitecture(animated) {
    let braces = "";
    // 結構環自遠而近，外緣冷光在深處呈現收斂的透視感。
    const ribs = [
      { y: 288, width: 132, height: 62, opacity: .38 },
      { y: 444, width: 185, height: 79, opacity: .48 },
      { y: 638, width: 228, height: 99, opacity: .63 },
      { y: 857, width: 271, height: 112, opacity: .79 },
      { y: 1054, width: 295, height: 108, opacity: .93 }
    ];
    ribs.forEach((rib, index) => {
      braces += `<g id="tunnel-sea-rib-${index + 1}" opacity="${rib.opacity}">
        <ellipse cx="420" cy="${rib.y}" rx="${rib.width}" ry="${rib.height}"
          fill="none" stroke="#07152a" stroke-width="24"/>
        <ellipse cx="420" cy="${rib.y}" rx="${rib.width}" ry="${rib.height}"
          fill="none" stroke="url(#tunnel-sea-rail)" stroke-width="12"/>
        <path d="M${round(420 - rib.width * .82)} ${round(rib.y - rib.height * .58)}
          A${rib.width} ${rib.height} 0 0 1 ${round(420 + rib.width * .82)} ${round(rib.y - rib.height * .58)}"
          stroke="#b7fff2" stroke-width="3" stroke-linecap="round" fill="none" opacity=".6"/>
      </g>`;
    });

    const leftRail = "M342 152 C283 280 218 652 175 1070";
    const rightRail = "M498 152 C557 280 622 652 665 1070";
    return `<g id="tunnel-sea-vertical-framework">
      <path d="M420 157 L150 1113 M420 157 L690 1113" fill="none"
        stroke="#4ad7da" stroke-width="4" opacity=".14"/>
      <path d="M342 152 C283 280 218 652 175 1070 M498 152 C557 280 622 652 665 1070"
        fill="none" stroke="#09182d" stroke-width="27"/>
      <path d="${leftRail} M${rightRail}" fill="none" stroke="#24647a" stroke-width="12"/>
      <path d="${leftRail} M${rightRail}" fill="none" stroke="#7befdd" stroke-width="4"
        stroke-dasharray="25 16" opacity=".95">
        ${animated ? '<animate attributeName="stroke-dashoffset" values="0;-164" dur="5.8s" repeatCount="indefinite"/>' : ""}
      </path>
      ${braces}
    </g>`;
  }

  function horizontalArchitecture(animated) {
    const ribs = [
      { x: 200, ry: 205, rx: 59, opacity: .93 },
      { x: 410, ry: 174, rx: 48, opacity: .8 },
      { x: 639, ry: 144, rx: 43, opacity: .64 },
      { x: 836, ry: 111, rx: 35, opacity: .49 },
      { x: 1022, ry: 72, rx: 24, opacity: .35 }
    ];
    const braces = ribs.map((rib, index) => `<g id="tunnel-sea-rib-${index + 1}" opacity="${rib.opacity}">
      <ellipse cx="${rib.x}" cy="381" rx="${rib.rx}" ry="${rib.ry}"
        fill="none" stroke="#081528" stroke-width="21"/>
      <ellipse cx="${rib.x}" cy="381" rx="${rib.rx}" ry="${rib.ry}"
        fill="none" stroke="url(#tunnel-sea-rail)" stroke-width="12"/>
      <path d="M${rib.x - rib.rx * .8} ${round(381 - rib.ry * .6)} A${rib.rx} ${rib.ry} 0 0 1 ${rib.x + rib.rx * .8} ${round(381 - rib.ry * .6)}"
        fill="none" stroke="#9ffff0" stroke-width="2.5" opacity=".5"/>
    </g>`).join("\n");

    const upper = "M185 192 C479 168 810 212 1062 344";
    const lower = "M185 570 C479 594 810 550 1062 418";
    return `<g id="tunnel-sea-horizontal-framework">
      <path d="M140 221 L1084 377 M140 540 L1084 386" stroke="#4fd8d8" stroke-width="3" opacity=".14"/>
      <path d="${upper} M${lower}" fill="none" stroke="#09182e" stroke-width="27"/>
      <path d="${upper} M${lower}" fill="none" stroke="#22647a" stroke-width="12"/>
      <path d="${upper} M${lower}" fill="none" stroke="#9cf8e5" stroke-width="4"
        stroke-dasharray="25 16" opacity=".95">
        ${animated ? '<animate attributeName="stroke-dashoffset" values="0;-164" dur="5.8s" repeatCount="indefinite"/>' : ""}
      </path>
      ${braces}
    </g>`;
  }

  function exteriorPlates(orientation, animated) {
    const vertical = orientation === "vertical";
    const left = vertical
      ? [
        { x: 173, y: 320, angle: -16 }, { x: 141, y: 508, angle: -9 },
        { x: 130, y: 708, angle: -4 }, { x: 153, y: 905, angle: 7 }
      ]
      : [
        { x: 274, y: 172, angle: -13 }, { x: 484, y: 151, angle: -4 },
        { x: 694, y: 155, angle: 2 }, { x: 901, y: 196, angle: 16 }
      ];
    const right = vertical
      ? [
        { x: 667, y: 320, angle: 16 }, { x: 699, y: 508, angle: 9 },
        { x: 710, y: 708, angle: 4 }, { x: 687, y: 905, angle: -7 }
      ]
      : [
        { x: 274, y: 590, angle: 13 }, { x: 484, y: 611, angle: 4 },
        { x: 694, y: 607, angle: -2 }, { x: 901, y: 566, angle: -16 }
      ];

    return `<g id="tunnel-sea-pressure-fasteners">
      ${left.concat(right).map((bolt, index) => `<g transform="translate(${bolt.x} ${bolt.y}) rotate(${bolt.angle})">
        <rect x="-15" y="-27" width="30" height="54" rx="5"
          fill="#0c2843" stroke="#427a91" stroke-width="3"/>
        <rect x="-8" y="-17" width="16" height="34" rx="3" fill="#347585" opacity=".67"/>
        <circle cx="0" cy="-16" r="4" fill="#c5fff5"/>
        <circle cx="0" cy="16" r="4" fill="#c5fff5"/>
        <path d="M-5 0 H5" stroke="#9ef7df" stroke-width="3"/>
        ${animated && index % 2 === 0 ? `<rect x="-8" y="-17" width="16" height="34" rx="3"
          fill="#75f9e4" opacity=".05">
            <animate attributeName="opacity" values=".05;.32;.05" dur="${3.3 + index / 7}s"
              begin="-${index % 4}s" repeatCount="indefinite"/>
          </rect>` : ""}
      </g>`).join("\n")}
    </g>`;
  }

  function outsideSensors(orientation, animated) {
    const vertical = orientation === "vertical";
    // 艙外是孤立的深海浮游光點與結構信標，不畫海面或水波。
    const markers = vertical
      ? [[89, 252, 3], [751, 269, 2.4], [73, 641, 3.7], [772, 618, 2.8],
        [90, 1014, 2.1], [757, 1039, 4], [209, 92, 2.4], [632, 96, 2.8]]
      : [[77, 207, 3], [1111, 165, 2.3], [59, 545, 3.4], [1117, 589, 2.2],
        [387, 85, 3], [776, 88, 2.5], [402, 685, 3.4], [832, 665, 2.2]];
    const dots = markers.map(([x, y, r], index) => `<circle cx="${x}" cy="${y}" r="${r}"
      fill="${index % 3 === 0 ? "#ffcf88" : "#a8fff0"}" opacity=".64">
      ${animated ? `<animate attributeName="opacity" values=".2;.75;.2" dur="${4 + index % 4}s"
        begin="-${index * .7}s" repeatCount="indefinite"/>` : ""}
    </circle>`).join("\n");
    return `<g id="tunnel-sea-exterior-signals">${dots}</g>`;
  }

  function typeplateMarkings(orientation) {
    if (orientation === "vertical") {
      return `<g id="tunnel-sea-depth-scale" stroke="#9df7e6" fill="none" opacity=".57">
        <path d="M205 275 h20 M195 365 h30 M185 455 h24 M179 550 h31 M167 645 h24
          M153 742 h32 M145 838 h23 M156 936 h30" stroke-width="3"/>
        <path d="M635 274 h-20 M645 365 h-30 M655 456 h-24 M661 551 h-31 M675 645 h-24
          M685 744 h-32 M695 839 h-23 M685 937 h-30" stroke-width="3"/>
      </g>`;
    }
    return `<g id="tunnel-sea-depth-scale" stroke="#a2ffe8" fill="none" opacity=".57">
      <path d="M278 198 v21 M373 177 v31 M470 168 v23 M569 167 v30 M670 174 v24
        M775 189 v30 M874 204 v20" stroke-width="3"/>
      <path d="M278 564 v-21 M373 585 v-31 M470 593 v-23 M569 595 v-30 M670 588 v-24
        M775 573 v-30 M874 558 v-20" stroke-width="3"/>
    </g>`;
  }

  function lettersVisual(chars, slots, orientation, animated) {
    const maskText = chars.map((char, index) => {
      const position = slots[index];
      return `<text x="${position.x}" y="${position.y}" font-size="${position.size}"
        text-anchor="middle" dominant-baseline="central" font-weight="900" font-family='${FONT}'>${escapeXML(char)}</text>`;
    }).join("\n");

    const rows = chars.map((char, index) => {
      const { x, y, size } = slots[index];
      const label = escapeXML(char);
      const shape = (dx, dy, attrs) => `<text x="${x + dx}" y="${y + dy}" font-size="${size}"
        text-anchor="middle" dominant-baseline="central" font-family='${FONT}'
        font-weight="900" paint-order="stroke fill" ${attrs}>${label}</text>`;
      const scale = size / 190;
      return `<g id="tunnel-sea-letter-${index + 1}">
        ${shape(12, 13, 'fill="#050e22" stroke="#040b1d" stroke-width="24" stroke-linejoin="round"')}
        ${shape(5, 6, 'fill="#144260" stroke="#061527" stroke-width="23" stroke-linejoin="round"')}
        ${shape(0, 0, 'fill="url(#tunnel-sea-metal)" stroke="#07354b" stroke-width="22" stroke-linejoin="round"')}
        ${shape(0, 0, 'fill="url(#tunnel-sea-metal)" stroke="#39b5bd" stroke-width="11" stroke-linejoin="round"')}
        ${shape(0, 0, 'fill="url(#tunnel-sea-metal)" stroke="#c4fff0" stroke-width="3.1" stroke-linejoin="round"')}
        <g transform="translate(${round(x - size * .41)} ${round(y - size * .38)}) scale(${round(scale)})">
          <circle r="5" fill="#d6fff4" stroke="#0f354a" stroke-width="3"/>
          <path d="M10 0 H23" stroke="#78d8d8" stroke-width="2.5"/>
        </g>
        <g transform="translate(${round(x + size * .38)} ${round(y + size * .34)}) scale(${round(scale)})">
          <circle r="4.5" fill="#ffd59a" stroke="#174257" stroke-width="3"/>
          <path d="M-22 0 H-10" stroke="#87fff1" stroke-width="2.5"/>
        </g>
      </g>`;
    }).join("\n");

    // 掃描線以字形裁切；字內機械光澤不是另加一層整張背景。
    const fullSize = CANVAS[orientation];
    const scan = orientation === "vertical"
      ? `<rect x="80" y="-85" width="680" height="85" fill="#bffff6" opacity=".17">
           <animate attributeName="y" values="-95;1200;-95" dur="8s" repeatCount="indefinite"/>
         </rect>`
      : `<rect x="-95" y="50" width="85" height="660" fill="#bffff6" opacity=".17">
           <animate attributeName="x" values="-95;1200;-95" dur="8s" repeatCount="indefinite"/>
         </rect>`;
    return {
      maskText,
      letters: `<g id="tunnel-sea-armor-lettering">${rows}
        ${animated ? `<g clip-path="url(#tunnel-sea-letter-clip)" pointer-events="none">${scan}</g>` : ""}
      </g>`
    };
  }

  function createSVG(rawText, orientation = "vertical", helpers, options = {}) {
    const mode = orientation === "horizontal" ? "horizontal" : "vertical";
    const chars = characters(rawText, helpers);
    const { width, height } = CANVAS[mode];
    const animated = options.animated === true;
    const slots = letterSlots(Math.max(1, chars.length), mode);
    const labels = lettersVisual(chars, slots, mode, animated);
    const shape = hullShape(mode);
    const architecture = mode === "vertical"
      ? verticalArchitecture(animated)
      : horizontalArchitecture(animated);
    const center = mode === "vertical" ? { x: 420, y: 550, rx: 380, ry: 560 }
      : { x: 602, y: 381, rx: 580, ry: 410 };

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"
      viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXML(chars.join(""))}海底隧道藝術字">
      ${contentDefinitions(mode, labels.maskText)}
      ${outsideSensors(mode, animated)}
      <g id="tunnel-sea-hull">
        <!-- 依需求取消整片艙體底板填色，保留外框與內部結構；四周畫布依然透明。 -->
        <path d="${shape}" fill="none"/>
        <g clip-path="url(#tunnel-sea-hull-clip)">
          <ellipse cx="${center.x}" cy="${center.y}" rx="${center.rx}" ry="${center.ry}"
            fill="url(#tunnel-sea-shell-light)"/>
          ${stationAperture(mode, animated)}
          ${architecture}
        </g>
        <path d="${shape}" fill="none" stroke="#031021" stroke-width="34"/>
        <path d="${shape}" fill="none" stroke="url(#tunnel-sea-rail)" stroke-width="20"/>
        <path d="${shape}" fill="none" stroke="#9bf7e5" stroke-width="3.5" opacity=".82"/>
        ${exteriorPlates(mode, animated)}
        ${typeplateMarkings(mode)}
      </g>
      ${labels.letters}
    </svg>`;
  }

  global.SlowlyUnderseaTunnelVisual = Object.freeze({
    canvas: CANVAS,
    createSVG
  });
})(window);
