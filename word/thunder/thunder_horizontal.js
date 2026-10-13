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
      svg: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_雷電_橫式.svg`,
      png: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_雷電_橫式_2x.png`,
      cover: text => `${global.SlowlyTextGeneratorCore.fileSafe(text)}_雷電_橫式_角角者書封_700x1000.png`
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
            font-weight="900" transform="rotate(${[-3, 2, -2, 3][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>
    `).join("\n");

    const ornaments = electricArc(slots);
    return `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img"
           aria-label="${escaped}橫式藝術字">
        <title>${escaped}｜雷電橫式藝術字</title>
        <desc>透明背景，橫式文字及主題裝飾。</desc>
        <defs>
          <linearGradient id="thunderSteel" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#f3fbff"/>
            <stop offset=".22" stop-color="#8ad4ff"/>
            <stop offset=".62" stop-color="#4069b6"/>
            <stop offset="1" stop-color="#d3b5fb"/>
          </linearGradient>
          <filter id="thunderGlow" x="-32%" y="-40%" width="164%" height="180%"><feGaussianBlur stdDeviation="8"/></filter>
        </defs>
        <g stroke="#6cb7ff" stroke-width="10" opacity=".34" filter="url(#thunderGlow)">${ornaments.links}</g>
        <g>${ornaments.links}</g>
        <g>${ornaments.sparks}</g>
        <g fill="#4f92e9" stroke="#77bafd" stroke-width="14" opacity=".45" filter="url(#thunderGlow)">${letters}</g>
        <g fill="url(#thunderSteel)" stroke="#293c61" stroke-width="9" paint-order="stroke fill">${letters}</g>
        <g fill="none" stroke="#f0f9ff" stroke-width="4" stroke-linecap="round" opacity=".86">
          <path d="M72 194 L124 121 L103 219 L165 183"/>
          <path d="M1020 500 l36 -70 -13 79 63 -25"/>
        </g>
      </svg>
    `;
  }

  function electricArc(slots) {
    const links = slots.slice(0, -1).map(({ x, y }, index) => {
      const target = slots[index + 1].x;
      return `<path d="M${x + 103} ${y - 54} L${x + 137} ${y - 91} L${x + 159} ${y - 43} L${target - 116} ${y - 65}"
                    fill="none" stroke="${index % 2 ? '#b7dcff' : '#72b4fd'}" stroke-width="6" opacity=".84"/>`;
    });
    const sparks = [];
    for (let i = 0; i < 47; i += 1) {
      const x = 75 + (i * 151) % 1060;
      const y = 75 + (i * 93) % 600;
      sparks.push(`<path d="M${x} ${y} l${(i % 5) * 4 - 8} ${-6 - i % 9}"
                    stroke="${i % 4 ? '#80b9ff' : '#edfbff'}" stroke-width="${i % 3 ? 2 : 3}" opacity=".67"/>`);
    }
    return { links: links.join("\n"), sparks: sparks.join("\n") };
  }

  global.SlowlyThunderHorizontalArt = Object.freeze({
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
