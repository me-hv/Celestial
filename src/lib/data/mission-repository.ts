import {
  SpaceMission,
  Spacecraft,
  MissionInstrument,
  ScientificDiscovery,
  MissionEvent,
  MissionTrajectory,
  MissionStatistics,
  MissionStatus,
  MissionType,
  DiscoveryType,
} from "@/domain/mission/types";
import {
  SPACE_MISSIONS,
  SPACECRAFT_DATA,
  MISSION_INSTRUMENTS,
  SCIENTIFIC_DISCOVERIES,
  MISSION_EVENTS,
  MISSION_TRAJECTORIES,
} from "./mission-data";

import { GeographicRegion } from "@/domain/organization/types";

export interface MissionFilterOptions {
  agency?: string;
  organizationSlug?: string;
  country?: string;
  region?: GeographicRegion;
  type?: MissionType;
  status?: MissionStatus;
  targetId?: string;
  search?: string;
}

export class MissionRepository {
  private readonly missions: Map<string, SpaceMission> = new Map();
  private readonly spacecraft: Map<string, Spacecraft> = new Map();
  private readonly instruments: Map<string, MissionInstrument> = new Map();
  private readonly discoveries: Map<string, ScientificDiscovery> = new Map();
  private readonly events: Map<string, MissionEvent> = new Map();
  private readonly trajectories: Map<string, MissionTrajectory> = new Map();

  constructor(
    initialMissions: SpaceMission[] = SPACE_MISSIONS,
    initialSpacecraft: Spacecraft[] = SPACECRAFT_DATA,
    initialInstruments: MissionInstrument[] = MISSION_INSTRUMENTS,
    initialDiscoveries: ScientificDiscovery[] = SCIENTIFIC_DISCOVERIES,
    initialEvents: MissionEvent[] = MISSION_EVENTS,
    initialTrajectories: MissionTrajectory[] = MISSION_TRAJECTORIES
  ) {
    initialMissions.forEach((m) => {
      this.missions.set(m.id, m);
      this.missions.set(m.slug, m);
    });

    initialSpacecraft.forEach((sc) => {
      this.spacecraft.set(sc.id, sc);
      this.spacecraft.set(sc.slug, sc);
    });

    initialInstruments.forEach((inst) => {
      this.instruments.set(inst.id, inst);
      this.instruments.set(inst.slug, inst);
    });

    initialDiscoveries.forEach((disc) => {
      this.discoveries.set(disc.id, disc);
      this.discoveries.set(disc.slug, disc);
    });

    initialEvents.forEach((evt) => {
      this.events.set(evt.id, evt);
    });

    initialTrajectories.forEach((traj) => {
      this.trajectories.set(traj.id, traj);
      this.trajectories.set(traj.missionId, traj);
    });
  }

  // ==========================================
  // MISSIONS
  // ==========================================
  public getActiveMissions(): SpaceMission[] {
    return this.getAll().filter((m) => m.status === "ACTIVE" || m.status === "EXTENDED");
  }

  public getAll(): SpaceMission[] {
    const uniqueMap = new Map<string, SpaceMission>();
    this.missions.forEach((m) => uniqueMap.set(m.id, m));
    return Array.from(uniqueMap.values());
  }

  public getById(id: string): SpaceMission | undefined {
    return this.missions.get(id);
  }

  public getBySlug(slug: string): SpaceMission | undefined {
    return this.missions.get(slug);
  }

  public getFiltered(options: MissionFilterOptions): SpaceMission[] {
    let list = this.getAll();

    if (options.organizationSlug) {
      const q = options.organizationSlug.toLowerCase();
      list = list.filter(
        (m) =>
          (m.leadOrganizationSlug && m.leadOrganizationSlug.toLowerCase() === q) ||
          m.agency.toLowerCase() === q ||
          (m.participatingOrganizations &&
            m.participatingOrganizations.some((p) => p.organizationSlug.toLowerCase() === q))
      );
    }

    if (options.country) {
      const c = options.country.toLowerCase();
      list = list.filter(
        (m) =>
          (m.country && m.country.toLowerCase().includes(c)) ||
          (m.participatingOrganizations &&
            m.participatingOrganizations.some((p) =>
              p.organizationCountry.toLowerCase().includes(c)
            ))
      );
    }

    if (options.region) {
      list = list.filter((m) => m.region === options.region);
    }

    if (options.agency) {
      const q = options.agency.toLowerCase();
      list = list.filter((m) => m.agency.toLowerCase().includes(q));
    }

    if (options.type) {
      list = list.filter((m) => m.type === options.type);
    }

    if (options.status) {
      list = list.filter((m) => m.status === options.status);
    }

    if (options.targetId) {
      list = list.filter(
        (m) =>
          m.primaryTargetId === options.targetId ||
          m.secondaryTargetIds?.includes(options.targetId!)
      );
    }

    if (options.search) {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.agency.toLowerCase().includes(q) ||
          (m.country && m.country.toLowerCase().includes(q)) ||
          m.destination.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q) ||
          (m.participatingOrganizations &&
            m.participatingOrganizations.some((p) => p.organizationName.toLowerCase().includes(q)))
      );
    }

    return list;
  }

  public getByCountry(country: string): SpaceMission[] {
    return this.getFiltered({ country });
  }

  public getByRegion(region: GeographicRegion): SpaceMission[] {
    return this.getFiltered({ region });
  }

  public getByOrganization(orgSlug: string): SpaceMission[] {
    return this.getFiltered({ organizationSlug: orgSlug });
  }

  public getByStatus(status: MissionStatus): SpaceMission[] {
    return this.getFiltered({ status });
  }

  public getByClassification(type: MissionType): SpaceMission[] {
    return this.getFiltered({ type });
  }

  public getMissionsForTarget(targetIdOrSlug: string): SpaceMission[] {
    return this.getAll().filter(
      (m) =>
        m.primaryTargetId === targetIdOrSlug ||
        m.secondaryTargetIds?.includes(targetIdOrSlug) ||
        m.destination.toLowerCase().includes(targetIdOrSlug.toLowerCase())
    );
  }

  // ==========================================
  // SPACECRAFT
  // ==========================================
  public getAllSpacecraft(): Spacecraft[] {
    const uniqueMap = new Map<string, Spacecraft>();
    this.spacecraft.forEach((sc) => uniqueMap.set(sc.id, sc));
    return Array.from(uniqueMap.values());
  }

  public getSpacecraftById(id: string): Spacecraft | undefined {
    return this.spacecraft.get(id);
  }

  public getSpacecraftBySlug(slug: string): Spacecraft | undefined {
    return this.spacecraft.get(slug);
  }

  public getSpacecraftForMission(missionIdOrSlug: string): Spacecraft[] {
    const mission = this.getBySlug(missionIdOrSlug) || this.getById(missionIdOrSlug);
    if (!mission) return [];
    return this.getAllSpacecraft().filter((sc) => sc.missionId === mission.id);
  }

  // ==========================================
  // INSTRUMENTS
  // ==========================================
  public getAllInstruments(): MissionInstrument[] {
    const uniqueMap = new Map<string, MissionInstrument>();
    this.instruments.forEach((inst) => uniqueMap.set(inst.id, inst));
    return Array.from(uniqueMap.values());
  }

  public getInstrumentById(id: string): MissionInstrument | undefined {
    return this.instruments.get(id);
  }

  public getInstrumentBySlug(slug: string): MissionInstrument | undefined {
    return this.instruments.get(slug);
  }

  public getInstrumentsForMission(missionIdOrSlug: string): MissionInstrument[] {
    const mission = this.getBySlug(missionIdOrSlug) || this.getById(missionIdOrSlug);
    if (!mission) return [];
    return this.getAllInstruments().filter((inst) => inst.missionId === mission.id);
  }

  // ==========================================
  // DISCOVERIES
  // ==========================================
  public getAllDiscoveries(): ScientificDiscovery[] {
    const uniqueMap = new Map<string, ScientificDiscovery>();
    this.discoveries.forEach((d) => uniqueMap.set(d.id, d));
    return Array.from(uniqueMap.values());
  }

  public getDiscoveryById(id: string): ScientificDiscovery | undefined {
    return this.discoveries.get(id);
  }

  public getDiscoveryBySlug(slug: string): ScientificDiscovery | undefined {
    return this.discoveries.get(slug);
  }

  public getDiscoveriesForMission(missionIdOrSlug: string): ScientificDiscovery[] {
    const mission = this.getBySlug(missionIdOrSlug) || this.getById(missionIdOrSlug);
    if (!mission) return [];
    return this.getAllDiscoveries().filter((d) => d.missionId === mission.id);
  }

  public getDiscoveriesForTarget(targetIdOrSlug: string): ScientificDiscovery[] {
    return this.getAllDiscoveries().filter(
      (d) =>
        d.targetId === targetIdOrSlug ||
        d.targetName?.toLowerCase().includes(targetIdOrSlug.toLowerCase())
    );
  }

  public getDiscoveriesByType(type: DiscoveryType): ScientificDiscovery[] {
    return this.getAllDiscoveries().filter((d) => d.discoveryType === type);
  }

  public getMissionsForOrganization(orgIdOrSlug: string): SpaceMission[] {
    const slug = orgIdOrSlug.toLowerCase();
    return this.getAll().filter(
      (m) =>
        m.leadOrganizationSlug?.toLowerCase() === slug ||
        m.participatingOrganizations?.some(
          (p) =>
            p.organizationSlug.toLowerCase() === slug || p.organizationId.toLowerCase() === slug
        ) ||
        m.agency.toLowerCase().includes(slug)
    );
  }

  // ==========================================
  // EVENTS & TIMELINES
  // ==========================================
  public getEventsForMission(missionIdOrSlug: string): MissionEvent[] {
    const mission = this.getBySlug(missionIdOrSlug) || this.getById(missionIdOrSlug);
    if (!mission) return [];
    const uniqueMap = new Map<string, MissionEvent>();
    this.events.forEach((evt) => {
      if (evt.missionId === mission.id) {
        uniqueMap.set(evt.id, evt);
      }
    });
    return Array.from(uniqueMap.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  // ==========================================
  // TRAJECTORIES
  // ==========================================
  public getTrajectoryForMission(missionIdOrSlug: string): MissionTrajectory | undefined {
    const mission = this.getBySlug(missionIdOrSlug) || this.getById(missionIdOrSlug);
    if (!mission) return undefined;
    return this.trajectories.get(mission.id);
  }

  // ==========================================
  // AGGREGATE STATISTICS
  // ==========================================
  public getStatistics(): MissionStatistics {
    const all = this.getAll();
    const active = all.filter((m) => m.status === "ACTIVE").length;
    const completed = all.filter((m) => m.status === "COMPLETED").length;
    const human = all.filter((m) => m.type === "HUMAN_SPACEFLIGHT").length;
    const planetary = all.filter(
      (m) =>
        m.type === "ORBITER" ||
        m.type === "FLYBY" ||
        m.type === "LANDER" ||
        m.type === "ROVER" ||
        m.type === "SAMPLE_RETURN"
    ).length;
    const observatories = all.filter(
      (m) => m.type === "SPACE_TELESCOPE" || m.type === "SOLAR_OBSERVATORY"
    ).length;
    const interstellar = all.filter((m) => m.type === "INTERSTELLAR").length;

    // Target frequency
    const targetCounts = new Map<string, number>();
    all.forEach((m) => {
      const dest = m.destination.split("(")[0].trim();
      targetCounts.set(dest, (targetCounts.get(dest) || 0) + 1);
    });
    let topTarget = { targetName: "Mars", count: 3 };
    targetCounts.forEach((count, targetName) => {
      if (count > topTarget.count) {
        topTarget = { targetName, count };
      }
    });

    // Longest mission calculation
    let longestMission = { name: "Voyager 2", durationYears: 49 };
    all.forEach((m) => {
      const start = new Date(m.launchDate).getTime();
      const end = m.endDate ? new Date(m.endDate).getTime() : Date.now();
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
      if (years > longestMission.durationYears) {
        longestMission = { name: m.name, durationYears: Math.round(years * 10) / 10 };
      }
    });

    return {
      totalMissions: all.length,
      activeMissions: active,
      completedMissions: completed,
      humanSpaceflightMissions: human,
      planetaryMissions: planetary,
      spaceObservatories: observatories,
      interstellarMissions: interstellar,
      totalDiscoveries: this.getAllDiscoveries().length,
      mostExploredTarget: topTarget,
      longestMission,
      mostDistantSpacecraft: { name: "Voyager 1", distanceAu: 163.5 },
    };
  }
}

export const missionRepo = new MissionRepository();
