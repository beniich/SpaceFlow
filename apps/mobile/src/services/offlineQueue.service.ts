import * as Network from 'expo-network';
import { MMKV } from 'react-native-mmkv';
import { QueuedAction } from '../types';
import { api } from './api';

const storage = new MMKV({ id: 'offline-queue' });
const QUEUE_KEY = 'pending_actions';
const SYNC_INTERVAL = 30000; // 30s

class OfflineQueueService {
  private syncTimer: NodeJS.Timeout | null = null;
  private listeners: Set<(count: number) => void> = new Set();

  constructor() {
    this.startSyncInterval();
  }

  async isOnline(): Promise<boolean> {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected === true && networkState.isInternetReachable === true;
  }

  async enqueue(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retries'>) {
    const queued: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: Date.now(),
      retries: 0,
    };

    const queue = this.getQueue();
    queue.push(queued);
    this.saveQueue(queue);
    this.notifyListeners();

    // Tenter sync immédiat si online
    if (await this.isOnline()) {
      this.sync();
    }
  }

  getQueue(): QueuedAction[] {
    const raw = storage.getString(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveQueue(queue: QueuedAction[]) {
    storage.set(QUEUE_KEY, JSON.stringify(queue));
    this.notifyListeners();
  }

  getPendingCount(): number {
    return this.getQueue().length;
  }

  subscribe(callback: (count: number) => void): () => void {
    this.listeners.add(callback);
    callback(this.getPendingCount());
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    const count = this.getPendingCount();
    this.listeners.forEach(cb => cb(count));
  }

  async sync(): Promise<void> {
    if (!await this.isOnline()) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    const successful: string[] = [];

    for (const action of queue) {
      try {
        await this.executeAction(action);
        successful.push(action.id);
      } catch (error) {
        console.warn(`Failed to sync action ${action.id}:`, error);
        action.retries++;

        // Drop after 5 retries
        if (action.retries >= 5) {
          successful.push(action.id); // Remove it
        }
      }
    }

    const remaining = queue.filter(a => !successful.includes(a.id));
    this.saveQueue(remaining);
  }

  private async executeAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'CREATE_TICKET':
        await api.post('/api/tickets', action.payload);
        break;
      case 'UPDATE_WO':
        await api.patch(`/api/workorders/${action.payload.id}`, action.payload);
        break;
      case 'ADD_COMMENT':
        await api.post(`/api/workorders/${action.payload.id}/comments`, {
          message: action.payload.message,
        });
        break;
    }
  }

  private startSyncInterval() {
    this.syncTimer = setInterval(() => {
      this.sync();
    }, SYNC_INTERVAL);
  }

  destroy() {
    if (this.syncTimer) clearInterval(this.syncTimer);
  }
}

export const offlineQueue = new OfflineQueueService();
