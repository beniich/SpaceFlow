import { useState, useEffect } from "react";

const DEMO_ALERTS = [
  {
    id: "alert-1",
    severity: "critical",
    title: "High Temperature Alert on L3 Beam",
    location: "Floor L3 · Structural",
    timestamp: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
];

export function useAlerts(modelId) {
  const [alerts, setAlerts] = useState(DEMO_ALERTS);

  useEffect(() => {
    if (!modelId) return;
    let ws;
    try {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      ws = new WebSocket(`${proto}//${window.location.host}/ws/bim/${modelId}/alerts`);
      ws.onmessage = (e) => {
        try {
          const alert = JSON.parse(e.data);
          setAlerts((prev) => [alert, ...prev].slice(0, 30));
        } catch {/* ignore */}
      };
      ws.onerror = () => { /* fallback to demo */ };
    } catch {/* demo mode */}
    return () => ws?.close();
  }, [modelId]);

  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  return { alerts, dismissAlert };
}
