"use strict";
/* 慢慢封面｜共用藝術字視覺範圍量測。
 * 不更改 word/ 生成器、不刪 SVG 內任何元素，也不修剪原始下載作品；
 * 只以瀏覽器實際渲染後的 alpha 範圍提供嵌入封面的 viewBox。
 * 外圍安全留白同時涵蓋文字、陰影、線條及可見裝飾。
 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  const MAX_SCAN_EDGE = 900;
  const ALPHA_THRESHOLD = 3;

  function readOriginalBox(markup) {
    const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
    const svg = parsed.documentElement;
    if (parsed.querySelector("parsererror") || svg?.localName !== "svg" || svg?.namespaceURI !== NS) {
      throw new Error("藝術字不是有效的 SVG");
    }
    const raw = (svg.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
    if (raw.length === 4 && raw.every(Number.isFinite) && raw[2] > 0 && raw[3] > 0) {
      return { x: raw[0], y: raw[1], width: raw[2], height: raw[3] };
    }
    const width = Number.parseFloat(svg.getAttribute("width") || "");
    const height = Number.parseFloat(svg.getAttribute("height") || "");
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new Error("藝術字 SVG 缺少有效 viewBox 或畫布尺寸");
    }
    return { x: 0, y: 0, width, height };
  }

  function measureBitmap(svg, width, height) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      let done = false;
      function finish(error, value) {
        if (done) return;
        done = true;
        image.onload = null;
        image.onerror = null;
        URL.revokeObjectURL(url);
        if (error) reject(error);
        else resolve(value);
      }
      image.onerror = () => finish(new Error("藝術字影像無法解碼，不能安全裁切"));
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d", { willReadFrequently: true });
          if (!context) throw new Error("無法取得藝術字畫素資訊");
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          const bytes = context.getImageData(0, 0, width, height).data;
          let minX = width, minY = height, maxX = -1, maxY = -1;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              if (bytes[(y * width + x) * 4 + 3] <= ALPHA_THRESHOLD) continue;
              minX = Math.min(minX, x); minY = Math.min(minY, y);
              maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
            }
          }
          finish(null, maxX < 0 ? null : { minX, minY, maxX, maxY });
        } catch (error) { finish(error); }
      };
      image.src = url;
    });
  }

  async function measure(svg) {
    const original = readOriginalBox(svg);
    const scale = Math.min(1, MAX_SCAN_EDGE / Math.max(original.width, original.height));
    const width = Math.max(1, Math.round(original.width * scale));
    const height = Math.max(1, Math.round(original.height * scale));
    // SVG 的原始 viewBox 可能不是從 0,0 開始。影像渲染採它原有的坐標映射。
    const alpha = await measureBitmap(svg, width, height);
    // 全透明或來源不可測時，不推測、也不裁成空白：維持原尺寸。
    if (!alpha) return { ...original, measured: false };
    const unitW = original.width / width;
    const unitH = original.height / height;
    const x0 = original.x + alpha.minX * unitW;
    const x1 = original.x + (alpha.maxX + 1) * unitW;
    const y0 = original.y + alpha.minY * unitH;
    const y1 = original.y + (alpha.maxY + 1) * unitH;
    const spanX = x1 - x0, spanY = y1 - y0;
    // 透明像素門檻可能忽略極淡的光暈，額外留 7% + 至少 8 原始像素安全邊。
    const padX = Math.max(spanX * 0.07, 8 * unitW);
    const padY = Math.max(spanY * 0.07, 8 * unitH);
    const left = Math.max(original.x, x0 - padX);
    const top = Math.max(original.y, y0 - padY);
    const right = Math.min(original.x + original.width, x1 + padX);
    const bottom = Math.min(original.y + original.height, y1 + padY);
    return { x: left, y: top, width: right - left, height: bottom - top, measured: true };
  }

  global.SlowlyCoverWordFit = Object.freeze({ measure, readOriginalBox });
})(window);
