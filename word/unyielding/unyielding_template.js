"use strict";
/* 寧折不彎｜黑鐵冷光 × 應力裂縫 × 尾壓頭交疊。 */
(function (global) {
  const FONT = '"Noto Sans CJK TC", "Microsoft JhengHei", sans-serif';
  const round = value => Math.round(value * 100) / 100;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function escapeXML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function buildSlots(count, orientation) {
    if (orientation === 'horizontal') {
      const width = 1200;
      const y = 390;
      const sizes = { 1: 340, 2: 316, 3: 282, 4: 250 };
      const size = sizes[count] || 250;
      const gap = size * 0.88;
      const total = size + (count - 1) * gap;
      const start = (width - total) / 2 + size / 2;
      const offsets = [-9, 6, -4, 5];
      return Array.from({ length: count }, (_, index) => ({
        x: round(start + index * gap),
        y: round(y + offsets[index]),
        size,
        rotate: 0,
        index
      }));
    }

    const height = 1200;
    const x = 420;
    const sizes = { 1: 402, 2: 338, 3: 300, 4: 264 };
    const size = sizes[count] || 264;
    const gap = size * 0.88;
    const total = size + (count - 1) * gap;
    const start = (height - total) / 2 + size / 2;
    const offsets = [-8, 5, -6, 4];
    return Array.from({ length: count }, (_, index) => ({
      x: round(x + offsets[index]),
      y: round(start + index * gap),
      size,
      rotate: 0,
      index
    }));
  }

  function localGroup(slot, inner) {
    const scale = round(slot.size / 260);
    return `<g transform="translate(${round(slot.x)} ${round(slot.y)}) scale(${scale})">${inner}</g>`;
  }

  function crackPaths(index, orientation) {
    const sets = orientation === 'horizontal'
      ? [
          ['M-118 -62 C-66 -58 -33 -26 -5 12 C12 36 47 68 104 110', 'M-48 -126 C-36 -76 -13 -42 33 -8 C62 12 88 36 118 75', 'M-138 22 C-96 -10 -57 -8 -24 16 C17 45 64 51 128 28'],
          ['M-122 -28 C-80 -55 -39 -34 -12 4 C22 51 55 82 117 116', 'M-71 -136 C-64 -93 -39 -47 6 -2 C48 42 82 48 124 24', 'M-130 58 C-76 28 -38 22 3 43 C34 60 82 54 138 18'],
          ['M-134 -92 C-82 -74 -53 -49 -21 -4 C5 30 46 72 123 116', 'M-84 -138 C-59 -108 -28 -80 8 -51 C41 -24 76 -4 116 34', 'M-141 38 C-95 6 -58 6 -18 31 C18 55 65 63 135 45'],
          ['M-128 -54 C-75 -57 -35 -37 -3 2 C31 45 64 82 120 123', 'M-44 -134 C-35 -92 -9 -53 35 -18 C66 8 90 34 116 73', 'M-142 17 C-93 -11 -47 -10 -9 16 C25 39 72 49 138 31']
        ]
      : [
          ['M-96 -136 C-76 -83 -44 -46 -4 -9 C29 22 52 52 68 138', 'M42 -124 C20 -73 6 -45 -10 -14 C-30 29 -63 78 -104 126', 'M-140 20 C-84 -2 -48 -5 -10 17 C25 35 79 34 134 8'],
          ['M-114 -140 C-98 -92 -63 -59 -24 -18 C16 25 44 66 70 144', 'M68 -122 C35 -71 18 -34 -2 10 C-18 42 -48 76 -96 122', 'M-142 42 C-91 16 -43 14 -4 37 C35 60 87 58 142 22'],
          ['M-104 -140 C-74 -102 -48 -71 -20 -37 C18 9 52 46 86 138', 'M54 -127 C34 -86 18 -47 8 -14 C-12 48 -47 82 -94 119', 'M-138 7 C-84 -14 -34 -10 0 11 C40 37 88 42 144 22'],
          ['M-116 -141 C-88 -96 -58 -67 -30 -38 C5 -3 38 34 72 145', 'M72 -116 C38 -71 15 -30 6 7 C-4 44 -31 80 -87 117', 'M-136 31 C-86 5 -48 2 -6 20 C31 38 84 44 138 23']
        ];
    return sets[index % sets.length];
  }

  function innerTexture(slot, clipId) {
    const brushed = Array.from({ length: 12 }, (_, i) => {
      const y = -150 + i * 28;
      return `<path d="M-165 ${y} Q-36 ${y - 28} 164 ${y + 6}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="7" opacity=".28"/>`;
    }).join('');

    const dents = Array.from({ length: 10 }, (_, i) => {
      const cx = -128 + (i * 29 % 256);
      const cy = -118 + (i * 47 % 240);
      const rx = 9 + (i % 3) * 4;
      const ry = 4 + (i % 2) * 2;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(8,11,15,.24)"/>`;
    }).join('');

    const cracks = crackPaths(slot.index, slot.orientation).map((path, pathIndex) => (
      `<path d="${path}" fill="none" stroke="#0e1217" stroke-width="${pathIndex === 0 ? 13 : 9}" stroke-linecap="round" stroke-linejoin="round" opacity=".88"/>
       <path d="${path}" fill="none" stroke="#d8edf8" stroke-width="${pathIndex === 0 ? 4.6 : 3.2}" stroke-linecap="round" stroke-linejoin="round" opacity=".72" filter="url(#coldGlow)"/>`
    )).join('');

    const rim = `<path d="M-150 -112 C-80 -146 18 -149 142 -98" fill="none" stroke="rgba(237,246,255,.55)" stroke-width="10" opacity=".65"/>
      <path d="M-134 119 C-42 94 36 102 137 58" fill="none" stroke="rgba(8,11,15,.38)" stroke-width="10" opacity=".55"/>`;

    return `<g clip-path="url(#${clipId})">${brushed}${dents}${cracks}${rim}</g>`;
  }

  function contactDecor(slots, orientation, animated) {
    return slots.slice(0, -1).map((slot, index) => {
      const next = slots[index + 1];
      const x = orientation === 'horizontal'
        ? round((slot.x + next.x) / 2 + 8)
        : round(slot.x + 34);
      const y = orientation === 'horizontal'
        ? round(slot.y - 56)
        : round((slot.y + next.y) / 2 - 16);
      const burst = `
        <g transform="translate(${x} ${y})">
          <path d="M-21 26 L-3 5 L11 20 L28 -11" fill="none" stroke="#d7ebf5" stroke-width="4" stroke-linecap="round" opacity=".72" filter="url(#coldGlow)">
            ${animated ? '<animate attributeName="opacity" values=".48;.88;.48" dur="2.9s" begin="' + (index * .33) + 's" repeatCount="indefinite"/>' : ''}
          </path>
          <path d="M-30 -8 L-10 -1 M5 -24 L18 -5 M-5 28 L10 10" fill="none" stroke="#0b1016" stroke-width="5" stroke-linecap="round" opacity=".82"/>
          <path d="M-35 -13 L-22 -28 M19 -15 L35 -26 M-28 30 L-40 44" fill="none" stroke="#dbeffb" stroke-width="2" stroke-linecap="round" opacity=".62"/>
        </g>`;
      const shards = Array.from({ length: 4 }, (_, shardIndex) => {
        const sx = x + (-24 + shardIndex * 14);
        const sy = y + (orientation === 'horizontal' ? 32 + (shardIndex % 2) * 8 : 26 + (shardIndex % 2) * 12);
        const rotate = -18 + shardIndex * 13;
        const path = `<polygon points="-6,-3 4,-10 9,4 -2,11" fill="#2f3942" stroke="#c7dce8" stroke-width="1.4" opacity=".72"/>`;
        const animate = animated
          ? `<animateTransform attributeName="transform" type="translate" values="0 0;${(shardIndex % 2 ? 6 : -6)} ${10 + shardIndex * 3};0 0" dur="${3.6 + shardIndex * 0.4}s" begin="${shardIndex * 0.2}s" repeatCount="indefinite"/>`
          : '';
        return `<g transform="translate(${sx} ${sy}) rotate(${rotate})">${path}${animate}</g>`;
      }).join('');
      return burst + shards;
    }).join('');
  }

  function glyphGroup(baseId, slot, animated) {
    const glyphId = `${baseId}-g${slot.index}`;
    const clipId = `${baseId}-clip${slot.index}`;
    const bodyUse = `<use href="#${glyphId}"/>`;
    const highlight = `<use href="#${glyphId}" fill="none" stroke="rgba(236,243,248,.34)" stroke-width="2.8" stroke-linejoin="round" transform="translate(-3 -5)" opacity=".52"/>`;
    const edgeShadow = `<use href="#${glyphId}" fill="rgba(12,16,22,.16)" stroke="rgba(4,7,10,.34)" stroke-width="7" stroke-linejoin="round" transform="translate(9 10)" opacity=".54" filter="url(#shadowBlur)"/>`;
    const plate = `<use href="#${glyphId}" fill="url(#steelFace)" stroke="url(#steelEdge)" stroke-width="9.4" stroke-linejoin="round" paint-order="stroke fill"/>`;
    const coldStrip = `<use href="#${glyphId}" fill="none" stroke="url(#coldLight)" stroke-width="3.2" stroke-linejoin="round" opacity=".46" filter="url(#coldGlow)">
      ${animated ? '<animate attributeName="opacity" values=".35;.72;.35" dur="3.8s" begin="' + (slot.index * .25) + 's" repeatCount="indefinite"/>' : ''}
    </use>`;
    const texture = innerTexture(slot, clipId);
    return `${edgeShadow}<g class="unyielding-glyph">${plate}${texture}${highlight}${coldStrip}</g>`;
  }

  function renderSVG(text, helpers, options) {
    const orientation = options && options.orientation === 'horizontal' ? 'horizontal' : 'vertical';
    const animated = Boolean(options && options.animated);
    const chars = (helpers.splitCharacters ? helpers.splitCharacters(text) : String(text).split('')).slice(0, 4);
    const width = orientation === 'horizontal' ? 1200 : 840;
    const height = orientation === 'horizontal' ? 760 : 1200;
    const slots = buildSlots(chars.length, orientation).map(item => ({ ...item, orientation }));
    const baseId = `unyielding-${orientation}-${chars.length}`;
    const defsText = chars.map((char, index) => {
      const slot = slots[index];
      return `<text id="${baseId}-g${index}" x="${slot.x}" y="${slot.y}" text-anchor="middle" dominant-baseline="central" font-family='${escapeXML(FONT)}' font-size="${slot.size}" font-weight="900">${escapeXML(char)}</text>
      <clipPath id="${baseId}-clip${index}"><use href="#${baseId}-g${index}"/></clipPath>`;
    }).join('');

    const drawOrder = Array.from({ length: chars.length }, (_, index) => chars.length - 1 - index);
    const glyphs = drawOrder.map(index => glyphGroup(baseId, slots[index], animated)).join('');
    const overlapDecor = contactDecor(slots, orientation, animated);
    const subtleDust = Array.from({ length: clamp(chars.length * 3, 3, 12) }, (_, index) => {
      const x = orientation === 'horizontal' ? 220 + index * 84 : 210 + (index % 3) * 170;
      const y = orientation === 'horizontal' ? 145 + (index % 4) * 118 : 240 + index * 72;
      const r = 1.4 + (index % 3) * .8;
      const drift = animated ? `<animateTransform attributeName="transform" type="translate" values="0 0;${index % 2 ? 12 : -10} ${10 + index};0 0" dur="${5 + index * .35}s" repeatCount="indefinite"/>` : '';
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(208,224,239,.55)">${drift}</circle>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXML(text + ' 寧折不彎')}">
  <title>${escapeXML(text)}｜寧折不彎${orientation === 'horizontal' ? '橫式' : '直式'}藝術字</title>
  <desc>黑鐵冷光、應力裂縫與尾壓頭交疊。透明背景，所有紋理與特效沿著字體本身展開。</desc>
  <defs>
    <linearGradient id="steelFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8d98a3"/>
      <stop offset="18%" stop-color="#465058"/>
      <stop offset="42%" stop-color="#1c2227"/>
      <stop offset="66%" stop-color="#06090c"/>
      <stop offset="86%" stop-color="#2d353d"/>
      <stop offset="100%" stop-color="#aebbc5"/>
    </linearGradient>
    <linearGradient id="steelEdge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e3edf4"/>
      <stop offset="20%" stop-color="#78848d"/>
      <stop offset="68%" stop-color="#090d11"/>
      <stop offset="100%" stop-color="#d2dce3"/>
    </linearGradient>
    <linearGradient id="coldLight" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#d8edf8"/>
      <stop offset="100%" stop-color="#88c1eb"/>
    </linearGradient>
    <filter id="shadowBlur" x="-25%" y="-25%" width="160%" height="160%"><feGaussianBlur stdDeviation="5.8"/></filter>
    <filter id="coldGlow" x="-25%" y="-25%" width="160%" height="160%"><feGaussianBlur stdDeviation="4.2"/></filter>
    ${defsText}
  </defs>
  <g id="ambient-dust" opacity=".32">${subtleDust}</g>
  <g id="unyielding-letters">${glyphs}</g>
  <g id="unyielding-overlap">${overlapDecor}</g>
</svg>`;
  }

  global.SlowlyUnyieldingTemplate = Object.freeze({
    renderSVG,
    buildSlots,
    escapeXML
  });
})(window);
