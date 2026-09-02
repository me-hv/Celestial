import {
  ResearchTargetReference,
  TargetIntelligenceReport,
  ScientificEvidence,
} from "@/domain/research/types";
import { ObserverLocation } from "@/domain/observer/types";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { starRepository } from "@/lib/data/star-repository";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";
import { galaxyRepo } from "@/lib/data/galaxy-repository";
import { cosmicStructureRepo } from "@/lib/data/cosmic-structure-repository";
import { missionRepo } from "@/lib/data/mission-repository";
import { observatoryRepo } from "@/lib/data/observatory-repository";
import { organizationRepo } from "@/lib/data/organization-repository";
import { relationGraph } from "./scientific-relation-graph";
import { ObservationIntelligenceEngine } from "./observation-intelligence";
import { NASA_PROVENANCE_BASE } from "@/lib/data/mission-data";
import { calculatePlanetaryEphemeris } from "@/lib/astronomy/ephemeris/planetary-ephemeris";

export class TargetIntelligenceEngine {
  public static resolveTarget(slugOrId: string): ResearchTargetReference | null {
    const slug = slugOrId.toLowerCase();

    // 1. Celestial Object Repository
    const celestialObj = celestialRepo.getBySlug(slug) || celestialRepo.getById(slug);
    if (celestialObj) {
      let domain: "SOLAR_SYSTEM" | "EXOPLANET" | "STELLAR" | "DEEP_SKY" = "SOLAR_SYSTEM";
      let badgeColor: "cyan" | "violet" | "amber" | "emerald" | "default" = "cyan";

      if (celestialObj.classification.category === "DEEP_SKY") {
        domain = "DEEP_SKY";
        badgeColor = "violet";
      } else if (celestialObj.classification.category === "STELLAR") {
        domain = "STELLAR";
        badgeColor = "amber";
      } else if (celestialObj.classification.code === "EXOPLANET") {
        domain = "EXOPLANET";
        badgeColor = "cyan";
      }

      let equatorialCoordinates =
        celestialObj.positional.rightAscensionDeg !== undefined &&
        celestialObj.positional.declinationDeg !== undefined
          ? {
              raDeg: celestialObj.positional.rightAscensionDeg,
              decDeg: celestialObj.positional.declinationDeg,
              rightAscensionHours: celestialObj.positional.rightAscensionDeg / 15.0,
              declinationDegrees: celestialObj.positional.declinationDeg,
            }
          : undefined;

      let apparentMag = celestialObj.physical.apparentMagnitudeV;

      if (!equatorialCoordinates && domain === "SOLAR_SYSTEM") {
        try {
          const ephemeris = calculatePlanetaryEphemeris(celestialObj.slug, new Date());
          if (ephemeris) {
            equatorialCoordinates = {
              raDeg: ephemeris.raDeg,
              decDeg: ephemeris.decDeg,
              rightAscensionHours: ephemeris.raDeg / 15.0,
              declinationDegrees: ephemeris.decDeg,
            };
            apparentMag = ephemeris.apparentMagnitudeV;
          }
        } catch {
          // Ignore fallback errors
        }
      }

      return {
        id: celestialObj.id,
        slug: celestialObj.slug,
        domain,
        canonicalName: celestialObj.canonicalName,
        standardDesignation: celestialObj.standardDesignation,
        category: celestialObj.classification.category,
        type: celestialObj.classification.code,
        summary:
          celestialObj.summary ||
          `${celestialObj.canonicalName} (${celestialObj.classification.code})`,
        equatorialCoordinates,
        distanceLy: celestialObj.positional.distanceLightYears,
        apparentMagnitudeV: apparentMag,
        constellation: celestialObj.physical.constellation,
        badgeColor,
      };
    }

    // 2. Star Catalog
    const star = starRepository.getBySlug(slug) || starRepository.getById(slug);
    if (star) {
      return {
        id: star.id,
        slug: star.slug,
        domain: "STELLAR",
        canonicalName: star.canonicalName,
        standardDesignation: star.standardDesignation,
        category: "STELLAR",
        type: star.physical.spectralClass || "STAR",
        summary: `Stellar target with spectral classification ${star.physical.spectralClass || "N/A"}`,
        equatorialCoordinates:
          star.positional.rightAscensionDeg !== undefined &&
          star.positional.declinationDeg !== undefined
            ? {
                raDeg: star.positional.rightAscensionDeg,
                decDeg: star.positional.declinationDeg,
                rightAscensionHours: star.positional.rightAscensionDeg / 15.0,
                declinationDegrees: star.positional.declinationDeg,
              }
            : undefined,
        distanceLy: star.positional.distanceLightYears,
        apparentMagnitudeV: star.physical.apparentMagnitudeV,
        constellation: star.physical.constellation,
        badgeColor: "amber",
      };
    }

    // 3. Deep Sky Object
    const dso = deepSkyRepo.getBySlug(slug) || deepSkyRepo.getById(slug);
    if (dso) {
      return {
        id: dso.id,
        slug: dso.slug,
        domain: "DEEP_SKY",
        canonicalName: dso.canonicalName,
        standardDesignation: dso.standardDesignation,
        category: dso.classification.category,
        type: dso.classification.code,
        summary: dso.summary || `Deep-sky object: ${dso.canonicalName}`,
        equatorialCoordinates:
          dso.positional.rightAscensionDeg !== undefined &&
          dso.positional.declinationDeg !== undefined
            ? {
                raDeg: dso.positional.rightAscensionDeg,
                decDeg: dso.positional.declinationDeg,
                rightAscensionHours: dso.positional.rightAscensionDeg / 15.0,
                declinationDegrees: dso.positional.declinationDeg,
              }
            : undefined,
        distanceLy: dso.positional.distanceLightYears,
        apparentMagnitudeV: dso.physical.apparentMagnitudeV,
        constellation: dso.physical.constellation,
        badgeColor: "violet",
      };
    }

    // 4. Galaxy Catalog
    const galaxy = galaxyRepo.getBySlug(slug) || galaxyRepo.getById(slug);
    if (galaxy) {
      return {
        id: galaxy.id,
        slug: galaxy.slug,
        domain: "GALACTIC",
        canonicalName: galaxy.name,
        standardDesignation: galaxy.standardDesignation,
        category: "GALAXY",
        type: galaxy.morphology.class,
        summary: galaxy.summary || `Extragalactic system: ${galaxy.name}`,
        equatorialCoordinates:
          galaxy.positional.rightAscensionDeg !== undefined &&
          galaxy.positional.declinationDeg !== undefined
            ? {
                raDeg: galaxy.positional.rightAscensionDeg,
                decDeg: galaxy.positional.declinationDeg,
                rightAscensionHours: galaxy.positional.rightAscensionDeg / 15.0,
                declinationDegrees: galaxy.positional.declinationDeg,
              }
            : undefined,
        distanceLy: galaxy.distance.distanceLy.value,
        badgeColor: "emerald",
      };
    }

    // 5. Cosmic Structure
    const cosmic = cosmicStructureRepo.getBySlug(slug) || cosmicStructureRepo.getById(slug);
    if (cosmic) {
      return {
        id: cosmic.id,
        slug: cosmic.slug,
        domain: "COSMIC_WEB",
        canonicalName: cosmic.name,
        category: "LARGE_SCALE_STRUCTURE",
        type: cosmic.type,
        summary: cosmic.description,
        distanceLy: cosmic.coordinates.distanceLy.value,
        badgeColor: "default",
      };
    }

    // 6. Space Mission
    const mission = missionRepo.getBySlug(slug) || missionRepo.getById(slug);
    if (mission) {
      return {
        id: mission.id,
        slug: mission.slug,
        domain: "MISSION",
        canonicalName: mission.name,
        category: "SPACE_MISSION",
        type: mission.type,
        summary: mission.summary,
        badgeColor: "cyan",
      };
    }

    // 7. Spacecraft
    const spacecraft = missionRepo.getSpacecraftBySlug(slug) || missionRepo.getSpacecraftById(slug);
    if (spacecraft) {
      return {
        id: spacecraft.id,
        slug: spacecraft.slug,
        domain: "SPACECRAFT",
        canonicalName: spacecraft.name,
        category: "SPACECRAFT_HARDWARE",
        type: spacecraft.type,
        summary: spacecraft.summary,
        badgeColor: "amber",
      };
    }

    // 8. Ground Observatory
    const obs = observatoryRepo.getBySlug(slug) || observatoryRepo.getById(slug);
    if (obs) {
      return {
        id: obs.id,
        slug: obs.slug,
        domain: "OBSERVATORY",
        canonicalName: obs.name,
        standardDesignation: obs.acronym,
        category: "ASTRONOMICAL_OBSERVATORY",
        type: obs.type,
        summary: obs.summary,
        badgeColor: "emerald",
      };
    }

    // 9. Space & Research Organization
    const org = organizationRepo.getBySlug(slug) || organizationRepo.getById(slug);
    if (org) {
      return {
        id: org.id,
        slug: org.slug,
        domain: "ORGANIZATION",
        canonicalName: org.officialName,
        standardDesignation: org.shortName,
        category: org.organizationType,
        type: org.organizationType,
        summary: org.summary || org.description,
        badgeColor: "cyan",
      };
    }

    return null;
  }

  public static generateReport(
    targetSlugOrId: string,
    observer?: ObserverLocation,
    date = new Date()
  ): TargetIntelligenceReport | null {
    const target = this.resolveTarget(targetSlugOrId);
    if (!target) return null;

    let context3DRoute = "/explore";
    if (target.domain === "SOLAR_SYSTEM") context3DRoute = `/explore?focus=${target.slug}`;
    else if (target.domain === "STELLAR") context3DRoute = `/stars/${target.slug}`;
    else if (target.domain === "DEEP_SKY") context3DRoute = `/deep-sky/${target.slug}`;
    else if (target.domain === "GALACTIC") context3DRoute = `/galaxies/${target.slug}`;
    else if (target.domain === "COSMIC_WEB") context3DRoute = `/cosmic-web/${target.slug}`;
    else if (target.domain === "MISSION") context3DRoute = `/missions/${target.slug}`;
    else if (target.domain === "SPACECRAFT") context3DRoute = `/missions/spacecraft/${target.slug}`;
    else if (target.domain === "OBSERVATORY") context3DRoute = `/observatories/${target.slug}`;

    const physicalProps: TargetIntelligenceReport["physicalProperties"] = [];
    if (target.apparentMagnitudeV !== undefined) {
      physicalProps.push({
        name: "Apparent Magnitude (V)",
        value: target.apparentMagnitudeV.toFixed(2),
        unit: "mag",
        epistemicStatus: "OBSERVED",
        method: "Astrometric Photometry",
        source: "SIMBAD / Gaia DR3",
      });
    }
    if (target.distanceLy !== undefined) {
      physicalProps.push({
        name: "Distance",
        value:
          target.distanceLy > 10000
            ? (target.distanceLy / 1000000).toFixed(2)
            : target.distanceLy.toFixed(1),
        unit: target.distanceLy > 10000 ? "Mly" : "ly",
        epistemicStatus: "INFERRED",
        method: "Stellar Parallax / Standard Candles",
        source: "Gaia DR3 / NED",
      });
    }
    if (target.constellation) {
      physicalProps.push({
        name: "Constellation",
        value: target.constellation,
        epistemicStatus: "OBSERVED",
        source: "IAU 1930 Constellation Boundaries",
      });
    }

    const positionalProps: TargetIntelligenceReport["positionalProperties"] = [];
    if (target.equatorialCoordinates) {
      positionalProps.push({
        frame: "ICRS / J2000.0 Equatorial",
        coordinates: `RA: ${target.equatorialCoordinates.raDeg.toFixed(4)}°, Dec: ${target.equatorialCoordinates.decDeg.toFixed(4)}°`,
        epistemicStatus: "OBSERVED",
      });
    }

    let observationSummary: TargetIntelligenceReport["observationSummary"] = undefined;
    if (target.equatorialCoordinates && observer) {
      const windows = ObservationIntelligenceEngine.calculateWindows({
        equatorial: target.equatorialCoordinates,
        observer,
        date,
      });

      const best = windows.find((w) => w.quality !== "NOT_VISIBLE");
      observationSummary = {
        isObservableTonight: !!best,
        transitAltitudeDeg: best ? best.maxAltitudeDeg : windows[0]?.maxAltitudeDeg,
        transitTime: best?.transitTime || undefined,
        airmass: best?.minAirmass,
        bestWindow: best,
        windows,
      };
    }

    const graphRelations = relationGraph.getRelationsForTarget(target.id);
    const relatedTargets: ResearchTargetReference[] = [];

    const neighbors = relationGraph.getNeighbors(target.id);
    for (const n of neighbors.slice(0, 6)) {
      const resolved = this.resolveTarget(n.neighborSlug);
      if (resolved && !relatedTargets.some((r) => r.id === resolved.id)) {
        relatedTargets.push(resolved);
      }
    }

    let associatedMissions = missionRepo.getMissionsForTarget(target.id).map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      agency: m.agency,
      status: m.status,
      role: "Exploration Mission",
    }));

    let associatedSpacecraft: TargetIntelligenceReport["associatedSpacecraft"] = [];
    let associatedInstruments: TargetIntelligenceReport["associatedInstruments"] = [];
    let associatedDiscoveries = missionRepo.getDiscoveriesForTarget(target.id).map((d) => ({
      id: d.id,
      slug: d.slug,
      title: d.title,
      date: d.date,
      epistemicStatus: d.epistemicStatus,
      significance: d.scientificSignificance,
      citationUrl: d.citationUrl,
    }));

    if (target.domain === "MISSION") {
      const missionObj = missionRepo.getBySlug(target.slug);
      if (missionObj) {
        associatedSpacecraft = missionRepo.getSpacecraftForMission(missionObj.id).map((sc) => ({
          id: sc.id,
          slug: sc.slug,
          name: sc.name,
          type: sc.type,
          status: sc.status,
        }));

        associatedInstruments = missionRepo.getInstrumentsForMission(missionObj.id).map((inst) => ({
          id: inst.id,
          slug: inst.slug,
          name: inst.acronym ? `${inst.acronym} - ${inst.name}` : inst.name,
          type: inst.type,
          purpose: inst.scientificPurpose,
        }));

        const mDiscoveries = missionRepo.getDiscoveriesForMission(missionObj.id).map((d) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          date: d.date,
          epistemicStatus: d.epistemicStatus,
          significance: d.scientificSignificance,
          citationUrl: d.citationUrl,
        }));
        if (mDiscoveries.length > 0) {
          associatedDiscoveries = mDiscoveries;
        }
      }
    } else if (target.domain === "ORGANIZATION") {
      const orgMissions = missionRepo.getMissionsForOrganization(target.slug).map((m) => ({
        id: m.id,
        slug: m.slug,
        name: m.name,
        agency: m.agency,
        status: m.status,
        role: "Operator / Lead Agency",
      }));
      if (orgMissions.length > 0) {
        associatedMissions = orgMissions;
      }
    } else if (target.domain === "OBSERVATORY") {
      const obsObj = observatoryRepo.getBySlug(target.slug);
      if (obsObj) {
        associatedInstruments = obsObj.activeInstruments.map((instName, i) => ({
          id: `inst-${target.slug}-${i}`,
          slug: `inst-${instName.toLowerCase().replace(/\s+/g, "-")}`,
          name: instName,
          type: "ASTRONOMICAL_SPECTROGRAPH_OR_IMAGER",
          purpose: `Focal-plane scientific instrumentation at ${obsObj.name}`,
        }));
      }
    }

    const evidenceList: ScientificEvidence[] = associatedDiscoveries.map((d) => ({
      id: `ev-${d.id}`,
      claim: d.title,
      source: "NASA / ESA / ISRO Mission Archive",
      sourceType: "MISSION_ARCHIVE",
      epistemicStatus: d.epistemicStatus,
      confidenceScore: 0.98,
      url: d.citationUrl,
      notes: d.significance,
    }));

    if (evidenceList.length === 0) {
      evidenceList.push({
        id: `ev-${target.id}-canonical`,
        claim: `Astrometric identification of ${target.canonicalName}`,
        source: "International Astronomical Union & SIMBAD CDS",
        sourceType: "SIMBAD",
        epistemicStatus: "OBSERVED",
        confidenceScore: 0.999,
        notes: "Cataloged and peer-reviewed astronomical observation.",
      });
    }

    return {
      target,
      context3DRoute,
      physicalProperties: physicalProps,
      positionalProperties: positionalProps,
      observationSummary,
      associatedMissions,
      associatedSpacecraft,
      associatedInstruments,
      associatedDiscoveries,
      scientificEvidence: evidenceList,
      relations: graphRelations,
      relatedTargets,
      provenance: {
        ...NASA_PROVENANCE_BASE,
        catalogName: "CELESTIAL Unified Scientific Knowledgebase",
        recordIdentifier: `CELESTIAL:${target.id.toUpperCase()}`,
      },
    };
  }
}
