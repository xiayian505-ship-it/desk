"use strict";
/* 《飛鴿傳輸》正式模板資料：只描述本款構圖、槽位與作者預設。 */
(function (global) {
  const layout = {
    code: "news",
    title: "飛鴿傳輸",
    description: "以電視新聞資訊卡為靈感，三個不透明色塊疊於主圖片之上的封面版型",
    defaults: [
      { code: "gold", text: "飛鴿傳輸" },
      { code: "gold", text: "即時快報" },
      { code: "word_count", text: "飛鴿傳輸" },
      { code: "word_count", text: "即時快報" },
      { code: "gold", text: "飛鴿傳輸" },
      { code: "gold", text: "即時快報" }
    ],
    areaNames: ["左上色塊", "底部橫幅", "右側直色塊"],
    backgroundDefault: { mode: "gradient", a: "#0c1630", b: "#233965", angle: "90" },
    frameDefaults: {
      "main-picture": { mode: "gradient", a: "#d9e8ee", b: "#7f6687", angle: "45" }
    },
    views: {
      vertical: {
        width: 840, height: 1200,
        imageFrames: [{ id: "main-picture", x: 88, y: 92, width: 664, height: 938 }],
        sections: [
          { id: "top-left", slots: [
            { x: 80, y: 170, width: 225, height: 83, artOrientation: "horizontal" },
            { x: 317, y: 170, width: 225, height: 83, artOrientation: "horizontal" }
          ]},
          { id: "bottom", slots: [
            { x: 56, y: 964, width: 354, height: 207, artOrientation: "horizontal" },
            { x: 428, y: 964, width: 354, height: 207, artOrientation: "horizontal" }
          ]},
          { id: "right", slots: [
            { x: 691, y: 187, width: 72, height: 228, artOrientation: "vertical" },
            { x: 691, y: 443, width: 72, height: 228, artOrientation: "vertical" }
          ]}
        ]
      },
      horizontal: {
        width: 1200, height: 840,
        imageFrames: [{ id: "main-picture", x: 190, y: 76, width: 760, height: 610 }],
        sections: [
          { id: "top-left", slots: [
            { x: 103, y: 145, width: 296, height: 94, artOrientation: "horizontal" },
            { x: 418, y: 145, width: 296, height: 94, artOrientation: "horizontal" }
          ]},
          { id: "bottom", slots: [
            { x: 88, y: 651, width: 500, height: 173, artOrientation: "horizontal" },
            { x: 614, y: 651, width: 500, height: 173, artOrientation: "horizontal" }
          ]},
          { id: "right", slots: [
            { x: 985, y: 145, width: 72, height: 204, artOrientation: "vertical" },
            { x: 985, y: 366, width: 72, height: 204, artOrientation: "vertical" }
          ]}
        ]
      }
    }
  };

  for (const [name, view] of Object.entries(layout.views)) {
    if (!Array.isArray(view.imageFrames) || !Array.isArray(view.sections)) {
      throw new Error(`News ${name} 規格遺漏`);
    }
    if (view.sections.some(section => section.slots.length !== 2)) {
      throw new Error(`News ${name} 每區須兩個藝術字槽`);
    }
    if (view.sections.flatMap(section => section.slots).length !== layout.defaults.length) {
      throw new Error("News 預設藝術字數量不符");
    }
  }

  global.SlowlyCoverNewsLayout = Object.freeze(layout);
})(window);
