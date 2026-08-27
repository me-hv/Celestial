"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { SOLAR_SYSTEM_OBJECTS, SOLAR_SYSTEM_IDS } from "@/lib/data/solar-system-data";
import { calculateHeliocentricPosition, dateToJulianDate } from "@/lib/astronomy/kepler-solver";
import { heliocentricToVisualCoordinates } from "@/lib/astronomy/coordinates";
import { createStarfield } from "./starfield-factory";
import { createOrbitPathLine } from "./orbit-path-factory";
import {
  createCelestialBodyNode,
  updateSelectionRingState,
  BodyMeshNode,
} from "./planet-mesh-factory";
import { CameraController } from "./camera-controller";

export interface SolarSystemSceneProps {
  selectedObjectId?: string;
  onObjectSelect?: (object: CelestialObject) => void;
  showOrbits?: boolean;
  focusedObjectId?: string;
  onResetView?: () => void;
  className?: string;
}

export function SolarSystemScene({
  selectedObjectId,
  onObjectSelect,
  showOrbits = true,
  focusedObjectId,
  className = "",
}: SolarSystemSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const nodesMapRef = useRef<Map<string, BodyMeshNode>>(new Map());
  const orbitLinesRef = useRef<THREE.LineLoop[]>([]);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Focus on selected body when focusedObjectId changes
  const handleFocus = useCallback((objectId: string) => {
    const node = nodesMapRef.current.get(objectId);
    if (node && cameraControllerRef.current) {
      cameraControllerRef.current.focusOnObject(node.group.position, node.visualRadius);
    }
  }, []);

  useEffect(() => {
    if (focusedObjectId) {
      handleFocus(focusedObjectId);
    }
  }, [focusedObjectId, handleFocus]);

  useEffect(() => {
    // Update selection rings
    nodesMapRef.current.forEach((node, id) => {
      updateSelectionRingState(node, id === selectedObjectId);
    });
  }, [selectedObjectId]);

  useEffect(() => {
    // Toggle orbit visibility
    orbitLinesRef.current.forEach((line) => {
      line.visible = showOrbits;
    });
  }, [showOrbits]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    const cameraController = new CameraController(camera, container);
    cameraControllerRef.current = cameraController;

    // 2. Renderer (with graceful fallback if WebGL is unavailable)
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      // Headless / non-WebGL environment fallback
      setIsSceneReady(true);
      return () => {
        cameraController.dispose();
      };
    }

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight("#475569", 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight("#FFFFFF", 2.2, 1000, 0.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 4. Background Starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // 5. Populate Celestial Bodies and Orbits
    const currentJulianDate = dateToJulianDate(new Date());
    const nodes = new Map<string, BodyMeshNode>();
    const orbits: THREE.LineLoop[] = [];
    const clickableMeshes: THREE.Mesh[] = [];

    let earthNode: BodyMeshNode | null = null;
    let moonNode: BodyMeshNode | null = null;

    SOLAR_SYSTEM_OBJECTS.forEach((obj) => {
      const node = createCelestialBodyNode(obj);
      nodes.set(obj.id, node);
      scene.add(node.group);
      clickableMeshes.push(node.mesh);

      if (obj.slug === "earth") earthNode = node;
      if (obj.slug === "moon") moonNode = node;

      // Heliocentric positioning & Keplerian Orbits
      if (
        obj.orbital &&
        obj.orbital.semiMajorAxisAu !== undefined &&
        obj.orbital.eccentricity !== undefined &&
        obj.orbital.inclinationDeg !== undefined &&
        obj.orbital.longitudeAscendingNodeDeg !== undefined &&
        obj.orbital.argumentPeriapsisDeg !== undefined &&
        obj.parentId === SOLAR_SYSTEM_IDS.SUN
      ) {
        const keplerElements = {
          semiMajorAxisAu: obj.orbital.semiMajorAxisAu,
          eccentricity: obj.orbital.eccentricity,
          inclinationDeg: obj.orbital.inclinationDeg,
          longitudeAscendingNodeDeg: obj.orbital.longitudeAscendingNodeDeg,
          argumentPeriapsisDeg: obj.orbital.argumentPeriapsisDeg,
          meanAnomalyEpochDeg: obj.orbital.meanAnomalyDeg,
          orbitalPeriodDays: obj.orbital.orbitalPeriodDays,
          epochJulianDate: obj.orbital.epochJulianDate,
        };

        // Orbit path line
        const orbitLine = createOrbitPathLine(keplerElements);
        orbitLine.visible = showOrbits;
        scene.add(orbitLine);
        orbits.push(orbitLine);

        // Position body along orbit
        const helio = calculateHeliocentricPosition(keplerElements, currentJulianDate);
        const visualPos = heliocentricToVisualCoordinates(helio.xAu, helio.yAu, helio.zAu);
        node.group.position.set(visualPos.x, visualPos.y, visualPos.z);
      } else if (obj.slug === "sun") {
        node.group.position.set(0, 0, 0);
      }
    });

    nodesMapRef.current = nodes;
    orbitLinesRef.current = orbits;

    // 6. Raycasting for object selection
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
        isClickAction = false; // It's a camera drag, not a selection click
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
        const objectData = hit.userData.celestialObject as CelestialObject;
        if (objectData && onObjectSelect) {
          onObjectSelect(objectData);
        }
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Smooth rotate planets
      nodes.forEach((node) => {
        node.mesh.rotation.y += 0.3 * deltaTime;
      });

      // Update hierarchical Moon orbit around Earth
      if (earthNode && moonNode) {
        const lunarDistanceVisual = 1.6;
        const lunarAngle = currentTime * 0.001;
        moonNode.group.position.set(
          earthNode.group.position.x + Math.cos(lunarAngle) * lunarDistanceVisual,
          earthNode.group.position.y,
          earthNode.group.position.z + Math.sin(lunarAngle) * lunarDistanceVisual
        );
      }

      // Update camera smooth transition
      cameraController.update(deltaTime);

      if (renderer) {
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    setIsSceneReady(true);

    // 9. Cleanup & Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);

      cameraController.dispose();

      // Dispose Three.js scene graph
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
  }, [onObjectSelect, showOrbits]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-xl bg-celestial-void select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label="3D Interactive Solar System Canvas"
    >
      {!isSceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-celestial-void/90 z-20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-celestial-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-celestial-subtle">INITIALIZING 3D ENGINE...</p>
          </div>
        </div>
      )}
    </div>
  );
}
