import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";

export interface SearchQueryOptions {
  query: string;
  categories?: CelestialCategory[];
  limit?: number;
  offset?: number;
}

export interface SearchResultItem {
  id: string;
  slug: string;
  canonicalName: string;
  standardDesignation?: string;
  objectType?:
    | "PLANET"
    | "STAR"
    | "EXOPLANET"
    | "MOON"
    | "GALAXY"
    | "LOCAL_GROUP"
    | "NEBULA"
    | "STAR_CLUSTER"
    | "PLANETARY_NEBULA"
    | "SUPERNOVA_REMNANT"
    | "BLACK_HOLE"
    | "GALACTIC_STRUCTURE"
    | "COSMIC_STRUCTURE"
    | "COSMIC_EPOCH"
    | "TIMELINE_EVENT"
    | "OBSERVABLE_LANDMARK"
    | "COSMIC_HORIZON"
    | "CMB"
    | "DEEP_SKY"
    | "CONSTELLATION"
    | "SKY_OBJECT"
    | "MISSION";
  category:
    | CelestialCategory
    | "GALACTIC_STRUCTURE"
    | "GALAXY"
    | "COSMIC_STRUCTURE"
    | "COSMIC_EPOCH"
    | "OBSERVABLE_UNIVERSE"
    | "CONSTELLATION";
  classificationCode:
    | CelestialClassificationCode
    | "GALACTIC_STRUCTURE"
    | "COSMIC_STRUCTURE"
    | "COSMIC_EPOCH"
    | "OBSERVABLE_LANDMARK"
    | "COSMIC_HORIZON"
    | "CMB"
    | "CONSTELLATION";
  matchedAlias?: string;
  matchScore: number; // 0.0 to 1.0 (relevance ranking)
  summary?: string;
  hostSystemId?: string;
  thumbnailUrl?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  totalMatches: number;
  query: string;
  executionTimeMs: number;
}

export type SearchQuery = SearchQueryOptions;
