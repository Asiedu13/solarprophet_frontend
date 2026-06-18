/* ================================================
   SOLARPROPHET — shared.js
   
   Handles across every page:
   1. Dark mode toggle
   2. Loading state
   3. Error state
   4. Toast notifications
   5. Offline detection
================================================ */

const SP = {

  /* ── DARK MODE ──────────────────────────────── */
  initTheme: function() {
    /* Read saved theme from localStorage */
    const saved = localStorage.getItem('sp-theme') || 'light';
    this.setTheme(saved);

    /* Update toggle buttons */
    document.querySelectorAll('[data-theme-btn]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.themeBtn === saved);
    });
  },

  setTheme: function(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sp-theme', theme);

    /* Update all toggle buttons on page */
    document.querySelectorAll('[data-theme-btn]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.themeBtn === theme);
    });
  },

  toggleTheme: function() {
    const current = localStorage.getItem('sp-theme') || 'light';
    this.setTheme(current === 'light' ? 'dark' : 'light');
  },


  /* ── LOADING STATE ──────────────────────────── */
  showLoading: function(msg) {
    msg = msg || 'Loading forecast data...';
    this._removeEl('sp-loading');

    const el = document.createElement('div');
    el.className = 'sp-loading-overlay';
    el.id = 'sp-loading';
    el.innerHTML =
      '<div class="sp-spinner"></div>' +
      '<p class="sp-loading-text">' + msg + '</p>';

    document.body.appendChild(el);
  },

  hideLoading: function() {
    const el = document.getElementById('sp-loading');
    if (!el) return;
    el.classList.add('hidden');
    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  },


  /* ── ERROR STATE ────────────────────────────── */
  showError: function(msg, retryFn) {
    msg = msg || 'Something went wrong. Please try again.';
    this.hideLoading();
    this._removeEl('sp-error');

    const el = document.createElement('div');
    el.className = 'sp-error-screen';
    el.id = 'sp-error';
    el.innerHTML =
      '<div class="sp-error-icon">☀</div>' +
      '<h2 class="sp-error-title">Something went wrong</h2>' +
      '<p class="sp-error-msg">' + msg + '</p>' +
      '<button class="sp-btn sp-btn--accent" id="sp-retry">Try again</button>';

    document.body.appendChild(el);

    document.getElementById('sp-retry').addEventListener('click', function() {
      if (retryFn) { retryFn(); }
      else { window.location.reload(); }
      el.parentNode.removeChild(el);
    });
  },

  hideError: function() {
    this._removeEl('sp-error');
  },


  /* ── TOAST ──────────────────────────────────── */
  toast: function(msg, type, duration) {
    type     = type     || 'success';
    duration = duration || 3000;

    this._removeEl('sp-toast');

    const icons = {
      success: '✓',
      warning: '⚠',
      error:   '✕'
    };

    const colors = {
      success: 'var(--sp-success)',
      warning: 'var(--sp-warning)',
      error:   'var(--sp-error)'
    };

    const el = document.createElement('div');
    el.className = 'sp-toast';
    el.id = 'sp-toast';
    el.innerHTML =
      '<span style="color:' + (colors[type] || colors.success) + '; font-size:16px;">' +
        (icons[type] || icons.success) +
      '</span>' + msg;

    document.body.appendChild(el);

    /* Show */
    setTimeout(function() { el.classList.add('show'); }, 10);

    /* Hide after duration */
    setTimeout(function() {
      el.classList.remove('show');
      setTimeout(function() {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, duration);
  },

  toastSuccess: function(msg) { this.toast(msg, 'success'); },
  toastWarning: function(msg) { this.toast(msg, 'warning', 4000); },
  toastError:   function(msg) { this.toast(msg, 'error', 4000); },


  /* ── OFFLINE DETECTION ──────────────────────── */
  watchConnection: function() {
    const self = this;

    /* Create the offline banner */
    const banner = document.createElement('div');
    banner.className = 'sp-offline-banner';
    banner.id = 'sp-offline';
    banner.innerHTML = '⚡ You are offline. Search and live data require internet.';
    document.body.appendChild(banner);

    window.addEventListener('offline', function() {
      banner.classList.add('show');
      self.toastWarning('No internet connection.');
    });

    window.addEventListener('online', function() {
      banner.classList.remove('show');
      self.toastSuccess('Back online!');
    });

    /* Check on load */
    if (!navigator.onLine) { banner.classList.add('show'); }
  },


  /* ── HELPER ─────────────────────────────────── */
  _removeEl: function(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
};


/* ── AUTO INIT ──────────────────────────────────
   Runs on every page that includes this script
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  /* 1. Apply saved theme */
  SP.initTheme();

  /* 2. Wire up theme toggle buttons */
  document.querySelectorAll('[data-theme-btn]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      SP.setTheme(btn.dataset.themeBtn);
    });
  });

  /* 3. Watch for offline/online changes */
  SP.watchConnection();

  /* 4. Show page loading then hide when ready */
  SP.showLoading('Loading SolarProphet...');
  window.addEventListener('load', function() {
    setTimeout(function() { SP.hideLoading(); }, 500);
  });
});
