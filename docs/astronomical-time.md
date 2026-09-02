# CELESTIAL — Astronomical Time Engine Specification

This document details the deterministic astronomical time calculations in **CELESTIAL**.

---

## 1. Julian Date & Julian Centuries

### Julian Date (JD)

$$\text{JD} = \frac{\text{Unix Timestamp (ms)}}{86400000.0} + 2440587.5$$

### Modified Julian Date (MJD)

$$\text{MJD} = \text{JD} - 2400000.5$$

### Julian Centuries ($T$) since J2000.0

$$T = \frac{\text{JD} - 2451545.0}{36525.0}$$

---

## 2. Greenwich Mean Sidereal Time (GMST)

$$\text{GMST}(d) = 280.46061837^\circ + 360.98564736629^\circ \cdot d + 0.000387933^\circ \cdot T^2 - \frac{T^3}{38710000.0}^\circ$$

Normalized into $[0, 360^\circ)$ and converted to hours by dividing by $15.0^\circ/\text{hr}$.

---

## 3. Local Mean Sidereal Time (LMST)

$$\text{LMST} = \text{GMST} + \frac{\lambda}{15.0} \pmod{24}$$

where $\lambda$ is the geographical longitude in degrees ($[-180^\circ, +180^\circ]$).
