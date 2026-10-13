"use strict";
/* 逐鹿中原｜鹿雨森分支標題的 SVG 本體。
 * 直接採用鹿雨森遊戲入口 game/game_style.js 的鹿角分枝演算法（seed = 5）。
 * 外觀遵循鹿雨森官網：Noto Serif TC、冷霧白、松青、細線與青綠微光。
 * 透明輸出保留少量松樹交錯疊在字下方，不再把森林重心只放在網站預覽背景。
 */
(function (global) {
  const FONT = '"Noto Serif TC", "Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const W = { vertical: 840, horizontal: 1200 };
  const H = { vertical: 1200, horizontal: 760 };

  function silvarainAntlerPaths() {
    let seed = 5;
    const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    const paths = [];
    function branch(x, y, angle, length, depth) {
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      const controlX = x + Math.cos(angle - .4) * length * .55;
      const controlY = y + Math.sin(angle - .4) * length * .55;
      paths.push(`M${x.toFixed(1)} ${y.toFixed(1)}Q${controlX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`);
      if (depth > 0) {
        branch(endX, endY, angle + .12 + (random() - .5) * .2, length * .8, depth - 1);
        branch(x + (endX - x) * .55, y + (endY - y) * .55,
          angle + .75 + (random() - .5) * .25, length * .5, depth - 1);
      }
      if (depth > 1) {
        branch(x + (endX - x) * .3, y + (endY - y) * .3,
          angle - .7, length * .42, depth - 2);
      }
    }
    branch(0, 0, -Math.PI / 2 - .55, 34, 3);
    return paths;
  }

  const DEER_PATHS = Object.freeze(silvarainAntlerPaths());
  function number(n) { return Math.round(n * 10) / 10; }

  function antler(cx, y, scale, animated = false, rotate = 0) {
    const routes = DEER_PATHS.map((d, i) => `<path d="${d}"${animated ? ` pathLength="100" class="deer-tine" style="animation-delay:${number(.2 + i * .07)}s"` : ''}/>`).join('');
    return `<g transform="translate(${number(cx)} ${number(y)}) rotate(${rotate}) scale(${scale})" fill="none" stroke="url(#antlerInk)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
       <g>${routes}</g><g transform="scale(-1 1)">${routes}</g>
     </g>`;
  }

  function horizontalSlots(length) {
    const centers = {
      1: [600],
      2: [463, 737],
      3: [332, 600, 868],
      4: [246, 482, 718, 954]
    };
    const size = { 1: 300, 2: 255, 3: 216, 4: 184 }[length];
    return centers[length].map(x => ({ x, y: 450, size }));
  }

  function verticalSlots(length) {
    const positions = {
      1: { ys: [684], size: 346 },
      2: { ys: [493, 904], size: 279 },
      3: { ys: [425, 724, 1020], size: 236 },
      4: { ys: [374, 602, 826, 1044], size: 198 }
    }[length];
    return positions.ys.map(y => ({ x: 420, y, size: positions.size }));
  }

  function pine(x, y, scale, back = false) {
    const h = number(44 * scale);
    const w = number(24 * scale);
    const fill = back ? '#17302f' : '#31544c';
    const stroke = back ? '#355a52' : '#d3ebe2';
    const trunk = back ? '#203634' : '#4b6961';
    return `<g transform="translate(${number(x)} ${number(y)})" opacity="${back ? '.42' : '.88'}">
      <path d="M0 0 L${number(-w * .18)} ${number(h * .18)} L${number(-w * .54)} ${number(h * .18)} L0 ${number(-h)} L${number(w * .54)} ${number(h * .18)} L${number(w * .18)} ${number(h * .18)} Z" fill="${fill}" stroke="${stroke}" stroke-width="${back ? '.45' : '.6'}"/>
      <path d="M0 ${number(h * .18)} V${number(h * .5)}" stroke="${trunk}" stroke-width="1.2"/>
    </g>`;
  }

  function titleForest(slots, orientation) {
    const segments = [];
    const pines = [];
    if (orientation === 'horizontal') {
      const baseline = 572;
      segments.push(`<path d="M125 ${baseline + 5} Q600 ${baseline - 14} 1075 ${baseline + 5}" stroke="url(#forestLine)" stroke-width="2" opacity=".62"/>`);
      [
        { x: 452, y: 596, s: 1.08, b: true },
        { x: 520, y: 602, s: .92, b: false },
        { x: 600, y: 590, s: 1.22, b: false },
        { x: 684, y: 602, s: .96, b: false },
        { x: 752, y: 596, s: 1.05, b: true }
      ].forEach(tree => pines.push(pine(tree.x, tree.y, tree.s, tree.b)));
    } else {
      const bottomY = slots.length === 1 ? 962 : 1132;
      if (slots.length === 1) {
        segments.push(`<path d="M240 944 Q420 930 600 944" stroke="url(#forestLine)" stroke-width="2" opacity=".54"/>`);
      } else {
        for (let i = 0; i < slots.length - 1; i++) {
          const y = (slots[i].y + slots[i + 1].y) / 2 + 13;
          segments.push(`<path d="M300 ${number(y + 5)} Q420 ${number(y - 9)} 540 ${number(y + 5)}" stroke="url(#forestLine)" stroke-width="2" opacity=".46"/>`);
        }
      }
      [
        { x: 332, y: bottomY + 6, s: 1.0, b: true },
        { x: 384, y: bottomY + 16, s: .82, b: false },
        { x: 420, y: bottomY - 6, s: 1.25, b: false },
        { x: 460, y: bottomY + 18, s: .86, b: false },
        { x: 514, y: bottomY + 6, s: 1.02, b: true }
      ].forEach(tree => pines.push(pine(tree.x, tree.y, tree.s, tree.b)));
    }
    return `<g aria-hidden="true">${segments.join('')}<g class="deer-forest-back">${pines.filter((_, i) => i === 0 || i === pines.length - 1).join('')}</g><g class="deer-forest-front">${pines.filter((_, i) => i !== 0 && i !== pines.length - 1).join('')}</g></g>`;
  }

  function createSVG(raw, orientation, helpers, options = {}) {
    if (!W[orientation]) throw new Error('不支援的排列方式。');
    const chars = helpers.splitCharacters(raw).slice(0, 4);
    if (!chars.length) throw new Error('請輸入至少一個字。');
    const escape = helpers.escapeXML;
    const safe = escape(chars.join(''));
    const horizontal = orientation === 'horizontal';
    const width = W[orientation], height = H[orientation];
    const slots = horizontal ? horizontalSlots(chars.length) : verticalSlots(chars.length);
    const font = escape(FONT);
    const labelShadow = chars.map((char, i) => {
      const s = slots[i];
      return `<text x="${number(s.x + 5)}" y="${number(s.y + 7)}" font-family="${font}" font-size="${s.size}" font-weight="700" text-anchor="middle" dominant-baseline="central" letter-spacing="0" fill="#071213" opacity=".34"${options.animated ? ` class="deer-letter" style="animation-delay:${number(1 + i * .5)}s"` : ''}>${escape(char)}</text>`;
    }).join('');
    const label = chars.map((char, i) => {
      const s = slots[i];
      return `<text x="${s.x}" y="${s.y}" font-family="${font}" font-size="${s.size}" font-weight="700" text-anchor="middle" dominant-baseline="central" letter-spacing="0" fill="url(#titleInk)" stroke="#d3ebe2" stroke-width=".75" paint-order="stroke fill"${options.animated ? ` class="deer-letter" style="animation-delay:${number(1 + i * .5)}s"` : ''}>${escape(char)}</text>`;
    }).join('');
    const emblemPlacement = (() => {
      if (horizontal) {
        const first = slots[0];
        const second = slots[Math.min(1, slots.length - 1)];
        const cx = number((first.x + second.x) / 2);
        const y = number(first.y + first.size * (slots.length === 1 ? 0.54 : 0.50));
        const scale = slots.length === 1 ? 2.45 : slots.length === 2 ? 2.55 : slots.length === 3 ? 2.3 : 2.14;
        return { cx, y, scale, rotate: 0 };
      }
      if (slots.length === 1) {
        return { cx: 344, y: number(slots[0].y + slots[0].size * 0.88), scale: 2.55, rotate: -45 };
      }
      const first = slots[0];
      const second = slots[1];
      const cx = 336;
      const y = number(((first.y + second.y) / 2) + first.size * 0.48);
      const scale = slots.length === 2 ? 2.78 : slots.length === 3 ? 2.56 : 2.36;
      return { cx, y, scale, rotate: -45 };
    })();
    const emblem = antler(emblemPlacement.cx, emblemPlacement.y, emblemPlacement.scale, !!options.animated, emblemPlacement.rotate || 0);
    const forest = titleForest(slots, orientation);
    const rule = horizontal ? `<path d="M445 642 H755" stroke="url(#ruleInk)" stroke-width="1.5" opacity=".72"/>` : `<path d="M340 1178 H500" stroke="url(#ruleInk)" stroke-width="1.5" opacity=".62"/>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="branchTitle branchDesc">
  <title id="branchTitle">${safe}｜鹿雨森分支標題</title>
  <desc id="branchDesc">${safe}：鹿雨森鹿角標誌、冷霧白色宋體，以及交錯疊在字下方的松樹剪影；無背景。</desc>
  ${options.animated ? `<style>
    @keyframes deer-trace { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
    @keyframes deer-letter-rise { from { opacity: 0; filter: blur(9px); transform: translateY(11px); } to { opacity: 1; filter: none; transform: translateY(0); } }
    @keyframes deer-tree-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .deer-tine { stroke-dasharray: 100; stroke-dashoffset: 100; animation: deer-trace 2.2s ease forwards; }
    .deer-letter { opacity: 0; animation: deer-letter-rise 2.6s cubic-bezier(.2,.7,.2,1) forwards; }
    .deer-forest-front, .deer-forest-back { opacity: 0; animation: deer-tree-fade 1.2s ease forwards; animation-delay: 2.3s; }
    .deer-forest-front { animation-delay: 2.55s; }
    @media (prefers-reduced-motion: reduce) {
      .deer-tine { animation: none; stroke-dashoffset: 0; }
      .deer-letter, .deer-forest-front, .deer-forest-back { animation: none; opacity: 1; }
    }
  </style>` : ''}
  <defs>
    <linearGradient id="titleInk" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#f4faf7"/><stop offset=".48" stop-color="#dfefe9"/><stop offset="1" stop-color="#97c1b3"/>
    </linearGradient>
    <linearGradient id="antlerInk" x1="0" y1="0" x2=".8" y2="1">
      <stop stop-color="#e9f8f2"/><stop offset=".56" stop-color="#b6e3d3"/><stop offset="1" stop-color="#87cfb9"/>
    </linearGradient>
    <linearGradient id="forestLine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#87cfb9" stop-opacity="0"/><stop offset=".5" stop-color="#9acfc0"/><stop offset="1" stop-color="#87cfb9" stop-opacity="0"/></linearGradient>
    <linearGradient id="ruleInk" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#87cfb9" stop-opacity="0"/><stop offset=".5" stop-color="#87cfb9"/><stop offset="1" stop-color="#87cfb9" stop-opacity="0"/></linearGradient>
    <filter id="titleHalo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="textShadow" x="-30%" y="-30%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4.8"/>
    </filter>
  </defs>
  <g opacity=".18" filter="url(#titleHalo)">${emblem}</g>
  ${emblem}
  <g filter="url(#textShadow)">${labelShadow}</g>
  <g fill="#b3d9cc" opacity=".16" filter="url(#titleHalo)">${label}</g>
  <g>${label}</g>
  ${forest}
  ${rule}
</svg>`;
  }

  global.SlowlyDeerVisual = Object.freeze({ createSVG, antlerSource: 'silvarain/game/game_style.js', font: FONT });
})(window);
