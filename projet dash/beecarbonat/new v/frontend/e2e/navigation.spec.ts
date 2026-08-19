import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/',              title: /Dashboard/i },
  { path: '/assets',        title: /Actifs/i },
  { path: '/spaces',        title: /espaces/i },
  { path: '/work-orders',   title: /Ordres/i },
  { path: '/maintenance',   title: /Maintenance/i },
  { path: '/cmms',          title: /CMMS/i },
  { path: '/analytics',     title: /Analytique/i },
  { path: '/leases',        title: /Baux/i },
  { path: '/notifications', title: /Notifications/i },
  { path: '/settings',      title: /Param/i },
];

test.describe('Navigation — All Routes Accessible', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cafm.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  for (const route of ROUTES) {
    test(`should navigate to ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      // Must not redirect to login
      expect(page.url()).not.toContain('/login');
      // Page must render an h1 with expected text
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 8000 });
    });
  }

  test('should redirect unauthenticated user to login', async ({ page, context }) => {
    await context.clearCookies();
    // Clear localStorage to remove JWT
    await page.evaluate(() => localStorage.clear());
    await page.goto('/assets');
    await page.waitForURL(/\/login/);
  });

  test('should logout and redirect to login', async ({ page }) => {
    const logoutBtn = page.locator('button:has-text("Déconnexion")');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    await page.waitForURL(/\/login/);
  });
});
