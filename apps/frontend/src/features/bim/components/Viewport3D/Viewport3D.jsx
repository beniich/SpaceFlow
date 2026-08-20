import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { buildProceduralBuilding, setupCamera } from "../../lib/sceneFactory";
import "./Viewport3D.css";

const TOOL_ICONS = {
  orbit: "◎", pan: "✥", zoom: "⊕", walk: "↑", look: "👁",
  hud: "⊞", wireframe: "≣", isolate: "⬚", xray: "◌", shaded: "▣",
};

function ToolButton({ id, label, shortcut, active, onClick }) {
  return (
    <button
      className={`bim-tool-btn ${active ? "bim-tool-btn--active" : ""}`}
      onClick={onClick}
      title={`${label} (${shortcut})`}
      aria-label={`${label} (${shortcut})`}
    >
      <span className="bim-tool-btn__icon">{TOOL_ICONS[id] || "?"}</span>
      <span className="bim-tool-btn__label">{label}</span>
    </button>
  );
}

export function Viewport3D({ elements, selectedElement, onPickElement, viewMode, setViewMode }) {
  const mountRef    = useRef(null);
  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const buildingRef = useRef(null);
  const rafRef      = useRef(null);

  const [hudVisible, setHudVisible] = useState(true);
  const [wireframe,  setWireframe]  = useState(false);
  const [xray,       setXray]       = useState(false);
  const [fps,        setFps]        = useState(60);

  // ── Scene init (once) ─────────────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    scene.fog = new THREE.Fog(0x0d1117, 35, 90);

    const camera = setupCamera(w, h);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 5, 0);
    controls.minDistance = 5;
    controls.maxDistance = 70;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;

    sceneRef.current    = scene;
    cameraRef.current   = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    buildingRef.current = buildProceduralBuilding(scene);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        if (hit.object.userData?.assetId) {
          onPickElement?.(hit.object.userData.assetId);
          break;
        }
      }
    };
    renderer.domElement.addEventListener("click", onClick);

    // Reset camera event
    const onReset = () => {
      camera.position.set(22, 16, 22);
      controls.target.set(0, 5, 0);
      controls.update();
    };
    window.addEventListener("bim-reset-camera", onReset);

    // FPS + animation
    let frames = 0;
    let last   = performance.now();
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      frames++;
      const now = performance.now();
      if (now - last > 1000) { setFps(frames); frames = 0; last = now; }
    };
    animate();

    // Resize
    const ro = new ResizeObserver(() => {
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      if (!nw || !nh) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("bim-reset-camera", onReset);
      renderer.domElement.removeEventListener("click", onClick);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => m.dispose());
        }
      });
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Modes (wireframe / x-ray) ─────────────────────────────────────────────
  useEffect(() => {
    if (!buildingRef.current?.group) return;
    buildingRef.current.group.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      obj.material.wireframe = wireframe || viewMode === "wireframe";
      if (xray || viewMode === "xray") {
        obj.material.transparent = true;
        obj.material.opacity = 0.22;
        obj.material.depthWrite = false;
      } else {
        obj.material.transparent = obj.material.userData?.originalTransparent ?? true;
        obj.material.opacity     = obj.material.userData?.originalOpacity     ?? 0.85;
        obj.material.depthWrite  = true;
      }
    });
  }, [viewMode, wireframe, xray]);

  // ── Highlight selected ────────────────────────────────────────────────────
  useEffect(() => {
    buildingRef.current?.equipment?.forEach((mesh) => {
      if (mesh.userData?.assetId === selectedElement) {
        mesh.scale.setScalar(1.08);
        mesh.material.emissiveIntensity = 1.0;
      } else {
        mesh.scale.setScalar(1);
        mesh.material.emissiveIntensity = 0.5;
      }
    });
  }, [selectedElement]);

  // ── Orbit helpers ─────────────────────────────────────────────────────────
  const setOrbit = useCallback(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.enableRotate = true;
    c.enablePan    = false;
    c.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    setViewMode("orbit");
  }, [setViewMode]);

  const setPan = useCallback(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.enableRotate = true;
    c.enablePan    = true;
    c.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE };
    setViewMode("pan");
  }, [setViewMode]);

  const resetCamera = useCallback(() => {
    window.dispatchEvent(new CustomEvent("bim-reset-camera"));
  }, []);

  return (
    <div className="bim-viewport">
      <div ref={mountRef} className="bim-viewport__canvas" />

      {/* HUD */}
      {hudVisible && (
        <div className="bim-viewport__hud">
          <div className="bim-hud-row"><span className="bim-hud-label">FPS</span><span className="bim-hud-value">{fps}</span></div>
          <div className="bim-hud-row"><span className="bim-hud-label">Mode</span><span className="bim-hud-value">{viewMode.toUpperCase()}</span></div>
        </div>
      )}

      {/* Cube gizmo placeholder */}
      <div className="bim-viewport__gizmo" aria-hidden="true">⬡</div>

      {/* Toolbar */}
      <div className="bim-toolbar">
        <div className="bim-toolbar__section">
          <ToolButton id="orbit"  label="Orbit"       shortcut="O" active={viewMode==="orbit"}  onClick={setOrbit} />
          <ToolButton id="pan"    label="Pan"         shortcut="P" active={viewMode==="pan"}    onClick={setPan} />
          <ToolButton id="zoom"   label="Zoom"        shortcut="Z" active={viewMode==="zoom"}   onClick={() => setViewMode("zoom")} />
          <ToolButton id="walk"   label="Walk"        shortcut="W" active={viewMode==="walk"}   onClick={() => setViewMode("walk")} />
          <ToolButton id="look"   label="Look Around" shortcut="L" active={viewMode==="look"}   onClick={() => setViewMode("look")} />
        </div>
        <div className="bim-toolbar__section">
          <ToolButton id="hud"       label="HUD"       shortcut="H" active={hudVisible}            onClick={() => setHudVisible(v => !v)} />
          <ToolButton id="wireframe" label="Wireframe" shortcut="F" active={wireframe}              onClick={() => setWireframe(v => !v)} />
          <ToolButton id="isolate"   label="Isolate"   shortcut="I" active={viewMode==="isolate"}   onClick={() => setViewMode("isolate")} />
          <ToolButton id="xray"      label="X-Ray"     shortcut="X" active={xray}                   onClick={() => setXray(v => !v)} />
          <ToolButton id="shaded"    label="Shaded"    shortcut="S" active={!wireframe && !xray}    onClick={() => { setWireframe(false); setXray(false); setViewMode("orbit"); }} />
        </div>
      </div>
    </div>
  );
}
