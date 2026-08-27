# CELESTIAL Product & Engineering Roadmap

This document outlines the phased development path for **CELESTIAL**.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 0: Foundation & Architecture  [CURRENT]                         │
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
│  Phase 1: Solar System Explorer                                        │
│  - 3D Interactive Solar System View (Sun, 8 planets, major moons)      │
│  - Keplerian orbit rendering & real-time time-scrubbing engine         │
│  - Authoritative Solar System dataset ingestion (NASA JPL Horizons)    │
│  - Celestial object detail view & scientific telemetry cards           │
│  - Keyboard navigation & camera target transitions                     │
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
