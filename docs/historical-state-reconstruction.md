# Historical State Reconstruction & Difference Engine

## Overview

The `TemporalStateEngine` and `TemporalDiffEngine` reconstruct the physical, orbital, and operational state of any spacecraft or celestial target at an arbitrary timestamp $T$.

---

## State Reconstruction Integrity

- **Observed Records**: Directly supported by authoritative mission logs or telemetry packets.
- **Reconstructed Records**: Historical states reconstructed from telemetry archives and post-flight ephemerides (labeled `HISTORICAL` or `RECONSTRUCTED`).
- **Model Propagation**: Deterministic orbit propagation or numerical integration (strictly labeled `MODEL_DERIVED`).

---

## State Difference Engine (`diffStates`)

Compares state $A$ at $T_1$ with state $B$ at $T_2$ and outputs:

- Time interval $\Delta T$ (days).
- Radial solar distance shift $\Delta r$ ($AU$).
- Heliocentric velocity variation $\Delta v$ ($km/s$).
- Operational and mission phase transitions.
