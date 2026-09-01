"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { calculateHeliocentricPosition, dateToJulianDate } from "@/lib/astronomy/kepler-solver";
import { AdaptiveScaleEngine } from "@/lib/astronomy/scaling";
import { createStarfield } from "./starfield-factory";
import {
  createCelestialBodyNode,
  updateSelectionRingState,
  BodyMeshNode,
} from "./planet-mesh-factory";
import { createHabitableZoneMesh } from "./habitable-zone-mesh-factory";
import { CameraController } from "./camera-controller";

export interface StellarSystemSceneProps {
  systemSlug?: string;
  selectedObjectId?: string;
  onObjectSelect?: (object: CelestialObject) => void;
  showOrbits?: boolean;
  showHabitableZone?: boolean;
  focusedObjectId?: string;
  onResetView?: () => void;
  className?: string;
}

export function StellarSystemScene({
  systemSlug = "solar-system",
  selectedObjectId,
  onObjectSelect,
  showOrbits = true,
  showHabitableZone = false,
  focusedObjectId,
  className = "",
}: StellarSystemSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const nodesMapRef = useRef<Map<string, BodyMeshNode>>(new Map());
  const orbitLinesRef = useRef<THREE.LineLoop[]>([]);
  const hzGroupRef = useRef<THREE.Group | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  // Focus camera when focusedObjectId changes
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
    // Update selection indicators
    nodesMapRef.current.forEach((node, id) => {
      updateSelectionRingState(node, id === selectedObjectId);
    });
  }, [selectedObjectId]);

  useEffect(() => {
    // Toggle orbit line visibility
    orbitLinesRef.current.forEach((line) => {
      line.visible = showOrbits;
    });
  }, [showOrbits]);

  useEffect(() => {
    // Toggle Habitable Zone visibility
    if (hzGroupRef.current) {
      hzGroupRef.current.visible = showHabitableZone;
    }
  }, [showHabitableZone]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Resolve Target System and Member Objects
    const currentSystem = stellarSystemRepo.getBySlug(systemSlug) || stellarSystemRepo.getAll()[0];
    const hostStars = stellarSystemRepo.getHostStars(currentSystem.id);
    const planets = stellarSystemRepo.getPlanets(currentSystem.id);

    const scaleStrategy = AdaptiveScaleEngine.createStrategy(currentSystem, planets);

    // 2. Setup Three.js Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    const cameraController = new CameraController(camera, container);
    cameraControllerRef.current = cameraController;

    // Reset default camera distance based on system scale
    if (scaleStrategy.scaleType === "COMPACT_SYSTEM") {
      camera.position.set(0, 45, 60);
    } else {
      camera.position.set(0, 65, 95);
    }
    camera.lookAt(0, 0, 0);

    // 3. Renderer with Fallback
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
      setIsSceneReady(true);
      return () => {
        cameraController.dispose();
      };
    }

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight("#475569", 0.4);
    scene.add(ambientLight);

    // Add point light from primary central host star
    const starColor =
      hostStars[0]?.physical.meanTemperatureK && hostStars[0].physical.meanTemperatureK < 3700
        ? "#FF6B6B"
        : "#FFFFFF";
    const starLight = new THREE.PointLight(starColor, 2.5, 1200, 0.2);
    starLight.position.set(0, 0, 0);
    scene.add(starLight);

    // 5. Background Cosmic Starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // 6. Circumstellar Habitable Zone
    if (currentSystem.habitableZone) {
      const hzGroup = createHabitableZoneMesh(currentSystem.habitableZone, scaleStrategy);
      hzGroup.visible = showHabitableZone;
      scene.add(hzGroup);
      hzGroupRef.current = hzGroup;
    }

    // 7. Populate Host Stars, Planets, and Orbits
    const currentJulianDate = dateToJulianDate(new Date());
    const nodes = new Map<string, BodyMeshNode>();
    const orbits: THREE.LineLoop[] = [];
    const clickableMeshes: THREE.Mesh[] = [];

    // Place Central Host Stars
    hostStars.forEach((star, index) => {
      const starNode = createCelestialBodyNode(star, scaleStrategy);
      nodes.set(star.id, starNode);
      scene.add(starNode.group);
      clickableMeshes.push(starNode.mesh);
      if (starNode.hitMesh) {
        clickableMeshes.push(starNode.hitMesh);
      }

      if (
        currentSystem.architecture === "BINARY_STAR" ||
        currentSystem.architecture === "MULTIPLE_STAR"
      ) {
        // Binary offset positioning
        const offsetDist = (index === 0 ? -1 : 1) * 3.5;
        starNode.group.position.set(offsetDist, 0, 0);
      } else {
        starNode.group.position.set(0, 0, 0);
      }
    });

    // Place Planetary Bodies & Generate Orbit Lines
    planets.forEach((planet) => {
      const planetNode = createCelestialBodyNode(planet, scaleStrategy);
      nodes.set(planet.id, planetNode);
      scene.add(planetNode.group);
      clickableMeshes.push(planetNode.mesh);
      if (planetNode.hitMesh) {
        clickableMeshes.push(planetNode.hitMesh);
      }

      const semiMajorAxisAu = planet.orbital?.semiMajorAxisAu;
      if (semiMajorAxisAu && semiMajorAxisAu > 0) {
        const visualOrbitRadius = scaleStrategy.distanceToVisual(semiMajorAxisAu);
        const ecc = planet.orbital?.eccentricity || 0;

        // Generate smooth 3D orbit line
        const orbitPoints: THREE.Vector3[] = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          const r = visualOrbitRadius * (1 - ecc * Math.cos(theta));
          orbitPoints.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
        }

        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMat = new THREE.LineBasicMaterial({
          color: "#475569",
          transparent: true,
          opacity: 0.45,
        });
        const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
        orbitLine.visible = showOrbits;
        scene.add(orbitLine);
        orbits.push(orbitLine);

        // Calculate current position along orbit
        const keplerElements = {
          semiMajorAxisAu,
          eccentricity: ecc,
          inclinationDeg: planet.orbital?.inclinationDeg || 0,
          longitudeAscendingNodeDeg: planet.orbital?.longitudeAscendingNodeDeg || 0,
          argumentPeriapsisDeg: planet.orbital?.argumentPeriapsisDeg || 0,
          orbitalPeriodDays: planet.orbital?.orbitalPeriodDays,
        };

        const helio = calculateHeliocentricPosition(keplerElements, currentJulianDate);
        const rVisual = scaleStrategy.distanceToVisual(helio.distanceAu);
        const trueAnomRad = THREE.MathUtils.degToRad(helio.trueAnomalyDeg);

        planetNode.group.position.set(
          Math.cos(trueAnomRad) * rVisual,
          0,
          Math.sin(trueAnomRad) * rVisual
        );
      }
    });

    nodesMapRef.current = nodes;
    orbitLinesRef.current = orbits;

    // 8. Raycasting Click Selection & Focus
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
        const objectData = hit.userData.celestialObject as CelestialObject;
        if (objectData) {
          const targetNode = nodes.get(objectData.id);
          if (targetNode) {
            const type =
              objectData.classification.code === "MOON"
                ? "MOON"
                : objectData.classification.code === "STAR"
                  ? "STAR"
                  : "PLANET";
            cameraController.focusOnObject(targetNode.group.position, targetNode.visualRadius, {
              objectType: type,
            });
          }
          if (onObjectSelect) {
            onObjectSelect(objectData);
          }
        }
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 10. Animation & Rendering Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Axial rotation for planets
      nodes.forEach((node) => {
        node.mesh.rotation.y += 0.3 * deltaTime;
      });

      // Update camera smooth transition
      cameraController.update(deltaTime);

      if (renderer) {
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    setIsSceneReady(true);

    // 11. Cleanup & Disposal
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
  }, [systemSlug, onObjectSelect, showOrbits]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-xl bg-celestial-void select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label="3D Interactive Stellar System Canvas"
    >
      {!isSceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-celestial-void/90 z-20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-celestial-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-celestial-subtle">CALIBRATING SYSTEM METRICS...</p>
          </div>
        </div>
      )}
    </div>
  );
}
