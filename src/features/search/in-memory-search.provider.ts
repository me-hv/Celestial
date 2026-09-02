import { CelestialObject } from "@/domain/celestial-object/types";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";
import { GalacticStructure } from "@/domain/galactic-structure/types";
import { GALACTIC_STRUCTURES_DATA } from "@/lib/data/galactic-structure-data";
import { Galaxy } from "@/domain/galaxy/types";
import { LOCAL_GROUP_GALAXIES_DATA } from "@/lib/data/galaxy-data";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import { COSMIC_STRUCTURES_DATA } from "@/lib/data/cosmic-structure-data";
import { CosmicEpoch } from "@/domain/cosmic-time/types";
import { COSMIC_EPOCHS_DATA } from "@/lib/data/cosmic-epoch-data";
import {
  ObservationalLandmark,
  CosmicHorizon,
  CMBLastScatteringSurface,
} from "@/domain/observable-universe/types";
import {
  OBSERVATIONAL_LANDMARKS_DATA,
  COSMIC_HORIZONS_DATA,
  CMB_DETAILED_DATA,
} from "@/lib/data/observable-universe-data";
import { Constellation } from "@/domain/constellation/types";
import { IAU_CONSTELLATIONS_DATA } from "@/lib/data/constellation-data";
import {
  SPACE_MISSIONS,
  SPACECRAFT_DATA,
  MISSION_INSTRUMENTS,
  SCIENTIFIC_DISCOVERIES,
} from "@/lib/data/mission-data";
import {
  SpaceMission,
  Spacecraft,
  MissionInstrument,
  ScientificDiscovery,
} from "@/domain/mission/types";
import { GroundObservatory } from "@/domain/observatory/types";
import { OBSERVATORIES_DATA } from "@/lib/data/observatory-data";
import { Organization } from "@/domain/organization/types";
import { ORGANIZATIONS_DATA } from "@/lib/data/organization-data";
import { ISearchProvider } from "./search-provider.interface";
import { SearchQueryOptions, SearchResponse, SearchResultItem } from "./types";

export class InMemorySearchProvider implements ISearchProvider {
  private objects: CelestialObject[] = [];
  private galacticStructures: GalacticStructure[] = GALACTIC_STRUCTURES_DATA;
  private galaxies: Galaxy[] = LOCAL_GROUP_GALAXIES_DATA;
  private cosmicStructures: CosmicStructure[] = COSMIC_STRUCTURES_DATA;
  private cosmicEpochs: CosmicEpoch[] = COSMIC_EPOCHS_DATA;
  private landmarks: ObservationalLandmark[] = OBSERVATIONAL_LANDMARKS_DATA;
  private horizons: CosmicHorizon[] = COSMIC_HORIZONS_DATA;
  private cmb: CMBLastScatteringSurface = CMB_DETAILED_DATA;
  private constellations: Constellation[] = IAU_CONSTELLATIONS_DATA;
  private missions: SpaceMission[] = SPACE_MISSIONS;
  private spacecraft: Spacecraft[] = SPACECRAFT_DATA;
  private instruments: MissionInstrument[] = MISSION_INSTRUMENTS;
  private discoveries: ScientificDiscovery[] = SCIENTIFIC_DISCOVERIES;
  private observatories: GroundObservatory[] = OBSERVATORIES_DATA;
  private organizations: Organization[] = ORGANIZATIONS_DATA;

  constructor(
    initialObjects: CelestialObject[] = [],
    initialStructures?: GalacticStructure[],
    initialGalaxies?: Galaxy[],
    initialCosmicStructures?: CosmicStructure[],
    initialCosmicEpochs?: CosmicEpoch[],
    initialLandmarks?: ObservationalLandmark[],
    initialHorizons?: CosmicHorizon[],
    initialConstellations?: Constellation[],
    initialMissions?: SpaceMission[],
    initialSpacecraft?: Spacecraft[],
    initialInstruments?: MissionInstrument[],
    initialDiscoveries?: ScientificDiscovery[],
    initialObservatories?: GroundObservatory[],
    initialOrganizations?: Organization[]
  ) {
    this.objects = initialObjects;
    this.galacticStructures =
      initialStructures !== undefined ? initialStructures : GALACTIC_STRUCTURES_DATA;
    this.galaxies = initialGalaxies !== undefined ? initialGalaxies : LOCAL_GROUP_GALAXIES_DATA;
    this.cosmicStructures =
      initialCosmicStructures !== undefined ? initialCosmicStructures : COSMIC_STRUCTURES_DATA;
    this.cosmicEpochs =
      initialCosmicEpochs !== undefined ? initialCosmicEpochs : COSMIC_EPOCHS_DATA;
    this.landmarks =
      initialLandmarks !== undefined ? initialLandmarks : OBSERVATIONAL_LANDMARKS_DATA;
    this.horizons = initialHorizons !== undefined ? initialHorizons : COSMIC_HORIZONS_DATA;
    this.constellations =
      initialConstellations !== undefined ? initialConstellations : IAU_CONSTELLATIONS_DATA;
    this.missions = initialMissions !== undefined ? initialMissions : SPACE_MISSIONS;
    this.spacecraft = initialSpacecraft !== undefined ? initialSpacecraft : SPACECRAFT_DATA;
    this.instruments = initialInstruments !== undefined ? initialInstruments : MISSION_INSTRUMENTS;
    this.discoveries =
      initialDiscoveries !== undefined ? initialDiscoveries : SCIENTIFIC_DISCOVERIES;
    this.observatories =
      initialObservatories !== undefined ? initialObservatories : OBSERVATORIES_DATA;
    this.organizations =
      initialOrganizations !== undefined ? initialOrganizations : ORGANIZATIONS_DATA;
  }

  public setIndex(
    objects: CelestialObject[],
    structures?: GalacticStructure[],
    galaxies?: Galaxy[],
    cosmicStructures?: CosmicStructure[],
    cosmicEpochs?: CosmicEpoch[],
    landmarks?: ObservationalLandmark[],
    horizons?: CosmicHorizon[],
    constellations?: Constellation[],
    missions?: SpaceMission[],
    spacecraft?: Spacecraft[],
    instruments?: MissionInstrument[],
    discoveries?: ScientificDiscovery[],
    observatories?: GroundObservatory[],
    organizations?: Organization[]
  ): void {
    this.objects = objects;
    if (structures !== undefined) this.galacticStructures = structures;
    if (galaxies !== undefined) this.galaxies = galaxies;
    if (cosmicStructures !== undefined) this.cosmicStructures = cosmicStructures;
    if (cosmicEpochs !== undefined) this.cosmicEpochs = cosmicEpochs;
    if (landmarks !== undefined) this.landmarks = landmarks;
    if (horizons !== undefined) this.horizons = horizons;
    if (constellations !== undefined) this.constellations = constellations;
    if (missions !== undefined) this.missions = missions;
    if (spacecraft !== undefined) this.spacecraft = spacecraft;
    if (instruments !== undefined) this.instruments = instruments;
    if (discoveries !== undefined) this.discoveries = discoveries;
    if (observatories !== undefined) this.observatories = observatories;
    if (organizations !== undefined) this.organizations = organizations;
  }

  public async search(options: SearchQueryOptions): Promise<SearchResponse> {
    const startTime = performance.now();
    const rawQuery = options.query.trim().toLowerCase();
    const cleanQuery = rawQuery.replace(/\s+/g, "");
    const limit = options.limit ?? 20;

    if (!rawQuery) {
      return {
        results: [],
        totalMatches: 0,
        query: options.query,
        executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
      };
    }

    const scoredResults: SearchResultItem[] = [];

    // 1. Search First-Class Cosmic Structures (Clusters, Superclusters, Voids, Filaments)
    const allowCosmicStructures =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes(CelestialCategory.COSMIC_STRUCTURE);

    if (allowCosmicStructures) {
      for (const struct of this.cosmicStructures) {
        const nameLower = struct.name.toLowerCase();
        const designationLower = struct.standardDesignation?.toLowerCase() || "";
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery)) {
          bestScore = 0.95;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.8;
        }

        if (designationLower === rawQuery || designationLower.replace(/\s+/g, "") === cleanQuery) {
          bestScore = Math.max(bestScore, 0.98);
        } else if (
          designationLower.startsWith(rawQuery) ||
          designationLower.replace(/\s+/g, "").startsWith(cleanQuery)
        ) {
          bestScore = Math.max(bestScore, 0.88);
        } else if (designationLower.includes(rawQuery)) {
          bestScore = Math.max(bestScore, 0.75);
        }

        if (struct.discovery?.catalogDesignation) {
          const catLower = struct.discovery.catalogDesignation.toLowerCase();
          const catClean = catLower.replace(/\s+/g, "");
          if (catLower === rawQuery || catClean === cleanQuery) {
            bestScore = Math.max(bestScore, 1.0);
            matchedAlias = struct.discovery.catalogDesignation;
          } else if (catLower.startsWith(rawQuery) || catClean.startsWith(cleanQuery)) {
            bestScore = Math.max(bestScore, 0.85);
            matchedAlias = struct.discovery.catalogDesignation;
          } else if (catLower.includes(rawQuery)) {
            bestScore = Math.max(bestScore, 0.7);
            matchedAlias = struct.discovery.catalogDesignation;
          }
        }

        if (struct.aliases) {
          for (const alias of struct.aliases) {
            const aliasLower = alias.toLowerCase();
            const aliasClean = aliasLower.replace(/\s+/g, "");
            if (aliasLower === rawQuery || aliasClean === cleanQuery) {
              bestScore = Math.max(bestScore, 0.95);
              matchedAlias = alias;
            } else if (aliasLower.startsWith(rawQuery) || aliasClean.startsWith(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.85);
              matchedAlias = alias;
            } else if (aliasLower.includes(rawQuery) || aliasClean.includes(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.65);
              matchedAlias = alias;
            }
          }
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: struct.id,
            slug: struct.slug,
            canonicalName: struct.name,
            standardDesignation: struct.standardDesignation,
            objectType: "COSMIC_STRUCTURE",
            category: "COSMIC_STRUCTURE",
            classificationCode: struct.type as unknown as CelestialClassificationCode,
            matchedAlias,
            matchScore: bestScore,
            summary: struct.summary,
          });
        }
      }
    }

    // 2. Search First-Class Galaxies (if category allows DEEP_SKY)
    const allowGalaxies =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes(CelestialCategory.DEEP_SKY);

    if (allowGalaxies) {
      for (const gal of this.galaxies) {
        if (scoredResults.some((r) => r.id === gal.id || r.slug === gal.slug)) {
          continue;
        }

        const nameLower = gal.name.toLowerCase();
        const designationLower = gal.standardDesignation?.toLowerCase() || "";
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery)) {
          bestScore = 0.95;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.8;
        }

        if (designationLower === rawQuery || designationLower.replace(/\s+/g, "") === cleanQuery) {
          bestScore = Math.max(bestScore, 0.98);
        } else if (designationLower.includes(rawQuery)) {
          bestScore = Math.max(bestScore, 0.85);
        }

        if (gal.catalogIdentifiers) {
          const catIds = [
            gal.catalogIdentifiers.messier,
            gal.catalogIdentifiers.ngc,
            gal.catalogIdentifiers.ic,
            gal.catalogIdentifiers.ugc,
            gal.catalogIdentifiers.pgc,
          ].filter(Boolean) as string[];

          for (const catId of catIds) {
            const lowerCat = catId.toLowerCase();
            const cleanCat = lowerCat.replace(/\s+/g, "");
            if (lowerCat === rawQuery || cleanCat === cleanQuery) {
              bestScore = Math.max(bestScore, 1.0);
              matchedAlias = catId;
            } else if (lowerCat.startsWith(rawQuery) || cleanCat.startsWith(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.75);
              matchedAlias = catId;
            } else if (lowerCat.includes(rawQuery) || cleanCat.includes(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.5);
              matchedAlias = catId;
            }
          }
        }

        if (gal.aliases) {
          for (const alias of gal.aliases) {
            const aliasLower = alias.toLowerCase();
            const aliasClean = aliasLower.replace(/\s+/g, "");
            if (aliasLower === rawQuery || aliasClean === cleanQuery) {
              bestScore = Math.max(bestScore, 0.95);
              matchedAlias = alias;
            } else if (aliasLower.startsWith(rawQuery) || aliasClean.startsWith(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.75);
              matchedAlias = alias;
            } else if (aliasLower.includes(rawQuery) || aliasClean.includes(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.5);
              matchedAlias = alias;
            }
          }
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: gal.id,
            slug: gal.slug,
            canonicalName: gal.name,
            standardDesignation: gal.standardDesignation,
            objectType: "GALAXY",
            category: "DEEP_SKY",
            classificationCode: CelestialClassificationCode.GALAXY,
            matchedAlias,
            matchScore: bestScore,
            summary: gal.summary,
          });
        }
      }
    }

    // 3. Search Celestial Objects
    for (const obj of this.objects) {
      if (
        options.categories &&
        options.categories.length > 0 &&
        !options.categories.includes(obj.classification.category)
      ) {
        continue;
      }

      // Avoid duplicate matches between canonical Galaxy and CelestialObject representation
      if (
        scoredResults.some(
          (r) =>
            r.id === obj.id ||
            r.slug === obj.slug ||
            r.canonicalName.toLowerCase() === obj.canonicalName.toLowerCase()
        )
      ) {
        continue;
      }

      const canonicalLower = obj.canonicalName.toLowerCase();
      const designationLower = obj.standardDesignation?.toLowerCase() || "";
      let bestScore = 0;
      let matchedAlias: string | undefined = undefined;

      if (canonicalLower === rawQuery) {
        bestScore = 1.0;
      } else if (canonicalLower.startsWith(rawQuery)) {
        bestScore = 0.9;
      } else if (canonicalLower.includes(rawQuery)) {
        bestScore = 0.7;
      }

      if (designationLower === rawQuery || designationLower.replace(/\s+/g, "") === cleanQuery) {
        bestScore = Math.max(bestScore, 0.95);
      } else if (designationLower.includes(rawQuery)) {
        bestScore = Math.max(bestScore, 0.75);
      }

      if (obj.catalogIdentifiers) {
        const catIds = [
          obj.catalogIdentifiers.messier,
          obj.catalogIdentifiers.ngc,
          obj.catalogIdentifiers.ic,
          obj.catalogIdentifiers.caldwell,
          obj.catalogIdentifiers.hip,
          obj.catalogIdentifiers.hd,
          obj.catalogIdentifiers.gliese,
          obj.catalogIdentifiers.gaiaDr3,
        ].filter(Boolean) as string[];

        for (const catId of catIds) {
          const lowerCat = catId.toLowerCase();
          const cleanCat = lowerCat.replace(/\s+/g, "");
          if (lowerCat === rawQuery || cleanCat === cleanQuery) {
            bestScore = Math.max(bestScore, 0.98);
            matchedAlias = catId;
          } else if (lowerCat.includes(rawQuery) || cleanCat.includes(cleanQuery)) {
            bestScore = Math.max(bestScore, 0.85);
            matchedAlias = catId;
          }
        }
      }

      if (Array.isArray(obj.aliases)) {
        for (const alias of obj.aliases) {
          const aliasName = typeof alias === "string" ? alias : alias?.name;
          if (!aliasName) continue;
          const aliasLower = aliasName.toLowerCase();
          const aliasClean = aliasLower.replace(/\s+/g, "");

          if (aliasLower === rawQuery || aliasClean === cleanQuery) {
            bestScore = Math.max(bestScore, 0.98);
            matchedAlias = aliasName;
          } else if (aliasLower.includes(rawQuery) || aliasClean.includes(cleanQuery)) {
            bestScore = Math.max(bestScore, 0.65);
            matchedAlias = aliasName;
          }
        }
      }

      if (bestScore > 0) {
        let objectType: SearchResultItem["objectType"] = "PLANET";

        if (obj.slug === "sagittarius-a-star" || obj.canonicalName.includes("Sagittarius A*")) {
          objectType = "BLACK_HOLE";
        } else if (obj.classification.category === "DEEP_SKY") {
          switch (obj.classification.code) {
            case "GALAXY":
              objectType = "GALAXY";
              break;
            case "NEBULA":
              objectType = "NEBULA";
              break;
            case "STAR_CLUSTER":
              objectType = "STAR_CLUSTER";
              break;
            case "PLANETARY_NEBULA":
              objectType = "PLANETARY_NEBULA";
              break;
            case "SUPERNOVA_REMNANT":
              objectType = "SUPERNOVA_REMNANT";
              break;
            default:
              objectType = "DEEP_SKY";
          }
        } else if (obj.classification.code === "STAR") {
          objectType = "STAR";
        } else if (
          obj.classification.category === "PLANETARY" &&
          obj.hostSystemId &&
          obj.hostSystemId !== "solar-system" &&
          obj.hostSystemId !== "f0000000-0000-4000-8000-000000000001"
        ) {
          objectType = "EXOPLANET";
        } else if (obj.classification.code === "MOON") {
          objectType = "MOON";
        }

        scoredResults.push({
          id: obj.id,
          slug: obj.slug,
          canonicalName: obj.canonicalName,
          standardDesignation: obj.standardDesignation,
          objectType,
          category: obj.classification.category,
          classificationCode: obj.classification.code,
          matchedAlias,
          matchScore: bestScore,
          summary: obj.summary,
          hostSystemId: obj.hostSystemId,
          thumbnailUrl: obj.media?.thumbnailUrl,
        });
      }
    }

    // 4. Search Galactic Structures
    const allowGalacticStructures =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes("GALACTIC_STRUCTURE" as unknown as CelestialCategory);

    if (allowGalacticStructures) {
      for (const struct of this.galacticStructures) {
        if (scoredResults.some((r) => r.id === struct.id || r.slug === struct.slug)) {
          continue;
        }

        const nameLower = struct.name.toLowerCase();
        const designationLower = struct.standardDesignation?.toLowerCase() || "";
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery)) {
          bestScore = 0.92;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.75;
        }

        if (designationLower === rawQuery || designationLower.replace(/\s+/g, "") === cleanQuery) {
          bestScore = Math.max(bestScore, 0.95);
        } else if (designationLower.includes(rawQuery)) {
          bestScore = Math.max(bestScore, 0.78);
        }

        if (struct.aliases) {
          for (const alias of struct.aliases) {
            const aliasLower = alias.toLowerCase();
            const aliasClean = aliasLower.replace(/\s+/g, "");
            if (aliasLower === rawQuery || aliasClean === cleanQuery) {
              bestScore = Math.max(bestScore, 0.95);
              matchedAlias = alias;
            } else if (aliasLower.includes(rawQuery) || aliasClean.includes(cleanQuery)) {
              bestScore = Math.max(bestScore, 0.7);
              matchedAlias = alias;
            }
          }
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: struct.id,
            slug: struct.slug,
            canonicalName: struct.name,
            standardDesignation: struct.standardDesignation,
            objectType: "GALACTIC_STRUCTURE",
            category: "GALACTIC_STRUCTURE",
            classificationCode: "GALACTIC_STRUCTURE",
            matchedAlias,
            matchScore: bestScore,
            summary: struct.summary,
          });
        }
      }
    }

    // 5. Search Cosmic Epochs & Cosmological Timeline Eras
    const allowCosmicEpochs =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes("COSMIC_EPOCH" as unknown as CelestialCategory);

    if (allowCosmicEpochs) {
      for (const epoch of this.cosmicEpochs) {
        if (scoredResults.some((r) => r.id === epoch.id || r.slug === epoch.slug)) {
          continue;
        }

        const nameLower = epoch.name.toLowerCase();
        const taglineLower = epoch.tagline.toLowerCase();
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery || epoch.slug === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || epoch.slug.startsWith(rawQuery)) {
          bestScore = 0.94;
        } else if (nameLower.includes(rawQuery) || taglineLower.includes(rawQuery)) {
          bestScore = 0.8;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: epoch.id,
            slug: epoch.slug,
            canonicalName: epoch.name,
            objectType: "COSMIC_EPOCH",
            category: "COSMIC_EPOCH",
            classificationCode: "COSMIC_EPOCH",
            matchedAlias,
            matchScore: bestScore,
            summary: `${epoch.tagline} • Cosmic Age: ${epoch.ageRange.minDisplay} – ${epoch.ageRange.maxDisplay}`,
          });
        }
      }
    }

    // 6. Search Observable Universe Landmarks, Horizons, and CMB
    const allowObservable =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes("OBSERVABLE_UNIVERSE" as unknown as CelestialCategory);

    if (allowObservable) {
      // 6a. Observational Landmarks (e.g. GN-z11, JADES-GS-z14-0)
      for (const landmark of this.landmarks) {
        if (
          scoredResults.some(
            (r) =>
              r.id === landmark.id ||
              r.slug === landmark.slug ||
              r.canonicalName.toLowerCase() === landmark.name.toLowerCase() ||
              (landmark.standardDesignation &&
                r.standardDesignation?.toLowerCase() ===
                  landmark.standardDesignation.toLowerCase()) ||
              (landmark.slug === "earth-origin" && r.slug === "earth") ||
              (landmark.slug === "andromeda-m31" && r.slug === "andromeda-galaxy") ||
              (landmark.slug === "virgo-cluster-m87" &&
                (r.slug === "virgo-cluster" || r.slug === "m87-galaxy"))
          )
        ) {
          continue;
        }

        const nameLower = landmark.name.toLowerCase();
        const desigLower = landmark.standardDesignation?.toLowerCase() || "";
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery || landmark.slug === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || landmark.slug.startsWith(rawQuery)) {
          bestScore = 0.95;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.82;
        }

        if (desigLower === rawQuery || desigLower.replace(/\s+/g, "") === cleanQuery) {
          bestScore = Math.max(bestScore, 0.98);
          matchedAlias = landmark.standardDesignation;
        } else if (desigLower.includes(rawQuery)) {
          bestScore = Math.max(bestScore, 0.78);
          matchedAlias = landmark.standardDesignation;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: landmark.id,
            slug: landmark.slug,
            canonicalName: landmark.name,
            standardDesignation: landmark.standardDesignation,
            objectType: "OBSERVABLE_LANDMARK",
            category: "OBSERVABLE_UNIVERSE",
            classificationCode: "OBSERVABLE_LANDMARK",
            matchedAlias,
            matchScore: bestScore,
            summary: `${landmark.summary} • z = ${landmark.redshiftZ.toFixed(2)} (${landmark.comovingDistanceGly.toFixed(1)} Gly)`,
          });
        }
      }

      // 6b. Cosmic Horizons
      for (const horizon of this.horizons) {
        if (scoredResults.some((r) => r.id === horizon.id || r.slug === horizon.slug)) {
          continue;
        }

        const nameLower = horizon.name.toLowerCase();
        let bestScore = 0;

        if (nameLower === rawQuery || horizon.slug === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || horizon.slug.startsWith(rawQuery)) {
          bestScore = 0.92;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.8;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: horizon.id,
            slug: horizon.slug,
            canonicalName: horizon.name,
            objectType: "COSMIC_HORIZON",
            category: "OBSERVABLE_UNIVERSE",
            classificationCode: "COSMIC_HORIZON",
            matchScore: bestScore,
            summary: `${horizon.summary} • Comoving Radius: ${horizon.comovingRadiusGly.toFixed(1)} Gly`,
          });
        }
      }

      // 6c. Dedicated CMB
      const cmbNameLower = this.cmb.name.toLowerCase();
      const cmbQueryMatches =
        rawQuery === "cmb" ||
        rawQuery === "cosmic microwave background" ||
        rawQuery.includes("last scattering") ||
        cmbNameLower.includes(rawQuery);

      if (cmbQueryMatches && !scoredResults.some((r) => r.slug === this.cmb.slug)) {
        scoredResults.push({
          id: this.cmb.id,
          slug: this.cmb.slug,
          canonicalName: this.cmb.name,
          objectType: "CMB",
          category: "OBSERVABLE_UNIVERSE",
          classificationCode: "CMB",
          matchScore: rawQuery === "cmb" ? 1.0 : 0.9,
          summary: `Surface of Photon Decoupling • z ≈ 1089 • T_0 = 2.7255 K • Age: 379,000 Years`,
        });
      }
    }

    // 7. Search Constellations
    const allowConstellations =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes("CONSTELLATION" as unknown as CelestialCategory);

    if (allowConstellations) {
      for (const c of this.constellations) {
        if (scoredResults.some((r) => r.id === c.id || r.slug === c.slug)) {
          continue;
        }

        const nameLower = c.name.toLowerCase();
        const codeLower = c.iauCode.toLowerCase();
        const genitiveLower = c.genitive.toLowerCase();
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery || codeLower === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || codeLower.startsWith(rawQuery)) {
          bestScore = 0.95;
        } else if (nameLower.includes(rawQuery) || genitiveLower.includes(rawQuery)) {
          bestScore = 0.8;
          if (genitiveLower.includes(rawQuery)) matchedAlias = c.genitive;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: c.id,
            slug: c.slug,
            canonicalName: `${c.name} (${c.iauCode})`,
            standardDesignation: c.iauCode,
            objectType: "CONSTELLATION",
            category: "CONSTELLATION",
            classificationCode: "CONSTELLATION",
            matchedAlias,
            matchScore: bestScore,
            summary: `${c.summary} • Brightest Star: ${c.brightestStar.name} (${c.brightestStar.magnitudeV.toFixed(2)} mag)`,
          });
        }
      }
    }

    // 8. Search Space Missions
    const allowMissions =
      !options.categories ||
      options.categories.length === 0 ||
      options.categories.includes("MISSION" as unknown as CelestialCategory);

    if (allowMissions) {
      for (const m of this.missions) {
        if (scoredResults.some((r) => r.id === m.id || r.slug === m.slug)) {
          continue;
        }

        const nameLower = m.name.toLowerCase();
        const destLower = m.destination.toLowerCase();
        const agencyLower = m.agency.toLowerCase();
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (nameLower === rawQuery || m.slug === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || m.slug.startsWith(rawQuery)) {
          bestScore = 0.95;
        } else if (nameLower.includes(rawQuery) || rawQuery.includes(nameLower)) {
          bestScore = 0.85;
        } else if (destLower.includes(rawQuery) || agencyLower.includes(rawQuery)) {
          bestScore = 0.72;
          if (destLower.includes(rawQuery)) matchedAlias = m.destination;
        }

        // Special query triggers like "mars missions", "saturn missions", "voyager"
        if (
          rawQuery.includes("mission") &&
          (nameLower.includes(cleanQuery.replace("mission", "")) ||
            destLower.includes(cleanQuery.replace("mission", "")))
        ) {
          bestScore = Math.max(bestScore, 0.9);
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: m.id,
            slug: m.slug,
            canonicalName: m.name,
            objectType: "MISSION",
            category: "MISSION",
            classificationCode: "MISSION",
            matchedAlias,
            matchScore: bestScore,
            summary: `${m.agency} • ${m.type.replace(/_/g, " ")} • Destination: ${m.destination} (${m.status})`,
            thumbnailUrl: m.heroImageUrl,
          });
        }
      }

      // 8b. Search Spacecraft
      for (const sc of this.spacecraft) {
        if (scoredResults.some((r) => r.id === sc.id || r.slug === sc.slug)) {
          continue;
        }

        const nameLower = sc.name.toLowerCase();
        let bestScore = 0;

        if (nameLower === rawQuery || sc.slug === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || sc.slug.startsWith(rawQuery)) {
          bestScore = 0.94;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.8;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: sc.id,
            slug: sc.slug,
            canonicalName: sc.name,
            objectType: "SPACECRAFT",
            category: "MISSION",
            classificationCode: "SPACECRAFT",
            matchScore: bestScore,
            summary: `${sc.type.replace(/_/g, " ")} • Launch: ${sc.launchDate.slice(0, 10)} • Status: ${sc.status}`,
          });
        }
      }

      // 8c. Search Scientific Instruments
      for (const inst of this.instruments) {
        if (scoredResults.some((r) => r.id === inst.id || r.slug === inst.slug)) {
          continue;
        }

        const nameLower = inst.name.toLowerCase();
        const acronymLower = inst.acronym?.toLowerCase() || "";
        let bestScore = 0;
        let matchedAlias: string | undefined = undefined;

        if (acronymLower === rawQuery || nameLower === rawQuery) {
          bestScore = 1.0;
          if (acronymLower === rawQuery) matchedAlias = inst.acronym;
        } else if (acronymLower.startsWith(rawQuery)) {
          bestScore = 0.92;
          matchedAlias = inst.acronym;
        } else if (nameLower.startsWith(rawQuery)) {
          bestScore = 0.85;
        } else if (nameLower.includes(rawQuery)) {
          bestScore = 0.75;
        }

        if (bestScore > 0) {
          const parentMission = this.missions.find((m) => m.id === inst.missionId);
          scoredResults.push({
            id: inst.id,
            slug: inst.slug,
            canonicalName: inst.acronym ? `${inst.acronym} (${inst.name})` : inst.name,
            objectType: "INSTRUMENT",
            category: "MISSION",
            classificationCode: "INSTRUMENT",
            matchedAlias,
            matchScore: bestScore,
            missionSlug: parentMission?.slug,
            summary: `${inst.scientificPurpose} • Mission: ${parentMission?.name || "Space Mission"}`,
          });
        }
      }

      // 8d. Search Scientific Discoveries
      for (const disc of this.discoveries) {
        if (scoredResults.some((r) => r.id === disc.id || r.slug === disc.slug)) {
          continue;
        }

        const titleLower = disc.title.toLowerCase();
        const descLower = disc.description.toLowerCase();
        const targetLower = disc.targetName?.toLowerCase() || "";
        let bestScore = 0;

        if (
          titleLower.includes(rawQuery) ||
          descLower.includes(rawQuery) ||
          targetLower.includes(rawQuery)
        ) {
          bestScore = titleLower.includes(rawQuery) ? 0.88 : 0.7;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: disc.id,
            slug: disc.slug,
            canonicalName: disc.title,
            objectType: "DISCOVERY",
            category: "MISSION",
            classificationCode: "DISCOVERY",
            matchScore: bestScore,
            summary: `${disc.discoveryType.replace(/_/g, " ")} (${disc.date.slice(0, 4)}) • Target: ${disc.targetName || "Space Target"}`,
          });
        }
      }

      // 8e. Search Ground & Space Observatories
      for (const obs of this.observatories) {
        if (scoredResults.some((r) => r.id === obs.id || r.slug === obs.slug)) {
          continue;
        }

        const nameLower = obs.name.toLowerCase();
        const acronymLower = obs.acronym ? obs.acronym.toLowerCase() : "";
        const countryLower = obs.country.toLowerCase();
        const locLower = obs.locationName.toLowerCase();
        let bestScore = 0;
        let matchedAlias: string | undefined;

        if (nameLower === rawQuery || acronymLower === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower.startsWith(rawQuery) || acronymLower.startsWith(rawQuery)) {
          bestScore = 0.9;
        } else if (
          nameLower.includes(rawQuery) ||
          countryLower.includes(rawQuery) ||
          locLower.includes(rawQuery)
        ) {
          bestScore = 0.75;
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: obs.id,
            slug: obs.slug,
            canonicalName: obs.acronym ? `${obs.acronym} (${obs.name})` : obs.name,
            objectType: "OBSERVATORY",
            category: "OBSERVATORY",
            classificationCode: "OBSERVATORY",
            matchedAlias,
            matchScore: bestScore,
            summary: `${obs.type} Observatory • ${obs.locationName}, ${obs.country}`,
          });
        }
      }

      // 8f. Search Global Space & Research Organizations
      for (const org of this.organizations) {
        if (scoredResults.some((r) => r.id === org.id || r.slug === org.slug)) {
          continue;
        }

        const nameLower = org.officialName.toLowerCase();
        const shortLower = org.shortName.toLowerCase();
        const acronymLower = org.acronym ? org.acronym.toLowerCase() : "";
        const countryLower = org.country.toLowerCase();
        let bestScore = 0;
        let matchedAlias: string | undefined;

        if (shortLower === rawQuery || acronymLower === rawQuery) {
          bestScore = 1.0;
        } else if (nameLower === rawQuery) {
          bestScore = 0.95;
        } else if (
          shortLower.startsWith(rawQuery) ||
          acronymLower.startsWith(rawQuery) ||
          nameLower.startsWith(rawQuery)
        ) {
          bestScore = 0.85;
        } else if (
          nameLower.includes(rawQuery) ||
          countryLower.includes(rawQuery) ||
          org.primaryFocusAreas.some((f) => f.toLowerCase().includes(rawQuery))
        ) {
          bestScore = 0.75;
        }

        if (org.aliases) {
          for (const alias of org.aliases) {
            const aliasLower = alias.toLowerCase();
            if (aliasLower === rawQuery) {
              if (bestScore < 0.95) {
                bestScore = 0.95;
                matchedAlias = alias;
              }
            } else if (aliasLower.includes(rawQuery)) {
              if (bestScore < 0.7) {
                bestScore = 0.7;
                matchedAlias = alias;
              }
            }
          }
        }

        if (bestScore > 0) {
          scoredResults.push({
            id: org.id,
            slug: org.slug,
            canonicalName: org.acronym ? `${org.acronym} — ${org.officialName}` : org.officialName,
            objectType: "ORGANIZATION",
            category: "ORGANIZATION",
            classificationCode: "ORGANIZATION",
            matchedAlias,
            matchScore: bestScore,
            summary: `${org.organizationType.replace(/_/g, " ")} • ${org.country}`,
          });
        }
      }
    }

    // Sort by score descending, then alphabetically by canonical name
    scoredResults.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      return a.canonicalName.localeCompare(b.canonicalName);
    });

    const paginated = scoredResults.slice(0, limit);

    return {
      results: paginated,
      totalMatches: scoredResults.length,
      query: options.query,
      executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
    };
  }
}
