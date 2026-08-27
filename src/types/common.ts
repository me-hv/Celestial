/**
 * Shared Common Types across CELESTIAL
 */

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}

export interface BoundingBox3D {
  min: Coordinates3D;
  max: Coordinates3D;
}
