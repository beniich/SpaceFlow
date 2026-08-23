import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { 
  Box, 
  MapPin, 
  Plus, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Camera, 
  Maximize2, 
  Layers,
  AlertTriangle,
  Info,
  Wrench,
  CheckCircle2,
  X,
  Compass
} from 'lucide-react';

const CATEGORY_COLORS = {
  incident: { hex: 0xef4444, css: '#ef4444', text: 'text-red-400', bg: 'bg-red-500' },
  maintenance: { hex: 0xf59e0b, css: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500' },
  observation: { hex: 0x06b6d4, css: '#06b6d4', text: 'text-cyan-400', bg: 'bg-cyan-500' },
  validation: { hex: 0x10b981, css: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500' },
};

export default function ModelViewer3D({ 
  elements = [], 
  selectedElement, 
  onSelectElement,
  annotations = [],
  selectedAnnotationId,
  onSelectAnnotation,
  onTriggerAddAnnotation,
  isPlacingMode,
  setIsPlacingMode,
  focusedAnnotation
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const buildingGroupRef = useRef(null);
  const annotationsGroupRef = useRef(null);
  const meshMapRef = useRef(new Map());
  const annotationPinsMapRef = useRef(new Map());
  const ghostMarkerRef = useRef(null);

  // Screen 2D projected annotation coordinates state for interactive HTML overlays
  const [screenAnnotations, setScreenAnnotations] = useState([]);
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showLegend, setShowLegend] = useState(false);

  // Animation target for smooth camera movement
  const cameraTargetRef = useRef(null);

  // Focus on specific 3D coordinates
  const focusOnPosition = useCallback((targetPos) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    cameraTargetRef.current = {
      targetPos: new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
      camPos: new THREE.Vector3(targetPos.x + 8, targetPos.y + 6, targetPos.z + 8),
      progress: 0
    };
  }, []);

  // Handle programmatic focus trigger from parent (when user clicks annotation in list)
  useEffect(() => {
    if (focusedAnnotation?.position) {
      focusOnPosition(focusedAnnotation.position);
    }
  }, [focusedAnnotation, focusOnPosition]);

  // Initialisation Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2(0x090d16, 0.015);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 14, 20);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(15, 25, 20);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.3);
    dirLight2.position.set(-15, 10, -15);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x3b82f6, 0.4, 30);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 3. Grid floor & ground
    const grid = new THREE.GridHelper(40, 40, 0x334155, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.01; // Don't go below floor
    controls.minDistance = 3;
    controls.maxDistance = 80;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // 5. Building elements group
    const buildingGroup = new THREE.Group();
    buildingGroupRef.current = buildingGroup;
    scene.add(buildingGroup);

    // 6. Annotations group
    const annotationsGroup = new THREE.Group();
    annotationsGroupRef.current = annotationsGroup;
    scene.add(annotationsGroup);

    // 7. Ghost placement marker (ring on hover when isPlacingMode is true)
    const ghostGeom = new THREE.RingGeometry(0.2, 0.35, 32);
    const ghostMat = new THREE.MeshBasicMaterial({ 
      color: 0x06b6d4, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.8 
    });
    const ghostMesh = new THREE.Mesh(ghostGeom, ghostMat);
    ghostMesh.rotation.x = -Math.PI / 2;
    ghostMesh.visible = false;
    scene.add(ghostMesh);
    ghostMarkerRef.current = ghostMesh;

    // 8. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation if camera target exists
      if (cameraTargetRef.current) {
        const ct = cameraTargetRef.current;
        ct.progress += 0.04;
        camera.position.lerp(ct.camPos, 0.08);
        controls.target.lerp(ct.targetPos, 0.08);

        if (ct.progress >= 1) {
          cameraTargetRef.current = null;
        }
      }

      controls.update();

      // Animate pin bobbing / pulsing
      if (annotationsGroupRef.current) {
        annotationsGroupRef.current.children.forEach((pinGroup) => {
          const isSelected = pinGroup.userData?.id === selectedAnnotationId;
          const headMesh = pinGroup.getObjectByName('pinHead');
          const ringMesh = pinGroup.getObjectByName('pinRing');

          if (headMesh) {
            const bobOffset = isSelected 
              ? Math.sin(elapsedTime * 4) * 0.12 
              : Math.sin(elapsedTime * 2 + (pinGroup.userData?.index || 0)) * 0.05;
            headMesh.position.y = 0.9 + bobOffset;
          }
          if (ringMesh) {
            ringMesh.rotation.z = elapsedTime * 2;
            const scale = 1 + (Math.sin(elapsedTime * 3) * 0.15);
            ringMesh.scale.set(scale, scale, 1);
          }
        });
      }

      renderer.render(scene, camera);

      // Project 3D annotation positions to 2D screen coordinates for HTML overlay badges
      if (containerRef.current && showAnnotations && annotations.length > 0) {
        const rect = containerRef.current.getBoundingClientRect();
        const screenCoords = annotations.map((anno, index) => {
          const pos = new THREE.Vector3(anno.position.x, anno.position.y + 1.1, anno.position.z);
          pos.project(camera);

          // Check if behind camera
          const isVisible = pos.z < 1 && pos.x >= -1.1 && pos.x <= 1.1 && pos.y >= -1.1 && pos.y <= 1.1;

          const screenX = ((pos.x + 1) / 2) * rect.width;
          const screenY = ((-pos.y + 1) / 2) * rect.height;

          return {
            ...anno,
            index: index + 1,
            screenX,
            screenY,
            isVisible
          };
        });

        setScreenAnnotations(screenCoords);
      } else {
        setScreenAnnotations([]);
      }
    };
    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      scene.clear();

      if (rendererRef.current?.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update Building Meshes when elements change
  useEffect(() => {
    const buildingGroup = buildingGroupRef.current;
    if (!buildingGroup) return;

    // Clear old meshes
    while (buildingGroup.children.length > 0) {
      const obj = buildingGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      buildingGroup.remove(obj);
    }
    meshMapRef.current.clear();

    elements.forEach((el, index) => {
      let geometry;
      let color = 0x64748b;

      if (el.type === 'IfcWallStandardCase') color = 0x94a3b8;
      else if (el.type === 'IfcWindow') color = 0x38bdf8;
      else if (el.type === 'IfcDoor') color = 0xb45309;
      else if (el.type === 'IfcFlowTerminal') {
        color = el.asset?.healthScore < 50 ? 0xef4444 : el.asset?.healthScore < 80 ? 0xf59e0b : 0x10b981;
      } else if (el.type === 'IfcSpace') {
        color = 0x1e293b;
      }

      if (el.type === 'IfcWallStandardCase') {
        geometry = new THREE.BoxGeometry(0.4, 3, 5);
      } else if (el.type === 'IfcWindow') {
        geometry = new THREE.BoxGeometry(0.1, 1.2, 1.8);
      } else if (el.type === 'IfcDoor') {
        geometry = new THREE.BoxGeometry(0.15, 2.1, 0.9);
      } else if (el.type === 'IfcFlowTerminal') {
        geometry = new THREE.CylinderGeometry(0.35, 0.35, 0.7, 16);
      } else {
        geometry = new THREE.BoxGeometry(2, 2, 2);
      }

      const material = el.type === 'IfcSpace'
        ? new THREE.MeshPhongMaterial({
            color,
            transparent: true,
            opacity: 0.08,
            wireframe: true
          })
        : new THREE.MeshPhongMaterial({
            color,
            shininess: 80,
            transparent: el.type === 'IfcWindow',
            opacity: el.type === 'IfcWindow' ? 0.55 : 1.0,
          });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const col = index % 4;
      const row = Math.floor(index / 4) % 3;
      const floor = Math.floor(index / 12);

      mesh.position.set(col * 4 - 6, floor * 3.5 + 1.5, row * 4 - 4);
      mesh.userData = { 
        id: el.id, 
        ifcId: el.ifcId, 
        name: el.name, 
        type: el.type,
        isBimElement: true
      };

      // Clean architectural edges
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges, 
        new THREE.LineBasicMaterial({ color: 0x090d16, transparent: true, opacity: 0.7 })
      );
      mesh.add(line);

      buildingGroup.add(mesh);
      meshMapRef.current.set(el.id, mesh);
    });
  }, [elements]);

  // Update Highlight on Selected BIM element
  useEffect(() => {
    meshMapRef.current.forEach((mesh, id) => {
      if (id === selectedElement) {
        mesh.material.emissive?.setHex(0x06b6d4); // Cyan emissive
      } else {
        mesh.material.emissive?.setHex(0x000000);
      }
    });
  }, [selectedElement]);

  // Render 3D Annotation Pins in the scene
  useEffect(() => {
    const annotationsGroup = annotationsGroupRef.current;
    if (!annotationsGroup) return;

    // Clear old pin objects
    while (annotationsGroup.children.length > 0) {
      const obj = annotationsGroup.children[0];
      sceneRef.current?.remove(obj);
      annotationsGroup.remove(obj);
    }
    annotationPinsMapRef.current.clear();

    if (!showAnnotations) return;

    annotations.forEach((anno, index) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(anno.position.x, anno.position.y, anno.position.z);
      pinGroup.userData = { id: anno.id, index, isAnnotationPin: true };

      const catStyle = CATEGORY_COLORS[anno.category] || CATEGORY_COLORS.observation;
      const isSelected = anno.id === selectedAnnotationId;

      // 1. Ground contact ring
      const ringGeom = new THREE.RingGeometry(0.18, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: catStyle.hex, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.name = 'pinRing';
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.02;
      pinGroup.add(ringMesh);

      // 2. Vertical Pin needle / stem
      const stemGeom = new THREE.CylinderGeometry(0.04, 0.02, 0.8, 12);
      const stemMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.7, 
        roughness: 0.2 
      });
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      stemMesh.position.y = 0.4;
      pinGroup.add(stemMesh);

      // 3. Spherical glowing pin head
      const headGeom = new THREE.SphereGeometry(0.24, 20, 20);
      const headMat = new THREE.MeshStandardMaterial({
        color: catStyle.hex,
        emissive: catStyle.hex,
        emissiveIntensity: isSelected ? 0.9 : 0.5,
        roughness: 0.1,
        metalness: 0.3
      });
      const headMesh = new THREE.Mesh(headGeom, headMat);
      headMesh.name = 'pinHead';
      headMesh.position.y = 0.85;
      pinGroup.add(headMesh);

      // 4. Subtle beacon light for critical or selected items
      if (isSelected || anno.priority === 'critical') {
        const beaconLight = new THREE.PointLight(catStyle.hex, 1.2, 3);
        beaconLight.position.y = 0.9;
        pinGroup.add(beaconLight);
      }

      annotationsGroup.add(pinGroup);
      annotationPinsMapRef.current.set(anno.id, pinGroup);
    });
  }, [annotations, selectedAnnotationId, showAnnotations]);

  // Click & Raycast Interaction Handler
  const handlePointerDown = useCallback((event) => {
    if (!rendererRef.current || !cameraRef.current || !buildingGroupRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // If placing mode is active: raycast onto building meshes or floor
    if (isPlacingMode) {
      const intersects = raycaster.intersectObjects(buildingGroupRef.current.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const hitMesh = hit.object;
        const targetElement = hitMesh.userData?.isBimElement 
          ? {
              elementId: hitMesh.userData.id,
              elementName: hitMesh.userData.name,
              elementType: hitMesh.userData.type
            }
          : {
              elementId: '',
              elementName: '',
              elementType: ''
            };

        onTriggerAddAnnotation({
          x: hit.point.x,
          y: hit.point.y,
          z: hit.point.z,
          ...targetElement
        });
        setIsPlacingMode(false);
      } else {
        // Fallback: raycast onto ground plane y=0
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);
        if (intersectPoint) {
          onTriggerAddAnnotation({
            x: intersectPoint.x,
            y: intersectPoint.y,
            z: intersectPoint.z,
            elementId: '',
            elementName: 'Zone Générale / Sol',
            elementType: 'IfcSpace'
          });
          setIsPlacingMode(false);
        }
      }
      return;
    }

    // Normal mode: check if an annotation pin was clicked first
    if (showAnnotations && annotationsGroupRef.current) {
      const pinIntersects = raycaster.intersectObjects(annotationsGroupRef.current.children, true);
      if (pinIntersects.length > 0) {
        // Find top-level pin group
        let hitObj = pinIntersects[0].object;
        while (hitObj.parent && hitObj.parent !== annotationsGroupRef.current) {
          hitObj = hitObj.parent;
        }
        if (hitObj.userData?.id) {
          onSelectAnnotation(hitObj.userData.id);
          return;
        }
      }
    }

    // Otherwise check building element selection
    const intersects = raycaster.intersectObjects(buildingGroupRef.current.children, true);
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      if (clickedMesh.userData?.id) {
        onSelectElement(clickedMesh.userData.id);
      }
    }
  }, [isPlacingMode, showAnnotations, onSelectAnnotation, onSelectElement, onTriggerAddAnnotation, setIsPlacingMode]);

  // Pointer Move Handler for Ghost Marker when placing
  const handlePointerMove = useCallback((event) => {
    if (!rendererRef.current || !cameraRef.current || !ghostMarkerRef.current) return;

    if (!isPlacingMode) {
      ghostMarkerRef.current.visible = false;
      return;
    }

    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    if (buildingGroupRef.current) {
      const intersects = raycaster.intersectObjects(buildingGroupRef.current.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0];
        ghostMarkerRef.current.position.copy(hit.point);
        ghostMarkerRef.current.visible = true;
        return;
      }
    }

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);
    if (intersectPoint) {
      ghostMarkerRef.current.position.copy(intersectPoint);
      ghostMarkerRef.current.visible = true;
    }
  }, [isPlacingMode]);

  // View preset angles
  const setCameraPreset = (preset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const controls = controlsRef.current;
    controls.target.set(0, 3, 0);

    if (preset === 'iso') {
      cameraTargetRef.current = {
        camPos: new THREE.Vector3(16, 14, 20),
        targetPos: new THREE.Vector3(0, 3, 0),
        progress: 0
      };
    } else if (preset === 'front') {
      cameraTargetRef.current = {
        camPos: new THREE.Vector3(0, 5, 24),
        targetPos: new THREE.Vector3(0, 3, 0),
        progress: 0
      };
    } else if (preset === 'top') {
      cameraTargetRef.current = {
        camPos: new THREE.Vector3(0.01, 28, 0.01),
        targetPos: new THREE.Vector3(0, 0, 0),
        progress: 0
      };
    }
  };

  return (
    <div 
      className={`relative w-full h-[550px] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl select-none ${
        isPlacingMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* 3D Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        onClick={handlePointerDown}
        onMouseMove={handlePointerMove}
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 p-1.5 rounded-lg shadow-lg font-mono text-xs">
          <button
            onClick={() => setIsPlacingMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-md font-bold flex items-center gap-1.5 transition ${
              isPlacingMode
                ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-400/70 shadow-md animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950'
            }`}
            title="Cliquez sur le modèle pour poser une annotation 3D"
          >
            <Plus className="w-3.5 h-3.5" />
            {isPlacingMode ? 'Ciblez la surface...' : 'Placer Annotation'}
          </button>

          <div className="h-4 w-px bg-zinc-700 mx-0.5" />

          <button
            onClick={() => setShowAnnotations(prev => !prev)}
            className={`p-1.5 rounded-md transition flex items-center gap-1.5 ${
              showAnnotations 
                ? 'bg-zinc-800 text-cyan-400 hover:bg-zinc-700' 
                : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
            }`}
            title={showAnnotations ? 'Masquer annotations' : 'Afficher annotations'}
          >
            {showAnnotations ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-[11px] font-bold">({annotations.length})</span>
          </button>

          <button
            onClick={() => setShowLegend(prev => !prev)}
            className={`p-1.5 rounded-md transition flex items-center gap-1 ${
              showLegend ? 'bg-cyan-500/20 text-cyan-300' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            title="Afficher/Masquer la légende"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Right Camera Presets */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 p-1.5 rounded-lg shadow-lg font-mono text-xs text-zinc-300">
          <button
            onClick={() => setCameraPreset('iso')}
            className="px-2 py-1 hover:bg-zinc-800 rounded text-[10px] text-zinc-300 hover:text-white transition"
            title="Vue Isométrique"
          >
            Iso
          </button>
          <button
            onClick={() => setCameraPreset('front')}
            className="px-2 py-1 hover:bg-zinc-800 rounded text-[10px] text-zinc-300 hover:text-white transition"
            title="Vue Façade"
          >
            Face
          </button>
          <button
            onClick={() => setCameraPreset('top')}
            className="px-2 py-1 hover:bg-zinc-800 rounded text-[10px] text-zinc-300 hover:text-white transition"
            title="Vue Dessus"
          >
            Top
          </button>
          <button
            onClick={() => setCameraPreset('iso')}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition"
            title="Réinitialiser la caméra"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Placing Mode Active Banner */}
      {isPlacingMode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-950 font-mono text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border-2 border-amber-300">
          <MapPin className="w-4 h-4" />
          Cliquez sur un élément ou une surface pour poser votre annotation
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlacingMode(false);
            }}
            className="ml-2 bg-zinc-950 text-amber-400 p-0.5 rounded-full hover:bg-zinc-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive 2D Screen-Projected Annotation Overlays */}
      {showAnnotations && screenAnnotations.map((anno) => {
        if (!anno.isVisible) return null;
        const isSelected = anno.id === selectedAnnotationId;
        const isHovered = anno.id === hoveredAnnotation?.id;
        const catStyle = CATEGORY_COLORS[anno.category] || CATEGORY_COLORS.observation;

        return (
          <div
            key={anno.id}
            style={{
              left: `${anno.screenX}px`,
              top: `${anno.screenY}px`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute pointer-events-auto z-20 cursor-pointer group"
            onMouseEnter={() => setHoveredAnnotation(anno)}
            onMouseLeave={() => setHoveredAnnotation(null)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAnnotation(anno.id);
              focusOnPosition(anno.position);
            }}
          >
            {/* Pin Badge Button */}
            <div 
              className={`flex items-center justify-center rounded-full font-mono text-[10px] font-bold text-white shadow-xl transition-all duration-200 ${
                isSelected
                  ? 'w-7 h-7 ring-4 ring-white shadow-cyan-500/50 scale-125'
                  : 'w-6 h-6 hover:scale-115 hover:ring-2 hover:ring-white/80'
              } ${catStyle.bg}`}
            >
              {anno.index}
            </div>

            {/* Hover Tooltip / Detail Popover */}
            {(isHovered || isSelected) && (
              <div 
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-lg p-2.5 shadow-2xl font-mono text-xs text-zinc-200 z-30 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[9px] font-bold uppercase ${catStyle.text}`}>
                    #{anno.index} • {anno.category}
                  </span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    anno.status === 'resolved' ? 'bg-emerald-950 text-emerald-300' : 'bg-cyan-950 text-cyan-300'
                  }`}>
                    {anno.status === 'resolved' ? 'Résolu' : 'En cours'}
                  </span>
                </div>
                <h5 className="font-bold text-white text-xs truncate mb-1">{anno.title}</h5>
                {anno.elementName && (
                  <p className="text-[10px] text-zinc-400 truncate mb-1">Élément: {anno.elementName}</p>
                )}
                {anno.description && (
                  <p className="text-[10px] text-zinc-400 line-clamp-2 mb-2">{anno.description}</p>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[9px] text-zinc-400">
                  <span>Par: {anno.author || 'BIM Mgr'}</span>
                  <button
                    onClick={() => {
                      onSelectAnnotation(anno.id);
                      focusOnPosition(anno.position);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 underline font-bold"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Expandable Legend Overlay */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 bg-zinc-900/95 backdrop-blur-md px-3.5 py-3 rounded-xl border border-zinc-700/80 text-[10px] text-zinc-300 font-mono space-y-1.5 shadow-xl max-w-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
            <span className="font-bold text-zinc-100 uppercase tracking-wider">Légende Maquette</span>
            <button onClick={() => setShowLegend(false)} className="text-zinc-500 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-400 rounded-xs" /> IfcWallStandardCase</p>
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-sky-400 rounded-xs" /> IfcWindow</p>
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-600 rounded-xs" /> IfcDoor</p>
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" /> IfcFlowTerminal (Sain)</p>
            <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-xs" /> IfcFlowTerminal (Alerte)</p>
          </div>
          <div className="pt-1.5 border-t border-zinc-800 space-y-1">
            <span className="font-semibold text-zinc-400 text-[9px] uppercase">Annotations 3D:</span>
            <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full" /> Incident / Alerte</p>
            <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full" /> Maintenance / Travaux</p>
            <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-cyan-500 rounded-full" /> Observation / Note</p>
            <p className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full" /> Validation / Conforme</p>
          </div>
        </div>
      )}

      {/* Bottom Right Helper Info */}
      <div className="absolute bottom-4 right-4 bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded border border-zinc-800 text-[10px] text-zinc-400 font-mono flex items-center gap-2 pointer-events-none">
        <span>Rotation: Clic gauche</span>
        <span>•</span>
        <span>Pan: Clic droit</span>
        <span>•</span>
        <span>Zoom: Molette</span>
      </div>
    </div>
  );
}
