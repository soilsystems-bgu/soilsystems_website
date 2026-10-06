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
