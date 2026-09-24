window.SBSTermuxCommands=window.SBSTermuxCommands||{
};
window.SBSTermuxCommands.files=[ {
  id:'files.mkdir', title:'建立目錄', description:'建立指定目錄；上層不存在時一併建立。', template:'mkdir -p {{targetPath}}',
  parameters:[{
    key:'targetPath', label:'目標路徑', type:'path', required:true, source:'input', defaultFrom:'project.path'
  }]
}, {
  id:'files.cd', title:'進入目前專案', description:'切換至目前選取的專案目錄。', template:'cd {{projectPath}}', requiresProject:true,
  parameters:[{
    key:'projectPath', label:'專案路徑', type:'path', required:true, source:'project.path'
  }]
}, {
  id:'files.list', title:'查看專案檔案', description:'進入專案後列出檔案。', template:'cd {{projectPath}}\nls -la', requiresProject:true,
  parameters:[{
    key:'projectPath', label:'專案路徑', type:'path', required:true, source:'project.path'
  }]
}, {
  id:'files.zip', title:'列出 ZIP 內的檔案', description:'輸入要檢查的 ZIP 檔名或路徑。', template:'unzip -Z1 {{zipPath}}',
  parameters:[{
    key:'zipPath', label:'ZIP 路徑', type:'path', required:true, source:'input'
  }]
}];
