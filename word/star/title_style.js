"use strict";
/* 星辰藝術字產生器｜頁面 UI（與圖像輸出核心 title.js 分離） */
document.addEventListener("DOMContentLoaded", () => {
  const core = window.SlowlyStarArt;
  const field = document.getElementById("art-text");
  const counter = document.getElementById("char-count");
  const image = document.getElementById("art-image");
  const status = document.getElementById("download-status");
  const pngSpec = document.getElementById("png-spec");
  const svgButton = document.getElementById("download-svg");
  const pngButton = document.getElementById("download-png");
  const form = document.getElementById("art-form");
  if (!core || !field || !counter || !image || !status || !pngSpec || !svgButton || !pngButton) return;

  let currentText = "";
  const previewURLs = new Set();
  let composing = false;
  let busy = false;

  function setButtons(enabled) { svgButton.disabled = pngButton.disabled = !enabled || busy; }
  function render(input) {
    const chars = core.splitCharacters(input);
    const text = core.normalize(input);
    if (field.value !== text) field.value = text;
    currentText = text;
    counter.textContent = `${core.splitCharacters(text).length} / ${core.MAX_COUNT}`;
    const valid = !!text;
    setButtons(valid);
    if (!valid) {
      image.removeAttribute("src"); image.alt = "請輸入一至四個字預覽藝術字";
      pngSpec.textContent = "透明背景 PNG";
      for (const url of previewURLs) URL.revokeObjectURL(url);
      previewURLs.clear();
      status.textContent = "輸入一個字就能開始生成。";
      return;
    }
    try {
      const svg = core.generateSVG(text);
      const url = core.makeUrl(svg);
      previewURLs.add(url);
      image.onload = () => {
        for (const old of previewURLs) {
          if (old !== url) URL.revokeObjectURL(old);
        }
        previewURLs.clear();
        previewURLs.add(url);
      };
      image.onerror = () => { status.textContent = "預覽無法顯示，請確認瀏覽器支援 SVG。"; };
      image.src = url;
      image.alt = `${text}的直式星光藝術字（透明背景）`;
      const size = core.outputSize(text, 2);
      pngSpec.textContent = `${size.width} × ${size.height}・透明`;
      if (chars.length > core.MAX_COUNT) status.textContent = `最多四個字，已保留前 ${core.MAX_COUNT} 個。`;
      else status.textContent = "";
    } catch (error) {
      console.error(error);
      status.textContent = `生成失敗：${error.message}`;
      setButtons(false);
    }
  }
  field.addEventListener("compositionstart", () => { composing = true; });
  field.addEventListener("compositionend", () => { composing = false; render(field.value); });
  field.addEventListener("input", () => { if (!composing) render(field.value); });
  // 由表單 Enter 確認文字，不讓瀏覽器提交並重整。
  form.addEventListener("submit", event => { event.preventDefault(); if (!composing) render(field.value); });
  document.querySelectorAll("[data-example]").forEach(button => {
    button.addEventListener("click", () => { field.value = button.dataset.example; render(field.value); field.focus(); });
  });
  async function startDownload(button, action, pendingText) {
    if (busy || !currentText) return;
    busy = true; setButtons(true);
    status.textContent = pendingText;
    try {
      const result = await action(currentText);
      status.textContent = `已送出下載：${result.filename}`;
    } catch (error) {
      console.error("下載失敗：", error);
      status.textContent = `下載失敗：${error.message}`;
    } finally { busy = false; setButtons(!!currentText); }
  }
  svgButton.addEventListener("click", () => startDownload(svgButton, core.downloadSVG, "正在準備透明 SVG……"));
  pngButton.addEventListener("click", () => startDownload(pngButton, text => core.downloadPNG(text, 2), "正在製作透明 PNG……"));
  render(field.value);
  window.addEventListener("pagehide", () => {
    for (const url of previewURLs) URL.revokeObjectURL(url);
    previewURLs.clear();
  });
});
