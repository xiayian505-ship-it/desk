"use strict";
/* 《飛鴿傳輸》固定視覺：主圖片上覆蓋三個不透明資訊色塊與少量金色新聞感裝飾。 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  function add(doc, root, name, attrs = {}) {
    const node = doc.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    root.appendChild(node);
    return node;
  }
  function rect(doc, root, x, y, width, height, fill, extras = {}) {
    return add(doc, root, "rect", { x, y, width, height, fill, ...extras });
  }
  function defs(doc, root) {
    let store = root.querySelector("defs");
    if (!store) store = add(doc, root, "defs");
    if (!doc.getElementById("news_bottom_strip")) {
      const g = add(doc, store, "linearGradient", {
        id: "news_bottom_strip", x1: "0%", y1: "0%", x2: "100%", y2: "100%"
      });
      add(doc, g, "stop", { offset: "0%", "stop-color": "#10234C" });
      add(doc, g, "stop", { offset: "100%", "stop-color": "#27305B" });
    }
    if (!doc.getElementById("news_frame_wash")) {
      const g = add(doc, store, "linearGradient", {
        id: "news_frame_wash", x1: "0%", y1: "0%", x2: "100%", y2: "100%"
      });
      add(doc, g, "stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": ".32" });
      add(doc, g, "stop", { offset: "100%", "stop-color": "#f4cb72", "stop-opacity": ".08" });
    }
    return store;
  }
  function drawFrameOverlay(doc, root, frame) {
    const clipId = "news_frame_clip";
    const defsNode = defs(doc, root);
    let clip = doc.getElementById(clipId);
    if (!clip) {
      clip = add(doc, defsNode, "clipPath", { id: clipId, clipPathUnits: "userSpaceOnUse" });
      add(doc, clip, "rect", {
        x: frame.x, y: frame.y, width: frame.width, height: frame.height, rx: 0, ry: 0
      });
    }
    const g = add(doc, root, "g", { "clip-path": `url(#${clipId})` });
    rect(doc, g, frame.x, frame.y, frame.width, frame.height, "url(#news_frame_wash)");

    const verticalLines = 12;
    for (let i = 1; i < verticalLines; i += 1) {
      const x = frame.x + (frame.width / verticalLines) * i;
      add(doc, g, "path", {
        d: `M${x} ${frame.y} V${frame.y + frame.height}`,
        stroke: "#eef6fa", "stroke-opacity": ".18", "stroke-width": "1"
      });
    }
    const horizontalLines = 8;
    for (let i = 1; i < horizontalLines; i += 1) {
      const y = frame.y + (frame.height / horizontalLines) * i;
      add(doc, g, "path", {
        d: `M${frame.x} ${y} H${frame.x + frame.width}`,
        stroke: "#eef6fa", "stroke-opacity": ".14", "stroke-width": "1"
      });
    }
    add(doc, g, "path", {
      d: `M${frame.x + frame.width * 0.08} ${frame.y + frame.height * 0.78} C${frame.x + frame.width * 0.25} ${frame.y + frame.height * 0.58},${frame.x + frame.width * 0.35} ${frame.y + frame.height * 0.36},${frame.x + frame.width * 0.52} ${frame.y + frame.height * 0.42} S${frame.x + frame.width * 0.83} ${frame.y + frame.height * 0.63},${frame.x + frame.width * 0.92} ${frame.y + frame.height * 0.21}`,
      fill: "none", stroke: "#f4cb72", "stroke-width": "3", "stroke-opacity": ".72", "stroke-dasharray": "10 12", "stroke-linecap": "round"
    });
    add(doc, g, "circle", {
      cx: frame.x + frame.width * 0.73,
      cy: frame.y + frame.height * 0.30,
      r: Math.min(frame.width, frame.height) * 0.11,
      fill: "none", stroke: "#e7ffff", "stroke-opacity": ".34", "stroke-width": "3"
    });
    add(doc, g, "circle", {
      cx: frame.x + frame.width * 0.73,
      cy: frame.y + frame.height * 0.30,
      r: Math.min(frame.width, frame.height) * 0.18,
      fill: "none", stroke: "#e7ffff", "stroke-opacity": ".18", "stroke-width": "2"
    });
  }
  function chrome(doc, root, view) {
    defs(doc, root);
    const wide = view.width > view.height;
    const frame = view.imageFrames[0];
    drawFrameOverlay(doc, root, frame);

    if (!wide) {
      rect(doc, root, 48, 152, 524, 116, "#0D234A");
      rect(doc, root, 48, 152, 10, 116, "#F4CB72");
      rect(doc, root, 674, 170, 106, 536, "#293D79");
      rect(doc, root, 674, 170, 106, 8, "#F4CB72");
      rect(doc, root, 0, 940, 840, 260, "url(#news_bottom_strip)");
      rect(doc, root, 0, 940, 840, 8, "#EFCA73");
      rect(doc, root, 28, 102, 12, 52, "#F4CB72");
      rect(doc, root, 40, 102, 118, 52, "#0B1530");
      rect(doc, root, 616, 118, 134, 30, "#E7EDF1", { rx: 2, ry: 2 });
      rect(doc, root, 640, 874, 112, 28, "#E7EDF1", { rx: 2, ry: 2 });
    } else {
      rect(doc, root, 64, 126, 690, 132, "#0D234A");
      rect(doc, root, 64, 126, 10, 132, "#F4CB72");
      rect(doc, root, 954, 126, 132, 466, "#293D79");
      rect(doc, root, 954, 126, 132, 8, "#F4CB72");
      rect(doc, root, 0, 636, 1200, 204, "url(#news_bottom_strip)");
      rect(doc, root, 0, 636, 1200, 8, "#EFCA73");
      rect(doc, root, 36, 76, 12, 44, "#F4CB72");
      rect(doc, root, 48, 76, 140, 44, "#0B1530");
      rect(doc, root, 992, 84, 140, 28, "#E7EDF1", { rx: 2, ry: 2 });
    }
  }
  global.SlowlyCoverNewsVisual = Object.freeze({ draw: chrome });
  global.SlowlyCoverActiveVisual = global.SlowlyCoverNewsVisual;
})(window);
