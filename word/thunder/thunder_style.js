"use strict";
/* 互動與介面管理，繪圖本體由 thunder.js 負責。 */
document.addEventListener('DOMContentLoaded', () => {
  const verticalArt = window.SlowlyThunderArt;
  const horizontalArt = window.SlowlyThunderHorizontalArt;
  let art = verticalArt;
  let orientation = 'vertical';
  const field = document.getElementById('art-text'), form = document.getElementById('art-form'), counter = document.getElementById('char-count');
  const preview = document.getElementById('art-image'), frame = document.getElementById('preview-frame'), status = document.getElementById('download-status');
  const buttons = { svg: document.getElementById('download-svg'), png: document.getElementById('download-png'), cover: document.getElementById('download-cover') };
  if (!art || !field || !form || !counter || !preview || !frame || !status || Object.values(buttons).some(x => !x)) {
    console.error('電閃雷鳴：找不到 UI 元素或生成程式。');
    return;
  }
  let current = '', composing = false, busy = false, previewUrl = null, seq = 0;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const enable = () => Object.values(buttons).forEach(b => b.disabled = busy || !current);
  function update(input) {
    const orig = art.chars(input).length;
    textUpdate(art.normalize(input));
    function textUpdate(value) {
      current = value;
      if (field.value !== value) field.value = value;
      counter.textContent = `${art.chars(value).length} / ${art.MAX}`;
      enable();
      if (!value) {
        preview.removeAttribute('src');
        status.textContent = '輸入文字開始生成。';
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          previewUrl = null;
        }
        return;
      }
      try {
        const newURL = art.url(art.generateSVG(value));
        const oldURL = previewUrl;
        previewUrl = newURL;
        // 避免連續輸入時較晚完成的舊預覽移除新 URL。
        const thisSeq = ++seq;
        const release = () => {
          if (oldURL) URL.revokeObjectURL(oldURL);
        };
        preview.onload = () => {
          if (thisSeq === seq) release();
        };
        preview.onerror = () => {
          if (thisSeq === seq) {
            release();
            status.textContent = '預覽失敗：請確認瀏覽器支援 SVG。';
          }
        };
        preview.src = newURL;
        preview.alt = `${value}，${orientation === 'horizontal' ? '橫式' : '直式'}雷電藝術字（透明背景）`;
        status.textContent = orig > art.MAX ? '最多四個字，已保留前四字。' : '';
      } catch (err) {
        console.error(err);
        status.textContent = `生成失敗：${err.message}`;
        current = '';
        enable();
      }
    }
  }
  const orientationButtons = Array.from(document.querySelectorAll('[data-orientation]'));
  const svgSpec = document.getElementById('svg-spec');
  const pngSpec = document.getElementById('png-spec');
  const fact = document.getElementById('orientation-fact');
  if (!horizontalArt) {
    const button = orientationButtons.find(item => item.dataset.orientation === 'horizontal');
    if (button) button.disabled = true;
    status.textContent = '橫式零件尚未載入，請檢查軍火庫 HTTPS 路徑。';
  }
  function chooseOrientation(next) {
    if (busy || next === orientation || (next === 'horizontal' && !horizontalArt)) return;
    orientation = next;
    art = next === 'horizontal' ? horizontalArt : verticalArt;
    const horizontal = next === 'horizontal';
    preview.classList.toggle('is-horizontal', horizontal);
    preview.setAttribute('width', horizontal ? '1200' : '840');
    preview.setAttribute('height', horizontal ? '760' : '1200');
    svgSpec.textContent = horizontal ? '1200 × 760 · 透明' : '840 × 1200 · 透明';
    pngSpec.textContent = horizontal ? '2400 × 1520 · 2 倍' : '1680 × 2400 · 2 倍';
    fact.textContent = horizontal ? 'HORIZONTAL' : 'VERTICAL';
    orientationButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.orientation === next));
    });
    update(field.value);
  }
  orientationButtons.forEach(button => button.addEventListener('click', () => {
    chooseOrientation(button.dataset.orientation);
  }));

  field.addEventListener('compositionstart', () => {
    composing = true;
  });
  field.addEventListener('compositionend', () => {
    composing = false;
    update(field.value);
  });
  field.addEventListener('input', () => {
    if (!composing) update(field.value);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!composing) update(field.value);
  });
  document.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => {
    field.value = b.dataset.example;
    update(field.value);
    field.focus();
  }));
  async function download(kind) {
    if (busy || !current) return;
    busy = true;
    enable();
    status.textContent = kind === 'svg' ? '正在準備 SVG……' : kind === 'png' ? '正在繪製透明 PNG……' : '正在產生 700 × 1000 書封……';
    const action = kind === 'svg' ? art.downloadSVG : kind === 'png' ? art.downloadPNG : art.downloadCover;
    try {
      const info = await action(current);
      status.textContent = `已送出下載：${info.filename}`;
    }
    catch (err) {
      console.error(err);
      status.textContent = `下載失敗：${err.message}`;
    }
    finally {
      busy = false;
      enable();
    }
  }
  buttons.svg.addEventListener('click', () => download('svg'));
  buttons.png.addEventListener('click', () => download('png'));
  buttons.cover.addEventListener('click', () => download('cover'));
  // 軍火庫 flash_shake 是受控類名；宿主只在換字時觸發一個很輕的雷光脈衝。
  function blink() {
    if (reduceMotion?.matches) return;
    const old = frame.querySelector('.sbs-flash-shake-layer');
    old?.remove();
    const pulse = document.createElement('span');
    pulse.className = 'sbs-flash-shake-layer';
    pulse.dataset.sbsRespectReducedMotion = 'true';
    pulse.style.setProperty('--sbs-flash-core', 'rgba(213,244,255,.40)');
    pulse.style.setProperty('--sbs-flash-mid', 'rgba(102,171,255,.14)');
    pulse.style.setProperty('--sbs-flash-peak', '.16');
    pulse.style.setProperty('--sbs-flash-duration', '380ms');
    frame.appendChild(pulse);
    pulse.addEventListener('animationend', () => pulse.remove(), { once: true });
  }
  let was = '';
  field.addEventListener('input', () => {
    if (!composing && current && current !== was) {
      was = current;
      blink();
    }
  });
  update(field.value);
  window.addEventListener('pagehide', () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
});
