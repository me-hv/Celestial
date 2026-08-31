import * as THREE from "three";
import {
  SPIRAL_ARM_DEFINITIONS,
  generateSpiralArmPoints,
} from "@/lib/astronomy/galactic/spiral-arms";
import { GalacticScale } from "@/lib/astronomy/coordinates/galactic-scale";
import { GALACTOCENTRIC_CONSTANTS } from "@/lib/astronomy/coordinates/galactocentric";

export interface MilkyWayVisualNodes {
  group: THREE.Group;
  diskParticles: THREE.Points;
  bulgeMesh: THREE.Mesh;
  barMesh: THREE.Mesh;
  spiralArmsGroup: THREE.Group;
  sunMarkerGroup: THREE.Group;
  galacticCenterMarker: THREE.Group;
  referenceGrid: THREE.Group;
}

/**
 * Creates the 3D procedural density particle field representing the Milky Way disk (thin & thick disks).
 */
export function createMilkyWayDiskParticles(particleCount: number = 3500): THREE.Points {
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const innerColor = new THREE.Color("#FDE68A"); // Warm gold/amber near center
  const diskColor = new THREE.Color("#93C5FD"); // Cool blue/white in main disk
  const outerColor = new THREE.Color("#475569"); // Faint slate at outskirts

  for (let i = 0; i < particleCount; i++) {
    // Exponential radial density profile: P(r) ~ r * exp(-r / r_d)
    const u = Math.random();
    const rKpc = -2.6 * Math.log(1.0 - u * 0.98) + Math.random() * 1.5;
    const rScene = Math.min(rKpc, 24.0) * GalacticScale.KPC_TO_SCENE_UNITS;

    const theta = Math.random() * Math.PI * 2;
    // Scale height (thin disk ~ 300 pc, thick disk ~ 900 pc)
    const isThick = Math.random() < 0.2;
    const zScalePc = isThick ? 900 : 300;
    const zPc = (Math.random() - 0.5) * 2 * zScalePc * (Math.random() < 0.5 ? 1 : 1.5);
    const yScene = (zPc / 1000.0) * GalacticScale.KPC_TO_SCENE_UNITS * 2.5;

    positions[i * 3] = rScene * Math.cos(theta);
    positions[i * 3 + 1] = yScene;
    positions[i * 3 + 2] = rScene * Math.sin(theta);

    // Color gradient based on radius
    const t = Math.min(1.0, rKpc / 18.0);
    const particleCol =
      rKpc < 4.0 ? innerColor.clone().lerp(diskColor, t) : diskColor.clone().lerp(outerColor, t);

    colors[i * 3] = particleCol.r;
    colors[i * 3 + 1] = particleCol.g;
    colors[i * 3 + 2] = particleCol.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.name = "milky-way-disk-particles";
  return points;
}

/**
 * Creates the ellipsoidal Galactic Bulge glow.
 */
export function createGalacticBulgeMesh(): THREE.Mesh {
  // Radius ~ 2.0 kpc -> 20 scene units, vertical height ~ 1.2 kpc
  const bulgeGeo = new THREE.SphereGeometry(20, 32, 32);
  bulgeGeo.scale(1.0, 0.6, 0.8);

  const bulgeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#FDE047"),
    transparent: true,
    opacity: 0.18,
    wireframe: true,
  });

  const bulge = new THREE.Mesh(bulgeGeo, bulgeMat);
  bulge.name = "galactic-bulge-mesh";
  return bulge;
}

/**
 * Creates the rotating Galactic Bar representation.
 */
export function createGalacticBarMesh(): THREE.Mesh {
  // Half-length ~ 5.0 kpc -> 50 scene units, width ~ 20 units, height ~ 10 units
  const barGeo = new THREE.BoxGeometry(100, 8, 22);
  const barMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#F59E0B"),
    transparent: true,
    opacity: 0.12,
    wireframe: true,
  });

  const bar = new THREE.Mesh(barGeo, barMat);
  bar.name = "galactic-bar-mesh";
  // Rotate bar by ~29° relative to Sun-GC line
  bar.rotation.y = (29.0 * Math.PI) / 180.0;
  return bar;
}

/**
 * Creates parametric logarithmic spiral arm lines and glow tubes.
 */
export function createSpiralArmsGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = "spiral-arms-group";

  SPIRAL_ARM_DEFINITIONS.forEach((arm) => {
    const points = generateSpiralArmPoints(arm, 1.5);
    const vecPoints = points.map((p) => {
      return new THREE.Vector3(
        p.xKpc * GalacticScale.KPC_TO_SCENE_UNITS,
        0,
        p.yKpc * GalacticScale.KPC_TO_SCENE_UNITS
      );
    });

    const curve = new THREE.CatmullRomCurve3(vecPoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, arm.isSpur ? 1.0 : 1.8, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(arm.color),
      transparent: true,
      opacity: arm.isSpur ? 0.45 : 0.35,
      wireframe: true,
    });

    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.name = `arm-mesh-${arm.id}`;
    group.add(tubeMesh);

    // Bright centerline
    const lineGeo = new THREE.BufferGeometry().setFromPoints(vecPoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(arm.color),
      transparent: true,
      opacity: 0.85,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.name = `arm-line-${arm.id}`;
    group.add(line);
  });

  return group;
}

/**
 * Creates the Sun / Solar System "YOU ARE HERE" marker.
 */
export function createSunGalacticMarker(): THREE.Group {
  const group = new THREE.Group();
  group.name = "sun-galactic-marker";

  const pos = GalacticScale.getSunScenePosition();
  group.position.set(pos.x, pos.y, pos.z);

  // Solar point sphere
  const sunGeo = new THREE.SphereGeometry(1.6, 16, 16);
  const sunMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#FACC15") });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  group.add(sunMesh);

  // Concentric beacon pulse rings
  const ringGeo = new THREE.RingGeometry(2.5, 3.2, 32);
  ringGeo.rotateX(Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#38BDF8"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
  });
  const beaconRing = new THREE.Mesh(ringGeo, ringMat);
  group.add(beaconRing);

  // Solar neighborhood sphere (50 pc radius -> ~0.5 scene units, visually 4 units for clarity)
  const sphereGeo = new THREE.SphereGeometry(4.0, 16, 16);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#38BDF8"),
    transparent: true,
    opacity: 0.15,
    wireframe: true,
  });
  group.add(new THREE.Mesh(sphereGeo, sphereMat));

  return group;
}

/**
 * Creates the Galactic Center & Sagittarius A* visual marker.
 */
export function createGalacticCenterMarker(): THREE.Group {
  const group = new THREE.Group();
  group.name = "galactic-center-marker";
  group.position.set(0, 0, 0);

  // Sgr A* black hole core
  const bhGeo = new THREE.SphereGeometry(2.2, 24, 24);
  const bhMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#020617") });
  const bhMesh = new THREE.Mesh(bhGeo, bhMat);
  group.add(bhMesh);

  // Accretion / Relativistic Plasma Ring (Gold / Amber)
  const ringGeo = new THREE.RingGeometry(2.6, 4.5, 36);
  ringGeo.rotateX(Math.PI / 3);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#F59E0B"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  group.add(new THREE.Mesh(ringGeo, ringMat));

  return group;
}

/**
 * Creates the Galactocentric reference grid and concentric radius rings.
 */
export function createGalactocentricReferenceGrid(): THREE.Group {
  const group = new THREE.Group();
  group.name = "galactocentric-reference-grid";

  // Concentric radius rings: 4 kpc, 8 kpc (Solar circle), 12 kpc, 16 kpc, 20 kpc
  const radiiKpc = [
    { r: 4.0, col: "#64748B", dash: true, label: "4 kpc" },
    {
      r: GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC / 1000.0,
      col: "#38BDF8",
      dash: false,
      label: "Solar Orbit (8.18 kpc)",
    },
    { r: 12.0, col: "#64748B", dash: true, label: "12 kpc" },
    { r: 16.0, col: "#64748B", dash: true, label: "16 kpc" },
    { r: 20.0, col: "#475569", dash: true, label: "20 kpc (Outer Disk)" },
  ];

  radiiKpc.forEach(({ r, col, dash }) => {
    const rUnits = r * GalacticScale.KPC_TO_SCENE_UNITS;
    const ringPoints: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * rUnits, 0, Math.sin(theta) * rUnits));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    let ringLine: THREE.LineLoop;
    if (dash) {
      const ringMat = new THREE.LineDashedMaterial({
        color: new THREE.Color(col),
        transparent: true,
        opacity: 0.25,
        dashSize: 4.0,
        gapSize: 3.0,
      });
      ringLine = new THREE.LineLoop(ringGeo, ringMat);
      ringLine.computeLineDistances();
    } else {
      const ringMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(col),
        transparent: true,
        opacity: 0.45,
      });
      ringLine = new THREE.LineLoop(ringGeo, ringMat);
    }
    group.add(ringLine);
  });

  // Galactocentric Principal Axes: Sun-GC Axis (X) and Galactic Rotation Axis (Y)
  const axesPoints = [
    new THREE.Vector3(-220, 0, 0),
    new THREE.Vector3(220, 0, 0),
    new THREE.Vector3(0, 0, -220),
    new THREE.Vector3(0, 0, 220),
  ];
  const axesGeo = new THREE.BufferGeometry().setFromPoints(axesPoints);
  const axesMat = new THREE.LineDashedMaterial({
    color: new THREE.Color("#475569"),
    transparent: true,
    opacity: 0.2,
    dashSize: 5.0,
    gapSize: 4.0,
  });
  const axesLine = new THREE.LineSegments(axesGeo, axesMat);
  axesLine.computeLineDistances();
  group.add(axesLine);

  return group;
}
