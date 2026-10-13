"use strict";
/* 林風系列的互動 UI；不複製軍火庫文字生成／下載功能。 */
document.addEventListener("DOMContentLoaded", () => {
  const art = window.SlowlyForestArt;
  const field = document.getElementById("art-text");
  const counter = document.getElementById("char-count");
  const image = document.getElementById("art-image");
  const status = document.getElementById("download-status");
  const form = document.getElementById("art-form");
  const svgButton = document.getElementById("download-svg");
  const pngButton = document.getElementById("download-png");
  const coverButton = document.getElementById("download-cover");
  const buttons = [svgButton, pngButton, coverButton];

  if (!field || !counter || !image || !status || !form || buttons.some(button => !button)) {
    console.error("林風藝術字：找不到必要的頁面元素。");
    return;
  }
  if (!art) {
    status.textContent = "軍火庫文字產生器尚未載入，請確認 HTTPS 路徑與網路連線。";
    buttons.forEach(button => button.disabled = true);
    return;
  }

  const preview = art.createPreview(image);
  let current = "";
  let busy = false;
  let composing = false;

  function updateButtons() {
    buttons.forEach(button => {
      button.disabled = busy || !current;
    });
  }

  function render(raw) {
    const count = art.splitCharacters(raw).length;
    current = art.normalize(raw);
    if (field.value !== current) field.value = current;
    counter.textContent = `${art.splitCharacters(current).length} / ${art.MAX}`;
    updateButtons();

    if (!current) {
      preview.clear();
      image.alt = "請輸入文字以預覽林風藝術字";
      status.textContent = "請輸入一至四個字。";
      return;
    }

    try {
      preview.set(current);
      image.alt = `${current}直式林風木刻藝術字，背景透明`;
      status.textContent = count > art.MAX ? "最多四個字，已保留前四個。" : "";
    } catch (error) {
      console.error("藝術字預覽失敗：", error);
      status.textContent = `預覽失敗：${error.message}`;
      current = "";
      updateButtons();
    }
  }

  field.addEventListener("compositionstart", () => {
    composing = true;
  });
  field.addEventListener("compositionend", () => {
    composing = false;
    render(field.value);
  });
  field.addEventListener("input", () => {
    if (!composing) render(field.value);
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!composing) render(field.value);
  });

  document.querySelectorAll("[data-example]").forEach(button => {
    button.addEventListener("click", () => {
      field.value = button.dataset.example;
      render(field.value);
      field.focus();
    });
  });

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
      console.error("下載失敗：", error);
      status.textContent = `下載失敗：${error.message}`;
    } finally {
      busy = false;
      updateButtons();
    }
  }

  svgButton.addEventListener("click", () => download(art.downloadSVG, "正在準備透明 SVG……"));
  pngButton.addEventListener("click", () => download(art.downloadPNG, "正在生成高清透明 PNG……"));
  coverButton.addEventListener("click", () => download(art.downloadCover, "正在生成角角者書封……"));

  image.addEventListener("error", () => {
    status.textContent = "SVG 預覽無法顯示，請確認裝置上的中文字型是否可用。";
  });
  render(field.value);
  window.addEventListener("pagehide", () => preview.destroy());
});
