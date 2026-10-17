"use strict";
/*
 * 好逸惡勞｜鬆垮軟墊 專屬 SVG 模板。
 * 完整、可讀、不壓縮，所有可見圖形均由 SVG 本體產生。
 * 本檔不引用其餘六款藝術字的 SVG 或 JS。
 */
(function (global) {
  const canvas = Object.freeze({
    vertical: { width: 840, height: 1200 },
    horizontal: { width: 1200, height: 760 }
  });
  const sansFont = 'Noto Sans CJK TC, Noto Sans TC, Microsoft JhengHei, sans-serif';
  const serifFont = 'Noto Serif CJK TC, Source Han Serif TC, PMingLiU, serif';

  function xml(value) {
    return String(value).replace(/[&<>"']/g, symbol => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
    }[symbol]));
  }

  function digits(value) {
    return Number(value.toFixed(2));
  }

  function splitLetters(raw, helpers) {
    const splitter = helpers?.splitCharacters || helpers?.characters || helpers?.chars;
    const parts = typeof splitter === "function" ? splitter(raw) : Array.from(String(raw || ""));
    return Array.from(parts).slice(0, 4);
  }

  // 1～4 字都使用獨立字位；橫式另作排版，不旋轉直式畫面。
  function slots(count, direction) {
    const total = Math.max(1, Math.min(4, count));
    if (direction === "vertical") {
      const presets = {
        1: { places: [603], size: 305 },
        2: { places: [433, 753], size: 254 },
        3: { places: [354, 600, 847], size: 205 },
        4: { places: [314, 504, 694, 884], size: 176 }
      };
      return presets[total].places.map((y, index) => ({ x: 420, y, size: presets[total].size, index }));
    }
    const presets = {
      1: { places: [600], size: 318 },
      2: { places: [420, 780], size: 270 },
      3: { places: [295, 601, 907], size: 211 },
      4: { places: [219, 471, 729, 981], size: 174 }
    };
    return presets[total].places.map((x, index) => ({ x, y: 385, size: presets[total].size, index }));
  }

  function scene(direction, animated) {
    const tall = direction === "vertical";
    const w = tall ? 840 : 1200;
    const h = tall ? 1200 : 760;
    const cx = w / 2;
    const panelTop = tall ? 159 : 160;
    const panelBottom = tall ? 1102 : 644;
    const bodyWidth = tall ? 570 : 1050;
    const bodyHeight = panelBottom - panelTop;
    const pillowDetails = Array.from({ length: 11 }, (_, index) => {
      const x = cx - bodyWidth * .44 + (bodyWidth * .88) * (index / 10);
      const y = panelBottom + Math.sin(index * .62) * 16;
      return `<path d="M${digits(x)} ${digits(y - 12)} Q${digits(x + 8)} ${digits(y + 5)} ${digits(x)} ${digits(y + 21)}"
        stroke="#e5e2e9" stroke-width="3" opacity=".58" fill="none"/>`;
    }).join("\n");
    const sleepyStars = Array.from({ length: 17 }, (_, index) => {
      const angle = index * 2.4;
      const rx = tall ? 312 : 540;
      const ry = tall ? 490 : 285;
      const x = cx + Math.cos(angle) * rx;
      const y = h * .53 + Math.sin(angle) * ry;
      const opacity = index % 3 === 0 ? .7 : .45;
      return `<g transform="translate(${digits(x)} ${digits(y)})" opacity="${opacity}">
        <path d="M-9 0 Q0 -5 9 0 Q0 5 -9 0 M0 -9 Q5 0 0 9 Q-5 0 0 -9"
          fill="#f9f1dd" stroke="#e3dff5" stroke-width="1"/>
        ${animated ? `<animateTransform attributeName="transform" additive="sum" type="translate"
          values="0 0;0 12;0 0" dur="${6 + index % 5}s" repeatCount="indefinite"/>` : ''}
      </g>`;
    }).join("\n");
    const curvedCloud = tall
      ? "M145 270 Q165 205 265 207 Q315 145 420 181 Q550 122 600 231 Q704 208 706 308 L686 944 Q660 1064 565 1070 Q435 1148 298 1076 Q143 1085 136 921 Z"
      : "M93 267 Q134 182 265 200 Q389 116 481 176 Q602 99 735 187 Q880 151 984 204 Q1108 185 1110 312 L1090 536 Q1058 617 906 621 Q788 680 610 643 Q446 674 308 619 Q151 656 101 545 Z";
    return `<defs>
      <linearGradient id="sloth-cloud-blanket" x1="0" y1="0" x2=".8" y2="1">
        <stop stop-color="#f0ecf2"/><stop offset=".45" stop-color="#cdd6e4"/>
        <stop offset=".77" stop-color="#a9b1ce"/><stop offset="1" stop-color="#ded5ea"/>
      </linearGradient>
      <linearGradient id="sloth-soft-fabric" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#f6f1e8"/><stop offset=".32" stop-color="#dce3f2"/>
        <stop offset=".68" stop-color="#8293b6"/><stop offset="1" stop-color="#9f8bb9"/>
      </linearGradient>
    </defs>
    <g id="sloth-slow-bed">
      <path d="${curvedCloud}" fill="url(#sloth-cloud-blanket)" stroke="#b5aec9" stroke-width="8"/>
      <path d="${curvedCloud}" fill="none" stroke="#f9f6ed" stroke-width="3" stroke-dasharray="6 16" opacity=".85"/>
      <rect x="${cx - bodyWidth * .43}" y="${panelBottom - 59}" width="${bodyWidth * .86}" height="81"
        rx="39" fill="#b3b4cf" opacity=".62"/>
      ${pillowDetails}
      <path d="M${cx - bodyWidth * .46} ${panelTop + 14} Q${cx - bodyWidth * .25} ${panelTop + 111}
        ${cx} ${panelTop + 36} Q${cx + bodyWidth * .25} ${panelTop - 3}
        ${cx + bodyWidth * .46} ${panelTop + 16}"
        fill="none" stroke="#fffaf1" stroke-width="15" opacity=".55"/>
      <path d="M${cx - bodyWidth * .4} ${panelBottom - 18} Q${cx} ${panelBottom + 25}
        ${cx + bodyWidth * .4} ${panelBottom - 18}"
        fill="none" stroke="#8b91b7" stroke-width="4" opacity=".57"/>
      ${sleepyStars}
      <g id="sloth-drowsy-trail" opacity=".55">
        <path d="M${cx - bodyWidth * .4} ${panelTop + 50} Q${cx - bodyWidth * .54} ${panelTop + 174}
          ${cx - bodyWidth * .42} ${panelTop + 220}" stroke="#8c7ea8" stroke-width="6" fill="none"/>
        <path d="M${cx + bodyWidth * .39} ${panelTop + 24} Q${cx + bodyWidth * .53} ${panelTop + 141}
          ${cx + bodyWidth * .38} ${panelTop + 211}" stroke="#a89cbf" stroke-width="7" fill="none"/>
      </g>
    </g>`;
  }

  function lettering(characters, positions, direction, animated) {
    return characters.map((character, index) => {
      const { x, y, size } = positions[index];
      const letter = xml(character);
      const lazyTilt = index % 2 === 0 ? -3 : 4;
      const pillowWidth = size * .94;
      const pillowHeight = size * .98;
      return `<g id="sloth-loose-letter-${index}">
        <g transform="rotate(${lazyTilt} ${x} ${y})">
          <rect x="${digits(x - pillowWidth * .52)}" y="${digits(y - pillowHeight * .55)}"
            width="${digits(pillowWidth * 1.04)}" height="${digits(pillowHeight * 1.1)}"
            rx="${digits(size * .28)}" fill="#ebecf0" stroke="#a3a4bf" stroke-width="5" opacity=".78"/>
          <rect x="${digits(x - pillowWidth * .48)}" y="${digits(y - pillowHeight * .51)}"
            width="${digits(pillowWidth * .96)}" height="${digits(pillowHeight * 1.02)}"
            rx="${digits(size * .26)}" fill="none" stroke="#ffffff" stroke-width="3"
            stroke-dasharray="4 10" opacity=".7"/>
          <text x="${x + 7}" y="${y + 12}" font-family="${sansFont}" font-size="${size * .95}"
            font-weight="800" text-anchor="middle" dominant-baseline="middle"
            fill="#6f739a" stroke="#7c789f" stroke-width="10" opacity=".6">${letter}</text>
          <text x="${x}" y="${y}" font-family="${sansFont}" font-size="${size * .95}"
            font-weight="800" text-anchor="middle" dominant-baseline="middle"
            fill="url(#sloth-soft-fabric)" stroke="#727a9f" stroke-width="7" paint-order="stroke fill">${letter}</text>
          <path d="M${x - size * .31} ${y + size * .43} Q${x} ${y + size * .57}
            ${x + size * .30} ${y + size * .43}" fill="none" stroke="#f5f1ed" stroke-width="4" opacity=".78"/>
        </g>
        ${animated ? `<animateTransform attributeName="transform" type="translate"
          values="0 0;0 ${digits(5 + index % 2 * 5)};0 0" dur="${6.5 + index * .8}s" repeatCount="indefinite"/>` : ""}
      </g>`;
    }).join("\n");
  }

  function createSVG(rawText, orientation = "vertical", helpers, options = {}) {
    const direction = orientation === "horizontal" ? "horizontal" : "vertical";
    const characters = splitLetters(rawText, helpers);
    const positions = slots(characters.length, direction);
    const animated = options.animated === true;
    const size = canvas[direction];

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}"
      viewBox="0 0 ${size.width} ${size.height}" role="img" aria-label="${xml(characters.join(""))}｜好逸惡勞">
      ${scene(direction, animated)}
      ${lettering(characters, positions, direction, animated)}
    </svg>`;
  }

  global.SlowlySlothVisual = Object.freeze({ canvas, createSVG });
})(window);
