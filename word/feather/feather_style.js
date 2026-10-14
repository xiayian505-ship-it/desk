"use strict";
/* 黑羽舞動：此檔只保留作品設定與專屬預覽特效。介面統一由 ../_shared/word_page.js 管理。 */
window.SlowlyWordPageConfig = Object.freeze({
  title: "黑羽舞動",
  initial: "黑羽舞動",
  placeholder: "例如：羽翼",
  examples: ["黑羽舞動", "羽翼", "黑羽"],
  vertical: "SlowlyFeatherArt",
  horizontal: "SlowlyFeatherHorizontalArt",
  previewMode: "controller",
  animated: "SlowlyFeatherAnimatedArt",
  mountEffects() {
    const stage = document.getElementById('feather-stage');
    if (stage && window.SlowlyGoldRain?.play) {
      window.SlowlyGoldRain.play(stage, {
        count: 22, color: '#bfc1c9', glow: 'rgba(230, 233, 240, .68)',
        sizeMin: 1.5, sizeMax: 3.2, durationMin: 2100, durationMax: 3600,
        driftMin: -35, driftMax: 40, zIndex: 1
      }).catch(error => console.warn('黑羽舞動：Gold Rain 預覽未啟動', error));
    }
  },
});
