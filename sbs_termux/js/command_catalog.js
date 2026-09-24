window.SBSTermuxCatalog=(()=>{
  'use strict';
  const groups=window.SBSTermuxCategories;
  const data=window.SBSTermuxCommands;
  function categories(){
    return groups.map(g=>({
      ...g, count:(data[g.id]||[]).length
    }));
  }
  function all(){
    return groups.flatMap(g=>(data[g.id]||[]).map(c=>({
      ...c, categoryId:g.id, categoryTitle:g.title
    })));
  }
  function byCategory(id){
    return all().filter(c=>c.categoryId===id);
  }
  function find(id){
    return all().find(c=>c.id===id)||null;
  }
  return Object.freeze({
    categories, all, byCategory, find
  });
})();
