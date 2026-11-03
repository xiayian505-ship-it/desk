"use strict";
/* 慢慢封面 News Demo 沿用 v0.4 功能的獨立 SVG 合成器，版型資料與接入層分離。
 * 背景使用真正的 SVG rect/linearGradient，下載 SVG 仍保留可縮放向量。
 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  const XLINK = "http://www.w3.org/1999/xlink";
  const colorPattern = /^#[0-9a-fA-F]{6}$/;
  const elem = (doc, name, attrs = {}) => {
    const node = doc.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k, String(v)));
    return node;
  };
  const parseSVG = markup => {
    const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
    const root = doc.documentElement;
    if (doc.querySelector("parsererror") || root.localName !== "svg" || root.namespaceURI !== NS) throw new Error("藝術字 SVG 格式無效");
    return root;
  };
  function prefixIds(svg, unique) {
    const nodes = [svg, ...svg.querySelectorAll("*")];
    const refs = new Map();
    for (const el of nodes) {
      const id = el.getAttribute("id");
      if (!id) continue;
      if (refs.has(id)) throw new Error(`藝術字 SVG 內部重複 ID：${id}`);
      const renamed = `sc_${unique}_${id}`;
      refs.set(id,renamed);
      el.setAttribute("id",renamed);
    }
    const remapURL = value => value.replace(/url\(\s*(['"]?)#([^)'"\s]+)\1\s*\)/g,
      (all,quote,id) => refs.has(id) ? `url(#${refs.get(id)})` : all);
    for (const el of nodes) {
      if (!el.parentNode && el !== svg) continue;
      if (el !== svg && (el.localName === "script" || el.localName === "foreignObject")) { el.remove();continue; }
      if (el.localName === "style") {
        el.textContent = remapURL(el.textContent).replace(/#([\w:-]+)/g,(all,id)=>refs.has(id)?`#${refs.get(id)}`:all);
      }
      for (const attr of [...el.attributes]) {
        const name=attr.name.toLowerCase();
        if (name.startsWith("on")) {el.removeAttributeNode(attr);continue;}
        let val = remapURL(attr.value);
        if ((name === "href" || name === "xlink:href") && val.startsWith("#") && refs.has(val.slice(1))) val = `#${refs.get(val.slice(1))}`;
        if (name === "aria-labelledby" || name === "aria-describedby") val = val.split(/\s+/).map(k=>refs.get(k)||k).join(" ");
        if (name === "begin" || name === "end") val = val.replace(/(^|[;\s])([\w:-]+)\.(begin|end)(?=[;\s+\-]|$)/g,
          (whole,sep,id,ev)=>`${sep}${refs.get(id)||id}.${ev}`);
        if ((name === "href" || name === "xlink:href") && /^\s*javascript:/i.test(val)) {el.removeAttributeNode(attr);continue;}
        if (val !== attr.value) attr.value = val;
      }
    }
    return svg;
  }
  const directions = {
    "0":   ["0%","50%","100%","50%"],
    "45":  ["0%","0%","100%","100%"],
    "90":  ["50%","0%","50%","100%"],
    "135": ["100%","0%","0%","100%"]
  };
  function paint(doc, defs, root, box, settings, key) {
    const {mode, a, b, angle} = settings;
    if (!box || mode === "transparent" || mode === "image") return;
    if (!colorPattern.test(a) || !colorPattern.test(b)) throw new Error("背景顏色必須是六位數色碼");
    let fill = a;
    if (mode === "split" || mode === "gradient") {
      const vector = directions[String(angle)];
      if (!vector) throw new Error("背景方向只接受 0／45／90／135 度");
      const gradient = elem(doc,"linearGradient",{id:`slowly_cover_bg_${key}`,x1:vector[0],y1:vector[1],x2:vector[2],y2:vector[3]});
      const stops = mode === "split" ? [
        ["0%",a],["50%",a],["50%",b],["100%",b]
      ] : [["0%",a],["100%",b]];
      stops.forEach(([offset,color])=>gradient.appendChild(elem(doc,"stop",{offset,"stop-color":color})));
      defs.appendChild(gradient);
      fill=`url(#slowly_cover_bg_${key})`;
    } else if(mode !== "solid") throw new Error("未知的背景模式");
    root.appendChild(elem(doc,"rect",{x:box.x,y:box.y,width:box.width,height:box.height,fill}));
  }
  function drawFrameImage(doc, defs, root, box, dataURL, key) {
    if (!dataURL) return;
    // SVG 內嵌本機圖片的 data URL，下載檔案不依賴瀏覽器暫存網址或外站圖片。
    if (!/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(dataURL)) {
      throw new Error("圖片必須是已載入的 PNG、JPG 或 WebP");
    }
    const clipId = `slowly_cover_frame_clip_${key}`;
    const clip = elem(doc, "clipPath", {id: clipId, clipPathUnits: "userSpaceOnUse"});
    clip.appendChild(elem(doc, "rect", box));
    defs.appendChild(clip);
    const group = elem(doc, "g", {"clip-path": `url(#${clipId})`});
    const picture = elem(doc, "image", {
      x: box.x, y: box.y, width: box.width, height: box.height,
      preserveAspectRatio: "xMidYMid slice", "data-demo-photo": key
    });
    picture.setAttribute("href", dataURL);
    picture.setAttributeNS(XLINK, "xlink:href", dataURL);
    group.appendChild(picture);
    root.appendChild(group);
  }
  function compose({layout,orientation,slots,background,frames=[],visual}) {
    const view=layout?.views?.[orientation];
    if (!view) throw new Error("找不到對應的直／橫封面版型");
    const boxes=view.sections.flatMap(s=>s.slots);
    if (!Array.isArray(slots) || slots.length !== boxes.length) throw new Error("藝術字槽與模板位置數量不符");
    const doc=document.implementation.createDocument(NS,"svg",null);
    const root=doc.documentElement;
    root.setAttribute("xmlns",NS);root.setAttribute("xmlns:xlink",XLINK);
    root.setAttribute("width",String(view.width));root.setAttribute("height",String(view.height));
    root.setAttribute("viewBox",`0 0 ${view.width} ${view.height}`);
    root.setAttribute("role","img");root.setAttribute("aria-label",`慢慢封面 ${layout.title} ${orientation}`);
    root.appendChild(elem(doc,"title")).textContent=`慢慢封面｜${layout.title}`;
    const defs=elem(doc,"defs");root.appendChild(defs);
    const all={x:0,y:0,width:view.width,height:view.height};
    paint(doc,defs,root,all,background,"whole");
    drawFrameImage(doc,defs,root,all,background?.imageDataURL,"whole");
    const boxesById = new Map(frames.map(frame => [frame.id, frame]));
    if (boxesById.size !== frames.length) throw new Error("圖片框設定 id 重複");
    // 框的數量、大小和位置由模板自己定義；共用合成器逐框渲染。
    for (const [index, box] of view.imageFrames.entries()) {
      const choice=boxesById.get(box.id);
      if (!choice) throw new Error(`缺少圖片框設定：${box.id}`);
      paint(doc,defs,root,box,choice.background,`frame_${index + 1}`);
      drawFrameImage(doc,defs,root,box,choice.imageDataURL,`frame_${index + 1}`);
    }
    // 固定的新聞視覺由 News 專屬模組繪製；這裡只負責調度。
    // 圖框、背景與藝術字仍由原 v0.4 的共用合成機制處理。
    if (visual && typeof visual.draw === "function") visual.draw(doc,root,view,layout);
    slots.forEach((item,i) => {
      if (!item.svg) throw new Error(`第 ${i+1} 槽沒有 SVG`);
      const box=boxes[i];
      const imported=doc.importNode(parseSVG(item.svg),true);
      prefixIds(imported,i+1);
      // 只改最外層 viewBox：依可見藝術內容放大，保留原 SVG 裡全部字形與特效。
      // 不再把原始 1200×760 / 840×1200 的四周空白一起塞進小槽位。
      if (item.fitBox && [item.fitBox.x, item.fitBox.y, item.fitBox.width, item.fitBox.height].every(Number.isFinite)
          && item.fitBox.width > 0 && item.fitBox.height > 0) {
        const v=item.fitBox;
        imported.setAttribute("viewBox",`${v.x} ${v.y} ${v.width} ${v.height}`);
      }
      imported.setAttribute("x",String(box.x));
      imported.setAttribute("y",String(box.y));
      imported.setAttribute("width",String(box.width));
      imported.setAttribute("height",String(box.height));
      imported.setAttribute("preserveAspectRatio","xMidYMid meet");
      imported.setAttribute("data-demo-slot",String(i+1));
      root.appendChild(imported);
    });
    const svg=new XMLSerializer().serializeToString(root);
    const parsed=parseSVG(svg);
    const ids=[...parsed.querySelectorAll("[id]")].map(n=>n.id);
    if (ids.length!==new Set(ids).size) throw new Error("合成 SVG 的 ID 發生衝突");
    return {svg,width:view.width,height:view.height,slotCount:boxes.length};
  }
  global.SlowlyCoverComposer=Object.freeze({compose,directions});
})(window);
