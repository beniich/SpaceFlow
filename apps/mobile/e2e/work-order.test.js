describe('Work Order Flow', () => {
  beforeAll(async () => {
    // Login
    await device.launchApp();
    await element(by.id('email-input')).typeText('tech@beecarbon.local');
    await element(by.id('password-input')).typeText('TechPass123!');
    await element(by.id('login-button')).tap();
    await waitFor(element(by.id('dashboard-screen'))).toBeVisible();
  });

  it('should display list of work orders', async () => {
    await element(by.id('tab-work-orders')).tap();
    await expect(element(by.id('wo-list'))).toBeVisible();
    await expect(element(by.id('wo-card-0'))).toBeVisible();
  });

  it('should navigate to work order detail', async () => {
    await element(by.id('tab-work-orders')).tap();
    await element(by.id('wo-card-0')).tap();
    await expect(element(by.id('wo-detail'))).toBeVisible();
    await expect(element(by.id('wo-title'))).toBeVisible();
    await expect(element(by.id('task-list'))).toBeVisible();
  });

  it('should toggle a task checkbox', async () => {
    await element(by.id('tab-work-orders')).tap();
    await element(by.id('wo-card-0')).tap();
    const firstTask = element(by.id('task-checkbox-0'));
    await firstTask.tap();
    await expect(firstTask).toHaveValue('checked');
  });

  it('should complete a work order', async () => {
    await element(by.id('tab-work-orders')).tap();
    await element(by.id('wo-card-0')).tap();
    // Mark tasks done
    for (let i = 0; i < 3; i++) {
      try {
        await element(by.id(`task-checkbox-${i}`)).tap();
      } catch (e) {
        // Continue if fewer tasks
      }
    }
    // Add completion note
    await element(by.id('notes-input')).typeText('Intervention terminée avec succès.');
    await element(by.id('complete-button')).tap();
    await expect(element(by.text('Intervention terminée'))).toBeVisible();
  });
});
