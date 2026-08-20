import "./StatusBar.css";

export function StatusBar({ connected, modelsLoaded, lastSync }) {
  return (
    <footer className="bim-statusbar">
      <div className="bim-statusbar__section">
        <span className={`bim-statusbar__dot ${connected ? "bim-statusbar__dot--ok" : "bim-statusbar__dot--err"}`} />
        <span className={`bim-statusbar__conn ${connected ? "bim-statusbar__conn--ok" : ""}`}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>
      <div className="bim-statusbar__div" />
      <div className="bim-statusbar__section">
        <span className="bim-statusbar__label">Models Loaded:</span>
        <span className="bim-statusbar__val">{modelsLoaded}</span>
      </div>
      <div className="bim-statusbar__div" />
      <div className="bim-statusbar__section">
        <span className="bim-statusbar__label">Last Sync:</span>
        <span className="bim-statusbar__val">{lastSync}</span>
      </div>
    </footer>
  );
}
