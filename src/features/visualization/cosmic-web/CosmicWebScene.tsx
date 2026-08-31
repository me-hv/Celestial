"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import {
  createDistanceShellsGroup,
  createSupergalacticGrid,
  createYouAreHereMarker,
  createCosmicStructure3DObject,
} from "./cosmic-web-renderer";
import {
  cosmicMpcToScene3D,
  supergalacticMpcToScene3D,
} from "@/lib/astronomy/coordinates/cosmic-scale";

export interface CosmicWebLayerVisibility {
  showClusters: boolean;
  showGroups: boolean;
  showSuperclusters: boolean;
  showFilaments: boolean;
  showVoids: boolean;
  showSheets: boolean;
  showDistanceShells: boolean;
  showSupergalacticGrid: boolean;
  showYouAreHere: boolean;
  useSupergalacticCoordinates: boolean;
}

export const DEFAULT_COSMIC_LAYERS: CosmicWebLayerVisibility = {
  showClusters: true,
  showGroups: true,
  showSuperclusters: true,
  showFilaments: true,
  showVoids: true,
  showSheets: true,
  showDistanceShells: true,
  showSupergalacticGrid: true,
  showYouAreHere: true,
  useSupergalacticCoordinates: false,
};

interface CosmicWebSceneProps {
  structures: CosmicStructure[];
  selectedSlug?: string;
  onSelectStructure?: (structure: CosmicStructure) => void;
  layers?: CosmicWebLayerVisibility;
}

export function CosmicWebScene({
  structures,
  selectedSlug,
  onSelectStructure,
  layers = DEFAULT_COSMIC_LAYERS,
}: CosmicWebSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredStructure, setHoveredStructure] = useState<{
    name: string;
    type: string;
    distanceMpc: number;
    x: number;
    y: number;
  } | null>(null);

  // Three.js instances ref
  const sceneContextRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    structureObjects: Map<string, THREE.Object3D>;
    distanceShellsGroup: THREE.Group;
    gridGroup: THREE.Group;
    youAreHereGroup: THREE.Group;
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
  } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep void black

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 3000);
    camera.position.set(0, 180, 260);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Helpers & markers
    const distanceShellsGroup = createDistanceShellsGroup();
    scene.add(distanceShellsGroup);

    const gridGroup = createSupergalacticGrid(350);
    scene.add(gridGroup);

    const youAreHereGroup = createYouAreHereMarker();
    scene.add(youAreHereGroup);

    // Cosmic structures mapping
    const structureObjects = new Map<string, THREE.Object3D>();
    structures.forEach((struct) => {
      const obj = createCosmicStructure3DObject(struct, layers.useSupergalacticCoordinates);
      structureObjects.set(struct.slug, obj);
      scene.add(obj);
    });

    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    sceneContextRef.current = {
      scene,
      camera,
      renderer,
      structureObjects,
      distanceShellsGroup,
      gridGroup,
      youAreHereGroup,
      targetLookAt,
      currentLookAt,
    };

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle pulse on You Are Here beacon
      if (youAreHereGroup) {
        const pulse = 1.0 + Math.sin(elapsedTime * 3.0) * 0.2;
        youAreHereGroup.scale.set(pulse, pulse, pulse);
      }

      // Smooth camera orientation transition
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // Mouse drag interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical(320, Math.PI / 3, Math.PI / 4);

    const updateCameraPos = () => {
      camera.position.setFromSpherical(spherical).add(currentLookAt);
    };
    updateCameraPos();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        spherical.theta -= deltaX * 0.005;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.005));
        updateCameraPos();
      } else {
        // Raycasting for hover tooltip
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

        const interactables: THREE.Object3D[] = [];
        structureObjects.forEach((obj) => interactables.push(obj));

        const intersects = raycaster.intersectObjects(interactables, true);
        if (intersects.length > 0) {
          let topObj = intersects[0].object;
          while (topObj.parent && topObj.parent !== scene) {
            topObj = topObj.parent;
          }
          if (topObj.userData?.name) {
            setHoveredStructure({
              name: topObj.userData.name,
              type: topObj.userData.type,
              distanceMpc: topObj.userData.distanceMpc,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
            container.style.cursor = "pointer";
          }
        } else {
          setHoveredStructure(null);
          container.style.cursor = "default";
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(20, Math.min(800, spherical.radius + e.deltaY * 0.3));
      updateCameraPos();
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

      const interactables: THREE.Object3D[] = [];
      structureObjects.forEach((obj) => interactables.push(obj));

      const intersects = raycaster.intersectObjects(interactables, true);
      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj.parent && topObj.parent !== scene) {
          topObj = topObj.parent;
        }
        if (topObj.userData?.slug && onSelectStructure) {
          const match = structures.find((s) => s.slug === topObj.userData.slug);
          if (match) {
            onSelectStructure(match);
          }
        }
      }
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [structures, layers.useSupergalacticCoordinates, onSelectStructure]);

  // Update layer visibility
  useEffect(() => {
    const ctx = sceneContextRef.current;
    if (!ctx) return;

    ctx.distanceShellsGroup.visible = layers.showDistanceShells;
    ctx.gridGroup.visible = layers.showSupergalacticGrid;
    ctx.youAreHereGroup.visible = layers.showYouAreHere;

    structures.forEach((struct) => {
      const obj = ctx.structureObjects.get(struct.slug);
      if (!obj) return;

      switch (struct.type) {
        case "GALAXY_CLUSTER":
          obj.visible = layers.showClusters;
          break;
        case "GALAXY_GROUP":
          obj.visible = layers.showGroups;
          break;
        case "SUPERCLUSTER":
          obj.visible = layers.showSuperclusters;
          break;
        case "FILAMENT":
          obj.visible = layers.showFilaments;
          break;
        case "VOID":
          obj.visible = layers.showVoids;
          break;
        case "WALL":
        case "SHEET":
          obj.visible = layers.showSheets;
          break;
        default:
          obj.visible = true;
      }
    });
  }, [layers, structures]);

  // Focus on selected structure
  useEffect(() => {
    const ctx = sceneContextRef.current;
    if (!ctx || !selectedSlug) return;

    const struct = structures.find((s) => s.slug === selectedSlug);
    if (!struct) return;

    const [x, y, z] =
      layers.useSupergalacticCoordinates && struct.coordinates.supergalactic
        ? supergalacticMpcToScene3D(
            struct.coordinates.supergalactic.sgxMpc,
            struct.coordinates.supergalactic.sgyMpc,
            struct.coordinates.supergalactic.sgzMpc
          )
        : cosmicMpcToScene3D(
            struct.coordinates.galactocentricCartesianMpc.xMpc,
            struct.coordinates.galactocentricCartesianMpc.yMpc,
            struct.coordinates.galactocentricCartesianMpc.zMpc
          );

    ctx.targetLookAt.set(x, y, z);
  }, [selectedSlug, structures, layers.useSupergalacticCoordinates]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover tooltip */}
      {hoveredStructure && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-cyan-500/30 bg-slate-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur-md"
          style={{
            left: `${hoveredStructure.x}px`,
            top: `${hoveredStructure.y - 12}px`,
          }}
        >
          <p className="font-semibold text-white font-mono">{hoveredStructure.name}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300 font-mono">
            <span className="text-cyan-400">{hoveredStructure.type.replace(/_/g, " ")}</span>
            <span>•</span>
            <span>{hoveredStructure.distanceMpc.toFixed(1)} Mpc</span>
          </div>
        </div>
      )}

      {/* Viewport orientation watermark */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-col gap-1 rounded-lg bg-slate-900/60 p-2.5 text-[11px] text-slate-400 backdrop-blur-sm border border-white/5 font-mono">
        <span className="text-white font-semibold flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          COSMIC WEB 3D SPACE
        </span>
        <span>Scale: 1 Mpc = 2.0 scene units</span>
        <span>
          Reference:{" "}
          {layers.useSupergalacticCoordinates
            ? "Supergalactic (SGL, SGB)"
            : "Galactocentric Megaparsec"}
        </span>
      </div>
    </div>
  );
}
