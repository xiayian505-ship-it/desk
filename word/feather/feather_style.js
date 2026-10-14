"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const verticalArt = window.SlowlyFeatherArt;
  const horizontalArt = window.SlowlyFeatherHorizontalArt;
  let art = verticalArt;
  let orientation = "vertical";
  const field = document.getElementById("art-text");
  const counter = document.getElementById("char-count");
  const image = document.getElementById("art-image");
  const status = document.getElementById("download-status");
  const form = document.getElementById("art-form");
  const svgBtn = document.getElementById("download-svg");
  const pngBtn = document.getElementById("download-png");
  const coverBtn = document.getElementById("download-cover");
  const animatedBtn = document.getElementById("download-animated-svg");
  const buttons = [svgBtn, pngBtn, coverBtn, animatedBtn];

  if (!field || !counter || !image || !status || !form || buttons.some(button => !button)) {
    console.error("黑羽舞動：找不到必要的頁面元素。");
    return;
  }
  if (!art) {
    status.textContent = "軍火庫文字產生器尚未載入，請確認 HTTPS 路徑與網路連線。";
    buttons.forEach(button => button.disabled = true);
    return;
  }

  let preview = art.createPreview(image);
  let current = "";
  let busy = false;
  let composing = false;

  function updateButtons() {
    buttons.forEach(button => button.disabled = busy || !current);
    animatedBtn.disabled = busy || !current || !window.SlowlyFeatherAnimatedArt;
  }

  function render(raw) {
    const rawCount = art.splitCharacters(raw).length;
    current = art.normalize(raw);
    if (field.value !== current) field.value = current;
    counter.textContent = `${art.splitCharacters(current).length} / ${art.MAX}`;
    updateButtons();

    if (!current) {
      preview.clear();
      image.alt = "請輸入文字以預覽黑羽舞動藝術字";
      status.textContent = "請輸入一至四個字。";
      return;
    }

    try {
      preview.set(current);
      image.alt = `${current}${orientation === 'horizontal' ? '橫式' : '直式'}黑羽舞動藝術字（透明背景）`;
      status.textContent = rawCount > art.MAX ? '最多四個字，已保留前四個字。' : '';
    } catch (error) {
      console.error(error);
      status.textContent = `預覽失敗：${error.message}`;
      current = '';
      updateButtons();
    }
  }

  const orientationButtons = Array.from(document.querySelectorAll('[data-orientation]'));
  const pngSpec = document.getElementById('png-spec');
  const svgSpec = document.getElementById('svg-spec');

  if (!horizontalArt) {
    const button = orientationButtons.find(item => item.dataset.orientation === 'horizontal');
    if (button) button.disabled = true;
    status.textContent = '橫式零件尚未載入，請檢查軍火庫 HTTPS 路徑。';
  }

  function chooseOrientation(next) {
    if (busy || next === orientation || (next === 'horizontal' && !horizontalArt)) return;
    preview.destroy();
    orientation = next;
    art = next === 'horizontal' ? horizontalArt : verticalArt;
    preview = art.createPreview(image);
    const horizontal = next === 'horizontal';
    image.classList.toggle('is-horizontal', horizontal);
    image.setAttribute('width', horizontal ? '1200' : '840');
    image.setAttribute('height', horizontal ? '760' : '1200');
    pngSpec.textContent = horizontal ? '2400 × 1520' : '1680 × 2400';
    svgSpec.textContent = horizontal ? '1200 × 760' : '840 × 1200';
    orientationButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.orientation === next)));
    render(field.value);
  }

  orientationButtons.forEach(button => button.addEventListener('click', () => chooseOrientation(button.dataset.orientation)));
  field.addEventListener('compositionstart', () => composing = true);
  field.addEventListener('compositionend', () => {
    composing = false;
    render(field.value);
  });
  field.addEventListener('input', () => {
    if (!composing) render(field.value);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!composing) render(field.value);
  });
  document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    field.value = button.dataset.example;
    render(field.value);
    field.focus();
  }));

  async function download(action, message) {
    if (!current || busy) return;
    const text = current;
    busy = true;
    updateButtons();
    status.textContent = message;
    try {
      const result = await action(text);
      status.textContent = `已送出下載：${result.filename}`;
    } catch (error) {
      console.error(error);
      status.textContent = `下載失敗：${error.message}`;
    } finally {
      busy = false;
      updateButtons();
    }
  }

  svgBtn.addEventListener('click', () => download(art.downloadSVG, '正在準備透明 SVG……'));
  pngBtn.addEventListener('click', () => download(art.downloadPNG, '正在生成高清透明 PNG……'));
  coverBtn.addEventListener('click', () => download(art.downloadCover, '正在生成角角者書封……'));
  animatedBtn.addEventListener('click', () => {
    if (window.SlowlyFeatherAnimatedArt) {
      download(text => window.SlowlyFeatherAnimatedArt.downloadSVG(text, orientation), '正在準備完整動態 SVG……');
    }
  });

  render(field.value);
  const stage = document.getElementById('feather-stage');
  if (stage && window.SlowlyGoldRain?.play) {
    // 網頁調用原軍火庫粒子雨，宿主只提供顏色；輸出圖由自足 SVG 粒子層負責。
    window.SlowlyGoldRain.play(stage, {
      count: 22,
      color: '#bfc1c9',
      glow: 'rgba(230, 233, 240, .68)',
      sizeMin: 1.5,
      sizeMax: 3.2,
      durationMin: 2100,
      durationMax: 3600,
      driftMin: -35,
      driftMax: 40,
      zIndex: 1
    }).catch(error => console.warn('Gold Rain 預覽未啟動：', error));
  }
  window.addEventListener('pagehide', () => preview.destroy());
});
