/* ================================================
   SOLARPROPHET — states.js

   Handles three states across every page:
   1. LOADING STATE  — while data is fetching
   2. CURRENT STATE  — when data is ready
   3. ERROR STATE    — when something goes wrong

   Add this to every page:
   <script src="states.js"></script>

   HOW TO USE:
   - AppState.showLoading()   → show loading screen
   - AppState.showReady()     → hide loading screen
   - AppState.showError(msg)  → show error screen
   - AppState.toast(msg)      → show success toast
   - AppState.toastError(msg) → show error toast
================================================ */

const AppState = {

  /* ------------------------------------------------
     LOADING STATE
     
     Creates and shows a full page loading overlay
     with a spinning circle and loading text.
     Call showReady() to remove it.
  ------------------------------------------------ */
  showLoading: function(message) {
    message = message || 'Loading forecast data...';

    /* Remove any existing overlay first */
    this.removeLoading();

    /* Create the overlay element */
    const overlay = document.createElement('div');
    overlay.className = 'page-loading';
    overlay.id = 'pageLoadingOverlay';

    overlay.innerHTML =
      '<div class="loading-spinner"></div>' +
      '<p class="loading-text">' + message + '</p>';

    document.body.appendChild(overlay);
  },

  /* Hide and remove the loading overlay */
  showReady: function() {
    const overlay = document.getElementById('pageLoadingOverlay');
    if (overlay) {
      /* Fade out first then remove */
      overlay.classList.add('hidden');
      setTimeout(function() {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 400);
    }

    /* Update the data status dot to green */
    const dots = document.querySelectorAll('.status-dot');
    dots.forEach(function(dot) {
      dot.classList.remove('status-dot--warning', 'status-dot--offline');
    });
  },

  removeLoading: function() {
    const existing = document.getElementById('pageLoadingOverlay');
    if (existing) existing.parentNode.removeChild(existing);
  },


  /* ------------------------------------------------
     SECTION LOADING
     
     Shows a small spinner inside a specific
     element instead of the full page overlay.
     Useful when only one card is loading.
  ------------------------------------------------ */
  showSectionLoading: function(elementId, message) {
    message = message || 'Loading...';
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML =
      '<div class="section-loading">' +
        '<div class="section-spinner"></div>' +
        '<span>' + message + '</span>' +
      '</div>';
  },


  /* ------------------------------------------------
     ERROR STATE
     
     Shows a full page error screen with a
     message and a retry button.
     The retry button reloads the page.
  ------------------------------------------------ */
  showError: function(message, retryFn) {
    message = message || 'Something went wrong. Please try again.';

    /* Remove loading overlay if showing */
    this.removeLoading();

    /* Create error screen */
    const errorScreen = document.createElement('div');
    errorScreen.className = 'page-error';
    errorScreen.id = 'pageErrorScreen';

    errorScreen.innerHTML =
      '<div class="error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
      '<h2 class="error-title">Something went wrong</h2>' +
      '<p class="error-message">' + message + '</p>' +
      '<button class="error-retry-btn" id="retryBtn">Try again</button>';

    document.body.appendChild(errorScreen);

    /* Retry button reloads the page or calls custom function */
    document.getElementById('retryBtn').addEventListener('click', function() {
      if (retryFn && typeof retryFn === 'function') {
        retryFn();
        const screen = document.getElementById('pageErrorScreen');
        if (screen) screen.parentNode.removeChild(screen);
      } else {
        window.location.reload();
      }
    });
  },

  /* Hide the error screen */
  hideError: function() {
    const screen = document.getElementById('pageErrorScreen');
    if (screen) screen.parentNode.removeChild(screen);
  },

  /* Show error inside a card */
  showCardError: function(elementId, message, retryFn) {
    message = message || 'Failed to load data.';
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML =
      '<div class="card-error">' +
        '<div class="card-error-icon"><i class="fa-solid fa-circle-exclamation"></i></div>' +
        '<p class="card-error-text">' + message + '</p>' +
        '<button class="card-error-retry" onclick="' +
          (retryFn ? retryFn.name + '()' : 'location.reload()') +
        '">Try again</button>' +
      '</div>';
  },


  /* ------------------------------------------------
     TOAST NOTIFICATIONS
     
     Small pop-up messages at the bottom right
     of the screen that disappear after 3 seconds.
     
     Green toast — success
     Orange toast — warning
     Red toast    — error
  ------------------------------------------------ */
  showToast: function(message, type, duration) {
    type     = type     || 'success';
    duration = duration || 3000;

    /* Remove any existing toast */
    const existing = document.getElementById('appToast');
    if (existing) existing.parentNode.removeChild(existing);

    /* Pick icon based on type */
    const icons = {
      success: '<i class="fa-solid fa-circle-check toast-icon"></i>',
      warning: '<i class="fa-solid fa-triangle-exclamation toast-icon toast-icon--warning"></i>',
      error:   '<i class="fa-solid fa-circle-xmark toast-icon toast-icon--error"></i>'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'appToast';
    toast.innerHTML = (icons[type] || icons.success) + message;

    document.body.appendChild(toast);

    /* Show after a tiny delay so CSS transition works */
    setTimeout(function() { toast.classList.add('show'); }, 10);

    /* Hide and remove after duration */
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  },

  /* Shortcut functions for each toast type */
  toast: function(message) {
    this.showToast(message, 'success');
  },

  toastWarning: function(message) {
    this.showToast(message, 'warning');
  },

  toastError: function(message) {
    this.showToast(message, 'error', 4000);
  },


  /* ------------------------------------------------
     OFFLINE DETECTION
     
     Watches for internet connection changes.
     Shows a banner at the top when offline.
     Hides it when connection is restored.
  ------------------------------------------------ */
  watchConnection: function() {
    const self = this;

    /* Create the offline banner */
    const banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.id = 'offlineBanner';
    banner.innerHTML =
      '<i class="fa-solid fa-wifi"></i>' +
      'You are offline. Some features may not work. ' +
      'Map tiles and search require internet.';

    document.body.appendChild(banner);

    /* Show banner when offline */
    window.addEventListener('offline', function() {
      banner.classList.add('show');
      self.toastError('No internet connection.');
    });

    /* Hide banner when back online */
    window.addEventListener('online', function() {
      banner.classList.remove('show');
      self.toast('Back online!');
    });

    /* Check current state on load */
    if (!navigator.onLine) {
      banner.classList.add('show');
    }
  },


  /* ------------------------------------------------
     DATA STATUS INDICATOR
     
     Creates a small status row above a card
     showing whether data is live, old or offline.
     
     Usage:
     AppState.setStatus('forecast-card', 'live', 'Updated just now')
     AppState.setStatus('forecast-card', 'warning', 'Updated 1 hour ago')
     AppState.setStatus('forecast-card', 'offline', 'Using cached data')
  ------------------------------------------------ */
  setStatus: function(elementId, type, text) {
    const el = document.getElementById(elementId);
    if (!el) return;

    /* Remove existing status if any */
    const existing = el.querySelector('.data-status');
    if (existing) existing.parentNode.removeChild(existing);

    const dotClass = {
      live:    'status-dot',
      warning: 'status-dot status-dot--warning',
      offline: 'status-dot status-dot--offline'
    };

    const statusEl = document.createElement('div');
    statusEl.className = 'data-status';
    statusEl.innerHTML =
      '<span class="' + (dotClass[type] || dotClass.live) + '"></span>' +
      text;

    /* Insert at the top of the element */
    el.insertBefore(statusEl, el.firstChild);
  },


  /* ------------------------------------------------
     FORM VALIDATION HELPERS
     
     Shows and hides error messages below inputs.
  ------------------------------------------------ */
  showFieldError: function(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;

    /* Add red border to input */
    input.classList.add('input-error');

    /* Remove existing error message */
    const existing = document.getElementById(inputId + '-error');
    if (existing) existing.parentNode.removeChild(existing);

    /* Create error message */
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.id = inputId + '-error';
    errorEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>' + message;

    input.parentNode.insertBefore(errorEl, input.nextSibling);
  },

  clearFieldError: function(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.classList.remove('input-error');

    const error = document.getElementById(inputId + '-error');
    if (error) error.parentNode.removeChild(error);
  }

};


/* ------------------------------------------------
   AUTO INIT
   
   These run automatically on every page
   that includes this script.
------------------------------------------------ */

/* Watch for offline/online changes on every page */
document.addEventListener('DOMContentLoaded', function() {
  AppState.watchConnection();
});


/* ------------------------------------------------
   PAGE LOAD SEQUENCE
   
   Shows loading on page start then hides it
   when the page is fully loaded.
   This gives every page a smooth entrance.
------------------------------------------------ */
AppState.showLoading('Loading SolarProphet...');

window.addEventListener('load', function() {
  /* Small delay so the transition looks intentional */
  setTimeout(function() {
    AppState.showReady();
  }, 600);
});
