"use strict";
/* Thunder 保留風格專屬閃電、破損與字形，匯出流程交給軍火庫。 */
(function (global) {
  if (!global.SlowlyTextGenerator) throw new Error("請先載入 text_generator_component.js");
  const TEMPLATE = global.SlowlyThunderTemplate;
  const SIZE = Object.freeze({ width: 840, height: 1200 });
  const PNG_2X = Object.freeze({ width: 1680, height: 2400 });
  const BOOK = Object.freeze({ width: 700, height: 1000 });
  const MAX = 4;
  // 字型選擇以厚重中式筆鋒為主，不捆綁任何外部字型檔。
  const FONT = '"Noto Serif CJK TC", "Noto Serif TC", "Songti TC", "Source Han Serif TC", "PMingLiU", serif';
  const Y = Object.freeze({ 1: [600], 2: [418, 790], 3: [310, 602, 890], 4: [189, 461, 736, 1005] });
  const X = [414, 428, 409, 428], TILT = [-4, 3, -2.5, 4];
  const chars = global.SlowlyTextGenerator.splitCharacters;
  const xml = global.SlowlyTextGenerator.escapeXML;
  function normalize(raw) {
    return chars(raw).slice(0, MAX).join("");
  }
  function rnd(seed) {
    let s = seed >>> 0;
    return () => {
      s += 0x6d2b79f5;
      let z = s;
      z = Math.imul(z ^ (z >>> 15), z | 1);
      z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
      return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };
  }
  function textSeed(t) {
    let h = 2166136261;
    for (const c of t) {
      h = Math.imul(h ^ c.codePointAt(0), 16777619);
    }
    return h >>> 0;
  }
  function f(n) {
    return Number(n).toFixed(1);
  }
  function chain(r, x1, y1, x2, y2, parts = 8, bend = 22) {
    const pts = [[x1, y1]];
    for (let i = 1; i < parts; i++) {
      const k = i / parts;
      pts.push([x1 + (x2 - x1) * k + (r() - .5) * bend * 2, y1 + (y2 - y1) * k + (r() - .5) * bend * .68]);
    }
    pts.push([x2, y2]);
    return { points: pts, path: 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') };
  }
  function bolt(path, w, opacity = 1) {
    return `<g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${f(opacity)}"><path d="${path}" stroke="#317ad8" stroke-width="${f(w * 7)}" opacity=".20" filter="url(#boltBloom)"/><path d="${path}" stroke="#5ab0ff" stroke-width="${f(w * 2.4)}" opacity=".56"/><path d="${path}" stroke="#dffbff" stroke-width="${f(w)}"/></g>`;
  }
  function effects(ys, text) {
    const r = rnd(textSeed(text));
    let rear = '', front = '', wells = '', fractures = '', sparks = '';
    // 電弧繞開文字中心，筆畫保持可辨識。
    ys.forEach((y, i) => {
      const flip = i % 2 ? -1 : 1;
      const startX = flip > 0 ? 141 : 699, endX = flip > 0 ? 622 : 195;
      const main = chain(r, startX, y - 134, flip > 0 ? 614 : 206, y + 119, 9, 27);
      rear += bolt(main.path, 2.0, .75);
      const branch = main.points[3];
      const bx = branch[0] + flip * 125, by = branch[1] + 95;
      rear += bolt(chain(r, ...branch, bx, by, 4, 13).path, 1.2, .66);
      const branch2 = main.points[6];
      front += bolt(chain(r, ...branch2, branch2[0] - flip * 65, branch2[1] + 114, 4, 9).path, 1.8, .86);
      // 斷裂細弧局部從字的筆畫方向衝出。
      const sx = 380 + (r() - .5) * 90;
      front += bolt(chain(r, sx - 115, y + 70, sx + 120, y - 48, 6, 15).path, 1.05, .58);
      const wellX = 400 + (r() - .5) * 60, wellY = y + (r() - .5) * 44;
      wells += `<ellipse cx="${f(wellX)}" cy="${f(wellY)}" rx="250" ry="162" fill="url(#shock)" opacity=".38"/>`;
      // 刀鋒般的字內裂紋：裁到字形區域之內。
      for (let j = 0; j < 6; j++) {
        const px = 250 + r() * 325, py = y - 123 + r() * 249;
        const cut = chain(r, px, py, px + (r() - .5) * 102, py + 25 + r() * 87, 4, 8);
        fractures += `<path d="${cut.path}" fill="none" stroke="${j % 2 ? '#b2e8ff' : '#06111f'}" stroke-width="${f(j % 2 ? 1.4 : 3.1)}" opacity="${f(.35 + r() * .48)}"/>`;
      }
      // 崩裂碎片：不是星光或水滴，使用不規則尖角。
      for (let j = 0; j < 17; j++) {
        const px = 160 + r() * 530, py = y - 146 + r() * 280, sz = 2 + r() * 7;
        const fill = j % 3 === 0 ? '#cfe9fa' : j % 3 === 1 ? '#6bb6f6' : '#838fc8';
        // 碎裂金屬的細長三角，而非星星或水珠。
        sparks += `<path d="M${f(px)} ${f(py)} l${f(sz * (r() * 3 + .4))} ${f(-sz * (1 + r()))} ${f(-sz * (r() * .65 + .1))} ${f(sz * (1.8 + r()))}Z" fill="${fill}" opacity="${f(.25 + r() * .62)}"/>`;
      }
    });
    // 聯接上下雷字的中央雷擊：四字排列時非常顯眼，單字時則當作主題縱軸。
    const beginY = ys[0] - 146, endY = ys[ys.length - 1] + 151;
    rear += bolt(chain(r, 475, Math.max(24, beginY), 365, Math.min(1178, endY), Math.max(9, ys.length * 6), 36).path, 2.5, .42);
    return { rear, front, wells, fractures, sparks };
  }
  function generateSVG(raw) {
    if (typeof TEMPLATE !== 'string') throw new Error('雷電 SVG 模板沒有載入。');
    const text = normalize(raw), cs = chars(text);
    if (!cs.length) throw new Error('請先輸入文字。');
    const ys = Y[cs.length];
    const fontSize = cs.length === 1 ? 402 : cs.length === 2 ? 364 : cs.length === 3 ? 325 : 296;
    const glyphs = cs.map((ch, i) => `<text id="glyph${i}" x="${X[i]}" y="${ys[i]}" text-anchor="middle" dominant-baseline="central" font-family='${xml(FONT)}' font-size="${fontSize}" font-weight="900" transform="rotate(${TILT[i]} ${X[i]} ${ys[i]})">${xml(ch)}</text>`).join('');
    const ids = cs.map((_, i) => i);
    const uses = ids.map(i => `<use href="#glyph${i}" xlink:href="#glyph${i}"/>`).join('');
    const clipUses = ids.map(i => `<use href="#glyph${i}" xlink:href="#glyph${i}" fill="#fff" stroke="#fff" stroke-width="5"/>`).join('');
    const fx = effects(ys, text);
    return TEMPLATE.replaceAll('@@TITLE@@', xml(text)).replaceAll('@@DESC@@', xml(`${text}，雷電裂光與燒灼筆鋒，透明背景。`)).replace('@@GLYPHS@@', glyphs).replace('@@CLIP_USES@@', clipUses).replaceAll('@@GLYPH_USES@@', uses).replace('@@LIGHT_WELLS@@', fx.wells).replace('@@REAR_BOLTS@@', fx.rear).replace('@@FRONT_BOLTS@@', fx.front).replace('@@FISSURES@@', fx.fractures).replace('@@SPARKS@@', fx.sparks);
  }

  const generator = global.SlowlyTextGenerator.create({
    maxChars: MAX,
    sourceSize: SIZE,
    renderSVG: text => generateSVG(text),
    presets: { png: { scale: 2 }, cover: { width: 700, height: 1000, fit: "contain", paddingX: 55, paddingY: 45 } },
    filenames: {
      svg: text => `${global.SlowlyTextGenerator.fileSafe(text)}_thunder.svg`,
      png: text => `${global.SlowlyTextGenerator.fileSafe(text)}_thunder_2x.png`,
      cover: text => `${global.SlowlyTextGenerator.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyThunderArt = Object.freeze({
    MAX, SIZE, PNG_2X, BOOK, chars, normalize: generator.normalize,
    generateSVG: generator.generateSVG, url: generator.makeURL,
    downloadSVG: generator.downloadSVG,
    downloadPNG: text => generator.downloadPNG(text, "png"),
    downloadCover: generator.downloadCover
  });
})(window);
