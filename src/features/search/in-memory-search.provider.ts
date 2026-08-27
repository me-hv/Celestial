import { CelestialObject } from "@/domain/celestial-object/types";
import { ISearchProvider } from "./search-provider.interface";
import { SearchQueryOptions, SearchResponse, SearchResultItem } from "./types";

export class InMemorySearchProvider implements ISearchProvider {
  private objects: CelestialObject[] = [];

  constructor(initialObjects: CelestialObject[] = []) {
    this.objects = initialObjects;
  }

  public setIndex(objects: CelestialObject[]): void {
    this.objects = objects;
  }

  public async search(options: SearchQueryOptions): Promise<SearchResponse> {
    const startTime = performance.now();
    const rawQuery = options.query.trim().toLowerCase();
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

    for (const obj of this.objects) {
      // Category filter check
      if (
        options.categories &&
        options.categories.length > 0 &&
        !options.categories.includes(obj.classification.category)
      ) {
        continue;
      }

      const canonicalLower = obj.canonicalName.toLowerCase();
      const designationLower = obj.standardDesignation?.toLowerCase() || "";
      let bestScore = 0;
      let matchedAlias: string | undefined = undefined;

      // 1. Exact match on canonical name
      if (canonicalLower === rawQuery) {
        bestScore = 1.0;
      } else if (canonicalLower.startsWith(rawQuery)) {
        // 2. Prefix match
        bestScore = 0.9;
      } else if (canonicalLower.includes(rawQuery)) {
        // 3. Substring match
        bestScore = 0.7;
      }

      // Check standard designation
      if (designationLower === rawQuery) {
        bestScore = Math.max(bestScore, 0.95);
      } else if (designationLower.includes(rawQuery)) {
        bestScore = Math.max(bestScore, 0.75);
      }

      // Check aliases
      for (const alias of obj.aliases) {
        const aliasLower = alias.name.toLowerCase();
        if (aliasLower === rawQuery) {
          if (0.9 > bestScore) {
            bestScore = 0.9;
            matchedAlias = alias.name;
          }
        } else if (aliasLower.includes(rawQuery)) {
          if (0.6 > bestScore) {
            bestScore = 0.6;
            matchedAlias = alias.name;
          }
        }
      }

      if (bestScore > 0) {
        scoredResults.push({
          id: obj.id,
          slug: obj.slug,
          canonicalName: obj.canonicalName,
          standardDesignation: obj.standardDesignation,
          category: obj.classification.category,
          classificationCode: obj.classification.code,
          matchedAlias,
          matchScore: bestScore,
          summary: obj.summary,
          thumbnailUrl: obj.media?.thumbnailUrl,
        });
      }
    }

    // Sort by score descending, then alphabetically by canonical name
    scoredResults.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
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
