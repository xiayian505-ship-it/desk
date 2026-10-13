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
      svg: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_雨系_橫式.svg`,
      png: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_雨系_橫式_2x.png`,
      cover: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_雨系_橫式_角角者書封_700x1000.png`
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
            font-weight="500" transform="rotate(${[-3, 2, -2, 3][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>
    `).join("\n");

    const ornaments = rainDecor(slots);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="${escaped}橫式藝術字">
        <title>${escaped}｜雨系橫式藝術字</title>
        <desc>透明背景，橫式文字及主題裝飾。</desc>
        <defs>
          <linearGradient id="rainInk" x1="0" y1="0" x2="0.7" y2="1">
            <stop stop-color="#203d51"/>
            <stop offset=".52" stop-color="#4e7484"/>
            <stop offset="1" stop-color="#a1b7b9"/>
          </linearGradient>
          <filter id="rainBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
        </defs>
        <g fill="none" stroke-linecap="round">${ornaments.drips}</g>
        <path d="M60 579 Q380 640 635 565 T1148 583" stroke="#7793a1" stroke-width="3" fill="none" opacity=".35"/>
        <g>${ornaments.ripples}</g>
        <g fill="#466a76" filter="url(#rainBlur)" opacity=".26">${letters}</g>
        <g fill="url(#rainInk)" stroke="#253d4a" stroke-width="1.2" paint-order="stroke fill">${letters}</g>
        <g fill="none" stroke="#618b9f" stroke-width="1.3" opacity=".66">
          <path d="M94 173 C216 196 284 142 379 185 M816 195 Q925 150 1101 201"/>
          <path d="M160 625 Q473 673 718 633 T1107 650"/>
        </g>
      </svg>
    `;
  }

  function rainDecor(slots) {
    const drips = [];
    const ripples = [];
    for (let i = 0; i < 35; i += 1) {
      const x = 84 + (i * 83) % 1030;
      const y = 48 + (i * 57) % 490;
      const height = 35 + (i % 5) * 16;
      drips.push(`<path d="M${x} ${y} l${-9 - i % 7} ${height}" stroke="#5e8695" stroke-width="${i % 3 === 0 ? 2 : 1}" opacity=".27"/>`);
    }
    slots.forEach(({ x }, index) => {
      const y = 552 + (index % 2) * 14;
      ripples.push(`
        <path d="M${x - 118} ${y} Q${x} ${y - 46} ${x + 116} ${y}
                 M${x - 80} ${y + 17} Q${x} ${y - 7} ${x + 84} ${y + 16}"
              fill="none" stroke="#7197a5" stroke-width="2.1" opacity=".64"/>
      `);
    });
    return { drips: drips.join("\n"), ripples: ripples.join("\n") };
  }

  global.SlowlyRainHorizontalArt = Object.freeze({
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
