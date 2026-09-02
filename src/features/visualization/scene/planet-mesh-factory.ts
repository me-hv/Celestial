import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { computeVisualRadius } from "@/lib/astronomy/coordinates";
import { SystemScaleStrategy } from "@/lib/astronomy/scaling";

// Base Color Palette for Solar System Bodies
export const CELESTIAL_BODY_PALETTE: Record<
  string,
  { color: string; emissive?: string; roughness?: number }
> = {
  sun: { color: "#FDB813", emissive: "#FF8C00", roughness: 0.2 },
  mercury: { color: "#9CA3AF", roughness: 0.9 },
  venus: { color: "#EAB308", roughness: 0.7 },
  earth: { color: "#2563EB", roughness: 0.5 },
  moon: { color: "#CBD5E1", roughness: 0.95 },
  mars: { color: "#DC2626", roughness: 0.8 },
  jupiter: { color: "#D97706", roughness: 0.6 },
  saturn: { color: "#FDE047", roughness: 0.6 },
  uranus: { color: "#38BDF8", roughness: 0.4 },
  neptune: { color: "#1D4ED8", roughness: 0.4 },

  // TRAPPIST-1 System
  "trappist-1-star": { color: "#EF4444", emissive: "#DC2626", roughness: 0.2 },
  "trappist-1-b": { color: "#9CA3AF", roughness: 0.85 },
  "trappist-1-c": { color: "#D1D5DB", roughness: 0.8 },
  "trappist-1-d": { color: "#F87171", roughness: 0.75 },
  "trappist-1-e": { color: "#38BDF8", roughness: 0.5 },
  "trappist-1-f": { color: "#60A5FA", roughness: 0.55 },
  "trappist-1-g": { color: "#818CF8", roughness: 0.6 },
  "trappist-1-h": { color: "#BAE6FD", roughness: 0.9 },

  // Proxima Centauri System
  "proxima-centauri-star": { color: "#F87171", emissive: "#EF4444", roughness: 0.2 },
  "proxima-centauri-b": { color: "#34D399", roughness: 0.6 },
  "proxima-centauri-d": { color: "#9CA3AF", roughness: 0.8 },

  // Alpha Centauri
  "alpha-centauri-a": { color: "#FBBF24", emissive: "#F59E0B", roughness: 0.2 },
  "alpha-centauri-b": { color: "#EA580C", emissive: "#C2410C", roughness: 0.2 },

  // 55 Cancri (Copernicus)
  "55-cancri-star": { color: "#FDE047", emissive: "#EAB308", roughness: 0.2 },
  "55-cancri-e": { color: "#F43F5E", roughness: 0.3 },
  "55-cancri-b": { color: "#F59E0B", roughness: 0.6 },
  "55-cancri-c": { color: "#EAB308", roughness: 0.65 },
  "55-cancri-f": { color: "#22D3EE", roughness: 0.5 },
  "55-cancri-d": { color: "#38BDF8", roughness: 0.6 },

  // WASP-12 (Extreme Hot Jupiter)
  "wasp-12-star": { color: "#FEF08A", emissive: "#FACC15", roughness: 0.2 },
  "wasp-12-b": { color: "#EA580C", roughness: 0.2 },

  // HD 209458 (Osiris)
  "hd-209458-star": { color: "#FEF08A", emissive: "#FACC15", roughness: 0.2 },
  "hd-209458-b": { color: "#06B6D4", roughness: 0.4 },
};

export interface BodyMeshNode {
  object: CelestialObject;
  group: THREE.Group;
  mesh: THREE.Mesh;
  hitMesh?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
  selectionRing?: THREE.Object3D;
  visualRadius: number;
}

/**
 * Creates a data-driven 3D mesh node with raycast hit boundaries for any CelestialObject
 */
export function createCelestialBodyNode(
  object: CelestialObject,
  scaleStrategy?: SystemScaleStrategy
): BodyMeshNode {
  const group = new THREE.Group();
  group.name = `node-${object.slug}`;

  const isStar = object.classification.code === "STAR";
  const isMoon = object.classification.code === "MOON";

  // Determine Visual Radius
  let visualRadius: number;
  if (scaleStrategy) {
    visualRadius = scaleStrategy.calculateVisualRadius(object);
  } else {
    visualRadius = computeVisualRadius(object.physical.meanRadiusKm, isStar, isMoon);
  }

  // Determine Spectral / Physical Palette
  let palette = CELESTIAL_BODY_PALETTE[object.slug];
  if (!palette) {
    if (isStar) {
      const temp =
        object.physical.effectiveTemperatureK || object.physical.meanTemperatureK || 5778;
      if (temp < 3700) palette = { color: "#EF4444", emissive: "#DC2626", roughness: 0.2 };
      else if (temp < 5200) palette = { color: "#EA580C", emissive: "#C2410C", roughness: 0.2 };
      else if (temp < 6000) palette = { color: "#FBBF24", emissive: "#F59E0B", roughness: 0.2 };
      else if (temp < 7500) palette = { color: "#FEF08A", emissive: "#FACC15", roughness: 0.2 };
      else palette = { color: "#93C5FD", emissive: "#60A5FA", roughness: 0.2 };
    } else {
      switch (object.classification.code) {
        case "SUPER_EARTH":
          palette = { color: "#818CF8", roughness: 0.5 };
          break;
        case "ICE_GIANT":
          palette = { color: "#06B6D4", roughness: 0.4 };
          break;
        case "GAS_GIANT":
          palette = { color: "#F59E0B", roughness: 0.6 };
          break;
        default:
          palette = { color: "#6B7280", roughness: 0.7 };
      }
    }
  }

  const sphereGeometry = new THREE.SphereGeometry(visualRadius, 32, 32);
  let material: THREE.Material;

  if (isStar) {
    // Emissive Star Material
    material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.color),
    });

    // Outer Stellar Corona Glow
    const coronaGeo = new THREE.SphereGeometry(visualRadius * 1.25, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.emissive || palette.color),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    group.add(corona);
  } else {
    // Standard Planetary Physical Material
    material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.color),
      roughness: palette.roughness ?? 0.7,
      metalness: 0.1,
    });
  }

  const mesh = new THREE.Mesh(sphereGeometry, material);
  mesh.name = `body-${object.slug}`;
  mesh.userData = { objectId: object.id, slug: object.slug, celestialObject: object };
  group.add(mesh);

  // Invisible Hit Target Mesh (Ensures easy raycast selection even when zoomed out or for small bodies like Moon)
  const hitRadius = isMoon
    ? Math.max(visualRadius * 1.3, 0.75)
    : Math.max(visualRadius * 1.25, 1.1);
  const hitGeo = new THREE.SphereGeometry(hitRadius, 16, 16);
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false,
    wireframe: false,
  });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = `hit-${object.slug}`;
  hitMesh.userData = { objectId: object.id, slug: object.slug, celestialObject: object };
  group.add(hitMesh);

  // Planetary Ring System (Data-Driven: ONLY instantiated when object.physical.hasRingSystem or ringSystem is true)
  const hasRingSystem = Boolean(object.physical.hasRingSystem || object.physical.ringSystem);
  let ringMesh: THREE.Mesh | undefined;

  if (hasRingSystem) {
    const ringConfig = object.physical.ringSystem;
    const innerRatio =
      ringConfig?.innerRadiusKm && object.physical.meanRadiusKm
        ? ringConfig.innerRadiusKm / object.physical.meanRadiusKm
        : 1.4;
    const outerRatio =
      ringConfig?.outerRadiusKm && object.physical.meanRadiusKm
        ? ringConfig.outerRadiusKm / object.physical.meanRadiusKm
        : 2.5;

    const innerRingRadius = visualRadius * innerRatio;
    const outerRingRadius = visualRadius * outerRatio;
    const ringGeometry = new THREE.RingGeometry(innerRingRadius, outerRingRadius, 64);
    ringGeometry.rotateX(Math.PI / 2);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(ringConfig?.color || "#E2D4A8"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: ringConfig?.opacity ?? 0.85,
      roughness: 0.8,
    });

    ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    const inclination = ringConfig?.inclinationDeg ?? 26.73;
    ringMesh.rotation.z = THREE.MathUtils.degToRad(inclination);
    ringMesh.name = `rings-${object.slug}`;
    group.add(ringMesh);
  }

  // Atmospheric Glow for Earth/Venus
  if (object.slug === "earth" || object.slug === "venus") {
    const atmoColor = object.slug === "earth" ? "#60A5FA" : "#FDE047";
    const atmoGeo = new THREE.SphereGeometry(visualRadius * 1.05, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(atmoColor),
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    group.add(atmo);
  }

  // Selection Indicator Reticle (Thin wireframe targeting ring, NOT a solid planetary ring disc)
  const selPoints: THREE.Vector3[] = [];
  const selSegments = 64;
  const selRadius = visualRadius * 1.42;
  for (let i = 0; i <= selSegments; i++) {
    const theta = (i / selSegments) * Math.PI * 2;
    selPoints.push(new THREE.Vector3(Math.cos(theta) * selRadius, 0, Math.sin(theta) * selRadius));
  }
  const selRingGeo = new THREE.BufferGeometry().setFromPoints(selPoints);
  const selRingMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#38BDF8"),
    transparent: true,
    opacity: 0.0,
  });
  const selectionRing = new THREE.LineLoop(selRingGeo, selRingMat);
  selectionRing.name = "selection-ring";
  selectionRing.visible = false;
  group.add(selectionRing);

  return {
    object,
    group,
    mesh,
    hitMesh,
    ringMesh,
    selectionRing,
    visualRadius,
  };
}

export function updateSelectionRingState(node: BodyMeshNode, isSelected: boolean): void {
  if (!node.selectionRing) return;
  node.selectionRing.visible = isSelected;
  if ("material" in node.selectionRing) {
    const mat = node.selectionRing.material as THREE.Material & { opacity?: number };
    if (mat) {
      mat.opacity = isSelected ? 0.95 : 0.0;
    }
  }
}
