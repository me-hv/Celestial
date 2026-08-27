# CELESTIAL — Stellar Systems & Circumstellar Habitable Zone Specification

This document details the relational star system hierarchy, circumstellar habitable zone physics, and binary/barycentric approximations implemented in **CELESTIAL**.

---

## 1. Domain Separation: Physical vs. Relational Entities

In CELESTIAL:

- **`CelestialObject`** models concrete physical bodies (Stars, Terrestrial Planets, Gas Giants, Super-Earths, Moons).
- **`StellarSystem`** models the relational container representing a gravitationally bound group of host stars, planetary bodies, and circumstellar zones.

---

## 2. Circumstellar Habitable Zone Physics Model

The habitable zone is calculated using the **Kopparapu et al. (2013, 2014)** effective stellar flux ($S_{eff}$) model:

$$S_{eff} = S_{eff\odot} + a \cdot T_* + b \cdot T_*^2 + c \cdot T_*^3 + d \cdot T_*^4$$

where $T_* = T_{eff} - 5780\text{ K}$.

The orbital distance boundaries are determined by:

$$d = \sqrt{\frac{L / L_\odot}{S_{eff}}}\text{ AU}$$

### Boundaries Computed:

1. **Recent Venus (Optimistic Inner)**: Flux received by Venus $1.0\text{ Gyr}$ ago.
2. **Runaway Greenhouse (Conservative Inner)**: Complete evaporation of surface oceans / moist greenhouse threshold.
3. **Maximum Greenhouse (Conservative Outer)**: Maximum warming capacity of a $\text{CO}_2$ atmosphere before Rayleigh scattering prevents additional heating.
4. **Early Mars (Optimistic Outer)**: Flux received by Mars $3.8\text{ Gyr}$ ago when liquid surface water was present.

> **Scientific Honesty Note**: Residence within the modeled Habitable Zone indicates the potential for liquid water under standard atmospheric compositions, **not** confirmed biological habitability.

---

## 3. Multi-Star Barycentric Modeling

For multiple-star systems (e.g. **Alpha Centauri AB**):

- Binary stars A and B orbit their mutual center of mass (barycenter) with period $P = 79.91\text{ yr}$ and eccentricity $e = 0.518$.
- Planets orbiting individual stars (S-type) or the binary pair (P-type / circumbinary) are evaluated within the appropriate local reference frame.
- **Scientific Limitation**: This represents a simplified two-body Keplerian barycentric approximation and does not compute full real-time $N$-body gravitational perturbations.
