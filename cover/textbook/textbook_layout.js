"use strict";
/* 《因材施教》單款資料：只記錄文字槽位置、圖片框和作者預設，不複製共用 UI。 */
(function (global) {
  const layout = {
    code: "textbook",
    title: "因材施教",
    description: "仿台灣早期國中歷史課本的青綠色、科目欄與中央圖片版型",
    areaNames: ["左側科目欄", "上方資訊", "下方資訊"],
    defaults: [
      { code: "ink", text: "因材施教" }, { code: "ink", text: "學習要錢" },
      { code: "ink", text: "因材施教" }, { code: "ink", text: "學習要錢" },
      { code: "ink", text: "因材施教" }, { code: "ink", text: "學習要錢" }
    ],
    backgroundDefault: { mode: "solid", a: "#A8D2B6", b: "#D9E5D1", angle: "0" },
    frameDefaults: { "textbook-picture": { mode: "solid", a: "#E7E3CE", b: "#D9D5B7", angle: "0" } },
    views: {
      vertical: {
        width: 840, height: 1200,
        imageFrames: [ { id: "textbook-picture", x: 198, y: 225, width: 594, height: 760 } ],
        sections: [
          { id: "subject", slots: [
            { x: 55, y: 308, width: 94, height: 405, artOrientation: "vertical" },
            { x: 69, y: 779, width: 66, height: 168, artOrientation: "vertical" }
          ] },
          { id: "top", slots: [
            { x: 260, y: 67, width: 207, height: 91, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 465, y: 67, width: 207, height: 91, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "bottom", slots: [
            { x: 259, y: 1042, width: 216, height: 83, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 473, y: 1042, width: 216, height: 83, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ]
      },
      horizontal: {
        width: 1200, height: 760,
        imageFrames: [ { id: "textbook-picture", x: 312, y: 185, width: 824, height: 448 } ],
        sections: [
          { id: "subject", slots: [
            { x: 49, y: 256, width: 238, height: 122, artOrientation: "horizontal" },
            { x: 74, y: 401, width: 168, height: 72, artOrientation: "horizontal" }
          ] },
          { id: "top", slots: [
            { x: 447, y: 63, width: 235, height: 80, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 680, y: 63, width: 235, height: 80, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "bottom", slots: [
            { x: 453, y: 660, width: 231, height: 61, artOrientation: "horizontal", align: "xMaxYMid meet" },
            { x: 682, y: 660, width: 231, height: 61, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ]
      }
    }
  };
  for (const [orientation, view] of Object.entries(layout.views)) {
    if (view.sections.length !== 3 || view.sections.some(area => area.slots.length !== 2) ||
        view.sections.flatMap(area => area.slots).length !== layout.defaults.length) {
      throw new Error(`因材施教 ${orientation}：區域與 A/B 槽數量不符`);
    }
  }
  global.SlowlyCoverTextbookLayout = Object.freeze(layout);
  global.SlowlyCoverActiveLayout = global.SlowlyCoverTextbookLayout;
})(window);
