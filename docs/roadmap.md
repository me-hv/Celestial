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
│  Phase 4: Deep Sky & Galactic Explorer  [COMPLETED]                    │
│  - Authoritative Messier, NGC, IC, SIMBAD, and NED dataset ingestion   │
│  - Scientific taxonomy (Galaxies, Nebulae, Clusters, Planetary, SNR)   │
│  - Separation of intrinsic physical properties from observations       │
│  - Multi-wavelength observational archive (Optical, IR, Radio, X-ray)  │
│  - Pure IAU Equatorial <-> Galactic coordinate transformations (l, b)  │
│  - Exact celestial angular separation math (Vincenty formula)          │
│  - Interactive 2D Celestial Sky projection with Equatorial & Galactic  │
│  - Interactive 3D Deep Sky space scene with Galactic Plane reference   │
│  - Deep Sky Atlas (/deep-sky) with 2D / 3D / Catalog modes & filters   │
│  - Dedicated /deep-sky/[slug] profiles with cosmic location hierarchy  │
│  - Global search integration for Messier, NGC, and historical names    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 5: Milky Way & Galactic Structure Explorer  [COMPLETED]         │
│  - First-class GalacticStructure domain entity & structural taxonomy   │
│  - Standard Galactocentric coordinate frame (R_0 = 8.18 kpc, z_0 = 21) │
│  - Pure transformations (ICRS <-> Galactic <-> Galactocentric Cartesian)│
│  - Parametric logarithmic spiral arm equations (Orion, Perseus, Sgr)   │
│  - Dedicated Sagittarius A* SMBH object (4.154 x 10^6 M_sun)           │
│  - Local Group cluster integration (Milky Way, M31, M33, LMC, SMC)     │
│  - Interactive 3D Milky Way scene with particle disk & layer controls  │
│  - Interactive 2D top-down Galactocentric map with radius rings        │
│  - "YOU ARE HERE" cosmic spatial orientation navigation                │
│  - Dedicated /milky-way, /milky-way/overview, and /milky-way/[slug]    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 6: Local Group & Galaxy Explorer  [COMPLETED]                   │
│  - First-class Galaxy entity with morphology & kinematics models       │
│  - Cosmological distance models, redshift conversion & lookback time   │
│  - Local Group spatial coordinate frame (Megaparsec Cartesian math)    │
│  - Authoritative Local Group dataset (Milky Way, M31, M33, LMC, SMC)   │
│  - Dedicated Galaxy Repository with morphology and distance filters    │
│  - Interactive 3D Local Group Space visualizer with distance shells    │
│  - Interactive 2D Extragalactic Map with pan/zoom controls             │
│  - Procedural morphology-aware galaxy renderer (Spiral, Elliptical)    │
│  - Interactive Galaxy Comparison Workbench (Milky Way vs Andromeda)   │
│  - Dedicated routes: /local-group, /galaxies, /galaxies/[slug], compare│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 7: Cosmic Web & Large-Scale Structure Explorer  [COMPLETED]     │
│  - First-class CosmicStructure domain entity & hierarchical taxonomy   │
│  - Configurable Lambda-CDM cosmological distance calculator            │
│  - Galactocentric Megaparsec and Supergalactic coordinate transforms   │
│  - Curated authoritative dataset of 18 large-scale cosmic structures   │
│  - Interactive 3D Cosmic Web visualizer with procedural halos & tubes  │
│  - Interactive 2D Extragalactic Map with scale presets (15-350 Mpc)    │
│  - Comparative structure workbench with 3D spatial separation vectors  │
│  - Universal CosmicLocationBreadcrumb across all astronomical scales   │
│  - Dedicated routes: /cosmic-web, /overview, /[slug], /compare         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 8: Cosmic Time Machine & Universe Timeline  [COMPLETED]         │
│  - First-class CosmicEpoch domain model & 14 cosmological epochs       │
│  - Lambda-CDM FLRW expansion engine, scale factor a(t), lookback time  │
│  - Numerical root-solver for inverted cosmic age to redshift           │
│  - Strict physical separation: Light-Travel vs Cosmological Lookback   │
│  - Interactive 3D Past Light Cone with CMB decoupling base surface     │
│  - Interactive 2D Spacetime Map plotting a(t) vs lookback time         │
│  - Multi-scale scrubbers (Lookback Gyr, Redshift z, Scale Factor a)    │
│  - Cosmology Calibration workbench (Planck, SH0ES, Einstein-de Sitter) │
│  - Dedicated routes: /cosmic-time, /cosmic-time/[epoch], /redshift     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 9: Observable Universe & CMB Explorer  [COMPLETED]              │
│  - First-class Observable Universe & Cosmic Horizon domain models      │
│  - FLRW Particle Horizon (~46.5 Gly comoving) & Hubble Sphere (~14 Gly)│
│  - Cosmological Event Horizon (~17 Gly) & Euclidean Light-Travel limits│
│  - 9 Redshift Distance Shells & 12 Authoritative High-z Landmarks      │
│  - Dedicated Cosmic Microwave Background (CMB) Last-Scattering surface │
│  - Interactive 3D Observable Universe Space with log scale mapping     │
│  - Dedicated 3D CMB Sphere with dipole vector & acoustic multipoles    │
│  - Interactive 2D Spacetime Map (Comoving vs Lookback, D_A turnover)   │
│  - Unified Cosmic Scale Hierarchy (Earth -> Observable Universe)       │
│  - Dedicated routes: /observable-universe, /cmb, /horizon, /[slug]     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 10: Live Sky & Astronomical Data Explorer  [COMPLETED]          │
│  - Ground observer location model & Local Mean Sidereal Time (LMST)    │
│  - Equatorial <-> Horizontal (Alt/Az) & Ecliptic coordinate engines    │
│  - Real-time Keplerian planetary ephemerides (Sun & 8 major planets)   │
│  - High-accuracy analytical lunar position & synodic phase engine      │
│  - 88 IAU standard constellations & 3D glowing line asterisms          │
│  - Interactive 3D Inner Celestial Sphere with Ground Horizon plane     │
│  - Interactive 2D All-Sky Planisphere (Zenith-centered polar map)      │
│  - Real-time object telemetry, culmination altitude & rise/set times   │
│  - Astronomical twilights (Civil, Nautical, Astronomical) & schedule   │
│  - Night Sky Observation Session Planner with magnitude limits         │
│  - Universal search-to-sky integration & multi-catalog resolution      │
│  - Dedicated routes: /sky, /sky/events, /sky/planner, /where-is/[slug] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 11: Space Missions, Spacecraft & Discoveries  [COMPLETED]       │
│  - SpaceMission, Spacecraft, Instrument, Discovery domain models & Zod │
│  - Authoritative dataset of 18 historical & active space missions      │
│  - Multi-component missions (Cassini+Huygens, Apollo 11, Mars 2020)    │
│  - Interactive 3D Heliocentric Trajectory viewport & Catmull-Rom spline│
│  - Interactive timeline scrubber, speed multiplier & milestone stepping│
│  - Live speed/distance telemetry HUD & tracking camera mode            │
│  - Scientific Discoveries Archive with epistemic classifications & DOI │
│  - Universal Search indexing for missions, spacecraft & discoveries    │
│  - Bidirectional links: Mission -> Target Objects & Object -> Missions │
│  - Dedicated routes: /missions, /missions/[slug], /spacecraft, /disc.  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 11.5: Global Space Mission & Org Registry  [COMPLETED]          │
│  - Global Space & Research Organization Registry (33+ institutions)   │
│  - Multi-agency participation matrix (Lead, Builder, Payload, Science) │
│  - Global geographic representation (ISRO, JAXA, CNSA, Roscosmos, etc.)│
│  - Historic Soviet space exploration (1955–1991) strict attribution    │
│  - Public scientific data archive linkages (ISSDC, DARTS, PSA, PDS)    │
│  - Multi-region & country filtering across missions and organizations  │
│  - Dedicated routes: /organizations, /organizations/[slug]             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Phase 12: Target Intelligence & Observatories  [COMPLETED]            │
│  - Multi-Wavelength Ground & Space Observatories (15+ facilities)     │
│  - Unified Target Intelligence Engine across all astronomical domains  │
│  - Observation Intelligence & Multi-Wavelength Coverage Radar Matrix   │
│  - Scientific Relation Graph (Nodes, Edges, Cross-Domain Associations) │
│  - Observing List Manager with local storage & export/import           │
│  - Dedicated routes: /observatories, /observatories/[slug], /research  │
└────────────────────────────────────────────────────────────────────────┘
```
