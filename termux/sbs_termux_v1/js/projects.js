window.SBSTermuxProjects=(()=>{
  'use strict';
  const S=window.SBSTermuxStorage;
  const listeners=new Set();
  let projects=S.read('projects', []);
  if(!Array.isArray(projects))projects=[];
  projects=projects.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string'&&typeof p.path==='string');
  let active=S.read('active', null);
  if(!projects.some(p=>p.id===active))active=null;
  function emit(){
    listeners.forEach(fn=>fn());
  }
  function save(){
    S.write('projects', projects);
    S.write('active', active);
    emit();
  }
  function validPath(path){
    return typeof path==='string'&&/^(~\/|\/)/.test(path.trim())&&!/[\x00-\x1f\x7f]/.test(path)&&path.trim().length>1;
  }
  function list(){
    return projects.map(p=>({
      ...p
    }));
  }
  function current(){
    return projects.find(p=>p.id===active)||null;
  }
  function select(id){
    if(id!==null&&!projects.some(p=>p.id===id))throw Error('找不到專案。');
    active=id;
    save();
  }
  function upsert(data, id){
    const name=String(data.name||'').trim(), path=String(data.path||'').trim(), description=String(data.description||'').trim();
    if(!name||!validPath(path))throw Error('請輸入專案名稱，以及以 ~/ 或 / 開頭的有效路徑。');
    if(id){
      const p=projects.find(p=>p.id===id);
      if(!p)throw Error('找不到專案。');
      Object.assign(p, {
        name, path, description
      });
    }
    else{
      const p={
        id:'p_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2, 8), name, path, description
      };
      projects.push(p);
      active=p.id;
    }
    save();
  }
  function remove(id){
    projects=projects.filter(p=>p.id!==id);
    if(active===id)active=projects[0]?.id||null;
    save();
  }
  function subscribe(fn){
    listeners.add(fn);
    return()=>listeners.delete(fn);
  }
  return Object.freeze({
    list, current, select, upsert, remove, subscribe, validPath
  });
})();
