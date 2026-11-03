"use strict";
/* 慢慢封面｜共用藝術字內容適配
 * 藝術字 SVG 與其生成器不變；嵌入封面時，依「實際繪製內容」與
 * 「可辨識的主文字」兩種視覺範圍，針對槽位比例選擇合適的 viewBox。
 * 不做每款專屬的縮放表，也不依賴 DOM 截圖或 OCR。
 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  const MAX_SCAN_EDGE = 900;
  const ALPHA_THRESHOLD = 3;
  // 主文字的字框不包含陰影、描邊和近旁裝飾，故保留足夠的四周邊距。
  const TEXT_PADDING = 0.19;
  const CORE_GAIN_THRESHOLD = 1.24;

  function parseSVG(markup) {
    const parsed = new DOMParser().parseFromString(markup, "image/svg+xml");
    const svg = parsed.documentElement;
    if (parsed.querySelector("parsererror") || svg?.localName !== "svg" || svg?.namespaceURI !== NS) {
      throw new Error("藝術字不是有效的 SVG");
    }
    return svg;
  }
  function readOriginalBox(markup) {
    const svg = parseSVG(markup);
    const raw = (svg.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
    if (raw.length === 4 && raw.every(Number.isFinite) && raw[2] > 0 && raw[3] > 0) {
      return { x: raw[0], y: raw[1], width: raw[2], height: raw[3] };
    }
    const width = Number.parseFloat(svg.getAttribute("width") || "");
    const height = Number.parseFloat(svg.getAttribute("height") || "");
    if (![width,height].every(Number.isFinite) || width <= 0 || height <= 0) {
      throw new Error("藝術字 SVG 缺少有效 viewBox 或畫布尺寸");
    }
    return { x: 0, y: 0, width, height };
  }
  function valid(box) {
    return box && [box.x, box.y, box.width, box.height].every(Number.isFinite) && box.width > 0 && box.height > 0;
  }
  function clamp(box, original) {
    const x0 = Math.max(original.x, box.x);
    const y0 = Math.max(original.y, box.y);
    const x1 = Math.min(original.x + original.width, box.x + box.width);
    const y1 = Math.min(original.y + original.height, box.y + box.height);
    const result = { x: x0, y: y0, width: x1-x0, height: y1-y0 };
    return valid(result) ? result : original;
  }

  function measureBitmap(markup, width, height) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      let finished = false;
      function complete(error, result) {
        if (finished) return;
        finished = true;
        image.onload = image.onerror = null;
        URL.revokeObjectURL(url);
        if (error) reject(error); else resolve(result);
      }
      image.onerror = () => complete(new Error("藝術字影像無法解碼，不能安全量測"));
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) throw new Error("無法取得藝術字畫素資訊");
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, width, height);
          const data = ctx.getImageData(0, 0, width, height).data;
          let minX = width, minY = height, maxX = -1, maxY = -1;
          for (let y=0; y<height; y++) {
            for (let x=0; x<width; x++) {
              if (data[(y*width+x)*4+3] <= ALPHA_THRESHOLD) continue;
              if (x<minX) minX=x;
              if (x>maxX) maxX=x;
              if (y<minY) minY=y;
              if (y>maxY) maxY=y;
            }
          }
          complete(null, maxX<0 ? null : {minX,minY,maxX,maxY});
        } catch (error) { complete(error); }
      };
      image.src = url;
    });
  }

  async function visualBounds(markup, original) {
    const scale = Math.min(1, MAX_SCAN_EDGE / Math.max(original.width, original.height));
    const width = Math.max(1,Math.round(original.width*scale));
    const height = Math.max(1,Math.round(original.height*scale));
    const alpha = await measureBitmap(markup,width,height);
    if (!alpha) return null;
    const ux = original.width / width, uy = original.height / height;
    const minX = original.x + alpha.minX*ux;
    const minY = original.y + alpha.minY*uy;
    const maxX = original.x + (alpha.maxX+1)*ux;
    const maxY = original.y + (alpha.maxY+1)*uy;
    const dx = Math.max((maxX-minX)*0.07, 8*ux);
    const dy = Math.max((maxY-minY)*0.07, 8*uy);
    return clamp({x:minX-dx,y:minY-dy,width:maxX-minX+2*dx,height:maxY-minY+2*dy},original);
  }

  // 取得「文字本體」幾何，不把四散的星圖、刻度線、裝飾條視為字框。
  // 只有輸出的 SVG 真正以 <text> 表達輸入字時才用這條路徑；純路徑字型安全回退。
  function textBounds(markup, text, original) {
    const glyphs = Array.from(String(text || "").trim());
    if (!glyphs.length) return null;
    const svg = parseSVG(markup);
    const holder = document.createElement("div");
    holder.setAttribute("aria-hidden", "true");
    holder.style.cssText = "position:fixed;left:-20000px;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;opacity:0";
    // DOM 量測不載入 SVG 內的 script / foreignObject / 外站圖片。
    for (const el of [...svg.querySelectorAll("script, foreignObject, image")]) el.remove();
    // 自身座標系統維持 SVG 原本 viewBox，避免 CSS 尺寸改變 getScreenCTM。
    svg.setAttribute("width",String(original.width));
    svg.setAttribute("height",String(original.height));
    svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
    holder.appendChild(document.importNode(svg,true));
    document.body.appendChild(holder);
    try {
      const live = holder.querySelector("svg");
      const rootCTM = live.getScreenCTM();
      if (!rootCTM) return null;
      const inverse = rootCTM.inverse();
      const letters = new Set(glyphs);
      const all = [];
      const ids = new Map([...live.querySelectorAll("[id]")].map(e=>[e.id,e]));
      const isMain = (value) => value === glyphs.join("") || (value.length===1 && letters.has(value));
      function record(node, value) {
        if (!isMain(value)) return;
        try {
          const bbox = node.getBBox();
          const ctm = node.getScreenCTM();
          if (!ctm || !bbox.width || !bbox.height) return;
          const m = inverse.multiply(ctm);
          const pts = [
            [bbox.x,bbox.y], [bbox.x+bbox.width,bbox.y],
            [bbox.x,bbox.y+bbox.height], [bbox.x+bbox.width,bbox.y+bbox.height]
          ].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
          const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
          const rectangle = {x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
          if (valid(rectangle)) all.push({ value, rectangle, size:rectangle.width*rectangle.height });
        } catch { /* 不支援量測此節點時，保留安全回退。 */ }
      }
      for (const node of live.querySelectorAll("text")) {
        if (node.closest("defs,clipPath,mask,pattern,symbol")) continue;
        record(node,node.textContent.replace(/\s+/g, "").trim());
      }
      // 有些藝術字將字形定義成 <defs><text id="…"/>，實際透過 <use> 多層描邊。
      // 量測「可見的 use 實例」，不把 defs 裡未出現在畫面的原始字形算進來。
      for (const node of live.querySelectorAll("use")) {
        if (node.closest("defs,clipPath,mask,pattern,symbol")) continue;
        const href=node.getAttribute("href") || node.getAttributeNS("http://www.w3.org/1999/xlink","href") || "";
        if (!href.startsWith("#")) continue;
        const source=ids.get(href.slice(1));
        if (!source) continue;
        const texts=source.localName==="text"?[source]:[...source.querySelectorAll("text")];
        if (!texts.length) continue;
        const value=texts.map(t=>t.textContent).join("").replace(/\s+/g, "").trim();
        record(node,value);
      }
      if (!all.length) return null;
      const biggest=Math.max(...all.map(p=>p.size));
      const survivors=all.filter(p=>p.size >= biggest * .18);
      const represented=new Set(survivors.flatMap(p=>Array.from(p.value)));
      const unique=new Set(glyphs);
      if ([...unique].some(g=>!represented.has(g))) return null;
      let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
      for (const p of survivors) {
        left=Math.min(left,p.rectangle.x);top=Math.min(top,p.rectangle.y);
        right=Math.max(right,p.rectangle.x+p.rectangle.width);
        bottom=Math.max(bottom,p.rectangle.y+p.rectangle.height);
      }
      const w=right-left,h=bottom-top;
      if (!(w>0 && h>0)) return null;
      // 主字框比獨立筆畫大約多留 19%，用來容納陰影、外發光及近旁特效。
      const px = Math.max(w*TEXT_PADDING,original.width*.018);
      const py = Math.max(h*TEXT_PADDING,original.height*.018);
      const padded = clamp({x:left-px,y:top-py,width:w+2*px,height:h+2*py},original);
      const singleGlyphs=survivors.filter(p=>Array.from(p.value).length===1);
      // 一些 SVG 同時有整串文字的裝飾性複本；估算字級時優先採單字字框。
      const glyphCandidates=singleGlyphs.length?singleGlyphs:survivors;
      const glyphHeight=Math.max(...glyphCandidates.map(p=>p.rectangle.height));
      return {...padded,glyphHeight};
    } finally { holder.remove(); }
  }

  function fitScale(box, slot) {
    return Math.min(slot.width/box.width,slot.height/box.height);
  }

  async function measure(markup, options = {}) {
    const original = readOriginalBox(markup);
    // 若來源含外部素材等造成 Canvas 安全限制，主字量測仍可能正常工作。
    let visible, visualError;
    try { visible = await visualBounds(markup,original); }
    catch(error) { visualError=error; }
    let core = null;
    if (options.text) {
      try { core=textBounds(markup, options.text,original); }
      catch(error) { console.warn("[SlowlyCoverWordFit] 主文字量測失敗",error); }
    }
    const slot=options.slot;
    let chosen = visible || original;
    let method = visible ? "visual-alpha" : "original";
    if (core && slot && Number.isFinite(slot.width) && Number.isFinite(slot.height)
        && slot.width>0 && slot.height>0) {
      // 只有主字確實偏小、而核心框能有效改善時才放大；
      // 如果原藝術字已夠清楚，保留包含周圍裝飾的 alpha 視覺範圍。
      const baseline=fitScale(chosen,slot);
      const apparentGlyphHeight=core.glyphHeight*baseline;
      const gain=fitScale(core,slot)/baseline;
      if (gain >= CORE_GAIN_THRESHOLD && apparentGlyphHeight < 52) {
        chosen={x:core.x,y:core.y,width:core.width,height:core.height};method="text-core";
      }
    } else if (core && !visible) {
      chosen={x:core.x,y:core.y,width:core.width,height:core.height};method="text-core";
    }
    if (visualError && method !== "text-core") {
      throw new Error(`SVG 影像量測失敗：${visualError.message}`);
    }
    return {...chosen,measured:method!=="original",method};
  }
  global.SlowlyCoverWordFit = Object.freeze({ measure, readOriginalBox });
})(window);
