import { LocalGroupCoordinates } from "./local-group";

export class LocalGroupScale {
  public static readonly KPC_TO_SCENE_UNITS = 0.1; // 1 kpc = 0.1 units (1 Mpc = 100 scene units)

  /**
   * Converts Local Group Galactocentric Cartesian coordinates (in kpc) to 3D Three.js scene coordinates.
   */
  public static localGroupToScene(coord: LocalGroupCoordinates): {
    x: number;
    y: number;
    z: number;
  } {
    return {
      x: coord.xKpc * LocalGroupScale.KPC_TO_SCENE_UNITS,
      y: coord.zKpc * LocalGroupScale.KPC_TO_SCENE_UNITS, // Y as vertical axis in Three.js
      z: coord.yKpc * LocalGroupScale.KPC_TO_SCENE_UNITS,
    };
  }

  /**
   * Converts 2D Local Group Cartesian coordinates (X, Y in kpc) to 2D Top-Down canvas pixels.
   */
  public static localGroupToMap2D(
    xKpc: number,
    yKpc: number,
    canvasWidth: number,
    canvasHeight: number,
    zoom: number = 1.0,
    pan: { x: number; y: number } = { x: 0, y: 0 }
  ): { x: number; y: number } {
    const centerX = canvasWidth / 2 + pan.x;
    const centerY = canvasHeight / 2 + pan.y;

    // 1.5 Mpc (1500 kpc) fits in 80% of canvas
    const basePixelsPerKpc = (Math.min(canvasWidth, canvasHeight) * 0.4) / 1200.0;
    const scale = basePixelsPerKpc * zoom;

    return {
      x: centerX + xKpc * scale,
      y: centerY - yKpc * scale,
    };
  }
}
