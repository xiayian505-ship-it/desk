/* 主檔：提供工具的統一功能入口；指令規則由 function/ 負責。 */
(function (global) {
  'use strict';
  const engine = global.SBSTermuxV2Function;
  if (!engine || typeof engine.generate !== 'function') {
    throw new Error('主要功能尚未載入，請確認 function/ 的引用路徑。');
  }
  global.SBSTermuxV2 = engine;
})(window);
