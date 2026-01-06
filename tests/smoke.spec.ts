import { test, expect } from '@playwright/test';

test.describe('Landing Page Smoke Tests', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('page title is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dojo Genesis/);
  });

  test('chat container mounts', async ({ page }) => {
    await page.goto('/');
    const chatContainer = page.locator('[data-testid="chatkit-demo"]').or(
      page.locator('text=Loading').or(
        page.locator('text=Try Again')
      )
    );
    await expect(chatContainer).toBeVisible({ timeout: 10000 });
  });

  test('hero section displays required copy', async ({ page }) => {
    await page.goto('/');
    const heroText = page.locator('text=/collecting perspectives before solutions/i');
    await expect(heroText).toBeVisible();
  });
});
