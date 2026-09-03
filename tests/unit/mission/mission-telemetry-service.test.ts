import { describe, it, expect } from "vitest";
import { missionTelemetryService } from "@/domain/mission/mission-telemetry-service";

describe("Mission Telemetry Service", () => {
  it("computes accurate astrodynamic telemetry for Voyager 1", () => {
    const telemetry = missionTelemetryService.getTelemetryForMission("voyager-1");
    expect(telemetry).not.toBeNull();
    if (!telemetry) return;

    expect(telemetry.telemetryState).toBe("MODEL_DERIVED");
    expect(telemetry.distanceFromSunAu).toBeGreaterThan(160);
    expect(telemetry.velocityKmS).toBeCloseTo(16.99, 1);
    expect(telemetry.lightTimeMinutes).toBeGreaterThan(1300); // ~22+ hours
    expect(telemetry.communicationState).toBe("LOCKED");
    expect(telemetry.sourceStation).toContain("Canberra");
    expect(telemetry.provenance?.authoritativeBody).toBe("NASA");
  });

  it("computes accurate astrodynamic telemetry for Voyager 2", () => {
    const telemetry = missionTelemetryService.getTelemetryForMission("voyager-2");
    expect(telemetry).not.toBeNull();
    if (!telemetry) return;

    expect(telemetry.telemetryState).toBe("MODEL_DERIVED");
    expect(telemetry.distanceFromSunAu).toBeGreaterThan(130);
    expect(telemetry.velocityKmS).toBeCloseTo(15.34, 1);
    expect(telemetry.lightTimeMinutes).toBeGreaterThan(1000);
  });

  it("returns historical state for completed planetary missions", () => {
    const telemetry = missionTelemetryService.getTelemetryForMission("chandrayaan-3");
    expect(telemetry).not.toBeNull();
    if (!telemetry) return;

    expect(telemetry.telemetryState).toBe("HISTORICAL");
    expect(telemetry.missionPhase).toContain("Surface Science Completed");
  });
});
