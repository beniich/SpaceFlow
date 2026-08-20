import * as THREE from "three";
import { valueToColor } from "./colorRamp";

export function setupCamera(width, height) {
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(22, 16, 22);
  camera.lookAt(0, 5, 0);
  return camera;
}

function makeEquipmentMesh(w, h, d, x, y, z, heatValue) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const color = valueToColor(heatValue);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.5,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.88,
  });
  mat.userData.originalOpacity = 0.88;
  mat.userData.originalTransparent = true;
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  return mesh;
}

export function buildProceduralBuilding(scene) {
  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const dir1 = new THREE.DirectionalLight(0xffffff, 0.8);
  dir1.position.set(15, 25, 10);
  scene.add(dir1);
  const dir2 = new THREE.DirectionalLight(0x6495ff, 0.4);
  dir2.position.set(-10, 20, -10);
  scene.add(dir2);

  // Ground
  const groundGeo = new THREE.PlaneGeometry(50, 50);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a1020, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  scene.add(ground);

  const gridHelper = new THREE.GridHelper(50, 25, 0x1a3a5a, 0x0f1f3a);
  gridHelper.position.y = -0.49;
  scene.add(gridHelper);

  // Building group
  const buildingGroup = new THREE.Group();

  const FLOORS = 5;
  const FLOOR_H = 2.4;
  const WIDTH = 12;
  const DEPTH = 10;

  for (let f = 0; f < FLOORS; f++) {
    const baseY = f * FLOOR_H;

    // Floor slab
    const slabGeo = new THREE.BoxGeometry(WIDTH, 0.15, DEPTH);
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0x2a3a5a, transparent: true, opacity: 0.35, metalness: 0.4, roughness: 0.6,
    });
    const slab = new THREE.Mesh(slabGeo, slabMat);
    slab.position.y = baseY;
    buildingGroup.add(slab);

    // Pillars
    for (let px = 0; px <= 3; px++) {
      for (let pz = 0; pz <= 2; pz++) {
        const xPos = -WIDTH / 2 + (px * WIDTH) / 3;
        const zPos = -DEPTH / 2 + (pz * DEPTH) / 2;
        const pillarGeo = new THREE.BoxGeometry(0.3, FLOOR_H, 0.3);
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x4a6a8a, metalness: 0.8, roughness: 0.3 });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(xPos, baseY + FLOOR_H / 2, zPos);
        buildingGroup.add(pillar);
      }
    }

    // Beams
    for (let pz = 0; pz <= 2; pz++) {
      const zPos = -DEPTH / 2 + (pz * DEPTH) / 2;
      [-WIDTH / 2, WIDTH / 2].forEach(xPos => {
        const beamGeo = new THREE.BoxGeometry(0.25, 0.25, DEPTH);
        const beamMat = new THREE.MeshStandardMaterial({ color: 0x6a8aaa, metalness: 0.6, roughness: 0.4 });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(xPos, baseY + FLOOR_H, zPos);
        buildingGroup.add(beam);
      });
    }

    // Floor edges glow
    const edgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(WIDTH, 0.15, DEPTH));
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.15 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    edges.position.y = baseY;
    buildingGroup.add(edges);
  }

  // Ducts (cylinders)
  for (let f = 0; f < FLOORS; f++) {
    for (let d = 0; d < 3; d++) {
      const ductGeo = new THREE.CylinderGeometry(0.28, 0.28, 3.5, 8);
      const ductMat = new THREE.MeshStandardMaterial({ color: 0x4a5a7a, metalness: 0.7, roughness: 0.4 });
      const duct = new THREE.Mesh(ductGeo, ductMat);
      duct.rotation.z = Math.PI / 2;
      duct.position.set((d - 1) * 3, f * FLOOR_H + 1.2, DEPTH / 2);
      buildingGroup.add(duct);
    }
  }

  scene.add(buildingGroup);

  // Equipment with heatmap
  const ahu1Mesh = makeEquipmentMesh(4, 2, 3, 0, FLOORS * FLOOR_H + 1.2, -3, 22);
  ahu1Mesh.userData = { assetId: "ahu1", heatValue: 22 };
  buildingGroup.add(ahu1Mesh);

  const ahu2Mesh = makeEquipmentMesh(3.5, 1.8, 2.5, 2, 2 * FLOOR_H + 1.5, 1, 78);
  ahu2Mesh.userData = { assetId: "ahu2", heatValue: 78 };
  buildingGroup.add(ahu2Mesh);

  const ahu3Mesh = makeEquipmentMesh(3, 1.5, 2, -2, 3 * FLOOR_H + 1, -2, 55);
  ahu3Mesh.userData = { assetId: "ahu3", heatValue: 55 };
  buildingGroup.add(ahu3Mesh);

  return {
    group: buildingGroup,
    equipment: [ahu1Mesh, ahu2Mesh, ahu3Mesh],
  };
}

export function updateHeatmap(mesh, heatValue) {
  if (!mesh?.material) return;
  const color = valueToColor(heatValue);
  mesh.material.color.copy(color);
  mesh.material.emissive.copy(color);
}
