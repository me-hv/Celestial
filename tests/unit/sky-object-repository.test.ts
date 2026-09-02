import { describe, it, expect } from "vitest";
import { skyObjectRepo } from "@/lib/data/sky-object-repository";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { SkyObjectObservationSchema } from "@/domain/observer/schema";

describe("Sky Object Repository & Dynamic Alt/Az Resolver", () => {
  const testLocation = PRESET_OBSERVER_LOCATIONS[0]; // Greenwich

  it("computes live observation for Moon", () => {
    const moonObs = skyObjectRepo.getSkyObservation("moon", testLocation);
    expect(moonObs).toBeDefined();
    expect(moonObs?.canonicalName).toBe("Moon");
    expect(moonObs?.type).toBe("MOON");
    expect(moonObs?.horizontal).toBeDefined();

    const parsed = SkyObjectObservationSchema.safeParse(moonObs);
    expect(parsed.success).toBe(true);
  });

  it("computes live observation for a major planet (Jupiter)", () => {
    const jupiterObs = skyObjectRepo.getSkyObservation("jupiter", testLocation);
    expect(jupiterObs).toBeDefined();
    expect(jupiterObs?.canonicalName).toBe("Jupiter");
    expect(jupiterObs?.type).toBe("PLANET");
    expect(jupiterObs?.horizontal.altitudeDeg).toBeDefined();
    expect(jupiterObs?.horizontal.azimuthDeg).toBeDefined();
  });

  it("computes live observation for a star (Sirius)", () => {
    const siriusObs = skyObjectRepo.getSkyObservation("sirius-a", testLocation);
    expect(siriusObs).toBeDefined();
    expect(siriusObs?.canonicalName).toBe("Sirius A");
    expect(siriusObs?.constellation).toBe("Canis Major");
    expect(siriusObs?.apparentMagnitudeV).toBeCloseTo(-1.46, 1);
  });

  it("computes live observation for a deep-sky object (M31 Andromeda)", () => {
    const m31Obs = skyObjectRepo.getSkyObservation("m31-andromeda-galaxy", testLocation);
    expect(m31Obs).toBeDefined();
    expect(m31Obs?.type).toBe("GALAXY");
    expect(m31Obs?.constellation).toBe("Andromeda");
  });

  it("retrieves and filters visible sky objects", () => {
    const all = skyObjectRepo.getVisibleSkyObjects(testLocation, new Date());
    expect(all.length).toBeGreaterThan(15);

    // Magnitude limit filter
    const brightOnly = skyObjectRepo.getVisibleSkyObjects(testLocation, new Date(), {
      maxMagnitudeV: 2.0,
    });
    expect(brightOnly.length).toBeLessThan(all.length);
    brightOnly.forEach((o) => {
      if (o.apparentMagnitudeV !== undefined) {
        expect(o.apparentMagnitudeV).toBeLessThanOrEqual(2.0);
      }
    });
  });

  it("searches sky objects by name, designation, and constellation", () => {
    const searchBetelgeuse = skyObjectRepo.searchSky("Betelgeuse", testLocation);
    expect(searchBetelgeuse.some((o) => o.canonicalName.includes("Betelgeuse"))).toBe(true);

    const searchOrion = skyObjectRepo.searchSky("Orion", testLocation);
    expect(searchOrion.length).toBeGreaterThan(0);
  });

  it("ensures all visible sky objects have unique objectIds across all preset locations", () => {
    PRESET_OBSERVER_LOCATIONS.forEach((loc) => {
      const visible = skyObjectRepo.getVisibleSkyObjects(loc, new Date());
      const seenIds = new Set<string>();
      visible.forEach((obs) => {
        if (seenIds.has(obs.objectId)) {
          throw new Error(
            `Duplicate objectId ${obs.objectId} found for visible object ${obs.canonicalName} at ${loc.name}`
          );
        }
        seenIds.add(obs.objectId);
      });
    });
  });
});
