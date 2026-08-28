# Loving God

Book microsite for *How to Love the Lord Your God* by Greg Wright, live at [lovinggod.uk](https://lovinggod.uk) (Cloudflare Workers, auto-deploys on push to `main`).

## Why this exists

This replaces the previous site at [lovethelord.uk](https://lovethelord.uk) (a Vite/React single-page app on Vercel). That version rendered only the currently-visible chapter into the DOM — the other 17 chapters' content didn't exist on the page until a visitor clicked to them — so search engines only ever saw the title slide, and the fixed-position "Buy"/"Download" buttons overlapped the page navigation on mobile.

This rebuild presents the whole book as one long page: every chapter is real, static HTML from the first load (see `test/page-content.spec.ts`'s regression guard for this), with a contents nav for jumping between chapters. It reuses the same lightweight template/build pipeline as [wrightmaths.uk](https://wrightmaths.uk) rather than a JS framework.

## Quick start

```bash
npm install       # also wires up the pre-commit hook — see below
npm run build     # generate public/*.html from templates/ + src/
npm run serve     # serve public/ locally at http://localhost:4174
npm test          # run the Playwright suite
```

## How the build works

`public/index.html` and `public/404.html` are generated, not hand-written, by [scripts/build.mjs](scripts/build.mjs), from:

1. **[templates/header.html](templates/header.html)**, **[templates/footer.html](templates/footer.html)**, **[templates/page.html](templates/page.html)** — the shared page shell (`<head>`, Book structured data, header/footer) with `{{PLACEHOLDER}}` tokens.
2. **[src/pages/index.html](src/pages/index.html)** — the book content itself: hero, contents nav, and all 17 chapter sections.
3. **[src/pages.config.mjs](src/pages.config.mjs)** — page `<title>`/description and canonical/robots behaviour. `NAV` is currently empty (single-page site) but left in place so `build.mjs` stays identical to WrightMaths' — add entries here if another page (e.g. About the author) gets added later.

`wrangler.json` points Cloudflare at `./public` as the served directory.

## What to edit, and what never to touch

| Want to change... | Edit this | Never edit this |
|---|---|---|
| Book/chapter content | `src/pages/index.html` | `public/index.html` |
| Page title/description | `src/pages.config.mjs` | `public/index.html` |
| Header/footer, structured data | `templates/*.html` | `public/index.html` |
| Styling | `public/css/style.css` (not generated) | — |
| Favicon, the book PDF | `public/img/*`, `public/LovingGod.pdf` (not generated) | — |
| Redirects, robots, sitemap | `public/_headers`, `public/robots.txt`, `public/sitemap.xml` (hand-maintained) | — |

**`public/index.html` and `public/404.html` are build artefacts** — both open with a `DO-NOT-EDIT` banner for this reason. A hand-edit made there is silently overwritten the next time `npm run build` runs, which happens automatically on every commit (see below).

## The pre-commit hook and the build number in the footer

The footer shows a build number (`Build yyyy.mm.dd.NNN`, `NNN` = commits made that day, stored in `build-number.json`), maintained automatically. `npm install` runs the `prepare` script, pointing git at the tracked [.githooks/pre-commit](.githooks/pre-commit) hook, which on every commit: bumps the build number, runs `npm run build`, and stages the result. You never do this by hand — just edit `src/`/`templates/` and commit normally.

## Content notes

- Chapter text, verses, and structure are transcribed from the original `index.jsx` in the `lovethelord` repo — nothing paraphrased or invented.
- Background photos per chapter are still hotlinked from Unsplash (same images as the original site, at lower resolution/quality since they're now all loaded on one page rather than one at a time). Worth revisiting to self-host if that ever becomes a reliability concern.
- The `href="/LovingGod.pdf"` and Amazon buy links (`mybook.to/lovinggod`) are carried over unchanged.

## Tests

Playwright specs cover the footer build-number format, 404 handling, and — the main regression guard for why this rebuild happened — that all 17 chapter headings are actually present in the page source, not just the visible one.

## Deployment

Push to `main` — Cloudflare deploys `public/` automatically.
