/* ================================================
   SOLARPROPHET — predictions.js
================================================ */


/* ── CHART SEGMENT TABS ──────────────────────── */
function setSegment(clicked) {
  const parent = clicked.closest('.sp-segment');
  parent.querySelectorAll('button').forEach(function(btn) {
    btn.classList.remove('active');
  });
  clicked.classList.add('active');

  /* Show what changed */
  SP.toast('Showing ' + clicked.textContent + ' forecast');
}


/* ── STAT CARD ANIMATION ─────────────────────── */
window.addEventListener('load', function() {
  const cards = document.querySelectorAll('.stat-grid .sp-card');
  cards.forEach(function(card, i) {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    setTimeout(function() {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
});


/* ── SMS OPT-IN FORM ─────────────────────────── */
function submitSMS(event) {
  event.preventDefault();

  const phone    = document.getElementById('phoneInput').value.trim();
  const location = document.getElementById('smsLocation').value;
  const freq     = document.querySelector('input[name="freq"]:checked').value;

  /* Validate phone */
  if (phone.length < 9) {
    SP.toastError('Please enter a valid Ghana phone number.');
    document.getElementById('phoneInput').style.borderColor = 'var(--sp-error)';
    return;
  }

  /* Reset border */
  document.getElementById('phoneInput').style.borderColor = '';

  /* Show success */
  document.getElementById('smsSuccess').classList.add('show');

  /* Show toast */
  SP.toast('Subscribed! First forecast arrives tomorrow at 6am.');

  /* Save to localStorage */
  const subs = JSON.parse(localStorage.getItem('sp-sms-subs') || '[]');
  subs.push({
    phone:    '+233' + phone,
    location: location,
    freq:     freq,
    date:     new Date().toLocaleDateString()
  });
  localStorage.setItem('sp-sms-subs', JSON.stringify(subs));
}


/* ── SHARE VIA SMS ───────────────────────────── */
function shareSMS() {
  const message =
    'SolarProphet forecast for Ejisu, Ashanti:\n' +
    'Tomorrow: 28.4 kWh\n' +
    'Peak: 12:30pm · Clear skies\n' +
    'Confidence: High\n' +
    'View full forecast: solarprophet.app';

  /* Opens phone SMS app with message pre-filled */
  window.location.href = 'sms:?body=' + encodeURIComponent(message);
}


/* ── DATA STATUS INDICATOR ───────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Show live data status on the chart card */
  const chartCard = document.querySelector('.chart-card');
  if (chartCard && !chartCard.id) chartCard.id = 'chart-card';

  setTimeout(function() {
    SP.setStatus('chart-card', 'live', 'Updated just now · Day-ahead · Ejisu');
  }, 700);
});
