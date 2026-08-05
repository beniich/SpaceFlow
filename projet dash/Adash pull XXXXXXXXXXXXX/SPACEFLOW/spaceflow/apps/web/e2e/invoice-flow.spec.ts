import { test, expect } from '@playwright/test';

test.describe('Invoice Flow', () => {
  test('user can create and view invoice', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@spaceflow.com');
    await page.fill('input[type="password"]', 'demo123!');
    await page.click('button[type="submit"]');

    // Go to invoices
    await page.goto('/invoices');
    
    // Create
    await page.click('button:has-text("Nouvelle facture")');
    // Select first member in the dropdown
    await page.locator('select').first().selectOption({ index: 1 });
    await page.click('button[type="submit"]:has-text("Créer la facture")');

    // Should appear in list
    await expect(page.locator('text=/INV-/')).toBeVisible();

    // Click to open detail
    await page.locator('text=/INV-/').first().click();
    await expect(page.locator('text=Télécharger PDF')).toBeVisible();
  });
});
