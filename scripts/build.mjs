#!/usr/bin/env node
// Assembles public/*.html from templates/ + src/pages/*.html + src/pages.config.mjs.
// Run `npm run build` after editing anything in templates/ or src/, and commit the
// regenerated public/*.html — Cloudflare serves that directory as-is.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { NAV, PAGES } from '../src/pages.config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

const pageTemplate = read('templates/page.html');
const headerTemplate = read('templates/header.html').trimEnd();
const footerTemplate = read('templates/footer.html').trimEnd();

function readBuildNumber() {
  const file = join(root, 'build-number.json');
  if (!existsSync(file)) return '0000.00.00.000';
  const { date, build } = JSON.parse(readFileSync(file, 'utf8'));
  return `${date}.${String(build).padStart(3, '0')}`;
}

function renderNavItems(activeHref) {
  return NAV.map(({ href, label }) => {
    const current = href === activeHref ? ' aria-current="page"' : '';
    return `        <li><a href="${href}"${current}>${label}</a></li>`;
  }).join('\n');
}

const footerNavItems = NAV.map(
  ({ href, label }) => `        <li><a href="${href}">${label}</a></li>`
).join('\n');

const buildNumber = readBuildNumber();

const footer = footerTemplate
  .replace('{{FOOTER_NAV_ITEMS}}', footerNavItems)
  .replace('{{BUILD_NUMBER}}', buildNumber);

for (const page of PAGES) {
  const cta = page.cta ?? { href: 'index.html', text: 'Home' };

  const header = headerTemplate
    .replace('{{NAV_ITEMS}}', renderNavItems(page.active))
    .replace('{{CTA_HREF}}', cta.href)
    .replace('{{CTA_TEXT}}', cta.text);

  const content = read(`src/pages/${page.slug}.html`).trimEnd();

  let extraHead = '';
  if (page.robots) extraHead += `<meta name="robots" content="${page.robots}">\n`;
  if (page.canonical !== false) {
    extraHead += `<link rel="canonical" href="https://lovinggod.uk/${page.slug}.html">\n`;
  }

  const html = pageTemplate
    .replace('{{TITLE}}', page.title)
    .replace('{{DESCRIPTION}}', page.description)
    .replace('{{EXTRA_HEAD}}', extraHead)
    .replace('{{BUILD_NUMBER}}', buildNumber)
    .replace('{{HEADER}}', header)
    .replace('{{CONTENT}}', content)
    .replace('{{FOOTER}}', footer);

  writeFileSync(join(root, 'public', `${page.slug}.html`), html);
  console.log(`built public/${page.slug}.html`);
}
