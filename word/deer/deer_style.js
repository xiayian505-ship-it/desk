"use strict";
/* 逐鹿中原：此檔只保留作品設定與專屬預覽特效。介面統一由 ../_shared/word_page.js 管理。 */
window.SlowlyWordPageConfig = Object.freeze({
  title: "逐鹿中原",
  initial: "逐鹿中原",
  placeholder: "例如：問鼎",
  examples: ["逐鹿中原", "問鼎", "群雄"],
  vertical: "SlowlyDeerArt",
  horizontal: "SlowlyDeerHorizontalArt",
  previewMode: "controller",
  animated: "SlowlyDeerAnimatedArt",
  mountEffects({ image, status }) {
    image.addEventListener('error', () => {
      status.textContent = 'SVG 預覽無法顯示，請確認裝置上的中文字型是否可用。';
    });
  },
});
