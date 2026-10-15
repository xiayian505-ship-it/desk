"use strict";
/* 橫式專用宿主 SVG；直式原模板與 v1 呼叫保持不變。
 * 版面／字色／裝飾由宿主控制，共用下載交給軍火庫 v2。
 */
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  if (!library?.create) {
    console.error("橫式文字產生器：請先載入軍火庫 core + horizontal 完成品。");
    return;
  }
  const W = 1200;
  const H = 760;
  const MAX = 4;
  const FONT = '"BiauKai", "DFKai-SB", "Kaiti TC", "STKaiti", "KaiTi", "Noto Serif CJK TC", serif';

  const generator = library.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 46, paddingY: 60 }
    },
    filenames: {
      svg: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_星河入夢_橫式.svg`,
      png: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_星河入夢_橫式_2x.png`,
      cover: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_星河入夢_橫式_角角者書封_700x1000.png`
    }
  });

  function slotsFor(text, layout) {
    return global.SlowlyTextGeneratorCore.splitCharacters(text).map((char, index) => ({
      char,
      index,
      ...layout.slots[index]
    }));
  }

  function renderSVG(text, helpers, layout) {
    const slots = slotsFor(text, layout);
    const escaped = helpers.escapeXML(text);
    const letters = slots.map(({ char, index, x, y }) => `
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
            font-family='${helpers.escapeXML(FONT)}' font-size="${slots.length === 1 ? 340 : slots.length === 2 ? 295 : slots.length === 3 ? 250 : 225}"
            font-weight="600" transform="rotate(${[-3, 2, -2, 3][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>
    `).join("\n");

    const ornaments = starfield(slots);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="${escaped}橫式藝術字">
        <title>${escaped}｜星河入夢・橫式藝術字</title>
        <desc>透明背景，橫式文字及主題裝飾。</desc>
        <defs>
          <linearGradient id="starInk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f9d9ab"/>
            <stop offset=".42" stop-color="#e2d5ff"/>
            <stop offset=".78" stop-color="#9fcbf8"/>
            <stop offset="1" stop-color="#ffe8ef"/>
          </linearGradient>
          <linearGradient id="starLine">
            <stop stop-color="#e3b5ff" stop-opacity="0"/>
            <stop offset=".5" stop-color="#ffe5ae"/>
            <stop offset="1" stop-color="#a8ccff" stop-opacity="0"/>
          </linearGradient>
          <filter id="starGlow" x="-35%" y="-45%" width="170%" height="190%">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
        </defs>
        <g>${ornaments.stars}</g>
        <g stroke="#eac8fe" stroke-width="1.5" fill="none" opacity=".52">
          <path d="M72 508 C300 193 754 166 1116 492"/>
          <path d="M105 585 C402 263 788 280 1084 594"/>
        </g>
        <g>${ornaments.trails}</g>
        <g fill="none" stroke="#a387d5" stroke-width="11" filter="url(#starGlow)" opacity=".54">${letters}</g>
        <g fill="url(#starInk)" stroke="#786baf" stroke-width="2.8" paint-order="stroke fill">${letters}</g>
        <path d="M981 180 A67 67 0 1 1 936 66 A51 51 0 1 0 981 180Z" fill="#f4dfad" opacity=".7"/>
        <g stroke="#ffedcb" stroke-width="3" stroke-linecap="round"><path d="M110 195 v26 m-13 -13 h26 M1070 555 v33 m-16 -16 h32"/></g>
      </svg>
    `;
  }

  function starfield(slots) {
    const stars = [];
    for (let i = 0; i < 88; i += 1) {
      const x = 55 + (i * 137) % 1095;
      const y = 90 + (i * 71) % 575;
      const r = i % 7 === 0 ? 3.6 : i % 3 === 0 ? 1.8 : 0.9;
      stars.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 5 === 0 ? '#ffe6b5' : '#d9cdfb'}" opacity="${i % 4 === 0 ? .85 : .48}"/>`);
    }
    const trails = slots.map(({ x, index }) => `
      <path d="M${x - 155} ${470 - index * 11} Q${x} ${565 + index * 10} ${x + 168} ${467 - index * 9}"
            stroke="url(#starLine)" stroke-width="2.2" fill="none" opacity=".72"/>`).join("\n");
    return { stars: stars.join("\n"), trails };
  }

  global.SlowlyStarHorizontalArt = Object.freeze({
    MAX_COUNT: MAX,
    MAX,
    sourceSize: { width: W, height: H },
    outputSize: (text, scale = 1) => ({
      width: Math.round(W * scale),
      height: Math.round(H * scale)
    }),
    splitCharacters: generator.splitCharacters,
    characters: generator.splitCharacters,
    chars: generator.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    makeURL: generator.makeURL,
    makeUrl: generator.makeURL,
    url: generator.makeURL,
    createPreview: generator.createPreview,
    formatSize: generator.formatSize,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover,
    downloadKadokadoCover: generator.downloadCover
  });
})(window);
