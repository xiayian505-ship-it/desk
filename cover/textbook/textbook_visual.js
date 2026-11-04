"use strict";
/* 《因材施教》單款繪圖：仿古早課本的青綠印刷、窄科目欄、照片框、細邊線。不含不可編輯文字。 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  function shape(doc, root, name, attrs = {}) {
    const el = doc.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    root.appendChild(el);
    return el;
  }
  function rect(doc, root, x, y, width, height, fill = "none", attrs = {}) {
    return shape(doc,root,"rect",{x,y,width,height,fill,...attrs});
  }
  function line(doc, root, x1, y1, x2, y2, color, width = 1, opacity = 1) {
    return shape(doc,root,"line",{x1,y1,x2,y2,stroke:color,"stroke-width":width,"stroke-opacity":opacity});
  }
  function draw(doc, root, view) {
    const horizontal = view.width > view.height;
    const frame = view.imageFrames[0];
    // 低調的印刷邊界，不複製任何一本課本的字樣或專屬美術。
    const paper = "#537C67";
    const soft = "#D5E4CF";
    if (!horizontal) {
      rect(doc,root,22,24,796,1152,"none",{stroke:paper,"stroke-width":1.5,"stroke-opacity":.42});
      rect(doc,root,38,39,764,1122,"none",{stroke:"#F6F2DA","stroke-width":1.2,"stroke-opacity":.5});
      rect(doc,root,36,186,129,826,soft,{"fill-opacity":.19});
      line(doc,root,178,199,178,1012,paper,1.7,.55);
      line(doc,root,196,181,792,181,paper,1.4,.54);
      line(doc,root,196,1011,792,1011,paper,1.4,.54);
      line(doc,root,204,166,784,166,"#FFF9E6",2,.55);
      line(doc,root,204,1025,784,1025,"#FFF9E6",2,.55);
    } else {
      rect(doc,root,28,26,1144,708,"none",{stroke:paper,"stroke-width":1.5,"stroke-opacity":.45});
      rect(doc,root,44,43,1112,674,"none",{stroke:"#F6F2DA","stroke-width":1.2,"stroke-opacity":.5});
      rect(doc,root,44,182,254,463,soft,{"fill-opacity":.21});
      line(doc,root,301,181,301,643,paper,2,.5);
      line(doc,root,308,158,1142,158,paper,1.4,.55);
      line(doc,root,308,649,1142,649,paper,1.4,.55);
      line(doc,root,308,167,1138,167,"#FFF9E6",2,.58);
    }
    // 中央圖片框的內外細邊與復古照片裝裱感。
    rect(doc,root,frame.x-8,frame.y-8,frame.width+16,frame.height+16,"none",{
      stroke:"#EFF1D9","stroke-width":8,"stroke-opacity":.66
    });
    rect(doc,root,frame.x,frame.y,frame.width,frame.height,"none",{
      stroke:"#567961","stroke-width":2.3,"stroke-opacity":.8
    });
    rect(doc,root,frame.x+5,frame.y+5,frame.width-10,frame.height-10,"none",{
      stroke:"#F9F4DD","stroke-width":1.2,"stroke-opacity":.47
    });
    // 小小的裝訂/印刷記號，僅為幾何裝飾，不使用固定文字。
    if (!horizontal) {
      for (const y of [218, 1000]) {
        line(doc,root,87,y,123,y,paper,1.3,.55);
      }
    } else {
      for (const y of [216, 596]) {
        line(doc,root,106,y,186,y,paper,1.3,.55);
      }
    }
  }
  global.SlowlyCoverTextbookVisual = Object.freeze({draw});
  global.SlowlyCoverActiveVisual = global.SlowlyCoverTextbookVisual;
})(window);
