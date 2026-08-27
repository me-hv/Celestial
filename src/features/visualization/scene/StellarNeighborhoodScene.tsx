"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { createStarfield } from "./starfield-factory";
import { CameraController } from "./camera-controller";
import {
  createStarNeighborhoodNode,
  updateStarSelectionRing,
  StarMeshNode,
} from "./stellar-neighborhood-renderer";
import { createDistanceShellsMesh } from "./distance-shells-factory";
import { StellarNeighborhoodScale } from "@/lib/astronomy/coordinates/stellar-scale";

export interface StellarNeighborhoodSceneProps {
  stars: CelestialObject[];
  selectedStarId?: string;
  onSelectStar?: (star: CelestialObject) => void;
  showDistanceShells?: boolean;
  showLabels?: boolean;
  focusedStarId?: string;
  className?: string;
}

export function StellarNeighborhoodScene({
  stars,
  selectedStarId,
  onSelectStar,
  showDistanceShells = true,
  showLabels: _showLabels = true,
  focusedStarId,
  className = "",
}: StellarNeighborhoodSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const starNodesMapRef = useRef<Map<string, StarMeshNode>>(new Map());
  const shellsGroupRef = useRef<THREE.Group | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Focus camera when focusedStarId changes
  const handleFocus = useCallback((starId: string) => {
    const node = starNodesMapRef.current.get(starId);
    if (node && cameraControllerRef.current) {
      cameraControllerRef.current.focusOnObject(node.group.position, node.visualRadius);
    }
  }, []);

  useEffect(() => {
    if (focusedStarId) {
      handleFocus(focusedStarId);
    }
  }, [focusedStarId, handleFocus]);

  useEffect(() => {
    // Update selection indicator ring
    starNodesMapRef.current.forEach((node, id) => {
      updateStarSelectionRing(node, id === selectedStarId);
    });
  }, [selectedStarId]);

  useEffect(() => {
    // Toggle distance shells visibility
    if (shellsGroupRef.current) {
      shellsGroupRef.current.visible = showDistanceShells;
    }
  }, [showDistanceShells]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Three.js Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 4000);
    const cameraController = new CameraController(camera, container);
    cameraControllerRef.current = cameraController;

    // Initial camera placement viewing the 25 pc stellar neighborhood
    camera.position.set(0, 60, 110);
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
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);
    } catch {
      setIsSceneReady(true);
      return () => {
        cameraController.dispose();
      };
    }

    // 3. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight("#475569", 0.6);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight("#FDB813", 2.0, 500, 0.1);
    sunPointLight.position.set(0, 0, 0);
    scene.add(sunPointLight);

    // 4. Background Cosmic Starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // 5. Distance Reference Shells
    const shellsGroup = createDistanceShellsMesh();
    shellsGroup.visible = showDistanceShells;
    scene.add(shellsGroup);
    shellsGroupRef.current = shellsGroup;

    // 6. Populate 3D Star Nodes
    const nodes = new Map<string, StarMeshNode>();
    const clickableMeshes: THREE.Mesh[] = [];

    stars.forEach((star) => {
      const starNode = createStarNeighborhoodNode(star);
      nodes.set(star.id, starNode);
      scene.add(starNode.group);
      clickableMeshes.push(starNode.mesh);
    });

    starNodesMapRef.current = nodes;

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
      const intersects = raycaster.intersectObjects(clickableMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const starData = hit.userData.starObject as CelestialObject;
        if (starData && onSelectStar) {
          onSelectStar(starData);
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

      // Gentle stellar twinkle & corona rotation
      nodes.forEach((node) => {
        node.mesh.rotation.y += 0.2 * deltaTime;
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
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
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
  }, [stars, onSelectStar]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[550px] overflow-hidden rounded-xl bg-celestial-void select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label="3D Stellar Neighborhood Interactive Canvas"
    >
      {!isSceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-celestial-void/90 z-20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-celestial-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-celestial-subtle">
              CALIBRATING ASTROMETRIC GRID...
            </p>
          </div>
        </div>
      )}

      {/* Floating 3D Coordinate Reference Tag */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-celestial-subtle bg-celestial-surface/80 px-2.5 py-1 rounded-md border border-celestial-muted/60 backdrop-blur-md pointer-events-none">
        <span>
          Origin: Sun (0, 0, 0) | Frame: ICRS (J2016.5) | Scale: 1 pc ={" "}
          {StellarNeighborhoodScale.UNITS_PER_PARSEC} units
        </span>
      </div>
    </div>
  );
}
