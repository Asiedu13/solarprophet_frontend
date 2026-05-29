/* ================================================
   SOLARPROPHET — explainability.js

   This file does 2 things:
   1. Animates the feature contribution bars on load
   2. Handles the Local / Global toggle buttons
================================================ */


/* ------------------------------------------------
   THING 1: ANIMATE THE BARS

   When the page loads the bars grow from 0
   to their full width one after another.
------------------------------------------------ */
const bars = document.querySelectorAll('.feature-bar');

/* Set all bars to 0 width first */
bars.forEach(function(bar) {
  bar.dataset.target = bar.style.getPropertyValue('--w');
  bar.style.setProperty('--w', '0%');
});

/* After page loads reveal each bar with a delay */
window.addEventListener('load', function() {
  bars.forEach(function(bar, index) {
    setTimeout(function() {
      bar.style.setProperty('--w', bar.dataset.target);
    }, 200 + index * 150);
  });
});


/* ------------------------------------------------
   THING 2: LOCAL / GLOBAL TOGGLE

   When you click Local or Global the clicked
   button becomes white (active) and the other
   goes back to normal.
------------------------------------------------ */
function setToggle(clickedTab) {
  document.querySelectorAll('.toggle-tab').forEach(function(tab) {
    tab.classList.remove('active');
  });
  clickedTab.classList.add('active');
}
