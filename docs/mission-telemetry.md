# Live Mission Telemetry Intelligence

## Overview

The Mission Telemetry service (`src/domain/mission/mission-telemetry-service.ts`) provides dynamic astrodynamics propagation and live tracking status for deep space exploration probes.

---

## Trajectory & Tracking Propagation

- **Voyager 1**: Outward interstellar trajectory (~165.2 AU from Sun, ~17 km/s, ~22.8 hours 1-way light-time).
- **Voyager 2**: Outward interstellar trajectory (~138.1 AU from Sun, ~15.3 km/s, ~19.1 hours 1-way light-time).
- **Deep Space Network Links**: Canberra DSS-43, Goldstone, and Madrid tracking stations.
- **Telemetry States**: `LIVE`, `RECENT`, `STALE`, `MODEL_DERIVED`, `HISTORICAL`, `UNAVAILABLE`.
