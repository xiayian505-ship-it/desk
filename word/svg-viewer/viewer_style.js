"use strict";
/* SVG 檢視室｜介面控制：選檔、拖曳、背景、縮放、資訊與清除。 */
document.addEventListener("DOMContentLoaded", () => {
  const choose = document.getElementById("svg-file");
  const clearButton = document.getElementById("clear-file");
  const zoomSelect = document.getElementById("svg-zoom");
  const viewport = document.getElementById("svg-viewport");
  const stage = document.getElementById("viewer-stage");
  const image = document.getElementById("svg-preview");
  const placeholder = document.getElementById("viewer-placeholder");
  const status = document.getElementById("viewer-status");
  const liveState = document.getElementById("viewer-live-state");
  const infoFields = {
    name: document.getElementById("file-name"),
    size: document.getElementById("file-size"),
    dimensions: document.getElementById("file-dimensions"),
    viewBox: document.getElementById("file-viewbox"),
    animation: document.getElementById("file-animation")
  };

  if (!window.SlowlySVGViewer || !choose || !clearButton || !zoomSelect || !viewport || !stage || !image) {
    console.error("SVG 檢視室：必要元素不存在。");
    return;
  }

  function showState({ info, message, isError }) {
    status.textContent = message;
    status.classList.toggle("is-error", isError);
    placeholder.hidden = Boolean(info);
    viewport.classList.toggle("is-empty", !info);
    clearButton.disabled = !info;
    zoomSelect.disabled = !info;
    if (!info) zoomSelect.value = "1";

    liveState.textContent = info ? "已載入 · 僅在本機" : "尚未選擇檔案";
    infoFields.name.textContent = info?.name || "—";
    infoFields.size.textContent = info
      ? `${(info.bytes / 1024).toLocaleString("zh-TW", { maximumFractionDigits: 1 })} KB` : "—";
    infoFields.dimensions.textContent = info
      ? `${Math.round(info.width)} × ${Math.round(info.height)}（檢視比例）` : "—";
    infoFields.viewBox.textContent = info?.viewBox || "—";
    infoFields.animation.textContent = info?.animation || "—";
  }

  const viewer = window.SlowlySVGViewer.create({
    image,
    stage,
    viewport,
    onState: showState
  });

  // 即使瀏覽器嘗試回填表單，F5 仍維持空白檢視室。
  choose.value = "";
  viewer.clear();

  choose.addEventListener("change", () => {
    const file = choose.files?.[0];
    if (file) viewer.openFile(file);
  });

  clearButton.addEventListener("click", () => {
    choose.value = "";
    viewer.clear();
  });

  zoomSelect.addEventListener("change", () => viewer.setZoom(zoomSelect.value));

  document.querySelectorAll("[data-background]").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.background;
      if (!["checker", "light", "dark"].includes(name)) return;
      viewport.dataset.background = name;
      document.querySelectorAll("[data-background]").forEach(other => {
        other.setAttribute("aria-pressed", String(other === button));
      });
    });
  });

  let dragDepth = 0;
  viewport.addEventListener("dragenter", event => {
    if (!event.dataTransfer?.types.includes("Files")) return;
    event.preventDefault();
    dragDepth++;
    viewport.classList.add("is-dragover");
  });
  viewport.addEventListener("dragover", event => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
  });
  viewport.addEventListener("dragleave", event => {
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) viewport.classList.remove("is-dragover");
  });
  viewport.addEventListener("drop", event => {
    event.preventDefault();
    dragDepth = 0;
    viewport.classList.remove("is-dragover");
    const file = event.dataTransfer?.files?.[0];
    if (file) viewer.openFile(file);
  });

  window.addEventListener("pageshow", event => {
    if (event.persisted) {
      choose.value = "";
      viewer.clear();
    }
  });
});
