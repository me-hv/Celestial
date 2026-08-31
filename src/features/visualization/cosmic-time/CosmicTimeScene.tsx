"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CosmicEpoch } from "@/domain/cosmic-time/types";
import {
  createPastLightConeGroup,
  createLightConeObjectMarkersGroup,
  LightConeObjectMarker,
} from "./cosmic-time-renderer";

interface CosmicTimeSceneProps {
  epochs: CosmicEpoch[];
  selectedEpochSlug?: string;
  selectedObjectSlug?: string;
  onSelectEpoch?: (slug: string) => void;
  onSelectObject?: (slug: string) => void;
  markers?: LightConeObjectMarker[];
}

export const CosmicTimeScene: React.FC<CosmicTimeSceneProps> = ({
  epochs,
  selectedEpochSlug: _selectedEpochSlug,
  selectedObjectSlug,
  onSelectEpoch: _onSelectEpoch,
  onSelectObject,
  markers = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);

  const [hoveredInfo, setHoveredInfo] = useState<{
    name: string;
    details: string;
    x: number;
    y: number;
  } | null>(null);

  const handlePointerMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    if (markersGroupRef.current) {
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && !hitObj.userData?.name && hitObj.parent) {
          hitObj = hitObj.parent;
        }

        if (hitObj?.userData?.name) {
          setHoveredInfo({
            name: hitObj.userData.name,
            details: `z = ${hitObj.userData.redshiftZ ?? 0} • Lookback: ${(
              hitObj.userData.lookbackGyr ?? 0
            ).toFixed(2)} Gyr`,
            x: event.clientX - rect.left + 15,
            y: event.clientY - rect.top + 15,
          });
          return;
        }
      }
    }

    setHoveredInfo(null);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      if (markersGroupRef.current) {
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);

        if (intersects.length > 0) {
          let hitObj: THREE.Object3D | null = intersects[0].object;
          while (hitObj && !hitObj.userData?.slug && hitObj.parent) {
            hitObj = hitObj.parent;
          }

          if (hitObj?.userData?.slug && onSelectObject) {
            onSelectObject(hitObj.userData.slug);
          }
        }
      }
    },
    [onSelectObject]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      2000
    );
    camera.position.set(0, 120, 420);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 900;
    controls.minDistance = 30;
    controls.target.set(0, -140, 0);
    controlsRef.current = controls;

    // 5. Build Light Cone
    const lightConeGroup = createPastLightConeGroup(epochs);
    scene.add(lightConeGroup);

    // 6. Build Object Markers
    const markersGroup = createLightConeObjectMarkersGroup(markers, selectedObjectSlug);
    markersGroupRef.current = markersGroup;
    scene.add(markersGroup);

    // 7. Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 8. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      controls.update();

      // Subtle rotation
      lightConeGroup.rotation.y = time * 0.05;
      markersGroup.rotation.y = time * 0.05;

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 9. Resize Listener
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

    // 10. Cleanup
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
  }, [epochs, handlePointerMove, handleClick]);

  // Update markers when selection or marker list changes
  useEffect(() => {
    if (!sceneRef.current) return;

    if (markersGroupRef.current) {
      sceneRef.current.remove(markersGroupRef.current);
    }

    const newMarkersGroup = createLightConeObjectMarkersGroup(markers, selectedObjectSlug);
    markersGroupRef.current = newMarkersGroup;
    sceneRef.current.add(newMarkersGroup);
  }, [markers, selectedObjectSlug]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[480px] bg-slate-950 overflow-hidden select-none"
      data-testid="cosmic-time-scene-container"
    >
      {/* Viewport UI Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/80 border border-slate-800 text-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-300 font-mono">3D PAST LIGHT-CONE VIEWPORT</span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono px-1">
          Vertex = Present Observer (z=0) • Base = CMB Decoupling (z=1089)
        </span>
      </div>

      {/* Quick Epoch Color Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Modern</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span>Cosmic Noon</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Early Galaxies</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>First Stars</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
          <span>CMB Decoupling</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredInfo && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-2 rounded-md bg-slate-900/90 border border-cyan-500/50 shadow-lg shadow-cyan-950/50 backdrop-blur-md text-xs font-mono text-slate-200"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y }}
        >
          <div className="font-semibold text-cyan-300">{hoveredInfo.name}</div>
          <div className="text-[11px] text-slate-400">{hoveredInfo.details}</div>
        </div>
      )}
    </div>
  );
};
