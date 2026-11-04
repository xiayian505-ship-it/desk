"use strict";
/* 《日新月異》Social 專屬版型：三區 A/B（六槽）、頭像與貼文兩個獨立圖片框。
 * 此檔只包含本款排版與預設，不共用 news / textbook / joker 的任何設計參數。
 */
(function (global) {
  const layout = {
    code: "social",
    title: "日新月異",
    description: "以社群貼文為原型：圓形頭像、兩行藝術字貼文、主圖片與 SVG 互動列。",
    areaNames: ["帳號資訊", "貼文第一排", "貼文第二排"],
    defaults: [
      { code: "ember", text: "日新月異" }, { code: "ember", text: "交友不慎" },
      { code: "ember", text: "日新月異" }, { code: "ember", text: "交友不慎" },
      { code: "ember", text: "日新月異" }, { code: "ember", text: "交友不慎" }
    ],
    backgroundDefault: { mode: "solid", a: "#FFFFFF", b: "#F7F8FA", angle: "0" },
    frameDefaults: {
      "social-avatar": { mode: "solid", a: "#E7E8EA", b: "#D9E1E4", angle: "0" },
      "social-post": { mode: "solid", a: "#ECEAE5", b: "#E1E5EB", angle: "0" }
    },
    views: {
      vertical: {
        width: 840, height: 1200,
        imageFrames: [
          { id: "social-avatar", x: 77, y: 78, width: 96, height: 96 },
          { id: "social-post", x: 75, y: 473, width: 690, height: 548 }
        ],
        sections: [
          { id: "account", slots: [
            { x: 195, y: 79, width: 329, height: 55, artOrientation: "horizontal", align: "xMinYMid meet" },
            { x: 195, y: 132, width: 305, height: 37, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "post-line-1", slots: [
            { x: 79, y: 227, width: 324, height: 97, artOrientation: "horizontal", align: "xMinYMid meet" },
            { x: 423, y: 227, width: 337, height: 97, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "post-line-2", slots: [
            { x: 79, y: 339, width: 324, height: 97, artOrientation: "horizontal", align: "xMinYMid meet" },
            { x: 423, y: 339, width: 337, height: 97, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ],
        socialDecor: {
          card: { x: 34, y: 34, width: 772, height: 1132, radius: 28 },
          separatorY: 204, bottomY: 1043,
          reactions: [{ x: 136, y: 1092 }, { x: 355, y: 1092 }, { x: 573, y: 1092 }]
        }
      },
      horizontal: {
        width: 1200, height: 840,
        imageFrames: [
          { id: "social-avatar", x: 84, y: 54, width: 95, height: 95 },
          { id: "social-post", x: 81, y: 386, width: 1038, height: 333 }
        ],
        sections: [
          { id: "account", slots: [
            { x: 198, y: 55, width: 385, height: 54, artOrientation: "horizontal", align: "xMinYMid meet" },
            { x: 198, y: 108, width: 365, height: 37, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "post-line-1", slots: [
            { x: 84, y: 193, width: 486, height: 77, artOrientation: "horizontal", align: "xMinYMid meet" },
            { x: 588, y: 193, width: 525, height: 77, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] },
          { id: "post-line-2", slots: [
            { x: 84, y: 287, width: 486, height: 77, artOrientation: "horizontal", align: "xMinYMid meet" },
            { x: 588, y: 287, width: 525, height: 77, artOrientation: "horizontal", align: "xMinYMid meet" }
          ] }
        ],
        socialDecor: {
          card: { x: 31, y: 22, width: 1138, height: 796, radius: 26 },
          separatorY: 176, bottomY: 740,
          reactions: [{ x: 154, y: 775 }, { x: 474, y: 775 }, { x: 795, y: 775 }]
        }
      }
    }
  };
  for (const [name, view] of Object.entries(layout.views)) {
    if (view.imageFrames.length !== 2 ||
        view.imageFrames[0].id !== "social-avatar" || view.imageFrames[1].id !== "social-post" ||
        view.sections.length !== 3 || view.sections.some(s => s.slots.length !== 2) ||
        view.sections.flatMap(s => s.slots).length !== layout.defaults.length) {
      throw new Error(`Social ${name}：圖片框或三區雙槽規格不正確`);
    }
  }
  global.SlowlyCoverSocialLayout = Object.freeze(layout);
  global.SlowlyCoverActiveLayout = global.SlowlyCoverSocialLayout;
})(window);
