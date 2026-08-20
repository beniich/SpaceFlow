import { useState, useCallback } from "react";
import { Sidebar }             from "./components/Sidebar/Sidebar";
import { TopBar }              from "./components/TopBar/TopBar";
import { ElementTree }         from "./components/ElementTree/ElementTree";
import { TabBar }              from "./components/TabBar/TabBar";
import { Viewport3D }          from "./components/Viewport3D/Viewport3D";
import { PropertiesInspector } from "./components/PropertiesInspector/PropertiesInspector";
import { AlertsPanel }         from "./components/AlertsPanel/AlertsPanel";
import { StatusBar }           from "./components/StatusBar/StatusBar";
import { useBimData }          from "./hooks/useBimData";
import { useAlerts }           from "./hooks/useAlerts";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { DEMO_TREE, buildIndex } from "./lib/demoData";
import "./styles/tokens.css";
import "./BimWorkspace.css";

const INITIAL_TABS = [
  { id: "tab-1", title: "Floor L2 - HVAC", icon: "◯", closeable: true },
];

export default function BimWorkspace({ modelId = "default" }) {
  const [selectedId,  setSelectedId]  = useState("ahu2");
  const [viewMode,    setViewMode]    = useState("orbit");
  const [tabs,        setTabs]        = useState(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState(INITIAL_TABS[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const { tree, elements, syncStatus } = useBimData(modelId);
  const { alerts }                      = useAlerts(modelId);

  const safeTree       = tree || DEMO_TREE;
  const indexedElems   = (elements && Object.keys(elements).length) ? elements : buildIndex(DEMO_TREE);
  const selectedElement = indexedElems[selectedId];

  const handleSelect = useCallback((id) => setSelectedId(id), []);

  const handleCloseTab = useCallback((tabId) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTabId === tabId) setActiveTabId(null);
  }, [activeTabId]);

  useKeyboardShortcuts({
    orbit:     () => setViewMode("orbit"),
    pan:       () => setViewMode("pan"),
    zoom:      () => setViewMode("zoom"),
    walk:      () => setViewMode("walk"),
    wireframe: () => setViewMode("wireframe"),
    xray:      () => setViewMode("xray"),
    shaded:    () => setViewMode("orbit"),
  });

  return (
    <div className="bim-workspace" role="application" aria-label="BIM Digital Twin Workspace">
      <Sidebar />

      <div className="bim-workspace__main">
        <TopBar />

        <div className="bim-workspace__content">
          {/* Left: IFC Tree */}
          <div className="bim-workspace__tree">
            <ElementTree
              tree={safeTree}
              selectedId={selectedId}
              onSelect={handleSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Center: 3D Viewport */}
          <div className="bim-workspace__viewport">
            <TabBar
              tabs={tabs}
              activeId={activeTabId}
              onClose={handleCloseTab}
              onActivate={setActiveTabId}
            />
            <Viewport3D
              elements={indexedElems}
              selectedElement={selectedId}
              onPickElement={handleSelect}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          {/* Right: Inspector + Alerts */}
          <div className="bim-workspace__inspector">
            <PropertiesInspector element={selectedElement} />
            <AlertsPanel alerts={alerts} />
          </div>
        </div>

        <StatusBar
          connected={true}
          modelsLoaded={4}
          lastSync={syncStatus || "1 min ago"}
        />
      </div>
    </div>
  );
}
