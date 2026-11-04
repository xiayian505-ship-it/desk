"use strict";
/* 《一錢不值》僅用 SVG 幾何線條繪出美元感：米白紙色由共用背景提供。
 * 故意不仿造真鈔序號、政府印章、密集防偽細節或真鈔原文。
 * 所有固定圖形只供本款；不印不可編輯的小說文字。
 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  const INK = "#305841";
  const PALE = "#77947A";
  function add(doc, parent, tag, attrs = {}) {
    const node = doc.createElementNS(NS, tag);
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value));
    parent.appendChild(node);
    return node;
  }
  function ellipse(doc, root, cx, cy, rx, ry, attrs = {}) {
    return add(doc, root, "ellipse", {cx,cy,rx,ry,fill:"none",...attrs});
  }
  function rectangle(doc, root, x, y, width, height, attrs = {}) {
    return add(doc, root, "rect", {x,y,width,height,fill:"none",...attrs});
  }
  function line(doc, root, x1, y1, x2, y2, opacity = .35) {
    return add(doc, root, "line", {x1,y1,x2,y2,stroke:INK,"stroke-width":1.15,"stroke-opacity":opacity});
  }
  function numeral(doc, root, x, y) {
    // 四角固定的一元數字，全部是向量路徑，不依賴裝置字型。
    const g=add(doc,root,"g",{transform:`translate(${x} ${y})`});
    ellipse(doc,g,29,36,31,43,{stroke:INK,"stroke-width":1.7,"stroke-opacity":.73});
    ellipse(doc,g,29,36,26,38,{stroke:PALE,"stroke-width":.75,"stroke-opacity":.48});
    add(doc,g,"path",{d:"M 13 17 L 29 9 L 39 9 L 39 62 L 48 62 L 48 71 L 12 71 L 12 62 L 24 62 L 24 23 L 16 28 Z",
      fill:INK,"fill-opacity":.9});
  }
  function medallion(doc, root, cx, cy, rx, ry) {
    // 抽象的印花橢圓；不是美國國徽、聯準會或財政部的官方印章。
    const g=add(doc,root,"g",{"stroke-opacity":.26});
    ellipse(doc,g,cx,cy,rx,ry,{stroke:INK,"stroke-width":2});
    ellipse(doc,g,cx,cy,rx-7,ry-11,{stroke:INK,"stroke-width":.9});
    for (const angle of [0,36,72,108,144]) {
      ellipse(doc,g,cx,cy,rx*.58,ry*.76,{stroke:INK,"stroke-width":.95,
        transform:`rotate(${angle} ${cx} ${cy})`});
    }
    ellipse(doc,g,cx,cy,rx*.28,ry*.4,{stroke:INK,"stroke-width":1.1});
  }
  function cornerFlourish(doc, root, x, y, scaleX, scaleY) {
    const g=add(doc,root,"g",{transform:`translate(${x} ${y}) scale(${scaleX} ${scaleY})`,
      stroke:INK,"stroke-opacity":.38,fill:"none"});
    add(doc,g,"path",{d:"M 3 48 C 4 17 16 4 49 3 C 24 10 15 23 15 48 M 7 38 C 31 35 36 25 38 8 M 14 23 Q 27 27 35 15",
      "stroke-width":1.6,"stroke-linecap":"round"});
    add(doc,g,"path",{d:"M 13 33 Q 28 36 25 49 M 27 15 Q 39 24 49 19",
      "stroke-width":1.2,"stroke-linecap":"round"});
  }
  function draw(doc, root, view) {
    const horizontal=view.width>view.height;
    const o=view.decor.outer;
    // 只畫透明線條，尊重共用 UI 的背景設定（透明、撞色、漸層、整張底圖）。
    rectangle(doc,root,o.x,o.y,o.width,o.height,{stroke:INK,"stroke-width":3.5,"stroke-opacity":.9});
    rectangle(doc,root,o.x+10,o.y+10,o.width-20,o.height-20,{stroke:INK,"stroke-width":1.1,"stroke-opacity":.6});
    rectangle(doc,root,o.x+19,o.y+19,o.width-38,o.height-38,{stroke:INK,"stroke-width":1.8,"stroke-opacity":.55});
    rectangle(doc,root,o.x+26,o.y+26,o.width-52,o.height-52,{stroke:PALE,"stroke-width":.75,"stroke-opacity":.37});
    // 四角少量卷草花邊，保留美元印刷的視覺節奏，不鋪滿細紋。
    cornerFlourish(doc,root,o.x+32,o.y+32,1,1);
    cornerFlourish(doc,root,o.x+o.width-32,o.y+32,-1,1);
    cornerFlourish(doc,root,o.x+32,o.y+o.height-32,1,-1);
    cornerFlourish(doc,root,o.x+o.width-32,o.y+o.height-32,-1,-1);
    // 一元面額及左右兩枚抽象細紋徽飾：足以提示美金，不仿任何真鈔徽章。
    for(const [x,y] of view.decor.numeral) numeral(doc,root,x,y);
    for(const [cx,cy,rx,ry] of view.decor.ornaments) medallion(doc,root,cx,cy,rx,ry);
    const frame=view.imageFrames[0];
    const cx=frame.x+frame.width/2, cy=frame.y+frame.height/2;
    const rx=frame.width/2, ry=frame.height/2;
    // 真正的橢圓裁切已在共用合成器執行；這裡只畫圖片上面的雕花感邊框。
    ellipse(doc,root,cx,cy,rx+21,ry+20,{stroke:INK,"stroke-width":2.6,"stroke-opacity":.85});
    ellipse(doc,root,cx,cy,rx+14,ry+13,{stroke:INK,"stroke-width":1.05,"stroke-opacity":.55});
    ellipse(doc,root,cx,cy,rx+7,ry+7,{stroke:PALE,"stroke-width":5,"stroke-opacity":.55});
    ellipse(doc,root,cx,cy,rx,ry,{stroke:INK,"stroke-width":2,"stroke-opacity":.87});
    ellipse(doc,root,cx,cy,rx-6,ry-6,{stroke:INK,"stroke-width":.7,"stroke-opacity":.43});
    // 上下兩句的邊界僅靠極淡的橫線示意鈔票層次；不額外塞標語、序號或印章。
    if(horizontal) {
      line(doc,root,316,174,884,174,.25);
      line(doc,root,316,664,884,664,.25);
    } else {
      line(doc,root,195,299,645,299,.24);
      line(doc,root,195,904,645,904,.24);
    }
  }
  global.SlowlyCoverDollarVisual = Object.freeze({draw});
  global.SlowlyCoverActiveVisual = global.SlowlyCoverDollarVisual;
})(window);
