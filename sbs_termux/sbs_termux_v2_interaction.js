/* 互動 UI：表單送出、步驟勾選與複製；不執行終端機指令。 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  let task = 'setup';
  let currentSteps = [];
  // 剪貼簿、提示與確認交由共用軍火庫；缺件時明確顯示錯誤，不複製私有實作。
  const toastInstance = window.SlowlyToast?.create('#toast', { duration: 2500 });

  function toast(message) {
    if (toastInstance) toastInstance.show(message);
    else $('error').textContent = message;
  }

  async function copy(value) {
    try {
      if (!window.SlowlyClipboardCopy?.copy) {
        throw new Error('剪貼簿零件尚未載入');
      }
      await window.SlowlyClipboardCopy.copy(value);
      toast('已複製指令');
    } catch (error) {
      toast(`無法自動複製：${error.message}。請長按指令手動選取。`);
    }
  }

  function updateProgress() {
    const done = $('steps').querySelectorAll('input[type="checkbox"]:checked').length;
    $('progress').textContent = `${done}／${currentSteps.length} 步已勾選`;
  }

  function render(steps) {
    currentSteps = steps;
    const list = $('steps');
    list.replaceChildren();

    steps.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'step';

      const head = document.createElement('div');
      head.className = 'step-head';

      const number = document.createElement('span');
      number.className = 'step-number';
      number.textContent = String(index + 1).padStart(2, '0');

      const main = document.createElement('div');
      main.className = 'step-main';

      const title = document.createElement('h3');
      title.textContent = item.title;

      const expected = document.createElement('p');
      expected.className = 'expected';
      expected.textContent = '預期結果：' + item.expected;
      main.append(title, expected);

      if (item.caution) {
        const caution = document.createElement('p');
        caution.className = 'caution';
        caution.textContent = '注意：' + item.caution;
        main.append(caution);
      }

      const check = document.createElement('label');
      check.className = 'check-label';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.setAttribute('aria-label', `第 ${index + 1} 步：${item.title}，自行標記完成`);
      checkbox.addEventListener('change', () => {
        li.classList.toggle('is-done', checkbox.checked);
        updateProgress();
      });
      check.append(checkbox, document.createTextNode('完成'));
      head.append(number, main, check);

      const wrap = document.createElement('div');
      wrap.className = 'command-wrap';
      const toolbar = document.createElement('div');
      toolbar.className = 'command-toolbar';
      const caption = document.createElement('span');
      caption.textContent = 'Termux 指令（請逐步確認後執行）';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-btn';
      button.textContent = '複製這一步';
      button.addEventListener('click', () => copy(item.command));
      toolbar.append(caption, button);

      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = item.command;
      pre.append(code);
      wrap.append(toolbar, pre);
      li.append(head, wrap);
      list.append(li);
    });

    $('results').hidden = false;
    updateProgress();
    $('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function value(id) {
    return $(id).value;
  }

  function parseRepoField(id, folderId) {
    const output = $(id + '-parsed');
    try {
      const repo = window.SBSTermuxV2.repository(value(id));
      const [owner, name] = repo.split('/');
      output.textContent = `解析完成：帳號 ${owner}，專案 ${name}（尚未檢查專案是否存在）`;
      if (folderId && !$(folderId).dataset.userEdited) $(folderId).value = name;
      $('error').textContent = '';
      return repo;
    } catch (error) {
      output.textContent = '';
      $('error').textContent = error.message;
      return null;
    }
  }

  [['setup-repo', 'setup-folder'], ['download-repo', 'download-folder']].forEach(([id, folderId]) => {
    $(id + '-parse').addEventListener('click', () => parseRepoField(id, folderId));
    $(id).addEventListener('input', () => { $(id + '-parsed').textContent = ''; });
    $(folderId).addEventListener('input', () => { $(folderId).dataset.userEdited = 'true'; });
  });

  function collect() {
    if (task === 'setup') {
      return {
        location: value('setup-location'),
        repository: value('setup-repo'),
        folder: value('setup-folder')
      };
    }
    if (task === 'upload') {
      return {
        location: value('upload-location'),
        subpaths: value('upload-subpaths'),
        message: value('upload-message')
      };
    }
    return {
      mode: value('download-mode'),
      location: value('download-location'),
      repository: value('download-repo'),
      folder: value('download-folder'),
      branch: value('download-branch'),
      subpaths: value('download-subpaths')
    };
  }

  document.querySelectorAll('[data-task]').forEach((button) => {
    button.addEventListener('click', () => {
      task = button.dataset.task;
      window.SBSTermuxV2Style.showTask(task);
    });
  });

  $('download-mode').addEventListener('change', () => {
    window.SBSTermuxV2Style.showDownloadMode(value('download-mode'));
  });

  document.querySelectorAll('[data-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (task === 'setup' && !parseRepoField('setup-repo', 'setup-folder')) return;
      if (task === 'download' && value('download-mode') === 'clone' && !parseRepoField('download-repo', 'download-folder')) return;
      $('error').textContent = '';
      try {
        render(window.SBSTermuxV2.generate(task, collect()));
      } catch (error) {
        $('results').hidden = true;
        $('error').textContent = error.message;
      }
    });
  });

  $('copy-all').addEventListener('click', () => {
    const all = currentSteps.map((step, index) =>
      `# ${index + 1}. ${step.title}\n${step.command}`
    ).join('\n\n');
    copy(all);
  });

  $('reset-checks').addEventListener('click', async () => {
    const hasChecked = Boolean($('steps').querySelector('input[type="checkbox"]:checked'));
    if (hasChecked) {
      if (!window.SlowlyConfirm?.show) {
        toast('確認視窗零件尚未載入，未清除勾選。');
        return;
      }
      const approved = await window.SlowlyConfirm.show({
        title: '清除勾選？',
        message: '只會清除畫面上的進度，不會影響 Termux 或 GitHub。',
        confirmText: '清除',
        cancelText: '保留'
      });
      if (!approved) return;
    }
    document.querySelectorAll('#steps input[type="checkbox"]').forEach((box) => {
      box.checked = false;
      box.closest('.step').classList.remove('is-done');
    });
    updateProgress();
  });

  window.SBSTermuxV2Style.showTask(task);
  window.SBSTermuxV2Style.showDownloadMode(value('download-mode'));
  if (window.SlowlySelect?.create) {
    window.SlowlySelect.create('#download-mode');
  } else {
    $('error').textContent = '自訂選單零件未載入，請確認網路連線。';
  }
})();
