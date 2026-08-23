import { test, expect } from '@playwright/test';

test.describe('Leases Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    await page.goto('/leases');
    await page.waitForLoadState('networkidle');
  });

  test('should display leases page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Baux/i);
    await expect(page.locator('button:has-text("Nouveau bail")')).toBeVisible();
  });

  test('should open creation modal', async ({ page }) => {
    await page.click('button:has-text("Nouveau bail")');
    await expect(page.locator('h2:has-text("Nouveau bail")')).toBeVisible();
    await expect(page.locator('input[placeholder*="Locataire"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button:has-text("Nouveau bail")');
    await page.click('button[type="submit"]');
    const input = page.locator('input[placeholder*="Locataire"]');
    await expect(input).toHaveAttribute('required');
  });

  test('should create lease successfully', async ({ page }) => {
    await page.click('button:has-text("Nouveau bail")');
    const tenantName = `Test Tenant ${Date.now()}`;
    await page.fill('input[placeholder*="Locataire"]', tenantName);
    await page.fill('input[type="date"] >> nth=0', '2025-01-01');
    await page.fill('input[type="date"] >> nth=1', '2026-12-31');
    await page.fill('input[placeholder*="Loyer"]', '5000');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Bail créé')).toBeVisible({ timeout: 5000 });
    await expect(page.locator(`text=${tenantName}`)).toBeVisible();
  });

  test('should close modal on cancel', async ({ page }) => {
    await page.click('button:has-text("Nouveau bail")');
    await expect(page.locator('h2:has-text("Nouveau bail")')).toBeVisible();
    await page.click('button:has-text("Annuler")');
    await expect(page.locator('h2:has-text("Nouveau bail")')).not.toBeVisible();
  });
});
