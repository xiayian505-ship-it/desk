"use strict";
/*
 * 電閃雷鳴｜獨立動態 SVG 輸出
 *
 * 不改動既有的直／橫式 SVG 模板，直接為宿主生成的完整 SVG
 * 增加原生 SVG <animate> 節點。下載仍由軍火庫的文字產生器負責。
 * 動畫本身不依賴本站 CSS、外部 JS 或網路資源。
 */
(function (global) {
  const library = global.SlowlyTextGenerator;
  const vertical = global.SlowlyThunderArt;
  const horizontal = global.SlowlyThunderHorizontalArt;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const DURATION = "5.6s";
  const TIMES = "0;0.17;0.20;0.23;0.44;0.52;0.55;0.58;0.79;1";

  if (!library?.create || !vertical?.generateSVG) {
    console.error("動態雷電 SVG：缺少軍火庫文字產生器或 Thunder 直式模板。");
    return;
  }

  /**
   * 為現成 SVG 群組加入原生 SMIL 透明度動畫；
   * 除了動畫節點，不變動文字、圖層、SVG 尺寸與背景。
   */
  function animateOpacity(document, group, values) {
    if (!group) {
      throw new Error("動態雷電 SVG：缺少需要的雷電圖層。");
    }

    const animation = document.createElementNS(SVG_NS, "animate");
    animation.setAttribute("attributeName", "opacity");
    animation.setAttribute("values", values);
    animation.setAttribute("keyTimes", TIMES);
    animation.setAttribute("dur", DURATION);
    animation.setAttribute("repeatCount", "indefinite");
    animation.setAttribute("calcMode", "linear");
    group.appendChild(animation);
  }

  function addMotion(source, orientation) {
    const document = new DOMParser().parseFromString(source, "image/svg+xml");
    if (document.querySelector("parsererror")) {
      throw new Error("原始 SVG 格式有誤，無法加入動畫。");
    }

    const svg = document.documentElement;
    if (svg.namespaceURI !== SVG_NS || svg.localName !== "svg") {
      throw new Error("原始檔不是合法的 SVG。");
    }

    if (orientation === "vertical") {
      animateOpacity(document, document.getElementById("arc-haze"),
        "0.48;0.48;0.98;0.53;0.50;0.48;0.94;0.51;0.48;0.48");
      animateOpacity(document, document.getElementById("rear-lightning"),
        "0.58;0.58;1;0.64;0.63;0.61;1;0.62;0.58;0.58");
      animateOpacity(document, document.getElementById("glyph-glare"),
        "0.35;0.36;0.97;0.44;0.38;0.38;0.93;0.41;0.35;0.35");
      animateOpacity(document, document.getElementById("front-lightning"),
        "0.60;0.61;1;0.72;0.63;0.61;1;0.68;0.60;0.60");
      animateOpacity(document, document.getElementById("sparks"),
        "0.42;0.42;0.92;0.56;0.45;0.43;0.85;0.53;0.42;0.42");
    } else if (orientation === "horizontal") {
      // 橫式 SVG 的六個頂層裝飾群組由 thunder_horizontal.js 產生。
      // 只為光影增加動畫，中央實心文字群組維持穩定，方便閱讀。
      const groups = Array.from(svg.children).filter(child => child.localName === "g");
      if (groups.length !== 6) {
        throw new Error("橫式雷電 SVG 圖層結構已改變，需要同步更新動畫。");
      }

      animateOpacity(document, groups[0],
        "0.18;0.18;0.52;0.22;0.19;0.18;0.48;0.23;0.18;0.18");
      animateOpacity(document, groups[1],
        "0.56;0.57;1;0.69;0.58;0.57;0.97;0.64;0.56;0.56");
      animateOpacity(document, groups[2],
        "0.40;0.40;0.90;0.48;0.40;0.40;0.88;0.47;0.40;0.40");
      animateOpacity(document, groups[3],
        "0.28;0.29;0.86;0.37;0.30;0.29;0.82;0.36;0.28;0.28");
      animateOpacity(document, groups[5],
        "0.58;0.59;1;0.65;0.58;0.58;0.98;0.62;0.58;0.58");
    } else {
      throw new Error("不支援的雷電排列方式。");
    }

    const description = svg.querySelector("desc");
    if (description) {
      description.textContent += " 這是 5.6 秒循環的原生動態 SVG，包含電弧及光暈閃爍。";
    }
    return new XMLSerializer().serializeToString(document);
  }

  function makeGenerator(art, orientation, size) {
    if (!art?.generateSVG) return null;
    return library.create({
      maxChars: 4,
      sourceSize: size,
      renderSVG(text) {
        return addMotion(art.generateSVG(text), orientation);
      },
      filenames: {
        svg: text => `${library.fileSafe(text)}_雷電_${orientation === "vertical" ? "直式" : "橫式"}_動態.svg`
      }
    });
  }

  const verticalGenerator = makeGenerator(vertical, "vertical", { width: 840, height: 1200 });
  const horizontalGenerator = makeGenerator(horizontal, "horizontal", { width: 1200, height: 760 });

  function getGenerator(orientation) {
    if (orientation === "vertical") return verticalGenerator;
    if (orientation === "horizontal" && horizontalGenerator) return horizontalGenerator;
    throw new Error("找不到所選排列的動態 SVG 產生器。");
  }

  global.SlowlyThunderAnimatedArt = Object.freeze({
    generateSVG(text, orientation = "vertical") {
      return getGenerator(orientation).generateSVG(text);
    },
    downloadSVG(text, orientation = "vertical") {
      return getGenerator(orientation).downloadSVG(text);
    }
  });
})(window);
