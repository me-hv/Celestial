/**
 * Cosmic Scale Conversion & Coordinate Projectors
 */

export const COSMIC_SCALING = {
  UNITS_PER_MPC: 2.0, // 1 Mpc = 2.0 Three.js World Units (Virgo at 33, Coma at 198, Shapley at 400)
  MIN_NODE_RENDER_RADIUS: 0.8,
  MAX_NODE_RENDER_RADIUS: 16.0,
  REFERENCE_SHELLS_MPC: [10, 25, 50, 100, 200, 300],
} as const;

export type CosmicMapScalePreset =
  | "LOCAL_VOLUME" // +/- 15 Mpc (Local Group, M81, Sculptor, Maffei, Centaurus A)
  | "LOCAL_SUPERCLUSTER" // +/- 50 Mpc (Virgo Cluster, Fornax Cluster, Local Sheet, Local Void)
  | "LANIAKEA" // +/- 150 Mpc (Centaurus, Hydra, Coma, Perseus-Pisces, Great Attractor)
  | "COSMIC_WEB"; // +/- 350 Mpc (Shapley, Boötes Void, Sloan Great Wall)

export const SCALE_PRESET_BOUNDS_MPC: Record<CosmicMapScalePreset, number> = {
  LOCAL_VOLUME: 15,
  LOCAL_SUPERCLUSTER: 50,
  LANIAKEA: 150,
  COSMIC_WEB: 350,
};

/**
 * Maps Galactocentric Megaparsec Cartesian coordinates to 3D Three.js scene position.
 */
export function cosmicMpcToScene3D(
  xMpc: number,
  yMpc: number,
  zMpc: number,
  scale: number = COSMIC_SCALING.UNITS_PER_MPC
): [number, number, number] {
  return [xMpc * scale, zMpc * scale, -yMpc * scale]; // Y-up in Three.js, +Z out
}

/**
 * Maps Supergalactic Cartesian coordinates to 3D Three.js scene position.
 */
export function supergalacticMpcToScene3D(
  sgxMpc: number,
  sgyMpc: number,
  sgzMpc: number,
  scale: number = COSMIC_SCALING.UNITS_PER_MPC
): [number, number, number] {
  // Supergalactic Plane (SGZ=0) maps to X-Z horizontal floor in Three.js (Y is Supergalactic Pole)
  return [sgxMpc * scale, sgzMpc * scale, -sgyMpc * scale];
}

/**
 * Maps Supergalactic or Galactocentric Megaparsec coordinates to 2D canvas pixel coordinates.
 */
export function cosmicMpcToCanvas2D(
  xMpc: number,
  yMpc: number,
  canvasWidth: number,
  canvasHeight: number,
  maxMpcSpan: number,
  zoom: number = 1.0,
  panOffsetX: number = 0,
  panOffsetY: number = 0
): { px: number; py: number; isVisible: boolean } {
  const halfMin = Math.min(canvasWidth, canvasHeight) * 0.45;
  const pixelsPerMpc = (halfMin / maxMpcSpan) * zoom;

  const centerX = canvasWidth / 2 + panOffsetX;
  const centerY = canvasHeight / 2 + panOffsetY;

  const px = centerX + xMpc * pixelsPerMpc;
  const py = centerY - yMpc * pixelsPerMpc; // Invert Y for screen space

  const isVisible = px >= -100 && px <= canvasWidth + 100 && py >= -100 && py <= canvasHeight + 100;

  return { px, py, isVisible };
}

/**
 * Calculates visually proportional render radius for a cosmic structure node in Three.js.
 */
export function getStructureRenderRadius(
  structureType: string,
  characteristicRadiusMpc: number = 1.0
): number {
  switch (structureType) {
    case "GALAXY_GROUP":
      return Math.max(1.2, characteristicRadiusMpc * 0.8);
    case "GALAXY_CLUSTER":
      return Math.max(2.5, characteristicRadiusMpc * 1.0);
    case "SUPERCLUSTER":
      return Math.max(5.0, characteristicRadiusMpc * 0.5);
    case "VOID":
      return Math.max(6.0, characteristicRadiusMpc * 0.6);
    case "WALL":
    case "SHEET":
      return Math.max(3.0, characteristicRadiusMpc * 0.4);
    default:
      return 1.5;
  }
}
