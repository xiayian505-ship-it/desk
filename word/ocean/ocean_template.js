"use strict";
/*
 * 煙波浩渺｜共用 SVG 視覺模板（直式／橫式）。
 * 海面、水波、雲影、霧全都附著於文字輪廓；不渲染整張背景。
 * 軍火庫處理文字正規化、SVG/PNG 輸出；此檔只負責系列藝術風格。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const round = value => Math.round(value * 10) / 10;

  function oceanWaves(positions) {
    /* 造出「海平線一層層退至無窮遠」的字內波浪。所有波浪都 clip 進字形。 */
    return positions.map(({x, y, size}, index) => {
      const lines = [];
      const span = size * 0.86;
      const left = x - span;
      const right = x + span;
      const crestY = y - size * 0.53;
      for (let j = 0; j < 16; j += 1) {
        const yy = crestY + j * size * 0.074;
        const amplitude = 2.4 + j * 0.66;
        const step = span / 2;
        const curve = `M${round(left - 24)} ${round(yy)}
          C${round(left + step * .22)} ${round(yy - amplitude * 1.8)}
           ${round(left + step * .8)} ${round(yy + amplitude * 2.1)}
           ${round(x)} ${round(yy - amplitude * .1)}
          S${round(x + step * 1.4)} ${round(yy - amplitude * 1.7)}
           ${round(right + 24)} ${round(yy + amplitude * .4)}`;
        const pale = j % 5 === 0;
        const color = pale ? '#d6faff' : j % 3 === 0 ? '#9ddce9' : '#63afc8';
        lines.push(`<path d="${curve}" fill="none" stroke="${color}" stroke-width="${pale ? 3.4 : 1.4 + (j % 3) * .38}"
          opacity="${pale ? .68 : j < 6 ? .45 : .32}" stroke-linecap="round"/>`);
        if (j > 2 && j % 4 === 2) {
          lines.push(`<path d="M${round(x - span * .57)} ${round(yy + 6)} Q${round(x - span * .36)} ${round(yy + 2)} ${round(x - span * .12)} ${round(yy + 5)}"
            stroke="#d9faff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".62"/>`);
        }
      }
      return `<g id="ocean-waves-${index}">${lines.join('\n')}
        <animateTransform attributeName="transform" type="translate" values="0 0;${round(index % 2 === 0 ? 12 : -12)} 0;0 0"
          dur="${8.2 + index * 1.3}s" repeatCount="indefinite"/>
      </g>`;
    }).join('\n');
  }

  function oceanDepth(positions) {
    /* 每一個字都有冷暖深淺海面的水紋：精細線條要看見，而非畫背景圖。 */
    const lines = [];
    positions.forEach(({x,y,size}, i) => {
      for (let j = 0; j < 9; j += 1) {
        const cx = x + size * (((j * 23 + i * 17) % 67) / 67 - .5) * .75;
        const cy = y + size * (((j * 43 + i * 11) % 89) / 89 - .5) * 1.07;
        const len = size * (.09 + j % 4 * .04);
        lines.push(`<path d="M${round(cx - len)} ${round(cy)} Q${round(cx)} ${round(cy - 5)} ${round(cx + len)} ${round(cy)}"
          fill="none" stroke="${j % 2 ? '#b3edf8' : '#ecffff'}" stroke-width="${j % 3 === 0 ? 2.2 : 1.15}" opacity="${j % 3 === 0 ? .62 : .32}"/>`);
      }
    });
    return lines.join('\n');
  }

  function cloudsInLetters(positions) {
    /* 雲影與字融合，只停留在筆畫區域，不是天際背景。 */
    return positions.map(({x,y,size}, i) => {
      const yy = y - size * (i % 2 ? .24 : .31);
      const scale = size / 260;
      return `<g transform="translate(${round(x)} ${round(yy)}) scale(${round(scale)})" opacity=".7">
        <ellipse cx="-48" cy="10" rx="95" ry="32" fill="#e7fafb" opacity=".48"/>
        <ellipse cx="-12" cy="-14" rx="73" ry="29" fill="#f5ffff" opacity=".64"/>
        <ellipse cx="55" cy="4" rx="85" ry="27" fill="#bde5ec" opacity=".55"/>
        <ellipse cx="18" cy="-31" rx="40" ry="22" fill="#ffffff" opacity=".42"/>
      </g>`;
    }).join('\n');
  }

  function mistOnLetters(positions) {
    /* 柔和濃淡的霧，沿每個字的中心、字肩流動；靜態輸出仍有霧。 */
    return positions.map(({x,y,size},i) => {
      const off = i % 2 ? 1 : -1;
      return `<g opacity=".75">
        <ellipse cx="${round(x - size * .13 * off)}" cy="${round(y + size * .04)}" rx="${round(size * .48)}" ry="${round(size * .12)}"
          fill="#f7ffff" opacity=".37" filter="url(#oceanMistSoft)"/>
        <ellipse cx="${round(x + size * .14 * off)}" cy="${round(y - size * .31)}" rx="${round(size * .42)}" ry="${round(size * .13)}"
          fill="#d2f4f5" opacity=".28" filter="url(#oceanMistSoft)"/>
        <ellipse cx="${round(x - size * .11 * off)}" cy="${round(y + size * .27)}" rx="${round(size * .4)}" ry="${round(size * .09)}"
          fill="#d5ecf1" opacity=".22" filter="url(#oceanMistSoft)"/>
      </g>`;
    }).join('\n');
  }

  function foamEdges(positions) {
    /* 在字的周邊留下少量浪尖／潮線，離開輪廓不超過一個筆畫。 */
    const curves = [];
    positions.forEach(({x,y,size,index}) => {
      const sign = index % 2 === 0 ? 1 : -1;
      const at = (dx,dy) => [round(x + dx * size),round(y + dy * size)];
      const [ax,ay] = at(-.57,.27);
      const [bx,by] = at(.46,.29);
      const [cx,cy] = at(-.42,-.37);
      const [dx,dy] = at(.39,-.26);
      curves.push(`<path d="M${ax} ${ay} Q${round(x)} ${round(y + size * .08)} ${bx} ${by}"
        fill="none" stroke="#8fdee9" stroke-width="${round(size * .013)}" opacity=".48" stroke-linecap="round"/>`);
      curves.push(`<path d="M${cx} ${cy} Q${round(x + sign * size * .03)} ${round(y - size * .48)} ${dx} ${dy}"
        fill="none" stroke="#d0f4f3" stroke-width="${round(size * .009)}" opacity=".46" stroke-linecap="round"/>`);
      curves.push(`<path d="M${round(x - sign * size * .5)} ${round(y - size * .05)}
        C${round(x - sign * size * .63)} ${round(y + size * .12)}
         ${round(x - sign * size * .53)} ${round(y + size * .28)}
         ${round(x - sign * size * .42)} ${round(y + size * .33)}"
        fill="none" stroke="#b6edf1" stroke-width="${round(size * .008)}" opacity=".37" stroke-linecap="round"/>`);
    });
    return curves.join('\n');
  }

  function cloudEdges(positions) {
    /* 柔霧圍住字上緣、字角，絕不鋪滿整個畫面。 */
    return positions.map(({x,y,size,index}) => {
      const side = index % 2 ? -1 : 1;
      const cx = x + side * size * .29;
      const cy = y - size * .48;
      const x2 = x - side * size * .34;
      const y2 = y + size * .37;
      return `<g opacity=".68">
        <g filter="url(#oceanCloudSoft)">
          <ellipse cx="${round(cx)}" cy="${round(cy)}" rx="${round(size * .25)}" ry="${round(size * .083)}" fill="#f6ffff" opacity=".65"/>
          <ellipse cx="${round(cx - side * size * .12)}" cy="${round(cy - size * .04)}" rx="${round(size * .17)}" ry="${round(size * .068)}" fill="#c9e9ef" opacity=".58"/>
          <ellipse cx="${round(x2)}" cy="${round(y2)}" rx="${round(size * .22)}" ry="${round(size * .07)}" fill="#d0edef" opacity=".35"/>
        </g>
        <path d="M${round(cx - size * .19)} ${round(cy + size * .02)}
          Q${round(cx)} ${round(cy - size * .075)} ${round(cx + size * .17)} ${round(cy + size * .025)}"
          fill="none" stroke="#f6ffff" stroke-width="1.5" opacity=".45"/>
      </g>`;
    }).join('\n');
  }

  function waterGlints(positions) {
    const result = [];
    positions.forEach(({x,y,size,index}) => {
      for (let i = 0; i < 8; i++) {
        const dx = (((i * 41 + index * 11) % 71) / 71 - .5) * 1.0;
        const dy = (((i * 23 + index * 17) % 59) / 59 - .5) * 1.04;
        const px = round(x + dx * size),py = round(y + dy * size);
        const r = 1.3 + i % 3 * .9;
        result.push(`<ellipse cx="${px}" cy="${py}" rx="${round(r * 1.9)}" ry="${round(r * .46)}" fill="#e6ffff" opacity=".6"/>`);
      }
    });
    return result.join('\n');
  }

  function renderSVG(text, helpers, config) {
    const {width,height,positions} = config;
    const chars=helpers.splitCharacters(text);
    const points=positions.map((p,index)=>({...p,index}));
    const glyphs=points.map(({x,y,size,angle,index})=>
      `<text id="glyph${index}" x="${round(x)}" y="${round(y)}" text-anchor="middle" dominant-baseline="central"
        font-family='${helpers.escapeXML(FONT)}' font-size="${round(size)}" font-weight="800"
        transform="rotate(${angle} ${round(x)} ${round(y)})">${helpers.escapeXML(chars[index])}</text>`
    ).join('\n');
    const uses=points.map(({index})=>`<use href="#glyph${index}"/>`).join('\n');
    const label=helpers.escapeXML(text);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="oceanTitle oceanDesc">
  <title id="oceanTitle">${label}｜煙波浩渺藝術字</title>
  <desc id="oceanDesc">${label}，深遠的海洋、細密水波、雲影及層層薄霧繪製在文字筆畫內，霧沿文字邊緣浮起；透明背景。</desc>
  <defs>
    <linearGradient id="oceanFace" x1=".08" y1=".06" x2=".84" y2="1">
      <stop offset="0" stop-color="#f0ffff"/>
      <stop offset=".16" stop-color="#a9dce5"/>
      <stop offset=".34" stop-color="#529ab5"/>
      <stop offset=".5" stop-color="#1f6b90"/>
      <stop offset=".72" stop-color="#164d72"/>
      <stop offset="1" stop-color="#0a294f"/>
    </linearGradient>
    <linearGradient id="oceanOutline" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ebfcf8"/>
      <stop offset=".42" stop-color="#8dc6d1"/>
      <stop offset="1" stop-color="#275a83"/>
    </linearGradient>
    <linearGradient id="hazeWhite" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/>
      <stop offset=".58" stop-color="#ddf8fc" stop-opacity=".25"/>
      <stop offset="1" stop-color="#a4d8e7" stop-opacity="0"/>
    </linearGradient>
    <filter id="oceanShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="oceanCloudSoft" x="-45%" y="-65%" width="190%" height="230%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="oceanMistSoft" x="-45%" y="-80%" width="190%" height="260%"><feGaussianBlur stdDeviation="13"/></filter>
    <g id="glyphBank">${glyphs}</g>
    <clipPath id="letterMask">${uses}</clipPath>
  </defs>
  <!-- 預覽框透明：這些陰影與雲霧只緊貼各個字。 -->
  <g fill="#1e526d" opacity=".2" filter="url(#oceanShadow)" transform="translate(4 8)">${uses}</g>
  <g fill="none" stroke="#c8edf0" stroke-width="11" stroke-linejoin="round" opacity=".66">${uses}</g>
  <g fill="url(#oceanFace)" stroke="url(#oceanOutline)" stroke-width="4.2" stroke-linejoin="round" paint-order="stroke fill">${uses}</g>
  <g id="letter-ocean" clip-path="url(#letterMask)">
    ${oceanWaves(points)}
    ${oceanDepth(points)}
    ${waterGlints(points)}
    ${cloudsInLetters(points)}
    ${mistOnLetters(points)}
  </g>
  <g id="wet-rim" fill="none" stroke="#e1fcfa" stroke-width="1.5" stroke-linejoin="round" opacity=".38">${uses}</g>
  <g id="water-touching-edges">${foamEdges(points)}</g>
  <g id="clouds-touching-letters">${cloudEdges(points)}</g>
</svg>`;
  }
  global.SlowlyOceanTemplate=Object.freeze({renderSVG});
})(window);
