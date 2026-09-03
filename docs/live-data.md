# Live Scientific Data Engine & Ingestion Architecture

## Overview

The **CELESTIAL Live Scientific Data Engine** (`src/lib/live-data/`) provides a multi-agency, typed, and calibrated pipeline for ingesting real-time and scheduled scientific data feeds from global space and astronomical organizations.

---

## Architectural Pipeline

```
Official Provider (NOAA, NASA, ISRO, ESA)
               ↓
        Live Data Adapter
               ↓
        Fetch & Ingest
               ↓
    Zod Validation & Checks
               ↓
Normalization & Physical Units
               ↓
 Epistemic Status & Provenance
               ↓
 SWR Cache (TTL + Metadata)
               ↓
 Domain Repositories & Services
               ↓
Intelligence Engine & User Interface
```

---

## Data Freshness & Epistemic Traceability

1. **Observed Time vs. Retrieval Time**:
   - `observedAt`: When the physical measurement was recorded in nature (e.g. solar wind plasma timestamp).
   - `retrievedAt`: When CELESTIAL downloaded and parsed the packet.
2. **Freshness States**:
   - `FRESH`: Observation is within the primary update window.
   - `RECENT`: Observation is valid but approaching stale threshold.
   - `STALE`: Retrieval exceeds stale threshold; marked explicitly in the UI.
   - `EXPIRED`: Data is too old for real-time operations.
   - `MODEL_DERIVED`: Calculated via deterministic astronomical ephemeris models.
   - `HISTORICAL`: Archival planetary mission data.
