# CELESTIAL System Architecture

This document describes the architectural principles, component boundaries, and layer separation of **CELESTIAL**.

## 1. System Vision & Paradigm

CELESTIAL is designed as an interactive astronomical atlas, planetarium, and scientific exploration platform ("Google Maps for the universe"). The architecture is built around three non-negotiable principles:

1. **Domain Isolation**: Scientific domain models, coordinate transforms, and orbital equations must never be tightly coupled to UI frameworks or database drivers.
2. **Scientific Provenance**: Every astronomical property (mass, radius, orbital period, spectral type) is treated as a scientific measurement tied to an authoritative catalog, paper, or mission source.
3. **Pluggable Visualizations**: 2D data views, analytical cards, search indexing, and future 3D Three.js rendering engines consume the same clean domain interface.

---

## 2. High-Level Layer Decomposition

```
┌───────────────────────────────────────────────────────────┐
│                    Presentation Layer                     │
│  (Next.js App Router, React 19, Tailwind Semantic Tokens) │
│  - Application Shell, Hero, Search Trigger                │
│  - Route Handlers & Server/Client Components              │
│  - 3D Visualization Boundary (ThreeCanvasBoundary)        │
└─────────────────────────────┬─────────────────────────────┘
                              │ Uses
┌─────────────────────────────▼─────────────────────────────┐
│                    Features & Search Layer                │
│  - Search Provider Abstraction (ISearchProvider)          │
│  - Exploration View Models & Command Palette Hooks        │
└─────────────────────────────┬─────────────────────────────┘
                              │ Validates & Orchestrates
┌─────────────────────────────▼─────────────────────────────┐
│                      Domain Model Layer                   │
│  (Pure TypeScript + Zod Runtime Validation Schemas)       │
│  - CelestialObject (Polymorphic Entity)                   │
│  - StellarSystem, Galaxy, Mission, Spacecraft             │
│  - ProvenanceRecord & Measurement Units                   │
└─────────────────────────────▲─────────────────────────────┘
                              │ Persists / Ingests
┌─────────────────────────────┴─────────────────────────────┐
│                 Data & Ingestion Infrastructure           │
│  - PostgreSQL / Supabase Client                           │
│  - Scientific Ingestion Pipeline (Fetcher -> Normalizer   │
│    -> Validator -> Mapper -> Database)                    │
│  - External Authority APIs (NASA, ESA, IAU, SIMBAD)       │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Directory Layout & Responsibilities

```text
src/
├── app/                  # Next.js App Router pages, layouts, error boundaries
│   ├── (marketing)/      # Public landing and overview pages
│   ├── (explorer)/       # Exploration shell, object atlas, mission timelines
│   ├── api/              # API Route Handlers (Health, Search, Telemetry)
│   ├── error.tsx         # Root error boundary
│   ├── not-found.tsx     # 404 handler
│   └── globals.css       # Design tokens & base styles
│
├── components/           # Reusable UI elements
│   ├── ui/               # Atomic design primitives (Button, Card, Input, Badge)
│   └── shared/           # Composition components (Navbar, Footer, SearchModal)
│
├── domain/               # Core business & scientific domain logic (Framework-agnostic)
│   ├── celestial-object/ # Polymorphic object entity, schemas, classifications
│   ├── stellar-system/   # Star system hierarchies and barycentric models
│   ├── mission/          # Spacecraft, trajectories, discovery payloads
│   └── provenance/       # Scientific citations, DOIs, catalog registries
│
├── features/             # Feature-specific implementations
│   ├── search/           # Search providers, scoring, alias resolution
│   ├── exploration/      # Atlas navigator, filter trees
│   ├── astronomy/        # Coordinate conversions, ephemeris calculations
│   └── visualization/    # 3D canvas boundaries, WebGL adapters
│
├── lib/                  # Infrastructure & cross-cutting utilities
│   ├── config/           # Safe runtime environment validation (Zod)
│   ├── db/               # Supabase client & database schema types
│   ├── ingestion/        # Ingestion pipeline contracts & normalizers
│   ├── errors/           # Custom error hierarchy & formatting
│   └── utils/            # Styling (cn) and scientific unit formatters
│
└── types/                # Shared global type definitions
```

---

## 4. Architectural Boundaries & Extension Points

### 4.1 3D Visualization Boundary

3D WebGL rendering is deliberately isolated behind `ThreeCanvasBoundary`. This guarantees:

- Server components remain lightweight without pulling large Three.js bundles.
- Future WebGL / WebGPU scene engines can be swapped or tested headlessly.
- The UI layer communicates with the 3D canvas exclusively via serializable scene descriptors and camera target states.

### 4.2 Search Provider Abstraction

Search is defined via the `ISearchProvider` interface. Phase 0 ships with an `InMemorySearchProvider` for instant unit testing and local development, while Phase 1+ can seamlessly switch to PostgreSQL Full-Text Search, pgvector, or Meilisearch without altering any UI components.

### 4.3 Ingestion Pipeline Boundary

Data ingestion is decoupled from the frontend web server. External datasets (NASA Exoplanet Archive, IAU Minor Planet Center, SIMBAD) are fetched, normalized, validated against domain schemas, and mapped to database models via isolated pipeline interfaces.
