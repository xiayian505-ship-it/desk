window.SBSTermuxProjectUI=(()=>{
  'use strict';
  const P=window.SBSTermuxProjects;
  const $=id=>document.getElementById(id);
  let editing=null;
  function render(){
    const p=P.current();
    document.querySelectorAll('[data-current-project]').forEach(el=>el.textContent=p?p.name:'尚未選取專案');
    document.querySelectorAll('[data-current-path]').forEach(el=>el.textContent=p?p.path:'請先建立或選取專案');
    const select=$('project-select');
    if(select){
      select.replaceChildren();
      select.add(new Option('尚未選取專案', ''));
      P.list().forEach(item=>select.add(new Option(item.name, item.id)));
      select.value=p?.id||'';
    }['edit-project', 'remove-project', 'copy-path', 'make-directory'].forEach(id=>{
      if($(id))$(id).disabled=!p;
    });
  }
  function init(){
    render();
    P.subscribe(render);
    const select=$('project-select');
    if(!select)return;
    select.addEventListener('change', ()=>P.select(select.value||null));
    const dialog=$('project-dialog'), form=$('project-form');
    function open(p){
      editing=p?.id||null;
      $('dialog-title').textContent=p?'編輯專案':'建立專案';
      $('project-name').value=p?.name||'';
      $('project-directory').value=p?.path||'';
      $('project-description').value=p?.description||'';
      dialog.showModal();
    } $('add-project').onclick=()=>open(null);
    $('edit-project').onclick=()=>open(P.current());
    $('remove-project').onclick=()=>{
      const p=P.current();
      if(p&&confirm('確定刪除專案「'+p.name+'」？只刪除網站紀錄，不會刪除手機目錄。'))P.remove(p.id);
    };
    $('close-dialog').onclick=()=>dialog.close();
    $('cancel-dialog').onclick=()=>dialog.close();
    form.onsubmit=e=>{
      e.preventDefault();
      try{
        P.upsert({
          name:$('project-name').value, path:$('project-directory').value, description:$('project-description').value
        }, editing);
        dialog.close();
        window.SBSTermuxToast('專案已儲存。');
      }
      catch(err){
        window.SBSTermuxToast(err.message, true);
      }
    };
    $('copy-path').onclick=async()=>{
      try{
        await window.SBSTermuxClipboard.copy(P.current().path);
        window.SBSTermuxToast('已複製專案路徑。');
      }
      catch(err){
        window.SBSTermuxToast(err.message, true);
      }
    };
    $('make-directory').onclick=()=>{
      try{
        window.SBSTermuxSelection.add('files.mkdir', {
          targetPath:P.current().path
        });
        window.SBSTermuxToast('已將建立目錄加入選取清單。');
      }
      catch(err){
        window.SBSTermuxToast(err.message, true);
      }
    };
  }
  return Object.freeze({
    init, render
  });
})();
