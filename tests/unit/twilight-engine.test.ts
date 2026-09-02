import { describe, it, expect } from "vitest";
import { getInstantaneousTwilight } from "@/lib/astronomy/observation/twilight";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Twilight Engine", () => {
  const greenwich = PRESET_OBSERVER_LOCATIONS[0]; // Lat 51.47° N, Lon 0.0°

  it("identifies DAY when solar altitude is well above horizon", () => {
    // Summer noon at Greenwich: June 21, 12:00 UTC
    const summerNoon = new Date(Date.UTC(2026, 5, 21, 12, 0, 0));
    const twilight = getInstantaneousTwilight(greenwich, summerNoon);

    expect(twilight.state).toBe("DAY");
    expect(twilight.solarAltitudeDeg).toBeGreaterThan(50.0);
    expect(twilight.isDarkSky).toBe(false);
  });

  it("identifies NIGHT when solar altitude is below -18°", () => {
    // Winter midnight at Greenwich: Dec 21, 00:00 UTC
    const winterMidnight = new Date(Date.UTC(2026, 11, 21, 0, 0, 0));
    const twilight = getInstantaneousTwilight(greenwich, winterMidnight);

    expect(twilight.state).toBe("NIGHT");
    expect(twilight.solarAltitudeDeg).toBeLessThan(-18.0);
    expect(twilight.isDarkSky).toBe(true);
  });

  it("returns sky dome colors appropriate for the twilight state", () => {
    const noon = new Date(Date.UTC(2026, 5, 21, 12, 0, 0));
    const dayState = getInstantaneousTwilight(greenwich, noon);
    expect(dayState.skyDomeColor).toBe("#0C2340");

    const midnight = new Date(Date.UTC(2026, 11, 21, 0, 0, 0));
    const nightState = getInstantaneousTwilight(greenwich, midnight);
    expect(nightState.skyDomeColor).toBe("#030712");
  });
});
