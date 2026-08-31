import { CartesianCoordinatesPc } from "./astrometric-coordinates";

export interface SkyProjection2D {
  x: number; // Normalized horizontal coordinate [-180, +180] or pixel coordinate
  y: number; // Normalized vertical coordinate [-90, +90]
  raHoursFormatted: string; // e.g. "00h 42m 44s"
  decDegFormatted: string; // e.g. "+41° 16' 09''"
}

export class DeepSkyScale {
  /**
   * Adaptive 3D spatial scale mapping:
   * Maps physical distances ranging from 100 pc to 50 Mpc into a Three.js scene radius [10, 300] units.
   * Uses piecewise logarithmic compression to maintain depth order while preventing clipping.
   */
  public static parsecsToDeepSkyScene(
    cartesianPc: CartesianCoordinatesPc,
    distanceLy: number
  ): { x: number; y: number; z: number; visualDistanceUnits: number } {
    const rawDistPc = Math.sqrt(cartesianPc.x ** 2 + cartesianPc.y ** 2 + cartesianPc.z ** 2);

    if (rawDistPc === 0) {
      return { x: 0, y: 0, z: 0, visualDistanceUnits: 0 };
    }

    // Direction unit vector
    const dirX = cartesianPc.x / rawDistPc;
    const dirY = cartesianPc.y / rawDistPc;
    const dirZ = cartesianPc.z / rawDistPc;

    // Piecewise adaptive distance mapping
    // - Local Milky Way objects (< 50,000 ly): visual radius 15..90 units
    // - Magellanic Clouds & Local Group (< 3,000,000 ly): visual radius 100..200 units
    // - Distant Galaxies (> 3,000,000 ly): visual radius 210..300 units
    let visualRadius: number;
    if (distanceLy <= 50000) {
      visualRadius = 15 + Math.log10(Math.max(10, distanceLy)) * 16;
    } else if (distanceLy <= 3000000) {
      visualRadius = 90 + Math.log10(distanceLy / 50000) * 60;
    } else {
      visualRadius = 200 + Math.log10(distanceLy / 3000000) * 50;
    }

    // Cap visual radius to avoid clipping
    visualRadius = Math.min(320, Math.max(10, visualRadius));

    // Three.js coordinate system mapping:
    // +X -> +X (Vernal Equinox)
    // +Y -> +Z (North Celestial Pole -> Scene Vertical)
    // +Z -> -Y (ICRS Y -> Screen depth)
    return {
      x: Number((dirX * visualRadius).toFixed(3)),
      y: Number((dirZ * visualRadius).toFixed(3)),
      z: Number((-dirY * visualRadius).toFixed(3)),
      visualDistanceUnits: Number(visualRadius.toFixed(2)),
    };
  }

  /**
   * Projects equatorial coordinates (RA, Dec) onto a 2D equirectangular sky projection.
   */
  public static equatorialTo2DSky(raDeg: number, decDeg: number): SkyProjection2D {
    // RA [0, 360) -> Map to [-180, 180] centered on RA 0h / 12h
    let x = raDeg > 180 ? raDeg - 360 : raDeg;
    const y = Math.max(-90, Math.min(90, decDeg));

    // Format RA to HH:MM:SS
    const totalHours = raDeg / 15.0;
    const h = Math.floor(totalHours);
    const m = Math.floor((totalHours - h) * 60);
    const s = Math.floor(((totalHours - h) * 60 - m) * 60);
    const raHoursFormatted = `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;

    // Format Dec to +/-DD:MM:SS
    const sign = decDeg >= 0 ? "+" : "-";
    const absDec = Math.abs(decDeg);
    const d = Math.floor(absDec);
    const dm = Math.floor((absDec - d) * 60);
    const ds = Math.floor(((absDec - d) * 60 - dm) * 60);
    const decDegFormatted = `${sign}${String(d).padStart(2, "0")}° ${String(dm).padStart(2, "0")}' ${String(ds).padStart(2, "0")}''`;

    return {
      x: Number(x.toFixed(4)),
      y: Number(y.toFixed(4)),
      raHoursFormatted,
      decDegFormatted,
    };
  }

  /**
   * Calculates magnitude-dependent visual marker radius & opacity.
   * Brighter objects (lower magnitude, e.g. M31 mag 3.44 vs M101 mag 7.9) have larger markers.
   */
  public static calculateMagnitudeScaling(
    apparentMag?: number,
    objectType: string = "GALAXY"
  ): { radius: number; opacity: number } {
    const mag = apparentMag ?? 8.0;

    // Inverted log-linear magnitude scaling
    // Mag -1 -> radius 4.5, Mag 4 -> radius 3.0, Mag 9 -> radius 1.5, Mag 15 -> radius 0.8
    const baseRadius = Math.max(0.9, 4.0 - (mag - 3.0) * 0.28);
    const opacity = Math.max(0.4, Math.min(1.0, 1.0 - (mag - 2.0) * 0.05));

    // Scale bonus for extended objects (Galaxies, Nebulae)
    const typeMultiplier =
      objectType === "GALAXY"
        ? 1.3
        : objectType === "NEBULA"
          ? 1.2
          : objectType === "STAR_CLUSTER"
            ? 1.15
            : 1.0;

    return {
      radius: Number((baseRadius * typeMultiplier).toFixed(2)),
      opacity: Number(opacity.toFixed(2)),
    };
  }
}
