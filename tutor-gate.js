/* Shared client-side passcode gate for private tutor pages.
 *
 * SECURITY NOTE: this is a deterrent, not real protection. The passcode below
 * ships in the page and can be found by anyone who views source. For genuine
 * protection, enforce a password at the host (Netlify/Cloudflare Access, .htpasswd).
 *
 * Shared passcode for all protected tutor pages. Change in ONE place. */
(function () {
  var PASSCODE = 'oxford2026';               // <-- shared passcode; change me
  var STORAGE_KEY = 'ot_tutor_unlocked';     // remembers unlock for the session

  var gate = document.getElementById('gate');
  if (!gate) return;
  var form = document.getElementById('gate-form');
  var input = document.getElementById('gate-input');
  var error = document.getElementById('gate-error');
  var card = gate.querySelector('.gate-card');

  function unlock() {
    gate.setAttribute('hidden', '');
    document.documentElement.classList.remove('gate-locked');
    document.querySelectorAll('[data-protected]').forEach(function (el) {
      el.removeAttribute('hidden');
    });
  }

  // Already unlocked this session?
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') { unlock(); return; }
  } catch (e) {}

  // Lock: hide protected content and show the gate.
  document.documentElement.classList.add('gate-locked');
  gate.removeAttribute('hidden');
  if (input) input.focus();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = (input.value || '').trim().toLowerCase();
    if (val === PASSCODE.toLowerCase()) {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      unlock();
    } else {
      error.textContent = 'That passcode isn’t right. Please try again.';
      card.classList.remove('gate--shake');
      void card.offsetWidth; // reflow to restart animation
      card.classList.add('gate--shake');
      input.select();
    }
  });
})();
