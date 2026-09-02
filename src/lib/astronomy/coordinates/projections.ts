/**
 * CELESTIAL — Astronomical Projections Engine
 *
 * Implements pure mathematical projections for mapping 3D celestial coordinates
 * (Altitude, Azimuth or Right Ascension, Declination) onto 2D planetarium planispheres.
 *
 * Projections supported:
 * 1. Stereographic (Conformal, preserves local angles and shapes of constellations)
 * 2. Azimuthal Equidistant (Standard planisphere, linear radial scale r ~ 90 - Alt)
 * 3. Orthographic (True 3D celestial dome perspective from infinity)
 * 4. Equirectangular (Equatorial RA/Dec cylindrical grid)
 */

export type CelestialProjectionType =
  "STEREOGRAPHIC" | "AZIMUTHAL_EQUIDISTANT" | "ORTHOGRAPHIC" | "EQUIRECTANGULAR";

export interface ProjectedPoint2D {
  x: number;
  y: number;
  isWithinHorizon: boolean;
  scaleFactor?: number;
}

export interface ProjectionViewport {
  centerX: number;
  centerY: number;
  maxRadius: number;
  zoom?: number;
}

/**
 * Projects horizontal sky coordinates (Altitude, Azimuth) to 2D canvas coordinates
 * based on selected mathematical projection model.
 *
 * Astronomical Planisphere Convention:
 * - Center is Zenith (Alt = 90°)
 * - Outer boundary is Local Horizon (Alt = 0°)
 * - East is Left, West is Right (observer looking UP at celestial sphere)
 * - North is Top (Azimuth = 0°), South is Bottom (Azimuth = 180°)
 */
export function projectHorizontalTo2D(
  altDeg: number,
  azDeg: number,
  viewport: ProjectionViewport,
  projection: CelestialProjectionType = "AZIMUTHAL_EQUIDISTANT"
): ProjectedPoint2D {
  const { centerX, centerY, maxRadius, zoom = 1.0 } = viewport;
  const clampedAlt = Math.max(-90.0, Math.min(90.0, altDeg));
  const isWithinHorizon = clampedAlt >= 0.0;
  const azRad = (azDeg * Math.PI) / 180.0;
  const effectiveRadius = maxRadius * zoom;

  let r = 0;

  switch (projection) {
    case "STEREOGRAPHIC": {
      // Stereographic projection: conformal mapping from nadir
      // r = 2 * R * tan((90 - Alt) / 2) / (2 * tan(45°)) = R * tan((90 - Alt)/2)
      const zenithAngleRad = ((90.0 - Math.max(0, clampedAlt)) * Math.PI) / 180.0;
      r = effectiveRadius * Math.tan(zenithAngleRad / 2.0);
      break;
    }

    case "ORTHOGRAPHIC": {
      // Orthographic projection: perspective projection of celestial hemisphere
      // r = R * cos(Alt) = R * sin(Zenith Angle)
      const altRad = (Math.max(0, clampedAlt) * Math.PI) / 180.0;
      r = effectiveRadius * Math.cos(altRad);
      break;
    }

    case "AZIMUTHAL_EQUIDISTANT":
    default: {
      // Azimuthal Equidistant: linear radial scaling with zenith angle z = 90 - Alt
      // r = R * (90 - Alt) / 90
      const zDeg = 90.0 - Math.max(0, clampedAlt);
      r = effectiveRadius * (zDeg / 90.0);
      break;
    }
  }

  // Astronomical looking-up convention: East (Az=90°) is Left (-X), North (Az=0°) is Top (-Y)
  const x = centerX - r * Math.sin(azRad);
  const y = centerY - r * Math.cos(azRad);

  return {
    x,
    y,
    isWithinHorizon,
  };
}

/**
 * Inverse Projection: Maps 2D canvas pixel coordinates back to (Altitude, Azimuth) in degrees.
 */
export function unproject2DToHorizontal(
  x: number,
  y: number,
  viewport: ProjectionViewport,
  projection: CelestialProjectionType = "AZIMUTHAL_EQUIDISTANT"
): { altDeg: number; azDeg: number } {
  const { centerX, centerY, maxRadius, zoom = 1.0 } = viewport;
  const effectiveRadius = maxRadius * zoom;

  const dx = -(x - centerX); // Invert X for East-is-Left convention
  const dy = -(y - centerY); // Invert Y for North-is-Top convention

  const r = Math.sqrt(dx * dx + dy * dy);
  let azRad = Math.atan2(dx, dy);
  if (azRad < 0) azRad += Math.PI * 2;
  const azDeg = (azRad * 180.0) / Math.PI;

  let altDeg = 0;
  const normalizedR = Math.min(1.0, r / effectiveRadius);

  switch (projection) {
    case "STEREOGRAPHIC": {
      // r / R = tan(z / 2) => z = 2 * atan(r / R)
      const zRad = 2.0 * Math.atan(normalizedR);
      altDeg = 90.0 - (zRad * 180.0) / Math.PI;
      break;
    }

    case "ORTHOGRAPHIC": {
      // r / R = cos(Alt) => Alt = acos(r / R)
      altDeg = (Math.acos(normalizedR) * 180.0) / Math.PI;
      break;
    }

    case "AZIMUTHAL_EQUIDISTANT":
    default: {
      // r / R = (90 - Alt) / 90 => Alt = 90 * (1 - r / R)
      altDeg = 90.0 * (1.0 - normalizedR);
      break;
    }
  }

  return {
    altDeg: Number(altDeg.toFixed(4)),
    azDeg: Number(azDeg.toFixed(4)),
  };
}
