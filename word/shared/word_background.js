"use strict";
/* 慢慢藝術字｜背景 PNG 共用輸出
 * 僅把靜態藝術字 SVG 疊在 Canvas 背景上；不修改 SVG、單款生成器或原本的下載流程。
 */
(function (global) {
  const MODES = Object.freeze({ solid: '單色', contrast: '撞色', gradient: '漸層' });
  const DIRECTIONS = Object.freeze({
    horizontal: 'to right',
    diagonal: 'to bottom right',
    vertical: 'to bottom',
    reverseDiagonal: 'to bottom left'
  });

  function validate(settings) {
    const mode = settings?.mode;
    const direction = settings?.direction;
    const colorA = settings?.colorA;
    const colorB = settings?.colorB;
    if (!Object.hasOwn(MODES, mode)) throw new Error('背景模式無效。');
    if (!Object.hasOwn(DIRECTIONS, direction)) throw new Error('背景方向無效。');
    if (!/^#[\da-f]{6}$/i.test(colorA) || !/^#[\da-f]{6}$/i.test(colorB)) {
      throw new Error('背景顏色格式無效。');
    }
    return { mode, direction, colorA, colorB };
  }

  function previewCSS(settings) {
    const { mode, direction, colorA, colorB } = validate(settings);
    if (mode === 'solid') return `linear-gradient(${colorA}, ${colorA})`;
    const stops = mode === 'contrast'
      ? `${colorA} 0%, ${colorA} 50%, ${colorB} 50%, ${colorB} 100%`
      : `${colorA} 0%, ${colorB} 100%`;
    return `linear-gradient(${DIRECTIONS[direction]}, ${stops})`;
  }

  function points(direction, width, height) {
    switch (direction) {
      case 'horizontal': return [0, height / 2, width, height / 2];
      case 'vertical': return [width / 2, 0, width / 2, height];
      case 'diagonal': return [0, 0, width, height];
      case 'reverseDiagonal': return [width, 0, 0, height];
      default: throw new Error('不支援的背景方向。');
    }
  }

  function paint(context, width, height, settings) {
    const { mode, direction, colorA, colorB } = validate(settings);
    if (mode === 'solid') {
      context.fillStyle = colorA;
    } else {
      const gradient = context.createLinearGradient(...points(direction, width, height));
      gradient.addColorStop(0, colorA);
      if (mode === 'contrast') {
        gradient.addColorStop(0.5, colorA);
        gradient.addColorStop(0.5, colorB);
      }
      gradient.addColorStop(1, colorB);
      context.fillStyle = gradient;
    }
    context.fillRect(0, 0, width, height);
  }

  async function imageFromSVG(svg) {
    if (typeof svg !== 'string' || !/<svg(?:\s|>)/i.test(svg)) {
      throw new Error('作品未產生有效的 SVG。');
    }
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    try {
      return await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('作品 SVG 無法轉成圖片，請確認字型及外部素材。'));
        image.src = url;
      });
    } finally {
      // 完成解碼後才釋放來源；drawImage 對已載入的 image 仍然有效。
      URL.revokeObjectURL(url);
    }
  }

  function pngBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('無法輸出 PNG，請檢查瀏覽器圖片權限。'));
      }, 'image/png');
    });
  }

  function safeFilePart(text) {
    return String(text || '作品').replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').trim().slice(0, 70) || '作品';
  }

  async function downloadPNG(svg, options) {
    const { mode, direction, colorA, colorB } = validate(options);
    const orientation = options.orientation === 'horizontal' ? 'horizontal' : 'vertical';
    const width = orientation === 'horizontal' ? 2400 : 1680;
    const height = orientation === 'horizontal' ? 1520 : 2400;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('瀏覽器無法建立 PNG 畫布。');

    paint(context, width, height, { mode, direction, colorA, colorB });
    const artwork = await imageFromSVG(svg);
    // 作品 SVG 尺寸與輸出尺寸維持相同比例，不重新裁切或調整作品構圖。
    context.drawImage(artwork, 0, 0, width, height);
    const blob = await pngBlob(canvas);
    const filename = `${safeFilePart(options.text)}_${orientation === 'horizontal' ? '橫式' : '直式'}_${MODES[mode]}PNG.png`;
    const url = URL.createObjectURL(blob);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      // 給瀏覽器足夠時間接收下載 URL；不留下長期佔用的 Blob URL。
      global.setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
    return { filename, width, height };
  }

  global.SlowlyWordBackground = Object.freeze({ previewCSS, paint, downloadPNG });
})(window);
