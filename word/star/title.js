"use strict";
/* Star 風格自身生成字形；共通 SVG/PNG/書封交給軍火庫完成品。 */
(function (global) {
  if (!global.SlowlyTextGenerator) throw new Error("請先載入 text_generator_component.js");
  const TEMPLATE = global.SlowlyStarArtTemplate;
  const OUTPUT_SIZE = Object.freeze({ width: 840, height: 1200 });
  const MAX_COUNT = 4;
  const LAYOUTS = Object.freeze({
    1: { top: 345, height: 760, y: [722] },
    2: { top: 212, height: 1025, y: [561, 862] },
    3: { top: 87, height: 1275, y: [372, 723, 1070] },
    4: { top: 0, height: 1450, y: [229, 519, 823, 1125] }
  });
  const XS = [405, 412, 396, 418];
  const ROTATIONS = [-3, 4, -4, 3];
  // 字體從優先的楷體一路回退到系統中文字型，無需上傳或封裝字型檔。
  // SVG 的 <text> 是可編輯向量文字；不同裝置的字型實際字形可能略異。
  const FONT_STACK = '"BiauKai", "DFKai-SB", "Kaiti TC", "STKaiti", "KaiTi", "AR PL KaitiM Big5", "Noto Serif CJK TC", "Noto Serif TC", serif';
  const splitCharacters = global.SlowlyTextGenerator.splitCharacters;
  const xmlEscape = global.SlowlyTextGenerator.escapeXML;
  function normalize(input) {
    return global.SlowlyTextGenerator.splitCharacters(input).slice(0, MAX_COUNT).join("");
  }
  function describe(text) {
    return `${text}：藍紫粉與香檳金的直式星辰藝術字，星軌、星光與月牙點綴，背景完全透明。`;
  }
  function generateSVG(raw) {
    if (typeof TEMPLATE !== "string") throw new Error("找不到星軌 SVG 模板。請確認 title_template.js 已正確載入。");
    const text = normalize(raw);
    if (!text) throw new Error("請輸入至少一個字。");
    const chars = splitCharacters(text);
    const layout = LAYOUTS[chars.length];
    // 4 個原圖字形的定點沿用原始星軌，其餘依可用高度居中排列。
    const glyphs = chars.map((char, i) => {
      const x = XS[i], y = layout.y[i];
      const fontSize = chars.length === 1 ? 382 : 380;
      // 用 <text> 當成 <use> 的來源，保留原作品相同的描邊、鍍色、光暈與內部星砂。
      return `<text id="glyph${i}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="${xmlEscape(FONT_STACK)}" font-size="${fontSize}" font-weight="400" transform="rotate(${ROTATIONS[i]} ${x} ${y})">${xmlEscape(char)}</text>`;
    }).join("\n  ");
    // 空字位會被 <use> 引用但無圖像，避免留下舊的固定字。
    const blank = Array.from({ length: 4 - chars.length }, (_, i) => `<g id="glyph${chars.length + i}"/>`).join("\n  ");
    return TEMPLATE
      .replaceAll("@@TITLE@@", xmlEscape(text))
      .replaceAll("@@DESC@@", xmlEscape(describe(text)))
      .replaceAll("@@GLYPHS@@", glyphs + blank)
      .replaceAll("@@TOP@@", String(layout.top))
      .replaceAll("@@HEIGHT@@", String(layout.height));
  }

  const KADOKADO_COVER = Object.freeze({ width: 700, height: 1000, ratio: "7:10" });
  const generator = global.SlowlyTextGenerator.create({
    maxChars: MAX_COUNT,
    sourceSize: OUTPUT_SIZE,
    renderSVG: text => generateSVG(text),
    presets: {
      png: { scale: 2 },
      cover: { width: 700, height: 1000, fit: "contain", paddingX: 76, paddingY: 52, roundPlacement: true }
    },
    filenames: {
      svg: text => `${global.SlowlyTextGenerator.fileSafe(text)}_星辰藝術字.svg`,
      png: text => `${global.SlowlyTextGenerator.fileSafe(text)}_星辰藝術字_2x.png`,
      cover: text => `${global.SlowlyTextGenerator.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyStarArt = Object.freeze({
    MAX_COUNT, KADOKADO_COVER, splitCharacters,
    normalize: generator.normalize, generateSVG: generator.generateSVG,
    outputSize: (text, multiplier = 1) => {
      const scale = Number(multiplier);
      if (!Number.isFinite(scale) || scale < 1 || scale > 4) throw new RangeError("輸出倍率需為 1～4。");
      const size = generator.sourceSize(text);
      return { width: Math.round(size.width * scale), height: Math.round(size.height * scale) };
    },
    makeUrl: generator.makeURL, downloadSVG: generator.downloadSVG,
    downloadPNG: (text, multiplier = 2) => {
      if (multiplier !== 2) throw new RangeError("此宿主僅提供 2 倍 PNG。請透過完成品設定其他倍率。");
      return generator.downloadPNG(text, "png");
    },
    downloadKadokadoCover: generator.downloadCover
  });
})(window);
