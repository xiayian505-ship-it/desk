"use strict";
/* 《日新月異》固定 SVG 視覺：獨立社群貼文的分隔、頭像圓框、互動數字；不借用其他模板繪圖。
 * SVG 視覺在共用合成器放入圖片後、藝術字前繪製，讓頭像方框遮成圓形，不需改共用圖片框能力。
 */
(function (global) {
  const NS = "http://www.w3.org/2000/svg";
  function add(doc, parent, tag, attrs = {}, content) {
    const element = doc.createElementNS(NS, tag);
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, String(value));
    if (content != null) element.textContent = content;
    parent.appendChild(element);
    return element;
  }
  function path(doc, root, d, attrs = {}) {
    return add(doc, root, "path", { d, ...attrs });
  }
  function line(doc, root, x1, y1, x2, y2, stroke, width = 1) {
    return add(doc, root, "line", {x1,y1,x2,y2,stroke,"stroke-width":width});
  }
  function heart(doc, parent, x, y, color) {
    // 實心愛心，刻意不是只有外框。
    path(doc, parent, `M ${x} ${y+26} C ${x-5} ${y+21},${x-29} ${y+4},${x-28} ${y-10} C ${x-27} ${y-27},${x-7} ${y-29},${x} ${y-16} C ${x+7} ${y-29},${x+27} ${y-27},${x+28} ${y-10} C ${x+29} ${y+4},${x+5} ${y+21},${x} ${y+26} Z`, {fill:color});
  }
  function comment(doc, parent, x, y, color) {
    path(doc, parent, `M ${x-25} ${y-17} Q ${x-25} ${y-26} ${x-14} ${y-26} H ${x+16} Q ${x+27} ${y-26} ${x+27} ${y-15} V ${y+9} Q ${x+27} ${y+21} ${x+15} ${y+21} H ${x-6} L ${x-23} ${y+31} L ${x-19} ${y+16} Q ${x-25} ${y+12} ${x-25} ${y+4} Z`, {fill:"none",stroke:color,"stroke-width":5,"stroke-linejoin":"round","stroke-linecap":"round"});
  }
  function repost(doc, parent, x, y, color) {
    // 兩條方向相反的箭線構成轉發圖示，不使用任何平台商標。
    path(doc, parent, `M ${x-27} ${y-5} V ${y-16} Q ${x-27} ${y-25} ${x-16} ${y-25} H ${x+18} M ${x+9} ${y-34} L ${x+19} ${y-25} L ${x+9} ${y-16}`, {fill:"none",stroke:color,"stroke-width":4.7,"stroke-linecap":"round","stroke-linejoin":"round"});
    path(doc, parent, `M ${x+27} ${y+4} V ${y+16} Q ${x+27} ${y+25} ${x+16} ${y+25} H ${x-18} M ${x-9} ${y+34} L ${x-19} ${y+25} L ${x-9} ${y+16}`, {fill:"none",stroke:color,"stroke-width":4.7,"stroke-linecap":"round","stroke-linejoin":"round"});
  }
  function maskAvatar(doc, root, avatar) {
    const cx = avatar.x + avatar.width / 2, cy = avatar.y + avatar.height / 2;
    const r = Math.min(avatar.width, avatar.height) / 2;
    // 只遮住頭像圖片框四角，不會改動共用繪圖的矩形圖片能力。
    // evenodd 留出圓洞；外側用白色卡片紙色補齊，圖片仍可上傳且保持獨立。
    const d = `M ${avatar.x} ${avatar.y} H ${avatar.x+avatar.width} V ${avatar.y+avatar.height} H ${avatar.x} Z ` +
      `M ${cx-r} ${cy} A ${r} ${r} 0 1 0 ${cx+r} ${cy} A ${r} ${r} 0 1 0 ${cx-r} ${cy} Z`;
    path(doc, root, d, {fill:"#FFFFFF","fill-rule":"evenodd"});
    add(doc,root,"circle",{cx,cy,r,fill:"none",stroke:"#DDE1E5","stroke-width":2.4});
  }
  function draw(doc, root, view) {
    const decor=view.socialDecor;
    const dark="#30353B", muted="#75808A", faint="#E6E9EC";
    const outer=decor.card;
    add(doc,root,"rect",{x:outer.x,y:outer.y,width:outer.width,height:outer.height,rx:outer.radius,ry:outer.radius,fill:"none",stroke:"#E3E7EA","stroke-width":2});
    const avatar=view.imageFrames.find(frame=>frame.id==="social-avatar");
    const post=view.imageFrames.find(frame=>frame.id==="social-post");
    if (!avatar || !post) throw new Error("Social 需要頭像與貼文圖片兩個框");
    maskAvatar(doc,root,avatar);
    // 社群貼文：帳號上方留白、正文與圖片之間有節奏，沒有新聞跑馬燈／資訊色塊。
    line(doc,root,outer.x+31,decor.separatorY,outer.x+outer.width-31,decor.separatorY,faint,2.0);
    add(doc,root,"rect",{x:post.x,y:post.y,width:post.width,height:post.height,fill:"none",stroke:"#D3D8DD","stroke-width":2});
    line(doc,root,outer.x+31,decor.bottomY,outer.x+outer.width-31,decor.bottomY,faint,2);
    // 帳號右方的三點選單為純幾何符號，沒有額外固定文字。
    const dotX = outer.x+outer.width-70, dotY = avatar.y+avatar.height/2;
    for(const dx of [-15,0,15]) add(doc,root,"circle",{cx:dotX+dx,cy:dotY,r:3.8,fill:muted});
    // 三個互動組合皆為 SVG 畫出的 icon，數字 99 為使用者指定的固定示意值。
    const [like, reply, share]=decor.reactions;
    heart(doc,root,like.x,like.y,dark);
    comment(doc,root,reply.x,reply.y,dark);
    repost(doc,root,share.x,share.y,dark);
    for(const {x,y} of decor.reactions) {
      add(doc,root,"text",{x:x+47,y:y+15,"font-family":"Arial, Helvetica, sans-serif","font-size":39,"font-weight":600,fill:dark,"letter-spacing":"1px"},"99");
    }
  }
  global.SlowlyCoverSocialVisual = Object.freeze({draw});
  global.SlowlyCoverActiveVisual = global.SlowlyCoverSocialVisual;
})(window);
