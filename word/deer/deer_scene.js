"use strict";
/* 鹿雨森官網 index.js 的相同軍火庫場景與參數，掛載在藝術字預覽框裡。
 * 不複製軍火庫森林、霧、雨的繪圖演算法；亦不影響透明下載。
 */
document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('art-stage');
  if (!stage) return;
  const instances = [];
  const dependencies = ['SlowlyPineForest', 'SlowlyCanvasFog', 'SlowlyCanvasRain'];
  const missing = dependencies.filter(name => !window[name]?.create);
  if (missing.length) {
    console.warn('逐鹿中原：部分鹿雨森背景零件未載入', missing);
    return;
  }
  try {
    instances.push(window.SlowlyPineForest.create({
      canvas: '#deer-forest',
      seed: 23,
      maxDpr: 1.5,
      density: 0.95,
      layers: [
        { baseline: 0.82, minHeight: 0.19, maxHeight: 0.39, color: '#173330', width: 0.39 },
        { baseline: 0.93, minHeight: 0.29, maxHeight: 0.51, color: '#0b2224', width: 0.39 }
      ]
    }));
    instances.push(window.SlowlyCanvasFog.create({
      canvas: '#deer-fog', count: 17, color: '#a4c9bd',
      opacity: 0.38, speed: 0.5, size: 1.1, maxDpr: 1.5, autoStart: true
    }));
    instances.push(window.SlowlyCanvasRain.create({
      canvas: '#deer-rain',
      count: Math.min(115, Math.max(38, Math.floor(stage.clientWidth / 8))),
      color: '#d2eeec', opacity: 0.65, speed: 0.7,
      wind: 0.13, length: 0.55, maxDpr: 1.5, autoStart: true
    }));
  } catch (error) {
    console.error('逐鹿中原：鹿雨森背景啟動失敗', error);
  }
  window.addEventListener('pagehide', () => {
    for (const instance of instances) {
      try { instance?.destroy?.(); } catch (error) { console.warn('鹿雨森背景清理失敗', error); }
    }
  }, { once: true });
});
