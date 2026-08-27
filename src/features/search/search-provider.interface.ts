import { SearchQueryOptions, SearchResponse } from "./types";

export interface ISearchProvider {
  search(options: SearchQueryOptions): Promise<SearchResponse>;
}
