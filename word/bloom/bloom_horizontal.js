"use strict";
(function (global) {
  const library = global.SlowlyHorizontalTextGenerator;
  if (!library?.create) {
    console.error('橫式文字產生器：請先載入軍火庫 core + horizontal 完成品。');
    return;
  }
  const W = 1200;
  const H = 760;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const core = global.SlowlyTextGeneratorCore;
  const generator = library.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 40, paddingY: 65 } },
    filenames: {
      svg: text => `${core.fileSafe(text)}_鳥語花香_橫式.svg`,
      png: text => `${core.fileSafe(text)}_鳥語花香_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_鳥語花香_橫式_角角者書封_700x1000.png`
    }
  });
  function renderSVG(text, helpers, layout) {
    const slots = core.splitCharacters(text).map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 330 : slots.length === 2 ? 290 : slots.length === 3 ? 248 : 220;
    const letters = slots.map(({ char, x, y, index }) => `
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
            font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800"
            transform="rotate(${[-2, 2, -1, 3][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const flowers = Array.from({ length: 9 }, (_, i) => {
      const x = 84 + (i * 126) % 1030;
      const y = 104 + (i * 159) % 520;
      return `<g transform="translate(${x} ${y}) scale(${.5 + (i%3)*.12}) rotate(${i*17})"><path d="M0 -20 C7 -20 12 -11 12 -3 C12 6 5 9 0 8 C-5 9 -12 6 -12 -3 C-12 -11 -7 -20 0 -20Z" fill="#f5d8dd"/><path d="M18 -3 C18 4 9 10 2 10 C-7 10 -10 3 -9 -3 C-10 -10 -7 -17 2 -17 C9 -17 18 -10 18 -3Z" fill="#f4c4cd"/><path d="M0 18 C-7 18 -12 9 -12 2 C-12 -7 -5 -10 0 -9 C5 -10 12 -7 12 2 C12 9 7 18 0 18Z" fill="#fff0f2"/><path d="M-18 -3 C-18 -10 -9 -17 -2 -17 C7 -17 10 -10 9 -3 C10 3 7 10 -2 10 C-9 10 -18 4 -18 -3Z" fill="#f8d5dc"/><circle cx="0" cy="0" r="5.8" fill="#f0aebb"/></g>`;
    }).join('\n');
    const birds = `<g opacity=".72"><path d="M906 145 C927 104 981 100 1004 133 C967 140 948 148 924 171 C918 156 914 150 906 145 Z" fill="#9a7e88"/><path d="M998 132 L1026 121 L1008 146 Z" fill="#d8a772"/><circle cx="975" cy="122" r="2.4" fill="#362c2e"/></g>` +
                  `<g opacity=".65" transform="translate(-70 390) scale(-1 1)"><path d="M906 145 C927 104 981 100 1004 133 C967 140 948 148 924 171 C918 156 914 150 906 145 Z" fill="#9a7e88"/><path d="M998 132 L1026 121 L1008 146 Z" fill="#d8a772"/><circle cx="975" cy="122" r="2.4" fill="#362c2e"/></g>`;
    const vines = slots.map(({x,y},i)=>`<path d="M${x-110} ${y+130} Q${x} ${y+62} ${x+112} ${y+128}" stroke="${i%2?'#9db389':'#dcb4bf'}" stroke-width="2.6" fill="none" opacity=".62"/>`).join('\n');
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式春花藝術字">
      <title>${helpers.escapeXML(text)}｜鳥語花香橫式藝術字</title>
      <desc>透明背景，橫式花枝、飛鳥與春色文字。</desc>
      <defs>
        <linearGradient id="bloomFaceH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2f0"/><stop offset=".3" stop-color="#f2c4cc"/><stop offset=".72" stop-color="#cf98aa"/><stop offset="1" stop-color="#8f7282"/></linearGradient>
        <filter id="bloomBlurH" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <g>${flowers}</g>
      <g fill="none" stroke="#89a174" stroke-width="3" opacity=".6"><path d="M45 561 C208 447 304 541 445 485 S708 413 880 498 S1088 604 1160 538"/><path d="M126 216 C258 152 331 215 430 170"/></g>
      <g>${birds}</g>
      <g filter="url(#bloomBlurH)" fill="#7f666f" opacity=".2">${letters}</g>
      <g fill="url(#bloomFaceH)" stroke="#8b6a75" stroke-width="3.6" paint-order="stroke fill">${letters}</g>
      <g>${vines}</g>
    </svg>`;
  }
  global.SlowlyBloomHorizontalArt = Object.freeze({
    MAX_COUNT: MAX,
    MAX,
    sourceSize: { width: W, height: H },
    outputSize: scale => ({ width: Math.round(W * scale), height: Math.round(H * scale) }),
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
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover,
    downloadKadokadoCover: generator.downloadCover
  });
})(window);
