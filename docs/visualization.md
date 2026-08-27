# CELESTIAL — 3D Visualization & Orbital Mechanics Specification

This document details the Three.js rendering architecture, Keplerian orbit mathematics, coordinate frame transformations, and visual scaling strategy implemented in **CELESTIAL**.

---

## 1. Scientific Coordinate Transformations

Astronomical ephemeris data operates in the **Heliocentric Ecliptic Coordinate Frame (J2000)**:

- $X$-$Y$ plane is defined by Earth's orbital plane (the Ecliptic).
- $Z$-axis points toward the Ecliptic North Pole.

Three.js uses a standard camera coordinate system where $Y$ is vertical (up) and $X$-$Z$ forms the ground plane:

$$\begin{pmatrix} X_{scene} \\ Y_{scene} \\ Z_{scene} \end{pmatrix} = \begin{pmatrix} X_{ecliptic} \\ Z_{ecliptic} \\ -Y_{ecliptic} \end{pmatrix}$$

---

## 2. Keplerian Orbital Mechanics Engine

Planetary positions $(X, Y, Z)$ are calculated directly from Keplerian orbital elements:

1. **Mean Motion ($n$)**:
   $$n = \frac{2\pi}{P}$$

2. **Mean Anomaly ($M$)**:
   $$M(t) = M_0 + n \cdot (t - t_0)$$

3. **Kepler's Equation for Eccentric Anomaly ($E$)**:
   $$M = E - e \sin E$$
   Solved iteratively via **Newton-Raphson**:
   $$E_{k+1} = E_k - \frac{E_k - e \sin E_k - M}{1 - e \cos E_k}$$

4. **True Anomaly ($\nu$) & Radius ($r$)**:
   $$r = a(1 - e \cos E)$$
   $$\nu = 2 \arctan\left(\sqrt{\frac{1+e}{1-e}} \tan \frac{E}{2}\right)$$

5. **Orbital Plane to 3D Heliocentric Ecliptic Rotation**:
   Rotated by Argument of Periapsis ($\omega$), Inclination ($i$), and Longitude of Ascending Node ($\Omega$).

---

## 3. Dual-Scale Visualization Strategy

Because literal 1:1 scale would make planets invisible sub-pixel specks across billions of kilometers of space, CELESTIAL implements a **calibrated dual-scale model**:

1. **Physical Scale (Telemetry & Data Layers)**: Exact NASA SI/IAU values displayed without distortion.
2. **Visual Scale (3D WebGL Canvas)**:
   - Non-linear distance compression: $d_{visual} = d_{AU}^{0.72} \times 32$
   - Logarithmic planet radius scaling: $R_{visual} = \log_{10}(R_{km}) \times 1.1 - 3.2$
   - Relative orbital eccentricities, inclination angles, and planetary size hierarchies (e.g. Jupiter > Saturn > Earth > Mercury) are strictly preserved.

---

## 4. Three.js Scene Lifecycle & Performance

- **Resource Disposal**: WebGL renderers, buffer geometries, materials, event listeners, and `requestAnimationFrame` loops are cleanly disposed upon unmounting.
- **Pixel Ratio Clamping**: `window.devicePixelRatio` is clamped to $\leq 2.0$ for optimal mobile and high-DPI GPU performance.
- **Tone Mapping**: `ACESFilmicToneMapping` with HDR ambient fill for cinematic deep space contrast.
- **Camera Controller**: Spherical orbit controls with cubic ease-out camera transitions for smooth focus actions.
