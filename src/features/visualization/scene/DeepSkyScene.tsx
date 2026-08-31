"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { createStarfield } from "./starfield-factory";
import { CameraController } from "./camera-controller";
import {
  createDeepSkyNode,
  updateDeepSkySelectionRing,
  DeepSkyMeshNode,
} from "./deep-sky-renderer";
import { createGalacticPlaneGrid } from "./galactic-plane-factory";

export interface DeepSkySceneProps {
  objects: CelestialObject[];
  selectedObjectId?: string;
  onSelectObject?: (object: CelestialObject) => void;
  showGalacticGrid?: boolean;
  focusedObjectId?: string;
  className?: string;
}

export function DeepSkyScene({
  objects,
  selectedObjectId,
  onSelectObject,
  showGalacticGrid = true,
  focusedObjectId,
  className = "",
}: DeepSkySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const deepSkyNodesMapRef = useRef<Map<string, DeepSkyMeshNode>>(new Map());
  const galacticGridGroupRef = useRef<THREE.Group | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Focus camera when focusedObjectId changes
  const handleFocus = useCallback((objectId: string) => {
    const node = deepSkyNodesMapRef.current.get(objectId);
    if (node && cameraControllerRef.current) {
      cameraControllerRef.current.focusOnObject(node.group.position, node.visualRadius * 2.5);
    }
  }, []);

  useEffect(() => {
    if (focusedObjectId) {
      handleFocus(focusedObjectId);
    }
  }, [focusedObjectId, handleFocus]);

  useEffect(() => {
    // Update selection indicator ring
    deepSkyNodesMapRef.current.forEach((node, id) => {
      updateDeepSkySelectionRing(node, id === selectedObjectId);
    });
  }, [selectedObjectId]);

  useEffect(() => {
    // Toggle Galactic plane reference grid visibility
    if (galacticGridGroupRef.current) {
      galacticGridGroupRef.current.visible = showGalacticGrid;
    }
  }, [showGalacticGrid]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Three.js Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 5000);
    const cameraController = new CameraController(camera, container);
    cameraControllerRef.current = cameraController;

    // Initial camera placement viewing the galactic and extragalactic realm
    camera.position.set(0, 140, 260);
    camera.lookAt(0, 0, 0);

    // 2. Renderer with WebGL Fallback
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      container.appendChild(renderer.domElement);
    } catch {
      setIsSceneReady(true);
      return () => {
        cameraController.dispose();
      };
    }

    // 3. Ambient & Reference Lights
    const ambientLight = new THREE.AmbientLight("#6366F1", 0.65);
    scene.add(ambientLight);

    const centerPointLight = new THREE.PointLight("#E0E7FF", 1.8, 800, 0.05);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    // 4. Background Starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // 5. Galactic Plane & Distance Reference Grids
    const galacticGrid = createGalacticPlaneGrid();
    galacticGrid.visible = showGalacticGrid;
    scene.add(galacticGrid);
    galacticGridGroupRef.current = galacticGrid;

    // 6. Populate Deep Sky Mesh Nodes
    const nodes = new Map<string, DeepSkyMeshNode>();
    const clickableMeshes: Array<THREE.Mesh | THREE.Points> = [];

    objects.forEach((obj) => {
      const node = createDeepSkyNode(obj);
      nodes.set(obj.id, node);
      scene.add(node.group);
      clickableMeshes.push(node.mesh);
    });

    deepSkyNodesMapRef.current = nodes;

    // 7. Raycasting Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isClickAction = false;
    let pointerStart = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerStart = { x: e.clientX, y: e.clientY };
      isClickAction = true;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - pointerStart.x);
      const dy = Math.abs(e.clientY - pointerStart.y);
      if (dx > 4 || dy > 4) {
        isClickAction = false;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isClickAction) return;

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const targetData = (hit.userData.deepSkyObject ||
          hit.parent?.userData?.deepSkyObject) as CelestialObject;
        if (targetData && onSelectObject) {
          onSelectObject(targetData);
        }
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);

    // 8. Resize Listener
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 9. Render & Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Subtle rotation of galaxy discs & nebula glow
      nodes.forEach((node) => {
        node.mesh.rotation.z += 0.1 * deltaTime;
      });

      // Update camera smooth movement
      cameraController.update(deltaTime);

      if (renderer) {
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    setIsSceneReady(true);

    // 10. Cleanup & Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);

      cameraController.dispose();

      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh ||
          child instanceof THREE.Line ||
          child instanceof THREE.Points
        ) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, [objects, onSelectObject]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[550px] overflow-hidden rounded-2xl bg-celestial-void select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label="3D Deep Sky Universe Interactive Canvas"
    >
      {!isSceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-celestial-void/90 z-20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-celestial-violet border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-celestial-subtle">
              CALIBRATING GALACTIC SPATIAL GRID...
            </p>
          </div>
        </div>
      )}

      {/* Coordinate & Reference Orientation Badge */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-celestial-subtle bg-celestial-surface/85 px-3 py-1.5 rounded-lg border border-celestial-muted/80 backdrop-blur-md pointer-events-none">
        <span>
          Frame: ICRS / Galactic (System II) | Origin: Solar Center (0, 0, 0) | Scope: 0.1 kpc — 10
          Mpc
        </span>
      </div>
    </div>
  );
}
