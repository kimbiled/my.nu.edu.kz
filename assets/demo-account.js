'use strict';

(() => {
  const status = document.getElementById('demo-status');
  let statusTimer;
  function showMessage(message) {
    status.textContent = message;
    status.hidden = false;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { status.hidden = true; }, 4500);
  }

  const name = document.getElementById('name-dropdown');
  const dropdown = document.getElementById('show-dropdown');
  name.querySelector('a').setAttribute('aria-expanded', 'false');
  name.addEventListener('click', (event) => {
    event.preventDefault();
    const open = !name.classList.contains('is-active');
    name.classList.toggle('is-active', open);
    name.querySelector('a').setAttribute('aria-expanded', String(open));
    dropdown.style.display = open ? 'block' : 'none';
  });

  document.addEventListener('click', (event) => {
    if (!name.contains(event.target) && !dropdown.contains(event.target)) {
      name.classList.remove('is-active');
      name.querySelector('a').setAttribute('aria-expanded', 'false');
      dropdown.style.display = 'none';
    }

    const trigger = event.target.closest('[data-toggle="collapse-headermenu"], [data-toggle="collapse-footermenu"]');
    if (trigger) {
      const button = trigger.closest('button');
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      document.querySelectorAll(button.getAttribute('data-target')).forEach((panel) => {
        panel.classList.toggle('show', expanded);
      });
    }

    const tab = event.target.closest('#mytab1, #mytab2');
    if (tab) {
      event.preventDefault();
      const payments = tab.id === 'mytab2';
      document.getElementById('mytab1').classList.toggle('active', !payments);
      document.getElementById('mytab2').classList.toggle('active', payments);
      document.getElementById('mymainbody').hidden = payments;
      document.getElementById('demo-payments').hidden = !payments;
      return;
    }

    const placeholder = event.target.closest('[data-demo-placeholder], .linkP, #mymainbody a');
    if (placeholder && !name.contains(placeholder)) {
      event.preventDefault();
      showMessage('Demo preview. This action is not connected to a server.');
    }
  });

  document.addEventListener('submit', (event) => { event.preventDefault(); });
})();
