describe('Offline Mode Flow', () => {
  it('should queue actions when offline and sync when online', async () => {
    // Go offline
    await device.setNetworkState('offline');

    // Try to create ticket offline
    await element(by.id('tab-tickets')).tap();
    await element(by.id('new-ticket-button')).tap();
    await element(by.id('title-input')).typeText('Test anomalie hors-ligne');
    await element(by.id('description-input')).typeText('Créé sans connexion réseau');
    await element(by.id('submit-button')).tap();

    // Confirm local queue feedback
    await expect(element(by.text('Ticket enregistré'))).toBeVisible();

    // Restore network
    await device.setNetworkState('online');

    // Should sync automatically via offline queue service
    await waitFor(element(by.id('sync-success')))
      .toBeVisible()
      .withTimeout(30000);
  });
});
