# Soil Systems Lab — Design Rules

## Stack
- Plain multi-page HTML, no framework, no build step
- One shared stylesheet `assets/site.css` and script `assets/site.js` (mobile menu + fade-in only)
- Fonts: Geist + Geist Mono, self-hosted in `assets/fonts/` (variable woff2, SIL OFL licence); no Google Fonts
- `_headers`: Netlify security headers incl. a Content-Security-Policy (own files + ORCID/Crossref).
  The inline `<script>` that adds the `js` class is allowed by its sha256 hash: change that script and the hash must change.
- Deploy: copy *.html, _headers, assets/, images/ into a clean folder and run
  `npx netlify-cli deploy --prod --dir <folder> --site b69253c3-88e0-4421-9ff0-3f59ad597543` (CLAUDE.md is never deployed)
- Images in `images/`, web JPEGs, ≤1400 px (hero ≤2400 px)
- Profile logos in `assets/icons/` are from Simple Icons (CC0)
- Deployed: Netlify + GitHub

The nav and footer are repeated in every page. When changing them, change all pages
(index, research, people, publications, opportunities, contact, 404).

## Look ("D · Field & Specimen")
- Warm light paper ground (`--paper` #f7f5f0), near-black ink, rounded corners (16 px cards, 12 px buttons)
- Colour comes from the lab's own images, not from decoration
- Gentle fade-in on scroll only; respects reduced motion

## Don't
- No keyword tags or pills (Structure, Carbon, …): they read as generic and narrow the lab's scope
- No emoji, no gradient text or loud gradient backgrounds (the hero photo scrim is the exception)
- No animated or collapsing text boxes
- No new frameworks or build steps; edit the HTML directly
- No text below 12 px

## Pages and flow
- index.html — five-panel image strip (field → mineral surfaces) with a one-line title strip,
  first three current projects, contact band. The overview paragraph lives on research.html only.
  No publications or people on the homepage (they go stale there).
- Footer = lab name + site navigation only (no address, email or profile links).
- Project order (home + research): plant–soil–microbiome, plant P uptake (BARD), soil-on-a-chip, microplastics, then student projects.
- research.html — overview, then one block per project (`id` = project slug, linked from home and opportunities)
- people.html
- publications.html — list by year (each item has `data-doi`), plus automatic additions from ORCID:
  `assets/site.js` reads the public ORCID record (0000-0001-9037-3799) and adds any journal article whose
  DOI is not on the page (authors from Crossref, preprints skipped). The list on the page stays the baseline.
  To go back to a purely manual list, delete the `data-orcid` attribute in publications.html; nothing else changes.
  New papers flow in automatically only if ORCID is kept up to date (ORCID's Crossref auto-update does this).
- opportunities.html — "Join us" (menu label): one lead sentence, then three cards: who we look for,
  how to apply (teal, email button), postdoctoral fellowships. No project list (it would go stale).
- contact.html — email, address, Google Maps link, and an impressionist painting of the Zin valley
  (`images/zin-valley-painting.jpg`, the PI's own `sdebo_impressionist.jpg`). Alternative tried: public-domain
  photo File:Midreshet_Ben-Gurion1.JPG (Wikimedia Commons, Yoavd, no credit required), in commit 15e7aab.
  BGU logo `assets/logos/bgu.svg`: Wikimedia Commons File:Ben-Gurion_University_of_the_Negev_logo.svg
  (public domain, trademarked), linked to bgu.ac.il.
- 404.html — Netlify serves it for missing pages

Links into the middle of a page always use an anchor (`opportunities.html#positions`) so visitors land on what they clicked for.

## Hero drift animation
Slow and subtle: 26 s cycle, scale 1.03 → 1.14, translate(-2%, -1.5%), delays -6/-12/-18/-24 s.
The mesocosm cube panel uses `drift-soft` (zoom 1 → 1.05, no pan) so the large cube is never clipped.
A stronger version (18 s, scale to 1.22) was tried and rejected as too much.

## Parked ideas
- Scale strip ("Soil is different at every scale"): removed for now; the first version is in git history (commit f26563d) if revisited.
- Hero video: a muted ~10 s loop (1–2 MB, with a poster image) would fit the hero.
