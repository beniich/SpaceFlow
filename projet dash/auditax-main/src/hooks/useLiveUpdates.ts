import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useLiveUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('[WS] Message Received:', data);

      if (data.type === 'NODE_UPDATED') {
        queryClient.invalidateQueries({ queryKey: ['nodes'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
      }

      if (data.type === 'INCIDENT_UPDATED' || data.type === 'NEW_INCIDENT') {
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
      }

      if (data.type === 'COMPLIANCE_UPDATED') {
        queryClient.invalidateQueries({ queryKey: ['compliance'] });
      }

      if (data.type === 'AUDIT_UPDATED') {
        queryClient.invalidateQueries({ queryKey: ['audits'] });
      }

    };

    socket.onopen = () => console.log('[WS] AuditAX Live Connected');
    socket.onclose = () => console.log('[WS] AuditAX Live Disconnected');

    return () => socket.close();
  }, [queryClient]);
}
