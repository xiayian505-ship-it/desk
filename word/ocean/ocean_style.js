"use strict";
/* 煙波浩渺：此檔只保留作品設定與專屬預覽特效。介面統一由 ../shared/word_page.js 管理。 */
window.SlowlyWordPageConfig = Object.freeze({
  title: "煙波浩渺",
  initial: "煙波浩渺",
  placeholder: "例如：海霧",
  examples: ["煙波浩渺", "海霧", "潮汐"],
  vertical: "SlowlyOceanArt",
  horizontal: "SlowlyOceanHorizontalArt",
  animated: "SlowlyOceanExportArt",
  mountEffects() {
    const canvas = document.getElementById('ocean-fog');
    let fog = null;
    try {
      if (canvas && window.SlowlyCanvasFog?.create) {
        fog = window.SlowlyCanvasFog.create({ canvas, count: 14, color: '#f4ffff', opacity: .4, speed: .16, size: .62, autoStart: true });
      }
    } catch (error) { console.warn('煙波浩渺：霧層未啟動', error); }
    if (canvas) canvas.dataset.fogReady = fog ? 'true' : 'false';
    return () => fog?.destroy();
  },
  onPreview({ text, url }) {
    const canvas = document.getElementById('ocean-fog');
    if (!canvas) return;
    const visible = !!(text && url && canvas.dataset.fogReady === 'true');
    canvas.style.visibility = visible ? 'visible' : 'hidden';
    canvas.style.maskImage = visible ? `url("${url}")` : 'none';
    canvas.style.webkitMaskImage = canvas.style.maskImage;
  },
  onOrientation({ orientation }) {
    document.getElementById('ocean-visual')?.classList.toggle('is-horizontal', orientation === 'horizontal');
  },
});
