import { useState, useEffect, useCallback } from 'react';
import { getPendingActionsCount, flushPendingActions, SYNC_EVENT_NAME } from '../services/syncService';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [swReady, setSwReady] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const updatePendingCount = useCallback(async () => {
    const count = await getPendingActionsCount();
    setPendingSyncCount(count);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      updatePendingCount();
    };
    const handleOffline = () => {
      setIsOnline(false);
      updatePendingCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener(SYNC_EVENT_NAME, updatePendingCount);

    updatePendingCount();

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setSwReady(true);
      fetchCacheInfo();
    }

    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      setSwReady(true);
      fetchCacheInfo();
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(SYNC_EVENT_NAME, updatePendingCount);
    };
  }, [updatePendingCount]);

  const fetchCacheInfo = useCallback(() => {
    if (!navigator.serviceWorker?.controller) return;

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data) {
        setCacheInfo(event.data);
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_INFO' },
      [messageChannel.port2]
    );
  }, []);

  const refreshFacilityCache = useCallback(() => {
    if (!navigator.serviceWorker?.controller) return;

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data?.status === 'FACILITY_CACHE_UPDATED') {
        fetchCacheInfo();
      }
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'REFRESH_FACILITY_CACHE' },
      [messageChannel.port2]
    );
  }, [fetchCacheInfo]);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await flushPendingActions();
      await updatePendingCount();
      return res;
    } finally {
      setIsSyncing(false);
    }
  }, [updatePendingCount]);

  return {
    isOnline,
    isOffline: !isOnline,
    swReady,
    cacheInfo,
    pendingSyncCount,
    isSyncing,
    syncNow,
    fetchCacheInfo,
    refreshFacilityCache
  };
}

export default useOfflineStatus;

