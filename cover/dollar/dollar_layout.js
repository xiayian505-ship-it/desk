"use strict";
/* 《一錢不值》Dollar：兩排 A+B 雙藝術字，各排自然相鄰，連成一句；中央一個橢圓圖片框。
 * 經典美元的米白紙色＋深綠線條，只借用外框／肖像／四角面額的視覺秩序。
 * 所有座標均僅供本款使用，與共用工作台及其他封面樣式無關。
 */
(function (global) {
  const layout = {
    code: "dollar",
    title: "一錢不值",
    description: "美元風格的幾何外框與綠色印刷，中間橢圓人物肖像；上下兩排各由 A+B 緊密接成一句。",
    areaNames: ["上排文字", "下排文字"],
    defaults: [
      { code: "gold", text: "一錢不值" }, { code: "gold", text: "嗜財如命" },
      { code: "gold", text: "一錢不值" }, { code: "gold", text: "嗜財如命" }
    ],
    backgroundDefault: { mode: "solid", a: "#E8E9D7", b: "#E8E9D7", angle: "0" },
    frameDefaults: {
      "dollar-portrait": { mode: "solid", a: "#D0D9C5", b: "#C2CCB7", angle: "0" }
    },
    views: {
      vertical: {
        width: 840, height: 1200,
        imageFrames: [
          // 共用合成器以 ellipse 裁切背景與照片，不是把方形照片蓋上米白色四角。
          { id: "dollar-portrait", x: 218, y: 316, width: 404, height: 568, clipShape: "ellipse" }
        ],
        sections: [
          { id: "top", slots: [
            // xMax / xMin 讓 A／B 視覺相接，兩槽輕微重合約 12px，只抵銷 SVG 內部留白；不讓字形筆畫重疊。
            { x: 56, y: 162, width: 370, height: 118, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 414, y: 162, width: 370, height: 118, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "bottom", slots: [
            { x: 56, y: 921, width: 370, height: 118, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 414, y: 921, width: 370, height: 118, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ],
        decor: {
          outer: { x: 25, y: 25, width: 790, height: 1150 },
          numeral: [ [76, 63], [702, 63], [76, 1060], [702, 1060] ],
          ornaments: [ [112, 600, 69, 103], [728, 600, 69, 103] ]
        }
      },
      horizontal: {
        width: 1200, height: 840,
        imageFrames: [
          { id: "dollar-portrait", x: 405, y: 183, width: 390, height: 474, clipShape: "ellipse" }
        ],
        sections: [
          { id: "top", slots: [
            { x: 196, y: 69, width: 410, height: 96, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 594, y: 69, width: 410, height: 96, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "bottom", slots: [
            { x: 196, y: 679, width: 410, height: 96, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 594, y: 679, width: 410, height: 96, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ],
        decor: {
          outer: { x: 28, y: 22, width: 1144, height: 796 },
          numeral: [ [75, 50], [1077, 50], [75, 712], [1077, 712] ],
          ornaments: [ [202, 420, 98, 143], [998, 420, 98, 143] ]
        }
      }
    }
  };
  for (const [orientation, view] of Object.entries(layout.views)) {
    const boxes = view.sections.flatMap(section => section.slots);
    if (view.sections.length !== 2 || view.sections.some(section => section.slots.length !== 2) ||
        boxes.length !== layout.defaults.length || view.imageFrames.length !== 1 ||
        view.imageFrames[0].clipShape !== "ellipse") {
      throw new Error(`Dollar ${orientation}：上下雙槽或橢圓圖片框設定不符`);
    }
    for (const section of view.sections) {
      const gap=section.slots[1].x-(section.slots[0].x+section.slots[0].width);
      // 只用小幅槽框重疊抵銷 SVG 內部留白；過度交疊會壓住金碧輝煌的筆畫。
      // xMax / xMin 貼向內側，維持一整句的正常字距。
      if (gap < -20 || gap > 0) {
        throw new Error(`Dollar ${orientation} ${section.id}：A／B 間距異常`);
      }
    }
  }
  global.SlowlyCoverDollarLayout = Object.freeze(layout);
  global.SlowlyCoverActiveLayout = global.SlowlyCoverDollarLayout;
})(window);
