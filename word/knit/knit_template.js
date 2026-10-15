"use strict";
/*
 * 錦織流年｜獨立 SVG 模板 v2
 *
 * 編織布紋、暖色絲線、縫紉車線外框、針與線點綴全部寫在 SVG 本體內。
 * 不依賴 word_material_core.js；共用作品頁與下載控制器維持既有架構。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const n = value => (Math.round(value * 100) / 100).toString();
  const pt = (x, y) => `${n(x)} ${n(y)}`;

  function defs(characters, helpers) {
    const glyphs = characters.map((char, index) => `
      <text id="knitGlyph${index}" x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${helpers.escapeXML(FONT)}' font-size="100" font-weight="800">${helpers.escapeXML(char)}</text>
      <clipPath id="knitClip${index}"><use href="#knitGlyph${index}"/></clipPath>`).join('\n');
    return `<defs>
      ${glyphs}
      <linearGradient id="knitBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff0bf"/>
        <stop offset=".18" stop-color="#ffca79"/>
        <stop offset=".37" stop-color="#f78b43"/>
        <stop offset=".57" stop-color="#dc6246"/>
        <stop offset=".77" stop-color="#b04752"/>
        <stop offset="1" stop-color="#8f384f"/>
      </linearGradient>
      <linearGradient id="knitShade" x1="0" y1="0" x2="1" y2=".8">
        <stop offset="0" stop-color="#fff2ca" stop-opacity=".82"/>
        <stop offset=".5" stop-color="#ffbe87" stop-opacity=".18"/>
        <stop offset="1" stop-color="#9d4055" stop-opacity=".33"/>
      </linearGradient>
      <linearGradient id="knitThreadWarm" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff2c8"/>
        <stop offset=".26" stop-color="#ffd883"/>
        <stop offset=".53" stop-color="#ef8752"/>
        <stop offset=".79" stop-color="#cf5f4d"/>
        <stop offset="1" stop-color="#a84759"/>
      </linearGradient>
      <linearGradient id="knitStitch" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff5d1"/>
        <stop offset=".33" stop-color="#ffcf88"/>
        <stop offset=".66" stop-color="#ec7c50"/>
        <stop offset="1" stop-color="#b04757"/>
      </linearGradient>
      <linearGradient id="needleMetal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fbffff"/>
        <stop offset=".4" stop-color="#cfd4db"/>
        <stop offset=".72" stop-color="#8d949f"/>
        <stop offset="1" stop-color="#f3f7fb"/>
      </linearGradient>
      <radialGradient id="knitGlow" cx="28%" cy="24%" r="70%">
        <stop offset="0" stop-color="#fff8df" stop-opacity=".85"/>
        <stop offset=".34" stop-color="#ffd8a7" stop-opacity=".28"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <filter id="knitBlur" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="2.8"/>
      </filter>
    </defs>`;
  }

  function weaveTexture(index) {
    const shift = index % 2 ? 4 : -3;
    const warmOpacity = index % 2 ? '.30' : '.22';
    const crossOpacity = index % 2 ? '.18' : '.24';
    const verticals = [-58, -40, -22, -4, 14, 33, 52].map((x, i) => {
      const bias = (i % 2 ? 1 : -1) * (8 + shift);
      return `<path d="M${pt(x, -67)} C${pt(x + bias * .25, -39)} ${pt(x - bias * .22, -3)} ${pt(x + bias * .18, 33)} S${pt(x - bias * .15, 68)} ${pt(x + bias * .18, 72)}"
        fill="none" stroke="#fff3ce" stroke-opacity="${i % 3 === 0 ? '.40' : '.23'}" stroke-width="${i % 2 ? '4.6' : '3.2'}" stroke-linecap="round"/>`;
    }).join('');
    const horizontals = [-48, -28, -8, 12, 33, 53].map((y, i) => {
      const offset = (i % 2 ? -1 : 1) * (10 + shift);
      return `<path d="M${pt(-71, y)} C${pt(-32, y + offset * .2)} ${pt(4, y - offset * .18)} ${pt(71, y + offset * .1)}"
        fill="none" stroke="#bf5358" stroke-opacity="${i % 2 ? '.22' : '.15'}" stroke-width="${i % 2 ? '2.3' : '1.6'}" stroke-linecap="round"/>`;
    }).join('');
    const loops = [
      [-24, -24, 10, 5.8], [7, -7, 12, 6.8], [-10, 26, 13, 7.4], [24, 35, 8.8, 5.1]
    ].map(([x, y, rx, ry], i) => `<ellipse cx="${n(x + shift * .7)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}"
      fill="none" stroke="#fff7de" stroke-opacity="${i % 2 ? '.24' : '.34'}" stroke-width="1.12"/>`).join('');

    return `<g clip-path="url(#knitClip${index})">
      <rect x="-71" y="-71" width="142" height="142" fill="url(#knitBody)"/>
      <rect x="-71" y="-71" width="142" height="142" fill="url(#knitGlow)" opacity=".92"/>
      <rect x="-71" y="-71" width="142" height="142" fill="url(#knitShade)" opacity=".62"/>
      <g opacity="${warmOpacity}">${verticals}</g>
      <g opacity="${crossOpacity}">${horizontals}</g>
      <path d="M-75 -17 C-34 -41 7 -41 41 -17 S76 9 76 9" fill="none" stroke="#fff1d1" stroke-opacity=".19" stroke-width="10" stroke-linecap="round"/>
      <path d="M-72 30 C-38 6 -3 8 29 27 S68 54 76 57" fill="none" stroke="#902f4d" stroke-opacity=".13" stroke-width="9" stroke-linecap="round"/>
      ${loops}
    </g>`;
  }

  function stitchedGlyph(position, index) {
    return `<g transform="translate(${pt(position.x, position.y)}) rotate(${n(position.angle || 0)}) scale(${n(position.size / 100)})">
      <use href="#knitGlyph${index}" fill="#7d354a" opacity=".17" transform="translate(1.7 2.4)"/>
      ${weaveTexture(index)}
      <use href="#knitGlyph${index}" fill="none" stroke="#fff1d3" stroke-opacity=".54" stroke-width=".5" stroke-linejoin="round"/>
      <use href="#knitGlyph${index}" fill="none" stroke="#8e3a4d" stroke-opacity=".15" stroke-width="3.1" stroke-linejoin="round" transform="translate(1 1.2)"/>
      <!-- 縫紉車線的分節色塊縮小兩號：短一些、細一些，更貼著筆畫輪廓。 -->
      <use href="#knitGlyph${index}" fill="none" stroke="url(#knitStitch)"
        stroke-width="1.35" stroke-dasharray="3.8 10.8" stroke-linecap="round" stroke-linejoin="round"/>
      <use href="#knitGlyph${index}" fill="none" stroke="#fff3da" stroke-opacity=".30"
        stroke-width=".62" stroke-dasharray="1.15 13.45" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
  }

  function glyphs(positions) {
    return positions.map((position, index) => stitchedGlyph(position, index)).join('\n');
  }

  function threadCurve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, widthScale = 1) {
    const w = 4.1 * widthScale;
    return `<g>
      <path d="M${pt(x1, y1)} C${pt(cx1, cy1)} ${pt(cx2, cy2)} ${pt(x2, y2)}" fill="none" stroke="#8f364d" stroke-opacity=".16" stroke-width="${n(w + 2.1)}" stroke-linecap="round" filter="url(#knitBlur)"/>
      <path d="M${pt(x1, y1)} C${pt(cx1, cy1)} ${pt(cx2, cy2)} ${pt(x2, y2)}" fill="none" stroke="url(#knitThreadWarm)" stroke-width="${n(w)}" stroke-linecap="round"/>
      <path d="M${pt(x1, y1)} C${pt(cx1, cy1)} ${pt(cx2, cy2)} ${pt(x2, y2)}" fill="none" stroke="#fff6de" stroke-opacity=".52" stroke-width="${n(Math.max(1.1, w * .28))}" stroke-linecap="round"/>
    </g>`;
  }

  function needle(x, y, length, angle) {
    const eyeX = -length * .32;
    const eyeY = 0;
    return `<g transform="translate(${pt(x, y)}) rotate(${n(angle)})">
      <path d="M${pt(-length * .5, 0)} L${pt(length * .38, 0)}" stroke="#7b818c" stroke-opacity=".18" stroke-width="8" stroke-linecap="round" filter="url(#knitBlur)"/>
      <path d="M${pt(-length * .5, 0)} L${pt(length * .34, 0)}" stroke="url(#needleMetal)" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M${pt(length * .34, 0)} L${pt(length * .5, 0)}" stroke="url(#needleMetal)" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${pt(length * .34, 0)} L${pt(length * .49, -1.8)} L${pt(length * .49, 1.8)} Z" fill="#ecf0f4" stroke="#a1a8b3" stroke-width=".4"/>
      <ellipse cx="${n(eyeX)}" cy="${n(eyeY)}" rx="${n(length * .07)}" ry="${n(length * .14)}" fill="none" stroke="#f8fafc" stroke-width="1.1"/>
      <ellipse cx="${n(eyeX)}" cy="${n(eyeY)}" rx="${n(length * .045)}" ry="${n(length * .09)}" fill="none" stroke="#8c93a0" stroke-width=".6"/>
    </g>`;
  }

  function ornamentLayout(positions, orientation) {
    const count = positions.length;
    const first = positions[0];
    const last = positions[positions.length - 1];
    const items = [];
    if (orientation === 'horizontal') {
      const spanY = positions.map(p => p.y);
      const minY = Math.min(...spanY), maxY = Math.max(...spanY);
      const left = first.x - first.size * .42;
      const right = last.x + last.size * .42;
      const top = minY - first.size * .37;
      const bottom = maxY + last.size * .40;
      const centerX = (first.x + last.x) / 2;
      const lineSet = count === 1
        ? [
            threadCurve(left + 25, top + 46, left + 110, top - 10, centerX - 40, minY + 18, centerX + 20, minY + 8, .9),
            threadCurve(centerX - 12, maxY + 56, centerX + 80, bottom + 20, right - 12, maxY + 20, right - 40, maxY - 4, .82)
          ]
        : count === 2
          ? [
              threadCurve(left, top + 26, left + 110, top - 16, positions[1].x - 28, minY + 18, positions[1].x - 70, positions[1].y - 52, .95),
              threadCurve(first.x + 40, maxY + 58, centerX - 20, bottom + 30, right - 40, bottom - 10, right - 10, bottom - 44, .82),
              threadCurve(centerX - 30, top + 8, centerX + 55, top - 44, right - 30, minY + 8, right - 14, minY - 14, .72)
            ]
          : [
              threadCurve(left, top + 22, left + 120, top - 12, positions[1] ? positions[1].x - 20 : (left + 190), minY + 8, positions[1] ? positions[1].x - 60 : (left + 220), positions[1] ? positions[1].y - 48 : minY - 20, 1),
              threadCurve(positions[Math.max(0, positions.length - 2)].x - 20, maxY - 4, right - 120, bottom - 26, right - 40, bottom + 6, right, bottom - 40, .95),
              threadCurve(centerX - 140, bottom - 18, centerX - 40, bottom + 40, centerX + 40, bottom - 54, centerX + 145, bottom + 8, .82),
              threadCurve(centerX + 50, top + 10, centerX + 130, top - 60, right - 35, minY + 30, right - 12, minY - 10, .73)
            ];
      const needleSet = count === 1
        ? [
            needle(left + 58, top + 16, 46, -26),
            needle(right - 34, maxY + 4, 42, 12)
          ]
        : count === 2
          ? [
              needle(left + 52, top + 6, 47, -28),
              needle(positions[1].x - 72, positions[1].y - 60, 42, 22),
              needle(right - 18, bottom - 52, 42, 30)
            ]
          : [
              needle(left + 54, top + 2, 48, -28),
              needle(positions[1] ? positions[1].x - 75 : first.x + 120, positions[1] ? positions[1].y - 62 : first.y - 60, 44, 24),
              needle(centerX + 165, bottom - 22, 46, -16),
              needle(right - 15, bottom - 56, 42, 32)
            ];
      items.push(...lineSet, ...needleSet);
    } else {
      const spanX = positions.map(p => p.x);
      const minX = Math.min(...spanX), maxX = Math.max(...spanX);
      const top = first.y - first.size * .34;
      const bottom = last.y + last.size * .42;
      const left = minX - first.size * .42;
      const right = maxX + first.size * .42;
      const lineSet = count === 1
        ? [
            threadCurve(left + 20, top + 48, left - 26, top + 145, first.x - 88, first.y + 32, first.x - 34, first.y + 92, .9),
            threadCurve(right - 24, top + 90, right + 28, top + 172, first.x + 72, first.y + 114, first.x + 40, first.y + 180, .82)
          ]
        : count === 2
          ? [
              threadCurve(left + 14, top + 30, left - 42, top + 120, positions[1].x - 92, positions[1].y - 68, positions[1].x - 45, positions[1].y - 12, .96),
              threadCurve(right - 14, top + 68, right + 26, top + 142, positions[1].x + 64, positions[1].y + 16, positions[1].x + 18, positions[1].y + 80, .84),
              threadCurve(left + 30, bottom - 78, left - 28, bottom - 22, first.x - 60, bottom - 12, first.x + 2, bottom + 14, .72)
            ]
          : [
              threadCurve(left + 12, top + 30, left - 42, top + 120, positions[1] ? positions[1].x - 78 : left + 40, positions[1] ? positions[1].y - 25 : top + 180, positions[1] ? positions[1].x - 48 : left + 62, positions[1] ? positions[1].y + 26 : top + 230, 1),
              threadCurve(right - 15, top + 68, right + 42, top + 140, positions[2] ? positions[2].x + 74 : right - 30, positions[2] ? positions[2].y - 24 : top + 320, positions[2] ? positions[2].x + 36 : right - 20, positions[2] ? positions[2].y + 18 : top + 360, .92),
              threadCurve(left + 18, bottom - 180, left - 55, bottom - 82, positions[3] ? positions[3].x - 84 : left + 34, bottom - 50, positions[3] ? positions[3].x - 25 : left + 72, bottom - 8, .78),
              threadCurve(right - 42, bottom - 210, right + 30, bottom - 125, right + 4, bottom - 62, right - 18, bottom - 28, .74)
            ];
      const needleSet = count === 1
        ? [
            needle(left + 42, top + 26, 45, 56),
            needle(right - 20, first.y + 144, 42, -24)
          ]
        : count === 2
          ? [
              needle(left + 38, top + 12, 46, 60),
              needle(right - 3, top + 60, 42, -52),
              needle(left + 56, bottom - 48, 40, 20)
            ]
          : [
              needle(left + 42, top + 12, 46, 60),
              needle(right - 2, top + 62, 44, -54),
              needle(left + 30, bottom - 150, 42, 38),
              needle(right - 28, bottom - 46, 46, -28)
            ];
      items.push(...lineSet, ...needleSet);
    }
    return `<g aria-hidden="true">${items.join('\n')}</g>`;
  }

  function renderSVG(text, helpers, config) {
    const characters = helpers.splitCharacters(text);
    const positions = config.positions.slice(0, characters.length);
    const title = helpers.escapeXML(text);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}"
  viewBox="0 0 ${config.width} ${config.height}" role="img" aria-labelledby="knitTitle knitDescription">
  <title id="knitTitle">${title}｜錦織流年</title>
  <desc id="knitDescription">${title}，暖橘紅編織布紋文字，外框以縫紉車線虛線縫出；畫面疊有針與線點綴。透明背景。</desc>
  ${defs(characters, helpers)}
  ${glyphs(positions)}
  ${ornamentLayout(positions, config.orientation)}
</svg>`;
  }

  global.SlowlyKnitTemplate = Object.freeze({ renderSVG });
})(window);
