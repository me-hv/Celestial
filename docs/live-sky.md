# CELESTIAL — Live Sky & Astronomical Data Explorer (Phase 10)

## Overview

Phase 10 elevates CELESTIAL into an **interactive astronomical observatory platform**. It connects ground observer locations across Earth to dynamic celestial coordinate transformations, real-time planetary ephemerides, analytical lunar models, 88 IAU constellation asterisms, astronomical twilights, and session planning.

---

## 1. Mathematical Architecture

### 1.1 Local Mean Sidereal Time (LMST)

$$\text{GMST} = 280.46061837^\circ + 360.98564736629^\circ \cdot (\text{JD} - 2451545.0) + 0.000387933 \cdot T^2 - \frac{T^3}{38710000}$$
$$\text{LMST} = \text{GMST} + \frac{\lambda_{\text{observer}}}{15} \pmod{24}$$

### 1.2 Equatorial $(\alpha, \delta) \to$ Horizontal $(\text{Alt}, \text{Az})$

For Hour Angle $H = \text{LMST} - \alpha$:
$$\sin(h) = \sin(\phi) \sin(\delta) + \cos(\phi) \cos(\delta) \cos(H)$$
$$\cos(A) = \frac{\sin(\delta) - \sin(\phi)\sin(h)}{\cos(\phi)\cos(h)}$$
$$\sin(A) = -\frac{\cos(\delta)\sin(H)}{\cos(h)}$$
$$A = \text{atan2}(-\cos(\delta)\sin(H), \sin(\delta) - \sin(\phi)\sin(h)) \pmod{360^\circ}$$

### 1.3 Atmospheric Refraction (Bennett 1982 / Saemundsson 1986)

$$R_{\text{arcmin}} = \frac{1.02}{\tan\left(h + \frac{10.3}{h + 5.11}\right)} \cdot \frac{P}{1010} \cdot \frac{283}{273 + T}$$
$$h_{\text{apparent}} = h + \frac{R_{\text{arcmin}}}{60}$$

---

## 2. Ephemeris Engines

### 2.1 Solar System Planets

- Heliocentric 3D coordinates derived from Keplerian mechanics:
  $$\mathbf{r}_{\text{geo}} = \mathbf{r}_{\text{planet}} - \mathbf{r}_{\text{earth}}$$
- Converted to Geocentric Ecliptic and Equatorial coordinates $(\alpha, \delta)$.
- Visual apparent magnitude $V(r, d, \Phi)$ and angular diameter $\theta = \frac{2 R}{d} \times 206265''$.

### 2.2 Analytical Lunar Ephemeris

- Full implementation of truncated Meeus/Brown analytical series for Moon geocentric position, distance, phase angle, and illumination percentage $k = \frac{1 + \cos(i)}{2} \times 100\%$.

---

## 3. Visualization Modes

- **3D Inner Celestial Sphere (`CelestialSkyScene3D.tsx`)**: First-person perspective inside a 3D celestial sphere with ground horizon disc, Cardinal markers (N, NE, E, SE, S, SW, W, NW), Alt/Az grid, constellation line glow, and magnitude-weighted star point cloud.
- **2D All-Sky Planisphere (`AllSkyPlanisphere2D.tsx`)**: Zenith-centered azimuthal equidistant polar projection bounded by the local horizon circle.
- **2D Equatorial Map (`CelestialSkyView2D.tsx`)**: Rectangular cylindrical projection of RA/Dec coordinates.

---

## 4. Routes

- `/sky`: Interactive 3D/2D Live Sky Explorer.
- `/sky/events`: Daily solar twilight boundaries, moon phases, and planetary culmination times.
- `/sky/planner`: Target observation session planner with altitude and magnitude constraints.
- `/sky/where-is/[slug]`: Direct object heading and sky altitude locator.
