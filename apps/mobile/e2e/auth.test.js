describe('Auth Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        camera: 'YES',
        location: 'always',
        notifications: 'YES',
      },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display login screen on first launch', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.text('Se connecter'))).toBeVisible();
  });

  it('should show error with invalid credentials', async () => {
    await element(by.id('email-input')).typeText('wrong@test.com');
    await element(by.id('password-input')).typeText('wrongpass');
    await element(by.id('login-button')).tap();
    await expect(element(by.text('Identifiants invalides'))).toBeVisible();
  });

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('test@beecarbon.local');
    await element(by.id('password-input')).typeText('SecurePass123!');
    await element(by.id('login-button')).tap();
    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should persist auth after app kill', async () => {
    // Login first
    await element(by.id('email-input')).typeText('test@beecarbon.local');
    await element(by.id('password-input')).typeText('SecurePass123!');
    await element(by.id('login-button')).tap();
    await waitFor(element(by.id('dashboard-screen'))).toBeVisible();

    // Kill and relaunch
    await device.terminateApp();
    await device.launchApp();

    // Should auto-navigate to dashboard (token persisted via SecureStore)
    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
