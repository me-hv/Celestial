import { describe, it, expect } from "vitest";
import {
  projectHorizontalTo2D,
  unproject2DToHorizontal,
  ProjectionViewport,
} from "@/lib/astronomy/coordinates/projections";

describe("Astronomical Projections Engine", () => {
  const viewport: ProjectionViewport = {
    centerX: 400,
    centerY: 400,
    maxRadius: 300,
    zoom: 1.0,
  };

  it("correctly projects Zenith (Alt = 90°) to the exact viewport center", () => {
    const ptEqui = projectHorizontalTo2D(90, 0, viewport, "AZIMUTHAL_EQUIDISTANT");
    expect(ptEqui.x).toBeCloseTo(400, 1);
    expect(ptEqui.y).toBeCloseTo(400, 1);

    const ptStereo = projectHorizontalTo2D(90, 0, viewport, "STEREOGRAPHIC");
    expect(ptStereo.x).toBeCloseTo(400, 1);
    expect(ptStereo.y).toBeCloseTo(400, 1);

    const ptOrtho = projectHorizontalTo2D(90, 0, viewport, "ORTHOGRAPHIC");
    expect(ptOrtho.x).toBeCloseTo(400, 1);
    expect(ptOrtho.y).toBeCloseTo(400, 1);
  });

  it("correctly projects Cardinal Horizons (Alt = 0°)", () => {
    // North (Az = 0°): should be at top (y = centerY - R = 100, x = 400)
    const ptNorth = projectHorizontalTo2D(0, 0, viewport, "AZIMUTHAL_EQUIDISTANT");
    expect(ptNorth.x).toBeCloseTo(400, 1);
    expect(ptNorth.y).toBeCloseTo(100, 1);

    // East (Az = 90°): should be at Left in astronomical convention (x = centerX - R = 100, y = 400)
    const ptEast = projectHorizontalTo2D(0, 90, viewport, "AZIMUTHAL_EQUIDISTANT");
    expect(ptEast.x).toBeCloseTo(100, 1);
    expect(ptEast.y).toBeCloseTo(400, 1);

    // South (Az = 180°): should be at Bottom (y = centerY + R = 700, x = 400)
    const ptSouth = projectHorizontalTo2D(0, 180, viewport, "AZIMUTHAL_EQUIDISTANT");
    expect(ptSouth.x).toBeCloseTo(400, 1);
    expect(ptSouth.y).toBeCloseTo(700, 1);

    // West (Az = 270°): should be at Right (x = centerX + R = 700, y = 400)
    const ptWest = projectHorizontalTo2D(0, 270, viewport, "AZIMUTHAL_EQUIDISTANT");
    expect(ptWest.x).toBeCloseTo(700, 1);
    expect(ptWest.y).toBeCloseTo(400, 1);
  });

  it("handles inverse unprojection back to horizontal coordinates", () => {
    const originalAlt = 45;
    const originalAz = 135;

    const projected = projectHorizontalTo2D(originalAlt, originalAz, viewport, "AZIMUTHAL_EQUIDISTANT");
    const unprojected = unproject2DToHorizontal(projected.x, projected.y, viewport, "AZIMUTHAL_EQUIDISTANT");

    expect(unprojected.altDeg).toBeCloseTo(originalAlt, 0);
    expect(unprojected.azDeg).toBeCloseTo(originalAz, 0);
  });
});
