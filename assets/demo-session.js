'use strict';

(() => {
  const sessionKey = 'nu-demo-signed-in';
  const loginUrl = './Login.html';
  const accountUrl = './My%20account.html';
  const page = document.documentElement.dataset.demoPage;

  function isSignedIn() {
    try {
      return sessionStorage.getItem(sessionKey) === 'true';
    } catch {
      return false;
    }
  }

  function checkSession() {
    const signedIn = isSignedIn();
    if (page === 'account' && !signedIn) {
      document.documentElement.removeAttribute('data-session-ready');
      location.replace(loginUrl);
      return;
    }
    if (page === 'login' && signedIn) {
      location.replace(accountUrl);
      return;
    }
    document.documentElement.setAttribute('data-session-ready', '');
  }

  const form = document.getElementById('demo-login');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Field values are deliberately never read, stored, or sent anywhere.
      form.reset();
      try {
        sessionStorage.setItem(sessionKey, 'true');
        location.replace(accountUrl);
      } catch {
        document.getElementById('login-error').textContent =
          'Allow browser session storage to use this demo.';
      }
    });
  }

  document.querySelectorAll('[data-demo-logout]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      try {
        sessionStorage.removeItem(sessionKey);
      } finally {
        document.documentElement.removeAttribute('data-session-ready');
        location.replace(loginUrl);
      }
    });
  });

  window.addEventListener('pageshow', checkSession);
  checkSession();
})();
