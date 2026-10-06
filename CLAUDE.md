# Soil Systems Lab — Design Rules

## Stack
- Plain multi-page HTML, no framework, no build step
- One shared stylesheet `assets/site.css` and script `assets/site.js`
- Fonts: Geist + Geist Mono from Google Fonts (the only external dependency)
- Images in `images/`, web JPEGs, ≤1400 px (hero ≤2400 px)
- Deployed: Netlify + GitHub

## Look ("D · Field & Specimen")
- Warm light paper ground (`--paper` #f7f5f0), near-black ink, rounded corners (16 px cards, 12 px buttons)
- Colour comes from the lab's micrographs, used as small tags per research theme:
  teal = structure, ochre = carbon, indigo = imaging, olive = land use
- One dark "specimen" band per page at most (the scale strip on the homepage)
- Monospace (Geist Mono) for kickers, captions and scale labels
- Gentle fade-in on scroll only; respects reduced motion

## Don't
- No emoji, no gradient text or loud gradient backgrounds (the hero photo scrim is the exception)
- No animated or collapsing text boxes
- No new frameworks or build steps; edit the HTML directly
- No text below 12 px

## Pages
- index.html — hero, scale strip, themes, latest publications, team
- research.html — research intro, three themes, current projects
- people.html
- publications.html — static list + live additions from ORCID (see below)
- opportunities.html
- contact.html

## Publications
`publications.html` holds the full list by year; each item carries `data-doi`.
On load, `assets/site.js` reads the public ORCID record (0000-0001-9037-3799) and
appends any journal article whose DOI is not on the page, with authors from Crossref
and a "new" badge. Preprint DOIs (SSRN, Research Square, bioRxiv) are skipped.
To make a new paper permanent, copy it into the static list.

## Scale strip (homepage)
Log axis from 100 m (0%) to 1 nm (100%): `left = (2 − log10(metres)) / 11`.
Each bar sets `--l` (start), `--w` (width) and `--c` (colour) inline.
