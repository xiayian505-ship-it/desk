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
    async generateMany(slots, onSlotSettled) {
      if (!Array.isArray(slots)) throw new Error("槽位資料必須是陣列");
      this.pool.retain(slots.map(item=>item.code));
      let completed = 0;
      const total = slots.length;
      // 進度事件是可選的；生成器、選款與跨 Repo 接入協定均不變。
      // 回報實際完成的槽位，不推測網路百分比；個別槽失敗仍計入已處理數。
      return Promise.all(slots.map(async (slot,index)=>{
        let result;
        try { result={index,ok:true,...await this.generate(slot)}; }
        catch(err){ result={index,ok:false,code:slot.code,error:err?.message||String(err)}; }
        completed++;
        if (typeof onSlotSettled === "function") {
          try { onSlotSettled({completed,total,index,code:slot.code,ok:result.ok}); }
          catch(err) { console.warn("藝術字載入狀態回報失敗",err); }
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
