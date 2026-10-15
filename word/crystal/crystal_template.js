"use strict";
/*
 * 琉璃幻彩｜獨立 SVG 模板 v2
 *
 * 所有字體琉璃切面、鏡面反光、折射打光及半透明三角形均在 SVG 內。
 * 不使用 word_material_core.js；不影響共用作品頁、下載控制器。
 * 直式與橫式各有獨立弧形座標，不直接旋轉整張畫面。
 */
(function (global) {
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const n = value => (Math.round(value * 100) / 100).toString();
  const pt = (x, y) => `${n(x)} ${n(y)}`;
  const colors = ['#a9effa', '#adc3fa', '#c8abf9', '#84dce7', '#97b5fc', '#cbb4f4'];

  function definitions(characters, helpers) {
    const glyphs = characters.map((char, index) => `
      <text id="crystalGlyph${index}" x="0" y="0" text-anchor="middle" dominant-baseline="central"
        font-family='${helpers.escapeXML(FONT)}' font-size="100" font-weight="800">${helpers.escapeXML(char)}</text>
      <clipPath id="crystalClip${index}"><use href="#crystalGlyph${index}"/></clipPath>`).join('\n');
    return `<defs>
      ${glyphs}
      <linearGradient id="crystalBody" x1="0.08" y1="0.05" x2="0.95" y2="1">
        <stop offset="0" stop-color="#f4ffff"/>
        <stop offset=".13" stop-color="#b4eeff"/>
        <stop offset=".27" stop-color="#86b5ec"/>
        <stop offset=".40" stop-color="#dbb7f7"/>
        <stop offset=".51" stop-color="#f7ffff"/>
        <stop offset=".62" stop-color="#70cbdf"/>
        <stop offset=".75" stop-color="#a4a4e7"/>
        <stop offset=".88" stop-color="#d9c4f9"/>
        <stop offset="1" stop-color="#5a81b8"/>
      </linearGradient>
      <linearGradient id="crystalEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f8ffff" stop-opacity=".92"/>
        <stop offset=".26" stop-color="#76bfe1" stop-opacity=".65"/>
        <stop offset=".52" stop-color="#e9e5ff" stop-opacity=".88"/>
        <stop offset=".75" stop-color="#818ac9" stop-opacity=".73"/>
        <stop offset="1" stop-color="#f6ffff" stop-opacity=".92"/>
      </linearGradient>
      <linearGradient id="crystalFaceCool" x1="0" y1="0" x2=".9" y2="1">
        <stop offset="0" stop-color="#faffff" stop-opacity=".75"/>
        <stop offset=".48" stop-color="#8ceafa" stop-opacity=".26"/>
        <stop offset="1" stop-color="#406fc3" stop-opacity=".48"/>
      </linearGradient>
      <linearGradient id="crystalFaceViolet" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#faf5ff" stop-opacity=".78"/>
        <stop offset=".36" stop-color="#be9ce9" stop-opacity=".45"/>
        <stop offset="1" stop-color="#5b70c8" stop-opacity=".28"/>
      </linearGradient>
      <linearGradient id="crystalFaceMirror" x1="0" y1="0" x2="1" y2=".95">
        <stop offset="0" stop-color="#faffff" stop-opacity=".85"/>
        <stop offset=".31" stop-color="#ffffff" stop-opacity=".12"/>
        <stop offset=".51" stop-color="#ecfcff" stop-opacity=".64"/>
        <stop offset=".72" stop-color="#94d9fc" stop-opacity=".08"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity=".6"/>
      </linearGradient>
      <linearGradient id="crystalIllumination" x1="0" y1="0" x2="1" y2=".85">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".64"/>
        <stop offset=".27" stop-color="#b7f9ff" stop-opacity="0"/>
        <stop offset=".54" stop-color="#ffffff" stop-opacity=".73"/>
        <stop offset=".70" stop-color="#a8aafc" stop-opacity="0"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity=".23"/>
      </linearGradient>
      <radialGradient id="crystalGlare" cx="31%" cy="23%" r="81%">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".88"/>
        <stop offset=".17" stop-color="#e6ffff" stop-opacity=".42"/>
        <stop offset=".42" stop-color="#c0ddfa" stop-opacity=".09"/>
        <stop offset="1" stop-color="#b6aaff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="crystalPrism" cx="80%" cy="84%" r="73%">
        <stop offset="0" stop-color="#bc89e9" stop-opacity=".52"/>
        <stop offset=".36" stop-color="#8cbaff" stop-opacity=".17"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
  }

  // 每個字都有不同的晶面角度；所有切面只作用在字形之內。
  function glassFacets(index) {
    const shift = (index % 2 ? 6 : -4);
    return `<g clip-path="url(#crystalClip${index})">
      <rect x="-70" y="-70" width="140" height="140" fill="url(#crystalGlare)"/>
      <polygon points="-58,-58 0,-65 ${n(shift+9)},-13 -45,8" fill="url(#crystalFaceCool)" opacity=".71"/>
      <polygon points="0,-65 62,-54 42,-14 ${n(shift+9)},-13" fill="#eefeff" opacity=".38"/>
      <polygon points="62,-54 67,17 19,11 42,-14" fill="url(#crystalFaceViolet)" opacity=".78"/>
      <polygon points="-58,-58 -45,8 -65,54 -21,42" fill="#5b94db" opacity=".23"/>
      <polygon points="-45,8 ${n(shift+9)},-13 19,11 -21,42" fill="url(#crystalFaceMirror)" opacity=".8"/>
      <polygon points="${n(shift+9)},-13 42,-14 19,11" fill="#ffffff" opacity=".4"/>
      <polygon points="19,11 67,17 62,62 -10,66" fill="#79c7ee" opacity=".31"/>
      <polygon points="-21,42 19,11 -10,66 -64,61" fill="#c69bf0" opacity=".24"/>
      <polygon points="-45,8 -21,42 -64,61 -65,54" fill="#eefeff" opacity=".36"/>
      <polygon points="-16,-65 10,-63 -13,70 -36,70" fill="url(#crystalIllumination)" opacity=".57"/>
      <polygon points="35,-65 45,-65 -5,70 -17,70" fill="#f9ffff" opacity=".14"/>
      <rect x="-70" y="-70" width="140" height="140" fill="url(#crystalPrism)"/>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M-58 -58 L${n(shift+9)} -13 L19 11 L-21 42 L-64 61" stroke="#f9ffff" stroke-opacity=".46" stroke-width=".72"/>
        <path d="M0 -65 L${n(shift+9)} -13 L42 -14 L62 -54" stroke="#f3f7ff" stroke-opacity=".46" stroke-width=".72"/>
        <path d="M19 11 L67 17 M19 11 L-10 66" stroke="#486db4" stroke-opacity=".29" stroke-width=".88"/>
        <path d="M-60 -35 Q-4 -54 51 -47" stroke="#ffffff" stroke-opacity=".62" stroke-width="1.7"/>
        <path d="M-46 31 Q-8 12 24 23" stroke="#ffffff" stroke-opacity=".34" stroke-width=".9"/>
      </g>
      <ellipse cx="-21" cy="-28" rx="29" ry="17" fill="url(#crystalGlare)" opacity=".82"/>
    </g>`;
  }

  function glyphs(positions) {
    return positions.map((pos, i) => `<g transform="translate(${pt(pos.x, pos.y)}) rotate(${n(pos.angle || 0)}) scale(${n(pos.size / 100)})">
      <use href="#crystalGlyph${i}" fill="#547cab" opacity=".17" transform="translate(1.2 1.9)"/>
      <use href="#crystalGlyph${i}" fill="url(#crystalBody)" stroke="url(#crystalEdge)" stroke-width="1.05" stroke-linejoin="round" paint-order="stroke fill"/>
      ${glassFacets(i)}
      <use href="#crystalGlyph${i}" fill="none" stroke="#fcffff" stroke-opacity=".61" stroke-width=".34" stroke-linejoin="round"/>
    </g>`).join('\n');
  }

  // 三角形的 20%～40% 是「不透明度」，僅作文字下層的晶體光片。
  // 坐標依各字實際中心與尺寸計算，避免一字、二字時裝飾仍散在四字的位置。
  function prisms(positions, orientation) {
    const result = [];
    const locations = orientation === 'horizontal'
      ? [[-.42,-.52,-13], [.36,.41,18], [0,-.71,36], [-.08,.64,-15]]
      : [[-.48,-.30,22], [.41,-.10,-12], [-.30,.39,35], [.22,-.44,-25]];
    positions.forEach((pos, i) => {
      const batch = i % 2 === 0 ? [0,1,2] : [0,1,3];
      for (const j of batch) {
        const [u,v,rotation] = locations[j];
        const x = pos.x + pos.size * (u + ((i % 3) - 1) * .026);
        const y = pos.y + pos.size * (v + ((i % 2) ? .035 : -.025));
        const size = pos.size * (j === 2 ? .23 : j === 3 ? .20 : (j === 1 ? .27 : .22));
        const opacity = [.24, .31, .22, .36][(j + i) % 4];
        const fill = colors[(i * 2 + j) % colors.length];
        result.push(`<polygon points="${pt(0,-size*.63)} ${pt(size*.65,size*.45)} ${pt(-size*.53,size*.38)}"
          transform="translate(${pt(x,y)}) rotate(${rotation + i * 9})"
          fill="${fill}" opacity="${opacity}"/>`);
      }
    });
    // 端點之外額外保留少量晶面，讓整條拱形自然收束。
    const first = positions[0];
    const last = positions[positions.length - 1];
    if (positions.length > 1) {
      const side = orientation === 'horizontal'
        ? [[first.x-first.size*.61, first.y+first.size*.03, -36], [last.x+last.size*.61,last.y-last.size*.16,18]]
        : [[first.x+first.size*.16, first.y-first.size*.42, -20], [last.x-last.size*.15,last.y+last.size*.42,21]];
      side.forEach(([x,y,r],i) => {
        const size = Math.min(first.size,last.size)*.20;
        result.push(`<polygon points="${pt(0,-size*.56)} ${pt(size*.6,size*.43)} ${pt(-size*.54,size*.4)}"
          transform="translate(${pt(x,y)}) rotate(${r})" fill="${colors[i+2]}" opacity=".25"/>`);
      });
    }
    return `<g aria-hidden="true">${result.join('\n')}</g>`;
  }

  function renderSVG(text, helpers, config) {
    const characters = helpers.splitCharacters(text);
    const positions = config.positions.slice(0, characters.length);
    const title = helpers.escapeXML(text);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}"
  viewBox="0 0 ${config.width} ${config.height}" role="img" aria-labelledby="crystalTitle crystalDescription">
  <title id="crystalTitle">${title}｜琉璃幻彩</title>
  <desc id="crystalDescription">${title}，水晶鏡面晶體切面、冰藍紫羅蘭炫彩折射；弧形文字下方有低不透明度三角形晶片。透明背景。</desc>
  ${definitions(characters, helpers)}
  ${prisms(positions, config.orientation)}
  ${glyphs(positions)}
</svg>`;
  }

  global.SlowlyCrystalTemplate = Object.freeze({renderSVG});
})(window);
