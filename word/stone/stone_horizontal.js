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
  const round = value => Math.round(value * 10) / 10;
  const generator = library.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 42, paddingY: 64 }
    },
    filenames: {
      svg: text => `${core.fileSafe(text)}_石破天驚_橫式.svg`,
      png: text => `${core.fileSafe(text)}_石破天驚_橫式_2x.png`,
      cover: text => `${core.fileSafe(text)}_石破天驚_橫式_角角者書封_700x1000.png`
    }
  });
  function frag(cx, cy, size, rotate = 0, tone = '#8b8177') {
    const shape = [[-0.42,-0.5],[0.32,-0.38],[0.46,0.1],[0.04,0.54],[-0.5,0.22]];
    const pts = shape.map(([px, py]) => {
      const x = px * size;
      const y = py * size;
      const rad = rotate * Math.PI / 180;
      const rx = x * Math.cos(rad) - y * Math.sin(rad);
      const ry = x * Math.sin(rad) + y * Math.cos(rad);
      return `${round(cx + rx)},${round(cy + ry)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="${tone}" stroke="#ede4d4" stroke-width="1.1" opacity=".86"/>`;
  }
  function renderSVG(text, helpers, layout) {
    const chars = core.splitCharacters(text);
    const slots = chars.map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 332 : slots.length === 2 ? 292 : slots.length === 3 ? 250 : 222;
    const glyphs = slots.map(({ char, x, y, index }) => `<text id="stoneH${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${[-2,1,-1,2][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const uses = slots.map((_, index) => `<use href="#stoneH${index}"/>`).join('\n');
    const auras = slots.map(({ x, y }, index) => `<g transform="translate(${x} ${round(y + (index % 2 ? 10 : -2))})"><ellipse rx="136" ry="60" fill="url(#dustGlowH)" opacity=".42"/><ellipse rx="84" ry="30" fill="url(#dustGlowH)" opacity=".22"/></g>`).join('');
    const crackGlow = slots.map(({ x, y }, index) => {
      const main = `M${round(x - 96)} ${round(y - 96)} L${round(x - 46)} ${round(y - 28)} L${round(x - 12)} ${round(y - 40)} L${round(x + 22)} ${round(y + 20)} L${round(x + 56)} ${round(y - 8)} L${round(x + 96)} ${round(y + 90)}`;
      const side = `M${round(x - 6)} ${round(y - 78)} L${round(x + 28)} ${round(y - 24)} L${round(x + 8)} ${round(y + 18)} L${round(x + 36)} ${round(y + 72)}`;
      return `<path d="${main}" fill="none" stroke="url(#magmaH)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity=".34"/><path d="${side}" fill="none" stroke="url(#magmaH)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".24"/>`;
    }).join('');
    const cracks = slots.map(({ x, y }, index) => {
      const main = `M${round(x - 96)} ${round(y - 96)} L${round(x - 46)} ${round(y - 28)} L${round(x - 12)} ${round(y - 40)} L${round(x + 22)} ${round(y + 20)} L${round(x + 56)} ${round(y - 8)} L${round(x + 96)} ${round(y + 90)}`;
      const left = `M${round(x - 52)} ${round(y - 60)} L${round(x - 18)} ${round(y - 20)} L${round(x - 38)} ${round(y + 12)} L${round(x - 8)} ${round(y + 58)}`;
      const right = `M${round(x + 8)} ${round(y - 86)} L${round(x + 42)} ${round(y - 22)} L${round(x + 18)} ${round(y + 10)} L${round(x + 50)} ${round(y + 66)}`;
      return `<path d="${main}" fill="none" stroke="#2a1a15" stroke-width="9.6" stroke-linecap="round" stroke-linejoin="round" opacity=".94"/><path d="${main}" fill="none" stroke="url(#magmaH)" stroke-width="6.2" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/><path d="${left}" fill="none" stroke="#261712" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/><path d="${left}" fill="none" stroke="url(#magmaH)" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round" opacity=".84"/><path d="${right}" fill="none" stroke="#261712" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round" opacity=".76"/><path d="${right}" fill="none" stroke="url(#magmaH)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>`;
    }).join('');
    const chips = slots.map(({ x, y }, index) => {
      const polys = [
        [[x - 72, y - 16], [x - 28, y - 42], [x - 14, y + 8], [x - 60, y + 22]],
        [[x + 14, y + 18], [x + 56, y - 4], [x + 44, y + 40], [x + 4, y + 54]],
        [[x - 8, y - 68], [x + 30, y - 92], [x + 44, y - 48], [x + 2, y - 38]]
      ];
      return polys.map((poly, i) => {
        const pts = poly.map(([px, py]) => `${round(px)},${round(py)}`).join(' ');
        return `<polygon points="${pts}" fill="${i === 1 ? '#4d4540' : '#6b635b'}" opacity="${index % 2 ? '.52' : '.46'}"/><polyline points="${pts}" fill="none" stroke="#f2ebdf" stroke-width="1" opacity=".34"/>`;
      }).join('');
    }).join('');
    const fragments = slots.map(({ x, y }, index) => frag(x - 154, y - 102, 36, -18, '#8b8177') + frag(x + 162, y + 76, 28, 14, '#6c645d') + frag(x - 108, y + 112, 22, -24, '#94887d') + `<path d="M${round(x - 112)} ${round(y - 54)} Q${round(x - 172)} ${round(y - 38)} ${round(x - 202)} ${round(y - 72)}" fill="none" stroke="#c7b495" stroke-width="1.5" opacity=".54"/><path d="M${round(x + 72)} ${round(y + 72)} Q${round(x + 148)} ${round(y + 126)} ${round(x + 196)} ${round(y + 102)}" fill="none" stroke="#df8b36" stroke-width="1.4" opacity=".42"/>`).join('');
    const shocks = slots.flatMap(({ x, y }, index) => [
      `<path d="M${round(x - 164)} ${round(y + 106)} Q${x} ${round(y + 44)} ${round(x + 166)} ${round(y + 92)}" fill="none" stroke="#e0c8a2" stroke-width="2" opacity=".54"/>`,
      `<path d="M${round(x - 134)} ${round(y - 92)} Q${round(x - 8)} ${round(y - 152)} ${round(x + 142)} ${round(y - 84)}" fill="none" stroke="#f2ddbc" stroke-width="1.5" opacity=".44"/>`,
      `<g transform="translate(${round(x - 160)} ${round(y - 10)})" opacity=".74"><path d="M0 -8 L0 8 M-8 0 L8 0" stroke="#f9e6c3" stroke-width="1.2" stroke-linecap="round"/><path d="M-5.4 -5.4 L5.4 5.4 M-5.4 5.4 L5.4 -5.4" stroke="#cf7f28" stroke-width=".95" stroke-linecap="round"/></g>`,
      `<g transform="translate(${round(x + 164)} ${round(y - 76)})" opacity=".74"><path d="M0 -9 L0 9 M-9 0 L9 0" stroke="#f9e6c3" stroke-width="1.2" stroke-linecap="round"/><path d="M-6 -6 L6 6 M-6 6 L6 -6" stroke="#cf7f28" stroke-width="1" stroke-linecap="round"/></g>`
    ]).join('');
    const dust = slots.flatMap(({ x, y }, index) => [
      `<circle cx="${round(x - 134)}" cy="${round(y - 76)}" r="2.1" fill="#f7e6c2" opacity=".7"/>`,
      `<circle cx="${round(x + 152)}" cy="${round(y - 22)}" r="1.8" fill="#f0d0a3" opacity=".68"/>`,
      `<circle cx="${round(x + 132)}" cy="${round(y + 84)}" r="2.4" fill="#f7d882" opacity=".72"/>`,
      `<circle cx="${round(x - 90)}" cy="${round(y + 128)}" r="1.9" fill="#d7c4ab" opacity=".62"/>`
    ]).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式石裂藝術字"><title>${helpers.escapeXML(text)}｜石破天驚橫式藝術字</title><desc>透明背景，橫式裂石、碎片與震波沿字體展開。</desc><defs><linearGradient id="rockFaceH" x1=".06" y1=".04" x2=".96" y2=".96"><stop offset="0" stop-color="#f3efe7"/><stop offset=".18" stop-color="#cdc6bb"/><stop offset=".48" stop-color="#8b837a"/><stop offset=".78" stop-color="#534d48"/><stop offset="1" stop-color="#2e2b29"/></linearGradient><linearGradient id="rockEdgeH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#faf7f0"/><stop offset=".32" stop-color="#b8aa97"/><stop offset=".72" stop-color="#5b5148"/><stop offset="1" stop-color="#1b1817"/></linearGradient><linearGradient id="magmaH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4b6"/><stop offset=".2" stop-color="#ffd35d"/><stop offset=".48" stop-color="#ff7b1f"/><stop offset=".74" stop-color="#d94411"/><stop offset="1" stop-color="#6a1007"/></linearGradient><radialGradient id="dustGlowH" cx="50%" cy="50%" r="58%"><stop offset="0" stop-color="#ffe3a1" stop-opacity=".82"/><stop offset="1" stop-color="#ffe3a1" stop-opacity="0"/></radialGradient><filter id="stoneRoughH" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".045 .036" numOctaves="2" seed="13" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="stoneShadowH" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="4.8"/></filter><filter id="magmaGlowH" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter><g id="glyphBankH">${glyphs}</g><clipPath id="letterMaskH">${uses}</clipPath></defs><g>${auras}</g><g fill="#1a1817" opacity=".26" filter="url(#stoneShadowH)" transform="translate(6 10)">${uses}</g><g fill="none" stroke="#efe6d7" stroke-width="9" stroke-linejoin="round" opacity=".9">${uses}</g><g fill="url(#rockFaceH)" stroke="url(#rockEdgeH)" stroke-width="4" stroke-linejoin="round" filter="url(#stoneRoughH)">${uses}</g><g fill="none" stroke="#f6f0e5" stroke-width="2.2" stroke-linejoin="round" opacity=".54">${uses}</g><g clip-path="url(#letterMaskH)" filter="url(#magmaGlowH)">${crackGlow}</g><g clip-path="url(#letterMaskH)">${cracks}</g><g clip-path="url(#letterMaskH)">${chips}</g><g>${fragments}</g><g>${shocks}</g><g>${dust}</g></svg>`;
  }
  global.SlowlyStoneHorizontalArt = Object.freeze({
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
