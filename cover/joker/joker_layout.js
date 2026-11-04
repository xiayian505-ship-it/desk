"use strict";
/* 《跳梁小丑》Joker：兩組可編輯的 J + oker 角標，中央一張大圖片。
 * v0.2：僅放大直橫版各 4 個文字槽的幾何尺寸（寬、高各 2 倍）；左上與右下固定角落錨點，
 * 讓藝術字可輕微跨入中央圖片框，不修改共用合成或藝術字縮放規則。
 */
(function (global) {
  const layout = {
    code: "joker",
    title: "跳梁小丑",
    description: "經典鬼牌的白色牌面、對角 Joker 與中央大幅圖片；右下角整組倒置。",
    areaNames: ["左上 Joker", "右下 Joker"],
    defaults: [
      { code: "ill_fate", text: "J" }, { code: "ill_fate", text: "oker" },
      { code: "ill_fate", text: "J" }, { code: "ill_fate", text: "oker" }
    ],
    backgroundDefault: { mode: "solid", a: "#FAF9F5", b: "#F7F1E8", angle: "0" },
    frameDefaults: {
      "joker-picture": { mode: "solid", a: "#E9E6DC", b: "#E1DDD3", angle: "0" }
    },
    views: {
      vertical: {
        width: 840, height: 1200,
        imageFrames: [ { id: "joker-picture", x: 82, y: 181, width: 676, height: 833 } ],
        sections: [
          { id: "top-left", slots: [
            // J 保持主槽、oker 保持副槽；整組槽位較初版各放大 2 倍。
            // 以左上角作錨點，容許尺寸擴大後局部覆蓋圖片框。
            { x: 48, y: 39, width: 208, height: 240, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 246, y: 89, width: 468, height: 144, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "bottom-right", rotate: 180, slots: [
            // 右下以牌面右下角作錨點，擴大時向左上方延伸。
            // 整組旋轉，而非各字單獨旋轉；倒置後 J 仍位於牌角。
            { x: 126, y: 923, width: 208, height: 240, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 324, y: 973, width: 468, height: 144, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ]
      },
      horizontal: {
        width: 1200, height: 840,
        imageFrames: [ { id: "joker-picture", x: 102, y: 177, width: 996, height: 483 } ],
        sections: [
          { id: "top-left", slots: [
            { x: 57, y: 29, width: 240, height: 246, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 285, y: 79, width: 516, height: 150, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "bottom-right", rotate: 180, slots: [
            { x: 400, y: 558, width: 240, height: 246, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 628, y: 608, width: 516, height: 150, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ]
      }
    }
  };
  for (const [orientation, view] of Object.entries(layout.views)) {
    if (view.sections.length !== 2 || view.sections.some(section => section.slots.length !== 2) ||
        view.sections.flatMap(section => section.slots).length !== layout.defaults.length ||
        view.imageFrames.length !== 1) {
      throw new Error(`Joker ${orientation}：雙槽與圖片框設定不符`);
    }
  }
  global.SlowlyCoverJokerLayout = Object.freeze(layout);
  global.SlowlyCoverActiveLayout = global.SlowlyCoverJokerLayout;
})(window);
