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
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 65 } },
    filenames: {
      svg: text => `${core.fileSafe(text)}_大雪紛飛_橫式.svg`,
      png: text => `${core.fileSafe(text)}_大雪紛飛_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_大雪紛飛_橫式_角角者書封_700x1000.png`
    }
  });
  function renderSVG(text, helpers, layout) {
    const slots = core.splitCharacters(text).map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 332 : slots.length === 2 ? 292 : slots.length === 3 ? 248 : 222;
    const letters = slots.map(({ char, x, y, index }) => `
      <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
            font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800"
            transform="rotate(${[-1, 1, -2, 2][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const mist = slots.map(({x,y})=>`<ellipse cx="${x}" cy="${y}" rx="170" ry="86" fill="url(#mistH)" opacity=".7"/>`).join('');
    const flakes = Array.from({ length: 40 + slots.length * 6 }, (_, i) => {
      const x = 50 + (i * 97) % 1100;
      const y = 45 + (i * 137) % 668;
      const r = 4 + (i % 4) * 1.8;
      return `<g transform="translate(${x} ${y})" opacity="${i%3===0?.88:.5}"><path d="M0 -${r} V${r} M-${r} 0 H${r} M-${r*.7} -${r*.7} L${r*.7} ${r*.7} M-${r*.7} ${r*.7} L${r*.7} -${r*.7}" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/></g>`;
    }).join('\n');
    const crystals = slots.map(({x,y},i)=>`<path d="M${x-115} ${y+145} L${x-86} ${y+105} L${x-58} ${y+145} L${x-86} ${y+183} Z" fill="${i%2?'#dff1ff':'#eff8ff'}" stroke="#a9c5e2" stroke-width="1.6" opacity=".46"/>`).join('\n');
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式雪晶藝術字">
      <title>${helpers.escapeXML(text)}｜大雪紛飛橫式藝術字</title>
      <desc>透明背景，橫式雪霧文字與雪晶裝飾。</desc>
      <defs>
        <linearGradient id="snowFaceH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".26" stop-color="#dff2ff"/><stop offset=".68" stop-color="#aacbec"/><stop offset="1" stop-color="#7699c0"/></linearGradient>
        <linearGradient id="iceStrokeH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5c7a99"/><stop offset="1" stop-color="#f0fbff"/></linearGradient>
        <radialGradient id="mistH" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#eef7ff" stop-opacity=".75"/><stop offset="1" stop-color="#eef7ff" stop-opacity="0"/></radialGradient>
        <filter id="snowBlurH" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="7"/></filter>
      </defs>
      <g>${mist}</g>
      <g>${flakes}</g>
      <g>${crystals}</g>
      <g filter="url(#snowBlurH)" fill="#7492b6" opacity=".2">${letters}</g>
      <g fill="url(#snowFaceH)" stroke="url(#iceStrokeH)" stroke-width="3.6" paint-order="stroke fill">${letters}</g>
      <g fill="none" stroke="#e9f6ff" stroke-width="2.4" opacity=".6"><path d="M66 594 C249 464 333 549 533 485 S902 414 1127 536"/></g>
    </svg>`;
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
