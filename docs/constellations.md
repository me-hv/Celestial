# CELESTIAL — 88 IAU Constellations & Asterisms Specification

This document details the constellation dataset, 3D asterism geometry, and lookup engines in **CELESTIAL**.

---

## 1. Official IAU 88 Constellations

CELESTIAL models all **88 official International Astronomical Union (IAU) constellations** adopted by Eugène Delporte in 1930.

### Included Metadata:

- IAU 3-letter abbreviation (e.g. `Ori`, `UMa`, `Cas`, `Sco`, `Cru`)
- Standard English / Latin Name
- Family classification (Zodiac, Ursa Major, Orion, Perseus, Heavenly Waters, Bayer, Lacaille, Hercules)
- Brightest star (Alpha star) and catalog reference
- Visual asterism line segments connecting key anchor stars in 3D space

---

## 2. 3D Line Asterisms

Asterisms connect celestial coordinates $(\alpha_1, \delta_1) \to (\alpha_2, \delta_2)$ and are projected into horizontal coordinates $(\text{Alt}, \text{Az})$ dynamically based on observer location and Local Sidereal Time.
