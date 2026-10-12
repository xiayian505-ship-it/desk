"use strict";
/* ==============================================================
   星辰藝術字產生器｜功能核心（UI 事件在 title_style.js）
   - 完全前端；無帳號、無遠端生成請求
   - 原版 SVG 光軌模板 + 任意 1~4 Unicode 字元的字形
   - 向量 SVG 與瀏覽器產生的透明 PNG
   - 軍火庫用 HTTPS 引用；失聯時可使用瀏覽器原生 API 備援
   ============================================================== */
(function (global) {
  const TEMPLATE = global.SlowlyStarArtTemplate;
  const WIDTH = 820;
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
  function splitCharacters(input) {
    const clean = String(input ?? "").replace(/[\r\n\u200b\uFEFF]/g, "").trim();
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      return Array.from(new Intl.Segmenter("zh-Hant", { granularity: "grapheme" }).segment(clean), s => s.segment);
    }
    return Array.from(clean);
  }
  function normalize(input) { return splitCharacters(input).slice(0, MAX_COUNT).join(""); }
  function xmlEscape(str) { return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
  function fileSafe(text) { return (text || "星辰藝術字").replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").slice(0, 32) || "星辰藝術字"; }
  function describe(text) { return `${text}：藍紫粉與香檳金的直式星辰藝術字，星軌、星光與月牙點綴，背景完全透明。`; }
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
  function outputSize(raw, multiplier = 1) {
    const n = splitCharacters(normalize(raw)).length;
    if (!n) throw new Error("請先輸入文字。");
    const scale = Number(multiplier);
    if (!Number.isFinite(scale) || scale < 1 || scale > 4) throw new RangeError("輸出倍率需為 1～4。");
    return { width: Math.round(WIDTH * scale), height: Math.round(LAYOUTS[n].height * scale) };
  }
  function makeUrl(svg) { return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" })); }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename;
    document.body.appendChild(link);
    link.click(); link.remove();
    // 不在按下後瞬間撤銷 URL，避免行動瀏覽器下載尚未開始。
    global.setTimeout(() => URL.revokeObjectURL(url), 15000);
  }
  function downloadSVG(raw) {
    const text = normalize(raw);
    const svg = generateSVG(text);
    const filename = `${fileSafe(text)}_星辰藝術字.svg`;
    downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), filename);
    return { filename, width: WIDTH, height: LAYOUTS[splitCharacters(text).length].height };
  }
  function imageFromSVG(svg) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = makeUrl(svg);
      image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("無法載入向量藝術字，PNG 匯出失敗。")); };
      image.src = url;
    });
  }
  async function toPNGBlob(canvas) {
    if (global.SlowlyCanvasPNG && typeof global.SlowlyCanvasPNG.toBlob === "function") {
      return global.SlowlyCanvasPNG.toBlob(canvas);
    }
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("瀏覽器無法產生 PNG。")), "image/png"));
  }
  async function downloadPNG(raw, multiplier = 2) {
    const text = normalize(raw);
    const svg = generateSVG(text);
    const dimensions = outputSize(text, multiplier);
    const image = await imageFromSVG(svg);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("目前瀏覽器不支援 Canvas 繪圖。");
    // 不畫背景，像素保留透明；SVG 的 viewBox 和輸出等比。
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);
    const blob = await toPNGBlob(canvas);
    if (!blob || blob.size === 0) throw new Error("產生的 PNG 是空檔案。");
    const filename = `${fileSafe(text)}_星辰藝術字_${multiplier}x.png`;
    if (global.SlowlyPNGDownload && typeof global.SlowlyPNGDownload.fromBlob === "function") {
      global.SlowlyPNGDownload.fromBlob(blob, filename);
    } else {
      downloadBlob(blob, filename);
    }
    canvas.width = canvas.height = 0; // 釋放行動裝置畫布記憶體
    return { filename, ...dimensions, bytes: blob.size };
  }
  async function downloadKadokadoCover(raw) {
    const text = normalize(raw);
    const svg = generateSVG(text);
    const source = outputSize(text, 1);
    const image = await imageFromSVG(svg);
    const canvas = document.createElement("canvas");
    canvas.width = KADOKADO_COVER.width;
    canvas.height = KADOKADO_COVER.height;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("目前瀏覽器不支援 Canvas 繪圖。");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddingX = 76;
    const paddingY = 52;
    const boxW = canvas.width - paddingX * 2;
    const boxH = canvas.height - paddingY * 2;
    const scale = Math.min(boxW / source.width, boxH / source.height);
    const drawW = Math.round(source.width * scale);
    const drawH = Math.round(source.height * scale);
    const dx = Math.round((canvas.width - drawW) / 2);
    const dy = Math.round((canvas.height - drawH) / 2);

    ctx.drawImage(image, dx, dy, drawW, drawH);
    const blob = await toPNGBlob(canvas);
    if (!blob || blob.size === 0) throw new Error("產生的角角者書封 PNG 是空檔案。");
    const filename = `${fileSafe(text)}_角角者書封_700x1000.png`;
    if (global.SlowlyPNGDownload && typeof global.SlowlyPNGDownload.fromBlob === "function") {
      global.SlowlyPNGDownload.fromBlob(blob, filename);
    } else {
      downloadBlob(blob, filename);
    }
    canvas.width = canvas.height = 0;
    return { filename, width: KADOKADO_COVER.width, height: KADOKADO_COVER.height, bytes: blob.size };
  }
  global.SlowlyStarArt = Object.freeze({
    MAX_COUNT, KADOKADO_COVER, normalize, splitCharacters, generateSVG, outputSize, downloadSVG, downloadPNG, downloadKadokadoCover, makeUrl
  });
})(window);
