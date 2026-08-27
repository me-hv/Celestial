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
│  Phase 2: Exoplanet & Stellar Systems Explorer  [COMPLETED]            │
│  - NASA Exoplanet Archive (PS) TAP schema ingestion pipeline           │
│  - Scientific uncertainty model (ScientificMeasurement<T> error bars)  │
│  - Relational StellarSystem container & multi-star/barycentric models  │
│  - Kopparapu Circumstellar Habitable Zone physics model & visualizer   │
│  - Adaptive system scaling (Compact systems, Solar, Wide systems)      │
│  - Interactive 3D multi-system switcher (TRAPPIST-1, Proxima, Kepler)  │
│  - Dedicated /systems and /systems/[slug] profiles & extended search   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 3: Stellar Neighborhood & Star Catalog  [COMPLETED]             │
│  - Authoritative Gaia DR3 & SIMBAD/CNS star catalog ingestion          │
│  - Pure astrometric coordinate math (RA, Dec, Parallax to 3D ICRS)     │
│  - Multi-catalog identifier resolution (Gaia DR3, HIP, HD, GJ, Bayer)  │
│  - Interactive 3D Stellar Neighborhood scene (Sun-centered 25 pc)      │
│  - Visual reference distance shells (5 pc, 10 pc, 20 pc) & labels      │
│  - Stellar Atlas (/stars) with 3D/Catalog views, filtering, pagination │
│  - Dedicated /stars/[slug] profiles with planetary system bridges      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 4: Deep Sky, Galaxies & Space Missions                          │
│  - Messier & NGC catalog visualization (Nebulae, Star Clusters)        │
│  - Milky Way structure & Local Group macro view                        │
│  - Historic & active space missions (Voyager, JWST, Cassini, Artemis)  │
│  - Trajectory replay and milestone timeline view                       │
└────────────────────────────────────────────────────────────────────────┘
```
