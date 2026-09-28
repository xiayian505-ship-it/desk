window.SBSTermuxCommands=window.SBSTermuxCommands||{
};
const gitPath=[{
  key:'projectPath', label:'專案路徑', type:'path', required:true, source:'project.path'
}];
window.SBSTermuxCommands.git=[ {
  id:'git.status', title:'檢查目前專案狀態', description:'確認修改、未追蹤檔案和分支。', template:'cd {{projectPath}}\ngit status',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.branch', title:'查看分支與遠端', description:'核對目前分支與遠端網址。', template:'cd {{projectPath}}\ngit branch --show-current\ngit remote -v',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.diff', title:'查看尚未暫存的修改', description:'檢視尚未加入暫存區的差異。', template:'cd {{projectPath}}\ngit diff',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.staged', title:'檢查準備提交的檔案', description:'查看暫存修改摘要及狀態。', template:'cd {{projectPath}}\ngit diff --cached --stat\ngit status',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.log', title:'最近五筆提交', description:'核對最近版本。', template:'cd {{projectPath}}\ngit log -5 --oneline',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.fetch', title:'取得遠端資訊', description:'只更新遠端追蹤資訊，不合併。', template:'cd {{projectPath}}\ngit fetch origin\ngit status',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.pull', title:'拉取目前分支更新', description:'使用 fast-forward only，避免自動建立合併提交。', risk:'執行前先確認工作區狀態及遠端分支。',
  template:'cd {{projectPath}}\ngit status\ngit pull --ff-only origin "$(git branch --show-current)"', requiresProject:true,
  parameters:gitPath
}, {
  id:'git.add', title:'加入整個專案所有變更', description:'包含新增、修改及刪除。', risk:'確認沒有私密檔案或不想提交的內容。', template:'cd {{projectPath}}\ngit add -A\ngit diff --cached --stat\ngit status',
  requiresProject:true, parameters:gitPath
}, {
  id:'git.commit', title:'提交已暫存的修改', description:'自行填入提交訊息。', template:'cd {{projectPath}}\ngit diff --cached --stat\ngit commit -m {{message}}',
  requiresProject:true, parameters:[...gitPath, {
    key:'message', label:'提交訊息', type:'text', required:true, source:'input', defaultValue:'Update project'
  }]
}, {
  id:'git.push', title:'推送目前分支', description:'推送至 origin 同名分支。', risk:'先核對分支與遠端網址。', template:'cd {{projectPath}}\ngit status\ngit branch --show-current\ngit remote -v\ngit push origin "$(git branch --show-current)"',
  requiresProject:true, parameters:gitPath
}];
