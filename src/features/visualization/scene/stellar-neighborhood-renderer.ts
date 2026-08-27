import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { StellarNeighborhoodScale } from "@/lib/astronomy/coordinates/stellar-scale";

export interface StarMeshNode {
  star: CelestialObject;
  group: THREE.Group;
  mesh: THREE.Mesh;
  selectionRing: THREE.Mesh;
  visualRadius: number;
  isSun: boolean;
}

export const SPECTRAL_COLOR_PALETTE: Record<string, { color: string; emissive: string }> = {
  O: { color: "#93C5FD", emissive: "#60A5FA" }, // Blue
  B: { color: "#BAE6FD", emissive: "#38BDF8" }, // Blue-White
  A: { color: "#FFFFFF", emissive: "#E0F2FE" }, // White (e.g. Sirius, Vega)
  F: { color: "#FEF08A", emissive: "#FACC15" }, // Yellow-White (e.g. Procyon)
  G: { color: "#FDE047", emissive: "#F59E0B" }, // Yellow (e.g. Sun, Alpha Centauri A)
  K: { color: "#FB923C", emissive: "#EA580C" }, // Orange (e.g. Alpha Centauri B, Epsilon Eridani)
  M: { color: "#F87171", emissive: "#DC2626" }, // Red Dwarf (e.g. Proxima, Barnard's Star)
  D: { color: "#E0E7FF", emissive: "#818CF8" }, // White Dwarf (e.g. Sirius B, Van Maanen)
};

export function getSpectralPalette(spectralClass?: string): { color: string; emissive: string } {
  if (!spectralClass) return SPECTRAL_COLOR_PALETTE.G;
  const spec = spectralClass.trim().toUpperCase();

  if (spec.startsWith("D") || spec.includes("DA") || spec.includes("DB")) {
    return SPECTRAL_COLOR_PALETTE.D;
  }

  const mainType = spec.charAt(0);
  return SPECTRAL_COLOR_PALETTE[mainType] || SPECTRAL_COLOR_PALETTE.G;
}

/**
 * Creates an interactive 3D mesh node for a star in the Stellar Neighborhood.
 */
export function createStarNeighborhoodNode(
  star: CelestialObject,
  scaleFactor: number = StellarNeighborhoodScale.UNITS_PER_PARSEC
): StarMeshNode {
  const isSun = star.slug === "sun";
  const group = new THREE.Group();
  group.name = `star-node-${star.slug}`;

  // 1. Position in Scene Space
  if (star.positional.cartesianCoordinatesPc) {
    const scenePos = StellarNeighborhoodScale.parsecsToSceneCoordinates(
      star.positional.cartesianCoordinatesPc,
      scaleFactor
    );
    group.position.set(scenePos.x, scenePos.y, scenePos.z);
  } else if (isSun) {
    group.position.set(0, 0, 0);
  }

  // 2. Visual Marker Size & Spectral Color
  const visualRadius = StellarNeighborhoodScale.calculateVisualMarkerRadius(
    star.physical.spectralClass,
    star.physical.absoluteMagnitudeV,
    isSun
  );

  const palette = getSpectralPalette(star.physical.spectralClass);

  // 3. Central Star Sphere
  const sphereGeo = new THREE.SphereGeometry(visualRadius, 24, 24);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(palette.color),
  });

  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.name = `star-body-${star.slug}`;
  mesh.userData = { starId: star.id, slug: star.slug, starObject: star };
  group.add(mesh);

  // 4. Stellar Corona Glow Effect
  const coronaGeo = new THREE.SphereGeometry(visualRadius * (isSun ? 1.5 : 1.35), 16, 16);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(palette.emissive),
    transparent: true,
    opacity: isSun ? 0.35 : 0.22,
    side: THREE.BackSide,
  });
  const corona = new THREE.Mesh(coronaGeo, coronaMat);
  group.add(corona);

  // 5. Selection Ring (Initially Hidden)
  const selRingGeo = new THREE.RingGeometry(visualRadius * 1.5, visualRadius * 1.68, 36);
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
    star,
    group,
    mesh,
    selectionRing,
    visualRadius,
    isSun,
  };
}

export function updateStarSelectionRing(node: StarMeshNode, isSelected: boolean): void {
  const mat = node.selectionRing.material as THREE.MeshBasicMaterial;
  mat.opacity = isSelected ? 0.95 : 0.0;
}
