import { test, expect } from '@playwright/test';

test('an unknown URL serves the branded 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist.html');

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page Not Found/);
  await expect(page.locator('h1')).toHaveText(/can.t be found/i);
});

test('the 404 page leads back into the book', async ({ page }) => {
  await page.goto('/this-page-does-not-exist.html');

  await page.getByRole('link', { name: 'Back to the book' }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page).toHaveTitle(/How to Love the Lord Your God/);
});

test('the 404 page is not indexed by search engines', async ({ page }) => {
  await page.goto('/this-page-does-not-exist.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
