import { test, expect } from '@playwright/test';

test.describe('Spider Logo Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should toggle color on click', async ({ page }) => {
    const logo = page.locator('button[aria-label="Logo spider"]').first();
    if (await logo.count() === 0) {
      test.skip();
      return;
    }
    // Initial state: no head-red
    const initialClass = await logo.locator('svg').getAttribute('class');
    expect(initialClass).not.toContain('head-red');

    // Click → red
    await logo.click();
    await page.waitForTimeout(500);
    const newClass = await logo.locator('svg').getAttribute('class');
    expect(newClass).toContain('head-red');

    // Re-click → back to default
    await logo.click();
    await page.waitForTimeout(500);
    const finalClass = await logo.locator('svg').getAttribute('class');
    expect(finalClass).not.toContain('head-red');
  });

  test('should have hover scale effect', async ({ page }) => {
    const logo = page.locator('button[aria-label="Logo spider"]').first();
    if (await logo.count() === 0) {
      test.skip();
      return;
    }
    await expect(logo).toHaveClass(/hover:scale-105/);
  });
});
