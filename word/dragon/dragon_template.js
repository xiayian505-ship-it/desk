"use strict";
/*
 * 龍騰九霄｜獨立 SVG 繪圖模板 v2
 *
 * 古銅金 × 石灰銅像浮雕 × 墨綠陰影，主字內有細緻龍鱗與偏光。
 * 文字以外的雙連結線、飛躍筆勢、九條龍鬚均繪入可下載的 SVG。
 * 僅依賴文字產生器傳入的 helpers，不引用舊 word_material_core.js。
 * 直式與橫式分別取得各自的位置，沒有將畫面整張旋轉。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const number = value => (Math.round(value * 100) / 100).toString();
  const pair = (x, y) => `${number(x)} ${number(y)}`;
  const escape = value => String(value).replace(/[&<>"']/g, sign => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
  })[sign]);

  function defs(characters, helpers) {
    const glyphDefs = characters.map((character, index) => `
      <text id="dragonGlyph${index}" x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${escape(FONT)}' font-weight="900" font-size="100">${helpers.escapeXML(character)}</text>
      <clipPath id="dragonGlyphClip${index}"><use href="#dragonGlyph${index}"/></clipPath>`).join('\n');
    return `<defs>
      ${glyphDefs}
      <linearGradient id="dragonStone" x1=".03" y1=".06" x2=".95" y2="1">
        <stop offset="0" stop-color="#e8e5da"/>
        <stop offset=".11" stop-color="#a6a49c"/>
        <stop offset=".25" stop-color="#6b736f"/>
        <stop offset=".38" stop-color="#c2bfb5"/>
        <stop offset=".51" stop-color="#7b807a"/>
        <stop offset=".65" stop-color="#a4a69e"/>
        <stop offset=".78" stop-color="#6b796e"/>
        <stop offset=".91" stop-color="#4b685e"/>
        <stop offset="1" stop-color="#b49b70"/>
      </linearGradient>
      <linearGradient id="dragonBronzeEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f7e4ab"/>
        <stop offset=".19" stop-color="#8a6234"/>
        <stop offset=".39" stop-color="#e6c279"/>
        <stop offset=".56" stop-color="#62523f"/>
        <stop offset=".78" stop-color="#b9965b"/>
        <stop offset="1" stop-color="#e1cc95"/>
      </linearGradient>
      <linearGradient id="dragonShadow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#866944"/>
        <stop offset=".53" stop-color="#39534c"/>
        <stop offset="1" stop-color="#142c29"/>
      </linearGradient>
      <linearGradient id="dragonIridescent" x1="0" y1="0" x2="1" y2=".64">
        <stop offset="0" stop-color="#fff3cb" stop-opacity=".48"/>
        <stop offset=".25" stop-color="#e9c987" stop-opacity=".13"/>
        <stop offset=".42" stop-color="#8ad4bc" stop-opacity=".37"/>
        <stop offset=".54" stop-color="#99b8bc" stop-opacity=".10"/>
        <stop offset=".71" stop-color="#efc68a" stop-opacity=".29"/>
        <stop offset=".85" stop-color="#b7dbb8" stop-opacity=".20"/>
        <stop offset="1" stop-color="#fff3c4" stop-opacity=".32"/>
      </linearGradient>
      <linearGradient id="dragonWing" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f4dba4"/>
        <stop offset=".32" stop-color="#8a6c42"/>
        <stop offset=".66" stop-color="#3b6860"/>
        <stop offset="1" stop-color="#d8b675"/>
      </linearGradient>
      <linearGradient id="dragonWhisker" x1="0" y1="0" x2=".95" y2="1">
        <stop offset="0" stop-color="#ecd19c"/>
        <stop offset=".36" stop-color="#b9915e"/>
        <stop offset=".69" stop-color="#56877b"/>
        <stop offset="1" stop-color="#c1aa72"/>
      </linearGradient>
      <radialGradient id="dragonGlint" cx=".38" cy=".30" r=".69">
        <stop offset="0" stop-color="#fff9e1" stop-opacity=".89"/>
        <stop offset=".25" stop-color="#f7e5be" stop-opacity=".30"/>
        <stop offset=".7" stop-color="#9ccdc2" stop-opacity=".06"/>
        <stop offset="1" stop-color="#9ccdc2" stop-opacity="0"/>
      </radialGradient>
      <!-- 半月鱗片，僅在字形遮罩內可見。圖案和筆畫內偏光一起匯出。 -->
      <pattern id="dragonScalePattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M-6 1 Q0 10 6 1 M6 1 Q12 10 18 1 M0 7 Q6 16 12 7"
          fill="none" stroke="#243f3b" stroke-opacity=".40" stroke-width=".67"/>
        <path d="M-6 0 Q0 8 6 0 M6 0 Q12 8 18 0 M0 6 Q6 14 12 6"
          fill="none" stroke="#f5d9a0" stroke-opacity=".68" stroke-width=".56"/>
        <path d="M1 2 L3 3.1 M7 8 L9 9.1" stroke="#fff1c9" stroke-opacity=".49" stroke-width=".67"/>
      </pattern>
    </defs>`;
  }

  function inscribedScales(index) {
    const delta = (index % 2 === 0 ? -1 : 1);
    return `<g clip-path="url(#dragonGlyphClip${index})">
      <rect x="-66" y="-66" width="132" height="132" fill="url(#dragonScalePattern)" opacity=".74"/>
      <path d="M-48 -49 Q-3 -37 47 -59 L55 -29 Q0 -8 -54 -19 Z" fill="url(#dragonIridescent)" opacity=".67"/>
      <path d="M-53 -1 Q-8 -19 54 -3 L62 19 Q5 4 -57 24 Z" fill="url(#dragonIridescent)" opacity=".48"/>
      <path d="M-53 29 Q-${7 + delta * 2} 14 52 36 L55 56 Q-1 38 -52 56 Z" fill="url(#dragonIridescent)" opacity=".40"/>
      <ellipse cx="-31" cy="-34" rx="44" ry="26" fill="url(#dragonGlint)" opacity=".67"/>
      <path d="M-55 -36 Q-5 -56 46 -43 M-42 -5 Q9 -21 50 -6"
        fill="none" stroke="#fff8e2" stroke-opacity=".25" stroke-width="1.1"/>
      <path d="M-35 -59 L-17 -60 L16 59 L3 59 Z" fill="#f4ecd0" opacity=".055"/>
    </g>`;
  }

  function glyphArt(positions) {
    return positions.map((pos, index) => {
      const scale = number(pos.size / 100);
      const rotate = number(pos.angle || 0);
      return `<g transform="translate(${pair(pos.x, pos.y)}) rotate(${rotate}) scale(${scale})">
        <!-- 雙層雕塑厚度，向右下方略微位移：銅像般的浮凸。 -->
        <use href="#dragonGlyph${index}" fill="#1b3431" stroke="#1d3934" stroke-width="4.8"
          stroke-linejoin="round" paint-order="stroke fill" transform="translate(2.4 3.4)" opacity=".53"/>
        <use href="#dragonGlyph${index}" fill="url(#dragonShadow)" stroke="#4e5547" stroke-width="3.5"
          stroke-linejoin="round" paint-order="stroke fill" transform="translate(1.25 1.6)"/>
        <use href="#dragonGlyph${index}" fill="url(#dragonStone)" stroke="url(#dragonBronzeEdge)" stroke-width="2.2"
          stroke-linejoin="round" paint-order="stroke fill"/>
        ${inscribedScales(index)}
        <!-- 邊緣內側精細銅光，確保縮成封面時依然有立體讀字性。 -->
        <use href="#dragonGlyph${index}" fill="none" stroke="#fff1c4" stroke-opacity=".59" stroke-width=".53" stroke-linejoin="round"
          transform="translate(-.36 -.5)"/>
        <use href="#dragonGlyph${index}" fill="none" stroke="#27483f" stroke-opacity=".60" stroke-width=".40" stroke-linejoin="round"
          transform="translate(.58 .56)"/>
      </g>`;
    }).join('\n');
  }

  function connectors(positions, orientation) {
    const start = positions[0];
    const target = positions[positions.length >= 3 ? 2 : Math.min(1, positions.length - 1)];
    const single = positions.length === 1;
    let lines;

    if (orientation === 'vertical') {
      const pad = Math.max(start.size, target.size) * .66;
      const middleX = (start.x + target.x) / 2;
      const gap = target.y - start.y;
      const topY = single ? start.y - start.size * .42 : start.y - start.size * .17;
      const bottomY = single ? start.y + start.size * .42 : target.y + target.size * .17;
      lines = [-1, 1].map((side, index) => {
        const beginningX = start.x + side * start.size * .41;
        const endingX = target.x + side * target.size * .41;
        const outside = middleX + side * pad;
        const startY = single ? topY : start.y - start.size * .14;
        const endY = single ? bottomY : target.y + target.size * .15;
        const height = single ? bottomY - topY : Math.max(160, gap);
        const path = `M ${pair(beginningX, startY)} C ${pair(outside + side * 14, startY + height * .08)} ${pair(outside - side * 23, startY + height * .33)} ${pair(outside, startY + height * .49)} S ${pair(outside + side * 15, endY - height * .15)} ${pair(endingX, endY)}`;
        return drawingCord(path, beginningX, startY, endingX, endY, index);
      });
    } else {
      const pad = Math.max(start.size, target.size) * .70;
      const middleY = (start.y + target.y) / 2;
      const leftX = single ? start.x - start.size * .44 : start.x - start.size * .24;
      const rightX = single ? start.x + start.size * .44 : target.x + target.size * .24;
      lines = [-1, 1].map((side, index) => {
        const startX = leftX;
        const endX = rightX;
        const startY = start.y + side * start.size * (single ? .38 : .20);
        const endY = target.y + side * target.size * (single ? .38 : .20);
        const outside = middleY + side * pad;
        const width = rightX - leftX;
        const path = `M ${pair(startX, startY)} C ${pair(startX + width * .19, outside + side * 21)} ${pair(startX + width * .38, outside - side * 11)} ${pair(startX + width * .53, outside)} S ${pair(endX - width * .14, outside + side * 13)} ${pair(endX, endY)}`;
        return drawingCord(path, startX, startY, endX, endY, index);
      });
    }
    return `<g aria-hidden="true">${lines.join('\n')}</g>`;
  }

  function drawingCord(path, x0, y0, x1, y1, index) {
    return `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="${path}" stroke="#1a4139" stroke-width="9" opacity=".49" transform="translate(1.5 2.2)"/>
      <path d="${path}" stroke="url(#dragonWing)" stroke-width="5.8" opacity=".97"/>
      <path d="${path}" stroke="#f3d79e" stroke-width="1.3" opacity=".66" transform="translate(-1.1 -1)"/>
      <circle cx="${number(x0)}" cy="${number(y0)}" r="5.3" fill="#6d755e" stroke="#dec28b" stroke-width="2"/>
      <circle cx="${number(x1)}" cy="${number(y1)}" r="${index ? 4.3 : 5.3}" fill="#6d755e" stroke="#dec28b" stroke-width="1.6"/>
    </g>`;
  }

  // 第一字末端延伸：不是判斷輸入是否為「龍」，任何文字均有飛躍筆勢。
  function risingStroke(positions, orientation) {
    const first = positions[0];
    const second = positions[1];
    let path;
    if (orientation === 'vertical') {
      const x0 = first.x + first.size * .24;
      const y0 = first.y + first.size * .31;
      const x1 = second ? second.x - second.size * .10 : first.x + first.size * .20;
      const y1 = second ? second.y - second.size * .43 : first.y - first.size * .38;
      const bulge = first.size * (second ? 1.02 : .72);
      path = `M ${pair(x0,y0)} C ${pair(x0+bulge*.59,y0-first.size*.40)} ${pair(x0+bulge,y0-first.size*1.03)} ${pair(x1+first.size*.14,y1-first.size*.22)} Q ${pair(x1+first.size*.23,y1-first.size*.06)} ${pair(x1,y1)}`;
    } else {
      const x0 = first.x + first.size * .30;
      const y0 = first.y + first.size * .26;
      const x1 = second ? second.x - second.size * .35 : first.x + first.size * .40;
      const y1 = second ? second.y - second.size * .29 : first.y - first.size * .39;
      path = `M ${pair(x0,y0)} C ${pair(x0+first.size*.26,y0-first.size*.76)} ${pair(x1-first.size*.15,y1-first.size*.50)} ${pair(x1,y1)}`;
    }
    return `<g fill="none" stroke-linecap="round" aria-hidden="true">
      <path d="${path}" stroke="#24483c" stroke-width="18" opacity=".31" transform="translate(2 3)"/>
      <path d="${path}" stroke="url(#dragonWing)" stroke-width="11" opacity=".93"/>
      <path d="${path}" stroke="#fbe6af" stroke-width="2.5" opacity=".79" transform="translate(-2 -2)"/>
    </g>`;
  }

  // 固定九條龍鬚。以字位比例分配，隨輸入字數及直、橫排重新定位。
  // 三條較亮的鬚位於文字前緣；六條柔和線條位於文字背後。
  function whiskers(positions, orientation) {
    const paths = [];
    for (let index = 0; index < 9; index += 1) {
      const anchor = positions[index % positions.length];
      const size = anchor.size;
      const side = (index % 2 === 0 ? -1 : 1);
      const level = Math.floor(index / 2);
      const offset = (level - 2) * .075;
      const x0 = anchor.x + side * size * (.38 + .028 * (index % 3));
      const y0 = anchor.y + size * (offset + (index % 2 ? .12 : -.08));
      let endX, endY, ctrl1x, ctrl1y, ctrl2x, ctrl2y;
      if (orientation === 'vertical') {
        endX = x0 + side * size * (.34 + (index % 3) * .07);
        endY = y0 + size * ((index % 3) - 1) * .28;
        ctrl1x = x0 + side * size * .31;
        ctrl1y = y0 - size * (.23 + (index % 2) * .06);
        ctrl2x = endX - side * size * .11;
        ctrl2y = endY + size * (.18 + (index % 3) * .03);
      } else {
        // 四字橫排也不讓龍鬚越過透明畫布邊緣。
        endX = Math.max(35, Math.min(1165, x0 + side * size * (.28 + (index % 3) * .05)));
        endY = y0 + (index % 2 ? 1 : -1) * size * (.32 + (index % 3) * .06);
        ctrl1x = x0 + side * size * .21;
        ctrl1y = y0 - size * .20;
        ctrl2x = endX + side * size * .04;
        ctrl2y = endY - (index % 2 ? 1 : -1) * size * .17;
      }
      const curve = `M ${pair(x0,y0)} C ${pair(ctrl1x,ctrl1y)} ${pair(ctrl2x,ctrl2y)} ${pair(endX,endY)}`;
      const opacity = number(.49 + (index % 4) * .115);
      const mark = `<g aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
        <path d="${curve}" stroke="#1f423a" stroke-width="6.5" opacity=".27" transform="translate(1.8 2)"/>
        <path d="${curve}" stroke="url(#dragonWhisker)" stroke-width="${number(3 + (index % 3) * .5)}"/>
        <path d="${curve}" stroke="#ffebbb" stroke-width=".87" opacity=".61" transform="translate(-.9 -.7)"/>
        <path d="M ${pair(endX - side*size*.031,endY + size*.015)} Q ${pair(endX + side*size*.025,endY + size*.032)} ${pair(endX,endY)}"
          stroke="#dfc591" stroke-width="1.4"/>
      </g>`;
      paths.push(mark);
    }
    const rear = paths.slice(0, 6).join('\n');
    const front = paths.slice(6).join('\n');
    return {rear, front};
  }

  function renderSVG(text, helpers, config) {
    const characters = helpers.splitCharacters(text);
    const positions = config.positions.slice(0, characters.length);
    const safeTitle = helpers.escapeXML(text);
    const whiskerArt = whiskers(positions, config.orientation);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}"
  viewBox="0 0 ${config.width} ${config.height}" role="img" aria-labelledby="dragonTitle dragonDescription">
  <title id="dragonTitle">${safeTitle}｜龍騰九霄</title>
  <desc id="dragonDescription">${safeTitle}：石灰色古銅金浮凸藝術字、字內龍鱗及偏光；雙曲線連結字位、首字筆勢飛躍，九條龍鬚繞字。透明背景。</desc>
  ${defs(characters, helpers)}
  ${connectors(positions, config.orientation)}
  ${risingStroke(positions, config.orientation)}
  ${whiskerArt.rear}
  ${glyphArt(positions)}
  ${whiskerArt.front}
</svg>`;
  }

  global.SlowlyDragonTemplate = Object.freeze({renderSVG});
})(window);
