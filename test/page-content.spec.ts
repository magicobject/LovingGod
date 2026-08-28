import { test, expect } from '@playwright/test';
import { PAGES } from './support/pages';

for (const page of PAGES) {
  test(`${page.path} shows its own title and heading`, async ({ page: browserPage }) => {
    await browserPage.goto(page.path);

    await expect(browserPage).toHaveTitle(new RegExp(page.titleContains));
    await expect(browserPage.locator('h1')).toHaveText(page.heading);
  });
}

test('every chapter section is present in the static HTML (not just the visible one)', async ({ page }) => {
  await page.goto('/index.html');

  // Regression guard for the whole point of this rebuild: every chapter's
  // content must exist in the page source, not be mounted only on demand by
  // client-side JS — otherwise search engines only ever see the first slide.
  const chapterHeadings = await page.locator('.chapter h2').allTextContents();
  expect(chapterHeadings).toHaveLength(17);
  expect(chapterHeadings).toContain('Introduction');
  expect(chapterHeadings).toContain('Conclusion');
  expect(chapterHeadings).toContain('True Repentance');
});

test('the canonical URL matches the page', async ({ page }) => {
  await page.goto('/index.html');
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute('href', 'https://lovinggod.uk/index.html');
});
