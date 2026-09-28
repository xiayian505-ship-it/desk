window.SBSTermuxClipboard=(()=>{
  'use strict';
  async function copy(text){
    if(!String(text||'').trim())throw Error('沒有可複製的指令。');
    return window.SlowlyClipboardCopy.copy(text);
  }
  return Object.freeze({
    copy
  });
})();
