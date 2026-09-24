window.SBSTermuxBuilder=(()=>{
  'use strict';
  const C=window.SBSTermuxCatalog;
  const P=window.SBSTermuxProjects;
  function shellQuote(value, type){
    const v=String(value||'').trim();
    if(!v||/[\x00-\x1f\x7f]/.test(v))throw Error('參數不能為空，也不能包含換行或控制字元。');
    if(type==='path'&&!P.validPath(v)&&!/^\.{1,2}(\/|$)/.test(v)&&!/^[^/]+/.test(v))throw Error('路徑格式不正確。');
    if(v==='~')return '"$HOME"';
    if(v.startsWith('~/'))return '"$HOME"/'+quote(v.slice(2));
    return quote(v);
  }
  function quote(v){
    return "'"+v.replace(/'/g, "'\\''")+"'";
  }
  function build(selection, project){
    const command=C.find(selection.commandId);
    if(!command)throw Error('找不到指令。');
    if(command.requiresProject&&!project)throw Error('這條指令需要先選取專案。');
    let text=command.template;
    for(const p of command.parameters||[]){
      let value=p.source==='project.path'?project?.path:selection.values?.[p.key];
      if(p.required&&!String(value??'').trim())throw Error('「'+p.label+'」尚未填寫。');
      text=text.split('{{'+p.key+'}}').join(shellQuote(value, p.type));
    }
    if(/{{[^{}]+}}/.test(text))throw Error('指令仍有未填入的參數。');
    return {
      selectionId:selection.selectionId, commandId:command.id, title:command.title, text, risk:command.risk||''
    };
  }
  function buildAll(items){
    const project=P.current();
    return {
      projectId:project?.id||null, projectName:project?.name||'', items:items.map(item=>build(item, project))
    };
  }
  return Object.freeze({
    build, buildAll, shellQuote
  });
})();
