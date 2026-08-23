import React, { useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { ChevronRight, ChevronDown, AlertTriangle, Move3d, ZoomIn, Eye, Grid3x3, Search, Layers, Box, Cpu, Wrench } from "lucide-react";
import "../features/bim/BimWorkspace.css";

// --- Demo Data (Mock) ---
const DEMO_TREE = {
  id: "building-root",
  guid: "bld-12345",
  name: "Bâtiment Alpha (Tour A)",
  type: "building",
  status: "operational",
  children: [
    {
      id: "floors-folder",
      name: "Étages",
      type: "folder",
      children: [
        { id: "l1", name: "L1 - Accueil", type: "floor", count: 42, children: [] },
        { 
          id: "l2", name: "L2 - Technique", type: "floor", count: 18, 
          children: [
            {
              id: "ahu2", guid: "a2b98d7e-1c4f", name: "AHU-2 — CVC Principal", type: "asset",
              status: "operational", assetType: "Air Handling Unit",
              material: "Acier Galvanisé, Aluminium", thickness: "2mm",
              temperature: "21.5", airflow: "1500", lastMaintenance: "2024-01-15",
              zone: "Local Technique L2"
            }
          ] 
        },
        { 
          id: "l3", name: "L3 - Bureaux", type: "floor", count: 56, 
          children: [
            {
              id: "beam-l3", guid: "beam-9999", name: "Poutre Froide CB-301", type: "asset",
              status: "warning", assetType: "Active Chilled Beam",
              material: "Aluminium extrudé", thickness: "1.5mm",
              temperature: "26.4", airflow: "900", lastMaintenance: "2023-08-14",
              zone: "Open Space Nord"
            }
          ] 
        },
      ],
    },
    {
      id: "hvac-folder",
      name: "Réseaux CVC",
      type: "folder",
      children: [
        { id: "ducts", name: "Gaines aérauliques", type: "system", count: 24, children: [] },
        { id: "pipes", name: "Tuyauterie eau glacée", type: "system", count: 38, children: [] },
      ],
    },
  ],
};

function buildIndex(tree) {
  const index = {};
  const walk = (node) => {
    if (node.id) index[node.id] = node;
    node.children?.forEach(walk);
  };
  walk(tree);
  return index;
}

const INDEXED_ELEMENTS = buildIndex(DEMO_TREE);

// --- Procedural 3D Mock Component ---
function IFCViewport3D({ onPickAsset, viewMode, selectedId }) {
  const mountRef = useRef(null);
  const sceneInfo = useRef({ scene: null, camera: null, renderer: null, controls: null, model: null, loader: null });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(20, 20, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    scene.add(new THREE.AmbientLight(0xeeeeee, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("/wasm/");

    let animationId;
    const animate = () => {
      if (cancelled) return;
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    sceneInfo.current = { scene, camera, renderer, controls, loader: ifcLoader };

    const createProceduralFallbackModel = () => {
      const group = new THREE.Group();
      
      // Building Floors
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.2, transparent: true, opacity: 0.85 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.25, roughness: 0.1 });
      const ahuMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4, metalness: 0.6 });
      const beamMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5, metalness: 0.5 });
      const ductMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.3, metalness: 0.7 });

      // Slab floors (L1, L2, L3, Roof)
      for (let i = 0; i < 4; i++) {
        const slabGeo = new THREE.BoxGeometry(20, 0.4, 15);
        const slab = new THREE.Mesh(slabGeo, floorMat);
        slab.position.set(0, i * 4, 0);
        group.add(slab);
      }

      // Columns
      const colGeo = new THREE.CylinderGeometry(0.3, 0.3, 12, 16);
      [[-9, -6], [9, -6], [-9, 6], [9, 6], [0, -6], [0, 6]].forEach(([x, z]) => {
        const col = new THREE.Mesh(colGeo, floorMat);
        col.position.set(x, 6, z);
        group.add(col);
      });

      // Glass Façade accents
      const facadeGeo = new THREE.BoxGeometry(20.2, 12, 15.2);
      const facade = new THREE.Mesh(facadeGeo, glassMat);
      facade.position.set(0, 6, 0);
      group.add(facade);

      // AHU-2 Unit on L2 (y = 4)
      const ahuGeo = new THREE.BoxGeometry(4, 2, 2.5);
      const ahu = new THREE.Mesh(ahuGeo, ahuMat);
      ahu.position.set(-4, 5, 2);
      ahu.userData = { expressID: "ahu2" };
      group.add(ahu);

      // Ducts connected to AHU
      const ductGeo = new THREE.BoxGeometry(12, 0.8, 0.8);
      const duct = new THREE.Mesh(ductGeo, ductMat);
      duct.position.set(2, 5.8, 2);
      duct.userData = { expressID: "ducts" };
      group.add(duct);

      // Cold beam on L3 (y = 8)
      const beamGeo = new THREE.BoxGeometry(6, 0.5, 1);
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(3, 9, -2);
      beam.userData = { expressID: "beam-l3" };
      group.add(beam);

      return group;
    };

    ifcLoader.load(
      "/sample.ifc",
      (model) => {
        if (cancelled) return;
        if (model && model.children && model.children.length > 0) {
          scene.add(model);
          sceneInfo.current.model = model;
        } else {
          // Fallback if IFC is empty
          const fallbackModel = createProceduralFallbackModel();
          scene.add(fallbackModel);
          sceneInfo.current.model = fallbackModel;
        }
        
        // Center camera
        const box = new THREE.Box3().setFromObject(sceneInfo.current.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.copy(center);
        camera.position.x += maxDim * 1.5;
        camera.position.y += maxDim * 1.5;
        camera.position.z += maxDim * 1.5;
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();

        setIsLoading(false);
      },
      (progress) => {
        if (progress.lengthComputable && !cancelled) {
          setLoadingProgress(Math.round((progress.loaded / progress.total) * 100));
        }
      },
      (err) => {
        if (cancelled) return;
        console.warn("IFC Load warning, using procedural 3D model", err);
        const fallbackModel = createProceduralFallbackModel();
        scene.add(fallbackModel);
        sceneInfo.current.model = fallbackModel;

        const box = new THREE.Box3().setFromObject(fallbackModel);
        const center = box.getCenter(new THREE.Vector3());
        camera.position.set( center.x + 25, center.y + 25, center.z + 25 );
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();

        setIsLoading(false);
      }
    );

    // Raycasting for picking
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onClick = (e) => {
      if (!sceneInfo.current.model) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(sceneInfo.current.model.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.object.userData?.expressID) {
          onPickAsset(hit.object.userData.expressID);
        } else {
          try {
            const index = hit.faceIndex;
            const geometry = hit.object.geometry;
            const ifc = ifcLoader.ifcManager;
            const expressID = ifc.getExpressId(geometry, index);
            if (expressID !== undefined) {
              onPickAsset(expressID);
            }
          } catch {
            onPickAsset(null);
          }
        }
      } else {
        onPickAsset(null);
      }
    };

    const onPointerMove = (e) => {
      if (!sceneInfo.current.model) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(sceneInfo.current.model);
      renderer.domElement.style.cursor = hits.length > 0 ? "pointer" : "grab";
    };

    renderer.domElement.addEventListener("dblclick", onClick);
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("dblclick", onClick);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      if (ifcLoader) ifcLoader.ifcManager.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // View mode effect
  useEffect(() => {
     const model = sceneInfo.current.model;
     if (!model) return;
     
     const materials = Array.isArray(model.material) ? model.material : [model.material];
     materials.forEach(mat => {
        if (viewMode === 'wireframe') {
           mat.wireframe = true;
           mat.transparent = true;
           mat.opacity = 0.3;
        } else if (viewMode === 'xray') {
           mat.wireframe = false;
           mat.transparent = true;
           mat.opacity = 0.2;
        } else {
           mat.wireframe = false;
           mat.transparent = false;
           mat.opacity = 1.0;
        }
        mat.needsUpdate = true;
     });
  }, [viewMode, isLoading]);

  // Handle selectedId effect (subset highlighting)
  useEffect(() => {
     const model = sceneInfo.current.model;
     const ifc = sceneInfo.current.loader?.ifcManager;
     const scene = sceneInfo.current.scene;
     if (!model || !ifc || !scene) return;

     if (selectedId) {
        // Try parsing selectedId to int if it's an expressID
        const parsedId = parseInt(selectedId, 10);
        if (!isNaN(parsedId)) {
           ifc.createSubset({
              modelID: model.modelID,
              ids: [parsedId],
              material: new THREE.MeshBasicMaterial({ color: 0x00f0ff, depthTest: false, transparent: true, opacity: 0.5 }),
              scene: scene,
              removePrevious: true,
              customID: 'highlight'
           });
        }
     } else {
        ifc.removeSubset(model.modelID, scene, 'highlight');
     }
  }, [selectedId, isLoading]);

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full absolute inset-0" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117]/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-400 font-mono text-sm">Chargement du modèle IFC... {loadingProgress > 0 ? `${loadingProgress}%` : ''}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Layout ---
export default function BIMViewer() {
  const [selectedId, setSelectedId] = useState("ahu2");
  const [viewMode, setViewMode] = useState("shaded"); // shaded, wireframe, xray
  const [expanded, setExpanded] = useState(new Set(["building-root", "floors-folder", "l2", "l3"]));
  const [searchQuery, setSearchQuery] = useState("");

  const selectedElement = INDEXED_ELEMENTS[selectedId] || (typeof selectedId === 'number' ? {
    id: selectedId,
    guid: `IFC-ID-${selectedId}`,
    name: `IFC Element ${selectedId}`,
    type: "asset",
    status: "operational",
    assetType: "IFC Mesh Subset",
    material: "Extracted from Model",
    temperature: "--",
    airflow: "--",
    zone: "IFC Context"
  } : null);

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderTree = (node, depth) => {
    // Basic search filtering
    if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase()) && node.type !== "folder" && node.type !== "building") {
      return null;
    }

    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;
    const isAsset = node.type === "asset";

    return (
      <div key={node.id}>
        <div
          onClick={() => {
            if (hasChildren) toggleExpand(node.id);
            if (isAsset) setSelectedId(node.id);
          }}
          className={`tree-node ${isSelected ? "tree-node-selected" : ""}`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} className="text-slate-500 shrink-0 mr-1" /> : <ChevronRight size={14} className="text-slate-500 shrink-0 mr-1" />
          ) : (
            <span className="w-[18px] shrink-0" />
          )}
          <span className={`truncate flex-1 ${isAsset ? 'font-semibold text-slate-200' : 'text-slate-300'}`}>{node.name}</span>
          {node.status === "operational" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mx-2 shadow-[0_0_8px_#10B981]" />}
          {node.status === "warning" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mx-2 animate-pulse shadow-[0_0_8px_#ef4444]" />}
          {node.count != null && <span className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-slate-500 tabular-nums">{node.count}</span>}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bim-workspace">
      {/* Sidebar Navigation */}
      <aside className="sidebar-nav">
        <div className="brand-icon mb-6">⬡</div>
        <div className="sidebar-items">
          <button className="sidebar-item" title="Dashboard">▦</button>
          <button className="sidebar-item sidebar-item-active" title="BIM Viewer">⬢</button>
          <button className="sidebar-item" title="Assets">◇</button>
          <button className="sidebar-item" title="Work Orders">✚</button>
        </div>
      </aside>

      <div className="workspace-main">
        {/* Topbar */}
        <header className="topbar">
          <div className="text-slate-200 text-sm font-semibold tracking-wide">
            BeeCarbonat <span className="text-slate-400 font-normal">Workspace</span>
          </div>
          <div className="topbar-search">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher équipements, capteurs..." 
              className="search-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="topbar-nav">
            <button className="topbar-tab">Analyse Carbone</button>
            <button className="topbar-tab topbar-tab-active">Jumeau Numérique</button>
            <button className="topbar-tab">GMAO</button>
          </div>
        </header>

        <div className="workspace-content">
          {/* Left Tree */}
          <div className="workspace-tree flex flex-col bg-[#0b1220]">
            <div className="inspector-header flex items-center text-slate-300">
              <Layers size={14} className="text-cyan-400 mr-2" /> Modèle IFC & spatial
            </div>
            <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
              {renderTree(DEMO_TREE, 0)}
            </div>
          </div>

          {/* Central 3D Viewport */}
          <div className="workspace-viewport">
            <div className="w-full h-10 border-b border-white/10 bg-[#0f1420] flex items-center px-4 text-xs font-mono text-cyan-400">
              <Box size={14} className="mr-2" /> {selectedElement?.name || "Vue Globale"} 
            </div>
            
            <div className="viewport-3d">
              <IFCViewport3D 
                onPickAsset={(id) => setSelectedId(id)} 
                viewMode={viewMode}
                selectedId={selectedId}
              />

              <div className="viewport-hud">
                <div className="flex justify-between w-24 mb-1"><span className="text-slate-500">FPS</span> <span className="font-bold">60</span></div>
                <div className="flex justify-between w-24 mb-1"><span className="text-slate-500">Tris</span> <span className="font-bold">14k</span></div>
                <div className="flex justify-between w-24"><span className="text-slate-500">Mode</span> <span className="font-bold uppercase">{viewMode}</span></div>
              </div>

              <div className="viewport-toolbar">
                <div className="toolbar-section">
                  <button className="tool-btn tool-btn-active">
                    <Move3d size={16} className="mb-1" /> Orbite
                  </button>
                  <button className="tool-btn">
                    <ZoomIn size={16} className="mb-1" /> Zoom
                  </button>
                </div>
                <div className="w-px bg-white/10 mx-1" />
                <div className="toolbar-section">
                  <button className={`tool-btn ${viewMode === "shaded" ? "tool-btn-active" : ""}`} onClick={() => setViewMode("shaded")}>
                    <Box size={16} className="mb-1" /> Solide
                  </button>
                  <button className={`tool-btn ${viewMode === "xray" ? "tool-btn-active" : ""}`} onClick={() => setViewMode("xray")}>
                    <Eye size={16} className="mb-1" /> X-Ray
                  </button>
                  <button className={`tool-btn ${viewMode === "wireframe" ? "tool-btn-active" : ""}`} onClick={() => setViewMode("wireframe")}>
                    <Grid3x3 size={16} className="mb-1" /> Filaire
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Inspector */}
          <div className="workspace-inspector bg-[#0a0f1a]">
            <div className="inspector-header text-slate-300 flex items-center">
              <Cpu size={14} className="text-cyan-400 mr-2" /> Inspecteur de Propriétés
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {selectedElement && selectedElement.type === "asset" ? (
                <div className="p-4">
                  <div className="text-cyan-300 font-sans font-bold text-sm mb-4 pb-2 border-b border-white/10">
                    {selectedElement.name}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="property-row">
                      <span className="property-label">GUID</span>
                      <span className="property-value font-mono text-[10px] break-all max-w-[140px] text-slate-400">{selectedElement.guid}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Type</span>
                      <span className="property-value">{selectedElement.assetType || "Équipement"}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Zone</span>
                      <span className="property-value">{selectedElement.zone || "—"}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Matériau</span>
                      <span className="property-value">{selectedElement.material || "Inconnu"}</span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Statut GMAO</span>
                      {selectedElement.status === "warning" ? (
                         <span className="property-value text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full font-medium">Alerte Critique</span>
                      ) : (
                         <span className="property-value text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-medium">Opérationnel</span>
                      )}
                    </div>
                    <div className="property-row">
                      <span className="property-label">Température</span>
                      <span className={`property-value font-mono font-bold ${selectedElement.status === "warning" ? "text-red-400" : "text-emerald-400"}`}>
                        {selectedElement.temperature || "--"} °C
                      </span>
                    </div>
                    <div className="property-row">
                      <span className="property-label">Débit / Pression</span>
                      <span className="property-value font-mono">{selectedElement.airflow || "--"} CFM</span>
                    </div>
                  </div>

                  <button className="mt-6 w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg py-2 text-xs font-bold transition-colors uppercase tracking-wider">
                    <Wrench size={14} /> Créer Ordre de Travail
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-sm mt-10">
                  <Box size={32} className="mx-auto mb-3 opacity-20" />
                  Sélectionnez un équipement ou une zone 3D pour inspecter ses propriétés et capteurs IoT.
                </div>
              )}
            </div>

            <div className="alerts-panel">
              <div className="inspector-header text-slate-300 border-t border-b border-white/10 flex items-center justify-between">
                <span>Alertes Actives</span>
                <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-[10px] font-bold">1 Critique</span>
              </div>
              <div className="p-3">
                <div className="alert-card flex gap-3 cursor-pointer hover:bg-red-500/10 transition-colors">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <div className="font-semibold mb-1 text-red-300">Anomalie Thermique L3</div>
                    <div className="text-red-400/70 text-[10px] font-mono">Poutre Froide CB-301 (+4.4°C)</div>
                    <div className="text-slate-500 text-[9px] mt-1">Il y a 4 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Status Bar */}
        <footer className="status-bar">
          <div><span className="status-dot animate-pulse"></span> BACnet Live Synced</div>
          <div>Modèles chargés : 1 (Mode Démo BEM)</div>
          <div className="ml-auto flex gap-4">
            <span>WebGL 2.0 (Three.js)</span>
            <span>IFC-4.3 Spatial Graph</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
