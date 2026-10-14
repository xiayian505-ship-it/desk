"use strict";
/* 電閃雷鳴：此檔只保留作品設定與專屬預覽特效。介面統一由 ../shared/word_page.js 管理。 */
window.SlowlyWordPageConfig = Object.freeze({
  title: "電閃雷鳴",
  initial: "電閃雷鳴",
  placeholder: "例如：驚雷",
  examples: ["電閃雷鳴", "驚雷", "裂光"],
  vertical: "SlowlyThunderArt",
  horizontal: "SlowlyThunderHorizontalArt",
  animated: "SlowlyThunderAnimatedArt",
  mountEffects({ field, getText }) {
    const frame = document.getElementById('preview-frame');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let previous = getText();
    function pulse() {
      const current = getText();
      if (!current || current === previous || reduced?.matches || !frame) return;
      previous = current;
      frame.querySelector('.sbs-flash-shake-layer')?.remove();
      const light = document.createElement('span');
      light.className = 'sbs-flash-shake-layer';
      light.dataset.sbsRespectReducedMotion = 'true';
      light.style.setProperty('--sbs-flash-core', 'rgba(213,244,255,.40)');
      light.style.setProperty('--sbs-flash-mid', 'rgba(102,171,255,.14)');
      light.style.setProperty('--sbs-flash-peak', '.16');
      light.style.setProperty('--sbs-flash-duration', '380ms');
      frame.append(light);
      light.addEventListener('animationend', () => light.remove(), { once: true });
    }
    field.addEventListener('input', pulse);
    return () => field.removeEventListener('input', pulse);
  },
});
