"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  RedshiftShell,
  ObservationalLandmark,
  CosmicHorizon,
} from "@/domain/observable-universe/types";
import {
  createObserverOriginMarker,
  createRedshiftShellsGroup,
  createCMBLastScatteringSphere,
  createParticleHorizonBoundary,
  createLandmarkMarkersGroup,
  equatorialToObservableSceneVector,
} from "./cosmic-horizon-renderer";

export interface ObservableUniverseLayers {
  showRedshiftShells: boolean;
  showCMBSphere: boolean;
  showParticleHorizon: boolean;
  showLandmarkMarkers: boolean;
  showObserverOrigin: boolean;
  showGalacticMask: boolean;
}

export const DEFAULT_OBSERVABLE_LAYERS: ObservableUniverseLayers = {
  showRedshiftShells: true,
  showCMBSphere: true,
  showParticleHorizon: true,
  showLandmarkMarkers: true,
  showObserverOrigin: true,
  showGalacticMask: false,
};

interface ObservableUniverseSceneProps {
  shells: RedshiftShell[];
  landmarks: ObservationalLandmark[];
  horizons?: CosmicHorizon[];
  selectedLandmarkSlug?: string;
  onSelectLandmark?: (landmark: ObservationalLandmark) => void;
  layers?: ObservableUniverseLayers;
}

export const ObservableUniverseScene: React.FC<ObservableUniverseSceneProps> = ({
  shells,
  landmarks,
  selectedLandmarkSlug,
  onSelectLandmark,
  layers = DEFAULT_OBSERVABLE_LAYERS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const shellsGroupRef = useRef<THREE.Group | null>(null);
  const cmbGroupRef = useRef<THREE.Group | null>(null);
  const horizonGroupRef = useRef<THREE.Group | null>(null);
  const landmarksGroupRef = useRef<THREE.Group | null>(null);
  const observerGroupRef = useRef<THREE.Group | null>(null);

  const [hoveredLandmark, setHoveredLandmark] = useState<{
    name: string;
    details: string;
    x: number;
    y: number;
  } | null>(null);

  const handlePointerMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !landmarksGroupRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(landmarksGroupRef.current.children, true);
    if (intersects.length > 0) {
      let hitObj: THREE.Object3D | null = intersects[0].object;
      while (hitObj && !hitObj.userData?.name && hitObj.parent) {
        hitObj = hitObj.parent;
      }

      if (hitObj?.userData?.name) {
        setHoveredLandmark({
          name: hitObj.userData.name,
          details: `z = ${hitObj.userData.redshiftZ} • Distance: ${hitObj.userData.comovingDistanceGly?.toFixed(1)} Gly (Lookback: ${hitObj.userData.lookbackTimeGyr?.toFixed(2)} Gyr)`,
          x: event.clientX - rect.left + 15,
          y: event.clientY - rect.top + 15,
        });
        if (containerRef.current) containerRef.current.style.cursor = "pointer";
        return;
      }
    }

    setHoveredLandmark(null);
    if (containerRef.current) containerRef.current.style.cursor = "default";
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !landmarksGroupRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(landmarksGroupRef.current.children, true);
      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && !hitObj.userData?.slug && hitObj.parent) {
          hitObj = hitObj.parent;
        }

        if (hitObj?.userData?.slug && onSelectLandmark) {
          const match = landmarks.find((l) => l.slug === hitObj?.userData?.slug);
          if (match) {
            onSelectLandmark(match);
          }
        }
      }
    },
    [landmarks, onSelectLandmark]
  );

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a); // Void black
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 160, 480);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 1200;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. Build Layer Groups
    const obsGroup = createObserverOriginMarker();
    observerGroupRef.current = obsGroup;
    scene.add(obsGroup);

    const shellsGroup = createRedshiftShellsGroup(shells);
    shellsGroupRef.current = shellsGroup;
    scene.add(shellsGroup);

    const cmbGroup = createCMBLastScatteringSphere(14000, layers.showGalacticMask);
    cmbGroupRef.current = cmbGroup;
    scene.add(cmbGroup);

    const horizonGroup = createParticleHorizonBoundary(14250);
    horizonGroupRef.current = horizonGroup;
    scene.add(horizonGroup);

    const landmarksGroup = createLandmarkMarkersGroup(landmarks, selectedLandmarkSlug);
    landmarksGroupRef.current = landmarksGroup;
    scene.add(landmarksGroup);

    // 6. Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // 7. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.005;
      controls.update();

      // Subtle slow rotation of distant CMB and horizon spheres
      if (cmbGroup) cmbGroup.rotation.y = time * 0.04;
      if (horizonGroup) horizonGroup.rotation.y = -time * 0.02;

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 8. Event Listeners
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", handlePointerMove);
    domElement.addEventListener("click", handleClick);

    // 9. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousemove", handlePointerMove);
      domElement.removeEventListener("click", handleClick);

      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      controls.dispose();
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [shells, landmarks, layers.showGalacticMask, handlePointerMove, handleClick]);

  // Update Layer Visibility
  useEffect(() => {
    if (observerGroupRef.current) {
      observerGroupRef.current.visible = layers.showObserverOrigin;
    }
    if (shellsGroupRef.current) {
      shellsGroupRef.current.visible = layers.showRedshiftShells;
    }
    if (cmbGroupRef.current) {
      cmbGroupRef.current.visible = layers.showCMBSphere;
    }
    if (horizonGroupRef.current) {
      horizonGroupRef.current.visible = layers.showParticleHorizon;
    }
    if (landmarksGroupRef.current) {
      landmarksGroupRef.current.visible = layers.showLandmarkMarkers;
    }
  }, [layers]);

  // Focus Camera on Selected Landmark
  useEffect(() => {
    if (!selectedLandmarkSlug || !controlsRef.current || !cameraRef.current) return;

    const landmark = landmarks.find((l) => l.slug === selectedLandmarkSlug);
    if (!landmark) return;

    if (landmark.comovingDistanceMpc === 0) {
      controlsRef.current.target.set(0, 0, 0);
      return;
    }

    const pos = equatorialToObservableSceneVector(
      landmark.coordinates?.rightAscensionDeg ?? 0,
      landmark.coordinates?.declinationDeg ?? 0,
      landmark.comovingDistanceMpc
    );

    controlsRef.current.target.lerp(pos, 0.4);
  }, [selectedLandmarkSlug, landmarks]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] bg-slate-950 overflow-hidden select-none"
      data-testid="observable-universe-scene-container"
    >
      {/* Viewport UI Watermark */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-200 font-mono font-bold tracking-wide">
            3D OBSERVABLE UNIVERSE SPACE
          </span>
        </div>
        <span className="text-[11px] text-cyan-400 font-mono px-1 font-semibold">
          Scale: Logarithmic non-linear mapping (Origin = Earth • Boundary = 46.5 Gly)
        </span>
      </div>

      {/* Quick Shell Horizon Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Local (z &lt; 0.1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span>Cosmic Noon (z ~ 2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Cosmic Dawn (z ~ 15)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
          <span>CMB Shell (z = 1089)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          <span>Particle Horizon (46.5 Gly)</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredLandmark && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-2 rounded-lg bg-slate-900/95 border border-cyan-500/50 shadow-xl shadow-cyan-950/50 backdrop-blur-md text-xs font-mono text-slate-200"
          style={{ left: hoveredLandmark.x, top: hoveredLandmark.y }}
        >
          <div className="font-bold text-cyan-300">{hoveredLandmark.name}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{hoveredLandmark.details}</div>
        </div>
      )}
    </div>
  );
};
