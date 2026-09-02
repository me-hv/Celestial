# Unified Scientific Research Workspace & Target Intelligence

## 1. Architectural Overview

The **Scientific Research Workspace** is the central multi-domain integration engine of CELESTIAL. It connects planetary science, astrophysics, cosmology, mission archives, astronomical observatories, and observational astronomy into a unified knowledge graph.

```
+-----------------------------------------------------------------------------------+
|                        UNIVERSAL SCIENTIFIC RESEARCH GRAPH                        |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                                     UNIVERSE                                      |
|                                        │                                          |
|                                 COSMIC STRUCTURE                                  |
|                                        │                                          |
|                                     GALAXY                                        |
|                                        │                                          |
|                                      STAR                                         |
|                                        │                                          |
|                                   PLANET/MOON                                     |
|                                        │                                          |
|                                      TARGET                                       |
|                                        │                                          |
|                       +----------------+----------------+                         |
|                       │                │                │                         |
|                    MISSION        OBSERVATORY      DATA ARCHIVE                   |
|                       │                │                │                         |
|                   SPACECRAFT      INSTRUMENT    PUBLIC DATASET                    |
|                       │                │                │                         |
|                       +----------------+----------------+                         |
|                                        │                                          |
|                                   OBSERVATION                                     |
|                                        │                                          |
|                                    DISCOVERY                                      |
|                                        │                                          |
|                                    EVIDENCE                                       |
|                                        │                                          |
|                                   PUBLICATION                                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Universal Target Resolution

The `TargetIntelligenceEngine` dynamically resolves any valid target identifier or slug across 16 canonical astronomical domains:

- `PLANET` / `MOON` / `SOLAR_SYSTEM` (`celestialRepo`)
- `EXOPLANET` & `STELLAR_SYSTEM` (`celestialRepo`)
- `STAR` / `STELLAR` (`starRepository`)
- `DEEP_SKY` (`deepSkyRepo`)
- `GALAXY` / `GALACTIC` (`galaxyRepo`)
- `GALACTIC_STRUCTURE` (`galacticStructureRepo`)
- `COSMIC_STRUCTURE` / `COSMIC_WEB` (`cosmicStructureRepo`)
- `CMB` / `COSMIC_TIME` / `OBSERVABLE_UNIVERSE` (`cosmicEpochRepo`, `observableUniverseRepo`)
- `MISSION` (`missionRepo`)
- `SPACECRAFT` (`missionRepo`)
- `INSTRUMENT` (`missionRepo`)
- `ORGANIZATION` (`organizationRepo`)
- `DISCOVERY` (`missionRepo`)
- `OBSERVATORY` (`observatoryRepo`)

The engine constructs a structured `TargetIntelligenceReport` containing:

- **Canonical Identity**: Standard designation, IAU constellation, category, classification.
- **Physical Properties**: Apparent magnitude, distance, spectral type, mass, diameter with explicit epistemic status and data source.
- **Positional Coordinates**: Equatorial coordinates (RA/Dec), galactic coordinates (l, b), heliocentric/galactocentric vectors.
- **Real-Time Observation Summary**: Current altitude, azimuth, airmass, culmination time, and calculated observation windows.
- **Mission & Spacecraft Associations**: Targeted exploration missions, visiting spacecraft, deployed science payloads.
- **Peer-Reviewed Scientific Evidence**: Formal citations, claims, source repositories, and confidence metrics.
- **Relational Graph**: Connected nodes and bidirectional relationship links.

---

## 3. Observation Intelligence & Heuristic Scoring

The `ObservationIntelligenceEngine` computes observation feasibility across time steps:

- **Air Mass Model**: Kasten & Young (1989) refraction-corrected airmass formula:
  $$X = \frac{1}{\sin(h) + 0.50572 \cdot (h + 6.07995)^{-1.6364}}$$
- **Solar Twilight States**:
  - `DAYLIGHT`: $h_\odot > 0^\circ$
  - `CIVIL`: $-6^\circ < h_\odot \le 0^\circ$
  - `NAUTICAL`: $-12^\circ < h_\odot \le -6^\circ$
  - `ASTRONOMICAL`: $-18^\circ < h_\odot \le -12^\circ$
  - `NIGHT`: $h_\odot \le -18^\circ$
- **Lunar Geometry**: Lunar illumination fraction and angular separation ($\theta_{\text{moon}}$).
- **Heuristic Quality Scoring**:
  - `BEST`: Score $\ge 80/100$ (Optimal transit, pristine darkness, low airmass).
  - `GOOD`: Score $60 - 79/100$ (Favorable altitude and darkness).
  - `FAIR`: Score $40 - 59/100$ (Lower culmination or lunar illumination).
  - `POOR`: Score $1 - 39/100$ (Constrained viewing).
  - `NOT_VISIBLE`: Below minimum horizon or excluded by active constraints.

> [!NOTE]
> Observation scores are planning heuristics intended for session scheduling. They do not constitute empirical scientific measurements.

---

## 4. Scientific Relation Graph & 2D Graph Visualizer

The `ScientificRelationGraph` builds in-memory relational topologies supporting 15 relation types:

- `LOCATED_IN`, `ORBITING`, `MEMBER_OF`, `VISITED_BY`, `OBSERVED_BY`, `STUDIED_BY`, `DISCOVERED_BY`, `DISCOVERY_ABOUT`, `INSTRUMENT_ON`, `PART_OF`, `OPERATED_BY`, `BUILT_BY`, `DATA_ARCHIVE_OF`, `DERIVED_FROM`, `RELATED_TO`.

The interactive `ScientificGraph2D` Canvas visualizer provides:

- Smooth force-directed physics simulation
- Interactive zoom, pan, and node dragging
- Node selection, degree expansion, and relationship highlighting
- Breadcrumb-guided path tracing between arbitrary scientific entities
