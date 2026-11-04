"use strict";
/* 《旗開得勝》專屬 SVG：中立白底看板與壓在人物照片左上角的紅色投票圈選章。
 * 依作者提供的參考圖：單圓框、正中水平筆、右下斜筆；不放號次或其他政黨識別。
 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  function add(doc, root, tag, attrs = {}, content) {
    const node = doc.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    if (content != null) node.textContent = content;
    root.appendChild(node);
    return node;
  }
  function rect(doc, root, x, y, width, height, attrs = {}) {
    return add(doc, root, "rect", { x, y, width, height, ...attrs });
  }
  function circle(doc, root, cx, cy, r, attrs = {}) {
    return add(doc, root, "circle", { cx, cy, r, ...attrs });
  }
  function line(doc, root, x1, y1, x2, y2, attrs = {}) {
    return add(doc, root, "line", { x1, y1, x2, y2, ...attrs });
  }
  function path(doc, root, d, attrs = {}) {
    return add(doc, root, "path", { d, ...attrs });
  }
  function drawStamp(doc, root, stamp) {
    // 參考圖的紅色圈選章：只有一個粗圓、橫槓和右下斜槓。
    // 不使用雙圈、虛線、勾勾或旋轉；大小直接由模板的 stamp r 決定。
    const { cx, cy, r } = stamp;
    const red = "#ED1C24";
    const weight = r * 0.145;
    circle(doc, root, cx, cy, r, {
      fill: "none", stroke: red, "stroke-width": weight
    });
    line(doc, root, cx - r * 0.96, cy, cx + r * 0.96, cy, {
      stroke: red, "stroke-width": weight, "stroke-linecap": "butt"
    });
    line(doc, root, cx - r * 0.04, cy, cx + r * 0.67, cy + r * 0.69, {
      stroke: red, "stroke-width": weight, "stroke-linecap": "butt"
    });
  }
  function draw(doc, root, view) {
    const decor = view.decor;
    const board = decor.board;
    const photo = decor.photoBorder;
    // 共用合成器先畫圖片，再呼叫模板 visual：不能用實心白板蓋住候選人大照片。
    // 看板白底用 evenodd 留出照片的透明洞，保留使用者自行上傳的圖片。
    const bx = board.x, by = board.y, bw = board.width, bh = board.height, r = board.radius;
    rect(doc, root, bx + 7, by + 9, bw, bh, {
      rx: r, ry: r, fill: "none", stroke: "#000000", "stroke-width": 10, "stroke-opacity": 0.06
    });
    const outline = `M ${bx+r} ${by} H ${bx+bw-r} A ${r} ${r} 0 0 1 ${bx+bw} ${by+r} ` +
      `V ${by+bh-r} A ${r} ${r} 0 0 1 ${bx+bw-r} ${by+bh} H ${bx+r} ` +
      `A ${r} ${r} 0 0 1 ${bx} ${by+bh-r} V ${by+r} A ${r} ${r} 0 0 1 ${bx+r} ${by} Z`;
    const opening = `M ${photo.x} ${photo.y} H ${photo.x+photo.width} ` +
      `V ${photo.y+photo.height} H ${photo.x} Z`;
    path(doc, root, `${outline} ${opening}`, { fill: "#FFFFFF", "fill-rule": "evenodd" });
    rect(doc, root, bx, by, bw, bh, {
      rx: r, ry: r, fill: "none", stroke: "#D4D4D4", "stroke-width": 2
    });

    rect(doc, root, photo.x, photo.y, photo.width, photo.height, {
      fill: "none", stroke: "#101010", "stroke-width": 2.4
    });
    rect(doc, root, photo.x + 7, photo.y + 7, photo.width - 14, photo.height - 14, {
      fill: "none", stroke: "#FFFFFF", "stroke-opacity": 0.72, "stroke-width": 1.6
    });

    // 印章在圖片與雙層邊框之上，讓右半確實蓋到照片的左上角，不被框線切斷。
    drawStamp(doc, root, decor.stamp);

    // 四個主副標彼此緊密相連：不畫任何上下分隔線或淡灰條。
  }
  global.SlowlyCoverBillboardVisual = Object.freeze({ draw });
  global.SlowlyCoverActiveVisual = global.SlowlyCoverBillboardVisual;
})(window);
