/* ================================================
   SOLARPROPHET — main.js

   This file does 3 simple things:
   1. Animates the bars when the card appears
   2. Counts the number up from 0 to 28.4
   3. Fades in the left side text on page load
================================================ */


/* ------------------------------------------------
   THING 1: ANIMATE THE BARS
   
   When the forecast card comes into view,
   the orange bars grow from 0 to their full width
   one after the other.
   
   HOW IT WORKS:
   - We first set all bars to width 0
   - We watch for when the card enters the screen
   - When it does, we set each bar back to its
     original width so it animates outward
------------------------------------------------ */

// Get all the orange bars on the page
const bars = document.querySelectorAll('.bar');

// Save each bar's target width, then set it to 0 to start
bars.forEach(function(bar) {
  // Read the --w value we set in HTML (e.g. "78%")
  bar.dataset.target = bar.style.getPropertyValue('--w');
  // Set it to 0 so bars start invisible
  bar.style.setProperty('--w', '0%');
});

// Watch the card — when it enters the screen, animate the bars
const card = document.querySelector('.card');

// IntersectionObserver watches an element and tells us when it is visible
const barObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {

    // entry.isIntersecting means the card is now on screen
    if (entry.isIntersecting) {

      // Animate each bar one after another (120ms apart)
      bars.forEach(function(bar, index) {
        setTimeout(function() {
          // Set the width back to the target — CSS transition does the animation
          bar.style.setProperty('--w', bar.dataset.target);
        }, 200 + index * 120);
        // 200ms delay before first bar, then 120ms between each
      });

      // Stop watching after the animation runs once
      barObserver.unobserve(card);
    }

  });
}, { threshold: 0.3 }); // trigger when 30% of the card is visible

// Start watching the card
if (card) {
  barObserver.observe(card);
}


/* ------------------------------------------------
   THING 2: COUNT UP THE NUMBER
   
   The "28.4" number counts up from 0
   when the card comes into view.
   
   HOW IT WORKS:
   - We use requestAnimationFrame which runs
     a function many times per second smoothly
   - Each time it runs we calculate how far along
     we are and update the number shown
------------------------------------------------ */

const numberElement = document.querySelector('.output-number');
const targetNumber  = 28.4;   // the final number to count to
const countDuration = 1200;   // how long the count takes in milliseconds

let countStarted = false;     // make sure we only count once

// Watch the card again for the counter
const counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {

    if (entry.isIntersecting && !countStarted) {
      countStarted = true;
      startCounting();
      counterObserver.unobserve(card);
    }

  });
}, { threshold: 0.3 });

if (card) {
  counterObserver.observe(card);
}

// This function does the actual counting
function startCounting() {
  const startTime = performance.now(); // record when counting started

  function countStep(currentTime) {
    // How many milliseconds have passed since we started
    const elapsed = currentTime - startTime;

    // progress goes from 0 (start) to 1 (end)
    const progress = Math.min(elapsed / countDuration, 1);

    // Ease out: starts fast, slows down at the end
    // This makes it feel natural instead of robotic
    const eased = 1 - (1 - progress) * (1 - progress);

    // Calculate the current number and show it with 1 decimal place
    const current = (eased * targetNumber).toFixed(1);
    numberElement.textContent = current;

    // Keep going until we reach the end
    if (progress < 1) {
      requestAnimationFrame(countStep);
    } else {
      // Make sure we end exactly on 28.4
      numberElement.textContent = targetNumber.toFixed(1);
    }
  }

  // Start the animation loop
  requestAnimationFrame(countStep);
}


/* ------------------------------------------------
   THING 3: FADE IN THE LEFT SIDE TEXT
   
   When the page loads, the headline, label,
   description and buttons fade in and slide up
   one after another for a smooth entrance.
   
   HOW IT WORKS:
   - We set each element to invisible (opacity 0)
   - Then we set them back to visible one by one
     with a small delay between each
------------------------------------------------ */

// List of elements to animate in order
const heroElements = [
  document.querySelector('.label'),
  document.querySelector('h1'),
  document.querySelector('.description'),
  document.querySelector('.hero-buttons')
];

// Set each element to invisible and slightly lower position
heroElements.forEach(function(el) {
  if (!el) return; // skip if element not found
  el.style.opacity   = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// After the page loads, reveal each element one by one
window.addEventListener('load', function() {
  heroElements.forEach(function(el, index) {
    if (!el) return;
    setTimeout(function() {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + index * 130);
    // 100ms before first element, then 130ms between each
  });
});
