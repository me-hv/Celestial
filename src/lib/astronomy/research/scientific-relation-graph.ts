import { ResearchRelation, ResearchDomainType } from "@/domain/research/types";
import {
  SPACE_MISSIONS,
  SPACECRAFT_DATA,
  MISSION_INSTRUMENTS,
  SCIENTIFIC_DISCOVERIES,
} from "@/lib/data/mission-data";
import { SOLAR_SYSTEM_OBJECTS } from "@/lib/data/solar-system-data";
import { DEEP_SKY_CELESTIAL_OBJECTS } from "@/lib/data/deep-sky-data";
import { OBSERVATORIES_DATA } from "@/lib/data/observatory-data";

export class ScientificRelationGraph {
  private static instance: ScientificRelationGraph;
  private relations: ResearchRelation[] = [];

  private constructor() {
    this.buildGraph();
  }

  public static getInstance(): ScientificRelationGraph {
    if (!ScientificRelationGraph.instance) {
      ScientificRelationGraph.instance = new ScientificRelationGraph();
    }
    return ScientificRelationGraph.instance;
  }

  private buildGraph(): void {
    const list: ResearchRelation[] = [];

    // 1. Mission -> Target Relations
    for (const mission of SPACE_MISSIONS) {
      if (mission.primaryTargetId) {
        list.push({
          id: `rel-${mission.id}-${mission.primaryTargetId}`,
          sourceId: mission.id,
          sourceSlug: mission.slug,
          sourceName: mission.name,
          sourceDomain: "MISSION",
          targetId: mission.primaryTargetId,
          targetSlug: mission.primaryTargetId,
          targetName: mission.destination,
          targetDomain: "SOLAR_SYSTEM",
          relationType: "STUDIED_BY",
          epistemicStatus: "OBSERVED",
          description: `Mission ${mission.name} targeted and explored ${mission.destination}`,
        });
      }

      // Mission -> Spacecraft
      for (const scId of mission.spacecraftIds) {
        const sc = SPACECRAFT_DATA.find((s) => s.id === scId);
        if (sc) {
          list.push({
            id: `rel-${mission.id}-${sc.id}`,
            sourceId: mission.id,
            sourceSlug: mission.slug,
            sourceName: mission.name,
            sourceDomain: "MISSION",
            targetId: sc.id,
            targetSlug: sc.slug,
            targetName: sc.name,
            targetDomain: "SPACECRAFT",
            relationType: "PART_OF",
            epistemicStatus: "OBSERVED",
            description: `Spacecraft ${sc.name} was deployed as part of ${mission.name}`,
          });
        }
      }

      // Spacecraft -> Instruments
      for (const instId of mission.instrumentIds) {
        const inst = MISSION_INSTRUMENTS.find((i) => i.id === instId);
        if (inst) {
          list.push({
            id: `rel-${mission.id}-${inst.id}`,
            sourceId: inst.id,
            sourceSlug: inst.slug,
            sourceName: inst.name,
            sourceDomain: "SPACECRAFT",
            targetId: mission.id,
            targetSlug: mission.slug,
            targetName: mission.name,
            targetDomain: "MISSION",
            relationType: "INSTRUMENT_ON",
            epistemicStatus: "OBSERVED",
            description: `Instrument ${inst.name} (${inst.acronym || ""}) operated on ${mission.name}`,
          });
        }
      }

      // Discoveries -> Mission & Target
      for (const discId of mission.discoveryIds) {
        const disc = SCIENTIFIC_DISCOVERIES.find((d) => d.id === discId);
        if (disc) {
          list.push({
            id: `rel-${disc.id}-${mission.id}`,
            sourceId: disc.id,
            sourceSlug: disc.slug,
            sourceName: disc.title,
            sourceDomain: "DISCOVERY",
            targetId: mission.id,
            targetSlug: mission.slug,
            targetName: mission.name,
            targetDomain: "MISSION",
            relationType: "DISCOVERED_BY",
            epistemicStatus: disc.epistemicStatus,
            description: `Discovery ${disc.title} was made by ${mission.name}`,
          });

          if (disc.targetId) {
            list.push({
              id: `rel-${disc.id}-${disc.targetId}`,
              sourceId: disc.id,
              sourceSlug: disc.slug,
              sourceName: disc.title,
              sourceDomain: "DISCOVERY",
              targetId: disc.targetId,
              targetSlug: disc.targetId,
              targetName: disc.targetName || disc.targetId,
              targetDomain: "SOLAR_SYSTEM",
              relationType: "DISCOVERY_ABOUT",
              epistemicStatus: disc.epistemicStatus,
              description: `Scientific discovery concerning ${disc.targetName || disc.targetId}`,
            });
          }
        }
      }
    }

    // 2. Solar System Planets -> Orbiting Sun
    for (const body of SOLAR_SYSTEM_OBJECTS) {
      if (body.slug !== "sun") {
        list.push({
          id: `rel-${body.id}-sun`,
          sourceId: body.id,
          sourceSlug: body.slug,
          sourceName: body.canonicalName,
          sourceDomain: "SOLAR_SYSTEM",
          targetId: "sun",
          targetSlug: "sun",
          targetName: "Sun",
          targetDomain: "SOLAR_SYSTEM",
          relationType: "ORBITING",
          epistemicStatus: "OBSERVED",
          description: `${body.canonicalName} orbits the central Sun`,
        });
      }
    }

    // 3. Deep Sky Objects -> Milky Way / Host Galaxies
    for (const dso of DEEP_SKY_CELESTIAL_OBJECTS) {
      list.push({
        id: `rel-${dso.id}-milky-way`,
        sourceId: dso.id,
        sourceSlug: dso.slug,
        sourceName: dso.canonicalName,
        sourceDomain: "DEEP_SKY",
        targetId: "milky-way-galaxy",
        targetSlug: "milky-way-galaxy",
        targetName: "Milky Way Galaxy",
        targetDomain: "GALACTIC",
        relationType: "LOCATED_IN",
        epistemicStatus: "OBSERVED",
        description: `${dso.canonicalName} is located within the Milky Way Galaxy`,
      });
    }

    // 4. Observatories -> Key Discoveries
    for (const obs of OBSERVATORIES_DATA) {
      for (const disc of obs.keyDiscoveries) {
        list.push({
          id: `rel-${obs.id}-${disc.slice(0, 15).replace(/\s+/g, "-")}`,
          sourceId: obs.id,
          sourceSlug: obs.slug,
          sourceName: obs.name,
          sourceDomain: "OBSERVATORY",
          targetId: "discovery",
          targetSlug: "discovery",
          targetName: disc,
          targetDomain: "DISCOVERY",
          relationType: "OBSERVED_BY",
          epistemicStatus: "OBSERVED",
          description: `${obs.name} produced breakthrough: ${disc}`,
        });
      }
    }

    // 5. Missions -> Participating Organizations
    for (const mission of SPACE_MISSIONS) {
      if (mission.participatingOrganizations) {
        for (const part of mission.participatingOrganizations) {
          let relType: ResearchRelation["relationType"] = "PART_OF";
          if (part.role === "LEAD_AGENCY" || part.role === "MISSION_OPERATOR") {
            relType = "OPERATED_BY";
          } else if (part.role === "SPACECRAFT_BUILDER") {
            relType = "BUILT_BY";
          } else if (part.role === "DATA_ARCHIVE") {
            relType = "DATA_ARCHIVE_OF";
          }

          list.push({
            id: `rel-${mission.id}-${part.organizationId}`,
            sourceId: mission.id,
            sourceSlug: mission.slug,
            sourceName: mission.name,
            sourceDomain: "MISSION",
            targetId: part.organizationId,
            targetSlug: part.organizationSlug,
            targetName: part.organizationName,
            targetDomain: "ORGANIZATION",
            relationType: relType,
            epistemicStatus: "OBSERVED",
            description: `${part.organizationName} participates in ${mission.name} as ${part.role.replace(/_/g, " ")}`,
          });
        }
      }
    }

    this.relations = list;
  }

  public getAll(): ResearchRelation[] {
    return this.relations;
  }

  public getRelationsForTarget(targetSlugOrId: string): ResearchRelation[] {
    const target = targetSlugOrId.toLowerCase();
    return this.relations.filter(
      (rel) =>
        rel.sourceId.toLowerCase() === target ||
        rel.sourceSlug.toLowerCase() === target ||
        rel.targetId.toLowerCase() === target ||
        rel.targetSlug.toLowerCase() === target
    );
  }

  public getNeighbors(targetSlugOrId: string): Array<{
    relation: ResearchRelation;
    neighborId: string;
    neighborSlug: string;
    neighborName: string;
    neighborDomain: ResearchDomainType;
  }> {
    const rels = this.getRelationsForTarget(targetSlugOrId);
    const target = targetSlugOrId.toLowerCase();

    return rels.map((rel) => {
      const isSource =
        rel.sourceId.toLowerCase() === target || rel.sourceSlug.toLowerCase() === target;
      return {
        relation: rel,
        neighborId: isSource ? rel.targetId : rel.sourceId,
        neighborSlug: isSource ? rel.targetSlug : rel.sourceSlug,
        neighborName: isSource ? rel.targetName : rel.sourceName,
        neighborDomain: isSource ? rel.targetDomain : rel.sourceDomain,
      };
    });
  }

  public findPath(
    startSlugOrId: string,
    endSlugOrId: string,
    maxDepth = 5
  ): Array<{ nodeSlug: string; relation?: ResearchRelation }> | null {
    const start = startSlugOrId.toLowerCase();
    const end = endSlugOrId.toLowerCase();

    if (start === end) {
      return [{ nodeSlug: start }];
    }

    const queue: Array<{
      current: string;
      path: Array<{ nodeSlug: string; relation?: ResearchRelation }>;
    }> = [{ current: start, path: [{ nodeSlug: start }] }];
    const visited = new Set<string>([start]);

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      if (path.length > maxDepth) continue;

      const neighbors = this.getNeighbors(current);
      for (const n of neighbors) {
        const neighborKey = n.neighborSlug.toLowerCase();
        if (neighborKey === end) {
          return [...path, { nodeSlug: n.neighborSlug, relation: n.relation }];
        }

        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push({
            current: neighborKey,
            path: [...path, { nodeSlug: n.neighborSlug, relation: n.relation }],
          });
        }
      }
    }

    return null;
  }
}

export const relationGraph = ScientificRelationGraph.getInstance();
