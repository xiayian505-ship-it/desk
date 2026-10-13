"use strict";
/* 開卷有益：頁面 UI 與下載互動，藝術字輸出交由 book.js / book_horizontal.js。 */
document.addEventListener('DOMContentLoaded', () => {
  const verticalArt = window.SlowlyBookArt;
  const horizontalArt = window.SlowlyBookHorizontalArt;
  let art = verticalArt;
  let orientation = 'vertical';
  const field = document.getElementById('art-text');
  const count = document.getElementById('char-count');
  const preview = document.getElementById('art-image');
  const status = document.getElementById('download-status');
  const form = document.getElementById('art-form');
  const svgBtn = document.getElementById('download-svg');
  const pngBtn = document.getElementById('download-png');
  const coverBtn = document.getElementById('download-cover');
  if (!art || !field || !count || !preview || !status || !form || !svgBtn || !pngBtn || !coverBtn) {
    console.error('開卷有益：頁面元素或生成功能遺失。');
    return;
  }
  let current = '', busy = false, composing = false, previewURL = null;
  function enableButtons() {
    const disabled = !current || busy;
    [svgBtn, pngBtn, coverBtn].forEach(button => button.disabled = disabled);
  }
  function update(input) {
    const rawCount = art.characters(input).length;
    current = art.normalize(input);
    if (field.value !== current) field.value = current;
    count.textContent = `${art.characters(current).length} / ${art.MAX}`;
    enableButtons();
    if (!current) {
      preview.removeAttribute('src');
      preview.alt = '輸入文字以預覽開卷有益';
      status.textContent = '請先輸入文字。';
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
        previewURL = null;
      }
      return;
    }
    try {
      const svg = art.generateSVG(current);
      const url = art.makeURL(svg);
      const oldURL = previewURL;
      preview.onload = () => { if (oldURL) URL.revokeObjectURL(oldURL); };
      preview.onerror = () => {
        status.textContent = '預覽失敗，請檢查瀏覽器是否支援 SVG。';
        if (oldURL) URL.revokeObjectURL(oldURL);
      };
      previewURL = url;
      preview.src = url;
      preview.alt = `${current}的${orientation === 'horizontal' ? '橫式' : '直式'}古書藝術字（透明背景）`;
      status.textContent = rawCount > art.MAX ? '最多四個字，已保留前四個字。' : '';
    } catch (e) {
      console.error(e);
      status.textContent = `生成失敗：${e.message}`;
      current = '';
      enableButtons();
    }
  }
  const orientationButtons = Array.from(document.querySelectorAll('[data-orientation]'));
  const pngSpec = document.getElementById('png-spec');
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
    pngSpec.textContent = horizontal ? '2400 × 1520 · 高清' : '1680 × 2400 · 高清';
    orientationButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.orientation === next));
    });
    update(field.value);
  }
  orientationButtons.forEach(button => button.addEventListener('click', () => chooseOrientation(button.dataset.orientation)));
  field.addEventListener('compositionstart', () => composing = true);
  field.addEventListener('compositionend', () => { composing = false; update(field.value); });
  field.addEventListener('input', () => { if (!composing) update(field.value); });
  form.addEventListener('submit', event => { event.preventDefault(); if (!composing) update(field.value); });
  document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    field.value = button.dataset.example;
    update(field.value);
    field.focus();
  }));
  async function download(action, message) {
    if (busy || !current) return;
    busy = true;
    enableButtons();
    status.textContent = message;
    try {
      const result = await action(current);
      status.textContent = `已送出下載：${result.filename}`;
    } catch (e) {
      console.error(e);
      status.textContent = `下載失敗：${e.message}`;
    } finally {
      busy = false;
      enableButtons();
    }
  }
  svgBtn.addEventListener('click', () => download(art.downloadSVG, '正在準備 SVG……'));
  pngBtn.addEventListener('click', () => download(art.downloadPNG, '正在繪製高清透明 PNG……'));
  coverBtn.addEventListener('click', () => download(art.downloadCover, '正在繪製 700 × 1000 書封……'));
  update(field.value);
  window.addEventListener('pagehide', () => {
    if (previewURL) URL.revokeObjectURL(previewURL);
  });
});
