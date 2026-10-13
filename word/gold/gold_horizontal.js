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
  const round = n => Math.round(n * 10) / 10;
  const generator = library.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 65 }
    },
    filenames: {
      svg: text => `${core.fileSafe(text)}_金碧輝煌_橫式.svg`,
      png: text => `${core.fileSafe(text)}_金碧輝煌_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_金碧輝煌_橫式_角角者書封_700x1000.png`
    }
  });
  function renderSVG(text, helpers, layout) {
    const slots = core.splitCharacters(text).map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 336 : slots.length === 2 ? 292 : slots.length === 3 ? 252 : 222;
    const glyphs = slots.map(({ char, x, y, index }) => `<text id="g${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${[-2, 1, -1, 2][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const uses = slots.map((_, index) => `<use href="#g${index}"/>`).join('\n');
    const auras = slots.map(({ x, y }, index) => `<g transform="translate(${x} ${round(y + (index % 2 === 0 ? -6 : 12))})"><ellipse rx="146" ry="72" fill="url(#goldAuraH)" opacity=".84"/><ellipse rx="104" ry="42" fill="url(#goldAuraH)" opacity=".42"/></g>`).join('\n');
    const filigree = slots.map(({ x, y }, index) => `<g fill="none" stroke="url(#goldStrokeH)" stroke-width="2.6" stroke-linecap="round"><path d="M${round(x - 152)} ${round(y - 18)} C${round(x - 224)} ${round(y - 78)} ${round(x - 224)} ${round(y + 88)} ${round(x - 144)} ${round(y + 54)}" opacity=".58"/><path d="M${round(x + 152)} ${round(y + 16)} C${round(x + 222)} ${round(y + 86)} ${round(x + 222)} ${round(y - 76)} ${round(x + 136)} ${round(y - 50)}" opacity=".46"/></g>`).join('\n');
    const etch = slots.map(({ x, y }) => `<g clip-path="url(#clipH)"><path d="M${round(x - 92)} ${round(y - 54)} Q${x} ${round(y - 86)} ${round(x + 92)} ${round(y - 54)}" stroke="#fff7d8" stroke-width="2" opacity=".3"/><path d="M${round(x - 84)} ${round(y + 18)} Q${x} ${round(y - 12)} ${round(x + 84)} ${round(y + 18)}" stroke="#fff7d8" stroke-width="1.6" opacity=".25"/></g>`).join('\n');
    const jewels = slots.map(({ x, y }, index) => `<g opacity=".86"><g transform="translate(${round(x - 104)} ${round(y - 92)}) rotate(-10)"><path d="M0 -9 L6 0 L0 9 L-6 0Z" fill="#fff7d5" stroke="#ca9731" stroke-width="1.2"/><circle r="1.8" fill="#fffef6"/></g><g transform="translate(${round(x + 112)} ${round(y + 82)}) rotate(12)"><path d="M0 -7 L4.8 0 L0 7 L-4.8 0Z" fill="#f5d46f" stroke="#b57d16" stroke-width="1"/><circle r="1.6" fill="#fff6d5"/></g><path d="M${round(x - 98)} ${round(y - 82)} Q${round(x)} ${round(y - 126)} ${round(x + 92)} ${round(y - 36)}" fill="none" stroke="#efd27e" stroke-width="1" stroke-dasharray="1 6" opacity=".6"/></g>`).join('\n');
    const sparkles = slots.flatMap(({ x, y }) => [
      `<g transform="translate(${round(x - 126)} ${round(y + 68)})"><path d="M0 -7 L0 7 M-7 0 L7 0" stroke="#ffe9a6" stroke-width="1.3" stroke-linecap="round"/><path d="M-5 -5 L5 5 M-5 5 L5 -5" stroke="#d89d2a" stroke-width="1" stroke-linecap="round"/></g>`,
      `<g transform="translate(${round(x + 132)} ${round(y - 74)})"><path d="M0 -8 L0 8 M-8 0 L8 0" stroke="#fff8dd" stroke-width="1.4" stroke-linecap="round"/><path d="M-5.6 -5.6 L5.6 5.6 M-5.6 5.6 L5.6 -5.6" stroke="#d89d2a" stroke-width="1" stroke-linecap="round"/></g>`
    ]).join('\n');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式鎏金藝術字"><title>${helpers.escapeXML(text)}｜金碧輝煌橫式藝術字</title><desc>透明背景，橫式燙金文字、金紋與珠光裝飾。</desc><defs><linearGradient id="goldFaceH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff9cf"/><stop offset=".17" stop-color="#ffe489"/><stop offset=".38" stop-color="#c98916"/><stop offset=".6" stop-color="#f7d667"/><stop offset="1" stop-color="#fff5c3"/></linearGradient><linearGradient id="goldStrokeH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5200"/><stop offset="1" stop-color="#f3d376"/></linearGradient><radialGradient id="goldAuraH" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff3be" stop-opacity=".78"/><stop offset="1" stop-color="#fff3be" stop-opacity="0"/></radialGradient><filter id="goldBlurH" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter><g id="glyphBankH">${glyphs}</g><clipPath id="clipH">${uses}</clipPath></defs><g>${auras}</g><g>${filigree}</g><g filter="url(#goldBlurH)" fill="#7d560f" opacity=".24" transform="translate(0 8)">${uses}</g><g fill="url(#goldFaceH)" stroke="url(#goldStrokeH)" stroke-width="6" paint-order="stroke fill">${uses}</g><g fill="none">${etch}</g><g>${jewels}</g><g>${sparkles}</g></svg>`;
  }
  global.SlowlyGoldHorizontalArt = Object.freeze({
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
