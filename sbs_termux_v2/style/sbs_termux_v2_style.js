/* 網頁 UI：任務頁籤與表單可見狀態；不處理 Git 指令。 */
(function (global) {
  'use strict';

  const $ = (id) => document.getElementById(id);
  function showTask(kind) {
    document.querySelectorAll('[data-task]').forEach((button) => {
      const active = button.dataset.task === kind;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });

    document.querySelectorAll('[data-form]').forEach((form) => {
      form.hidden = form.dataset.form !== kind;
    });

    $('results').hidden = true;
    $('error').textContent = '';
  }

  function showDownloadMode(mode) {
    document.querySelectorAll('[data-download-mode]').forEach((element) => {
      element.hidden = element.dataset.downloadMode !== mode;
    });

    $('download-location-label').textContent = mode === 'clone'
      ? '要把專案下載到手機的哪個資料夾？'
      : '手機裡已有的專案資料夾在哪裡？';
  }

  global.SBSTermuxV2Style = Object.freeze({ showTask, showDownloadMode });
})(window);
