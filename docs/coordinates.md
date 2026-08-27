# CELESTIAL — Astronomical Coordinate & Astrometry Mathematics

This document details the astronomical coordinate transformations, distance derivations from parallax, error propagation, and 3D visualization scaling implemented in **CELESTIAL**.

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

## 3. Transformation to Three.js Scene Coordinates

In Three.js, $+Y$ is typically the vertical up-axis:

$$\begin{aligned}
x_{3D} &= X \cdot S \\
y_{3D} &= Z \cdot S \quad (\text{North Celestial Pole mapped to scene vertical}) \\
z_{3D} &= -Y \cdot S \quad (\text{ICRS } Y \text{ mapped into screen depth})
\end{aligned}$$

where $S = 4.0\text{ units/pc}$.
$$
