window.SBSTermuxGroupPage=(()=>{
  'use strict';
  function init(){
    const params=new URLSearchParams(location.search), id=params.get('group'), cat=window.SBSTermuxCatalog.categories().find(c=>c.id===id);
    window.SBSTermuxNavigation.initBack();
    if(!cat){
      document.getElementById('group-title').textContent='找不到這個分類';
      document.getElementById('group-desc').textContent='請返回指令分類重新選擇。';
      return;
    }
    document.title=cat.title+'｜慢慢終端機';
    document.getElementById('group-title').textContent=cat.title;
    document.getElementById('group-crumb').textContent=cat.title;
    document.getElementById('group-desc').textContent=cat.description;
    document.getElementById('group-count').textContent=cat.count+' 條指令';
    window.SBSTermuxCommandUI.renderCommands(document.getElementById('group-list'), window.SBSTermuxCatalog.byCategory(id));
  }
  return Object.freeze({
    init
  });
})();
