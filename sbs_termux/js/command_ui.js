window.SBSTermuxCommandUI=(()=>{
  'use strict';
  const C=window.SBSTermuxCatalog, S=window.SBSTermuxSelection, P=window.SBSTermuxProjects;
  function node(tag, cls, text){
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(text!==undefined)el.textContent=text;
    return el;
  }
  function makeCard(cmd){
    const card=node('article', 'command-card');
    const top=node('div', 'item-head');
    const title=node('h3', '', cmd.title);
    const add=node('button', '', '加入選取');
    add.type='button';
    add.disabled=S.list().length>=S.MAX;
    top.append(title, add);
    card.append(top, node('p', 'muted', cmd.description||''));
    if(cmd.risk)card.append(node('p', 'risk', cmd.risk));
    const inputs={
    };
    for(const p of cmd.parameters||[]){
      if(p.source!=='input')continue;
      const label=node('label', 'field', p.label);
      const input=document.createElement('input');
      input.type='text';
      input.placeholder=p.defaultFrom==='project.path'?'預設使用目前專案路徑':'請輸入'+p.label;
      input.value=p.defaultValue||'';
      input.required=!!p.required;
      label.append(input);
      card.append(label);
      inputs[p.key]=input;
    }
    add.onclick=()=>{
      try{
        const values={
        };
        for(const p of cmd.parameters||[]){
          if(p.source!=='input')continue;
          values[p.key]=inputs[p.key].value.trim()||(p.defaultFrom==='project.path'?P.current()?.path||'':'');
          if(p.required&&!values[p.key])throw Error('請填寫「'+p.label+'」。');
        }
        S.add(cmd.id, values);
        window.SBSTermuxToast('已加入「'+cmd.title+'」。');
      }
      catch(err){
        window.SBSTermuxToast(err.message, true);
      }
    };
    return card;
  }
  function renderCommands(host, commands){
    host.replaceChildren();
    if(!commands.length){
      host.append(node('p', 'muted', '目前沒有符合的指令。'));
      return;
    }
    commands.forEach(c=>host.append(makeCard(c)));
  }
  function renderSelection(){
    const host=document.getElementById('selected-items');
    if(!host)return;
    host.replaceChildren();
    const items=S.list();
    document.getElementById('selection-count').textContent=items.length+' / 5';
    for(const [i, item] of items.entries()){
      const c=C.find(item.commandId);
      const row=node('div', 'selected-row');
      const label=node('span', '', String(i+1)+'. '+(c?.title||item.commandId));
      const controls=node('div', 'mini-actions');
      for(const [name, fn, disabled] of [['↑', ()=>S.move(item.selectionId, -1), i===0], ['↓', ()=>S.move(item.selectionId,
      1), i===items.length-1], ['移除', ()=>S.remove(item.selectionId), false]]){
        const b=node('button', 'subtle', name);
        b.type='button';
        b.disabled=disabled;
        b.onclick=fn;
        controls.append(b);
      }
      row.append(label, controls);
      host.append(row);
    }
    if(!items.length)host.append(node('p', 'muted', '尚未選取指令。'));
    document.querySelectorAll('.command-card button').forEach(b=>{
      if(b.textContent==='加入選取')b.disabled=items.length>=S.MAX;
    });
  }
  function init(){
    S.subscribe(renderSelection);
    renderSelection();
    const clear=document.getElementById('clear-selection');
    if(clear)clear.onclick=()=>S.clear();
  }
  return Object.freeze({
    makeCard, renderCommands, renderSelection, init
  });
})();
