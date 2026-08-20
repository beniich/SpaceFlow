import { useMemo } from "react";
import "./AlertsPanel.css";

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function AlertCard({ alert }) {
  const ago = useMemo(() => timeAgo(alert.timestamp), [alert.timestamp]);
  return (
    <div className={`bim-alert-card bim-alert-card--${alert.severity || "warning"}`}>
      <span className="bim-alert-card__icon">⚠</span>
      <div className="bim-alert-card__body">
        <p className="bim-alert-card__title">{alert.title}</p>
        {alert.location && <p className="bim-alert-card__loc">{alert.location}</p>}
        <p className="bim-alert-card__time">{ago}</p>
      </div>
    </div>
  );
}

export function AlertsPanel({ alerts = [] }) {
  const sorted = useMemo(
    () => [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [alerts]
  );

  return (
    <div className="bim-alerts-panel">
      <div className="bim-alerts-panel__header">
        <h3 className="bim-alerts-panel__title">
          <span className="bim-alerts-panel__icon">⚠</span>
          Alerts
        </h3>
        {sorted.length > 0 && (
          <span className="bim-alerts-panel__count">{sorted.length}</span>
        )}
      </div>
      <div className="bim-alerts-panel__content">
        {sorted.length === 0 ? (
          <div className="bim-alerts-panel__empty">
            <span className="bim-alerts-panel__ok-icon">✓</span>
            <p>No active alerts</p>
          </div>
        ) : (
          sorted.map(a => <AlertCard key={a.id} alert={a} />)
        )}
      </div>
    </div>
  );
}
