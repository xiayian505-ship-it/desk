"use strict";
(function () {
  const byId = id => document.getElementById(id);
  const catalog = window.SlowlyCoverWordCatalog;
  const Adapter = window.SlowlyCoverWordAdapter;
  const composer = window.SlowlyCoverComposer;
  const layout = window.SlowlyCoverNewsLayout;
  const status = byId("status"), stats = byId("load-stats");
  const slotList = byId("slot-list"), results = byId("slot-results");
  const frameControls = byId("image-frame-controls"), frameStates = new Map(), frameUI = new Map();
  const wholeImageInput = byId("whole-image-input"), wholeImageClear = byId("whole-image-clear"), wholeImageLabel = byId("whole-image-label");
  const img = byId("composed-preview"), empty = byId("preview-empty");
  const previewFrame = byId("preview-frame"), sizeLabel = byId("preview-size");
  const renderBtn = byId("render-button"), svgBtn = byId("download-svg"), pngBtn = byId("download-png"), bookBtn = byId("download-book");
  const areaTabs = byId("area-tabs"), resetBtn=byId("reset-button"), wholeMode=byId("whole-mode");
  const picker = byId("picker-overlay"), pickerSearch = byId("picker-search");
  const pickerTitle = byId("picker-title"), pickerResults = byId("picker-results");
  const pickerCount = byId("picker-count"), pickerPage = byId("picker-page"), pickerLetters = byId("picker-letters");
  const prevBtn = byId("picker-prev"), nextBtn = byId("picker-next");
  const chooseClose = byId("picker-close");
  const seeds = layout?.defaults || [];
  const adapter = catalog && Adapter ? new Adapter(byId("bridge-host")) : null;
  const slots = [];
  let currentOrientation = "vertical", working = false, combined = null, lastResult = null;
  let imageURL = null, tileURLs = [], compositeRevision = 0;
  const wholeState = {imageDataURL:null, filename:"", revision:0};
  let activePicker = -1, lastFocus = null, currentLetter = "ALL", pageNo = 0, debounce = null;
  let activeArea=0;
  let activeSettings="text";
  const settingsTabs=[...document.querySelectorAll("[data-settings-tab]")];
  const settingsPanels={
    text:byId("settings-text"),
    background:byId("settings-background"),
    frames:byId("settings-frames")
  };
  // 三個控制分頁共用同一個舞台。切換時不增加一組預覽，也不讓其他設定區堆疊在下方。
  function selectSettings(tabName,{focus=false}={}) {
    if(!settingsPanels[tabName])return;
    activeSettings=tabName;
    for(const button of settingsTabs){
      const selected=button.dataset.settingsTab===tabName;
      button.classList.toggle("is-current",selected);
      button.setAttribute("aria-selected",String(selected));
      button.tabIndex=selected?0:-1;
      if(selected&&focus)button.focus();
    }
    for(const [key,panel] of Object.entries(settingsPanels)) {
      panel.hidden=key!==tabName;
      if(key===tabName)panel.scrollTop=0;
    }
    resetBtn.hidden=tabName!=="text";
  }
  settingsTabs.forEach((button,index)=>{
    button.addEventListener("click",()=>selectSettings(button.dataset.settingsTab));
    button.addEventListener("keydown",event=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
      event.preventDefault();
      const next=event.key==="Home"?0:event.key==="End"?settingsTabs.length-1:
        (index+(event.key==="ArrowRight"?1:-1)+settingsTabs.length)%settingsTabs.length;
      selectSettings(settingsTabs[next].dataset.settingsTab,{focus:true});
    });
  });
  selectSettings("text");
  const view = () => layout.views[currentOrientation];
  const positions = () => view().sections.flatMap(section => section.slots);
  const setStatus = (message,state="") => {status.textContent=message;status.dataset.state=state;};
  // 共用 UI 的 Loading 控制：優先使用軍火庫 SlowlyLoaderProgress，失敗時使用後備。
  // 沒有 data-loader-pct，不呼叫 startFake()；進度只來自實際完成的藝術字槽位。
  const loading = (() => {
    const root = byId("cover-loader"), label = byId("cover-loading-text");
    const bar = root?.querySelector("[data-loader-bar]");
    let controller = null;
    function instance() {
      if (!controller && window.SlowlyLoaderProgress?.create) {
        try { controller=window.SlowlyLoaderProgress.create({root}); }
        catch(error) { console.warn("軍火庫 Loading 無法初始化，改用後備顯示",error); }
      }
      return controller;
    }
    function setProgress(value) {
      const active=instance();
      if (active) active.setProgress(value);
      else if (bar) bar.style.width=`${Math.max(0,Math.min(100,value))}%`;
    }
    function start(message,{indeterminate=false}={}) {
      if (!root) return;
      label.textContent=message;
      root.classList.toggle("is-indeterminate",indeterminate);
      root.classList.remove("is-done");
      root.setAttribute("aria-hidden","false");
      previewFrame.setAttribute("aria-busy","true");
      setProgress(0);
    }
    function update(message,progress) {
      if (!root) return;
      label.textContent=message;
      if (Number.isFinite(progress)) {
        root.classList.remove("is-indeterminate");
        setProgress(progress);
      }
    }
    function end(ok) {
      if (!root) return;
      root.classList.remove("is-indeterminate");
      if (ok) {
        const active=instance();
        if (active) active.finish();
        else {setProgress(100);root.classList.add("is-done");}
      } else root.classList.add("is-done");
      root.setAttribute("aria-hidden","true");
      previewFrame.setAttribute("aria-busy","false");
    }
    return {start,update,end};
  })();
  const dataURL = svg => URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}));
  const revokeURLs = () => {
    if(imageURL){URL.revokeObjectURL(imageURL);imageURL=null;}
    tileURLs.forEach(url=>URL.revokeObjectURL(url));tileURLs=[];
  };
  const refreshStats = () => {if(adapter)stats.textContent=`目錄 ${catalog.count} 款｜已讀取設定 ${adapter.cachedManifestCount} 款｜已載入生成器 ${adapter.loadedCount} 款`;};
  function clearOutput() {
    compositeRevision++;
    combined=null;lastResult=null;svgBtn.disabled=true;pngBtn.disabled=true;bookBtn.disabled=true;
    img.onload=img.onerror=null;img.hidden=true;img.removeAttribute("src");empty.hidden=false;
    results.replaceChildren();revokeURLs();
  }
  function invalidate() {clearOutput();if(!working)setStatus("");}
  function updateCounts(input,count) {
    const chars=Array.from(input.value);
    if(chars.length>4)input.value=chars.slice(0,4).join("");
    count.textContent=`${Array.from(input.value).length} / 4`;
  }
  function createSlots() {
    const areas = layout.views.vertical.sections;
    for (let areaIndex = 0; areaIndex < areas.length; areaIndex++) {
      const areaName = layout.areaNames?.[areaIndex] || `區域 ${areaIndex + 1}`;
      const tab = document.createElement("button");
      tab.type = "button";
      tab.textContent = areaName;
      tab.className = "area-tab";
      tab.dataset.areaIndex = String(areaIndex);
      tab.addEventListener("click", () => selectArea(areaIndex));
      areaTabs.appendChild(tab);

      const pane = document.createElement("section");
      pane.className = "area-pane";
      pane.dataset.areaIndex = String(areaIndex);
      pane.setAttribute("aria-label", areaName);
      const grid = document.createElement("div");
      grid.className = "slot-grid";
      pane.appendChild(grid);
      slotList.appendChild(pane);

      for (let localIndex = 0; localIndex < 2; localIndex++) {
        const i = areaIndex * 2 + localIndex;
        const seed = seeds[i];
        const letter = localIndex === 0 ? "A" : "B";
        const card = document.createElement("div");
        card.className = "slot";

        const meta = document.createElement("div");
        meta.className = "slot-meta";
        const title = document.createElement("span");
        title.textContent = letter;
        const count = document.createElement("small");
        meta.append(title, count);

        const input = document.createElement("input");
        input.type = "text";
        input.id = `slot-text-${i}`;
        input.setAttribute("aria-label", `${areaName} ${letter} 文字`);
        input.maxLength = 8; // 中文輸入法組字期間允許暫存，updateCounts 仍限制最多四字。
        input.autocomplete = "off";
        input.spellcheck = false;
        input.value = seed.text;
        updateCounts(input, count);
        input.addEventListener("input", () => { updateCounts(input, count); invalidate(); });
        input.addEventListener("compositionend", () => { updateCounts(input, count); invalidate(); });

        const choose = document.createElement("button");
        choose.type = "button";
        choose.className = "choose-art";
        choose.setAttribute("aria-label", `${areaName} ${letter} 選擇藝術字`);
        choose.addEventListener("click", () => openPicker(i));
        card.append(meta, input, choose);
        grid.appendChild(card);
        slots.push({code: seed.code, choose, input, count});
        paintSlot(i);
      }
    }
    selectArea(0);
    refreshLayout();
  }
  function selectArea(areaIndex) {
    activeArea=areaIndex;
    document.querySelectorAll(".area-tab").forEach(tab=>{
      const isActive=Number(tab.dataset.areaIndex)===activeArea;
      tab.classList.toggle("is-current",isActive);tab.setAttribute("aria-pressed",String(isActive));
    });
    document.querySelectorAll(".area-pane").forEach(pane=>{pane.hidden=Number(pane.dataset.areaIndex)!==activeArea;});
  }
  function paintSlot(i) {
    const record=catalog.get(slots[i].code);
    slots[i].choose.textContent=record ? record.title : "選擇藝術字";
  }
  function refreshLayout() {
    const current=view();
    previewFrame.style.aspectRatio=`${current.width} / ${current.height}`;
    sizeLabel.textContent=`${currentOrientation === "vertical"?"直式":"橫式"} · ${current.width} × ${current.height}`;
    createImageFramePanels();
    document.querySelectorAll("[data-cover-orientation]").forEach(btn=>{
      const active=btn.dataset.coverOrientation===currentOrientation;
      btn.setAttribute("aria-pressed",String(active));btn.classList.toggle("is-current",active);
    });
  }
  function captureInputs() {
    return slots.map((slot,i)=>({code:slot.code,text:slot.input.value.trim(),orientation:positions()[i].artOrientation}));
  }
  function getBackground(name) {
    const value=key=>document.querySelector(`[data-background="${name}"][data-key="${key}"]`).value;
    return {mode:value("mode"),a:value("a"),b:value("b"),angle:value("angle"),imageDataURL:name==="whole"?wholeState.imageDataURL:null};
  }
  function updateWholePhotoLabel() {
    if (!wholeImageLabel) return;
    wholeImageLabel.textContent = wholeState.filename || "";
    if (wholeImageClear) wholeImageClear.disabled = working || !wholeState.imageDataURL;
  }
  // 圖片框設定依目前模板動態生成，不假設固定只有一框。
  const MAX_PHOTO_BYTES = 25 * 1024 * 1024;
  function stateForFrame(id) {
    if (!frameStates.has(id)) frameStates.set(id, {
      background:{...(layout.frameDefaults?.[id]||{mode:"split",a:"#f5d7e5",b:"#b9c7e8",angle:"0"})},
      imageDataURL:null,filename:"",revision:0
    });
    return frameStates.get(id);
  }
  function getImageFrames() {
    return view().imageFrames.map(box=>{
      const state=stateForFrame(box.id);
      return {id:box.id,background:{...state.background},imageDataURL:state.imageDataURL};
    });
  }
  function updatePhotoLabel(id) {
    const ui=frameUI.get(id), state=stateForFrame(id);
    if (!ui)return;
    ui.note.textContent=state.filename || "";
    ui.clear.disabled=working || !state.imageDataURL;
  }
  async function readLocalImage(file) {
    if (!file || !["image/png","image/jpeg","image/webp"].includes(file.type)) {
      throw new Error("請選 PNG、JPG 或 WebP 圖片。SVG 暫不接受作為本機圖片，以避免外部資源與腳本問題。");
    }
    if (file.size > MAX_PHOTO_BYTES) throw new Error("圖片超過 25 MB，請改用較小的圖片（手機瀏覽器需要保留合成記憶體）。");
    if (!file.size) throw new Error("圖片檔案是空的。");
    const dataURL=await new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=()=>reject(new Error("讀取本機圖片失敗"));
      reader.readAsDataURL(file);
    });
    if (typeof dataURL!=="string" || !/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(dataURL)) {
      throw new Error("圖片格式無法嵌入 SVG");
    }
    await new Promise((resolve,reject)=>{
      const probe=new Image();
      probe.onload=()=>probe.naturalWidth && probe.naturalHeight ? resolve() : reject(new Error("圖片尺寸異常"));
      probe.onerror=()=>reject(new Error("圖片無法解碼，請改用 PNG 或 JPG"));
      probe.src=dataURL;
    });
    return dataURL;
  }
  async function refreshCompositeFromFrame(message) {
    if (working) return;
    if (!lastResult || lastResult.some(item=>!item.ok)) {
      setStatus("請先產生封面");
      return;
    }
    try {
      await showComposite();
      setStatus("已更新","success");
    } catch (err) {
      setStatus(`圖片框更新失敗：${err?.message||err}`,"error");
    }
  }
  function createImageFramePanels() {
    frameUI.clear();frameControls.replaceChildren();
    for (const [index,box] of view().imageFrames.entries()) {
      const state=stateForFrame(box.id);
      const fieldset=document.createElement("fieldset");
      fieldset.className="background-panel frame-panel";
      // 只有固定 UI 字串進入 innerHTML；模板 ID、圖片檔名皆由 textContent 處理。
      fieldset.innerHTML=`
        <legend>圖片框 ${index+1}</legend>
        <div class="frame-upload">
          <label class="frame-file-label">選擇圖片
            <input type="file" accept="image/png,image/jpeg,image/webp" class="frame-file-input">
          </label>
          <button type="button" class="clear-photo">移除圖片</button>
          <p class="frame-photo-label" aria-live="polite"></p>
        </div>
        <label class="sr-only">背景</label>
        <select data-key="mode" aria-label="圖片框 ${index+1} 背景類型">
          <option value="transparent">透明</option>
          <option value="solid">單色</option>
          <option value="split">撞色</option>
          <option value="gradient">漸層</option>
        </select>
        <div class="background-fields">
          <label>顏色 A <input type="color" data-key="a"></label>
          <label>顏色 B <input type="color" data-key="b"></label>
          <label>角度 <select data-key="angle">
            <option value="0">左右（0°）</option>
            <option value="45">對角（45°）</option>
            <option value="90">上下（90°）</option>
            <option value="135">反向對角（135°）</option>
          </select></label>
        </div>`;
      frameControls.appendChild(fieldset);
      const file=fieldset.querySelector("input[type=file]");
      const clear=fieldset.querySelector(".clear-photo");
      const note=fieldset.querySelector(".frame-photo-label");
      frameUI.set(box.id,{fieldset,file,clear,note});
      for(const key of ["mode","a","b","angle"]){
        const field=fieldset.querySelector(`[data-key="${key}"]`);
        field.value=state.background[key];
        field.addEventListener("input",()=>{
          state.background[key]=field.value;
          changeBackgroundControlStates();
          void refreshCompositeFromFrame(`圖片框 ${index+1} 的背景已更新`);
        });
      }
      file.addEventListener("change",async()=>{
        const selected=file.files?.[0];
        if (!selected)return;
        const revision=++state.revision;
        file.disabled=true;
        setStatus(`正在讀取圖片框 ${index+1} 的本機圖片……`);
        try {
          const dataURL=await readLocalImage(selected);
          if(revision!==state.revision)return;
          state.imageDataURL=dataURL;state.filename=selected.name;
          updatePhotoLabel(box.id);
          await refreshCompositeFromFrame(`圖片框 ${index+1} 已使用本機圖片`);
        } catch(err){setStatus(`圖片框 ${index+1} 載入失敗：${err?.message||err}`,"error");}
        finally {file.value="";file.disabled=working;updatePhotoLabel(box.id);}
      });
      clear.addEventListener("click",()=>{
        state.revision++;
        state.imageDataURL=null;state.filename="";
        file.value="";
        updatePhotoLabel(box.id);
        void refreshCompositeFromFrame(`圖片框 ${index+1} 已移除圖片，恢復背景`);
      });
      updatePhotoLabel(box.id);
    }
    if (!view().imageFrames.length){
      const empty=document.createElement("p");empty.className="muted";empty.textContent="此款排版沒有圖片框。";
      frameControls.append(empty);
    }
    changeBackgroundControlStates();
  }
  function changeBackgroundControlStates() {
    const mode=getBackground("whole").mode;
    for(const key of ["a","b","angle"]){
      const input=document.querySelector(`[data-background="whole"][data-key="${key}"]`);
      const visible=mode!=="transparent" && mode!=="image" && (mode!=="solid" || key==="a");
      input.closest("label").hidden=!visible;
      input.disabled=working || !visible;
    }
    if (wholeImageInput) wholeImageInput.disabled = working || mode !== "image";
    if (wholeImageClear) wholeImageClear.disabled = working || mode !== "image" || !wholeState.imageDataURL;
    for(const [id,ui] of frameUI){
      const frameMode=stateForFrame(id).background.mode;
      for(const key of ["a","b","angle"]){
        const input=ui.fieldset.querySelector(`[data-key="${key}"]`);
        const visible=frameMode!=="transparent" && (frameMode!=="solid" || key==="a");
        input.closest("label").hidden=!visible;
        input.disabled=working || !visible;
      }
    }
  }
  function disableBusy(value) {
    working=value;renderBtn.disabled=value;
    document.querySelectorAll("[data-cover-orientation]").forEach(b=>b.disabled=value);
    slots.forEach(slot=>{slot.choose.disabled=value;slot.input.disabled=value;});
    if (wholeImageInput) wholeImageInput.disabled = value || getBackground("whole").mode !== "image";
    if (wholeImageClear) wholeImageClear.disabled = value || getBackground("whole").mode !== "image" || !wholeState.imageDataURL;
    for (const [id,ui] of frameUI){ui.file.disabled=value;ui.clear.disabled=value || !stateForFrame(id).imageDataURL;}
    svgBtn.disabled=value || !combined;pngBtn.disabled=value || !combined;
    bookBtn.disabled=value || !combined || currentOrientation!=="vertical";
    changeBackgroundControlStates();
  }
  function showResults(output) {
    results.replaceChildren();tileURLs.forEach(url=>URL.revokeObjectURL(url));tileURLs=[];
    output.forEach((result,i)=>{
      const tile=document.createElement("div");tile.className="result";
      if(result.ok) {
        const preview=document.createElement("img"), url=dataURL(result.svg);
        tileURLs.push(url);preview.src=url;preview.alt=`第 ${i+1} 槽 ${result.text}`;
        const caption=document.createElement("p");caption.className="caption";
        caption.textContent=`${result.title}／${result.text}`;tile.append(preview,caption);
      } else {
        tile.classList.add("result-error");
        const heading=document.createElement("strong");heading.textContent=`槽 ${i+1} 失敗`;
        const reason=document.createElement("p");reason.textContent=result.error;
        tile.append(heading,reason);
      }
      results.appendChild(tile);
    });
  }
  function buildComposite() {
    if(!lastResult || lastResult.some(r=>!r.ok))return null;
    return composer.compose({layout,orientation:currentOrientation,slots:lastResult,
      background:getBackground("whole"),frames:getImageFrames(),visual:window.SlowlyCoverNewsVisual});
  }
  async function showComposite() {
    const next=buildComposite();if(!next)return;
    const serial=++compositeRevision;
    const url=dataURL(next.svg);
    try {
      // 使用獨立 Image 等待 SVG 解碼，避免快速調色時覆寫同一張 img 的 onload。
      const probe=new Image();
      await new Promise((resolve,reject)=>{
        probe.onload=resolve;
        probe.onerror=()=>reject(new Error("SVG 已合成，但瀏覽器無法顯示預覽"));
        probe.src=url;
      });
      if(serial!==compositeRevision){URL.revokeObjectURL(url);return;}
      const previous=imageURL;
      combined=next;imageURL=url;
      img.src=url;
      if(previous)URL.revokeObjectURL(previous);
      img.hidden=false;empty.hidden=true;svgBtn.disabled=working;pngBtn.disabled=working;
      bookBtn.disabled=working || currentOrientation!=="vertical";
    } catch(err) {URL.revokeObjectURL(url);throw err;}
  }
  async function render() {
    if(working)return;
    const inputs=captureInputs();
    if(inputs.some(s=>!catalog.has(s.code)||!s.text||Array.from(s.text).length>4)){
      setStatus(`全部 ${inputs.length} 個槽都要選好藝術字並填入 1～4 字。`,"error");return;
    }
    clearOutput();disableBusy(true);setStatus("正在載入真正的藝術字並套入飛鴿傳輸構圖……");
    loading.start("正在載入藝術字……");
    let complete=false;
    try {
      const output=await adapter.generateMany(inputs,({completed,total})=>{
        loading.update(`正在生成並適配藝術字（${completed}／${total}）……`,total ? completed/total*100 : 0);
        setStatus(`藝術字已處理 ${completed}／${total} 槽……`);
      },{fitSlots:positions()});
      showResults(output);refreshStats();
      const fails=output.filter(r=>!r.ok);
      if(fails.length){
        setStatus(`${fails.length} 槽失敗：${fails.map(f=>f.error||"未知錯誤").join("；")}`,"error");
        empty.textContent="部分藝術字生成失敗，請查看各槽結果。";return;
      }
      // 可見範圍量測已在共用接入器 generateMany() 內完成。
      // 作品頁只提供自己的槽位座標，不再逐款重寫縮放迴圈。
      const fitWarnings=output.filter(item=>item.fitWarning);
      lastResult=output;
      loading.update("正在合成封面……");
      await showComposite();
      complete=true;
      if (fitWarnings.length) {
        setStatus(`封面已完成，但 ${fitWarnings.length} 個藝術字槽的自動縮放未成功（可能偏小）。請檢查瀏覽器主控台。`,"error");
      } else setStatus("完成","success");
    } catch(err) {setStatus(`合成失敗：${err?.message||err}`,"error");}
    finally {loading.end(complete);disableBusy(false);refreshStats();}
  }
  function saveBlob(blob,name) {
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),20000);
  }
  function downloadSVG() {
    if(!combined||working)return;
    saveBlob(new Blob([combined.svg],{type:"image/svg+xml;charset=utf-8"}),`news-${currentOrientation}.svg`);
    setStatus("已送出 News SVG 下載。","success");
  }
  async function exportPNG({book=false}={}) {
    if(!combined||working)return;
    if(book && currentOrientation!=="vertical") {
      setStatus("書封 PNG 的橫式觸發規則尚未定案：目前版本 請切換到直式後下載。","error");return;
    }
    disableBusy(true);setStatus(`正在產生${book?"書封":"一般"} PNG……`);
    loading.start("正在產生 PNG……",{indeterminate:true});
    let complete=false;
    try {
      const current=combined;
      const svgURL=dataURL(current.svg);
      try {
        const picture=new Image();
        await new Promise((resolve,reject)=>{
          picture.onload=resolve;picture.onerror=()=>reject(new Error("瀏覽器無法載入合成 SVG"));
          picture.src=svgURL;
        });
        const outW=book?700:current.width*2, outH=book?1000:current.height*2;
        const canvas=document.createElement("canvas");canvas.width=outW;canvas.height=outH;
        const ctx=canvas.getContext("2d");if(!ctx)throw new Error("無法建立 Canvas");
        ctx.clearRect(0,0,outW,outH);ctx.drawImage(picture,0,0,outW,outH);
        const blob=await new Promise((resolve,reject)=>{
          try {canvas.toBlob(v=>v?resolve(v):reject(new Error("PNG 轉換失敗（可能含跨網域資源）")),"image/png");}
          catch(err){reject(new Error(`PNG 匯出受限：${err.message}`));}
        });
        saveBlob(blob,book?"news-book-700x1000.png":`news-${currentOrientation}.png`);
        complete=true;setStatus(`已送出 PNG 下載：${outW} × ${outH}。`,"success");
      } finally {URL.revokeObjectURL(svgURL);}
    } catch(err){setStatus(`PNG 下載失敗：${err?.message||err}`,"error");}
    finally{loading.end(complete);disableBusy(false);}
  }
  const downloadPNG=()=>exportPNG();
  const downloadBookPNG=()=>exportPNG({book:true});
  function openPicker(i) {
    if(working)return;activePicker=i;lastFocus=document.activeElement;
    pickerTitle.textContent=`${layout.areaNames?.[Math.floor(i/2)]||"文字區域"} · ${i%2===0?"A":"B"}`;
    picker.hidden=false;document.body.classList.add("picker-open");
    pickerSearch.value="";currentLetter="ALL";pageNo=0;renderPicker();pickerSearch.focus();
  }
  function closePicker() {
    picker.hidden=true;document.body.classList.remove("picker-open");activePicker=-1;
    if(lastFocus?.isConnected)lastFocus.focus();
  }
  function renderLetters() {
    pickerLetters.replaceChildren();
    for(const letter of ["ALL",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]){
      const count=letter==="ALL"?catalog.count:catalog.letters[letter];
      const button=document.createElement("button");button.type="button";
      button.textContent=letter==="ALL"?"全部":letter;
      button.title=`${count} 款`;button.disabled=letter!=="ALL"&&!count;
      button.setAttribute("aria-pressed",String(letter===currentLetter));
      button.classList.toggle("is-active",letter===currentLetter);
      button.addEventListener("click",()=>{currentLetter=letter;pageNo=0;renderPicker();});
      pickerLetters.append(button);
    }
  }
  function renderPicker() {
    renderLetters();
    const page=catalog.query({text:pickerSearch.value,letter:currentLetter,page:pageNo,pageSize:12});
    pageNo=page.page;pickerResults.replaceChildren();
    pickerCount.textContent=`${page.count} 款`;
    pickerPage.textContent=`第 ${page.page+1} / ${page.pages} 頁`;
    prevBtn.disabled=page.page===0;nextBtn.disabled=page.page>=page.pages-1;
    if(!page.items.length){
      const noData=document.createElement("p");noData.className="picker-empty";noData.textContent="沒有符合條件的藝術字。";
      pickerResults.append(noData);return;
    }
    for(const item of page.items){
      const option=document.createElement("button");option.type="button";option.className="picker-item";
      option.classList.toggle("is-selected",activePicker>=0&&slots[activePicker].code===item.code);
      const name=document.createElement("strong");name.textContent=item.title;
      const code=document.createElement("span");code.textContent=item.code;
      option.append(name,code);
      option.addEventListener("click",()=>{
        if(activePicker<0)return;
        const n=activePicker;slots[n].code=item.code;paintSlot(n);closePicker();invalidate();
      });
      pickerResults.append(option);
    }
  }
  if(!catalog||!Adapter||!composer||!layout||!window.SlowlyCoverWordFit){setStatus("接入層、文字量測器或版型載入失敗，請檢查檔案。","error");return;}
  updateWholePhotoLabel();
  wholeImageInput?.addEventListener("change",async()=>{
    const selected=wholeImageInput.files?.[0];
    if(!selected)return;
    const revision=++wholeState.revision;
    wholeImageInput.disabled=true;
    setStatus("正在讀取整張封面底圖……");
    try {
      const dataURL=await readLocalImage(selected);
      if(revision!==wholeState.revision)return;
      wholeState.imageDataURL=dataURL; wholeState.filename=selected.name;
      updateWholePhotoLabel();
      if (getBackground("whole").mode !== "image") {
        document.querySelector('[data-background="whole"][data-key="mode"]').value = "image";
      }
      changeBackgroundControlStates();
      await refreshCompositeFromFrame("整張封面底圖已使用本機圖片");
    } catch(err){ setStatus(`整張封面底圖載入失敗：${err?.message||err}`,"error"); }
    finally { wholeImageInput.value=""; wholeImageInput.disabled=working || getBackground("whole").mode !== "image"; updateWholePhotoLabel(); }
  });
  wholeImageClear?.addEventListener("click",()=>{
    wholeState.revision++; wholeState.imageDataURL=null; wholeState.filename="";
    if (wholeImageInput) wholeImageInput.value="";
    updateWholePhotoLabel(); changeBackgroundControlStates();
    void refreshCompositeFromFrame("整張封面底圖已移除，恢復背景");
  });
  createSlots();
  // 只有 News 自己提供預設值；此測試頁從中讀取，不把 News 的設定寫回共用接入器。
  const defaults=layout.backgroundDefault;
  for(const [key,val] of Object.entries(defaults||{})) {
    const field=document.querySelector(`[data-background="whole"][data-key="${key}"]`);
    if(field)field.value=val;
  }
  changeBackgroundControlStates();refreshStats();
  renderBtn.disabled=false;
  renderBtn.addEventListener("click",render);
  svgBtn.addEventListener("click",downloadSVG);pngBtn.addEventListener("click",downloadPNG);
  bookBtn.addEventListener("click",downloadBookPNG);
  document.querySelectorAll("[data-cover-orientation]").forEach(button=>button.addEventListener("click",()=>{
    if(working||button.dataset.coverOrientation===currentOrientation)return;
    currentOrientation=button.dataset.coverOrientation;refreshLayout();invalidate();
  }));
  document.querySelectorAll("[data-background]").forEach(input=>input.addEventListener("input",async()=>{
    paintWholeModeTabs();
    changeBackgroundControlStates();
    if(!lastResult||working)return;
    try {await showComposite();setStatus("已更新","success");}
    catch(err) {setStatus(`背景更新失敗：${err.message}`,"error");}
  }));
  function paintWholeModeTabs() {
    const current=wholeMode.value;
    document.querySelectorAll("[data-whole-mode]").forEach(btn=>{
      const ok=btn.dataset.wholeMode===current;
      btn.classList.toggle("is-current",ok);btn.setAttribute("aria-pressed",String(ok));
    });
    document.querySelector(".whole-upload").hidden=current!=="image";
  }
  document.querySelectorAll("[data-whole-mode]").forEach(btn=>btn.addEventListener("click",()=>{
    wholeMode.value=btn.dataset.wholeMode;
    wholeMode.dispatchEvent(new Event("input",{bubbles:true}));
    changeBackgroundControlStates();paintWholeModeTabs();
  }));
  paintWholeModeTabs();
  resetBtn.addEventListener("click",()=>{
    if(working)return;
    slots.forEach((slot,i)=>{slot.code=seeds[i].code;slot.input.value=seeds[i].text;
      updateCounts(slot.input,slot.count);paintSlot(i);});
    selectArea(0);invalidate();setStatus("已恢復作者預設的六槽藝術字；按「重新產生封面」即可看到實際效果。");
  });
  pickerSearch.addEventListener("input",()=>{clearTimeout(debounce);debounce=setTimeout(()=>{pageNo=0;renderPicker();},110);});
  prevBtn.addEventListener("click",()=>{pageNo--;renderPicker();});
  nextBtn.addEventListener("click",()=>{pageNo++;renderPicker();});
  chooseClose.addEventListener("click",closePicker);
  picker.addEventListener("click",event=>{if(event.target===picker)closePicker();});
  document.addEventListener("keydown",event=>{
    if(picker.hidden)return;
    if(event.key==="Escape"){event.preventDefault();closePicker();return;}
    if(event.key==="Tab"){
      const focusables=[...picker.querySelectorAll('button:not([disabled]),input:not([disabled])')];
      if(!focusables.length)return;
      if(event.shiftKey&&document.activeElement===focusables[0]){event.preventDefault();focusables.at(-1).focus();}
      else if(!event.shiftKey&&document.activeElement===focusables.at(-1)){event.preventDefault();focusables[0].focus();}
    }
  });
  window.addEventListener("pagehide",()=>{adapter.destroy();revokeURLs();});
  setStatus("");
  // 網頁開啟後立即從獨立藝術字 Repo 取得真正 SVG；不使用一般文字佔位代替。
  // file:// 時 iframe 常被瀏覽器安全政策阻擋，明確提示模擬部署。
  if(location.protocol==="file:")setStatus("請從 HTTP／HTTPS 模擬部署開啟；file:// 可能無法載入跨 Repo 藝術字。","error");
  else void render();
})();
