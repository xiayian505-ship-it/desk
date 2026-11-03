"use strict";
/* 正式化的接入層 Demo：只接受 code / text / orientation，不依賴選款 UI。
 * 單款設定動態載入；藝術字 JavaScript 在既有沙盒 iframe 中按需載入。
 */
(function (global) {
  const catalog = global.SlowlyCoverWordCatalog;
  const inflight = new Map();
  const cached = new Map();
  const source = new URL("./entries/", document.currentScript.src);
  global.SlowlyCoverWordEntryRegistry = global.SlowlyCoverWordEntryRegistry || Object.create(null);
  const registry = global.SlowlyCoverWordEntryRegistry;

  function resolveEntry(code) {
    if (!catalog?.has(code)) return Promise.reject(new Error(`找不到藝術字代號：${code}`));
    if (cached.has(code)) return Promise.resolve(cached.get(code));
    if (inflight.has(code)) return inflight.get(code);
    const request = new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src=new URL(`${code}.js`,source).href;
      const timeout=setTimeout(()=>{
        script.remove(); reject(new Error(`載入 ${code} 的接入設定逾時`));
      },20000);
      script.onload=()=>{
        clearTimeout(timeout); script.remove();
        const entry=registry[code];
        if (!entry || entry.code!==code || !Array.isArray(entry.scripts) || !entry.scripts.length) return reject(new Error(`接入設定缺失：${code}`));
        if (entry.scripts.some(url=>{try {return new URL(url).protocol!=="https:";}catch{return true;}})) return reject(new Error(`非 HTTPS 的藝術字資源：${code}`));
        cached.set(code,entry);
        delete registry[code];
        resolve(entry);
      };
      script.onerror=()=>{clearTimeout(timeout); script.remove(); reject(new Error(`無法載入 ${code} 的接入設定`));};
      document.head.appendChild(script);
    }).finally(()=>inflight.delete(code));
    inflight.set(code,request);
    return request;
  }
  class WordAdapter {
    constructor(host) { this.pool = new global.SlowlyWordBridgePool(host); }
    async generate({code,text,orientation="vertical"}) {
      const clean=String(text??"").trim();
      if (!clean || Array.from(clean).length>4) throw new Error("每槽需輸入 1～4 字");
      if (orientation!=="vertical" && orientation!=="horizontal") throw new Error("未知的文字排列方向");
      const entry=await resolveEntry(code);
      const result=await this.pool.generate(entry,clean,orientation);
      return {code, title:catalog.get(code).title, orientation, ...result};
    }
    async generateMany(slots, onSlotSettled, {fitSlots = null} = {}) {
      if (!Array.isArray(slots)) throw new Error("槽位資料必須是陣列");
      if (fitSlots != null && (!Array.isArray(fitSlots) || fitSlots.length !== slots.length)) {
        throw new Error("藝術字的排版槽位資料數量不符");
      }
      this.pool.retain(slots.map(item => item.code));
      let completed = 0;
      const total = slots.length;
      // 每款封面只傳入槽位幾何：共用接入器一併負責文字生成與視覺縮放。
      // 讓進度反映「完成生成+量測」的槽位，避免量測失敗時仍誤報整體成功。
      return Promise.all(slots.map(async (slot, index) => {
        let result;
        try {
          const generated = await this.generate(slot);
          let fitBox = null;
          let fitWarning = null;
          if (fitSlots) {
            try {
              if (typeof global.SlowlyCoverWordFit?.measure !== "function") {
                throw new Error("共用 SVG 縮放模組尚未載入");
              }
              fitBox = await global.SlowlyCoverWordFit.measure(generated.svg, {
                text: generated.text,
                slot: fitSlots[index]
              });
              if (!fitBox?.measured) fitWarning = "SVG 沒有可辨識的可見範圍，已使用原始畫布";
            } catch (error) {
              fitWarning = String(error?.message || error);
              console.warn(`[SlowlyCover] 第 ${index+1} 槽無法完成視覺縮放，使用原始畫布`, error);
            }
          }
          result = {index,ok:true,...generated,fitBox,fitWarning};
        } catch (err) {
          result = {index,ok:false,code:slot.code,error:err?.message||String(err)};
        }
        completed++;
        if (typeof onSlotSettled === "function") {
          try { onSlotSettled({completed,total,index,code:slot.code,ok:result.ok,fitWarning:result.fitWarning}); }
          catch (err) { console.warn("藝術字載入狀態回報失敗",err); }
        }
        return result;
      }));
    }
    get loadedCount() {return this.pool.loadedCount;}
    get cachedManifestCount() {return cached.size;}
    destroy() {this.pool.destroy();}
  }
  global.SlowlyCoverWordAdapter=WordAdapter;
})(window);
