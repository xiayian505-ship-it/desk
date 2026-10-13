"use strict";
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlySnowTemplate;
  const lib = global.SlowlyTextGenerator;
  if (!lib?.create) {
    console.error('大雪紛飛：未載入軍火庫 text_generator_component.js。');
    return;
  }
  if (typeof TEMPLATE !== 'string') {
    console.error('大雪紛飛：未載入 SVG 模板 snow_template.js。');
    return;
  }
  const POSITIONS = Object.freeze({
    1: [[420, 585, 395, 0]],
    2: [[418, 352, 315, -2], [424, 826, 315, 2]],
    3: [[420, 226, 280, -2], [408, 598, 280, 1], [426, 970, 280, -1]],
    4: [[418, 172, 248, -3], [430, 452, 248, 1], [402, 736, 248, -2], [430, 1018, 248, 2]]
  });
  const round = n => Math.round(n * 10) / 10;
  function flake(x,y,r) {
    return `<g transform="translate(${x} ${y})"><path d="M0 -${r} V${r} M-${r} 0 H${r} M-${round(r*.72)} -${round(r*.72)} L${round(r*.72)} ${round(r*.72)} M-${round(r*.72)} ${round(r*.72)} L${round(r*.72)} -${round(r*.72)}" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" opacity=".86"/><circle cx="0" cy="0" r="${round(r*.18)}" fill="#f4fbff"/></g>`;
  }
  function buildMist(points) {
    return points.map(([x, y, size]) => `<ellipse cx="${x}" cy="${y}" rx="${round(size*.95)}" ry="${round(size*.44)}" fill="url(#mistGlow)"/>`).join('\n');
  }
  function buildCrystals(count) {
    const items = [];
    for (let i = 0; i < 14 + count * 3; i += 1) {
      const x = 90 + (i * 83) % 650;
      const y = 92 + (i * 147) % 1008;
      const h = 26 + (i % 4) * 12;
      items.push(`<g transform="translate(${x} ${y}) rotate(${(i*27)%90})" opacity="${i%3===0?.72:.42}"><path d="M0 -${h} L${round(h*.42)} 0 L0 ${h} L-${round(h*.42)} 0 Z" fill="#dfefff" stroke="#9bb8d8" stroke-width="1.4"/></g>`);
    }
    return items.join('\n');
  }
  function buildSnowflakes(count) {
    const flakes = [];
    for (let i = 0; i < 26 + count * 7; i += 1) {
      flakes.push(flake(76 + (i * 103) % 690, 58 + (i * 181) % 1080, 4 + (i % 4) * 2));
    }
    return flakes.join('\n');
  }
  function buildFrost(points) {
    return points.map(([x,y], index) => {
      const parts=[];
      for (let i=-3;i<=3;i+=1) {
        parts.push(`<path d="M${round(x-74)} ${round(y+i*42)} Q${x} ${round(y+i*42-30)} ${round(x+74)} ${round(y+i*42)}" stroke="${index%2?'#f8fdff':'#d7e7f8'}" stroke-width="2" opacity=".35"/>`);
      }
      return parts.join('');
    }).join('\n');
  }
  function buildFlurries(count) {
    const dots=[];
    for(let i=0;i<44+count*8;i+=1){
      const x=65+((i*89)%710), y=48+((i*197)%1090), r=.8+(i%5)*.35;
      dots.push(`<circle cx="${x}" cy="${y}" r="${round(r)}" fill="${i%4===0?'#fff':'#dff0ff'}" opacity="${i%3===0?.92:.55}"/>`);
    }
    return dots.join('\n');
  }
  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((char, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="snowGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(char)}</text>`;
    }).join('\n');
    const uses = chars.map((_, i) => `<use xlink:href="#snowGlyph${i}"/>`).join('\n');
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，雪晶藝術字，雪花、霜霧與冰晶；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: uses,
      MIST: buildMist(points),
      CRYSTALS: buildCrystals(chars.length),
      SNOWFLAKES: buildSnowflakes(chars.length),
      FROST: buildFrost(points),
      FLURRIES: buildFlurries(chars.length)
    });
  }
  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: 'contain', paddingX: 54, paddingY: 46 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_大雪紛飛藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_大雪紛飛藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlySnowArt = Object.freeze({
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
