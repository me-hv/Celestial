"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Galaxy } from "@/domain/galaxy/types";
import { equatorialToLocalGroup } from "@/lib/astronomy/coordinates/local-group";
import { LocalGroupScale } from "@/lib/astronomy/coordinates/local-group-scale";
import { GalaxyRenderer } from "../galaxy/galaxy-renderer";

export interface LocalGroupLayerVisibility {
  galaxies: boolean;
  distanceShells: boolean;
  relationshipLines: boolean;
  subgroups: boolean;
  labels: boolean;
  grid: boolean;
}

export interface LocalGroupSceneProps {
  galaxies: Galaxy[];
  selectedGalaxySlug?: string;
  onSelectGalaxy?: (galaxy: Galaxy) => void;
  layers?: LocalGroupLayerVisibility;
  className?: string;
}

const DEFAULT_LAYERS: LocalGroupLayerVisibility = {
  galaxies: true,
  distanceShells: true,
  relationshipLines: true,
  subgroups: true,
  labels: true,
  grid: true,
};

export const LocalGroupScene: React.FC<LocalGroupSceneProps> = ({
  galaxies,
  selectedGalaxySlug,
  onSelectGalaxy,
  layers = DEFAULT_LAYERS,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const galaxyNodesRef = useRef<Map<string, THREE.Group>>(new Map());
  const layersGroupRef = useRef<{
    galaxies: THREE.Group;
    shells: THREE.Group;
    relationships: THREE.Group;
    grid: THREE.Group;
  }>({
    galaxies: new THREE.Group(),
    shells: new THREE.Group(),
    relationships: new THREE.Group(),
    grid: new THREE.Group(),
  });

  // Keep callback refs updated
  const onSelectRef = useRef(onSelectGalaxy);
  onSelectRef.current = onSelectGalaxy;

  // Track selected slug
  const selectedSlugRef = useRef(selectedGalaxySlug);
  selectedSlugRef.current = selectedGalaxySlug;

  // Initialize Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Create Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 3000);
    camera.position.set(0, 140, 220);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 1500;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 4. Layer Groups
    const gGalaxies = new THREE.Group();
    const gShells = new THREE.Group();
    const gRel = new THREE.Group();
    const gGrid = new THREE.Group();

    scene.add(gGrid);
    scene.add(gShells);
    scene.add(gRel);
    scene.add(gGalaxies);

    layersGroupRef.current = {
      galaxies: gGalaxies,
      shells: gShells,
      relationships: gRel,
      grid: gGrid,
    };

    // 5. Starfield Background
    const starfieldCount = 1500;
    const starPositions = new Float32Array(starfieldCount * 3);
    for (let i = 0; i < starfieldCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1800 + Math.random() * 400;
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      color: 0x8899aa,
      transparent: true,
      opacity: 0.5,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // 6. Build Reference Grid
    const gridHelper = new THREE.GridHelper(300, 30, 0x1e3a5f, 0x0f2035);
    gridHelper.position.y = 0;
    gGrid.add(gridHelper);

    // 7. Distance Shells (100 kpc, 250 kpc, 500 kpc, 1 Mpc, 2 Mpc)
    const shellDistancesKpc = [100, 250, 500, 1000, 2000];
    const shellColors = [0x3b82f6, 0x06b6d4, 0x10b981, 0x8b5cf6, 0x64748b];

    shellDistancesKpc.forEach((dKpc, idx) => {
      const radiusUnits = dKpc * LocalGroupScale.KPC_TO_SCENE_UNITS;
      // Equatorial Ring
      const curve = new THREE.EllipseCurve(
        0,
        0,
        radiusUnits,
        radiusUnits,
        0,
        2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(96);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, 0, p.y))
      );
      const ringMat = new THREE.LineBasicMaterial({
        color: shellColors[idx % shellColors.length],
        transparent: true,
        opacity: 0.28,
      });
      gShells.add(new THREE.LineLoop(ringGeo, ringMat));
    });

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Slow orbital rotation for galaxies
      gGalaxies.children.forEach((child) => {
        child.rotation.y += delta * 0.08;
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 9. Raycasting for Galaxy Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(gGalaxies.children, true);

      if (intersects.length > 0) {
        let current: THREE.Object3D | null = intersects[0].object;
        while (current && !current.userData.isGalaxy) {
          current = current.parent;
        }
        if (current && current.userData.galaxy) {
          onSelectRef.current?.(current.userData.galaxy);
        }
      }
    };

    renderer.domElement.addEventListener("click", handleClick);

    // 10. Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Update Galaxies & Relationships when data changes
  useEffect(() => {
    const { galaxies: gGalaxies, relationships: gRel } = layersGroupRef.current;
    gGalaxies.clear();
    gRel.clear();
    galaxyNodesRef.current.clear();

    const galaxyPosMap = new Map<string, THREE.Vector3>();

    // Render Galaxies
    galaxies.forEach((galaxy) => {
      const node = GalaxyRenderer.createGalaxyNode(galaxy);

      // Compute 3D Scene Position
      let scenePos = new THREE.Vector3(0, 0, 0);
      if (galaxy.slug === "milky-way-galaxy") {
        scenePos.set(0, 0, 0);
      } else if (
        galaxy.positional.rightAscensionDeg !== undefined &&
        galaxy.positional.declinationDeg !== undefined
      ) {
        const lgCoords = equatorialToLocalGroup(
          galaxy.positional.rightAscensionDeg,
          galaxy.positional.declinationDeg,
          galaxy.distance.distanceKpc.value
        );
        const mapped = LocalGroupScale.localGroupToScene(lgCoords);
        scenePos.set(mapped.x, mapped.y, mapped.z);
      }

      node.position.copy(scenePos);
      gGalaxies.add(node);
      galaxyNodesRef.current.set(galaxy.slug, node);
      galaxyPosMap.set(galaxy.slug, scenePos);
    });

    // Render Relationship Lines
    galaxies.forEach((galaxy) => {
      const posA = galaxyPosMap.get(galaxy.slug);
      if (!posA || !galaxy.relationships) return;

      galaxy.relationships.forEach((rel) => {
        const posB = galaxyPosMap.get(rel.targetGalaxySlug);
        if (!posB) return;

        const lineGeo = new THREE.BufferGeometry().setFromPoints([posA, posB]);
        let lineColor = 0x38bdf8;
        let lineOpacity = 0.25;

        if (rel.relationshipType === "APPROACHING") {
          lineColor = 0xf43f5e; // Approaching collision (e.g. MW <-> M31)
          lineOpacity = 0.55;
        } else if (rel.relationshipType === "SATELLITE_OF" || rel.relationshipType === "HOST_TO") {
          lineColor = 0x34d399; // Satellite binding
          lineOpacity = 0.35;
        }

        const lineMat = new THREE.LineDashedMaterial({
          color: lineColor,
          transparent: true,
          opacity: lineOpacity,
          dashSize: 1.5,
          gapSize: 0.8,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        gRel.add(line);
      });
    });
  }, [galaxies]);

  // Update Layer Visibilities
  useEffect(() => {
    const {
      galaxies: gGalaxies,
      shells: gShells,
      relationships: gRel,
      grid: gGrid,
    } = layersGroupRef.current;

    gGalaxies.visible = layers.galaxies;
    gShells.visible = layers.distanceShells;
    gRel.visible = layers.relationshipLines;
    gGrid.visible = layers.grid;
  }, [layers]);

  // Smooth Camera Focus on Selection
  useEffect(() => {
    if (!selectedGalaxySlug || !controlsRef.current || !cameraRef.current) return;
    const node = galaxyNodesRef.current.get(selectedGalaxySlug);
    if (!node) return;

    const targetPos = node.position;
    controlsRef.current.target.lerp(targetPos, 0.6);
  }, [selectedGalaxySlug]);

  return (
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Scale & Coordinate Indicator Legend */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs text-slate-300 shadow-xl space-y-1">
        <div className="flex items-center gap-2 font-mono font-semibold text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          LOCAL GROUP SCALE (EXTRAGALACTIC)
        </div>
        <div className="text-[11px] text-slate-400">
          Origin: Milky Way (0, 0, 0) | Extent: ~2.5 Mpc
        </div>
        <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-rose-500 inline-block" /> Approach (-110 km/s)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-400 inline-block" /> Satellite Orbit
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-cyan-500 inline-block" /> Association
          </span>
        </div>
      </div>
    </div>
  );
};
