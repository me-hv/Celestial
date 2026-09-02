import { describe, it, expect } from "vitest";
import { missionRepo } from "@/lib/data/mission-repository";
import { SOLAR_SYSTEM_IDS } from "@/lib/data/solar-system-data";

describe("Phase 11 MissionRepository", () => {
  it("should retrieve all missions and lookup by slug / ID", () => {
    const all = missionRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(15);

    const jwst = missionRepo.getBySlug("james-webb-space-telescope");
    expect(jwst).toBeDefined();
    expect(jwst?.id).toBe("mission-jwst");

    const cassini = missionRepo.getById("mission-cassini-huygens");
    expect(cassini).toBeDefined();
    expect(cassini?.slug).toBe("cassini-huygens");
  });

  it("should support filtering by agency, type, status, and search query", () => {
    const nasaMissions = missionRepo.getFiltered({ agency: "NASA" });
    expect(nasaMissions.length).toBeGreaterThan(0);

    const activeTelescopes = missionRepo.getFiltered({
      type: "SPACE_TELESCOPE",
      status: "ACTIVE",
    });
    expect(activeTelescopes.some((m) => m.id === "mission-jwst")).toBe(true);

    const searchVoyager = missionRepo.getFiltered({ search: "voyager" });
    expect(searchVoyager.length).toBeGreaterThanOrEqual(2);
  });

  it("should retrieve related sub-spacecraft, instruments, discoveries, events, and trajectories", () => {
    const cassiniCraft = missionRepo.getSpacecraftForMission("cassini-huygens");
    expect(cassiniCraft.length).toBe(2);

    const jwstInsts = missionRepo.getInstrumentsForMission("james-webb-space-telescope");
    expect(jwstInsts.length).toBeGreaterThanOrEqual(3);

    const cassiniDiscoveries = missionRepo.getDiscoveriesForMission("cassini-huygens");
    expect(cassiniDiscoveries.length).toBeGreaterThanOrEqual(2);

    const voyagerEvents = missionRepo.getEventsForMission("voyager-1");
    expect(voyagerEvents.length).toBeGreaterThanOrEqual(3);

    const voyagerTraj = missionRepo.getTrajectoryForMission("voyager-1");
    expect(voyagerTraj).toBeDefined();
    expect(voyagerTraj?.waypoints.length).toBeGreaterThanOrEqual(8);
  });

  it("should support bidirectional lookup of missions and discoveries by target object", () => {
    const saturnMissions = missionRepo.getMissionsForTarget(SOLAR_SYSTEM_IDS.SATURN);
    expect(saturnMissions.some((m) => m.id === "mission-cassini-huygens")).toBe(true);

    const saturnDiscoveries = missionRepo.getDiscoveriesForTarget(SOLAR_SYSTEM_IDS.SATURN);
    expect(saturnDiscoveries.some((d) => d.id === "disc-enceladus-plumes")).toBe(true);
  });

  it("should calculate correct aggregate mission statistics", () => {
    const stats = missionRepo.getStatistics();
    expect(stats.totalMissions).toBeGreaterThanOrEqual(15);
    expect(stats.activeMissions).toBeGreaterThan(0);
    expect(stats.planetaryMissions).toBeGreaterThan(0);
    expect(stats.spaceObservatories).toBeGreaterThan(0);
    expect(stats.totalDiscoveries).toBeGreaterThanOrEqual(5);
    expect(stats.mostDistantSpacecraft.name).toBe("Voyager 1");
  });
});
