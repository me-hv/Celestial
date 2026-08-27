/**
 * Coordinate Transformation & Visual Scaling Engine
 */

export interface VisualizationVector3 {
  x: number;
  y: number;
  z: number;
}

// Visual scaling factor: 1 AU in scientific scale maps to ~30 Three.js units at base orbit
export const VISUAL_DISTANCE_SCALE = 32.0;

/**
 * Transforms scientific Heliocentric Ecliptic coordinates (AU) to Three.js visualization space.
 * In Three.js, Y is typically vertical (up), whereas in astronomical ecliptic coordinates,
 * Z is the pole perpendicular to the ecliptic plane.
 */
export function heliocentricToVisualCoordinates(
  xAu: number,
  yAu: number,
  zAu: number,
  scaleFactor: number = VISUAL_DISTANCE_SCALE
): VisualizationVector3 {
  // Non-linear compression for distant outer planets (e.g. Neptune at 30 AU)
  // Distance function: d_visual = scaleFactor * sqrt(d_AU) * 1.5 + (d_AU * 4.0)
  const d_au = Math.sqrt(xAu * xAu + yAu * yAu + zAu * zAu);
  if (d_au === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  // Preserve direction vector, scale radius proportionally
  const normalizedX = xAu / d_au;
  const normalizedY = yAu / d_au;
  const normalizedZ = zAu / d_au;

  // Calibrated visualization curve: keeps Mercury-Mars distinguishable while pulling Jupiter-Neptune into viewport
  const visualDistance = Math.pow(d_au, 0.72) * scaleFactor;

  return {
    x: normalizedX * visualDistance,
    y: normalizedZ * visualDistance, // Ecliptic inclination mapped to vertical Y
    z: -normalizedY * visualDistance, // Ecliptic Y mapped to scene -Z
  };
}

/**
 * Computes calibrated visual radius for 3D meshes (in Three.js world units)
 * based on true physical radius in km.
 */
export function computeVisualRadius(radiusKm?: number, isStar = false, isMoon = false): number {
  if (!radiusKm) return 0.5;

  if (isStar) {
    // Sun visual radius
    return 4.2;
  }

  if (isMoon) {
    // Moon visual radius relative to Earth
    return 0.35;
  }

  // Planetary bodies: smooth log scaling so Mercury (2439km) to Jupiter (69911km) remain balanced
  // Mercury ~ 0.5, Earth ~ 0.85, Jupiter ~ 2.4
  const baseScale = Math.log10(radiusKm) * 1.1 - 3.2;
  return Math.max(0.45, Math.min(baseScale, 2.6));
}
