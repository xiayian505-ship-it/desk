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
  function chipPath(cx, cy, scale, rotate = 0) {
    const shape = [[-0.48, -0.38], [0.26, -0.46], [0.52, -0.04], [0.08, 0.46], [-0.44, 0.12]];
    const rad = rotate * Math.PI / 180;
    return shape.map(([px, py]) => {
      const x = px * scale;
      const y = py * scale;
      const rx = x * Math.cos(rad) - y * Math.sin(rad);
      const ry = x * Math.sin(rad) + y * Math.cos(rad);
      return `${round(cx + rx)},${round(cy + ry)}`;
    }).join(' ');
  }
  function renderSVG(text, helpers, layout) {
    const chars = core.splitCharacters(text);
    const slots = chars.map((char, index) => ({ char, index, ...layout.slots[index] }));
    const fontSize = slots.length === 1 ? 332 : slots.length === 2 ? 292 : slots.length === 3 ? 250 : 222;
    const glyphs = slots.map(({ char, x, y, index }) => `<text id="stoneH${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${[-2,1,-1,2][index]} ${x} ${y})">${helpers.escapeXML(char)}</text>`).join('\n');
    const uses = slots.map((_, index) => `<use href="#stoneH${index}"/>`).join('\n');
    const auras = slots.map(({ x, y }, index) => `<g transform="translate(${x} ${round(y + (index % 2 ? 10 : -2))})"><ellipse rx="130" ry="56" fill="url(#dustGlowH)" opacity=".3"/><ellipse rx="78" ry="26" fill="url(#dustGlowH)" opacity=".14"/></g>`).join('');
    const crackGlow = slots.map(({ x, y }, index) => {
      const main = `M${round(x - 94)} ${round(y - 92)} L${round(x - 44)} ${round(y - 26)} L${round(x - 10)} ${round(y - 36)} L${round(x + 22)} ${round(y + 16)} L${round(x + 56)} ${round(y - 6)} L${round(x + 94)} ${round(y + 86)}`;
      return `<path d="${main}" fill="none" stroke="url(#emberVeinH)" stroke-width="9.2" stroke-linecap="round" stroke-linejoin="round" opacity=".18"/><path d="${main}" fill="none" stroke="#d1a15a" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity=".14"/>`;
    }).join('');
    const cracks = slots.map(({ x, y }, index) => {
      const main = `M${round(x - 94)} ${round(y - 92)} L${round(x - 44)} ${round(y - 26)} L${round(x - 10)} ${round(y - 36)} L${round(x + 22)} ${round(y + 16)} L${round(x + 56)} ${round(y - 6)} L${round(x + 94)} ${round(y + 86)}`;
      const upper = `M${round(x + (index % 2 ? -1 : 1) * 16)} ${round(y - 74)} L${round(x + (index % 2 ? -1 : 1) * 48)} ${round(y - 28)} L${round(x + (index % 2 ? -1 : 1) * 76)} ${round(y - 48)}`;
      const lower = `M${round(x - (index % 2 ? -1 : 1) * 6)} ${round(y + 8)} L${round(x - (index % 2 ? -1 : 1) * 34)} ${round(y + 42)} L${round(x - (index % 2 ? -1 : 1) * 18)} ${round(y + 82)}`;
      return `<path d="${main}" fill="none" stroke="#211a17" stroke-width="8.4" stroke-linecap="round" stroke-linejoin="round" opacity=".94"/><path d="${main}" fill="none" stroke="#c18a45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".48"/><path d="${upper}" fill="none" stroke="#281f1b" stroke-width="3.9" stroke-linecap="round" stroke-linejoin="round" opacity=".78"/><path d="${lower}" fill="none" stroke="#281f1b" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity=".72"/><path d="${upper}" fill="none" stroke="#b2793a" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity=".28"/><path d="${lower}" fill="none" stroke="#a96f32" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round" opacity=".24"/>`;
    }).join('');
    const chips = slots.map(({ x, y }, index) => {
      const polys = [
        [x - 70, y - 14, 32, -18],
        [x + 28, y + 22, 28, 12],
        [x + 8, y - 64, 24, -8]
      ];
      return polys.map(([cx, cy, scale, rotate], i) => {
        const pts = chipPath(cx, cy, scale, rotate);
        return `<polygon points="${pts}" fill="${i === 1 ? '#574f49' : '#766c62'}" opacity="${index % 2 ? '.48' : '.42'}"/><polyline points="${pts}" fill="none" stroke="#ede4d4" stroke-width=".9" opacity=".24"/>`;
      }).join('');
    }).join('');
    const fragments = slots.map(({ x, y }, index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      return [
        `<polygon points="${chipPath(x - dir * 150, y - 96, 34, -14 * dir)}" fill="#91867a" stroke="#ece2d2" stroke-width="1.1" opacity=".84"/>`,
        `<polygon points="${chipPath(x + dir * 156, y + 72, 27, 11 * dir)}" fill="#6d655d" stroke="#ece2d2" stroke-width="1.1" opacity=".84"/>`,
        `<polygon points="${chipPath(x - dir * 98, y + 106, 21, -22 * dir)}" fill="#a29587" stroke="#ece2d2" stroke-width="1.1" opacity=".82"/>`,
        `<path d="M${round(x - dir * 108)} ${round(y - 46)} Q${round(x - dir * 168)} ${round(y - 24)} ${round(x - dir * 194)} ${round(y - 62)}" fill="none" stroke="url(#dustLineH)" stroke-width="1.1" opacity=".42"/>`,
        `<path d="M${round(x + dir * 64)} ${round(y + 64)} Q${round(x + dir * 142)} ${round(y + 102)} ${round(x + dir * 186)} ${round(y + 84)}" fill="none" stroke="#b58e61" stroke-width="1.05" opacity=".34"/>`
      ].join('');
    }).join('');
    const shock = slots.map(({ x, y }) => `<path d="M${round(x - 154)} ${round(y + 92)} Q${x} ${round(y + 48)} ${round(x + 156)} ${round(y + 82)}" fill="none" stroke="url(#dustLineH)" stroke-width="1.5" opacity=".34"/><path d="M${round(x - 124)} ${round(y - 82)} Q${round(x - 8)} ${round(y - 128)} ${round(x + 132)} ${round(y - 74)}" fill="none" stroke="#d9c6aa" stroke-width="1.15" opacity=".24"/>`).join('');
    const dust = slots.flatMap(({ x, y }, index) => [
      `<circle cx="${round(x - 128)}" cy="${round(y - 70)}" r="2" fill="#e8d9be" opacity=".68"/>`,
      `<circle cx="${round(x + 144)}" cy="${round(y - 18)}" r="1.7" fill="#d2b48b" opacity=".66"/>`,
      `<circle cx="${round(x + 126)}" cy="${round(y + 78)}" r="2.2" fill="#cda36b" opacity=".7"/>`,
      `<circle cx="${round(x - 84)}" cy="${round(y + 118)}" r="1.8" fill="#c5b29b" opacity=".6"/>`
    ]).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${helpers.escapeXML(text)}橫式古碑震裂藝術字"><title>${helpers.escapeXML(text)}｜石破天驚橫式藝術字</title><desc>透明背景，橫式古碑石刻、裂紋、崩口與塵霧沿著字體展開。</desc><defs><linearGradient id="rockFaceH" x1=".08" y1=".02" x2=".94" y2=".96"><stop offset="0" stop-color="#f6f0e6"/><stop offset=".18" stop-color="#d7cdbd"/><stop offset=".48" stop-color="#978c7d"/><stop offset=".78" stop-color="#5f564f"/><stop offset="1" stop-color="#322d2a"/></linearGradient><linearGradient id="rockEdgeH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".28" stop-color="#c8ba9f"/><stop offset=".68" stop-color="#594f47"/><stop offset="1" stop-color="#171513"/></linearGradient><linearGradient id="dustLineH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d7c6ab"/><stop offset="1" stop-color="#8f7764"/></linearGradient><linearGradient id="emberVeinH" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6c7"/><stop offset=".22" stop-color="#e9c774"/><stop offset=".56" stop-color="#b56f27"/><stop offset="1" stop-color="#522216"/></linearGradient><radialGradient id="dustGlowH" cx="50%" cy="48%" r="58%"><stop offset="0" stop-color="#e8d8b9" stop-opacity=".72"/><stop offset="1" stop-color="#e8d8b9" stop-opacity="0"/></radialGradient><filter id="stoneRoughH" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".042 .034" numOctaves="2" seed="11" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter><filter id="stoneShadowH" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="4.2"/></filter><filter id="veilGlowH" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur stdDeviation="3.2"/></filter><g id="glyphBankH">${glyphs}</g><clipPath id="letterMaskH">${uses}</clipPath></defs><g>${auras}</g><g fill="#171412" opacity=".26" filter="url(#stoneShadowH)" transform="translate(6 10)">${uses}</g><g fill="none" stroke="#f5eddc" stroke-width="8.8" stroke-linejoin="round" opacity=".9">${uses}</g><g fill="url(#rockFaceH)" stroke="url(#rockEdgeH)" stroke-width="4.1" stroke-linejoin="round" filter="url(#stoneRoughH)">${uses}</g><g fill="none" stroke="#f3ebdf" stroke-width="2.1" stroke-linejoin="round" opacity=".42">${uses}</g><g clip-path="url(#letterMaskH)" filter="url(#veilGlowH)">${crackGlow}</g><g clip-path="url(#letterMaskH)">${cracks}</g><g clip-path="url(#letterMaskH)">${chips}</g><g>${fragments}</g><g>${shock}</g><g>${dust}</g></svg>`;
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
