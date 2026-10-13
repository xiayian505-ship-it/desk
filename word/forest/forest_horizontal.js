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
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';

  const generator = library.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 46, paddingY: 60 }
    },
    filenames: {
      svg: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_林風_橫式.svg`,
      png: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_林風_橫式_2x.png`,
      cover: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_林風_橫式_角角者書封_700x1000.png`
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
            font-weight="700" transform="rotate(${[-3, 2, -2, 3][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>
    `).join("\n");

    const ornaments = forestDecor(slots);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="${escaped}橫式藝術字">
        <title>${escaped}｜林風橫式藝術字</title>
        <desc>透明背景，橫式文字及主題裝飾。</desc>
        <defs>
          <linearGradient id="forestInk" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#234b37"/>
            <stop offset=".44" stop-color="#42684b"/>
            <stop offset=".7" stop-color="#6e8157"/>
            <stop offset="1" stop-color="#b2965a"/>
          </linearGradient>
          <filter id="forestSoft" x="-26%" y="-26%" width="152%" height="152%"><feGaussianBlur stdDeviation="4"/></filter>
        </defs>
        <g>${ornaments.leaves}</g>
        <g fill="none" stroke="#849779" stroke-width="2.5" opacity=".56">
          <path d="M35 274 C269 106 379 200 601 229 S944 149 1164 304"/>
          <path d="M63 600 C344 438 471 554 748 526 S1010 484 1142 594"/>
        </g>
        <g>${ornaments.grain}</g>
        <g fill="#38573d" filter="url(#forestSoft)" opacity=".23">${letters}</g>
        <g fill="url(#forestInk)" stroke="#bfa675" stroke-width="3" paint-order="stroke fill">${letters}</g>
        <g stroke="#cfb57d" stroke-width="2" stroke-linecap="round" fill="none" opacity=".76">
          <path d="M114 133 Q186 118 245 153"/>
          <path d="M941 623 Q1050 594 1126 633"/>
        </g>
      </svg>
    `;
  }

  function forestDecor(slots) {
    const leaves = [];
    for (let i = 0; i < 26; i += 1) {
      const x = 50 + (i * 107) % 1100;
      const y = 70 + (i * 173) % 595;
      const angle = (i * 41) % 170 - 85;
      const scale = .45 + (i % 4) * .16;
      leaves.push(`
        <g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})" opacity="${i % 3 === 0 ? .8 : .5}">
          <path d="M0 0 Q24 -35 0 -78 Q-27 -40 0 0Z" fill="${i % 5 ? '#698765' : '#b5985c'}" stroke="#335a46" stroke-width="2"/>
          <path d="M0 0 V-68" stroke="#e3d5a3" stroke-width="2" fill="none"/>
        </g>`);
    }
    const grain = slots.map(({ x, y }) => `
      <path d="M${x - 106} ${y + 129} Q${x} ${y + 83} ${x + 111} ${y + 141}"
            stroke="#b19763" stroke-width="2.4" fill="none" opacity=".55"/>`).join("\n");
    return { leaves: leaves.join("\n"), grain };
  }

  global.SlowlyForestHorizontalArt = Object.freeze({
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
