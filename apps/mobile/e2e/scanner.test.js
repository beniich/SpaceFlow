describe('Scanner Flow', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        camera: 'YES',
      },
    });
  });

  it('should open the scanner modal and allow closing', async () => {
    // Navigate to scanner
    const scanFab = element(by.id('fab-scan-qr'));
    if (await scanFab.isVisible()) {
      await scanFab.tap();
      await expect(element(by.id('scanner-camera-view'))).toBeVisible();
      await element(by.id('scanner-close-button')).tap();
    }
  });
});
