"use strict";
/* 玉潤生輝：宿主介面控制。作品材質在本系列 template，輸出使用軍火庫。 */
document.addEventListener('DOMContentLoaded', () => {
  const verticalArt = window.SlowlyJadeArt;
  const horizontalArt = window.SlowlyJadeHorizontalArt;
  let orientation = 'vertical';
  let art = verticalArt;
  const field = document.getElementById('art-text');
  const count = document.getElementById('char-count');
  const preview = document.getElementById('art-image');
  const status = document.getElementById('download-status');
  const form = document.getElementById('art-form');
  const buttons = {
    svg: document.getElementById('download-svg'),
    png: document.getElementById('download-png'),
    cover: document.getElementById('download-cover'),
    animated: document.getElementById('download-animated-svg')
  };
  if (!verticalArt || !horizontalArt || !field || !count || !preview || !status || !form) {
    console.error('玉潤生輝：頁面元素或軍火庫生成功能缺失。');
    return;
  }
  let current = '';
  let busy = false;
  let composing = false;
  let previewURL = null;
  function enableButtons() {
    Object.values(buttons).filter(Boolean).forEach(button => {
      button.disabled = !current || busy;
    });
  }
  function update(input) {
    const originalLength = art.characters(input).length;
    current = art.normalize(input);
    if (field.value !== current) field.value = current;
    count.textContent = `${art.characters(current).length} / ${art.MAX}`;
    enableButtons();
    if (!current) {
      preview.removeAttribute('src');
      status.textContent = '請先輸入文字。';
      if (previewURL) URL.revokeObjectURL(previewURL);
      previewURL = null;
      return;
    }
    try {
      const svg = art.hasAnimatedSVG ? art.generateAnimatedSVG(current) : art.generateSVG(current);
      const url = art.makeURL(svg);
      const oldURL = previewURL;
      preview.onload = () => { if (oldURL) URL.revokeObjectURL(oldURL); };
      preview.onerror = () => {
        status.textContent = '預覽失敗，請檢查 SVG 格式及軍火庫載入狀態。';
        if (oldURL) URL.revokeObjectURL(oldURL);
      };
      previewURL = url;
      preview.src = url;
      preview.alt = `${current}的${orientation === 'horizontal' ? '橫式' : '直式'}玉潤生輝透明藝術字`;
      status.textContent = originalLength > art.MAX ? '最多四個字，已保留前四字。' : '';
    } catch (error) {
      console.error(error);
      status.textContent = `生成失敗：${error.message}`;
      current = '';
      enableButtons();
    }
  }
  const orientationButtons = Array.from(document.querySelectorAll('[data-orientation]'));
  const pngSpec = document.getElementById('png-spec');
  function chooseOrientation(next) {
    if (busy || next === orientation || !['vertical', 'horizontal'].includes(next)) return;
    orientation = next;
    art = next === 'horizontal' ? horizontalArt : verticalArt;
    preview.classList.toggle('is-horizontal', next === 'horizontal');
    preview.setAttribute('width', next === 'horizontal' ? '1200' : '840');
    preview.setAttribute('height', next === 'horizontal' ? '760' : '1200');
    pngSpec.textContent = next === 'horizontal' ? '2400 × 1520' : '1680 × 2400';
    orientationButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.orientation === next));
    });
    update(field.value);
  }
  orientationButtons.forEach(button => button.addEventListener('click', () => chooseOrientation(button.dataset.orientation)));
  field.addEventListener('compositionstart', () => { composing = true; });
  field.addEventListener('compositionend', () => { composing = false; update(field.value); });
  field.addEventListener('input', () => { if (!composing) update(field.value); });
  form.addEventListener('submit', event => { event.preventDefault(); if (!composing) update(field.value); });
  document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    field.value = button.dataset.example;
    update(field.value);
    field.focus();
  }));
  async function download(method, progress) {
    if (!current || busy) return;
    busy = true;
    enableButtons();
    status.textContent = progress;
    try {
      const result = await method(current);
      status.textContent = `已送出下載：${result.filename}`;
    } catch (error) {
      console.error(error);
      status.textContent = `下載失敗：${error.message}`;
    } finally {
      busy = false;
      enableButtons();
    }
  }
  buttons.svg.addEventListener('click', () => download(art.downloadSVG, '正在準備 SVG……'));
  buttons.png.addEventListener('click', () => download(art.downloadPNG, '正在繪製透明 PNG……'));
  buttons.cover.addEventListener('click', () => download(art.downloadCover, '正在繪製 700 × 1000 書封……'));
  if (buttons.animated) buttons.animated.addEventListener('click', () => download(art.downloadAnimatedSVG, '正在準備動態 SVG……'));
  update(field.value);
  window.addEventListener('pagehide', () => { if (previewURL) URL.revokeObjectURL(previewURL); });
});
