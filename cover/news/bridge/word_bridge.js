"use strict";
/* 封面獨立 Repo 專用的藝術字接入層。
 * 對外只提供 load(entry) / generate(text, orientation) / destroy()。
 * 藝術字專案不需要知道本接入層存在。
 */
(function (global) {
  const CHANNEL = "slowly-cover-word-bridge-v1";
  const FRAME_URL = "bridge/loader_frame.html"; // 只有本 Demo 自己的檔案用相對路徑。
  class WordBridge {
    constructor(host) {
      this.host = host;
      this.frame = null;
      this.ready = false;
      this.token = null;
      this.pending = new Map();
      this.nextId = 0;
      this.initResolve = null;
      this.initReject = null;
      this.timeout = null;
      this.listener = event => this.receive(event);
      global.addEventListener("message", this.listener);
    }
    receive(event) {
      if (!this.frame || event.source !== this.frame.contentWindow) return;
      const msg = event.data;
      if (!msg || msg.channel !== CHANNEL) return;
      if (msg.type === "boot") {
        this.frame.contentWindow.postMessage({ channel: CHANNEL, type: "init", entry: this.entry }, "*");
        return;
      }
      if (msg.token !== this.token) return;
      if (msg.type === "ready") {
        this.ready = true;
        clearTimeout(this.timeout);
        this.initResolve?.();
        this.initResolve = this.initReject = null;
      } else if (msg.type === "error") {
        clearTimeout(this.timeout);
        this.initReject?.(new Error(msg.message));
        this.initResolve = this.initReject = null;
      } else if (msg.type === "result" || msg.type === "result-error") {
        const p = this.pending.get(msg.requestId);
        if (!p) return;
        this.pending.delete(msg.requestId);
        clearTimeout(p.timer);
        if (msg.type === "result") p.resolve({ svg: msg.svg, text: msg.text });
        else p.reject(new Error(msg.message));
      }
    }
    unload() {
      clearTimeout(this.timeout);
      this.initReject?.(new Error("已切換藝術字"));
      this.initResolve = this.initReject = null;
      for (const p of this.pending.values()) {
        clearTimeout(p.timer);
        p.reject(new Error("已切換藝術字"));
      }
      this.pending.clear();
      if (this.frame) this.frame.remove();
      this.frame = null;
      this.ready = false;
      this.entry = null;
      this.token = null;
    }
    async load(entry) {
      this.unload();
      if (!entry?.code || !Array.isArray(entry.scripts) || !entry.scripts.length) throw new Error("接入清單缺少必要資料");
      this.token = global.crypto?.randomUUID?.() || String(Date.now()) + "-" + Math.random().toString(36).slice(2);
      this.entry = { ...entry, token: this.token };
      const frame = document.createElement("iframe");
      frame.title = "藝術字隔離生成容器";
      frame.setAttribute("sandbox", "allow-scripts");
      frame.src = FRAME_URL;
      this.frame = frame;
      const promise = new Promise((resolve, reject) => {
        this.initResolve = resolve;
        this.initReject = reject;
        this.timeout = setTimeout(() => { this.initResolve = this.initReject = null; reject(new Error("接入逾時，請確認藝術字或軍火庫的 HTTPS 網址是否可存取")); }, 120000);
      });
      this.host.appendChild(frame);
      return promise;
    }
    generate(text, orientation) {
      if (!this.ready || !this.frame) return Promise.reject(new Error("接入層尚未就緒"));
      const requestId = ++this.nextId;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          this.pending.delete(requestId);
          reject(new Error("SVG 生成逾時"));
        }, 30000);
        this.pending.set(requestId, { resolve, reject, timer });
        this.frame.contentWindow.postMessage({ channel: CHANNEL, type: "generate", token: this.token, requestId, text, orientation }, "*");
      });
    }
    destroy() { this.unload(); global.removeEventListener("message", this.listener); }
  }
  global.SlowlyWordBridge = WordBridge;
})(window);
