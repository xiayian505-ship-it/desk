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
    const letters = slots.map(({ char, x, y, index }) => `
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
            font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800"
            transform="rotate(${[-2, 1, -1, 2][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const sparkles = Array.from({ length: 36 + slots.length * 6 }, (_, i) => {
      const x = 55 + (i * 97) % 1090;
      const y = 48 + (i * 149) % 650;
      const s = 5 + (i % 4) * 1.6;
      return `<g transform="translate(${x} ${y})" opacity="${i % 3 === 0 ? .86 : .52}"><path d="M0 -${s} L0 ${s} M-${s} 0 L${s} 0" stroke="#ffe698" stroke-width="1.4" stroke-linecap="round"/><path d="M-${s*.65} -${s*.65} L${s*.65} ${s*.65} M-${s*.65} ${s*.65} L${s*.65} -${s*.65}" stroke="#cf9932" stroke-width="1" stroke-linecap="round"/></g>`;
    }).join('\n');
    const ribbons = slots.map(({ x, y }, index) => `<path d="M${x - 115} ${y + 138} Q${x} ${y + 74} ${x + 116} ${y + 140}" stroke="${index % 2 ? '#d09b29' : '#f4d46c'}" stroke-width="2.8" fill="none" opacity=".58"/>`).join('\n');
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式鎏金藝術字">
      <title>${helpers.escapeXML(text)}｜金碧輝煌橫式藝術字</title>
      <desc>透明背景，橫式燙金文字與華麗光彩。</desc>
      <defs>
        <linearGradient id="goldFaceH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff9cf"/><stop offset=".17" stop-color="#ffe489"/><stop offset=".38" stop-color="#c98916"/><stop offset=".6" stop-color="#f7d667"/><stop offset="1" stop-color="#fff5c3"/></linearGradient>
        <linearGradient id="goldStrokeH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b5200"/><stop offset="1" stop-color="#f3d376"/></linearGradient>
        <radialGradient id="goldAuraH" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff3be" stop-opacity=".7"/><stop offset="1" stop-color="#fff3be" stop-opacity="0"/></radialGradient>
        <filter id="goldBlurH" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      <g>${slots.map(({x,y})=>`<ellipse cx="${x}" cy="${y}" rx="180" ry="94" fill="url(#goldAuraH)" opacity=".78"/>`).join('')}</g>
      <g fill="none" stroke="#d29e2f" stroke-width="3.2" stroke-linecap="round">
        <path d="M98 157 Q216 98 320 171"/><path d="M887 594 Q1002 555 1112 615"/>
      </g>
      <g opacity=".28" filter="url(#goldBlurH)" fill="#7d560f">${letters}</g>
      <g fill="url(#goldFaceH)" stroke="url(#goldStrokeH)" stroke-width="6" paint-order="stroke fill">${letters}</g>
      <g>${ribbons}</g>
      <g>${sparkles}</g>
    </svg>`;
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
