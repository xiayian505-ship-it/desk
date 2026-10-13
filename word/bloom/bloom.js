"use strict";
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlyBloomTemplate;
  const lib = global.SlowlyTextGenerator;
  if (!lib?.create) {
    console.error('鳥語花香：未載入軍火庫 text_generator_component.js。');
    return;
  }
  if (typeof TEMPLATE !== 'string') {
    console.error('鳥語花香：未載入 SVG 模板 bloom_template.js。');
    return;
  }
  const POSITIONS = Object.freeze({
    1: [[420, 585, 398, -1]],
    2: [[412, 352, 316, -3], [426, 824, 316, 2]],
    3: [[423, 230, 280, -4], [406, 598, 280, 2], [432, 968, 280, -1]],
    4: [[416, 176, 248, -4], [430, 454, 248, 1], [402, 734, 248, -3], [432, 1012, 248, 2]]
  });
  const round = n => Math.round(n * 10) / 10;
  function flower(x, y, scale, rotate, center='#f4b6c0') {
    return `<g transform="translate(${round(x)} ${round(y)}) rotate(${rotate}) scale(${scale})"><path d="M0 -24 C9 -24 15 -13 15 -4 C15 8 7 11 0 9 C-7 11 -15 8 -15 -4 C-15 -13 -9 -24 0 -24Z" fill="#f7d9de"/><path d="M22 -3 C22 6 11 12 2 12 C-10 12 -13 4 -11 -4 C-13 -12 -10 -23 2 -23 C11 -23 22 -12 22 -3Z" fill="#f3c3cb"/><path d="M0 22 C-9 22 -15 11 -15 2 C-15 -10 -7 -13 0 -11 C7 -13 15 -10 15 2 C15 11 9 22 0 22Z" fill="#fbe5e8"/><path d="M-22 -3 C-22 -12 -11 -23 -2 -23 C10 -23 13 -15 11 -4 C13 4 10 12 -2 12 C-11 12 -22 6 -22 -3Z" fill="#f5ccd2"/><circle cx="0" cy="0" r="7" fill="${center}" stroke="#fff7f8" stroke-width="1.2"/></g>`;
  }
  function bird(x, y, scale, flip=1) {
    return `<g transform="translate(${round(x)} ${round(y)}) scale(${flip * scale} ${scale})"><path d="M0 0 C15 -30 51 -28 67 -6 C42 -2 27 1 11 18 C7 8 4 5 0 0Z" fill="#9b7f8a" opacity=".88"/><path d="M63 -4 L90 -16 L74 8 Z" fill="#d8a772" opacity=".75"/><circle cx="46" cy="-11" r="2.3" fill="#3b3132"/></g>`;
  }
  function buildBranches(count) {
    const parts = [];
    parts.push(`<path d="M109 270 C249 133 321 198 374 352" fill="none" stroke="#7f9b73" stroke-width="4.2" stroke-linecap="round"/>`);
    parts.push(`<path d="M731 462 C603 543 560 669 470 790" fill="none" stroke="#92a37b" stroke-width="4.2" stroke-linecap="round"/>`);
    parts.push(`<path d="M102 918 C220 844 330 930 400 1064" fill="none" stroke="#7a8f66" stroke-width="3.6" stroke-linecap="round"/>`);
    if (count > 2) parts.push(`<path d="M730 106 C638 164 566 236 530 328" fill="none" stroke="#88a26a" stroke-width="3.4" stroke-linecap="round"/>`);
    return parts.join('\n');
  }
  function buildBlossoms(count) {
    const nodes = [];
    const coords = [[164,238],[210,318],[638,446],[602,538],[168,936],[246,1012],[607,176],[558,264],[689,542],[536,844],[358,1080]];
    coords.slice(0, 7 + count).forEach(([x,y], i) => nodes.push(flower(x, y, .64 + (i % 3) * .16, i * 18, i % 2 ? '#f0b2bc' : '#ffd5db')));
    return nodes.join('\n');
  }
  function buildPetals(count) {
    const petals = [];
    for (let i = 0; i < 26 + count * 5; i += 1) {
      const x = 115 + (i * 67) % 600;
      const y = 70 + (i * 169) % 1040;
      petals.push(`<g transform="translate(${x} ${y}) rotate(${(i*33)%180})" opacity="${i % 4 === 0 ? .75 : .46}"><path d="M0 0 C12 -10 20 -7 23 2 C21 12 9 20 0 19 C-9 20 -20 12 -23 2 C-20 -7 -12 -10 0 0Z" fill="${i%3===0?'#f9d8dc':'#f5beca'}"/></g>`);
    }
    return petals.join('\n');
  }
  function buildBirds(count) {
    const birds = [bird(590, 240, .78, 1), bird(186, 736, .62, -1)];
    if (count > 2) birds.push(bird(640, 880, .55, 1));
    return birds.join('\n');
  }
  function buildVeins(points) {
    return points.map(([x,y], index) => {
      const lines = [];
      for (let i=-2;i<=2;i+=1) lines.push(`<path d="M${round(x-72)} ${round(y+i*44)} Q${x} ${round(y+i*44-31)} ${round(x+73)} ${round(y+i*44)}" stroke="${index%2 ? '#fff2f3' : '#f0d3d9'}" stroke-width="2" opacity=".25"/>`);
      return lines.join('');
    }).join('\n');
  }
  function buildSparks(count) {
    const dots=[];
    for(let i=0;i<18+count*5;i+=1){
      const x=80+((i*113)%680), y=62+((i*191)%1070), r=1+(i%3)*1.1;
      dots.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${i%2?'#f7d7dd':'#d8e6bf'}" opacity=".7"/>`);
    }
    return dots.join('\n');
  }
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((char, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="bloomGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(char)}</text>`;
    }).join('\n');
    const uses = chars.map((_, i) => `<use xlink:href="#bloomGlyph${i}"/>`).join('\n');
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，春花藝術字，飛鳥、花枝與花瓣；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      BRANCHES: buildBranches(chars.length),
      BLOSSOMS: buildBlossoms(chars.length),
      PETALS: buildPetals(chars.length),
      BIRDS: buildBirds(chars.length),
      VEINS: buildVeins(points),
      BLOSSOM_SPARKS: buildSparks(chars.length)
    });
  }
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 58, paddingY: 48 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_鳥語花香藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_鳥語花香藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyBloomArt = Object.freeze({
    MAX,
    characters: lib.splitCharacters,
    splitCharacters: lib.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: generator.createPreview,
    makeURL: generator.makeURL,
    makeUrl: generator.makeURL,
    url: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, 'png'),
    downloadCover: generator.downloadCover,
    formatSize: generator.formatSize,
    pngBlob: generator.pngBlob
  });
})(window);
