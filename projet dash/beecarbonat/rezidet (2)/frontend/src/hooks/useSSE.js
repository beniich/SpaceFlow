import { useEffect, useRef, useState } from 'react';
import { useCrmAuthStore } from '../store/crmAuthStore';

const SSE_URL = (token) =>
  `${window.location.origin.includes('localhost')
    ? 'http://localhost:8081'
    : ''}/api/crm/events?token=${encodeURIComponent(token)}`;

/**
 * Hook SSE — reconnexion automatique, anti-boucle deps
 * onEvent est stocké dans un ref pour éviter les re-renders infinis
 */
export const useSSE = (onEvent) => {
  const { token } = useCrmAuthStore();
  const eventSourceRef   = useRef(null);
  const reconnectRef     = useRef(null);
  const onEventRef       = useRef(onEvent);
  const [connected, setConnected]   = useState(false);
  const [retries, setRetries]       = useState(0);

  // Garder la ref à jour sans re-créer l'effet
  useEffect(() => { onEventRef.current = onEvent; }, [onEvent]);

  useEffect(() => {
    if (!token) return;

    const EVENT_TYPES = [
      'deal_won',
      'critical_workorder',
      'new_deal',
      'new_contact',
      'kpi_threshold',
      'asset_alert'
    ];

    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      const url = SSE_URL(token);
      const es  = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener('connected', () => {
        setConnected(true);
        setRetries(0);
        console.log('[SSE] Connected ✅');
      });

      EVENT_TYPES.forEach(type => {
        es.addEventListener(type, (e) => {
          try {
            const data = JSON.parse(e.data);
            onEventRef.current?.({ type, data });
          } catch (err) {
            console.error('[SSE] Parse error:', err);
          }
        });
      });

      es.onerror = () => {
        if (cancelled) return;
        setConnected(false);
        es.close();
        // Backoff exponentiel : 3s, 6s, 12s, max 30s
        setRetries(r => {
          const delay = Math.min(3000 * Math.pow(2, r), 30000);
          console.warn(`[SSE] Reconnecting in ${delay / 1000}s... (attempt ${r + 1})`);
          reconnectRef.current = setTimeout(connect, delay);
          return r + 1;
        });
      };
    };

    connect();

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      clearTimeout(reconnectRef.current);
      setConnected(false);
    };
  }, [token]); // ← token only, onEvent est dans un ref

  return { connected, retries };
};
