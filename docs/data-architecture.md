# CELESTIAL Data & Ingestion Architecture

This document describes the data lifecycle, ingestion pipelines, database schemas, and scientific data hygiene protocols in **CELESTIAL**.

## 1. The Ingestion Pipeline

To preserve application purity and prevent frontend contamination from raw scientific formats (FITS, VOTable, TAP, CSV, JSON-LD), all external astronomical data flows through a strict 6-stage ingestion pipeline:

```
┌───────────────────────────────┐
│     External Source / API     │ (NASA Exoplanet, SIMBAD, JPL Horizons, MPC)
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           Fetcher             │ (Pulls raw data, handles rate limits, caching, pagination)
└───────────────┬───────────────┘
                │ Raw Payload
                ▼
┌───────────────────────────────┐
│          Normalizer           │ (Standardizes units: km, kg, AU, Kelvin, J2000 epoch)
└───────────────┬───────────────┘
                │ Normalized Data
                ▼
┌───────────────────────────────┐
│          Validator            │ (Zod domain schema checks, range validations)
└───────────────┬───────────────┘
                │ Validated Entity
                ▼
┌───────────────────────────────┐
│           Mapper              │ (Resolves aliases, parent-child relations, provenance IDs)
└───────────────┬───────────────┘
                │ Domain Model
                ▼
┌───────────────────────────────┐
│          Database             │ (PostgreSQL / Supabase storage)
└───────────────────────────────┘
```

---

## 2. Ingestion Pipeline Interface Contracts

The ingestion architecture is specified via standard TypeScript interfaces in `src/lib/ingestion/`:

```typescript
export interface IFetcher<TRaw> {
  sourceName: string;
  fetch(queryOrParams: unknown): Promise<TRaw>;
}

export interface INormalizer<TRaw, TNormalized> {
  normalize(raw: TRaw): Promise<TNormalized> | TNormalized;
}

export interface IValidator<TNormalized, TValidated> {
  validate(data: TNormalized): Promise<TValidated> | TValidated;
}

export interface IMapper<TValidated, TEntity> {
  mapToEntity(validated: TValidated): Promise<TEntity> | TEntity;
}

export interface IIngestionPipeline<TRaw, TEntity> {
  execute(params: unknown): Promise<IngestionResult<TEntity>>;
}
```

---

## 3. Database Architecture (PostgreSQL / Supabase)

### Relational Entity-Relationship Outline

```
  ┌─────────────────────────┐
  │     sources             │◄─────────────────────────┐
  │  (id, name, url, doi)   │                          │
  └────────────┬────────────┘                          │
               │                                       │
               │ 1:N                                   │ 1:N
  ┌────────────▼────────────┐        1:N      ┌────────┴────────────┐
  │ celestial_objects       ├────────────────►│  object_aliases     │
  │  (id, slug, name,       │                 │  (object_id, alias, │
  │   classification, mass, │                 │   alias_type)       │
  │   radius, orbital_data) │                 └─────────────────────┘
  └────────────┬────────────┘
               │ 1:N
               ├─────────────────────────────┐
               ▼ 1:N                         ▼ 1:N
  ┌─────────────────────────┐   ┌───────────────────────────┐
  │  object_relationships   │   │  media_assets             │
  │  (parent_id, child_id,  │   │  (object_id, url, credit, │
  │   relation_type)        │   │   asset_type)             │
  └─────────────────────────┘   └───────────────────────────┘
               │
               ▼
  ┌─────────────────────────┐        1:N      ┌─────────────────────┐
  │  missions               ├────────────────►│  spacecraft         │
  │  (id, name, target_id,  │                 │  (id, mission_id,   │
  │   launch_date, agency)  │                 │   name, status)     │
  └─────────────────────────┘                 └─────────────────────┘
```

### Key Database Guarantees:

- **UUID Primary Keys & Slugs**: Every entity has a deterministic or v4 UUID and a unique human-readable slug.
- **JSONB for Variable Scientific Metrics**: Atmospheric profiles, custom photometric bands, and ephemeris tables utilize structured JSONB with schema validation.
- **Full Text Search & Trigrams**: PostgreSQL `pg_trgm` and `tsvector` generated columns allow instant searching across canonical names, catalog designations, and aliases.
- **Row-Level Security (RLS)**: Public read access for astronomical catalogs; write access strictly restricted to authenticated ingestion service roles.
