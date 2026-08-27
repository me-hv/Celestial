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
  "trappist-1-e": { color: "#38BDF8", roughness: 0.5 }, // Habitable Zone
  "trappist-1-f": { color: "#60A5FA", roughness: 0.55 }, // Habitable Zone
  "trappist-1-g": { color: "#818CF8", roughness: 0.6 }, // Habitable Zone
  "trappist-1-h": { color: "#BAE6FD", roughness: 0.9 }, // Icy

  // Proxima Centauri System
  "proxima-centauri-star": { color: "#F87171", emissive: "#EF4444", roughness: 0.2 },
  "proxima-centauri-b": { color: "#34D399", roughness: 0.6 }, // Habitable Zone
  "proxima-centauri-d": { color: "#9CA3AF", roughness: 0.8 },

  // Alpha Centauri
  "alpha-centauri-a": { color: "#FBBF24", emissive: "#F59E0B", roughness: 0.2 },
  "alpha-centauri-b": { color: "#EA580C", emissive: "#C2410C", roughness: 0.2 },

  // 55 Cancri (Copernicus)
  "55-cancri-star": { color: "#FDE047", emissive: "#EAB308", roughness: 0.2 },
  "55-cancri-e": { color: "#F43F5E", roughness: 0.3 }, // Lava Super-Earth
  "55-cancri-b": { color: "#F59E0B", roughness: 0.6 },
  "55-cancri-c": { color: "#EAB308", roughness: 0.65 },
  "55-cancri-f": { color: "#22D3EE", roughness: 0.5 }, // HZ Gas Giant
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
  selectionRing?: THREE.Mesh;
  visualRadius: number;
}

/**
 * Creates a data-driven 3D mesh node for any CelestialObject (Star, Planet, Exoplanet, Moon)
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
      // Default stellar color based on spectral class or temperature
      const temp =
        object.physical.effectiveTemperatureK || object.physical.meanTemperatureK || 5778;
      if (temp < 3700)
        palette = { color: "#EF4444", emissive: "#DC2626", roughness: 0.2 }; // M-dwarf
      else if (temp < 5200)
        palette = { color: "#EA580C", emissive: "#C2410C", roughness: 0.2 }; // K-dwarf
      else if (temp < 6000)
        palette = { color: "#FBBF24", emissive: "#F59E0B", roughness: 0.2 }; // G-dwarf (Sun)
      else if (temp < 7500)
        palette = { color: "#FEF08A", emissive: "#FACC15", roughness: 0.2 }; // F-type
      else palette = { color: "#93C5FD", emissive: "#60A5FA", roughness: 0.2 }; // A/B type
    } else {
      // Exoplanet fallback color
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

  // Saturn's Ring System
  if (object.slug === "saturn") {
    const innerRingRadius = visualRadius * 1.4;
    const outerRingRadius = visualRadius * 2.5;
    const ringGeometry = new THREE.RingGeometry(innerRingRadius, outerRingRadius, 64);
    ringGeometry.rotateX(Math.PI / 2);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2D4A8"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      roughness: 0.8,
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.z = THREE.MathUtils.degToRad(26.73);
    ringMesh.name = "saturn-rings";
    group.add(ringMesh);
  }

  // Atmospheric Glow Ring for Earth/Venus
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

  // Selection Indicator Ring (Initially Hidden)
  const selRingGeo = new THREE.RingGeometry(visualRadius * 1.35, visualRadius * 1.48, 48);
  selRingGeo.rotateX(Math.PI / 2);
  const selRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#38BDF8"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
  });
  const selectionRing = new THREE.Mesh(selRingGeo, selRingMat);
  selectionRing.name = "selection-ring";
  group.add(selectionRing);

  return {
    object,
    group,
    mesh,
    selectionRing,
    visualRadius,
  };
}

export function updateSelectionRingState(node: BodyMeshNode, isSelected: boolean): void {
  if (!node.selectionRing) return;
  const mat = node.selectionRing.material as THREE.MeshBasicMaterial;
  mat.opacity = isSelected ? 0.9 : 0.0;
}
