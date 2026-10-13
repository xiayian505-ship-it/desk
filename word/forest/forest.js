"use strict";
/* ================================================================
 * 穿林打葉｜林風藝術字
 * 僅提供風格和 SVG 模板注入；共用生成流程由軍火庫提供。
 * 絕不複製 text_generator_component.js 原始碼。
 * ================================================================ */
(function (global) {
  const W = 840;
  const H = 1200;
  const MAX = 4;
  const KADOKADO = Object.freeze({ width: 700, height: 1000 });
  const FONT = '"Noto Serif CJK TC", "Source Han Serif TC", "Songti TC", "PMingLiU", serif';
  const TEMPLATE = global.SlowlyForestTemplate;
  const lib = global.SlowlyTextGenerator;

  if (!lib?.create) {
    console.error("林風藝術字：未載入軍火庫 text_generator_component.js。");
    return;
  }
  if (typeof TEMPLATE !== "string") {
    console.error("林風藝術字：未載入 SVG 模板 forest_template.js。");
    return;
  }

  const POSITIONS = Object.freeze({
    1: [[420, 583, 410, -3]],
    2: [[408, 350, 315, -4], [434, 820, 315, 4]],
    3: [[419, 234, 274, -4], [397, 598, 274, 2], [433, 962, 274, -3]],
    4: [[414, 178, 250, -5], [431, 452, 250, 2], [397, 732, 250, -4], [433, 1016, 250, 3]]
  });

  function round(n) {
    return Math.round(n * 10) / 10;
  }

  /* 自己繪製葉形：不是字體檔、圖片素材，也不依賴外部圖庫。 */
  function leaf(x, y, angle, length, fill = "url(#leafPaint)", opacity = 1) {
    const radius = length * 0.32;
    const vein = length * 0.73;
    return `
      <g transform="translate(${round(x)} ${round(y)}) rotate(${round(angle)})" opacity="${opacity}">
        <path d="M0 0 Q${round(radius)} ${round(-length * .2)} 0 ${round(-length)} Q${round(-radius * .92)} ${round(-length * .48)} 0 0 Z" fill="${fill}" stroke="#346348" stroke-width=".8"/>
        <path d="M0 0 Q2 ${round(-vein * .5)} 0 ${round(-vein)}" fill="none" stroke="#e5d9ad" stroke-width="1.3" opacity=".75"/>
        <path d="M0 ${round(-length * .28)} L${round(radius * .53)} ${round(-length * .51)} M0 ${round(-length * .52)} L${round(-radius * .52)} ${round(-length * .7)}" fill="none" stroke="#e5d9ad" stroke-width=".7" opacity=".45"/>
      </g>`;
  }

  function branchPath(x1, y1, x2, y2, bend = 0) {
    const midx = (x1 + x2) / 2 + bend;
    return `M${round(x1)} ${round(y1)} Q${round(midx)} ${round((y1 + y2) / 2)} ${round(x2)} ${round(y2)}`;
  }

  function buildBranches() {
    const paths = [
      branchPath(93, 103, 315, 353, 62),
      branchPath(784, 403, 549, 661, -65),
      branchPath(112, 785, 299, 1068, 77),
      branchPath(772, 962, 547, 1155, -70)
    ];
    return paths.map((path, index) => `
      <path d="${path}" fill="none" stroke="${index % 2 ? '#66846b' : '#987e4e'}" stroke-width="${index % 2 ? 3.2 : 4.3}" stroke-linecap="round" opacity=".55"/>`).join("\n");
  }

  function buildLeaves(charCount) {
    const back = [];
    const front = [];
    const count = 13 + charCount * 3;
    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side < 0 ? 168 + (i * 41) % 125 : 570 + (i * 37) % 111;
      const y = 83 + (i * 131) % 1044;
      const rotation = side < 0 ? -24 - (i * 9) % 83 : 27 + (i * 11) % 72;
      const size = 29 + (i * 13) % 39;
      (i % 3 === 0 ? front : back).push(leaf(x, y, rotation, size, i % 6 === 0 ? "url(#copper)" : "url(#leafPaint)", i % 3 === 0 ? .88 : .48));
    }
    // 風帶起的葉，僅與文字相依；不是一張固定的背景插圖。
    return { back: back.join("\n"), front: front.join("\n") };
  }

  function buildEngraving(points) {
    return points.map(([x, y, size], index) => {
      const step = size * .38;
      let lines = "";
      for (let j = -3; j <= 3; j += 1) {
        const x0 = x + j * 26 - step;
        const x1 = x + j * 26 + step;
        const yy = y + (j % 2) * 38;
        lines += `<path d="M${round(x0)} ${round(yy - 95)} Q${round(x)} ${round(yy + 24)} ${round(x1)} ${round(yy + 105)}" stroke="${j % 2 ? '#e9d9a9' : '#bbd7a5'}" stroke-width="${index % 2 ? 3 : 2}" opacity=".24"/>`;
      }
      return lines;
    }).join("\n");
  }

  function buildWind(points) {
    return points.map(([x, y, size], i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      const dx = direction * size * .66;
      const cy = y + size * .36;
      return `
        <g fill="none" stroke="url(#copper)" stroke-linecap="round" opacity=".62">
          <path d="M${round(x - dx * 1.65)} ${round(cy + 32)} Q${round(x - dx * .25)} ${round(cy - 68)} ${round(x + dx * 1.15)} ${round(cy - 28)}" stroke-width="2.2"/>
          <path d="M${round(x - dx * 1.26)} ${round(cy + 47)} Q${round(x - dx * .02)} ${round(cy - 19)} ${round(x + dx * .83)} ${round(cy + 15)}" stroke-width="1.2"/>
          <path d="M${round(x - dx * 1.95)} ${round(cy + 9)} l${round(dx * .27)} -12" stroke-width="2"/>
        </g>`;
    }).join("\n");
  }

  function buildFlecks(count) {
    const dots = [];
    for (let i = 0; i < 45 + count * 8; i += 1) {
      const x = 140 + ((i * 97 + 17) % 553);
      const y = 83 + ((i * 211 + 59) % 1030);
      const r = .8 + ((i * 7) % 8) * .2;
      dots.push(`<circle cx="${x}" cy="${y}" r="${round(r)}" fill="${i % 3 ? '#beac78' : '#5d896f'}" opacity="${i % 4 === 0 ? .58 : .3}"/>`);
    }
    return dots.join("\n");
  }

  function renderSVG(text, helpers) {
    const chars = helpers.splitCharacters(text);
    const points = POSITIONS[chars.length];
    const glyphs = chars.map((character, index) => {
      const [x, y, fontSize, angle] = points[index];
      return `<text id="forestGlyph${index}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family='${helpers.escapeXML(FONT)}' font-size="${fontSize}" font-weight="800" transform="rotate(${angle} ${x} ${y})">${helpers.escapeXML(character)}</text>`;
    }).join("\n");
    const uses = chars.map((_, i) => `<use xlink:href="#forestGlyph${i}"/>`).join("\n");
    const clips = chars.map((_, i) => `<use xlink:href="#forestGlyph${i}"/>`).join("\n");
    const leaves = buildLeaves(chars.length);
    return helpers.applyTemplate(TEMPLATE, {
      TITLE: helpers.escapeXML(text),
      DESC: helpers.escapeXML(`${text}，林風木刻藝術字，苔綠葉脈、古銅細描、枝葉與風痕；透明背景。`),
      GLYPHS: glyphs,
      LETTER_USES: uses,
      LETTER_CLIPS: clips,
      BACK_BRANCHES: buildBranches(),
      BACK_LEAVES: leaves.back,
      FRONT_LEAVES: leaves.front,
      ENGRAVING: buildEngraving(points),
      WIND: buildWind(points),
      FLECKS: buildFlecks(chars.length)
    });
  }

  const generator = lib.create({
    maxChars: MAX,
    sourceSize: { width: W, height: H },
    renderSVG,
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 62, paddingY: 45 }
    },
    filenames: {
      svg: text => `${lib.fileSafe(text)}_林風藝術字.svg`,
      png: text => `${lib.fileSafe(text)}_林風藝術字_2x.png`,
      cover: text => `${lib.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });

  global.SlowlyForestArt = Object.freeze({
    MAX,
    KADOKADO,
    splitCharacters: lib.splitCharacters,
    normalize: generator.normalize,
    generateSVG: generator.generateSVG,
    createPreview: generator.createPreview,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover,
    formatSize: generator.formatSize,
    pngBlob: generator.pngBlob
  });
})(window);
