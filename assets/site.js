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
    }, { threshold: 0 })
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

// Publications: add works from ORCID that are not yet on the page.
// The list written in publications.html is the baseline; this only adds newer items,
// so the page still works fully if ORCID is unreachable.
// To switch this off (manual list only), remove the data-orcid attribute in publications.html.
const pubRoot = document.querySelector('[data-orcid]');
if (pubRoot) addOrcidWorks(pubRoot).catch(() => {});

async function addOrcidWorks(root) {
  const orcid = root.dataset.orcid;
  const res = await fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, { headers: { Accept: 'application/json' } });
  if (!res.ok) return;
  const data = await res.json();

  const known = new Set([...root.querySelectorAll('[data-doi]')].map((el) => el.dataset.doi.toLowerCase()));
  // Preprint servers (SSRN, Research Square, bioRxiv, EarthArXiv) are skipped.
  const preprint = /^10\.(2139|21203|1101|31223)\//;

  for (const group of data.group || []) {
    const s = group['work-summary'][0];
    if (s.type && s.type !== 'journal-article') continue;
    const ids = group['external-ids']?.['external-id'] || [];
    const doi = ids.find((i) => i['external-id-type'] === 'doi')?.['external-id-value']?.toLowerCase();
    if (!doi || known.has(doi) || preprint.test(doi)) continue;
    known.add(doi);

    const year = s['publication-date']?.year?.value || '';
    const title = s.title?.title?.value || '';
    const journal = s['journal-title']?.value || '';
    const authors = await crossrefAuthors(doi);
    insertWork(root, { year, title, journal, doi, authors });
  }
}

async function crossrefAuthors(doi) {
  try {
    const r = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if (!r.ok) return [];
    const a = (await r.json()).message.author || [];
    return a.map((p) => `${p.family}, ${(p.given || '').split(/[\s-]+/).filter(Boolean).map((g) => g[0] + '.').join('')}`);
  } catch { return []; }
}

function insertWork(root, w) {
  let list = root.querySelector(`[data-year="${w.year}"] .pub-list`);
  if (!list) {
    const block = document.createElement('section');
    block.className = 'pub-year';
    block.dataset.year = w.year;
    block.innerHTML = '<h2></h2><ol class="pub-list"></ol>';
    block.querySelector('h2').textContent = w.year;
    const later = [...root.querySelectorAll('[data-year]')].find((b) => Number(b.dataset.year) < Number(w.year));
    root.insertBefore(block, later || null);
    list = block.querySelector('.pub-list');
  }
  const li = document.createElement('li');
  li.dataset.doi = w.doi;
  const t = document.createElement('span');
  t.className = 'pub-title';
  t.textContent = w.title;
  li.append(t);
  if (w.authors.length) {
    const a = document.createElement('span');
    a.className = 'pub-authors';
    w.authors.forEach((name, i) => {
      if (i) a.append(', ');
      if (/^Dor, M/.test(name)) {
        const b = document.createElement('strong');
        b.textContent = name;
        a.append(b);
      } else {
        a.append(name);
      }
    });
    li.append(a);
  }
  const m = document.createElement('span');
  m.className = 'pub-meta';
  m.append(w.journal ? `${w.journal} · ` : '');
  const link = document.createElement('a');
  link.href = `https://doi.org/${w.doi}`;
  link.textContent = `doi:${w.doi}`;
  m.append(link);
  li.append(m);
  list.prepend(li);
}
