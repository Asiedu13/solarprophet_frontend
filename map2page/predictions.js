/* ================================================
   SOLARPROPHET — predictions.js
================================================ */

/* Chart tab buttons */
function setChartTab(clickedTab) {
  document.querySelectorAll('.chart-tab').forEach(function(tab) {
    tab.classList.remove('active');
  });
  clickedTab.classList.add('active');
}

/* Animate stat cards on load */
const cards = document.querySelectorAll('.stat-card');

cards.forEach(function(card) {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(16px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

window.addEventListener('load', function() {
  cards.forEach(function(card, index) {
    setTimeout(function() {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + index * 100);
  });
});
