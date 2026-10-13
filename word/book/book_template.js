"use strict";
/*
 * 開卷有益｜可重用於直式、橫式的 SVG 作品模板。
 * 所有做舊、頁緣、翻頁與紙屑皆繪製在 SVG 中，並且貼近各個字。
 * 字體、材料、裝飾皆由宿主控制；軍火庫僅提供字元、排位與匯出。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const rnd = (n) => Math.round(n * 10) / 10;

  function pageCurl(x, y, size, direction, angle, tone) {
    /* 切紙的前後兩面：有折痕與陰影，但完全沒有紙張矩形底板。 */
    const shadow = direction > 0 ? 1 : -1;
    return `
      <g transform="translate(${rnd(x)} ${rnd(y)}) rotate(${angle}) scale(${direction} 1)">
        <path d="M-3 7 Q-9 -23 16 -55 Q27 -19 51 -12 Q24 -5 10 31 Z"
          fill="#77523a" opacity=".24" transform="translate(4 5)"/>
        <path d="M-3 7 Q-9 -23 16 -55 Q27 -19 51 -12 Q24 -5 10 31 Z"
          fill="url(#foldFace)" stroke="#a0764a" stroke-width="1.6"/>
        <path d="M16 -55 Q9 -21 21 0 Q31 15 10 31"
          fill="none" stroke="#fff1c5" stroke-width="2.4" opacity=".88"/>
        <path d="M16 -55 Q26 -26 51 -12 Q29 -17 21 0 Q15 -30 16 -55 Z"
          fill="url(#foldBack)" stroke="#8f6748" stroke-width="1.2"/>
        <path d="M12 -16 Q18 -8 24 -2 M6 2 Q13 9 18 14"
          fill="none" stroke="#866241" stroke-width=".9" opacity=".5"/>
      </g>`;
  }

  function folioEdge(x, y, size, tilt, direction) {
    const w = rnd(size * .7);
    const h = rnd(size * .22);
    const x1 = rnd(x - direction * w * .45);
    const x2 = rnd(x + direction * w * .5);
    return `<g opacity=".83">
      <path d="M${x1} ${rnd(y + 6)} Q${rnd(x + tilt)} ${rnd(y - h - 2)} ${x2} ${rnd(y - 6)}"
        stroke="#6e4d39" stroke-width="3.7" fill="none" opacity=".45"/>
      <path d="M${x1} ${rnd(y + 1)} Q${rnd(x + tilt)} ${rnd(y - h - 9)} ${x2} ${rnd(y - 11)}"
        stroke="#d1a46a" stroke-width="2.1" fill="none"/>
      <path d="M${x1} ${rnd(y - 4)} Q${rnd(x + tilt)} ${rnd(y - h - 15)} ${x2} ${rnd(y - 17)}"
        stroke="#f0dbad" stroke-width="1.1" fill="none" opacity=".74"/>
    </g>`;
  }

  function fibers(points) {
    /* 紙纖維沿著每個字生成，再 clip 到字裡。 */
    const bits = [];
    points.forEach(({x,y,size},i)=>{
      for(let j=0;j<27;j++) {
        const fx = rnd(x + size * (((j * 47 + i * 23) % 113) / 113 - .5) * .9);
        const fy = rnd(y + size * (((j * 71 + i * 13) % 137) / 137 - .5) * .94);
        const len = 5 + (j % 4) * 4;
        bits.push(`<path d="M${fx} ${fy} q${rnd(len*.35)} ${rnd(-len*.85)} ${rnd(len*.7)} ${rnd(-len)}" stroke="${j%5===0?'#f9edcb':'#6d4835'}" stroke-width="${j%4===0?1.5:.8}" opacity="${j%5===0?.48:.18}" fill="none"/>`);
      }
      for(let j=0;j<13;j++) {
        const cx = rnd(x + size * (((j * 31 + i * 17) % 83) / 83 - .5) * .85);
        const cy = rnd(y + size * (((j * 41 + i * 11) % 97) / 97 - .5) * .92);
        bits.push(`<ellipse cx="${cx}" cy="${cy}" rx="${1.8 + j%4}" ry="${1 + j%3}" fill="${j%3===0?'#6c4d3c':'#b18a58'}" opacity=".22"/>`);
      }
    });
    return bits.join('\n');
  }

  function inkHatching(points) {
    return points.map(({x,y,size},i)=>{
      const inner = [];
      for(let j=-2;j<=2;j++) {
        const left = rnd(x-size*.35);
        const right = rnd(x+size*.34);
        const yy = rnd(y+j*size*.155);
        inner.push(`<path d="M${left} ${yy} Q${rnd(x-size*.04)} ${rnd(yy-13+(j%2)*7)} ${right} ${rnd(yy+7)}"
          stroke="${i%2===0?'#67432f':'#764d37'}" stroke-width="${j===0?2.3:1.5}" opacity="${j===0?.33:.19}" fill="none"/>`);
      }
      inner.push(`<path d="M${rnd(x-size*.3)} ${rnd(y-size*.28)} L${rnd(x-size*.1)} ${rnd(y-size*.14)} L${rnd(x+size*.04)} ${rnd(y-size*.25)}"
        stroke="#fff0c6" stroke-width="2.2" opacity=".32" fill="none"/>`);
      return inner.join('\n');
    }).join('\n');
  }

  function nearPageDetails(points, horizontal) {
    const rear = [], front = [], marginInk = [], dust = [];
    points.forEach(({x,y,size,index},i)=>{
      const side = index % 2 === 0 ? 1 : -1;
      const s = size/250;
      const edgeX = x + side*size*.38;
      const edgeY = y - size*.38;
      const lowerX = x - side*size*.42;
      const lowerY = y + size*.42;
      rear.push(folioEdge(x, y-size*.28, size*.86, -13*side, side));
      rear.push(folioEdge(x+side*size*.08, y+size*.32, size*.76, 12*side, -side));
      // Two closely attached folded page corners, not a separate ancient book backdrop.
      front.push(pageCurl(edgeX, edgeY, size, side, -14+index*9));
      front.push(`<g transform="translate(${rnd(lowerX)} ${rnd(lowerY)}) rotate(${side*16}) scale(${rnd(s*.56)})">
        <path d="M-11 -20 Q7 -29 34 -4 Q8 4 -7 32 Q1 4 -11 -20Z" fill="url(#foldFace)" stroke="#987047" stroke-width="1.9"/>
        <path d="M-11 -20 Q4 -10 8 8 Q20 -3 34 -4" fill="none" stroke="#fff0c6" stroke-width="2"/>
      </g>`);
      // Reading direction implied by page-turn arcs that wrap around each character.
      marginInk.push(`<path d="M${rnd(x+side*size*.5)} ${rnd(y-size*.52)} Q${rnd(x+side*size*.76)} ${rnd(y-size*.1)} ${rnd(x+side*size*.48)} ${rnd(y+size*.38)}"
        stroke="#b3844c" stroke-width="2" stroke-linecap="round" opacity=".47" fill="none"/>`);
      marginInk.push(`<path d="M${rnd(x+side*size*.58)} ${rnd(y-size*.4)} Q${rnd(x+side*size*.69)} ${rnd(y+size*.01)} ${rnd(x+side*size*.46)} ${rnd(y+size*.3)}"
        stroke="#f1dab0" stroke-width="1.15" opacity=".5" fill="none"/>`);
      // Page corners and small torn fibers are adjacent to character strokes.
      for(let j=0;j<8;j++) {
        const t=j/8;
        const px=rnd(x+(j%2?1:-1)*size*(.52+((j*13+index*7)%9)/72));
        const py=rnd(y+size*(t-.5)*.96);
        const rotate=(j*31+index*19)%100;
        const sx=2.5+j%3*1.6;
        dust.push(`<path d="M${px} ${py} l${rnd(sx*.8)} ${rnd(-sx*.34)} l${rnd(sx*.55)} ${rnd(sx)} z" fill="${j%3===0?'#bd9565':'#e1c594'}" opacity="${j%3===0?.6:.42}" transform="rotate(${rotate} ${px} ${py})"/>`);
      }
    });
    return {rear:rear.join('\n'),front:front.join('\n'),marginInk:marginInk.join('\n'),dust:dust.join('\n')};
  }

  function renderSVG(text, helpers, config) {
    const {width,height,orientation,positions} = config;
    const horizontal = orientation === 'horizontal';
    const positionsWithIndex=positions.map((pos,index)=>({...pos,index}));
    const glyphBank=positionsWithIndex.map(({x,y,size,angle,index})=>
      `<text id="glyph${index}" x="${rnd(x)}" y="${rnd(y)}" text-anchor="middle" dominant-baseline="central"
        font-family='${helpers.escapeXML(FONT)}' font-size="${rnd(size)}" font-weight="800"
        transform="rotate(${angle} ${rnd(x)} ${rnd(y)})">${helpers.escapeXML(helpers.splitCharacters(text)[index])}</text>`
    ).join('\n');
    const uses=positionsWithIndex.map(({index})=>`<use href="#glyph${index}"/>`).join('\n');
    const detail=nearPageDetails(positionsWithIndex,horizontal);
    const escapedText=helpers.escapeXML(text);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="bookTitle bookDesc">
  <title id="bookTitle">${escapedText}｜開卷有益藝術字</title>
  <desc id="bookDesc">${escapedText}，泛黃舊書紙張製成的字，紙纖維、頁緣、卷頁與斑駁墨痕都沿著文字；背景透明。</desc>
  <defs>
    <linearGradient id="parchmentFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbf2d7"/>
      <stop offset=".16" stop-color="#e9dab7"/>
      <stop offset=".46" stop-color="#d2bb93"/>
      <stop offset=".72" stop-color="#b49b79"/>
      <stop offset="1" stop-color="#8e7358"/>
    </linearGradient>
    <linearGradient id="oldInk" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8b7358"/>
      <stop offset=".4" stop-color="#604a3a"/>
      <stop offset="1" stop-color="#30251f"/>
    </linearGradient>
    <linearGradient id="foldFace" x1="0" y1="0" x2=".85" y2="1">
      <stop offset="0" stop-color="#fff4d2"/>
      <stop offset=".5" stop-color="#ebcb90"/>
      <stop offset="1" stop-color="#a47a4f"/>
    </linearGradient>
    <linearGradient id="foldBack" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7b563d"/>
      <stop offset=".62" stop-color="#c39b63"/>
      <stop offset="1" stop-color="#efd9ac"/>
    </linearGradient>
    <filter id="paperGrain" x="-12%" y="-12%" width="124%" height="124%">
      <feTurbulence type="fractalNoise" baseFrequency=".06 .045" numOctaves="2" seed="9" result="paperNoise"/>
      <feDisplacementMap in="SourceGraphic" in2="paperNoise" scale="1.6" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="pageShadow" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="3.7"/></filter>
    <g id="glyphBank">${glyphBank}</g>
    <clipPath id="letterMask">${uses}</clipPath>
  </defs>
  <!-- 頁緣直接靠近各個字，不繪製背景書頁。 -->
  <g id="behind-glyph-edges">${detail.rear}</g>
  <!-- 墨影與厚紙邊層疊成字，沒有全幅矩形紙張。 -->
  <g fill="#3f2b22" opacity=".23" filter="url(#pageShadow)" transform="translate(4.5 7)">${uses}</g>
  <g fill="none" stroke="#8e643d" stroke-width="11" stroke-linejoin="round" opacity=".72">${uses}</g>
  <g fill="none" stroke="#f7e6be" stroke-width="7.8" stroke-linejoin="round" opacity=".88" transform="translate(-2 -3)">${uses}</g>
  <g fill="url(#parchmentFace)" stroke="url(#oldInk)" stroke-width="4.5" paint-order="stroke fill" stroke-linejoin="round" filter="url(#paperGrain)">${uses}</g>
  <g fill="none" stroke="#fff4cd" stroke-width="1.2" stroke-linejoin="round" opacity=".4" transform="translate(-1.2 -2)">${uses}</g>
  <g clip-path="url(#letterMask)" fill="none">${inkHatching(positionsWithIndex)}</g>
  <g clip-path="url(#letterMask)">${fibers(positionsWithIndex)}</g>
  <g id="curled-page-corners">${detail.front}</g>
  <g id="reading-wind">${detail.marginInk}</g>
  <g id="torn-page-flecks">${detail.dust}</g>
</svg>`;
  }
  global.SlowlyBookTemplate = Object.freeze({renderSVG});
})(window);
