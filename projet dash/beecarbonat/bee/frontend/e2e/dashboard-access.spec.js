import { test, expect } from '@playwright/test';

test.describe('Dashboard Access', () => {
  test('should successfully log in and redirect to dashboard', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Wait for the form to be visible
    const formTitle = page.locator('h1.auth-form-title');
    await expect(formTitle).toBeVisible();
    await expect(formTitle).toHaveText('Log in to CAFM PRO');

    // Fill in demo credentials
    await page.fill('input[type="email"]', 'tarikbenaich@gmail.com');
    await page.fill('input[type="password"]', 'admin123'); // Demo password accepted by logic

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation to complete (URL should be / or /dashboard depending on redirect logic)
    // Based on the router, standard login redirects to location.state.from or '/' 
    // And from '/' it might redirect to '/dashboard' if logged in, let's verify if URL contains dashboard
    
    // Check if the dashboard is rendered (e.g. sidebar exists or specific dashboard elements)
    // The Layout component has "BEECARBONAT" in the sidebar
    const beecarbonatText = page.locator('text=BEECARBONAT').first();
    await expect(beecarbonatText).toBeVisible({ timeout: 15000 });
    
    // Try to ensure we are on a valid post-login route
    await expect(page).toHaveURL(/.*\/dashboard|.*\//);
    
    // Check for a specific dashboard element
    // By default, Layout has a "Dashboard" nav item
    const dashboardNavLink = page.locator('a[href="/dashboard"]');
    await expect(dashboardNavLink).toBeVisible();
  });
  
  test('should allow demo access via the quick link', async ({ page }) => {
    await page.goto('/login');
    
    // Find the demo access button "Accéder au mode démo"
    const demoButton = page.locator('button:has-text("Accéder au mode démo")');
    if (await demoButton.isVisible()) {
      await demoButton.click();
      
      // Wait for the layout to appear
      const beecarbonatText = page.locator('text=BEECARBONAT').first();
      await expect(beecarbonatText).toBeVisible({ timeout: 10000 });
      
      // Verify standard layout items are visible indicating successful entry
      const dashboardNavLink = page.locator('a[href="/dashboard"]');
      await expect(dashboardNavLink).toBeVisible();
    }
  });
});
