/**
 * SANHA SELASAK PORTFOLIO — SCROLL REVEAL ENGINE (animations.js)
 * High-performance IntersectionObserver scroll-in animations.
 */

// Runs as soon as this module executes (deferred, after the DOM is parsed,
// same timing theme.js relies on) rather than waiting for DOMContentLoaded —
// that keeps the "hidden, about-to-animate" state from flashing visible
// first. Elements are visible by default in CSS (see animations.css) so
// content never depends on JS at all to appear; this only opts elements
// into the hidden->reveal transition once we've confirmed we can observe them.
(function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!('IntersectionObserver' in window) || revealElements.length === 0) return;

  document.documentElement.classList.add('js-reveal-ready');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  // Safety net: if an element somehow never intersects (edge cases with
  // hidden ancestors, layout shifts, etc.), reveal everything anyway so
  // nothing stays permanently invisible.
  setTimeout(() => {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }, 2500);
})();
