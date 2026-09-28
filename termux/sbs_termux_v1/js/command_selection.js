window.SBSTermuxSelection=(()=>{
  'use strict';
  const KEY='sbs_termux_v1_transient_selection';
  const MAX=5;
  const listeners=new Set();
  const nav=performance.getEntriesByType('navigation')[0];
  if(nav?.type==='reload')sessionStorage.removeItem(KEY);
  let items=[];
  try{
    const parsed=JSON.parse(sessionStorage.getItem(KEY));
    if(Array.isArray(parsed))items=parsed.filter(v=>v&&typeof v.commandId==='string').slice(0, MAX);
  }
  catch(_){
  }
  function list(){
    return items.map(x=>({
      ...x, values:{
        ...x.values
      }
    }));
  }
  function save(){
    sessionStorage.setItem(KEY, JSON.stringify(items));
    listeners.forEach(fn=>fn());
  }
  function add(commandId, values={
  }){
    if(items.length>=MAX)throw Error('最多只能選取 5 個指令。');
    items.push({
      selectionId:'s_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2, 7), commandId, values:{
        ...values
      }
    });
    save();
  }
  function remove(id){
    items=items.filter(x=>x.selectionId!==id);
    save();
  }
  function move(id, delta){
    const i=items.findIndex(x=>x.selectionId===id), j=i+delta;
    if(i<0||j<0||j>=items.length)return;
    [items[i], items[j]]=[items[j], items[i]];
    save();
  }
  function clear(){
    items=[];
    save();
  }
  function subscribe(fn){
    listeners.add(fn);
    return()=>listeners.delete(fn);
  }
  return Object.freeze({
    MAX, list, add, remove, move, clear, subscribe
  });
})();
