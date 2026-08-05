import { test, expect } from '@playwright/test';

test.describe('Billing Flow', () => {
  test('user can view plans and subscribe', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@spaceflow.com');
    await page.fill('input[type="password"]', 'demo123!');
    await page.click('button[type="submit"]');

    // Go to billing
    await page.goto('/billing');
    await expect(page.locator('text=Plan actuel')).toBeVisible();
    await expect(page.locator('text=Free')).toBeVisible();

    // See plans
    await expect(page.locator('text=Starter')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();

    // Toggle yearly
    await page.click('button:has-text("Annuel")');
    await expect(page.locator('text=Starter')).toBeVisible();
  });
});
