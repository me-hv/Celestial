# CELESTIAL Product & Engineering Roadmap

This document outlines the phased development path for **CELESTIAL**.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 0: Foundation & Architecture  [COMPLETED]                       │
│  - Clean TypeScript + Next.js architecture                             │
│  - Generalized CelestialObject domain model & Zod validation           │
│  - Database schema & scientific provenance specification               │
│  - Ingestion pipeline abstraction                                      │
│  - Cinematic dark design system & responsive application shell         │
│  - Search abstraction & testing foundation                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 1: Solar System Explorer  [COMPLETED]                           │
│  - Interactive 3D Solar System (Sun, 8 planets, Earth's Moon)          │
│  - Keplerian orbit mechanics solver & calibrated dual-scale engine     │
│  - Authoritative NASA JPL SSD ephemeris dataset & provenance citations │
│  - Interactive object selection, smooth camera focus & orbit toggles   │
│  - Floating telemetry data cards & dedicated /objects/[slug] profiles  │
│  - Real-time search with multi-catalog alias resolution (Terra, Luna)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 2: Stellar Systems & Exoplanets                                 │
│  - NASA Exoplanet Archive ingestion pipeline                           │
│  - Nearby star systems (Alpha Centauri, Trappist-1, Sirius, Vega)      │
│  - Habitable zone visualization & transit light-curve diagrams         │
│  - Enhanced fuzzy search across 5,000+ confirmed exoplanets            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 3: Deep Sky, Galaxies & Space Missions                          │
│  - Messier & NGC catalog visualization (Nebulae, Star Clusters)        │
│  - Milky Way structure & Local Group macro view                        │
│  - Historic & active space missions (Voyager, JWST, Cassini, Artemis)  │
│  - Trajectory replay and milestone timeline view                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 4: Scientific Atlas & Community Exploration                    │
│  - Constellation overlays & night sky observer mode                    │
│  - Interactive astronomical calculator (Delta-V, transit timing)       │
│  - Custom observation bookmarks & scientific paper citations           │
│  - Performance optimization (LOD WebGPU shaders, instanced rendering)  │
└────────────────────────────────────────────────────────────────────────┘
```
