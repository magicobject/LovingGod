// Single source of truth for the main nav and per-page <head> metadata.
// Edit this file (and src/pages/*.html for content) — public/*.html is generated
// by scripts/build.mjs and should not be hand-edited.

// No multi-page nav yet — this is a single book microsite. The array is kept
// (rather than removed) so build.mjs stays identical to the WrightMaths build
// script; add entries here if/when more pages are added (e.g. About the author).
export const NAV = [];

export const PAGES = [
  {
    slug: 'index',
    title: 'How to Love the Lord Your God | Loving God, by Greg Wright',
    description: "A free book on loving God with all your heart, soul, mind and strength — read every chapter online, download the free PDF, or buy on Amazon.",
    active: 'index.html',
    cta: { href: 'https://mybook.to/lovinggod', text: 'Buy on Amazon' },
  },
  {
    slug: '404',
    title: 'Page Not Found | Loving God',
    description: "This page couldn't be found. Find your way back to the Loving God book.",
    active: null,
    canonical: false,
    robots: 'noindex',
  },
];
