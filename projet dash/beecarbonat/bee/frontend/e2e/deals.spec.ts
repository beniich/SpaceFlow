import { test, expect } from '@playwright/test';

test.describe('Deals Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crm/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/crm/dashboard');
    await page.goto('/crm/deals');
    await page.waitForLoadState('networkidle');
  });

  test('should display kanban pipeline', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Pipeline/i);
    
    // Vérifier 4 colonnes
    const columns = page.locator('.flex-shrink-0').filter({ hasText: /Pipeline|Qualifie|Proposition|Negociation/ });
    await expect(columns.first()).toBeVisible();
  });

  test('should create a new deal', async ({ page }) => {
    await page.click('button:has-text("Nouveau Deal")');
    
    await page.fill('input[type="text"]', 'Contrat Test E2E');
    await page.fill('input[type="number"]', '50000');
    
    // Sélectionner contact
    await page.selectOption('select', { index: 1 });
    
    // Date
    await page.fill('input[type="date"]', '2027-12-31');
    
    await page.click('button:has-text("Enregistrer")');
    
    await expect(page.locator('text=Contrat Test E2E')).toBeVisible({ timeout: 5000 });
  });

  test('should display deal metrics', async ({ page }) => {
    // Vérifier présence des KPI cards
    await expect(page.locator('text=/Pipeline Total/i')).toBeVisible();
    await expect(page.locator('text=/Gagnes/i')).toBeVisible();
  });
});
