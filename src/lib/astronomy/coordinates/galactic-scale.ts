import { GalactocentricCoordinates, GALACTOCENTRIC_CONSTANTS } from "./galactocentric";

export class GalacticScale {
  public static readonly KPC_TO_SCENE_UNITS = 10.0; // 1 kpc = 10 units in Milky Way scene
  public static readonly MPC_TO_LOCAL_GROUP_UNITS = 100.0; // 1 Mpc = 100 units in Local Group scene

  /**
   * Converts Galactocentric Cartesian coordinates (in parsecs) to 3D Three.js Scene coordinates.
   */
  public static galactocentricToScene(coord: GalactocentricCoordinates): {
    x: number;
    y: number;
    z: number;
  } {
    const xKpc = coord.xPc / 1000.0;
    const yKpc = coord.yPc / 1000.0;
    const zKpc = coord.zPc / 1000.0;

    // Three.js: X is in-plane X, Y is vertical Z, Z is in-plane Y (or standard X-Z plane)
    // Here we use standard astronomical X-Z plane for the galactic disc (Y as vertical height)
    return {
      x: xKpc * GalacticScale.KPC_TO_SCENE_UNITS,
      y: zKpc * GalacticScale.KPC_TO_SCENE_UNITS * 2.5, // Subtle vertical stretch for disk scale height visibility
      z: yKpc * GalacticScale.KPC_TO_SCENE_UNITS,
    };
  }

  /**
   * Converts 2D Galactocentric coordinates (X, Y in kpc) to 2D Top-Down canvas coordinates.
   */
  public static galactocentricToMap2D(
    xKpc: number,
    yKpc: number,
    canvasWidth: number,
    canvasHeight: number,
    zoom: number = 1.0,
    pan: { x: number; y: number } = { x: 0, y: 0 }
  ): { x: number; y: number } {
    const centerX = canvasWidth / 2 + pan.x;
    const centerY = canvasHeight / 2 + pan.y;

    // 25 kpc radius fits comfortably in 85% of smaller dimension
    const basePixelsPerKpc = (Math.min(canvasWidth, canvasHeight) * 0.42) / 25.0;
    const scale = basePixelsPerKpc * zoom;

    // Galactocentric +X points right, +Y points up
    return {
      x: centerX + xKpc * scale,
      y: centerY - yKpc * scale,
    };
  }

  /**
   * Scene coordinates of the Sun in Milky Way 3D Space.
   */
  public static getSunScenePosition(): { x: number; y: number; z: number } {
    const sunKpc = -GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC / 1000.0;
    const zKpc = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC / 1000.0;
    return {
      x: sunKpc * GalacticScale.KPC_TO_SCENE_UNITS,
      y: zKpc * GalacticScale.KPC_TO_SCENE_UNITS * 2.5,
      z: 0.0,
    };
  }
}
