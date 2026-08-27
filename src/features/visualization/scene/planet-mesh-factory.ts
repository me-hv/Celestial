import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { computeVisualRadius } from "@/lib/astronomy/coordinates";

// Scientific base color palette for Solar System bodies
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
};

export interface BodyMeshNode {
  object: CelestialObject;
  group: THREE.Group;
  mesh: THREE.Mesh;
  selectionRing?: THREE.Mesh;
  visualRadius: number;
}

/**
 * Creates a data-driven 3D mesh node for any CelestialObject
 */
export function createCelestialBodyNode(object: CelestialObject): BodyMeshNode {
  const group = new THREE.Group();
  group.name = `node-${object.slug}`;

  const isStar = object.classification.code === "STAR";
  const isMoon = object.classification.code === "MOON";
  const visualRadius = computeVisualRadius(object.physical.meanRadiusKm, isStar, isMoon);

  const palette = CELESTIAL_BODY_PALETTE[object.slug] || {
    color: "#6B7280",
    roughness: 0.7,
  };

  const sphereGeometry = new THREE.SphereGeometry(visualRadius, 32, 32);

  let material: THREE.Material;

  if (isStar) {
    // Central Star (Sun): Emissive material
    material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.color),
    });

    // Sun Inner Corona Glow
    const coronaGeo = new THREE.SphereGeometry(visualRadius * 1.18, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(palette.emissive || "#FF8C00"),
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    group.add(corona);
  } else {
    // Standard Planet/Moon Physical Material
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

    // Rotate ring into equatorial plane (XZ plane)
    ringGeometry.rotateX(Math.PI / 2);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E2D4A8"),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      roughness: 0.8,
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    // Saturn's axial tilt (~26.7 degrees)
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
  const selRingGeo = new THREE.RingGeometry(visualRadius * 1.35, visualRadius * 1.45, 48);
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
