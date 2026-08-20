import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box3, Vector3 } from 'three';
import { Box, Wrench, Shield, AlertTriangle } from 'lucide-react';

export default function ModelViewer3D({ elements = [], selectedElement, onSelectElement }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshMapRef = useRef(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialisation scene / camera / renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(15, 12, 18);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lumieres
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 0.2);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // 3. Grid & sol
    const grid = new THREE.GridHelper(30, 30, 0x475569, 0x334155);
    grid.position.y = -0.01;
    scene.add(grid);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 5. Creation des elements BIM 3D
    meshMapRef.current.clear();
    const group = new THREE.Group();

    elements.forEach((el, index) => {
      let geometry;
      let material;

      // Coloration selon le type IFC
      let color = 0x64748b; // Par defaut gris
      if (el.type === 'IfcWallStandardCase') color = 0x94a3b8;
      else if (el.type === 'IfcWindow') color = 0x38bdf8;
      else if (el.type === 'IfcDoor') color = 0xb45309;
      else if (el.type === 'IfcFlowTerminal') {
        // Equipement CVC / IoT
        color = el.asset?.healthScore < 50 ? 0xef4444 : el.asset?.healthScore < 80 ? 0xf59e0b : 0x10b981;
      } else if (el.type === 'IfcSpace') {
        color = 0x1e293b;
      }

      // Geometrie
      if (el.type === 'IfcWallStandardCase') {
        geometry = new THREE.BoxGeometry(0.4, 3, 5);
      } else if (el.type === 'IfcWindow') {
        geometry = new THREE.BoxGeometry(0.1, 1.2, 1.8);
      } else if (el.type === 'IfcDoor') {
        geometry = new THREE.BoxGeometry(0.15, 2.1, 0.9);
      } else if (el.type === 'IfcFlowTerminal') {
        // Diffuseur ou pompe CVC
        geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
      } else {
        geometry = new THREE.BoxGeometry(2, 2, 2);
      }

      // Transparence pour les espaces
      if (el.type === 'IfcSpace') {
        material = new THREE.MeshPhongMaterial({
          color,
          transparent: true,
          opacity: 0.1,
          wireframe: true
        });
      } else {
        material = new THREE.MeshPhongMaterial({
          color,
          shininess: 100,
          transparent: el.type === 'IfcWindow',
          opacity: el.type === 'IfcWindow' ? 0.5 : 1.0
        });
      }

      const mesh = new THREE.Mesh(geometry, material);

      // Repartir en grille 3D simulee
      const col = index % 4;
      const row = Math.floor(index / 4) % 3;
      const floor = Math.floor(index / 12);

      mesh.position.set(col * 4 - 6, floor * 3.5 + 1.5, row * 4 - 4);
      mesh.userData = { id: el.id, ifcId: el.ifcId, name: el.name, type: el.type };

      // Contour noir pour ameliorer le rendu style architectural
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x0f172a }));
      mesh.add(line);

      group.add(mesh);
      meshMapRef.current.set(el.id, mesh);
    });

    scene.add(group);

    // 6. Raycaster pour selection au clic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        onSelectElement(clickedMesh.userData.id);
      }
    };

    renderer.domElement.addEventListener('click', onClick);

    // 7. Animation loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onClick);
      
      // Deep cleanup to prevent memory leaks (Sprint 0)
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

      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [elements]);

  // Gérer la surbrillance de l'élément sélectionné
  useEffect(() => {
    meshMapRef.current.forEach((mesh, id) => {
      if (id === selectedElement) {
        mesh.material.emissive.setHex(0x3b82f6); // Bleu vif selectionné
      } else {
        mesh.material.emissive.setHex(0x000000);
      }
    });
  }, [selectedElement]);

  return (
    <div className="relative w-full h-[500px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/50 text-[10px] text-slate-300 font-mono space-y-1">
        <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-sky-400 rounded-sm" /> IfcWindow</p>
        <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-600 rounded-sm" /> IfcDoor</p>
        <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> IfcFlowTerminal (Sain)</p>
        <p className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm" /> IfcFlowTerminal (Defaillant)</p>
      </div>
    </div>
  );
}
