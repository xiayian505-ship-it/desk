"use strict";
/* SVG 檢視室｜功能核心。
 * 本機 File API + SVG 安全圖片預覽，無網路傳輸、無持久儲存。
 * SVG 只放入 <img>，不放進 document、object、iframe 或 innerHTML。
 * 因此 SVG 內的 script 無法取得本頁權限，CSS/SMIL 原生動畫仍可播放。
 */
(function (global) {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const MAX_BYTES = 15 * 1024 * 1024;
  const XML_DECLARATION = /<!\s*(?:DOCTYPE|ENTITY)\b/i;
  const dimensions = { width: 840, height: 1200 };

  function numberLength(value) {
    if (!value) return null;
    const match = /^(\d+(?:\.\d+)?|\.\d+)(?:px)?$/i.exec(value.trim());
    if (!match) return null;
    const size = Number(match[1]);
    return Number.isFinite(size) && size > 0 ? size : null;
  }

  function readDimensions(svg) {
    const boxAttr = svg.getAttribute("viewBox") || "";
    const boxValues = boxAttr.trim().split(/[\s,]+/).map(Number);
    const validBox = boxValues.length === 4 && boxValues.every(Number.isFinite)
      && boxValues[2] > 0 && boxValues[3] > 0;
    const width = numberLength(svg.getAttribute("width"));
    const height = numberLength(svg.getAttribute("height"));
    const boxWidth = validBox ? boxValues[2] : null;
    const boxHeight = validBox ? boxValues[3] : null;

    const intrinsicWidth = width || boxWidth || dimensions.width;
    const intrinsicHeight = height || boxHeight || dimensions.height;
    return {
      width: intrinsicWidth,
      height: intrinsicHeight,
      sizeLabel: `${width ? width + " × " : ""}${height ? height : ""}${width && height ? "" : (width || height ? "（部分尺寸）" : "未設定（以 ViewBox 顯示）")}`,
      viewBox: validBox ? boxValues.join(" ") : "未設定"
    };
  }

  function animationInfo(root) {
    // 含 SMIL <animate>、<animateTransform>、CSS @keyframes 以及行內動畫。
    const descendants = root.getElementsByTagName("*");
    let hasSmil = false;
    let hasCss = false;

    for (const item of descendants) {
      const name = item.localName.toLowerCase();
      if (["animate", "animatemotion", "animatetransform", "set"].includes(name)) hasSmil = true;
      if (name === "style" && /@keyframes|\banimation(?:-name)?\s*:/i.test(item.textContent || "")) {
        hasCss = true;
      }
      if (/(?:^|;)\s*animation(?:-name)?\s*:/i.test(item.getAttribute("style") || "")) {
        hasCss = true;
      }
    }

    if (hasSmil && hasCss) return "偵測到 SVG＋CSS 動畫";
    if (hasSmil) return "偵測到 SVG 原生動畫";
    if (hasCss) return "偵測到 CSS 動畫";
    return "未偵測到動畫標記";
  }

  function verifySVG(fileName, text) {
    if (XML_DECLARATION.test(text)) {
      throw new Error("為安全起見，不支援含 DOCTYPE／ENTITY 宣告的 SVG。");
    }
    const xml = new DOMParser().parseFromString(text, "image/svg+xml");
    const root = xml.documentElement;
    if (xml.querySelector("parsererror") || root.localName !== "svg" || root.namespaceURI !== SVG_NS) {
      throw new Error("這不是有效的 SVG 圖片，請選擇 .svg 檔案。");
    }
    if (Array.from(root.getElementsByTagName("*")).some(element => element.localName.toLowerCase() === "script")) {
      throw new Error("這份 SVG 含有 script。檢視室僅支援不用腳本執行的 SVG 與原生動畫。");
    }
    return {
      name: fileName,
      ...readDimensions(root),
      animation: animationInfo(root)
    };
  }

  function makeViewer({ image, stage, viewport, onState }) {
    let objectUrl = null;
    let info = null;
    let zoom = 1;
    let ticket = 0;
    let resizeObserver = null;

    function emit(message = "", isError = false) {
      onState({ info, message, isError });
    }

    function release() {
      image.removeAttribute("src");
      image.hidden = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    }

    function updateSize() {
      if (!info) {
        stage.style.width = "";
        stage.style.height = "";
        return;
      }
      const availableW = Math.max(150, viewport.clientWidth - 44);
      const availableH = Math.max(160, viewport.clientHeight - 44);
      const fit = Math.min(availableW / info.width, availableH / info.height);
      const factor = fit * zoom;
      const width = Math.min(14000, Math.max(1, Math.round(info.width * factor)));
      const height = Math.min(14000, Math.max(1, Math.round(info.height * factor)));
      image.style.width = `${width}px`;
      image.style.height = `${height}px`;
      stage.style.width = width + 44 > viewport.clientWidth ? `${width + 44}px` : "100%";
      stage.style.height = height + 44 > viewport.clientHeight ? `${height + 44}px` : "100%";
    }

    function clear() {
      ticket += 1;
      release();
      info = null;
      zoom = 1;
      image.style.width = "";
      image.style.height = "";
      updateSize();
      emit("選擇 SVG 後即可檢視。重新整理頁面也會清空。", false);
    }

    async function openFile(file) {
      const currentTicket = ++ticket;
      release();
      info = null;
      emit("正在讀取 SVG……");
      updateSize();
      try {
        if (!file) throw new Error("請先選擇 SVG 檔案。");
        if (!/\.svg$/i.test(file.name) && file.type !== "image/svg+xml") {
          throw new Error("只支援 SVG 檔案，不支援其他圖片或文件。");
        }
        if (file.size > MAX_BYTES) throw new Error("檔案超過 15 MB，請選擇較小的 SVG。");
        if (file.size === 0) throw new Error("檔案是空的。");

        const text = await file.text();
        if (currentTicket !== ticket) return;
        const detail = verifySVG(file.name, text);
        const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
        if (currentTicket !== ticket) {
          URL.revokeObjectURL(url);
          return;
        }
        info = { ...detail, bytes: file.size };
        objectUrl = url;
        zoom = 1;
        image.alt = `${file.name} 的 SVG 內容`;
        image.hidden = false;
        image.src = objectUrl;
        updateSize();
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;
        emit("已在本機載入；如果有原生 SVG 動畫，支援的瀏覽器會自動播放。", false);
      } catch (error) {
        if (currentTicket !== ticket) return;
        release();
        info = null;
        emit(error.message || "開啟 SVG 失敗。", true);
      }
    }

    function setZoom(next) {
      if (!info) return;
      const value = Number(next);
      if (![1, 2, 4, 8].includes(value)) return;
      zoom = value;
      updateSize();
    }

    image.addEventListener("error", () => {
      if (info) emit("SVG 已讀入，但瀏覽器無法顯示內容。請確認原始 SVG 是否依賴外部檔案或不支援的動畫。", true);
    });

    if (global.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(viewport);
    } else {
      global.addEventListener("resize", updateSize);
    }

    global.addEventListener("pagehide", release);
    return Object.freeze({ openFile, clear, setZoom });
  }

  global.SlowlySVGViewer = Object.freeze({ create: makeViewer });
})(window);
