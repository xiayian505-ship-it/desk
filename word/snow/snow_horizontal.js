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
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 65 } },
    filenames: {
      svg: text => `${core.fileSafe(text)}_大雪紛飛_橫式.svg`,
      png: text => `${core.fileSafe(text)}_大雪紛飛_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_大雪紛飛_橫式_角角者書封_700x1000.png`
    }
  });
  function flake(x, y, r, tone = '#ffffff') {
    return `<g transform="translate(${round(x)} ${round(y)})"><path d="M0 -${r} V${r} M-${r} 0 H${r} M-${round(r * 0.72)} -${round(r * 0.72)} L${round(r * 0.72)} ${round(r * 0.72)} M-${round(r * 0.72)} ${round(r * 0.72)} L${round(r * 0.72)} -${round(r * 0.72)}" stroke="${tone}" stroke-width="1.2" stroke-linecap="round" opacity=".86"/></g>`;
  }
  function renderSVG(text, helpers, layout) {
    const slots = core.splitCharacters(text).map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 332 : slots.length === 2 ? 292 : slots.length === 3 ? 248 : 222;
    const glyphs = slots.map(({ char, x, y, index }) => `<text id="g${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${[-1, 1, -2, 2][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const uses = slots.map((_, index) => `<use href="#g${index}"/>`).join('\n');
    const mist = slots.map(({ x, y }, index) => `<g transform="translate(${x} ${round(y + (index % 2 ? 10 : -6))})"><ellipse rx="138" ry="64" fill="url(#mistH)" opacity=".8"/><ellipse rx="96" ry="38" fill="url(#mistH)" opacity=".42"/></g>`).join('');
    const crystals = slots.map(({ x, y }, index) => `<g opacity=".76"><g transform="translate(${round(x - 118)} ${round(y - 86)}) rotate(${index % 2 === 0 ? -10 : 10})"><path d="M0 -24 L14 0 L0 24 L-14 0Z" fill="#eef8ff" stroke="#a6c8e6" stroke-width="1.5"/><path d="M0 -14 L8 0 L0 14 L-8 0Z" fill="#d8ecff" opacity=".75"/></g><g transform="translate(${round(x + 112)} ${round(y + 86)}) rotate(${index % 2 === 0 ? 16 : -16})"><path d="M0 -20 L12 0 L0 20 L-12 0Z" fill="#f4fbff" stroke="#b1cee7" stroke-width="1.4"/><path d="M0 -12 L7 0 L0 12 L-7 0Z" fill="#dcedff" opacity=".7"/></g></g>`).join('');
    const flakes = slots.flatMap(({ x, y }) => [flake(x - 126, y - 104, 7.5), flake(x + 130, y - 70, 6.2, '#e9f7ff'), flake(x + 96, y + 102, 5.8, '#f7fcff'), flake(x - 84, y + 104, 5.2, '#e4f3ff')]).join('');
    const frost = slots.map(({ x, y }) => `<g clip-path="url(#clipH)"><path d="M${round(x - 82)} ${round(y - 40)} Q${round(x - 12)} ${round(y - 74)} ${x} ${round(y - 38)} Q${round(x + 12)} ${round(y - 2)} ${round(x + 82)} ${round(y - 40)}" stroke="#f8fdff" stroke-width="1.8" opacity=".34"/><path d="M${round(x - 72)} ${round(y + 20)} Q${x} ${round(y - 8)} ${round(x + 72)} ${round(y + 20)}" stroke="#ddecfa" stroke-width="1.6" opacity=".3"/></g>`).join('');
    const flurries = slots.map(({ x, y }) => `<path d="M${round(x - 138)} ${round(y + 84)} Q${x} ${round(y + 34)} ${round(x + 138)} ${round(y + 76)}" fill="none" stroke="#eff8ff" stroke-width="2" opacity=".5"/><path d="M${round(x - 118)} ${round(y - 62)} Q${round(x - 18)} ${round(y - 98)} ${round(x + 120)} ${round(y - 44)}" fill="none" stroke="#dff1ff" stroke-width="1.5" opacity=".42"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式雪晶藝術字"><title>${helpers.escapeXML(text)}｜大雪紛飛橫式藝術字</title><desc>透明背景，橫式冰紋文字、雪晶與雪花裝飾。</desc><defs><linearGradient id="snowFaceH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".26" stop-color="#dff2ff"/><stop offset=".68" stop-color="#aacbec"/><stop offset="1" stop-color="#7699c0"/></linearGradient><linearGradient id="iceStrokeH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5c7a99"/><stop offset="1" stop-color="#f0fbff"/></linearGradient><radialGradient id="mistH" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#eef7ff" stop-opacity=".75"/><stop offset="1" stop-color="#eef7ff" stop-opacity="0"/></radialGradient><filter id="snowBlurH" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="7"/></filter><g id="bankH">${glyphs}</g><clipPath id="clipH">${uses}</clipPath></defs><g>${mist}</g><g>${crystals}</g><g>${flakes}</g><g filter="url(#snowBlurH)" fill="#7492b6" opacity=".2" transform="translate(0 7)">${uses}</g><g fill="url(#snowFaceH)" stroke="url(#iceStrokeH)" stroke-width="3.6" paint-order="stroke fill">${uses}</g><g fill="none">${frost}</g><g>${flurries}</g></svg>`;
  }
  global.SlowlySnowHorizontalArt = Object.freeze({
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
