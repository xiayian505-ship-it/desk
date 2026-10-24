"use strict";

/* ================================================================
 * SVG 動畫轉檔室｜核心功能
 *
 * 這支只負責 SVG 載入、動畫影格擷取、圖片與影片匯出。
 * DOM 操作按鈕、文字、版面請到 svg_converter_style.js / .css。
 *
 * 重要：SVG <img> 每次繪製到 Canvas，可能永遠只取到第一幀。
 * 這裡改採「內嵌 SVG → 調整動畫時間 → 凍結當下屬性 → 靜態 SVG
 * → Canvas」的方式。這對常見 SMIL / CSS 動畫有效，但不聲稱
 * 能涵蓋所有 SVG 規格（例如 path morph 與複雜 script 動畫）。
 * ================================================================ */
(function (global) {
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const XML_NAMESPACE = "http://www.w3.org/1999/xlink";
  const MAX_SOURCE_LENGTH = 2_000_000;
  const MAX_ELEMENT_COUNT = 3500;
  const MAX_GIF_PIXEL_BYTES = 100 * 1024 * 1024;

  // 這些是可能被 CSS keyframes 或 SVG 動畫變更的視覺屬性。
  // 取「計算後」樣式才能避免把動畫的初始影格一直重複輸出。
  const VISUAL_PROPERTIES = [
    "opacity", "display", "visibility", "color", "fill", "fill-opacity",
    "fill-rule", "stroke", "stroke-width", "stroke-opacity", "stroke-dasharray",
    "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit",
    "paint-order", "vector-effect", "filter", "clip-path", "mask",
    "font-family", "font-size", "font-weight", "font-style", "letter-spacing",
    "text-anchor", "dominant-baseline", "mix-blend-mode", "isolation",
    "stop-color", "stop-opacity", "flood-color", "flood-opacity",
    "transform", "transform-origin", "transform-box"
  ];

  const DISALLOWED_ELEMENTS = new Set([
    "script", "foreignobject", "iframe", "object", "embed", "audio", "video"
  ]);

  let liveSVG = null;
  let fileBase = "svg_動畫";
  let sourceWidth = 200;
  let sourceHeight = 200;
  let containsAnimation = false;
  let activeExport = false;

  function nextFrame() {
    return new Promise(resolve => global.requestAnimationFrame(resolve));
  }

  function sleep(milliseconds) {
    return new Promise(resolve => global.setTimeout(resolve, milliseconds));
  }

  function parseDimension(raw) {
    if (!raw || /%|em|rem/i.test(raw)) return NaN;
    const number = Number.parseFloat(raw);
    return Number.isFinite(number) && number > 0 ? number : NaN;
  }

  function extractSize(root) {
    const viewBox = (root.getAttribute("viewBox") || "")
      .trim().split(/[\s,]+/).map(Number);
    let width = parseDimension(root.getAttribute("width"));
    let height = parseDimension(root.getAttribute("height"));

    if ((!width || !height) && viewBox.length === 4 &&
      Number.isFinite(viewBox[2]) && Number.isFinite(viewBox[3]) &&
      viewBox[2] > 0 && viewBox[3] > 0) {
      width = viewBox[2];
      height = viewBox[3];
    }
    if (!(width > 0 && height > 0)) {
      throw new Error("無法判定 SVG 尺寸，請指定正確的 viewBox 或 width／height。");
    }
    if (!root.hasAttribute("viewBox")) {
      root.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
    return { width, height };
  }

  function sanitizeSVG(document) {
    const root = document.documentElement;
    if (root.namespaceURI !== SVG_NAMESPACE || root.localName !== "svg") {
      throw new Error("請提供有效的 SVG 檔案，而不是 HTML 或其他內容。");
    }
    const nodes = Array.from(root.querySelectorAll("*"));
    if (nodes.length > MAX_ELEMENT_COUNT) {
      throw new Error("SVG 元素太多，超過此工具的安全處理上限。");
    }

    // 不執行來源 SVG 的指令碼，也不容許網路外部影像／樣式。
    // 這不是通用 SVG 清洗器；只允許供本地畫面轉檔的受限 SVG。
    for (const element of [root, ...nodes]) {
      if (DISALLOWED_ELEMENTS.has(element.localName.toLowerCase()) ||
        element.namespaceURI !== SVG_NAMESPACE) {
        element.remove();
        continue;
      }
      for (const attribute of Array.from(element.attributes)) {
        const name = attribute.name.toLowerCase();
        const value = attribute.value.trim();
        if (name.startsWith("on")) {
          element.removeAttributeNode(attribute);
          continue;
        }
        if (name === "href" || name === "xlink:href") {
          if (!value.startsWith("#") && !/^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(value)) {
            element.removeAttributeNode(attribute);
          }
        }
        if ((name === "style" || name === "filter" || name === "fill" ||
             name === "stroke" || name === "clip-path" || name === "mask") &&
            /url\(\s*['"]?(?:https?:|\/\/|file:|javascript:)/i.test(value)) {
          element.removeAttributeNode(attribute);
        }
      }
      if (element.localName.toLowerCase() === "style") {
        const css = element.textContent;
        if (/@import\b|@font-face\s*\{[^}]*url\(|url\(\s*['"]?(?:https?:|\/\/|file:|javascript:)/i.test(css)) {
          element.remove();
        }
      }
    }
  }

  function loadedAnimationsExist(root) {
    return root.querySelector("animate, animateTransform, animateMotion, animateColor, set") !== null ||
      Array.from(root.querySelectorAll("style")).some(element => /@keyframes|animation\s*:/i.test(element.textContent)) ||
      root.querySelector("[style*='animation-'], [style*='animation:']") !== null;
  }

  function sanitizeName(input) {
    const stem = String(input || "svg_動畫").replace(/\.svg$/i, "");
    if (global.FilenameSanitize?.sanitize) {
      return global.FilenameSanitize.sanitize(stem, { fallback: "svg_動畫", maxLength: 55 });
    }
    return stem.replace(/[\\/:*?"<>|]/g, "_").trim() || "svg_動畫";
  }

  async function load(svgString, filename = "svg_動畫.svg") {
    if (activeExport) throw new Error("正在轉檔，請等完成後再載入。");
    const input = String(svgString ?? "");
    if (!input.trim() || input.length > MAX_SOURCE_LENGTH) {
      throw new Error("請提供非空白、大小不超過 2 MB 的 SVG 原始碼。");
    }
    const parsed = new DOMParser().parseFromString(input, "image/svg+xml");
    if (parsed.querySelector("parsererror")) {
      throw new Error("SVG XML 格式有誤，請檢查標籤與特殊字元。");
    }
    sanitizeSVG(parsed);
    const size = extractSize(parsed.documentElement);
    const host = document.getElementById("svg-preview");
    const root = document.importNode(parsed.documentElement, true);
    root.setAttribute("width", String(size.width));
    root.setAttribute("height", String(size.height));
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", "動畫 SVG 預覽");
    host.replaceChildren(root);

    liveSVG = root;
    sourceWidth = size.width;
    sourceHeight = size.height;
    containsAnimation = loadedAnimationsExist(root);
    fileBase = sanitizeName(filename);

    await nextFrame();
    replay();
    return getInfo();
  }

  function replay() {
    if (!liveSVG) return;
    try {
      if (typeof liveSVG.setCurrentTime === "function") {
        liveSVG.setCurrentTime(0);
        liveSVG.unpauseAnimations?.();
      }
      for (const animation of liveSVG.getAnimations?.({ subtree: true }) || []) {
        // cancel() 會把 CSS 動畫取消掉，某些瀏覽器不會重新建立。
        // 調回起點再播放，保留 CSS 原本的動畫效果。
        if (animation.playState !== "idle") {
          animation.currentTime = 0;
          animation.play();
        }
      }
    } catch (error) {
      console.warn("SVG 預覽動畫重啟時遇到限制：", error);
    }
  }

  function getInfo() {
    if (!liveSVG) return null;
    return {
      width: sourceWidth,
      height: sourceHeight,
      animated: containsAnimation,
      filename: fileBase
    };
  }

  function getSize(width) {
    const numericWidth = Number(width);
    if (!Number.isFinite(numericWidth) || numericWidth < 160 || numericWidth > 1400) {
      throw new Error("輸出寬度必須在 160～1400px 之間。");
    }
    const outWidth = Math.round(numericWidth / 2) * 2;
    const outHeight = Math.max(2, Math.round((outWidth * sourceHeight / sourceWidth) / 2) * 2);
    if (outHeight > 2500) {
      throw new Error("依原始比例換算後，高度超過 2500px；請降低輸出寬度。");
    }
    return { width: outWidth, height: outHeight };
  }

  function normalizeSettings(settings) {
    if (!liveSVG) throw new Error("請先載入 SVG。");
    const dimension = getSize(settings.width);
    const duration = Number(settings.duration);
    const fps = Number(settings.fps);
    const stillTime = Number(settings.stillTime || 0);
    if (!Number.isFinite(duration) || duration < 1 || duration > 15) {
      throw new Error("動畫秒數必須在 1～15 秒。");
    }
    if (!Number.isInteger(fps) || fps < 4 || fps > 24) {
      throw new Error("影格率必須在 4～24 fps。");
    }
    if (!Number.isFinite(stillTime) || stillTime < 0 || stillTime > 15) {
      throw new Error("PNG 擷取時間必須在 0～15 秒。");
    }
    return {
      ...dimension, duration, fps, stillTime,
      transparent: !!settings.transparent,
      background: /^#[0-9a-fA-F]{6}$/.test(settings.background) ? settings.background : "#ffffff"
    };
  }

  function getSMILTarget(animation) {
    const reference = animation.getAttribute("href") ||
      animation.getAttributeNS(XML_NAMESPACE, "href");
    if (reference?.startsWith("#")) {
      try { return liveSVG.querySelector(`#${CSS.escape(reference.slice(1))}`); }
      catch { return null; }
    }
    return animation.parentElement;
  }

  function matrixString(matrix) {
    return `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`;
  }

  function animatedValue(source, attribute) {
    const normalized = attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (attribute === "transform" || attribute === "gradientTransform" || attribute === "patternTransform") {
      const list = source[normalized]?.animVal;
      if (list && Number.isInteger(list.numberOfItems)) {
        // animVal 是唯讀清單，不能使用 consolidate()（會嘗試修改清單）。
        // 逐一相乘保留當前變形順序，避免 ReadOnly DOMException。
        let combined = new DOMMatrix();
        for (let index = 0; index < list.numberOfItems; index++) {
          combined = combined.multiply(list.getItem(index).matrix);
        }
        return matrixString(combined);
      }
    }
    if (attribute === "points" && source.animatedPoints) {
      return Array.from({ length: source.animatedPoints.numberOfItems }, (_, index) => {
        const point = source.animatedPoints.getItem(index);
        return `${point.x},${point.y}`;
      }).join(" ");
    }
    const value = source[normalized]?.animVal;
    if (typeof value === "number" || typeof value === "string") return String(value);
    if (value && typeof value.value === "number") return String(value.value);
    if (value && typeof value.value === "string") return value.value;
    return null;
  }

  function normalizeURLReference(value) {
    // CSS getComputedStyle 可能把 url(#mask) 展開成完整頁面網址。
    // 儲存成自足 SVG 時，必須恢復原本的片段引用。
    return String(value).replace(/url\(\s*['"]?([^)'"\s]+)#([^)'"\s]+)['"]?\s*\)/g,
      (match, base, id) => base === location.href.split("#")[0] ? `url(#${id})` : match);
  }

  function freezeCurrentFrame() {
    const clone = liveSVG.cloneNode(true);
    const originals = [liveSVG, ...liveSVG.querySelectorAll("*")];
    const replicas = [clone, ...clone.querySelectorAll("*")];
    const mapping = new Map(originals.map((node, index) => [node, replicas[index]]));

    for (let index = 0; index < originals.length; index++) {
      const source = originals[index];
      const target = replicas[index];
      if (!source || !target || ["animate", "animateTransform", "animateMotion", "set"].includes(source.localName)) {
        continue;
      }
      const computed = getComputedStyle(source);
      for (const property of VISUAL_PROPERTIES) {
        const value = computed.getPropertyValue(property);
        if (value && value !== "normal" && value !== "initial") {
          target.style.setProperty(property, normalizeURLReference(value), "important");
        }
      }
      // CSS 動畫不能在存檔後自行重播，否則會重回起始影格。
      target.style.setProperty("animation", "none", "important");
      target.style.setProperty("transition", "none", "important");
    }

    // 動畫屬性對應 DOM 的 animVal；這一步會真正將當下幀寫回 SVG。
    for (const animation of liveSVG.querySelectorAll("animate, animateTransform, set")) {
      const attribute = animation.getAttribute("attributeName") ||
        (animation.localName === "animateTransform" ? "transform" : "");
      if (!attribute) continue;
      const source = getSMILTarget(animation);
      const target = mapping.get(source);
      if (!target) continue;
      let value = animatedValue(source, attribute);
      if (value === null) {
        const computedValue = getComputedStyle(source).getPropertyValue(attribute);
        if (computedValue) value = computedValue;
      }
      if (value !== null) {
        target.setAttribute(attribute, normalizeURLReference(value));
        if (VISUAL_PROPERTIES.includes(attribute)) {
          target.style.setProperty(attribute, normalizeURLReference(value), "important");
        }
      }
    }
    for (const element of Array.from(clone.querySelectorAll("animate, animateTransform, animateMotion, animateColor, set"))) {
      element.remove();
    }
    clone.removeAttribute("role");
    clone.removeAttribute("aria-label");
    clone.setAttribute("xmlns", SVG_NAMESPACE);
    clone.setAttribute("width", String(sourceWidth));
    clone.setAttribute("height", String(sourceHeight));
    return new XMLSerializer().serializeToString(clone);
  }

  function prepareTimeline() {
    liveSVG.pauseAnimations?.();
    const cssAnimations = liveSVG.getAnimations?.({ subtree: true }) || [];
    for (const animation of cssAnimations) animation.pause();
    return cssAnimations;
  }

  function seek(timeSeconds, cssAnimations) {
    liveSVG.setCurrentTime?.(Math.max(0, timeSeconds));
    for (const animation of cssAnimations) {
      try { animation.currentTime = Math.max(0, timeSeconds) * 1000; }
      catch (error) { console.warn("無法設定 CSS 動畫時間", error); }
    }
  }

  async function imageFromSVG(svgText) {
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = global.SlowlyBlobURL?.create(blob) || URL.createObjectURL(blob);
    try {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("此 SVG 畫格無法載入 Canvas；請檢查外部圖片、字型或濾鏡。"));
        image.src = url;
      });
      return image;
    } finally {
      if (global.SlowlyBlobURL?.revoke) global.SlowlyBlobURL.revoke(url);
      else URL.revokeObjectURL(url);
    }
  }

  async function drawFrame(canvas, context, seconds, config, cssAnimations, solid) {
    seek(seconds, cssAnimations);
    // SVG 動畫時間被更新後，讓瀏覽器至少完成一次樣式計算。
    // getComputedStyle 會同步強制整理樣式，避免連續複製到相同影格。
    const snapshot = freezeCurrentFrame();
    const image = await imageFromSVG(snapshot);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (solid || !config.transparent) {
      context.fillStyle = config.background;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  function createCanvas(config) {
    const canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    const context = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    if (!context) throw new Error("此瀏覽器無法建立 Canvas 2D 繪圖環境。");
    return { canvas, context };
  }

  function saveBlob(blob, filename) {
    const url = global.SlowlyBlobURL?.create(blob) || URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    global.setTimeout(() => {
      if (global.SlowlyBlobURL?.revoke) global.SlowlyBlobURL.revoke(url);
      else URL.revokeObjectURL(url);
    }, 30000);
    return filename;
  }

  async function withinExport(task) {
    if (activeExport) throw new Error("已有轉檔工作正在執行。");
    activeExport = true;
    const animations = prepareTimeline();
    try { return await task(animations); }
    finally {
      for (const animation of animations) {
        try { animation.play(); }
        catch { /* 當原始動畫已結束時，無法強制恢復。 */ }
      }
      liveSVG.unpauseAnimations?.();
      activeExport = false;
      replay();
    }
  }

  function isSameFrame(first, next) {
    if (!first || first.length !== next.length) return false;
    // 允許同一幀內的圖像編碼/取樣誤差，但單個像素的 RGBA 必須相同。
    for (let index = 0; index < first.length; index += 64) {
      if (first[index] !== next[index] || first[index + 1] !== next[index + 1] ||
          first[index + 2] !== next[index + 2] || first[index + 3] !== next[index + 3]) {
        return false;
      }
    }
    return true;
  }

  function gifFrameLimit(config) {
    if (config.width > 640) {
      throw new Error("GIF 最大寬度為 640px，請降低輸出寬度後再試。");
    }
    const count = Math.max(1, Math.ceil(config.duration * config.fps));
    if (config.width * config.height * 4 * count > MAX_GIF_PIXEL_BYTES) {
      throw new Error("GIF 所需的影格記憶體過大，請降低尺寸、秒數或 fps。");
    }
    return count;
  }

  async function exportPNG(settings, updateProgress = () => {}) {
    if (!global.SlowlyCanvasPNG?.toBlob || !global.SlowlyPNGDownload?.fromBlob) {
      throw new Error("PNG 軍火庫零件尚未載入，請確認網路是否正常。");
    }
    const config = normalizeSettings(settings);
    return withinExport(async animations => {
      const { canvas, context } = createCanvas(config);
      await drawFrame(canvas, context, config.stillTime, config, animations, false);
      updateProgress(0.9);
      const blob = await global.SlowlyCanvasPNG.toBlob(canvas);
      if (!blob.size) throw new Error("PNG 輸出檔案為空。");
      const filename = `${fileBase}_${config.transparent ? "透明" : "實色"}_${config.width}x${config.height}.png`;
      global.SlowlyPNGDownload.fromBlob(blob, filename);
      updateProgress(1);
      canvas.width = canvas.height = 0;
      return { filename, bytes: blob.size };
    });
  }

  function normalizeIcoSizes(rawSizes) {
    if (!Array.isArray(rawSizes) || rawSizes.length === 0) {
      throw new Error("請至少勾選一個 ICO 尺寸。");
    }

    const validSizes = new Set([16, 24, 32, 48, 64, 128, 256]);
    const uniqueSizes = [];

    for (const value of rawSizes) {
      const size = Number(value);
      if (!Number.isInteger(size) || !validSizes.has(size)) {
        throw new Error("ICO 尺寸只支援 16、24、32、48、64、128、256。");
      }
      if (!uniqueSizes.includes(size)) {
        uniqueSizes.push(size);
      }
    }

    return uniqueSizes.sort((left, right) => left - right);
  }

  async function exportICO(settings, updateProgress = () => {}) {
    if (!global.SlowlyCanvasPNG?.toBlob) {
      throw new Error("PNG 軍火庫零件尚未載入，請確認網路是否正常。");
    }
    if (!global.SlowlyICOEncoder?.encode) {
      throw new Error("ICO Encoder 軍火庫零件尚未載入，請確認網路是否正常。");
    }

    const config = normalizeSettings(settings);
    const iconSizes = normalizeIcoSizes(settings.icoSizes);

    return withinExport(async animations => {
      const pngEntries = [];

      for (let index = 0; index < iconSizes.length; index++) {
        const size = iconSizes[index];
        const iconConfig = {
          ...config,
          width: size,
          height: size
        };
        const { canvas, context } = createCanvas(iconConfig);
        seek(config.stillTime, animations);
        const snapshot = freezeCurrentFrame();
        const image = await imageFromSVG(snapshot);
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (!config.transparent) {
          context.fillStyle = config.background;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        const scale = Math.min(size / sourceWidth, size / sourceHeight);
        const drawWidth = sourceWidth * scale;
        const drawHeight = sourceHeight * scale;
        const drawX = (size - drawWidth) / 2;
        const drawY = (size - drawHeight) / 2;
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        const pngBlob = await global.SlowlyCanvasPNG.toBlob(canvas);
        if (!pngBlob.size) {
          throw new Error(`ICO 尺寸 ${size}×${size} 的 PNG 輸出檔案為空。`);
        }
        const pngData = new Uint8Array(await pngBlob.arrayBuffer());
        pngEntries.push({ size, data: pngData });
        canvas.width = canvas.height = 0;
        updateProgress((index + 1) / Math.max(1, iconSizes.length));
        await sleep(0);
      }

      const blob = global.SlowlyICOEncoder.encode(pngEntries);
      if (!blob.size) {
        throw new Error("ICO 輸出檔案為空。");
      }
      const filename = `${fileBase}_${config.transparent ? "透明" : "實色"}_${iconSizes.join('-')}.ico`;
      saveBlob(blob, filename);
      updateProgress(1);
      return { filename, bytes: blob.size };
    });
  }

  async function exportGIF(settings, updateProgress = () => {}) {
    if (!global.SlowlySVGConverterGIF?.encode) {
      throw new Error("找不到本專案的 GIF 編碼器。");
    }
    const config = normalizeSettings(settings);
    const count = gifFrameLimit(config);
    return withinExport(async animations => {
      const { canvas, context } = createCanvas(config);
      const frames = [];
      let first = null;
      let motionDetected = false;

      for (let index = 0; index < count; index++) {
        await drawFrame(canvas, context, index / config.fps, config, animations, false);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const frame = new Uint8ClampedArray(pixels);
        if (!first) first = frame;
        else if (!isSameFrame(first, frame)) motionDetected = true;
        frames.push(frame);
        updateProgress(0.65 * (index + 1) / count);
        if (index % 3 === 0) await sleep(0);
      }
      if (containsAnimation && !motionDetected) {
        throw new Error("SVG 包含動畫，但取得的 GIF 影格沒有變化；已停止以避免下載假動畫。");
      }
      const blob = await global.SlowlySVGConverterGIF.encode({
        frames, width: config.width, height: config.height,
        fps: config.fps, transparent: config.transparent,
        onProgress: ratio => updateProgress(0.65 + 0.35 * ratio)
      });
      if (!blob.size) throw new Error("GIF 編碼結果為空。");
      const filename = `${fileBase}_${config.width}x${config.height}.gif`;
      saveBlob(blob, filename);
      canvas.width = canvas.height = 0;
      return { filename, bytes: blob.size };
    });
  }

  function getSupportedFormats() {
    const mime = global.SlowlyVideoRecorderMime;
    const available = mime?.choose;
    return {
      mp4: available ? mime.choose([
        "video/mp4;codecs=avc1.42E01E", "video/mp4;codecs=avc1", "video/mp4"
      ]) : null,
      webm: available ? mime.choose([
        "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"
      ]) : null
    };
  }

  async function exportVideo(format, settings, updateProgress = () => {}) {
    if (!["mp4", "webm"].includes(format)) throw new Error("未知的影片格式。");
    if (!global.SlowlyVideoMediaRecorder?.create || !global.SlowlyVideoRecordedChunks?.create) {
      throw new Error("影片錄製軍火庫零件尚未載入。");
    }
    const config = normalizeSettings(settings);
    const mimeType = getSupportedFormats()[format];
    if (!mimeType) throw new Error(`此瀏覽器無法直接錄製 ${format.toUpperCase()}，請試另一種格式。`);
    if (typeof HTMLCanvasElement.prototype.captureStream !== "function") {
      throw new Error("此瀏覽器不支援 Canvas.captureStream()。");
    }

    return withinExport(async animations => {
      const { canvas, context } = createCanvas(config);
      // 錄影之前先檢查三個時間點；避免寫出一個明明該動卻全程不動的影片。
      if (containsAnimation) {
        let first = null;
        let motionDetected = false;
        for (const ratio of [0.04, 0.33, 0.67, 0.86]) {
          await drawFrame(canvas, context, config.duration * ratio, config, animations, true);
          const current = context.getImageData(0, 0, canvas.width, canvas.height).data;
          if (!first) first = new Uint8ClampedArray(current);
          else if (!isSameFrame(first, current)) motionDetected = true;
        }
        if (!motionDetected) {
          throw new Error("預先擷取的影格沒有變化，已停止以避免輸出靜止影片。");
        }
      }

      await drawFrame(canvas, context, 0, config, animations, true);
      const stream = canvas.captureStream(config.fps);
      const recorder = global.SlowlyVideoMediaRecorder.create(stream, {
        mimeType,
        videoBitsPerSecond: 3_500_000
      });
      const chunks = global.SlowlyVideoRecordedChunks.create(mimeType.split(";")[0]);
      chunks.attach(recorder);
      const track = stream.getVideoTracks()[0];

      try {
        global.SlowlyVideoMediaRecorder.start(recorder, 250);
        const start = performance.now();
        let lastTime = -1;
        while ((performance.now() - start) < config.duration * 1000) {
          const elapsed = (performance.now() - start) / 1000;
          // 影片需要真實時間錄製；動態 SVG 時間則跟著錄影進度往前。
          if (elapsed - lastTime >= 1 / config.fps) {
            await drawFrame(canvas, context, Math.min(elapsed, config.duration), config, animations, true);
            track?.requestFrame?.();
            lastTime = elapsed;
            updateProgress(Math.min(0.97, elapsed / config.duration));
          }
          await sleep(Math.max(8, 1000 / config.fps / 4));
        }
        // 補上結尾畫格，讓編碼器有機會完成最後一個 GOP。
        await drawFrame(canvas, context, config.duration, config, animations, true);
        track?.requestFrame?.();
        await sleep(120);
        await global.SlowlyVideoMediaRecorder.stop(recorder);
        const blob = chunks.toBlob(mimeType.split(";")[0]);
        if (!blob.size) throw new Error("影片錄製結果為空白檔案。");
        const filename = `${fileBase}_${config.width}x${config.height}.${format}`;
        saveBlob(blob, filename);
        updateProgress(1);
        return { filename, bytes: blob.size };
      } finally {
        chunks.detach();
        if (recorder.state !== "inactive") {
          try { await global.SlowlyVideoMediaRecorder.stop(recorder); }
          catch (error) { console.warn("停止錄影時遇到問題：", error); }
        }
        stream.getTracks().forEach(mediaTrack => mediaTrack.stop());
        canvas.width = canvas.height = 0;
      }
    });
  }

  global.SlowlySVGConverter = Object.freeze({
    load,
    replay,
    getInfo,
    getSize,
    getSupportedFormats,
    exportPNG,
    exportICO,
    exportGIF,
    exportVideo
  });
})(window);
