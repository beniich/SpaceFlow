import "./PropertiesInspector.css";

function StatusBadge({ status }) {
  const cfg = {
    operational: { label: "Operational (Normal)", cls: "status--ok" },
    alert:       { label: "Alert",                cls: "status--danger" },
    maintenance: { label: "Maintenance",          cls: "status--warn" },
  }[status] || { label: "Unknown", cls: "" };
  return <span className={`bim-status-badge ${cfg.cls}`}>● {cfg.label}</span>;
}

export function PropertiesInspector({ element }) {
  if (!element) {
    return (
      <div className="bim-inspector">
        <div className="bim-inspector__header">
          <h3 className="bim-inspector__title"><span className="bim-inspector__icon">⊞</span>Properties Inspector</h3>
        </div>
        <div className="bim-inspector__empty">Select an element to inspect its properties</div>
      </div>
    );
  }

  if (element.type !== "asset") {
    return (
      <div className="bim-inspector">
        <div className="bim-inspector__header">
          <h3 className="bim-inspector__title"><span className="bim-inspector__icon">⊞</span>Properties Inspector</h3>
        </div>
        <div className="bim-inspector__empty">
          Container: <strong style={{ color: "var(--text-primary)" }}>{element.name}</strong>
        </div>
      </div>
    );
  }

  const rows = [
    { label: "Selected",         value: `${element.name} (${element.location || ""})`, cyan: true },
    { label: "GUID",             value: element.guid,           mono: true },
    { label: "Type",             value: element.assetType },
    { label: "Material",         value: element.material },
    { label: "Thickness",        value: element.thickness || "—" },
    { label: "Status",           value: <StatusBadge status={element.status} /> },
    { label: "Temperature",      value: `${element.temperature}°C`,   mono: true },
    { label: "Airflow",          value: `${element.airflow} CFM`,     mono: true },
    { label: "Last Maintenance", value: element.lastMaintenance || "—", mono: true },
  ];

  return (
    <div className="bim-inspector">
      <div className="bim-inspector__header">
        <h3 className="bim-inspector__title"><span className="bim-inspector__icon">⊞</span>Properties Inspector</h3>
      </div>
      <div className="bim-inspector__content">
        <div className="bim-inspector__prop-list">
          {rows.map((row) => (
            <div key={row.label} className="bim-inspector__row">
              <span className="bim-inspector__label">{row.label}</span>
              <span className={[
                "bim-inspector__value",
                row.mono  && "bim-inspector__value--mono",
                row.cyan  && "bim-inspector__value--cyan",
              ].filter(Boolean).join(" ")}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
