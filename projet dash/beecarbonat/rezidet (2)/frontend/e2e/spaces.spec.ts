import { test, expect } from '@playwright/test';

test.describe('Spaces Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    await page.goto('/spaces');
    await page.waitForLoadState('networkidle');
  });

  test('should display spaces page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/espaces/i);
  });

  test('should have building selector', async ({ page }) => {
    const select = page.locator('select').first();
    await expect(select).toBeVisible();
  });

  test('should display floor navigation buttons', async ({ page }) => {
    const floorButtons = page.locator('button').filter({ hasText: /^\d+$/ });
    await expect(floorButtons.first()).toBeVisible();
  });

  test('should change floor on click', async ({ page }) => {
    const floorButtons = page.locator('button').filter({ hasText: /^\d+$/ });
    if (await floorButtons.count() < 2) {
      test.skip();
      return;
    }
    await floorButtons.nth(1).click();
    await page.waitForTimeout(300);
    await expect(floorButtons.nth(1)).toHaveClass(/bg-primary-600/);
  });

  test('should display space cards or empty state', async ({ page }) => {
    await page.waitForTimeout(500);
    const hasCards = await page.locator('[class*="rounded-xl"]').count();
    expect(hasCards).toBeGreaterThan(0);
  });
});
