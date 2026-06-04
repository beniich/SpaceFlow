import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface SovereignThreeCubeProps {
  isLightMode?: boolean;
}

export const SovereignThreeCube: React.FC<SovereignThreeCubeProps> = ({ isLightMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;
    
    // Create renderer with alpha transparency for glassmorphism layout
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Configuration of colors depending on state
    const themeColor = isLightMode ? 0x0f4c81 : 0x00dbe9; // Deep Blue vs Cyber Cyan
    const accentColor = isLightMode ? 0xd97736 : 0xa855f7; // Warm Orange vs Purple
    
    // ----------------------------------------------------
    // Create technical 3D wireframe cube
    // ----------------------------------------------------
    const cubeSize = 3.2;
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    
    // Edges for sharp wireframe glowing looks
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: themeColor,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const techCube = new THREE.LineSegments(edges, lineMaterial);
    scene.add(techCube);
    
    // Sub-structure inside (Quantum Node octahedron core)
    const coreGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    
    // Outer floating data rings (Axis-aligned circular orbits)
    const ringGeo1 = new THREE.RingGeometry(2.6, 2.65, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: themeColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);
    
    const ringGeo2 = new THREE.RingGeometry(2.9, 2.95, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: accentColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);
    
    // Floating point particle system (Multidimensional Trajectories)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spawn particles inside a sphere surrounding the node
      const radius = 4 + Math.random() * 3;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: themeColor,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // ----------------------------------------------------
    // Ambient / Point Lights logic
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(themeColor, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // ----------------------------------------------------
    // Mouse Interaction
    // ----------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = width / 2;
    const windowHalfY = height / 2;
    
    const onMouseMove = (event: MouseEvent) => {
      // Get positions relative to canvas container
      const rect = container.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      
      mouseX = (localX - rect.width / 2) * 0.005;
      mouseY = (localY - rect.height / 2) * 0.005;
    };
    
    // Attach listener to container to intercept hover tracking elegantly
    container.addEventListener("mousemove", onMouseMove);
    
    // ----------------------------------------------------
    // Handle Window Resize
    // ----------------------------------------------------
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        const currentHeight = h || 450;
        camera.aspect = w / currentHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(w, currentHeight);
      }
    });
    resizeObserver.observe(container);
    
    // ----------------------------------------------------
    // Animation Loop
    // ----------------------------------------------------
    let animationFrameId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Steady background rotation
      techCube.rotation.y = elapsedTime * 0.15;
      techCube.rotation.x = elapsedTime * 0.08;
      
      // Opposite rotation for core octahedral structure
      coreMesh.rotation.y = -elapsedTime * 0.3;
      coreMesh.rotation.z = elapsedTime * 0.15;
      
      // Floating ring oscillations
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.15;
      
      // Rotate the particle field
      particles.rotation.y = elapsedTime * 0.05;
      
      // Mouse tracking interpolation (Smooth lerping response)
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;
      
      // Apply offset to the scene grid
      scene.rotation.y = targetX * 1.5;
      scene.rotation.x = targetY * 1.5;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // ----------------------------------------------------
    // Cleanup of memory & event listeners on unmount
    // ----------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      
      // Safe disposal of webgl payloads
      geometry.dispose();
      edges.dispose();
      lineMaterial.dispose();
      
      coreGeometry.dispose();
      coreMaterial.dispose();
      
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isLightMode]);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-[450px] z-10 pointer-events-auto rounded-3xl"
      style={{ touchAction: "none" }}
    />
  );
};
