import { test, expect } from '@playwright/test';

test.describe('Contacts CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/crm/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/crm/dashboard');
    
    // Aller sur contacts
    await page.goto('/crm/contacts');
    await page.waitForLoadState('networkidle');
  });

  test('should display contacts list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contacts');
    await expect(page.locator('table, [role="table"]')).toBeVisible();
  });

  test('should create a new contact', async ({ page }) => {
    await page.click('button:has-text("Nouveau contact")');
    
    await page.fill('input[placeholder*="Prenom"]', 'Jean');
    await page.fill('input[placeholder*="Nom"]', 'Dupont');
    await page.fill('input[type="email"]', `jean.dupont.${Date.now()}@test.com`);
    await page.fill('input[placeholder*="Entreprise"]', 'ACME Corp');
    
    await page.click('button:has-text("Sauvegarder")');
    
    // Vérifier toast succès
    await expect(page.locator('text=Contact cree')).toBeVisible({ timeout: 5000 });
    
    // Vérifier présence dans la liste
    await expect(page.locator('text=Jean Dupont')).toBeVisible();
  });
});
