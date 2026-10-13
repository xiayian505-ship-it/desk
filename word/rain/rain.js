"use strict";
/* Rain 只保留雨墨字形、漣漪、水滴；下載等功能交給軍火庫。 */
(function (global) {
  if (!global.SlowlyTextGenerator) throw new Error("請先載入 text_generator_component.js");
  const SVG_TEMPLATE = global.SlowlyRainArtTemplate;
  const W = 840, H = 1200, MAX = 4;
  const TWO_X = Object.freeze({ width: 1680, height: 2400 });
  const COVER = Object.freeze({ width: 700, height: 1000 });
  const FONT = '"BiauKai", "DFKai-SB", "Kaiti TC", "STKaiti", "KaiTi", "AR PL KaitiM Big5", "Noto Serif CJK TC", serif';
  const LAYOUT = {
    1: [600],
    2: [428, 780],
    3: [310, 602, 894],
    4: [174, 452, 730, 1008]
  };
  const characters = global.SlowlyTextGenerator.splitCharacters;
  const escapeXML = global.SlowlyTextGenerator.escapeXML;
  function normalize(text) {
    return characters(text).slice(0, MAX).join("");
  }
  function ripple(x, y, width, opacity) {
    const c = '#4b7786';
    return `<g fill="none" stroke="${c}" stroke-linecap="round" opacity="${opacity}">
      <path d="M ${x - width * .5} ${y} Q ${x} ${y - 24} ${x + width * .5} ${y}" stroke-width="1.5"/>
      <path d="M ${x - width * .66} ${y + 11} Q ${x} ${y - 20} ${x + width * .65} ${y + 12}" stroke-width="1.1"/>
      <path d="M ${x - width * .41} ${y + 22} Q ${x} ${y + 4} ${x + width * .35} ${y + 19}" stroke-width="1"/>
      <path d="M ${x - width * .25} ${y + 29} Q ${x} ${y + 19} ${x + width * .18} ${y + 28}" stroke-width=".9"/>
    </g>`;
  }
  function droplet(x, y, size, opacity) {
    return `<path d="M ${x} ${y - size * 1.4} C ${x + size * .34} ${y - size * .58}, ${x + size * .85} ${y}, ${x} ${y + size * .48} C ${x - size * .88} ${y}, ${x - size * .28} ${y - size * .64}, ${x} ${y - size * 1.4} Z" fill="#719bab" opacity="${opacity}"/>`;
  }
  function ornaments(ys) {
    let r = '', d = '';
    ys.forEach((y, i) => {
      const x = [374, 465, 361, 458][i];
      const waveY = Math.min(y + 131, 1138);
      r += ripple(x, waveY, 315, i % 2 ? '.37' : '.48');
      // 零碎水珠和墨水不規則點，緊貼文字而不形成奇幻飾品。
      const x1 = x - 145, x2 = x + 160;
      r += `<g fill="#5b8292" opacity=".37"><circle cx="${x1}" cy="${y + 75}" r="4"/><circle cx="${x1 - 21}" cy="${y + 84}" r="1.8"/><circle cx="${x2}" cy="${y + 84}" r="2.8"/><circle cx="${x2 + 12}" cy="${y + 92}" r="1.3"/></g>`;
      d += droplet(x + 72, y + 106, 9, .58) + droplet(x - 164, y + 50, 6, .39);
      d += `<path d="M${x + 72} ${y + 78} Q${x + 72 + 3} ${y + 95} ${x + 72} ${y + 95}" stroke="#5e8894" fill="none" opacity=".47" stroke-width="1.5"/>`;
    });
    return { r, d };
  }
  function generateSVG(raw) {
    if (typeof SVG_TEMPLATE !== 'string') throw new Error('未載入雨系 SVG 模板。');
    const text = normalize(raw), chars = characters(text);
    if (!chars.length) throw new Error('請先輸入一至四個字。');
    const ys = LAYOUT[chars.length];
    const xs = [421, 411, 428, 412];
    const tilts = [-3, 2.5, -2, 3];
    const glyphs = chars.map((ch, i) => `<text id="glyph${i}" x="${xs[i]}" y="${ys[i]}" font-family='${escapeXML(FONT)}' font-size="${chars.length === 1 ? 320 : chars.length === 2 ? 285 : 260}" font-weight="400" text-anchor="middle" dominant-baseline="central" transform="rotate(${tilts[i]} ${xs[i]} ${ys[i]})">${escapeXML(ch)}</text>`).join('');
    const blanks = Array.from({ length: MAX - chars.length }, (_, i) => `<g id="glyph${chars.length + i}"/>`).join('');
    const o = ornaments(ys);
    return SVG_TEMPLATE.replaceAll('@@TITLE@@', escapeXML(text))
      .replaceAll('@@DESC@@', escapeXML(`${text}，雨墨書法，漣漪、雨痕、水珠；透明背景。`))
      .replace('@@GLYPHS@@', glyphs + blanks)
      .replace('@@ORNAMENTS@@', o.r)
      .replace('@@DROPLETS@@', o.d);
  }

  const generator = global.SlowlyTextGenerator.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG: text => generateSVG(text),
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: "contain", paddingX: 62, paddingY: 54 } },
    filenames: {
      svg: text => `${global.SlowlyTextGenerator.fileSafe(text)}_雨系藝術字.svg`,
      png: text => `${global.SlowlyTextGenerator.fileSafe(text)}_雨系藝術字_2x.png`,
      cover: text => `${global.SlowlyTextGenerator.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyRainArt = Object.freeze({
    MAX, COVER, TWO_X, characters, normalize: generator.normalize,
    generateSVG: generator.generateSVG, makeURL: generator.makeURL,
    downloadSVG: generator.downloadSVG, downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
