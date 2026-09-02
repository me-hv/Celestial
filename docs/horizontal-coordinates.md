# CELESTIAL — Horizontal Coordinates & Refraction Specification

This document details the spherical astrometry and optical refraction formulations implemented in **CELESTIAL**.

---

## 1. Equatorial $(\alpha, \delta) \leftrightarrow$ Horizontal $(\text{Alt}, \text{Az})$

Given:

- Right Ascension $\alpha$
- Declination $\delta$
- Observer Latitude $\phi$
- Local Mean Sidereal Time $\text{LMST}$

### Hour Angle $H$:

$$H = \text{LMST} - \alpha$$

### True Altitude $h$:

$$\sin(h) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(H)$$
$$h = \arcsin(\sin(h))$$

### Azimuth $A$ (North = $0^\circ$, East = $90^\circ$, South = $180^\circ$, West = $270^\circ$):

$$y = -\cos(\delta)\sin(H)$$
$$x = \sin(\delta)\cos(\phi) - \cos(\delta)\sin(\phi)\cos(H)$$
$$A = \text{atan2}(y, x) \pmod{360^\circ}$$

---

## 2. Inverse: Horizontal $(\text{Alt}, \text{Az}) \to$ Equatorial $(\alpha, \delta)$

$$\sin(\delta) = \sin(\phi)\sin(h) + \cos(\phi)\cos(h)\cos(A)$$
$$y = -\sin(A)\cos(h)$$
$$x = \sin(h)\cos(\phi) - \cos(h)\sin(\phi)\cos(A)$$
$$H = \text{atan2}(y, x)$$
$$\alpha = \text{LMST} - H \pmod{24}$$
