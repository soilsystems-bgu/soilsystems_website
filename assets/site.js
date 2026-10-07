// Soil Systems Lab — shared behaviour. No dependencies.
document.documentElement.classList.add('js');

// Mobile menu
document.querySelectorAll('.nav-menu').forEach((btn) => {
  btn.addEventListener('click', () => {
    const nav = btn.closest('.nav');
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

// Gentle fade-in as sections scroll into view
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 })
  : null;
document.querySelectorAll('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

// Header gets a soft shadow once the page scrolls
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Homepage hero: starts as a rounded panel and widens to the full window as the page scrolls.
// The CSS reads --p (0 = landing, 1 = fully expanded).
const hero = document.querySelector('.hero2');
if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let queued = false;
  const update = () => {
    const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.35)));
    hero.style.setProperty('--p', p.toFixed(3));
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
