"use strict";

/* SVG 動畫轉檔室｜網站互動層
 * 表單、按鈕、提示、檔案拖曳都放這裡；不重寫圖像轉檔核心。
 */
(function (global) {
  const byId = identifier => document.getElementById(identifier);

  const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <title>慢慢 SVG 動畫轉檔範例</title>
  <g transform="translate(200 150)">
    <circle r="90" fill="none" stroke="#6e78ca" stroke-width="13"
            stroke-linecap="round" stroke-dasharray="65 24">
      <animateTransform attributeName="transform" type="rotate"
                        from="0 0 0" to="360 0 0" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle r="24" fill="#f4b65a">
      <animate attributeName="r" values="18;38;18" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="-95" r="7" fill="#6ac7ba"/>
    <circle cx="95" r="7" fill="#e58da6"/>
  </g>
  <text x="200" y="274" fill="#3c466c" font-family="sans-serif" font-size="17"
        text-anchor="middle">這一圈應該要轉動</text>
</svg>`;

  let loaded = false;
  let exporting = false;
  let filename = "範例旋轉圓環.svg";

  function status(message, isError = false) {
    const element = byId("conversion-status");
    element.textContent = message;
    element.dataset.error = String(isError);
  }

  function selectedIcoSizes() {
    return Array.from(document.querySelectorAll("#ico-size-box input:checked"))
      .map(input => Number(input.value));
  }

  function settings() {
    return {
      width: byId("export-width").value,
      duration: byId("animation-duration").value,
      fps: byId("animation-fps").value,
      stillTime: byId("still-time").value,
      transparent: byId("transparent-background").checked,
      background: byId("background-color").value,
      icoSizes: selectedIcoSizes()
    };
  }

  function refreshSize() {
    const converter = global.SlowlySVGConverter;
    const info = converter.getInfo();
    if (!info) return;
    try {
      const result = converter.getSize(settings().width);
      byId("output-size").textContent = `輸出 ${result.width} × ${result.height} px`;
    } catch (error) {
      byId("output-size").textContent = error.message;
    }
  }

  function updateAvailableFormats() {
    const mime = global.SlowlySVGConverter.getSupportedFormats();
    const formatSupport = byId("format-support");
    formatSupport.textContent = [
      `MP4：${mime.mp4 ? "此瀏覽器支援" : "此瀏覽器不支援"}`,
      `WebM：${mime.webm ? "此瀏覽器支援" : "此瀏覽器不支援"}`
    ].join("　｜　");

    const hasIcoSize = selectedIcoSizes().length > 0;

    for (const button of document.querySelectorAll("[data-download-format]")) {
      const format = button.dataset.downloadFormat;
      const supported = format === "mp4"
        ? !!mime.mp4
        : format === "webm"
          ? !!mime.webm
          : format === "ico"
            ? hasIcoSize
            : true;
      button.disabled = exporting || !loaded || !supported;
      if (format === "ico" && !hasIcoSize) {
        button.title = "請至少勾選一個 ICO 尺寸";
      } else {
        button.title = supported ? "" : `目前瀏覽器無法錄製 ${format.toUpperCase()}`;
      }
    }
  }

  async function applySource(source, fileName) {
    if (exporting) return;
    try {
      const info = await global.SlowlySVGConverter.load(source, fileName);
      loaded = true;
      filename = fileName;
      byId("svg-source").value = source;
      byId("source-size").textContent = `來源 ${Math.round(info.width)} × ${Math.round(info.height)}`;
      byId("animation-detection").textContent = info.animated ? "已找到 SVG 動畫" : "未偵測到動畫，仍可匯出靜態格式";
      const width = Math.max(160, Math.min(560, Math.round(info.width / 2) * 2));
      byId("export-width").value = width;
      refreshSize();
      updateAvailableFormats();
      status(`已載入「${info.filename}」。請預覽動作是否正常，再選擇下載格式。`);
    } catch (error) {
      status(`載入失敗：${error.message}`, true);
      console.error("SVG 載入失敗", error);
    }
  }

  async function openFile(file) {
    if (!file || exporting) return;
    if (!/\.svg$/i.test(file.name) && file.type !== "image/svg+xml") {
      status("請選擇副檔名為 .svg 的檔案。", true);
      return;
    }
    if (file.size > 2_000_000) {
      status("檔案超過 2 MB，請換較小的 SVG。", true);
      return;
    }
    await applySource(await file.text(), file.name);
  }

  function busy(value) {
    exporting = value;
    document.body.classList.toggle("is-exporting", value);
    updateAvailableFormats();
    for (const identifier of ["svg-file", "svg-source", "apply-source", "export-width",
      "animation-duration", "animation-fps", "still-time", "transparent-background",
      "background-color", "load-example", "replay-animation"]) {
      byId(identifier).disabled = value;
    }
    byId("export-progress").hidden = !value;
    if (!value) byId("export-progress").value = 0;
  }

  async function download(format) {
    if (!loaded || exporting) return;
    busy(true);
    byId("export-progress").value = 0;
    status(`正在準備 ${format.toUpperCase()}，轉換期間請保持分頁開啟。`);
    const progress = fraction => { byId("export-progress").value = fraction; };
    const start = performance.now();
    try {
      let result;
      if (format === "png") {
        result = await global.SlowlySVGConverter.exportPNG(settings(), progress);
      } else if (format === "ico") {
        result = await global.SlowlySVGConverter.exportICO(settings(), progress);
      } else if (format === "gif") {
        result = await global.SlowlySVGConverter.exportGIF(settings(), progress);
      } else {
        result = await global.SlowlySVGConverter.exportVideo(format, settings(), progress);
      }
      const megabytes = (result.bytes / 1024 / 1024).toFixed(2);
      const seconds = ((performance.now() - start) / 1000).toFixed(1);
      status(`已送出下載：${result.filename}（${megabytes} MB，耗時 ${seconds} 秒）。`);
    } catch (error) {
      status(`轉換失敗：${error.message}`, true);
      console.error(`${format.toUpperCase()} 匯出失敗`, error);
    } finally {
      busy(false);
    }
  }

  function initialize() {
    byId("svg-file").addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (file) openFile(file);
      event.target.value = "";
    });
    byId("apply-source").addEventListener("click", () => {
      applySource(byId("svg-source").value, filename);
    });
    byId("load-example").addEventListener("click", () => {
      applySource(SAMPLE_SVG, "範例旋轉圓環.svg");
    });
    byId("replay-animation").addEventListener("click", () => {
      if (loaded && !exporting) global.SlowlySVGConverter.replay();
    });
    byId("export-width").addEventListener("input", refreshSize);
    for (const checkbox of document.querySelectorAll("#ico-size-box input")) {
      checkbox.addEventListener("change", updateAvailableFormats);
    }
    for (const button of document.querySelectorAll("[data-download-format]")) {
      button.addEventListener("click", () => download(button.dataset.downloadFormat));
    }

    const dropZone = byId("file-drop-zone");
    dropZone.addEventListener("dragover", event => {
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-dragging"));
    dropZone.addEventListener("drop", event => {
      event.preventDefault();
      dropZone.classList.remove("is-dragging");
      if (!exporting && event.dataTransfer.files[0]) openFile(event.dataTransfer.files[0]);
    });
    dropZone.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        byId("svg-file").click();
      }
    });

    updateAvailableFormats();
    applySource(SAMPLE_SVG, "範例旋轉圓環.svg");
  }

  document.addEventListener("DOMContentLoaded", initialize);
})(window);
