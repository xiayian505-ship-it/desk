"use strict";
/* 《跳梁小丑》固定視覺：僅負責撲克牌細框與圖片裝裱，不印任何不可編輯的字。 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  function add(doc, root, tag, attrs) {
    const node = doc.createElementNS(NS, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    root.appendChild(node);
    return node;
  }
  function draw(doc, root, view) {
    const portrait = view.height > view.width;
    const outer = portrait ? {x:13,y:13,width:814,height:1174,r:29} : {x:13,y:13,width:1174,height:814,r:29};
    const inset = portrait ? {x:28,y:28,width:784,height:1144,r:22} : {x:28,y:28,width:1144,height:784,r:22};
    const ink = "#33353D";
    // 避免不透明底色蓋住共用 UI 的透明、撞色、漸層或整張封面圖片設定。
    add(doc,root,"rect",{x:outer.x,y:outer.y,width:outer.width,height:outer.height,
      rx:outer.r,ry:outer.r,fill:"none",stroke:ink,"stroke-width":3.2});
    add(doc,root,"rect",{x:inset.x,y:inset.y,width:inset.width,height:inset.height,
      rx:inset.r,ry:inset.r,fill:"none",stroke:ink,"stroke-width":.85,"stroke-opacity":.42});
    // 單一矩形圖片位置，以紙牌中心圖像為主角；圖片本身走共用選圖／裁切流程。
    const frame = view.imageFrames[0];
    add(doc,root,"rect",{x:frame.x-5,y:frame.y-5,width:frame.width+10,height:frame.height+10,
      rx:3,ry:3,fill:"none",stroke:ink,"stroke-width":1.8});
    add(doc,root,"rect",{x:frame.x+5,y:frame.y+5,width:frame.width-10,height:frame.height-10,
      rx:1.5,ry:1.5,fill:"none",stroke:ink,"stroke-width":.65,"stroke-opacity":.3});
  }
  global.SlowlyCoverJokerVisual = Object.freeze({draw});
  global.SlowlyCoverActiveVisual = global.SlowlyCoverJokerVisual;
})(window);
