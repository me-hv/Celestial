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
  category: CelestialCategory;
  classificationCode: CelestialClassificationCode;
  matchedAlias?: string;
  matchScore: number; // 0.0 to 1.0 (relevance ranking)
  summary?: string;
  thumbnailUrl?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  totalMatches: number;
  query: string;
  executionTimeMs: number;
}
