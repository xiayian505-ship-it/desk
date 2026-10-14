"use strict";
/* 慢慢藝術字｜作品頁共用 UI v1
 * 只負責頁面、預覽控制與下載按鈕；字體、構圖、繪圖、專屬特效由作品管理。
 * 路徑 word/shared/，屬宿主共用 UI，不是軍火庫複製品。
 */
(function (global) {
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
        <section class="word-exports" aria-labelledby="word-exports-title">
          <h2 id="word-exports-title" class="word-section-title">下載作品</h2>
          <div class="word-downloads">
            <button type="button" id="download-svg" class="word-text-button">SVG</button>
            <button type="button" id="download-png" class="word-text-button">透明 PNG</button>
            <button type="button" id="download-cover" class="word-text-button">角角者書封 PNG</button>
            <button type="button" id="download-animated-svg" class="word-text-button" disabled title="本款動態 SVG 尚未製作">動態 SVG</button>
          </div>
          <p id="download-status" class="word-download-status" role="status" aria-live="polite"></p>
          <div class="word-visually-hidden" aria-hidden="true">
            <span id="png-spec">1680 × 2400</span>
            <span id="svg-spec">840 × 1200</span>
            <span id="orientation-fact">Vertical</span>
          </div>
        </section>
      </main>
      <footer class="sbs-signature" aria-label="Stillness by Slowly">
        <span class="sbs-signature-mark">慢 慢</span>
        <span class="sbs-signature-separator" aria-hidden="true">|</span>
        <span class="sbs-signature-name">Stillness by Slowly</span>
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
      animated: document.getElementById('download-animated-svg')
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
        image.alt = `${current}${orientation === 'horizontal' ? '橫式' : '直式'}${settings.title}藝術字（透明背景）`;
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
      image.setAttribute('width', isHorizontal ? '1200' : (settings.verticalWidth || '840'));
      image.setAttribute('height', isHorizontal ? '760' : (settings.verticalHeight || '1200'));
      pngSpec.textContent = isHorizontal ? '2400 × 1520' : '1680 × 2400';
      svgSpec.textContent = isHorizontal ? '1200 × 760' : '840 × 1200';
      fact.textContent = isHorizontal ? 'Horizontal · 橫式' : 'Vertical · 直式';
      orientationButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.orientation === next)));
      settings.onOrientation?.({ orientation, image });
      render(field.value);
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
    async function download(kind) {
      if (!current || busy) return;
      const action = {
        svg: () => art.downloadSVG(current),
        png: () => art.downloadPNG(current, ...(settings.kind === 'star' ? [2] : [])),
        cover: () => (art.downloadCover || art.downloadKadokadoCover)(current),
        animated: () => animatedAction()?.(current)
      }[kind];
      if (!action || buttons[kind].disabled) return;
      busy = true;
      updateButtons();
      status.textContent = {
        svg: '正在準備透明 SVG……', png: '正在生成高清透明 PNG……',
        cover: '正在生成 700 × 1000 書封……', animated: '正在準備動態 SVG……'
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
    render(field.value);
    window.addEventListener('pagehide', () => {
      if (previewController) previewController.destroy();
      else releaseURL();
      cleanups.forEach(fn => { try { fn(); } catch (error) { console.warn(error); } });
    });
  }
  document.addEventListener('DOMContentLoaded', initialize);
})(window);
