import { test, expect } from '@playwright/test';

test.describe('Full User Flow', () => {
  test('complete flow: register → space → member → booking → checkin', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.fill('input[type="email"]', `test-${Date.now()}@spaceflow.com`);
    await page.fill('input[name="password"]', 'Test1234!');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="organizationName"]', 'Test Space');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    
    // 2. Navigate to spaces
    await page.click('a[href="/spaces"]');
    await page.click('a[href="/spaces/new"]');
    
    // 3. Create space
    await page.fill('input[name="name"]', 'Test Open Space');
    await page.selectOption('select[name="type"]', 'COWORKING');
    await page.fill('input[name="capacity"]', '20');
    await page.fill('input[name="hourlyRate"]', '5');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/\/spaces\/[a-f0-9-]+/);
    
    // 4. Create member
    await page.click('a[href="/members"]');
    await page.click('a[href="/members/new"]');
    await page.fill('input[name="firstName"]', 'Jean');
    await page.fill('input[name="lastName"]', 'Member');
    await page.fill('input[name="email"]', `jean-${Date.now()}@test.com`);
    await page.click('button[type="submit"]');
    
    // 5. Create booking
    await page.click('a[href="/bookings"]');
    await page.click('button:has-text("Nouvelle réservation")');
    
    await page.selectOption('select[name="memberId"]', { index: 1 });
    await page.fill('input[type="datetime-local"][name="startTime"]', 
      '2025-12-15T09:00');
    await page.fill('input[type="datetime-local"][name="endTime"]', 
      '2025-12-15T17:00');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=/BK-2025-/')).toBeVisible();
    
    // 6. Test offline mode
    await page.context().setOffline(true);
    await page.reload();
    
    // Should still show cached version
    await expect(page.locator('text=Réservations')).toBeVisible();
    
    await page.context().setOffline(false);
  });
});
