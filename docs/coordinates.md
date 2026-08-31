# CELESTIAL — Astronomical Coordinate & Astrometry Mathematics

This document details the astronomical coordinate transformations, distance derivations, galactic transformations, and 3D visualization scaling implemented in **CELESTIAL**.

---

## 1. Trigonometric Parallax to Physical Distance

The physical distance $d$ in parsecs ($\text{pc}$) is derived from the stellar parallax $\varpi$ in milliarcseconds ($\text{mas}$):

$$d = \frac{1000}{\varpi}\text{ pc}$$

The distance in light-years is:

$$d_{ly} = d \times 3.261563777$$

### Observational Uncertainty Propagation:

Using first-order Taylor series error propagation, the uncertainty in distance $\sigma_d$ given parallax uncertainty $\sigma_\varpi$ is:

$$\sigma_d = \left|\frac{\partial d}{\partial \varpi}\right| \sigma_\varpi = \frac{1000}{\varpi^2} \sigma_\varpi\text{ pc}$$

---

## 2. Equatorial (ICRS) to 3D Cartesian Coordinates

Given Right Ascension $\alpha \in [0^\circ, 360^\circ)$, Declination $\delta \in [-90^\circ, +90^\circ]$, and Distance $d$ in parsecs:

$$ \begin{aligned}
X &= d \cdot \cos\delta \cdot \cos\alpha \\
Y &= d \cdot \cos\delta \cdot \sin\alpha \\
Z &= d \cdot \sin\delta
\end{aligned}$$

Where:
- $X$ points toward the Vernal Equinox ($\alpha = 0^\circ, \delta = 0^\circ$).
- $Y$ points toward $\alpha = 90^\circ$ ($6\text{h}$), $\delta = 0^\circ$.
- $Z$ points toward the North Celestial Pole ($\delta = +90^\circ$).

---

## 3. Equatorial (ICRS J2000) to Galactic Coordinates (System II)

According to IAU standards (Blaauw et al. 1960 / J2000 definition):
- North Galactic Pole (NGP): $\alpha_{NGP} = 192.85948^\circ$, $\delta_{NGP} = 27.12825^\circ$.
- Galactic Center reference angle: $l_{NCP} = 122.93192^\circ$.

$$\begin{aligned}
\sin b &= \sin\delta \sin\delta_{NGP} + \cos\delta \cos\delta_{NGP} \cos(\alpha - \alpha_{NGP}) \\
\cos b \sin(l_{NCP} - l) &= \cos\delta \sin(\alpha - \alpha_{NGP}) \\
\cos b \cos(l_{NCP} - l) &= \sin\delta \cos\delta_{NGP} - \cos\delta \sin\delta_{NGP} \cos(\alpha - \alpha_{NGP})
\end{aligned}$$

---

## 4. Celestial Angular Separation (Vincenty Formula)

For any two celestial points $(\alpha_1, \delta_1)$ and $(\alpha_2, \delta_2)$:

$$\Delta\theta = \text{atan2}\left( \sqrt{(\cos\delta_2 \sin\Delta\alpha)^2 + (\cos\delta_1 \sin\delta_2 - \sin\delta_1 \cos\delta_2 \cos\Delta\alpha)^2}, \; \sin\delta_1 \sin\delta_2 + \cos\delta_1 \cos\delta_2 \cos\Delta\alpha \right)$$
$$
