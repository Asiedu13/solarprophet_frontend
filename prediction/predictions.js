/* ================================================
   SOLARPROPHET — predictions.js

   This file does 2 things:
   1. Handles the chart tab buttons (24h, 7 days etc)
   2. Animates the stat cards on page load
================================================ */


/* ------------------------------------------------
   THING 1: CHART TAB BUTTONS
   
   When you click 24h / 7 days / 30 days / 1 year,
   the clicked tab becomes white (active) and
   the others go back to normal grey.
------------------------------------------------ */
function setChartTab(clickedTab) {

  /* Remove active from all chart tabs */
  document.querySelectorAll('.chart-tab').forEach(function(tab) {
    tab.classList.remove('active');
  });

  /* Add active to the one that was clicked */
  clickedTab.classList.add('active');
}


/* ------------------------------------------------
   THING 2: ANIMATE STAT CARDS ON LOAD
   
   The four cards at the top fade in and slide up
   one after another when the page loads.
------------------------------------------------ */
const cards = document.querySelectorAll('.stat-card');

/* Start all cards invisible and slightly lower */
cards.forEach(function(card) {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(16px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

/* Reveal each card one by one with a small delay */
window.addEventListener('load', function() {
  cards.forEach(function(card, index) {
    setTimeout(function() {
      card.style.opacity   = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + index * 100);
  });
});
