window.SBSTermuxCommands=window.SBSTermuxCommands||{
};
window.SBSTermuxCommands.termux=[ {
  id:'termux.pwd', title:'查看目前位置', description:'確認終端機所在目錄。', template:'pwd'
}, {
  id:'termux.home', title:'回到 Termux 家目錄', description:'切換到家目錄並確認位置。', template:'cd ~\npwd'
}, {
  id:'termux.storage', title:'查看共享儲存空間', description:'確認 Termux 能否讀取手機共享空間。', template:'ls -la ~/storage/shared'
}, {
  id:'termux.versions', title:'檢查 Git 與 Node 版本', description:'Node 未安裝時可能顯示找不到指令。', template:'git --version\nnode --version'
}];
