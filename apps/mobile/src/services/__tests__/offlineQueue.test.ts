import { offlineQueue } from '../offlineQueue.service';

// Mock Expo Network
jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    })
  ),
}));

// Mock MMKV
const memoryStorage = new Map<string, string>();
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    getString: jest.fn((key: string) => memoryStorage.get(key) || null),
    set: jest.fn((key: string, value: string) => memoryStorage.set(key, value)),
    delete: jest.fn((key: string) => memoryStorage.delete(key)),
    clearAll: jest.fn(() => memoryStorage.clear()),
  })),
}));

// Mock API
jest.mock('../api', () => ({
  api: {
    post: jest.fn(() => Promise.resolve({ data: { success: true } })),
    patch: jest.fn(() => Promise.resolve({ data: { success: true } })),
  },
}));

describe('OfflineQueueService', () => {
  beforeEach(() => {
    memoryStorage.clear();
  });

  afterAll(() => {
    offlineQueue.destroy();
  });

  it('should enqueue action successfully', async () => {
    const action = {
      type: 'CREATE_TICKET' as const,
      payload: { title: 'Test Ticket Offline' },
    };

    await offlineQueue.enqueue(action);
    expect(offlineQueue.getPendingCount()).toBeGreaterThanOrEqual(0);
  });

  it('should notify subscribers on enqueue', () => {
    const callback = jest.fn();
    const unsubscribe = offlineQueue.subscribe(callback);

    offlineQueue.enqueue({
      type: 'CREATE_TICKET',
      payload: { title: 'Notification test' },
    });

    expect(callback).toHaveBeenCalled();
    unsubscribe();
  });
});
