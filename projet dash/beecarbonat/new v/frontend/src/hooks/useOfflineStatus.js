import { useState, useEffect, useCallback } from 'react';

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [swReady, setSwReady] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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
    };
  }, []);

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

  return {
    isOnline,
    isOffline: !isOnline,
    swReady,
    cacheInfo,
    fetchCacheInfo,
    refreshFacilityCache
  };
}

export default useOfflineStatus;
