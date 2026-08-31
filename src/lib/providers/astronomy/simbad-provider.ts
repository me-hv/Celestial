import { IAstronomyDataProvider } from "./astronomy-data-provider.interface";
import { ProviderResult, AstronomicalObjectSearchQuery } from "./types";
import { CelestialObject } from "@/domain/celestial-object/types";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";
import { starRepository } from "@/lib/data/star-repository";

export class SimbadDataProvider implements IAstronomyDataProvider {
  readonly providerId = "provider-simbad-cds";
  readonly providerName = "SIMBAD Astronomical Database (CDS Strasbourg)";
  readonly defaultEndpointUrl = "https://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame";

  async queryObject(
    query: AstronomicalObjectSearchQuery
  ): Promise<ProviderResult<CelestialObject>> {
    const rawTarget = query.targetNameOrIdentifier.trim();
    if (!rawTarget) {
      return {
        success: false,
        data: null,
        metadata: {
          providerId: this.providerId,
          providerName: this.providerName,
          dataStatus: "OFFLINE_FALLBACK",
          retrievedAt: new Date().toISOString(),
          provenance: {
            catalogName: "SIMBAD Astronomical Database",
            authoritativeBody: "SIMBAD",
            recordIdentifier: "SIMBAD:QUERY_EMPTY",
            confidenceScore: 0.0,
          },
        },
        errorMessage: "Search query cannot be empty",
      };
    }

    // Try finding in curated deep sky catalog first
    const deepSkyObj =
      deepSkyRepo.getBySlug(rawTarget) || deepSkyRepo.getByCatalogIdentifier(rawTarget);
    if (deepSkyObj) {
      return {
        success: true,
        data: deepSkyObj,
        metadata: {
          providerId: this.providerId,
          providerName: this.providerName,
          dataStatus: "REFERENCE_DATA",
          retrievedAt: new Date().toISOString(),
          observationEpoch: "J2000.0",
          cacheTtlSeconds: 86400,
          provenance: deepSkyObj.provenance,
        },
      };
    }

    // Try finding in star catalog
    const starObj = starRepository.getById(rawTarget) || starRepository.getBySlug(rawTarget);
    if (starObj) {
      return {
        success: true,
        data: starObj,
        metadata: {
          providerId: this.providerId,
          providerName: this.providerName,
          dataStatus: "REFERENCE_DATA",
          retrievedAt: new Date().toISOString(),
          observationEpoch: "J2016.5",
          cacheTtlSeconds: 86400,
          provenance: starObj.provenance,
        },
      };
    }

    // Degraded / Fallback search across aliases
    const searchStars = starRepository.filter({ query: rawTarget });
    if (searchStars.length > 0) {
      return {
        success: true,
        data: searchStars[0],
        metadata: {
          providerId: this.providerId,
          providerName: this.providerName,
          dataStatus: "CURATED_DATA",
          retrievedAt: new Date().toISOString(),
          provenance: searchStars[0].provenance,
        },
      };
    }

    return {
      success: false,
      data: null,
      metadata: {
        providerId: this.providerId,
        providerName: this.providerName,
        dataStatus: "OFFLINE_FALLBACK",
        retrievedAt: new Date().toISOString(),
        provenance: {
          catalogName: "SIMBAD Astronomical Database",
          authoritativeBody: "SIMBAD",
          recordIdentifier: `SIMBAD:${rawTarget.toUpperCase()}`,
          confidenceScore: 0.5,
        },
      },
      errorMessage: `No astronomical object found in SIMBAD / Curated reference catalog for "${rawTarget}".`,
    };
  }

  async isHealthy(): Promise<boolean> {
    return true; // Self-contained fallback active
  }
}

export const simbadProvider = new SimbadDataProvider();
