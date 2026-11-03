"use strict";
/* 同款藝術字只載入一次；不同款仍在獨立 sandbox iframe 中運作。 */
(function (global) {
  class WordBridgePool {
    constructor(host) { this.host = host; this.entries = new Map(); }
    async get(entry) {
      if (!entry || !entry.code) throw new Error("缺少藝術字識別碼");
      let item = this.entries.get(entry.code);
      if (!item) {
        const bridge = new global.SlowlyWordBridge(this.host);
        item = { bridge, promise: bridge.load(entry) };
        this.entries.set(entry.code, item);
      }
      try { await item.promise; return item.bridge; }
      catch (error) {
        if (this.entries.get(entry.code) === item) {
          this.entries.delete(entry.code);
          item.bridge.destroy();
        }
        throw error;
      }
    }
    async generate(entry, text, orientation) {
      const bridge = await this.get(entry);
      return bridge.generate(text, orientation);
    }
    retain(codes) {
      const active = new Set(codes);
      for (const [code, item] of this.entries) {
        if (!active.has(code)) { this.entries.delete(code); item.bridge.destroy(); }
      }
    }
    get loadedCount() { return this.entries.size; }
    destroy() { for (const item of this.entries.values()) item.bridge.destroy(); this.entries.clear(); }
  }
  global.SlowlyWordBridgePool = WordBridgePool;
})(window);
