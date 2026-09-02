# Phase 13: Global Scientific Data & Real-Time Astronomy Intelligence

## Architectural Overview

Phase 13 transforms CELESTIAL into a living scientific data platform by integrating authenticated multi-agency data provider pipelines, real-time mission telemetry intelligence, and an astronomical event scheduling matrix.

```
                    CELESTIAL
                        │
             ┌──────────┴──────────┐
             │                     │
       Knowledge Graph        Scientific Data
             │                     │
      Target Intelligence    Live/Updated Sources
             │                     │
     ┌───────┼────────┐      ┌─────┼──────────┐
     │       │        │      │     │          │
  Objects Missions Research  ISRO NASA       ESA
     │       │        │      JAXA CNSA   ESO NOAA
     └───────┴────────┘      └─────┴──────────┘
```

## 1. Scientific Data Providers (`src/lib/data-providers/`)

Operates official registries for space agencies and archives:

- **ISRO ISSDC**: Indian Space Science Data Centre (PRADAN)
- **NASA PDS**: Planetary Data System / MAST
- **ESA PSA**: Planetary Science Archive / Gaia Archive
- **JAXA DARTS**: ISAS/JAXA Data Archives and Transmission System
- **CNSA CLEP**: China Lunar and Deep Space Science Data Center
- **ESO SAF**: European Southern Observatory Science Archive Facility
- **NOAA SWPC**: Space Weather Prediction Center Real-Time Feeds

## 2. Scientific Datasets & Audit Trails (`src/lib/data/dataset-repository.ts`)

Each dataset provides:

- Authenticated organization, spacecraft, and instrument bindings
- Measured physical parameter matrices
- Step-by-step pipeline transformation histories (e.g. Telemetry Decommutation, Calibration Algorithms)
- Epistemic provenance validation (`OBSERVED`, `INFERRED`, `MODEL_DERIVED`)
- Direct archive access mirrors and peer-reviewed DOI citations

## 3. Real-Time Mission Intelligence & Telemetry

Integrates spacecraft state tracking:

- Distance from Earth and Sun
- Heliocentric velocity vectors
- 1-way light-time communication latencies
- Real-time Deep Space Network ground station allocations

## 4. Landmark Astronomical Events (`src/domain/astronomical-event/`)

Calculates and indexes celestial phenomena with multi-parameter observation bridges:

- Conjunctions, Oppositions, Solar/Lunar Eclipses, Meteor Showers, Comet Flybys
- Direct links to "Observe in Sky" and "Session Planner"
