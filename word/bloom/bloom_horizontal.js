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
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 40, paddingY: 65 } },
    filenames: {
      svg: text => `${core.fileSafe(text)}_鳥語花香_橫式.svg`,
      png: text => `${core.fileSafe(text)}_鳥語花香_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_鳥語花香_橫式_角角者書封_700x1000.png`
    }
  });
  function flower(x, y, scale, rotate, palette = 0) {
    const petals = [
      ['#fce9ee', '#f5c8d3', '#f1b2c0'],
      ['#fff0f1', '#f7d7dc', '#e7b6c2'],
      ['#f7e4e9', '#efc0cd', '#d6a4b4']
    ][palette % 3];
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(${rotate}) scale(${scale})"><path d="M0 -22 C8 -22 15 -12 15 -4 C15 7 7 12 0 10 C-7 12 -15 7 -15 -4 C-15 -12 -8 -22 0 -22Z" fill="${petals[0]}"/><path d="M20 -2 C20 7 9 13 1 13 C-9 13 -13 5 -11 -4 C-13 -13 -9 -22 1 -22 C9 -22 20 -13 20 -2Z" fill="${petals[1]}"/><path d="M0 20 C-8 20 -15 9 -15 1 C-15 -9 -7 -13 0 -11 C7 -13 15 -9 15 1 C15 9 8 20 0 20Z" fill="${petals[0]}"/><path d="M-20 -2 C-20 -13 -9 -22 -1 -22 C9 -22 13 -13 11 -4 C13 5 9 13 -1 13 C-9 13 -20 7 -20 -2Z" fill="${petals[1]}"/><circle cx="0" cy="0" r="6.2" fill="${petals[2]}" stroke="#fff8fb" stroke-width="1.1"/></g>`;
  }
  function leaf(x, y, scale, rotate, fill = '#8baa77') {
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(${rotate}) scale(${scale})"><path d="M0 0 C16 -12 37 -10 52 0 C36 12 16 15 0 0Z" fill="${fill}" opacity=".84"/><path d="M4 0 Q22 0 47 0" fill="none" stroke="#dfeacc" stroke-width="1.4" opacity=".68" stroke-linecap="round"/></g>`;
  }
  function bird(x, y, scale, flip = 1) {
    return `<g transform="translate(${round(x)} ${round(y)}) scale(${round(flip * scale)} ${scale})"><path d="M0 0 C18 -34 59 -32 78 -8 C48 -1 30 4 13 24 C8 13 5 5 0 0Z" fill="#907983" opacity=".9"/><path d="M72 -6 L100 -16 L84 9 Z" fill="#d8a772" opacity=".78"/><path d="M18 12 Q40 3 65 2" fill="none" stroke="#f5e7ec" stroke-width="1.8" opacity=".32"/><circle cx="53" cy="-12" r="2.5" fill="#362c2e"/></g>`;
  }
  function renderSVG(text, helpers, layout) {
    const slots = core.splitCharacters(text).map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 330 : slots.length === 2 ? 290 : slots.length === 3 ? 248 : 220;
    const glyphs = slots.map(({ char, x, y, index }) => `<text id="g${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${[-2, 2, -1, 3][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const uses = slots.map((_, index) => `<use href="#g${index}"/>`).join('\n');
    const branchPath = ['M' + round(slots[0].x - 180) + ' ' + round(slots[0].y + 46)];
    slots.forEach(({ x, y }, index) => branchPath.push(`Q${round(x + (index % 2 === 0 ? 62 : -58))} ${round(y - 18)} ${x} ${round(y + 24)}`));
    const branches = `<path d="${branchPath.join(' ')}" fill="none" stroke="#89a174" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` + slots.map(({ x, y }, index) => `<path d="M${round(x)} ${round(y + 12)} Q${round(x + (index % 2 === 0 ? 74 : -74))} ${round(y - 62)} ${round(x + (index % 2 === 0 ? 124 : -124))} ${round(y - 94)}" fill="none" stroke="#97af80" stroke-width="3" stroke-linecap="round"/>`).join('');
    const blossoms = slots.map(({ x, y }, index) => flower(x - 102, y - 84, 0.64, -14 + index * 10, index) + flower(x + 112, y + 76, 0.54, 20 - index * 7, index + 1) + (index % 2 === 0 ? flower(x + 16, y - 126, 0.48, 12, index + 2) : '')).join('');
    const leaves = slots.map(({ x, y }, index) => leaf(x - 126, y + 22, 0.72, -18, '#9cb08b') + leaf(x + 132, y - 18, 0.58, 26, '#809a73') + `<g transform="translate(${round(x + 84)} ${round(y - 132)}) rotate(18)" opacity=".56"><path d="M0 0 C10 -8 18 -6 20 2 C18 11 8 18 0 17 C-8 18 -17 11 -19 2 C-17 -6 -10 -9 0 0Z" fill="#f6d8df"/></g>`).join('');
    const birds = slots.length >= 1 ? bird(slots[0].x + 112, slots[0].y - 146, 0.7, 1) + (slots.length > 2 ? bird(slots[slots.length - 1].x - 118, slots[slots.length - 1].y + 32, 0.54, -1) : '') : '';
    const veins = slots.map(({ x, y }) => `<g clip-path="url(#clipH)"><path d="M${round(x - 82)} ${round(y - 42)} Q${x} ${round(y - 72)} ${round(x + 82)} ${round(y - 42)}" stroke="#fff1f4" stroke-width="1.8" opacity=".26"/><path d="M${round(x - 74)} ${round(y + 16)} Q${x} ${round(y - 8)} ${round(x + 74)} ${round(y + 16)}" stroke="#f2d7de" stroke-width="1.6" opacity=".23"/></g>`).join('');
    const sparks = slots.flatMap(({ x, y }, index) => [
      `<circle cx="${round(x - 118)}" cy="${round(y - 102)}" r="2" fill="#f5dce1" opacity=".68"/>`,
      `<circle cx="${round(x + 124)}" cy="${round(y - 64)}" r="1.5" fill="#e2efcc" opacity=".68"/>`,
      `<circle cx="${round(x + 96)}" cy="${round(y + 92)}" r="2.2" fill="#f2ccd5" opacity=".64"/>`,
      `<circle cx="${round(x - 90)}" cy="${round(y + 108)}" r="1.6" fill="#d9e8c4" opacity=".62"/>`
    ]).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式春花藝術字"><title>${helpers.escapeXML(text)}｜鳥語花香橫式藝術字</title><desc>透明背景，橫式花枝穿字、飛鳥停棲與花瓣裝飾。</desc><defs><linearGradient id="faceH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2f0"/><stop offset=".3" stop-color="#f2c4cc"/><stop offset=".72" stop-color="#cf98aa"/><stop offset="1" stop-color="#8f7282"/></linearGradient><filter id="blurH" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="7"/></filter><g id="bankH">${glyphs}</g><clipPath id="clipH">${uses}</clipPath></defs><g opacity=".62">${branches}</g><g opacity=".78">${blossoms}</g><g opacity=".68">${leaves}</g><g opacity=".8">${birds}</g><g filter="url(#blurH)" fill="#7f666f" opacity=".2" transform="translate(0 7)">${uses}</g><g fill="url(#faceH)" stroke="#8b6a75" stroke-width="3.6" paint-order="stroke fill">${uses}</g><g fill="none">${veins}</g><g>${sparks}</g></svg>`;
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
