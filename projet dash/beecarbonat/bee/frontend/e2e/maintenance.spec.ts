import { test, expect } from '@playwright/test';

test.describe('Maintenance Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    await page.goto('/maintenance');
    await page.waitForLoadState('networkidle');
  });

  test('should display maintenance page header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Maintenance/i);
  });

  test('should have status filter buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Toutes")')).toBeVisible();
    await expect(page.locator('button:has-text("En attente")')).toBeVisible();
    await expect(page.locator('button:has-text("En cours")')).toBeVisible();
    await expect(page.locator('button:has-text("Terminé")')).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    await page.click('button:has-text("En attente")');
    await page.waitForTimeout(300);
    const btn = page.locator('button:has-text("En attente")');
    await expect(btn).toHaveClass(/bg-primary-600/);
  });

  test('should update work order status', async ({ page }) => {
    const firstSelect = page.locator('select').first();
    if (await firstSelect.count() === 0) {
      test.skip();
      return;
    }
    await firstSelect.selectOption('COMPLETED');
    await expect(page.locator('text=Statut mis à jour')).toBeVisible({ timeout: 5000 });
  });

  test('should reset to all on Toutes click', async ({ page }) => {
    await page.click('button:has-text("En attente")');
    await page.click('button:has-text("Toutes")');
    const btn = page.locator('button:has-text("Toutes")');
    await expect(btn).toHaveClass(/bg-primary-600/);
  });
});
