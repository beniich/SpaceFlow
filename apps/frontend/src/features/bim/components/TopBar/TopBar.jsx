import { useState } from "react";
import "./TopBar.css";

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "viewer",    label: "Viewer",    icon: "◉", active: true },
  { id: "analyze",   label: "Analyze",   icon: "◢" },
  { id: "reports",   label: "Reports",   icon: "▤" },
  { id: "settings",  label: "Settings",  icon: "⚙" },
];

export function TopBar() {
  const [search, setSearch] = useState("");

  return (
    <header className="bim-topbar">
      <div className="bim-topbar__brand">
        <span className="bim-topbar__brand-logo">⬡</span>
        <span className="bim-topbar__brand-text">
          <strong>BIMDT</strong> Workspace
        </span>
      </div>

      <div className="bim-topbar__search">
        <span className="bim-topbar__search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search projects, assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bim-topbar__search-input"
        />
        <span className="bim-topbar__search-shortcut">⌘ K</span>
      </div>

      <nav className="bim-topbar__nav">
        {NAV_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`bim-topbar__tab ${tab.active ? "bim-topbar__tab--active" : ""}`}
            aria-current={tab.active ? "page" : undefined}
          >
            <span className="bim-topbar__tab-icon">{tab.icon}</span>
            <span className="bim-topbar__tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <button className="bim-topbar__avatar" aria-label="User menu">T</button>
    </header>
  );
}
