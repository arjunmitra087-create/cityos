import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Building } from '../../types';

interface ThreeCampusSceneProps {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (building: Building) => void;
  activeFilter: 'all' | 'energy' | 'water' | 'crowd' | 'environment' | 'alerts';
  timeOfDay: 'dusk' | 'night' | 'day';
}

export const ThreeCampusScene: React.FC<ThreeCampusSceneProps> = ({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  activeFilter,
  timeOfDay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const beaconMeshesRef = useRef<Map<string, { beacon: THREE.Mesh; halo: THREE.Mesh }>>(new Map());
  const pulseLinesRef = useRef<THREE.Line[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction state
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const sphericalCoords = useRef({ radius: 85, theta: Math.PI / 4, phi: Math.PI / 3.4 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const getBgColor = (mode: 'dusk' | 'night' | 'day') => {
      if (mode === 'night') return 0x050811;
      if (mode === 'dusk') return 0x090f1d;
      return 0x0d172a;
    };
    scene.background = new THREE.Color(getBgColor(timeOfDay));
    scene.fog = new THREE.FogExp2(getBgColor(timeOfDay), 0.007);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x94a3b8, timeOfDay === 'night' ? 0.35 : 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, timeOfDay === 'night' ? 0.6 : 1.2);
    dirLight.position.set(40, 70, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = -60;
    dirLight.shadow.camera.right = 60;
    dirLight.shadow.camera.top = 60;
    dirLight.shadow.camera.bottom = -60;
    scene.add(dirLight);

    // 5. Campus Ground Terrain
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a1120,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Floor
    const grid = new THREE.GridHelper(160, 32, 0x1e293b, 0x0f172a);
    grid.position.y = 0.05;
    scene.add(grid);

    // Inner Green Quads
    const quadGeo = new THREE.PlaneGeometry(36, 36);
    const quadMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.9,
    });
    const quad = new THREE.Mesh(quadGeo, quadMat);
    quad.rotation.x = -Math.PI / 2;
    quad.position.set(0, 0.08, 2);
    scene.add(quad);

    // Walkways & Roads (subtle road ribbons)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x111c30, roughness: 0.6 });
    const hRoad = new THREE.Mesh(new THREE.PlaneGeometry(150, 4), roadMat);
    hRoad.rotation.x = -Math.PI / 2;
    hRoad.position.set(0, 0.06, 0);
    scene.add(hRoad);

    const vRoad = new THREE.Mesh(new THREE.PlaneGeometry(4, 150), roadMat);
    vRoad.rotation.x = -Math.PI / 2;
    vRoad.position.set(0, 0.06, 0);
    scene.add(vRoad);

    // 6. Buildings & IoT Beacons
    buildingMeshesRef.current.clear();
    beaconMeshesRef.current.clear();

    buildings.forEach((b) => {
      const { width: bw, height: bh, depth: bd } = b.dimensions;

      // Determine building accent color based on active filter
      const bColor = getBuildingFilterColor(b, activeFilter);

      const bGeo = new THREE.BoxGeometry(bw, bh, bd);
      const bMat = new THREE.MeshStandardMaterial({
        color: bColor,
        roughness: 0.35,
        metalness: 0.65,
        transparent: true,
        opacity: selectedBuildingId && selectedBuildingId !== b.id ? 0.6 : 0.92,
      });

      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(b.coordinates.x, bh / 2, b.coordinates.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      bMesh.userData = { buildingId: b.id };
      scene.add(bMesh);
      buildingMeshesRef.current.set(b.id, bMesh);

      // Edges highlight
      const edgesGeo = new THREE.EdgesGeometry(bGeo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: b.id === selectedBuildingId ? 0x38bdf8 : 0x1e3a5f,
        linewidth: 1,
      });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      bMesh.add(edges);

      // Rooftop IoT Beacon Antenna
      const beaconColor = b.status === 'critical' ? 0xef4444 : b.status === 'warning' ? 0xf59e0b : 0x10b981;
      const beaconGeo = new THREE.SphereGeometry(0.7, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: beaconColor });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(b.coordinates.x, bh + 1.2, b.coordinates.z);
      scene.add(beacon);

      const haloGeo = new THREE.RingGeometry(0.8, 1.6, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: beaconColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.set(b.coordinates.x, bh + 1.2, b.coordinates.z);
      scene.add(halo);

      beaconMeshesRef.current.set(b.id, { beacon, halo });
    });

    // 7. Fiber Optic IoT Network Lines from Admin Center (b-main) to other buildings
    const centerBuilding = buildings.find(b => b.id === 'b-main') || buildings[0];
    pulseLinesRef.current = [];
    buildings.forEach(b => {
      if (b.id === centerBuilding.id) return;
      const points = [];
      const start = new THREE.Vector3(centerBuilding.coordinates.x, 2, centerBuilding.coordinates.z);
      const mid = new THREE.Vector3(
        (centerBuilding.coordinates.x + b.coordinates.x) / 2,
        Math.max(centerBuilding.dimensions.height, b.dimensions.height) * 0.7 + 6,
        (centerBuilding.coordinates.z + b.coordinates.z) / 2
      );
      const end = new THREE.Vector3(b.coordinates.x, 2, b.coordinates.z);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const curvePoints = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: b.status === 'critical' ? 0xf43f5e : 0x06b6d4,
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      pulseLinesRef.current.push(line);
    });

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Pulsing beacons
      beaconMeshesRef.current.forEach(({ halo }, bId) => {
        const building = buildings.find(b => b.id === bId);
        const speed = building?.status === 'critical' ? 6 : building?.status === 'warning' ? 3.5 : 2;
        const scale = 1 + Math.sin(elapsedTime * speed) * 0.25;
        halo.scale.set(scale, scale, scale);
      });

      // Subtle slow rotation if not dragging
      if (!isDraggingRef.current) {
        sphericalCoords.current.theta += 0.0006;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 9. Resize listener
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Pointer Events for Orbit & Click Selection
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      sphericalCoords.current.theta -= deltaX * 0.006;
      sphericalCoords.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2.05, sphericalCoords.current.phi - deltaY * 0.006)
      );

      updateCameraPosition();
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDraggingRef.current = false;

      // Raycast to check building click
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const meshes = Array.from(buildingMeshesRef.current.values());
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const bId = clickedMesh.userData.buildingId;
        const b = buildings.find(item => item.id === bId);
        if (b) {
          onSelectBuilding(b);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalCoords.current.radius = Math.max(
        35,
        Math.min(140, sphericalCoords.current.radius + e.deltaY * 0.05)
      );
      updateCameraPosition();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      sphericalCoords.current.theta -= deltaX * 0.008;
      sphericalCoords.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, sphericalCoords.current.phi - deltaY * 0.008));
      updateCameraPosition();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };
    domElement.addEventListener('touchstart', handleTouchStart);
    domElement.addEventListener('touchmove', handleTouchMove);
    domElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [buildings, activeFilter, timeOfDay, selectedBuildingId]);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalCoords.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(cameraTarget.current);
  };

  const getBuildingFilterColor = (b: Building, filter: string) => {
    if (filter === 'alerts') {
      if (b.status === 'critical') return 0xef4444;
      if (b.status === 'warning') return 0xf59e0b;
      return 0x1e293b;
    }
    if (filter === 'energy') {
      if (b.energyUsage > 35) return 0xf59e0b;
      if (b.energyUsage < 0) return 0x10b981;
      return 0x0284c7;
    }
    if (filter === 'water') {
      if (b.waterUsage > 75) return 0x0ea5e9;
      return 0x1e3a5f;
    }
    if (filter === 'crowd') {
      if (b.occupancy > 80) return 0xf43f5e;
      if (b.occupancy > 60) return 0xf59e0b;
      return 0x10b981;
    }
    if (filter === 'environment') {
      if (b.aqi > 65) return 0xd97706;
      return 0x059669;
    }
    // Default palette
    const colorHex = b.color.replace('#', '0x');
    return parseInt(colorHex, 16) || 0x3b82f6;
  };

  // Helper buttons to adjust view
  const handleResetCamera = () => {
    sphericalCoords.current = { radius: 85, theta: Math.PI / 4, phi: Math.PI / 3.4 };
    updateCameraPosition();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -15 : 15;
    sphericalCoords.current.radius = Math.max(35, Math.min(140, sphericalCoords.current.radius + delta));
    updateCameraPosition();
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-slate-800 bg-[#070B14]">
      {/* Three.js canvas container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#FFFFFF]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#1E293B] shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
        <span className="font-medium">Three.js Spatial Engine · 12 Dynamic Geometries</span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 bg-[#FFFFFF]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#E2E8F0] shadow-sm">
        <button
          onClick={() => handleZoom('in')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFFFFF] hover:bg-slate-100 text-[#1E293B] text-sm font-bold border border-[#E2E8F0] transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFFFFF] hover:bg-slate-100 text-[#1E293B] text-sm font-bold border border-[#E2E8F0] transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={handleResetCamera}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFFFFF] hover:bg-blue-50 text-[#2563EB] text-[9px] font-mono font-bold border border-[#E2E8F0] transition-colors"
          title="Reset Orbit View"
        >
          RESET
        </button>
      </div>

      {/* Legend overlay */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-4 bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs shadow-xs text-[#1E293B]">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          <span>Nominal</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span>Warning</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse" />
          <span>Critical Anomaly</span>
        </div>
      </div>
    </div>
  );
};
