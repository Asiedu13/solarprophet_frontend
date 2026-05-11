/* ============================================================
   SOLARPROPHET — main.js

   This file handles:
   1. Animating the contributing-factor bars on scroll/load
   2. Animating the big kWh counter from 0 → 28.4
   3. Smooth hover micro-interactions on the nav links
   
   No libraries needed — pure vanilla JS.
   ============================================================ */

/* ── 1. Animate factor bars on entry ─────────────────────────
   The bars start at width 0 and expand to their --bar-w value.
   We use an IntersectionObserver so the animation only fires
   when the card enters the viewport (relevant if the page is 
   taller than the viewport later).
   ─────────────────────────────────────────────────────────── */
(function animateBars() {
  const bars = document.querySelectorAll('.factor__bar');

  // Store the target widths, then reset to 0 for the animation start
  bars.forEach(bar => {
    // Read the inline CSS variable value (e.g. "78%")
    const targetWidth = bar.style.getPropertyValue('--bar-w').trim();
    bar.dataset.targetWidth = targetWidth;
    // Start collapsed
    bar.style.setProperty('--bar-w', '0%');
    // Smooth transition for the fill animation
    bar.style.transition = 'width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  // We watch the card element; once it's in view, trigger the bars
  const card = document.querySelector('.forecast-card');
  if (!card) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger each bar by 120ms
          bars.forEach((bar, i) => {
            setTimeout(() => {
              bar.style.setProperty('--bar-w', bar.dataset.targetWidth);
            }, 200 + i * 120);
          });
          observer.unobserve(card);  // only run once
        }
      });
    },
    { threshold: 0.3 }  // trigger when 30% of the card is visible
  );

  observer.observe(card);
})();


/* ── 2. Animated number counter for the kWh value ────────────
   Counts from 0.0 → 28.4 over ~1.2 seconds using requestAnimationFrame.
   This adds a satisfying "loading" feel that reinforces the 
   "AI forecast" concept.
   ─────────────────────────────────────────────────────────── */
(function animateCounter() {
  const target    = 28.4;
  const duration  = 1200;   // ms
  const numEl     = document.querySelector('.output__number');
  if (!numEl) return;

  // Don't start until the card is visible
  const card = document.querySelector('.forecast-card');
  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          runCounter();
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (card) observer.observe(card);

  function runCounter() {
    const start = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased    = 1 - (1 - progress) * (1 - progress);
      const value    = (eased * target).toFixed(1);
      numEl.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        numEl.textContent = target.toFixed(1);
      }
    }

    requestAnimationFrame(step);
  }
})();


/* ── 3. Nav: highlight active link on hover with a subtle
         underline slide-in effect (pure CSS handles the visual,
         JS just adds/removes a class for scoping) ────────────  
   Not strictly necessary since CSS :hover handles this, but 
   this is a hook for future active-route highlighting if you
   add a router.
   ─────────────────────────────────────────────────────────── */
(function navHighlight() {
  const links = document.querySelectorAll('.nav__links a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      links.forEach(l => l !== link && l.classList.add('nav__link--dimmed'));
    });
    link.addEventListener('mouseleave', () => {
      links.forEach(l => l.classList.remove('nav__link--dimmed'));
    });
  });
})();


/* ── 4. Hero entrance animation stagger ──────────────────────
   Staggers the hero left-column elements (eyebrow → headline → 
   body → CTAs) for a polished page-load feel.
   Elements start invisible and slide up via a CSS class we add.
   ─────────────────────────────────────────────────────────── */
(function heroEntrance() {
  // Add base "hidden" state via JS so it's only applied when
  // JS is running (progressive enhancement — no JS = normal render).
  const elements = [
    document.querySelector('.hero__eyebrow'),
    document.querySelector('.hero__headline'),
    document.querySelector('.hero__body'),
    document.querySelector('.hero__ctas'),
  ].filter(Boolean);

  elements.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(18px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Stagger the reveal on DOMContentLoaded
  window.addEventListener('DOMContentLoaded', () => {
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, 100 + i * 130);
    });
  });
})();

const ctx = document.getElementById('solarChart').getContext('2d');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
    datasets: [{
      data: [0, 1, 3, 8, 15, 22, 28.4, 24, 18, 10, 4, 1, 0],
      fill: true,
      borderColor: '#C45E20',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      backgroundColor: function(context) {
        const chart = context.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'transparent';
        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(217,107,42,0.3)');
        gradient.addColorStop(1, 'rgba(245,233,216,0.0)');
        return gradient;
      }
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        },
        border: {
          display: false
        }
      }
    }
  }
});
