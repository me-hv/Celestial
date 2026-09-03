# Scientific Temporal Architecture & Chronological Graph

## Overview

The **CELESTIAL Temporal Layer** (`src/domain/timeline/`) provides a unified, epistemically calibrated chronological platform that connects deep cosmological time, human space exploration, astrophysical discoveries, space-weather events, and observations.

---

## Architectural Taxonomy

```
                    CELESTIAL TIME
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
   Astronomy           Humanity          Science
       │                  │                  │
 Events/Eclipses       Missions          Discoveries
       │                  │                  │
 Solar Activity       Launches          Observations
       │                  │                  │
 Cosmic Events        Flybys            Datasets
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                    TEMPORAL GRAPH
                          │
                 STATE RECONSTRUCTION
                          │
                  SCIENTIFIC TIMELINE
```

---

## Zero-Duplication Entity Referencing

Rather than copying existing domain models, `TemporalEvent` stores formal identifiers linking to existing authoritative registries:

- `targetIds`: Objects, planets, stars, deep sky entities.
- `missionIds`: Space mission catalog.
- `organizationIds`: Space agencies & research institutes.
- `datasetIds`: Global scientific data products.
- `discoveryIds`: Authoritative breakthroughs.
