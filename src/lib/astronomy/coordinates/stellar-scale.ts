import { CartesianCoordinatesPc } from "./astrometric-coordinates";

/**
 * Stellar Neighborhood Visualization Scale Engine
 *
 * Converts astronomical physical space (parsecs) to Three.js scene coordinates.
 * Reference Origin: Sun at (0, 0, 0).
 */

export interface SceneVector3 {
  x: number;
  y: number;
  z: number;
}

export class StellarNeighborhoodScale {
  // Base scale factor: 1 parsec = 4.0 Three.js world units
  // For a 25 pc radius neighborhood, the visual sphere radius is 100 Three.js units.
  public static readonly UNITS_PER_PARSEC = 4.0;

  /**
   * Transforms ICRS Cartesian coordinates (parsecs) into Three.js scene space.
   * Coordinate mapping:
   * - Scene X = ICRS X * scaleFactor
   * - Scene Y = ICRS Z * scaleFactor (Celestial North Pole is vertical in 3D scene)
   * - Scene Z = -ICRS Y * scaleFactor (ICRS Y mapped into depth)
   */
  public static parsecsToSceneCoordinates(
    coordPc: CartesianCoordinatesPc,
    scaleFactor: number = this.UNITS_PER_PARSEC
  ): SceneVector3 {
    return {
      x: Number((coordPc.x * scaleFactor).toFixed(4)),
      y: Number((coordPc.z * scaleFactor).toFixed(4)),
      z: Number((-coordPc.y * scaleFactor).toFixed(4)),
    };
  }

  /**
   * Transforms Three.js scene coordinates back to physical Cartesian parsecs.
   */
  public static sceneCoordinatesToParsecs(
    scenePos: SceneVector3,
    scaleFactor: number = this.UNITS_PER_PARSEC
  ): CartesianCoordinatesPc {
    return {
      x: Number((scenePos.x / scaleFactor).toFixed(4)),
      y: Number((-scenePos.z / scaleFactor).toFixed(4)),
      z: Number((scenePos.y / scaleFactor).toFixed(4)),
    };
  }

  /**
   * Calculates dynamic visual marker radius in Three.js units.
   *
   * Unlike orbital scales, stars in interstellar space cannot be rendered at literal physical radius
   * (e.g. 1 R_sun ≈ 2.25e-8 pc), which would render them invisible.
   * We apply a calibrated visual scale based on absolute magnitude / luminosity / spectral type:
   * - Giant / High-luminosity stars (e.g. Arcturus, Aldebaran, Sirius A): radius ~ 1.2 to 1.8 units
   * - Solar-type stars (Sun, Alpha Centauri A, Tau Ceti): radius ~ 0.85 units
   * - Orange dwarfs (Alpha Centauri B, Epsilon Eridani): radius ~ 0.65 units
   * - Red dwarfs (Proxima, Barnard's Star, TRAPPIST-1): radius ~ 0.45 units
   * - White dwarfs (Sirius B, Procyon B): radius ~ 0.35 units
   */
  public static calculateVisualMarkerRadius(
    spectralClass?: string,
    absoluteMagnitudeV?: number,
    isSun = false
  ): number {
    if (isSun) return 1.0;

    const spectral = (spectralClass || "G").trim().toUpperCase();

    // White dwarf check
    if (spectral.startsWith("D") || spectral.includes("DA") || spectral.includes("DB")) {
      return 0.38;
    }

    // Giant stars (luminosity class III / II / I)
    if (
      spectral.includes("III") ||
      spectral.includes("II") ||
      spectral.includes("IB") ||
      spectral.includes("IA")
    ) {
      return 1.75;
    }

    // Spectral Class primary classification
    const mainType = spectral.charAt(0);
    switch (mainType) {
      case "O":
      case "B":
        return 1.6;
      case "A":
        return 1.35;
      case "F":
        return 1.05;
      case "G":
        return 0.85;
      case "K":
        return 0.65;
      case "M":
        return 0.48;
      default:
        break;
    }

    // Fallback based on absolute visual magnitude
    if (absoluteMagnitudeV !== undefined) {
      // M_V ranges from ~-5 (supergiants) to +18 (dim red dwarfs)
      const clampedMag = Math.max(-5, Math.min(18, absoluteMagnitudeV));
      // Inverse linear interpolation
      return Number((1.8 - (clampedMag + 5) * (1.35 / 23)).toFixed(2));
    }

    return 0.7;
  }
}
