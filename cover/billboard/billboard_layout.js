"use strict";
/* 《旗開得勝》候選人看板：透明底預設、大人物圖片、緊密連接的直排主副槽；圈選章疊於照片左上角。
 * 本檔只定義本款排版，不借用其他封面的專屬位置。
 */
(function (global) {
  const layout = {
    code: "billboard",
    title: "旗開得勝",
    description: "仿台灣候選人看板：大人物照、照片左上角紅色圈選章與放大的緊密直排主副標。",
    areaNames: ["第一組姓名／政見", "第二組姓名／政見"],
    defaults: [
      { code: "ballot", text: "旗開得勝" }, { code: "ballot", text: "不得不投" },
      { code: "ballot", text: "旗開得勝" }, { code: "ballot", text: "不得不投" }
    ],
    backgroundDefault: { mode: "transparent", a: "#FFFFFF", b: "#FFFFFF", angle: "0" },
    frameDefaults: {
      "billboard-photo": { mode: "solid", a: "#E7E7E7", b: "#D9D9D9", angle: "0" }
    },
    views: {
      vertical: {
        width: 840, height: 1200,
        imageFrames: [
          { id: "billboard-photo", x: 360, y: 66, width: 420, height: 1048 }
        ],
        sections: [
          // 兩排上下排列：A 大槽固定左欄；B 小槽固定右欄，同行靠近。
          // 左大 A 與右小 B 只共用邊界，不覆蓋彼此的 SVG 畫布。
          // 上下組各在自己的垂直區間；即使切換藝術字，槽位也不碰撞。
          { id: "row-1", slots: [
            { x: 48, y: 240, width: 181, height: 416, artOrientation: "vertical", align: "xMaxYMid meet" },
            { x: 229, y: 260, width: 124, height: 376, artOrientation: "vertical", align: "xMinYMid meet" }
          ] },
          { id: "row-2", slots: [
            { x: 48, y: 661, width: 181, height: 416, artOrientation: "vertical", align: "xMaxYMid meet" },
            { x: 229, y: 681, width: 124, height: 376, artOrientation: "vertical", align: "xMinYMid meet" }
          ] }
        ],
        decor: {
          board: { x: 26, y: 26, width: 788, height: 1148, radius: 22 },
          stamp: { cx: 365, cy: 130, r: 76 },
          photoBorder: { x: 360, y: 66, width: 420, height: 1048 }
        }
      },
      horizontal: {
        width: 1200, height: 840,
        imageFrames: [
          { id: "billboard-photo", x: 452, y: 58, width: 694, height: 724 }
        ],
        sections: [
          // 橫版同樣左大右小、上下各一，不改成四欄或橫排。
          { id: "row-1", slots: [
            { x: 52, y: 218, width: 230, height: 278, artOrientation: "vertical", align: "xMaxYMid meet" },
            { x: 282, y: 227, width: 157, height: 262, artOrientation: "vertical", align: "xMinYMid meet" }
          ] },
          { id: "row-2", slots: [
            { x: 52, y: 501, width: 230, height: 278, artOrientation: "vertical", align: "xMaxYMid meet" },
            { x: 282, y: 510, width: 157, height: 262, artOrientation: "vertical", align: "xMinYMid meet" }
          ] }
        ],
        decor: {
          board: { x: 22, y: 22, width: 1156, height: 796, radius: 22 },
          stamp: { cx: 458, cy: 126, r: 80 },
          photoBorder: { x: 452, y: 58, width: 694, height: 724 }
        }
      }
    }
  };

  for (const [orientation, view] of Object.entries(layout.views)) {
    if (view.sections.length !== 2 || view.sections.some(area => area.slots.length !== 2) ||
        view.sections.flatMap(area => area.slots).length !== layout.defaults.length) {
      throw new Error(`旗開得勝 ${orientation}：必須為兩組 A/B 共四槽`);
    }
    if (view.sections.some(section => section.slots.some(slot => slot.artOrientation !== "vertical"))) {
      throw new Error(`旗開得勝 ${orientation}：四槽都必須直排`);
    }
    const [upper, lower] = view.sections;
    if (!(upper.slots[0].x === lower.slots[0].x && upper.slots[1].x === lower.slots[1].x &&
          upper.slots[0].x + upper.slots[0].width === upper.slots[1].x &&
          lower.slots[0].x + lower.slots[0].width === lower.slots[1].x &&
          upper.slots[0].width > upper.slots[1].width &&
          lower.slots[0].width > lower.slots[1].width &&
          upper.slots[0].y < lower.slots[0].y &&
          upper.slots[1].y < lower.slots[1].y)) {
      throw new Error(`旗開得勝 ${orientation}：必須是左大右小、上下兩組的直排兩欄`);
    }
    // 先前版本為了「緊密」讓兩組的矩形範圍相互重疊，
    // 部分款式換字後真的疊字。檢查所有槽彼此無面積交疊，不只檢查預設藝術字。
    const slots = view.sections.flatMap(area => area.slots);
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const a = slots[i], b = slots[j];
        const overlapWidth = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        const overlapHeight = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        if (overlapWidth > 0 && overlapHeight > 0) {
          throw new Error(`旗開得勝 ${orientation}：第 ${i + 1} 與 ${j + 1} 槽發生重疊`);
        }
      }
    }
    // 即使未重疊，也應保有剛好的距離，而不是四條彼此遠離的文字。
    const gapA = lower.slots[0].y - (upper.slots[0].y + upper.slots[0].height);
    const gapB = lower.slots[1].y - (upper.slots[1].y + upper.slots[1].height);
    if (gapA < 0 || gapB < 0 || gapA > 35 || gapB > 60) {
      throw new Error(`旗開得勝 ${orientation}：上下兩組字槽的距離不符合緊密排列`);
    }
    if (view.imageFrames.length !== 1 || view.imageFrames[0].id !== "billboard-photo") {
      throw new Error(`旗開得勝 ${orientation}：圖片框規格不正確`);
    }
    // 圈選章疊在大圖左上角：中心略在圖片框內，跨過圖片框左線；整枚不得切出看板。
    const photo = view.imageFrames[0], stamp = view.decor.stamp, board = view.decor.board;
    if (!(stamp.cx > photo.x && stamp.cx - stamp.r < photo.x &&
          stamp.cy > photo.y && stamp.cy - stamp.r < photo.y &&
          stamp.cx - stamp.r > board.x && stamp.cy - stamp.r > board.y &&
          stamp.cx + stamp.r < board.x + board.width && stamp.cy + stamp.r < board.y + board.height &&
          stamp.cy + stamp.r < upper.slots[0].y)) {
      throw new Error(`旗開得勝 ${orientation}：圈選章應疊於圖片左上角，且不得裁切或碰到文字槽`);
    }
  }

  global.SlowlyCoverBillboardLayout = Object.freeze(layout);
  global.SlowlyCoverActiveLayout = global.SlowlyCoverBillboardLayout;
})(window);
