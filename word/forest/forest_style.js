"use strict";
/* 穿林打葉：此檔只保留作品設定與專屬預覽特效。介面統一由 ../_shared/word_page.js 管理。 */
window.SlowlyWordPageConfig = Object.freeze({
  title: "穿林打葉",
  initial: "穿林打葉",
  placeholder: "例如：山嵐",
  examples: ["穿林打葉", "山嵐", "風"],
  vertical: "SlowlyForestArt",
  horizontal: "SlowlyForestHorizontalArt",
  previewMode: "controller",
  mountEffects({ image, status }) {
    image.addEventListener('error', () => {
      status.textContent = 'SVG 預覽無法顯示，請確認裝置上的中文字型是否可用。';
    });
  },
});
