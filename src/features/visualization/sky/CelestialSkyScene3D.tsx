"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ObserverLocation, SkyObjectObservation } from "@/domain/observer/types";
import { constellationRepo } from "@/lib/data/constellation-repository";
import { Compass, Layers, Sparkles, Navigation, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CelestialSkyScene3DProps {
  location: ObserverLocation;
  date: Date;
  objects: SkyObjectObservation[];
  selectedObjectId?: string;
  onSelectObject?: (object: SkyObjectObservation) => void;
  className?: string;
}

export function CelestialSkyScene3D({
  location,
  date,
  objects,
  selectedObjectId: _selectedObjectId,
  onSelectObject,
  className = "",
}: CelestialSkyScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Layer Visibility Toggles
  const [showConstellations, setShowConstellations] = useState(true);
  const [showAltAzGrid, setShowAltAzGrid] = useState(true);
  const [showGroundHorizon, setShowGroundHorizon] = useState(true);
  const [showCardinals, setShowCardinals] = useState(true);

  // Hover state
  const [hoveredObject, setHoveredObject] = useState<SkyObjectObservation | null>(null);

  // Helper: Convert (Altitude, Azimuth) in degrees to 3D Cartesian coordinates on celestial sphere of radius R
  // Azimuth: 0 = North (+Z), 90 = East (+X), 180 = South (-Z), 270 = West (-X)
  // Altitude: 0 = Horizon, +90 = Zenith (+Y), -90 = Nadir (-Y)
  const altAzToVector3 = useCallback(
    (altDeg: number, azDeg: number, radius = 500): THREE.Vector3 => {
      const altRad = (altDeg * Math.PI) / 180.0;
      const azRad = (azDeg * Math.PI) / 180.0;

      const y = radius * Math.sin(altRad);
      const horizDist = radius * Math.cos(altRad);
      const x = horizDist * Math.sin(azRad); // East
      const z = horizDist * Math.cos(azRad); // North

      return new THREE.Vector3(x, y, z);
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Celestial void dark background
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(0, 5, 0.1); // Placed at center looking out
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls configured for interior viewing
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = -0.5; // Inverted for looking around inside sphere
    controls.enableZoom = true;
    controls.minDistance = 0.01;
    controls.maxDistance = 20;
    controls.target.set(0, 5, 50); // Look towards North
    controlsRef.current = controls;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // 5. Build Ground Horizon Disc
    const horizonRadius = 490;
    const groundGroup = new THREE.Group();
    groundGroup.name = "ground-horizon-group";

    // Ground Plane Disc
    const groundGeom = new THREE.CircleGeometry(horizonRadius, 64);
    groundGeom.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x09141f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const groundMesh = new THREE.Mesh(groundGeom, groundMat);
    groundMesh.position.y = -0.5;
    groundGroup.add(groundMesh);

    // Horizon Ring Line
    const horizonRingGeom = new THREE.RingGeometry(horizonRadius - 1.5, horizonRadius + 1.5, 96);
    horizonRingGeom.rotateX(-Math.PI / 2);
    const horizonRingMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e, // Emerald green horizon line
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const horizonRingMesh = new THREE.Mesh(horizonRingGeom, horizonRingMat);
    groundGroup.add(horizonRingMesh);

    scene.add(groundGroup);

    // 6. Build Alt/Az Coordinate Grid
    const altAzGroup = new THREE.Group();
    altAzGroup.name = "alt-az-grid-group";

    // Altitude circles (30°, 60°)
    [30, 60].forEach((alt) => {
      const altRadius = horizonRadius * Math.cos((alt * Math.PI) / 180);
      const altY = horizonRadius * Math.sin((alt * Math.PI) / 180);
      const ringGeom = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(
          new THREE.Vector3(altRadius * Math.sin(theta), altY, altRadius * Math.cos(theta))
        );
      }
      ringGeom.setFromPoints(points);
      const ringLine = new THREE.Line(
        ringGeom,
        new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.4 })
      );
      altAzGroup.add(ringLine);
    });

    // Azimuth meridians every 45°
    for (let az = 0; az < 360; az += 45) {
      const azGeom = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let alt = 0; alt <= 90; alt += 5) {
        points.push(altAzToVector3(alt, az, horizonRadius));
      }
      azGeom.setFromPoints(points);
      const azLine = new THREE.Line(
        azGeom,
        new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.35 })
      );
      altAzGroup.add(azLine);
    }
    scene.add(altAzGroup);

    // 7. Build Constellation Asterism Lines
    const constGroup = new THREE.Group();
    constGroup.name = "constellation-group";

    const allConstellations = constellationRepo.getAll();
    const constLineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1, // Indigo line glow
      transparent: true,
      opacity: 0.65,
      linewidth: 1.5,
    });

    allConstellations.forEach((c) => {
      c.asterismLines.forEach((line) => {
        // We project RA/Dec into current Horizontal coordinates
        // Using approximate local conversion
        const startObs = objects.find(
          (o) =>
            Math.hypot(o.raDeg - line.startCoords.raDeg, o.decDeg - line.startCoords.decDeg) < 3.0
        );
        const endObs = objects.find(
          (o) => Math.hypot(o.raDeg - line.endCoords.raDeg, o.decDeg - line.endCoords.decDeg) < 3.0
        );

        if (startObs && endObs) {
          const vStart = altAzToVector3(
            startObs.horizontal.apparentAltitudeDeg,
            startObs.horizontal.azimuthDeg,
            480
          );
          const vEnd = altAzToVector3(
            endObs.horizontal.apparentAltitudeDeg,
            endObs.horizontal.azimuthDeg,
            480
          );

          const geom = new THREE.BufferGeometry().setFromPoints([vStart, vEnd]);
          const meshLine = new THREE.Line(geom, constLineMat);
          constGroup.add(meshLine);
        }
      });
    });
    scene.add(constGroup);

    // 8. Build GPU Starfield & Celestial Point Cloud
    const starsGroup = new THREE.Group();
    starsGroup.name = "celestial-objects-group";

    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    const colorPalette = {
      O: new THREE.Color(0x93c5fd),
      B: new THREE.Color(0xbfdbfe),
      A: new THREE.Color(0xf8fafc),
      F: new THREE.Color(0xfef08a),
      G: new THREE.Color(0xfde047),
      K: new THREE.Color(0xfb923c),
      M: new THREE.Color(0xf87171),
      PLANET: new THREE.Color(0x38bdf8),
      MOON: new THREE.Color(0xffedd5),
      DSO: new THREE.Color(0xc084fc),
    };

    objects.forEach((obj) => {
      const v = altAzToVector3(obj.horizontal.apparentAltitudeDeg, obj.horizontal.azimuthDeg, 480);
      positions.push(v.x, v.y, v.z);

      let starColor = colorPalette.A;
      if (obj.type === "PLANET") {
        starColor = colorPalette.PLANET;
      } else if (obj.type === "MOON") {
        starColor = colorPalette.MOON;
      } else if (
        obj.type === "GALAXY" ||
        obj.type === "NEBULA" ||
        obj.type === "PLANETARY_NEBULA" ||
        obj.type === "SUPERNOVA_REMNANT"
      ) {
        starColor = colorPalette.DSO;
      } else if (obj.spectralClass) {
        const firstLetter = obj.spectralClass.charAt(0).toUpperCase() as keyof typeof colorPalette;
        starColor = colorPalette[firstLetter] ?? colorPalette.A;
      }

      colors.push(starColor.r, starColor.g, starColor.b);

      // Size scaled from visual magnitude (brighter = larger)
      const mag = obj.apparentMagnitudeV ?? 5.0;
      const pointSize = Math.max(3.0, (7.0 - mag) * 2.2);
      sizes.push(pointSize);
    });

    const starPointsGeom = new THREE.BufferGeometry();
    starPointsGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    starPointsGeom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const starPointsMat = new THREE.PointsMaterial({
      size: 6.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: false,
    });

    const starPoints = new THREE.Points(starPointsGeom, starPointsMat);
    starsGroup.add(starPoints);
    scene.add(starsGroup);

    // 9. Cardinal Direction Beacons (N, NE, E, SE, S, SW, W, NW)
    const cardinalGroup = new THREE.Group();
    cardinalGroup.name = "cardinals-group";
    const cardinals = [
      { name: "N", az: 0 },
      { name: "NE", az: 45 },
      { name: "E", az: 90 },
      { name: "SE", az: 135 },
      { name: "S", az: 180 },
      { name: "SW", az: 225 },
      { name: "W", az: 270 },
      { name: "NW", az: 315 },
    ];

    cardinals.forEach((c) => {
      const pos = altAzToVector3(0.5, c.az, horizonRadius - 10);
      const markerGeom = new THREE.SphereGeometry(2.5, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: c.name === "N" ? 0xef4444 : 0x38bdf8,
      });
      const markerMesh = new THREE.Mesh(markerGeom, markerMat);
      markerMesh.position.copy(pos);
      cardinalGroup.add(markerMesh);
    });
    scene.add(cardinalGroup);

    // 10. Animation Render Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 11. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [location, date, objects, altAzToVector3]);

  // Update dynamic visibility layers
  useEffect(() => {
    if (!sceneRef.current) return;
    const groundGroup = sceneRef.current.getObjectByName("ground-horizon-group");
    if (groundGroup) groundGroup.visible = showGroundHorizon;

    const altAzGroup = sceneRef.current.getObjectByName("alt-az-grid-group");
    if (altAzGroup) altAzGroup.visible = showAltAzGrid;

    const constGroup = sceneRef.current.getObjectByName("constellation-group");
    if (constGroup) constGroup.visible = showConstellations;

    const cardinalsGroup = sceneRef.current.getObjectByName("cardinals-group");
    if (cardinalsGroup) cardinalsGroup.visible = showCardinals;
  }, [showGroundHorizon, showAltAzGrid, showConstellations, showCardinals]);

  // Interactive Click Raycasting
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    if (!container || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / container.clientWidth) * 2 - 1,
      -((e.clientY - rect.top) / container.clientHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 12.0 };
    raycaster.setFromCamera(mouse, camera);

    // Find closest celestial object
    let closestObj: SkyObjectObservation | null = null;
    let minDistance = Infinity;

    for (const obj of objects) {
      const v = altAzToVector3(obj.horizontal.apparentAltitudeDeg, obj.horizontal.azimuthDeg, 480);
      const screenPos = v.clone().project(camera);
      const dist = Math.hypot(screenPos.x - mouse.x, screenPos.y - mouse.y);
      if (dist < 0.08 && dist < minDistance) {
        minDistance = dist;
        closestObj = obj;
      }
    }

    if (closestObj) {
      setHoveredObject(closestObj);
      if (onSelectObject) onSelectObject(closestObj);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={`relative w-full h-full min-h-[620px] rounded-2xl overflow-hidden bg-celestial-void border border-celestial-muted/80 shadow-2xl select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* HUD Reference Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <Badge
          variant="outline"
          className="bg-celestial-surface/85 backdrop-blur-md text-celestial-starlight font-mono text-xs border-celestial-muted/80"
        >
          <Compass className="w-3.5 h-3.5 mr-1.5 text-celestial-cyan" />
          {location.name} ({location.latitudeDeg.toFixed(2)}°, {location.longitudeDeg.toFixed(2)}°)
        </Badge>
        <Badge
          variant="outline"
          className="bg-celestial-surface/85 backdrop-blur-md text-celestial-starlight font-mono text-xs border-celestial-muted/80"
        >
          <Globe className="w-3.5 h-3.5 mr-1.5 text-celestial-violet" />
          {date.toUTCString().replace("GMT", "UTC")}
        </Badge>
      </div>

      {/* Layer Visibility Toggle Bar */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-celestial-surface/85 border border-celestial-muted/80 backdrop-blur-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConstellations(!showConstellations)}
          className={`h-8 px-2.5 text-xs font-mono gap-1.5 ${showConstellations ? "text-celestial-cyan bg-celestial-cyan/10" : "text-celestial-subtle"}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Constellations
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAltAzGrid(!showAltAzGrid)}
          className={`h-8 px-2.5 text-xs font-mono gap-1.5 ${showAltAzGrid ? "text-celestial-cyan bg-celestial-cyan/10" : "text-celestial-subtle"}`}
        >
          <Layers className="w-3.5 h-3.5" />
          Alt/Az Grid
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGroundHorizon(!showGroundHorizon)}
          className={`h-8 px-2.5 text-xs font-mono gap-1.5 ${showGroundHorizon ? "text-emerald-400 bg-emerald-500/10" : "text-celestial-subtle"}`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Horizon
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCardinals(!showCardinals)}
          className={`h-8 px-2.5 text-xs font-mono gap-1.5 ${showCardinals ? "text-amber-400 bg-amber-500/10" : "text-celestial-subtle"}`}
        >
          <Compass className="w-3.5 h-3.5" />
          Cardinals
        </Button>
      </div>

      {/* Selected Object Quick Banner */}
      {hoveredObject && (
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-xl bg-celestial-surface/90 border border-celestial-cyan/40 backdrop-blur-md font-mono text-xs space-y-1 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-celestial-cyan text-sm">
              {hoveredObject.canonicalName}
            </span>
            <Badge variant="outline" className="text-[10px] uppercase py-0 border-celestial-muted">
              {hoveredObject.type}
            </Badge>
          </div>
          <div className="text-celestial-subtle text-[11px]">
            Alt:{" "}
            <span className="text-celestial-starlight">
              {hoveredObject.horizontal.apparentAltitudeDeg}°
            </span>{" "}
            · Az:{" "}
            <span className="text-celestial-starlight">{hoveredObject.horizontal.azimuthDeg}°</span>{" "}
            · Mag:{" "}
            <span className="text-celestial-starlight">
              {hoveredObject.apparentMagnitudeV ?? "N/A"}
            </span>
          </div>
          <div className="text-celestial-subtle text-[10px]">
            Constellation:{" "}
            <span className="text-celestial-cyan">{hoveredObject.constellation}</span>
          </div>
        </div>
      )}
    </div>
  );
}
