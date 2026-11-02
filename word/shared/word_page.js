"use strict";
/* 慢慢藝術字｜作品頁共用 UI v1
 * 只負責頁面、預覽控制與下載按鈕；字體、構圖、繪圖、專屬特效由作品管理。
 * 路徑 word/shared/，屬宿主共用 UI，不是軍火庫複製品。
 */
(function (global) {
  // defer 腳本執行期間 document.currentScript 才有值；先記下路徑，
  // 之後才能從任一款作品頁可靠地載入相鄰的共用匯出模組。
  const backgroundModuleURL = document.currentScript?.src
    ? new URL('word_background.js', document.currentScript.src).href
    : null;
  let backgroundLoadPromise = null;
  function loadBackgroundModule() {
    if (global.SlowlyWordBackground) return Promise.resolve(global.SlowlyWordBackground);
    if (!backgroundLoadPromise) {
      backgroundLoadPromise = new Promise((resolve, reject) => {
        if (!backgroundModuleURL) {
          reject(new Error('無法定位背景 PNG 共用模組。'));
          return;
        }
        const script = document.createElement('script');
        script.src = backgroundModuleURL;
        script.onload = () => global.SlowlyWordBackground
          ? resolve(global.SlowlyWordBackground)
          : reject(new Error('背景 PNG 模組沒有完成初始化。'));
        script.onerror = () => reject(new Error('背景 PNG 模組載入失敗，請檢查 shared/word_background.js 是否已部署。'));
        document.head.appendChild(script);
      });
    }
    return backgroundLoadPromise;
  }

  const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function initialize() {
    const settings = global.SlowlyWordPageConfig;
    const template = document.getElementById('word-preview-template');
    if (!settings || !template) {
      console.error('慢慢藝術字：找不到作品設定或預覽舞台。');
      return;
    }
    const stage = template.content.cloneNode(true);
    const title = htmlEscape(settings.title);
    const examples = (settings.examples || []).map(value => `<button type="button" class="word-text-button" data-example="${htmlEscape(value)}">${htmlEscape(value)}</button>`).join('');
    document.body.innerHTML = `<div class="word-workbench">
      <header class="word-heading"><h1><a href="https://desk.stillnessbyslowly.com/word/index.html" aria-label="${title}，返回慢慢藝術字主頁">${title}</a></h1></header>
      <main class="word-workspace">
        <form class="word-editor" id="art-form" novalidate>
          <div class="word-orientation orientation-switch" role="group" aria-label="文字排列方式">
            <button type="button" class="word-text-button" data-orientation="vertical" aria-pressed="true">直式</button>
            <button type="button" class="word-text-button" data-orientation="horizontal" aria-pressed="false">橫式</button>
          </div>
          <div class="word-field-heading"><label for="art-text">輸入文字</label><output id="char-count" for="art-text" aria-live="polite">4 / 4</output></div>
          <input class="word-input" id="art-text" name="art-text" type="text" value="${htmlEscape(settings.initial)}" placeholder="${htmlEscape(settings.placeholder)}" autocomplete="off" spellcheck="false">
          <div class="word-samples" aria-label="範例文字">${examples}</div>
        </form>
        <section class="word-preview-section" aria-labelledby="word-preview-title">
          <h2 id="word-preview-title" class="word-section-title">作品預覽</h2>
          <div id="word-art-stage-slot"></div>
        </section>
        <section class="word-background-settings" aria-labelledby="word-background-title">
          <h2 id="word-background-title" class="word-section-title">背景設定</h2>
          <div class="word-background-modes" role="group" aria-label="預覽背景模式">
            <button type="button" class="word-text-button" data-background-mode="transparent" aria-pressed="true">透明</button>
            <button type="button" class="word-text-button" data-background-mode="solid" aria-pressed="false">單色</button>
            <button type="button" class="word-text-button" data-background-mode="contrast" aria-pressed="false">撞色</button>
            <button type="button" class="word-text-button" data-background-mode="gradient" aria-pressed="false">漸層</button>
          </div>
          <div class="word-background-options">
            <label class="word-background-option" id="word-background-color-a-label" hidden>顏色 A
              <input id="word-background-color-a" type="color" value="#e56c72" aria-label="背景顏色 A">
            </label>
            <label class="word-background-option" id="word-background-color-b-label" hidden>顏色 B
              <input id="word-background-color-b" type="color" value="#4678a8" aria-label="背景顏色 B">
            </label>
            <label class="word-background-option" id="word-background-direction-label" hidden>方向
              <select id="word-background-direction" aria-label="背景方向">
                <option value="horizontal">左右（0°）</option>
                <option value="diagonal">對角（45°）</option>
                <option value="vertical" selected>上下（90°）</option>
                <option value="reverseDiagonal">反向對角（135°）</option>
              </select>
            </label>
          </div>
        </section>
        <section class="word-exports" aria-labelledby="word-exports-title">
          <h2 id="word-exports-title" class="word-section-title">下載作品</h2>
          <div class="word-downloads">
            <div class="word-download-row word-download-original" role="group" aria-label="原有下載格式">
              <button type="button" id="download-svg" class="word-text-button">SVG</button>
              <button type="button" id="download-png" class="word-text-button">透明 PNG</button>
              <button type="button" id="download-cover" class="word-text-button">書封 PNG</button>
              <button type="button" id="download-animated-svg" class="word-text-button" disabled title="本款動態 SVG 尚未製作">動態 SVG</button>
            </div>
            <div class="word-download-row word-download-background" role="group" aria-label="背景 PNG 格式">
              <button type="button" id="download-solid-png" class="word-text-button" disabled>單色 PNG</button>
              <button type="button" id="download-contrast-png" class="word-text-button" disabled>撞色 PNG</button>
              <button type="button" id="download-gradient-png" class="word-text-button" disabled>漸層 PNG</button>
            </div>
          </div>
          <p id="download-status" class="word-download-status" role="status" aria-live="polite"></p>
          <div class="word-visually-hidden" aria-hidden="true">
            <span id="png-spec">1680 × 2400</span>
            <span id="svg-spec">840 × 1200</span>
            <span id="orientation-fact">Vertical</span>
          </div>
        </section>
      </main>
      <footer class="sbs-signature sbs-footer" aria-label="品牌與創作者">
      <a class="sbs-footer-brand" href="https://stillnessbyslowly.com/" aria-label="慢慢｜Stillness by Slowly 主站">
        <span class="sbs-signature-mark">慢 慢</span>
        <span class="sbs-signature-separator" aria-hidden="true">|</span>
        <span class="sbs-signature-name">Stillness by Slowly</span>
      </a>
      <a class="sbs-footer-author" href="https://www.threads.com/@xiayian505" target="_blank" rel="noopener noreferrer" aria-label="夏熠安的個人頁">夏熠安</a>
    </footer>
    </div>`;
    const slot = document.getElementById('word-art-stage-slot');
    // 作品獨有的預覽舞台原封不動放進共用外殼，保持 CSS 與特效容器識別碼。
    slot.replaceWith(stage);

    const vertical = global[settings.vertical];
    const horizontal = global[settings.horizontal];
    const image = document.getElementById('art-image');
    const field = document.getElementById('art-text');
    const counter = document.getElementById('char-count');
    const status = document.getElementById('download-status');
    const pngSpec = document.getElementById('png-spec');
    const svgSpec = document.getElementById('svg-spec');
    const fact = document.getElementById('orientation-fact');
    const buttons = {
      svg: document.getElementById('download-svg'),
      png: document.getElementById('download-png'),
      cover: document.getElementById('download-cover'),
      animated: document.getElementById('download-animated-svg'),
      solid: document.getElementById('download-solid-png'),
      contrast: document.getElementById('download-contrast-png'),
      gradient: document.getElementById('download-gradient-png')
    };
    const backgroundModeButtons = Array.from(document.querySelectorAll('[data-background-mode]'));
    const backgroundColorA = document.getElementById('word-background-color-a');
    const backgroundColorB = document.getElementById('word-background-color-b');
    const backgroundDirection = document.getElementById('word-background-direction');
    const backgroundOptionsContainer = document.querySelector('.word-background-options');
    const backgroundOptions = {
      colorA: document.getElementById('word-background-color-a-label'),
      colorB: document.getElementById('word-background-color-b-label'),
      direction: document.getElementById('word-background-direction-label')
    };
    if (!vertical || !image || !field) {
      status.textContent = '作品產生器尚未載入，請檢查軍火庫 HTTPS 引用與網路連線。';
      Object.values(buttons).forEach(button => { button.disabled = true; });
      console.error(settings.title + '：缺少作品生成器或預覽元素。');
      return;
    }

    let orientation = 'vertical';
    let art = vertical;
    let current = '';
    let busy = false;
    let composing = false;
    let backgroundMode = 'transparent';
    let backgroundModule = global.SlowlyWordBackground || null;
    let backgroundError = null;
    let previewController = typeof art.createPreview === 'function' && settings.previewMode === 'controller'
      ? art.createPreview(image) : null;
    let previewURL = null;
    let previewSerial = 0;
    const cleanups = [];

    const charSplit = (core, text) => {
      const func = core.splitCharacters || core.characters || core.chars || global.SlowlyTextGenerator?.splitCharacters;
      return func ? func(text) : Array.from(String(text || ''));
    };
    const maxChars = core => core.MAX ?? core.MAX_COUNT ?? 4;
    const animatedAction = () => {
      if (settings.animated && global[settings.animated]?.downloadSVG) {
        return text => global[settings.animated].downloadSVG(text, orientation);
      }
      if (art.hasAnimatedSVG && typeof art.downloadAnimatedSVG === 'function') {
        return text => art.downloadAnimatedSVG(text);
      }
      return null;
    };
    function updateButtons() {
      buttons.svg.disabled = busy || !current || typeof art.downloadSVG !== 'function';
      buttons.png.disabled = busy || !current || typeof art.downloadPNG !== 'function';
      buttons.cover.disabled = busy || !current || !(art.downloadCover || art.downloadKadokadoCover);
      const hasAnimation = !!animatedAction();
      buttons.animated.disabled = busy || !current || !hasAnimation;
      buttons.animated.title = hasAnimation ? '' : '本款動態 SVG 尚未製作';
      buttons.animated.setAttribute('aria-label', hasAnimation ? '下載動態 SVG' : '動態 SVG 尚未製作，暫不可下載');
      for (const kind of ['solid', 'contrast', 'gradient']) {
        buttons[kind].disabled = busy || !current || !backgroundModule || typeof art.generateSVG !== 'function';
        buttons[kind].title = backgroundError ? backgroundError.message : '';
      }
    }

    const backgroundSettings = mode => ({
      mode,
      colorA: backgroundColorA.value,
      colorB: backgroundColorB.value,
      direction: backgroundDirection.value
    });
    function updateBackgroundPreview() {
      const colored = backgroundMode !== 'transparent' && !!backgroundModule;
      image.classList.toggle('word-background-enabled', colored);
      if (!colored) {
        image.style.removeProperty('background-image');
        image.style.removeProperty('background-size');
        return;
      }
      image.style.backgroundImage = backgroundModule.previewCSS(backgroundSettings(backgroundMode));
      updateBackgroundSize();
    }
    function updateBackgroundSize() {
      if (!image.classList.contains('word-background-enabled')) return;
      // object-fit: contain 可留下邊帶；背景只鋪 SVG 真正顯示的比例範圍。
      const style = getComputedStyle(image);
      const width = image.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = image.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const sourceWidth = image.naturalWidth || Number(image.getAttribute('width')) || 840;
      const sourceHeight = image.naturalHeight || Number(image.getAttribute('height')) || 1200;
      if (width <= 0 || height <= 0 || !sourceWidth || !sourceHeight) return;
      const scale = Math.min(width / sourceWidth, height / sourceHeight);
      image.style.backgroundSize = `${sourceWidth * scale}px ${sourceHeight * scale}px`;
    }
    function chooseBackgroundMode(mode) {
      if (!['transparent', 'solid', 'contrast', 'gradient'].includes(mode)) return;
      backgroundMode = mode;
      backgroundModeButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.backgroundMode === mode));
      });
      backgroundOptionsContainer.hidden = mode === 'transparent';
      backgroundOptions.colorA.hidden = mode === 'transparent';
      backgroundOptions.colorB.hidden = mode === 'transparent' || mode === 'solid';
      backgroundOptions.direction.hidden = mode === 'transparent' || mode === 'solid';
      updateBackgroundPreview();
      if (current) image.alt = `${current}${orientation === 'horizontal' ? '橫式' : '直式'}${settings.title}藝術字（${{transparent:'透明',solid:'單色',contrast:'撞色',gradient:'漸層'}[mode]}背景預覽）`;
    }
    backgroundModeButtons.forEach(button => button.addEventListener('click', () => chooseBackgroundMode(button.dataset.backgroundMode)));
    for (const field of [backgroundColorA, backgroundColorB, backgroundDirection]) {
      field.addEventListener('input', updateBackgroundPreview);
      field.addEventListener('change', updateBackgroundPreview);
    }
    image.addEventListener('load', updateBackgroundSize);
    let cleanResizeObserver = null;
    if (typeof ResizeObserver === 'function') {
      const resizeObserver = new ResizeObserver(updateBackgroundSize);
      resizeObserver.observe(image);
      cleanResizeObserver = () => resizeObserver.disconnect();
    }
    function releaseURL() {
      if (previewURL) URL.revokeObjectURL(previewURL);
      previewURL = null;
    }
    function makePreviewURL(svg) {
      const create = art.makeURL || art.makeUrl || art.url;
      if (typeof create === 'function') return create(svg);
      return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    }
    function render(raw) {
      const rawCount = charSplit(art, raw).length;
      current = art.normalize(raw);
      if (field.value !== current) field.value = current;
      counter.textContent = `${charSplit(art, current).length} / ${maxChars(art)}`;
      updateButtons();
      if (!current) {
        if (previewController) previewController.clear();
        else { image.removeAttribute('src'); releaseURL(); }
        image.alt = '請輸入文字以預覽' + settings.title;
        status.textContent = '請輸入一至四個字。';
        settings.onPreview?.({ text: current, orientation, image, url: null });
        return;
      }
      try {
        if (previewController) {
          previewController.set(current);
        } else {
          // 早期批次作品的動態預覽繼續使用它自己的 SVG 動畫生成器。
          const svg = art.hasAnimatedSVG && typeof art.generateAnimatedSVG === 'function'
            ? art.generateAnimatedSVG(current) : art.generateSVG(current);
          const nextURL = makePreviewURL(svg);
          const oldURL = previewURL;
          previewURL = nextURL;
          const serial = ++previewSerial;
          image.onload = () => { if (serial === previewSerial && oldURL) URL.revokeObjectURL(oldURL); };
          image.onerror = () => {
            if (serial === previewSerial) {
              status.textContent = '預覽失敗：請檢查 SVG 與中文字型支援。';
              if (oldURL) URL.revokeObjectURL(oldURL);
            }
          };
          image.src = nextURL;
        }
        image.alt = `${current}${orientation === 'horizontal' ? '橫式' : '直式'}${settings.title}藝術字（${{transparent:'透明',solid:'單色',contrast:'撞色',gradient:'漸層'}[backgroundMode]}背景預覽）`;
        status.textContent = rawCount > maxChars(art) ? '最多四個字，已保留前四個字。' : '';
        settings.onPreview?.({ text: current, orientation, image, url: previewURL });
        if (settings.kind === 'star' && typeof art.outputSize === 'function') {
          const size = art.outputSize(current, 2);
          pngSpec.textContent = `${size.width} × ${size.height}・透明`;
        }
      } catch (error) {
        console.error(settings.title + '預覽失敗', error);
        status.textContent = `預覽失敗：${error.message}`;
        current = '';
        updateButtons();
      }
    }
    const orientationButtons = Array.from(document.querySelectorAll('[data-orientation]'));
    if (!horizontal) {
      const button = orientationButtons.find(button => button.dataset.orientation === 'horizontal');
      if (button) button.disabled = true;
    }
    function chooseOrientation(next) {
      if (busy || next === orientation || !['vertical','horizontal'].includes(next) || (next === 'horizontal' && !horizontal)) return;
      if (previewController) previewController.destroy();
      else releaseURL();
      orientation = next;
      art = next === 'horizontal' ? horizontal : vertical;
      previewController = typeof art.createPreview === 'function' && settings.previewMode === 'controller'
        ? art.createPreview(image) : null;
      const isHorizontal = orientation === 'horizontal';
      image.classList.toggle('is-horizontal', isHorizontal);
      // 橫式畫布由共用層同步調整預覽框比例，避免舊版最小高度留下上下棋盤格。
      image.closest('.word-preview-frame')?.classList.toggle('word-preview-horizontal', isHorizontal);
      image.setAttribute('width', isHorizontal ? '1200' : (settings.verticalWidth || '840'));
      image.setAttribute('height', isHorizontal ? '760' : (settings.verticalHeight || '1200'));
      pngSpec.textContent = isHorizontal ? '2400 × 1520' : '1680 × 2400';
      svgSpec.textContent = isHorizontal ? '1200 × 760' : '840 × 1200';
      fact.textContent = isHorizontal ? 'Horizontal · 橫式' : 'Vertical · 直式';
      orientationButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.orientation === next)));
      settings.onOrientation?.({ orientation, image });
      render(field.value);
      updateBackgroundPreview();
    }
    orientationButtons.forEach(button => button.addEventListener('click', () => chooseOrientation(button.dataset.orientation)));
    field.addEventListener('compositionstart', () => { composing = true; });
    field.addEventListener('compositionend', () => { composing = false; render(field.value); });
    field.addEventListener('input', () => { if (!composing) render(field.value); });
    document.getElementById('art-form').addEventListener('submit', event => { event.preventDefault(); if (!composing) render(field.value); });
    document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
      field.value = button.dataset.example;
      render(field.value);
      field.focus();
    }));
    async function downloadBackground(mode) {
      const svg = art.generateSVG(current); // 使用靜態 SVG，不擾動原本的 SVG 下載函式。
      return backgroundModule.downloadPNG(svg, {
        ...backgroundSettings(mode), text: current, orientation
      });
    }
    async function download(kind) {
      if (!current || busy) return;
      const action = {
        svg: () => art.downloadSVG(current),
        png: () => art.downloadPNG(current, ...(settings.kind === 'star' ? [2] : [])),
        cover: () => (art.downloadCover || art.downloadKadokadoCover)(current),
        animated: () => animatedAction()?.(current),
        solid: () => downloadBackground('solid'),
        contrast: () => downloadBackground('contrast'),
        gradient: () => downloadBackground('gradient')
      }[kind];
      if (!action || buttons[kind].disabled) return;
      busy = true;
      updateButtons();
      status.textContent = {
        svg: '正在準備透明 SVG……', png: '正在生成高清透明 PNG……',
        cover: '正在生成 700 × 1000 書封……', animated: '正在準備動態 SVG……',
        solid: '正在生成單色 PNG……', contrast: '正在生成撞色 PNG……', gradient: '正在生成漸層 PNG……'
      }[kind];
      try {
        const result = await action();
        status.textContent = `已送出下載：${result?.filename || '作品檔案'}`;
      } catch (error) {
        console.error(settings.title + '下載失敗', error);
        status.textContent = `下載失敗：${error.message}`;
      } finally {
        busy = false;
        updateButtons();
      }
    }
    for (const kind of Object.keys(buttons)) buttons[kind].addEventListener('click', () => download(kind));
    // 各款只有必要時提供獨立特效接線；不能放回共用 UI 的操作流程。
    if (typeof settings.mountEffects === 'function') {
      try {
        const dispose = settings.mountEffects({ field, image, status, getText: () => current, getOrientation: () => orientation });
        if (typeof dispose === 'function') cleanups.push(dispose);
      } catch (error) { console.warn(settings.title + '預覽特效無法啟動', error); }
    }
    chooseBackgroundMode('transparent');
    render(field.value);
    loadBackgroundModule().then(module => {
      backgroundModule = module;
      updateBackgroundPreview();
      updateButtons();
    }).catch(error => {
      backgroundError = error;
      console.error(settings.title + '背景 PNG 功能載入失敗', error);
      status.textContent = error.message;
      updateButtons();
    });
    window.addEventListener('pagehide', () => {
      cleanResizeObserver?.();
      if (previewController) previewController.destroy();
      else releaseURL();
      cleanups.forEach(fn => { try { fn(); } catch (error) { console.warn(error); } });
    });
  }
  document.addEventListener('DOMContentLoaded', initialize);
})(window);
