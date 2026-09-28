window.SBSTermuxOutput=(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  let result=null;
  function button(label, fn){
    const b=document.createElement('button');
    b.type='button';
    b.textContent=label;
    b.onclick=fn;
    return b;
  }
  function show(){
    const host=$('output-items');
    if(!host)return;
    host.replaceChildren();
    $('output-count').textContent=(result?.items.length||0)+' / 5';
    $('copy-all').disabled=!result?.items.length;
    for(const item of result?.items||[]){
      const card=document.createElement('article');
      card.className='output-item';
      const head=document.createElement('div');
      head.className='item-head';
      const title=document.createElement('strong');
      title.textContent=item.title;
      head.append(title, button('複製這條', ()=>copy(item.text, '已複製「'+item.title+'」。')));
      const pre=document.createElement('pre');
      pre.textContent=item.text;
      card.append(head, pre);
      if(item.risk){
        const note=document.createElement('p');
        note.className='risk';
        note.textContent=item.risk;
        card.append(note);
      }
      host.append(card);
    }
    if(!result?.items.length){
      const p=document.createElement('p');
      p.className='muted';
      p.textContent='選好指令後，按「產生指令」就會顯示在這裡。';
      host.append(p);
    }
  }
  async function copy(value, msg){
    try{
      await window.SBSTermuxClipboard.copy(value);
      window.SBSTermuxToast(msg);
    }
    catch(err){
      window.SBSTermuxToast(err.message, true);
    }
  }
  function generate(){
    try{
      const items=window.SBSTermuxSelection.list();
      if(!items.length)throw Error('請先選取至少一條指令。');
      result=window.SBSTermuxBuilder.buildAll(items);
      show();
      window.SBSTermuxToast('已產生 '+result.items.length+' 條指令。');
    }
    catch(err){
      window.SBSTermuxToast(err.message, true);
    }
  }
  function init(){
    if(!$('output-items'))return;
    show();
    $('generate-commands').onclick=generate;
    $('copy-all').onclick=()=>{
      if(result?.items.length)copy(result.items.map(i=>i.text).join('\n'), '已複製全部指令。');
    };
    $('clear-output').onclick=()=>{
      result=null;
      show();
    };
    window.SBSTermuxSelection.subscribe(()=>{
      result=null;
      show();
    });
    window.SBSTermuxProjects.subscribe(()=>{
      result=null;
      show();
    });
  }
  return Object.freeze({
    init, generate
  });
})();
