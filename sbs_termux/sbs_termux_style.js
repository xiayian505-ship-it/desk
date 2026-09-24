window.SBSTermuxStyle=(()=>{
  'use strict';
  function init(){
    const tabs=[...document.querySelectorAll('[data-tab]')], panels=[...document.querySelectorAll('[data-panel]')];
    function activate(name){
      if(!panels.some(p=>p.dataset.panel===name))name='intro';
      tabs.forEach(t=>{
        const on=t.dataset.tab===name;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex=on?0:-1;
      });
      panels.forEach(p=>p.hidden=p.dataset.panel!==name);
      document.getElementById('command-workspace').hidden=name==='intro';
    }
    tabs.forEach(t=>t.onclick=()=>{
      activate(t.dataset.tab);
      history.replaceState(null, '', '#'+t.dataset.tab);
    });
    activate(location.hash.slice(1)||'intro');
    window.addEventListener('hashchange', ()=>activate(location.hash.slice(1)));
    const categories=document.getElementById('category-list');
    window.SBSTermuxCatalog.categories().forEach(c=>{
      const a=document.createElement('a');
      a.className='category-entry';
      a.href=window.SBSTermuxNavigation.groupHref(c.id);
      a.onclick=()=>window.SBSTermuxNavigation.remember();
      const h=document.createElement('strong');
      h.textContent=c.title;
      const desc=document.createElement('span');
      desc.textContent=c.description;
      const count=document.createElement('small');
      count.textContent=c.count+' 條指令';
      a.append(h, desc, count);
      categories.append(a);
    });
    const search=document.getElementById('command-search'), list=document.getElementById('all-command-list');
    function render(){
      const q=search.value.trim().toLowerCase();
      window.SBSTermuxCommandUI.renderCommands(list, window.SBSTermuxCatalog.all().filter(c=>!q||[c.title, c.description,
      c.categoryTitle, c.id].join(' ').toLowerCase().includes(q)));
    }
    search.addEventListener('input', render);
    render();
  }
  return Object.freeze({
    init
  });
})();
