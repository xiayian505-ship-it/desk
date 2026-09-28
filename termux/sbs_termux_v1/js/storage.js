window.SBSTermuxStorage=(()=>{
  'use strict';
  const PREFIX='sbs_termux_v1';
  const KEYS=Object.freeze({
    projects:PREFIX+'_projects', active:PREFIX+'_active_project'
  });
  function read(key, fallback){
    try{
      const value=JSON.parse(localStorage.getItem(KEYS[key]));
      return value===null?fallback:value;
    }
    catch(_){
      return fallback;
    }
  }
  function write(key, value){
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  }
  return Object.freeze({
    KEYS, read, write
  });
})();
