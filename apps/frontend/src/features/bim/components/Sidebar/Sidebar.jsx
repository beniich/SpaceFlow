import "./Sidebar.css";

const NAV_ITEMS = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "viewer",    icon: "⬢", label: "BIM Viewer", active: true },
  { id: "assets",    icon: "◇", label: "Assets" },
  { id: "workorders",icon: "✚", label: "Work Orders" },
  { id: "analytics", icon: "◢", label: "Analytics" },
  { id: "settings",  icon: "⚙", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="bim-sidebar">
      <div className="bim-sidebar__brand">
        <div className="bim-sidebar__brand-icon">⬡</div>
      </div>
      <nav className="bim-sidebar__items">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`bim-sidebar__item ${item.active ? "bim-sidebar__item--active" : ""}`}
            title={item.label}
            aria-label={item.label}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="bim-sidebar__icon">{item.icon}</span>
          </button>
        ))}
      </nav>
      <div className="bim-sidebar__footer">
        <button className="bim-sidebar__item" title="Logout">
          <span className="bim-sidebar__icon">⤴</span>
        </button>
      </div>
    </aside>
  );
}
