/* 主程式：只負責初始化各獨立模組。 */
document.addEventListener('DOMContentLoaded', ()=>{
  window.SBSTermuxProjectUI.init();
  window.SBSTermuxCommandUI.init();
  window.SBSTermuxOutput.init();
  if(document.body.dataset.page==='group')window.SBSTermuxGroupPage.init();
  else window.SBSTermuxStyle.init();
});
