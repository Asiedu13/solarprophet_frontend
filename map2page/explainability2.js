/* ================================================
   SOLARPROPHET — explainability2.js
================================================ */

/* Animate feature bars on load */
const bars = document.querySelectorAll('.feature-bar');

bars.forEach(function(bar) {
  bar.dataset.target = bar.style.getPropertyValue('--w');
  bar.style.setProperty('--w', '0%');
});

window.addEventListener('load', function() {
  bars.forEach(function(bar, index) {
    setTimeout(function() {
      bar.style.setProperty('--w', bar.dataset.target);
    }, 200 + index * 150);
  });
});
