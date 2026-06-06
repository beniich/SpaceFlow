import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { AuditNode } from '../types';

const STREAM_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}/stream`;

/**
 * useDataStream — opens a persistent SSE connection to the backend.
 * Real-time node status updates and log messages are pushed directly into the Zustand store.
 * Should be mounted once at app root level (AppLayout).
 */
export function useDataStream() {
  const { setNodes, addLog, addToast } = useStore();
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    function connect() {
      if (!active) return;

      const es = new EventSource(STREAM_URL);
      esRef.current = es;

      es.addEventListener('connected', () => {
        addLog('success', '🌐 Flux de données temps réel connecté (SSE — AgroMaître Backend).');
      });

      // Node state updates from IoT simulator
      es.addEventListener('nodes', (e) => {
        try {
          const nodes: AuditNode[] = JSON.parse(e.data);
          setNodes(nodes);
        } catch {
          // malformed payload — ignore
        }
      });

      // Live log messages from IoT simulator
      es.addEventListener('log', (e) => {
        try {
          const { level, message } = JSON.parse(e.data);
          addLog(level, message);
        } catch {
          // malformed payload — ignore
        }
      });

      // Smart Advice from DSS bridge
      es.addEventListener('SMART_ADVICE', (e) => {
        try {
          const advice = JSON.parse(e.data);
          // Post advice as a toast
          addToast({
            id: `advice-${Date.now()}-${Math.random()}`,
            level: advice.severity === 'critical' ? 'error' : 'warn',
            message: `🌱 ${advice.title}\n${advice.message}\n${advice.action}`,
          });
          // Also log it
          addLog(advice.severity === 'critical' ? 'error' : 'warn', `DSS_ADVICE: ${advice.title} - ${advice.action}`);
        } catch {
          // ignore
        }
      });

      es.onerror = () => {
        es.close();
        esRef.current = null;
        if (active) {
          addLog('warn', '⚠️ Connexion SSE perdue — nouvelle tentative dans 5 secondes...');
          // Auto-reconnect after 5 seconds
          reconnectTimer.current = setTimeout(connect, 5000);
        }
      };
    }

    connect();

    return () => {
      active = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      esRef.current?.close();
    };
  }, [addLog, setNodes]);
}
