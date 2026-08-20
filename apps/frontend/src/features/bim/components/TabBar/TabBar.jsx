import "./TabBar.css";

export function TabBar({ tabs, activeId, onClose, onActivate }) {
  return (
    <div className="bim-tabbar" role="tablist">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`bim-tab ${activeId === tab.id ? "bim-tab--active" : ""}`}
          role="tab"
          aria-selected={activeId === tab.id}
          onClick={() => onActivate(tab.id)}
        >
          {tab.icon && <span className="bim-tab__icon">{tab.icon}</span>}
          <span className="bim-tab__title">{tab.title}</span>
          {tab.closeable && (
            <button
              className="bim-tab__close"
              onClick={(e) => { e.stopPropagation(); onClose(tab.id); }}
              aria-label="Close tab"
            >×</button>
          )}
        </div>
      ))}
    </div>
  );
}
