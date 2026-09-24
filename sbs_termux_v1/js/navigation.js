window.SBSTermuxNavigation=(()=>{
  'use strict';
  const ORIGIN='sbs_termux_v1_return';
  function remember(){
    sessionStorage.setItem(ORIGIN, location.pathname+location.search+location.hash);
  }
  function groupHref(id){
    return './group.html?group='+encodeURIComponent(id);
  }
  function returnHref(){
    const ref=sessionStorage.getItem(ORIGIN);
    if(ref&&ref!==location.pathname+location.search+location.hash&&ref.startsWith('/')&&!ref.startsWith('//'))return ref;
    return './index.html#categories';
  }
  function initBack(){
    document.querySelectorAll('[data-back]').forEach(a=>a.href=returnHref());
  }
  return Object.freeze({
    remember, groupHref, returnHref, initBack
  });
})();
