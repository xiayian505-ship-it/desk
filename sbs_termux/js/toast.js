/* 提示訊息介面：使用軍火庫 Toast；錯誤顏色由本專案決定。 */
window.SBSTermuxToast=(()=>{
  'use strict';
  let instance=null;
  return(message, error=false)=>{
    const el=document.getElementById('toast');
    if(!el)return;
    el.classList.toggle('error', !!error);
    el.classList.toggle('ok', !error);
    if(!instance)instance=window.SlowlyToast.create(el, {
      duration:2400
    });
    instance.show(message);
  };
})();
