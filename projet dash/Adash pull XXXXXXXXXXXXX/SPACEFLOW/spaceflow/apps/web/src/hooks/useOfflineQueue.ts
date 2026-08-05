import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';

interface QueuedAction {
  id?: number;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: any;
  createdAt: number;
  retries: number;
}

const DB_NAME = 'spaceflow-offline';
const STORE_NAME = 'pending-actions';

class OfflineQueueDB {
  private dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          store.createIndex('createdAt', 'createdAt');
        }
      }
    });
  }

  async add(action: Omit<QueuedAction, 'id'>): Promise<number> {
    const db = await this.dbPromise;
    return (await db.add(STORE_NAME, action)) as number;
  }

  async getAll(): Promise<QueuedAction[]> {
    const db = await this.dbPromise;
    return (await db.getAll(STORE_NAME)) as QueuedAction[];
  }

  async delete(id: number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, id);
  }

  async count(): Promise<number> {
    const db = await this.dbPromise;
    return db.count(STORE_NAME);
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(STORE_NAME);
  }
}

const queueDB = new OfflineQueueDB();

export function useOfflineQueue() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const updateCount = useCallback(async () => {
    const count = await queueDB.count();
    setPendingCount(count);
  }, []);

  useEffect(() => {
    updateCount();

    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      syncNow();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateCount]);

  const enqueue = useCallback(async (action: Omit<QueuedAction, 'id' | 'createdAt' | 'retries'>) => {
    await queueDB.add({ ...action, createdAt: Date.now(), retries: 0 });
    await updateCount();
    
    if (navigator.onLine) {
      syncNow();
    }
  }, [updateCount]);

  const syncNow = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const actions = await queueDB.getAll();
      
      for (const action of actions) {
        try {
          const { default: api } = await import('../services/api');
          await api({
            method: action.method,
            url: action.endpoint,
            data: action.body
          });
          if (action.id) await queueDB.delete(action.id);
        } catch (err) {
          console.error('Sync failed for action:', action.id, err);
        }
      }
      
      await updateCount();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, updateCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    enqueue,
    syncNow,
    clearQueue: () => queueDB.clear().then(updateCount)
  };
}
