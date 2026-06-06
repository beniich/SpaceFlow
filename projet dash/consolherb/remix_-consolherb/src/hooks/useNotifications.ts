import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';

/**
 * useNotifications — watches the SSE log stream for critical events.
 * Triggers toast notifications for 'error' and 'warn' level logs
 * that come from the live backend (identified by the [SIM] prefix or SSE event).
 */
export function useNotifications() {
  const { logs, addToast } = useStore();

  // Watch the last log and fire a toast for critical events
  const lastLog = logs[logs.length - 1];

  useEffect(() => {
    if (!lastLog || !addToast) return;
    if (lastLog.level === 'error' || lastLog.level === 'warn') {
      addToast({
        id: `toast-${lastLog.id}`,
        level: lastLog.level,
        message: lastLog.message,
      });
    }
  // Only trigger on new logs (by id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLog?.id]);

  // Expose a manual trigger for dashboard attack simulations
  const notifyAttack = useCallback((message: string) => {
    if (addToast) {
      addToast({ id: `toast-attack-${Date.now()}`, level: 'error', message });
    }
  }, [addToast]);

  return { notifyAttack };
}
