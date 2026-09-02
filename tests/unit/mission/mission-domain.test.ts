import { describe, it, expect } from "vitest";
import {
  SpaceMissionSchema,
  SpacecraftSchema,
  MissionInstrumentSchema,
  ScientificDiscoverySchema,
  MissionEventSchema,
  MissionTrajectorySchema,
} from "@/domain/mission/schema";
import {
  SPACE_MISSIONS,
  SPACECRAFT_DATA,
  MISSION_INSTRUMENTS,
  SCIENTIFIC_DISCOVERIES,
  MISSION_EVENTS,
  MISSION_TRAJECTORIES,
} from "@/lib/data/mission-data";
import { TrajectoryMath } from "@/lib/astronomy/mission/trajectory-math";

describe("Phase 11 Mission Domain & Zod Validation", () => {
  it("should successfully validate all curated Space Missions against SpaceMissionSchema", () => {
    expect(SPACE_MISSIONS.length).toBeGreaterThanOrEqual(15);
    for (const mission of SPACE_MISSIONS) {
      const parsed = SpaceMissionSchema.safeParse(mission);
      expect(parsed.success).toBe(true);
    }
  });

  it("should successfully validate all curated Spacecraft against SpacecraftSchema", () => {
    expect(SPACECRAFT_DATA.length).toBeGreaterThanOrEqual(8);
    for (const sc of SPACECRAFT_DATA) {
      const parsed = SpacecraftSchema.safeParse(sc);
      expect(parsed.success).toBe(true);
    }
  });

  it("should successfully validate all curated Instruments against MissionInstrumentSchema", () => {
    expect(MISSION_INSTRUMENTS.length).toBeGreaterThanOrEqual(8);
    for (const inst of MISSION_INSTRUMENTS) {
      const parsed = MissionInstrumentSchema.safeParse(inst);
      expect(parsed.success).toBe(true);
    }
  });

  it("should successfully validate all curated Discoveries against ScientificDiscoverySchema", () => {
    expect(SCIENTIFIC_DISCOVERIES.length).toBeGreaterThanOrEqual(5);
    for (const disc of SCIENTIFIC_DISCOVERIES) {
      const parsed = ScientificDiscoverySchema.safeParse(disc);
      expect(parsed.success).toBe(true);
    }
  });

  it("should successfully validate all curated Events against MissionEventSchema", () => {
    expect(MISSION_EVENTS.length).toBeGreaterThanOrEqual(8);
    for (const evt of MISSION_EVENTS) {
      const parsed = MissionEventSchema.safeParse(evt);
      expect(parsed.success).toBe(true);
    }
  });

  it("should successfully validate all Trajectories against MissionTrajectorySchema", () => {
    expect(MISSION_TRAJECTORIES.length).toBeGreaterThanOrEqual(4);
    for (const traj of MISSION_TRAJECTORIES) {
      const parsed = MissionTrajectorySchema.safeParse(traj);
      expect(parsed.success).toBe(true);
    }
  });
});

describe("Phase 11 TrajectoryMath Calculations", () => {
  const voyagerTraj = MISSION_TRAJECTORIES.find((t) => t.id === "traj-voyager-1")!;

  it("should generate a valid 3D spline curve with requested points", () => {
    const curve = TrajectoryMath.createSplineCurve(voyagerTraj.waypoints, 10.0);
    expect(curve).toBeDefined();
    const points = curve.getPoints(50);
    expect(points.length).toBe(51);
  });

  it("should accurately interpolate start, middle, and end progress states", () => {
    const start = TrajectoryMath.interpolateProgress(voyagerTraj, 0.0);
    expect(start.currentWaypointIndex).toBe(0);
    expect(start.currentWaypoint.timestamp).toBe("1977-09-05");

    const end = TrajectoryMath.interpolateProgress(voyagerTraj, 1.0);
    expect(end.currentWaypointIndex).toBe(voyagerTraj.waypoints.length - 2);
    expect(end.segmentProgress).toBeCloseTo(1.0, 3);

    const mid = TrajectoryMath.interpolateProgress(voyagerTraj, 0.5);
    expect(mid.position).toBeDefined();
    expect(mid.currentDistanceAu).toBeGreaterThan(0);
  });
});
