"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GalacticStructure } from "@/domain/galactic-structure/types";
import { CelestialObject } from "@/domain/celestial-object/types";
import { CameraController } from "../scene/camera-controller";
import { createStarfield } from "../scene/starfield-factory";
import {
  createMilkyWayDiskParticles,
  createGalacticBulgeMesh,
  createGalacticBarMesh,
  createSpiralArmsGroup,
  createSunGalacticMarker,
  createGalacticCenterMarker,
  createGalactocentricReferenceGrid,
} from "./milky-way-renderer";
import { GalacticScale } from "@/lib/astronomy/coordinates/galactic-scale";
import { equatorialToGalactocentric } from "@/lib/astronomy/coordinates/galactocentric";

export interface GalacticLayerVisibility {
  showDisk: boolean;
  showPlaneGrid: boolean;
  showBulgeBar: boolean;
  showSpiralArms: boolean;
  showSunPosition: boolean;
  showNearbyStars: boolean;
  showStellarSystems: boolean;
  showDeepSkyObjects: boolean;
}

export interface MilkyWaySceneProps {
  structures: GalacticStructure[];
  nearbyStars?: CelestialObject[];
  stellarSystems?: CelestialObject[];
  deepSkyObjects?: CelestialObject[];
  selectedStructureSlug?: string;
  onSelectStructure?: (structure: GalacticStructure) => void;
  onSelectObject?: (object: CelestialObject) => void;
  layers?: Partial<GalacticLayerVisibility>;
  focusedTargetPosition?: { x: number; y: number; z: number };
  className?: string;
}

export function MilkyWayScene({
  structures,
  nearbyStars = [],
  stellarSystems = [],
  deepSkyObjects = [],
  onSelectStructure,
  onSelectObject,
  layers: externalLayers = {},
  focusedTargetPosition,
  className = "",
}: MilkyWaySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const layers: GalacticLayerVisibility = {
    showDisk: externalLayers.showDisk ?? true,
    showPlaneGrid: externalLayers.showPlaneGrid ?? true,
    showBulgeBar: externalLayers.showBulgeBar ?? true,
    showSpiralArms: externalLayers.showSpiralArms ?? true,
    showSunPosition: externalLayers.showSunPosition ?? true,
    showNearbyStars: externalLayers.showNearbyStars ?? false,
    showStellarSystems: externalLayers.showStellarSystems ?? false,
    showDeepSkyObjects: externalLayers.showDeepSkyObjects ?? false,
  };

  const diskRef = useRef<THREE.Points | null>(null);
  const planeGridRef = useRef<THREE.Group | null>(null);
  const bulgeRef = useRef<THREE.Mesh | null>(null);
  const barRef = useRef<THREE.Mesh | null>(null);
  const armsRef = useRef<THREE.Group | null>(null);
  const sunMarkerRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Group | null>(null);
  const systemsGroupRef = useRef<THREE.Group | null>(null);
  const deepSkyGroupRef = useRef<THREE.Group | null>(null);

  // Focus Camera Handler
  const handleFocus = useCallback((pos: { x: number; y: number; z: number }) => {
    if (cameraControllerRef.current) {
      cameraControllerRef.current.focusOnObject(new THREE.Vector3(pos.x, pos.y, pos.z), 18.0);
    }
  }, []);

  useEffect(() => {
    if (focusedTargetPosition) {
      handleFocus(focusedTargetPosition);
    }
  }, [focusedTargetPosition, handleFocus]);

  // Update Layer Visibilities
  useEffect(() => {
    if (diskRef.current) diskRef.current.visible = layers.showDisk;
    if (planeGridRef.current) planeGridRef.current.visible = layers.showPlaneGrid;
    if (bulgeRef.current) bulgeRef.current.visible = layers.showBulgeBar;
    if (barRef.current) barRef.current.visible = layers.showBulgeBar;
    if (armsRef.current) armsRef.current.visible = layers.showSpiralArms;
    if (sunMarkerRef.current) sunMarkerRef.current.visible = layers.showSunPosition;
    if (starsGroupRef.current) starsGroupRef.current.visible = layers.showNearbyStars;
    if (systemsGroupRef.current) systemsGroupRef.current.visible = layers.showStellarSystems;
    if (deepSkyGroupRef.current) deepSkyGroupRef.current.visible = layers.showDeepSkyObjects;
  }, [layers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Three.js Scene & Perspective Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020617");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 6000);
    const cameraController = new CameraController(camera, container);
    cameraControllerRef.current = cameraController;

    // Initial Overview Position looking at the Milky Way disk from above and slight angle
    camera.position.set(0, 180, 240);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
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

    // 3. Ambient & Galactic Lights
    const ambient = new THREE.AmbientLight("#4F46E5", 0.6);
    scene.add(ambient);

    const gcLight = new THREE.PointLight("#FDE68A", 2.2, 800, 0.08);
    gcLight.position.set(0, 0, 0);
    scene.add(gcLight);

    // 4. Background Starfield
    const starfield = createStarfield();
    scene.add(starfield);

    // 5. Milky Way Structural Components
    const disk = createMilkyWayDiskParticles(3500);
    scene.add(disk);
    diskRef.current = disk;

    const bulge = createGalacticBulgeMesh();
    scene.add(bulge);
    bulgeRef.current = bulge;

    const bar = createGalacticBarMesh();
    scene.add(bar);
    barRef.current = bar;

    const arms = createSpiralArmsGroup();
    scene.add(arms);
    armsRef.current = arms;

    const sunMarker = createSunGalacticMarker();
    scene.add(sunMarker);
    sunMarkerRef.current = sunMarker;

    const gcMarker = createGalacticCenterMarker();
    scene.add(gcMarker);

    const grid = createGalactocentricReferenceGrid();
    scene.add(grid);
    planeGridRef.current = grid;

    // 6. Optional Overlay Groups (Stars, Systems, Deep Sky)
    const clickableObjects: Array<THREE.Mesh | THREE.Points> = [];

    // Nearby Stars Overlay
    const starsGroup = new THREE.Group();
    starsGroup.name = "nearby-stars-galactic-overlay";
    nearbyStars.forEach((star) => {
      if (
        star.positional.rightAscensionDeg !== undefined &&
        star.positional.declinationDeg !== undefined &&
        star.positional.distanceLightYears !== undefined
      ) {
        const distPc = star.positional.distanceLightYears / 3.26156;
        const gcCoord = equatorialToGalactocentric(
          star.positional.rightAscensionDeg,
          star.positional.declinationDeg,
          distPc
        );
        const sPos = GalacticScale.galactocentricToScene(gcCoord);
        const sGeo = new THREE.SphereGeometry(0.8, 12, 12);
        const sMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#38BDF8") });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        sMesh.position.set(sPos.x, sPos.y, sPos.z);
        sMesh.userData = { celestialObject: star };
        starsGroup.add(sMesh);
        clickableObjects.push(sMesh);
      }
    });
    starsGroup.visible = layers.showNearbyStars;
    scene.add(starsGroup);
    starsGroupRef.current = starsGroup;

    // Stellar Systems Overlay
    const systemsGroup = new THREE.Group();
    systemsGroup.name = "stellar-systems-galactic-overlay";
    stellarSystems.forEach((sys) => {
      if (
        sys.positional.rightAscensionDeg !== undefined &&
        sys.positional.declinationDeg !== undefined &&
        sys.positional.distanceLightYears !== undefined
      ) {
        const distPc = sys.positional.distanceLightYears / 3.26156;
        const gcCoord = equatorialToGalactocentric(
          sys.positional.rightAscensionDeg,
          sys.positional.declinationDeg,
          distPc
        );
        const sPos = GalacticScale.galactocentricToScene(gcCoord);
        const sGeo = new THREE.SphereGeometry(1.2, 12, 12);
        const sMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#A855F7") });
        const sMesh = new THREE.Mesh(sGeo, sMat);
        sMesh.position.set(sPos.x, sPos.y, sPos.z);
        sMesh.userData = { celestialObject: sys };
        systemsGroup.add(sMesh);
        clickableObjects.push(sMesh);
      }
    });
    systemsGroup.visible = layers.showStellarSystems;
    scene.add(systemsGroup);
    systemsGroupRef.current = systemsGroup;

    // Deep Sky Overlay
    const deepSkyGroup = new THREE.Group();
    deepSkyGroup.name = "deep-sky-galactic-overlay";
    deepSkyObjects.forEach((dso) => {
      if (
        dso.positional.rightAscensionDeg !== undefined &&
        dso.positional.declinationDeg !== undefined &&
        dso.positional.distanceLightYears !== undefined
      ) {
        const distPc = dso.positional.distanceLightYears / 3.26156;
        // If within 30 kpc (inside Milky Way)
        if (distPc <= 30000) {
          const gcCoord = equatorialToGalactocentric(
            dso.positional.rightAscensionDeg,
            dso.positional.declinationDeg,
            distPc
          );
          const sPos = GalacticScale.galactocentricToScene(gcCoord);
          const dGeo = new THREE.RingGeometry(1.2, 2.2, 16);
          dGeo.rotateX(Math.PI / 2);
          const dMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#F43F5E"),
            side: THREE.DoubleSide,
          });
          const dMesh = new THREE.Mesh(dGeo, dMat);
          dMesh.position.set(sPos.x, sPos.y, sPos.z);
          dMesh.userData = { celestialObject: dso };
          deepSkyGroup.add(dMesh);
          clickableObjects.push(dMesh);
        }
      }
    });
    deepSkyGroup.visible = layers.showDeepSkyObjects;
    scene.add(deepSkyGroup);
    deepSkyGroupRef.current = deepSkyGroup;

    // 7. Raycasting Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isClick = false;
    let startPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      startPos = { x: e.clientX, y: e.clientY };
      isClick = true;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - startPos.x, e.clientY - startPos.y) > 4) {
        isClick = false;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isClick) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const targetObj = hit.userData.celestialObject as CelestialObject;
        if (targetObj && onSelectObject) {
          onSelectObject(targetObj);
        }
      } else {
        // Check if clicked near Sun or GC
        const sunPos = GalacticScale.getSunScenePosition();
        const distToSun = raycaster.ray.distanceToPoint(
          new THREE.Vector3(sunPos.x, sunPos.y, sunPos.z)
        );
        const distToGc = raycaster.ray.distanceToPoint(new THREE.Vector3(0, 0, 0));

        if (distToSun < 6.0) {
          const orionSpur = structures.find((s) => s.slug === "orion-spur");
          if (orionSpur && onSelectStructure) onSelectStructure(orionSpur);
        } else if (distToGc < 8.0) {
          const gc = structures.find((s) => s.slug === "galactic-center");
          if (gc && onSelectStructure) onSelectStructure(gc);
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

    // 9. Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Slow majestic rotation of disk & spiral arms
      if (diskRef.current) diskRef.current.rotation.y += 0.015 * dt;
      if (armsRef.current) armsRef.current.rotation.y += 0.015 * dt;

      cameraController.update(dt);

      if (renderer) {
        renderer.render(scene, camera);
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    setIsSceneReady(true);

    return () => {
      cancelAnimationFrame(animId);
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
  }, [nearbyStars, stellarSystems, deepSkyObjects, structures, onSelectObject, onSelectStructure]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[550px] overflow-hidden rounded-2xl bg-celestial-void select-none cursor-grab active:cursor-grabbing ${className}`}
      role="region"
      aria-label="3D Milky Way Galactic Structure Interactive Canvas"
    >
      {!isSceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-celestial-void/90 z-20">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-celestial-cyan border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-celestial-subtle">
              CALIBRATING GALACTOCENTRIC FRAME...
            </p>
          </div>
        </div>
      )}

      {/* Frame Status Badge */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-celestial-subtle bg-celestial-surface/85 px-3 py-1.5 rounded-lg border border-celestial-muted/80 backdrop-blur-md pointer-events-none">
        <span>
          Frame: Galactocentric (R_0 = 8.18 kpc, z_0 = +20.8 pc) | Model: Reid et al. (2019) /
          Bland-Hawthorn (2016)
        </span>
      </div>
    </div>
  );
}
