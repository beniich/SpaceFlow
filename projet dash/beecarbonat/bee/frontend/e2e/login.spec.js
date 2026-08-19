/**
 * E2E Test - Flux de Login
 * Tests des flux critiques : Login → Dashboard
 */
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/beecarbonit|CAFM|BIM/i);
  });

  test('should redirect to dashboard on valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Remplir le formulaire
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'tarikbenaich@gmail.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || '0000_-tr');
    
    // Soumettre
    await page.click('button[type="submit"]');
    
    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Vérifier qu'une erreur est affichée
    await expect(page.locator('[role="alert"], .toast, [data-testid="error"]')).toBeVisible({ timeout: 5000 });
  });
});
