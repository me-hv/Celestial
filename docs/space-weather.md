# Space Weather & Heliophysics Intelligence

## Overview

The Space Weather domain (`src/domain/space-weather/`) integrates real-time solar wind plasma, interplanetary magnetic field ($B_z$), planetary $K_p$ indices, and GOES X-ray flares from NOAA SWPC and DSCOVR.

---

## Key Parameters

- **Solar Wind Speed ($km/s$) & Density ($p/cm^3$)**: Measures coronal expansion and dynamic pressure.
- **IMF $B_t$ and $B_z$ ($nT$)**: Southward $B_z$ (negative) initiates magnetic reconnection with Earth's magnetosphere, driving geomagnetic storms and auroras.
- **Planetary $K_p$ Index (0–9)**: Quantifies global geomagnetic disturbance.
- **NOAA Storm Scales**:
  - $G_1$ (Minor, $K_p = 5$) to $G_5$ (Extreme, $K_p = 9$).
  - $R_1$ (Minor) to $R_5$ (Extreme) Radio Blackouts from solar flares.
  - $S_1$ to $S_5$ Solar Radiation Storms.

---

## Epistemic Integrity

Observation implications (auroral oval equatorward boundary, radio HF blackout probabilities, ground atmospheric seeing turbulence) are tagged with `MODEL_DERIVED` or `INFERRED` epistemic statuses.
