# Observer Coordinate System & Mathematical Reference

## 1. Coordinate Frames

| Frame                       | Primary Coordinates                                         | Reference Datum                                                      |
| :-------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------- |
| **Horizontal (Alt/Az)**     | Altitude ($h$), Azimuth ($A$)                               | Local Observer Horizon ($h=0$) & True North ($A=0^\circ$)            |
| **Equatorial (ICRS J2000)** | Right Ascension ($\alpha$), Declination ($\delta$)          | Celestial Equator ($\delta=0$) & Vernal Equinox ($\alpha=0^\circ$)   |
| **Galactic (System II)**    | Galactic Longitude ($l$), Galactic Latitude ($b$)           | Galactic Plane ($b=0$) & Sgr A* / Center ($l=0^\circ$)               |
| **Ecliptic**                | Ecliptic Longitude ($\lambda$), Ecliptic Latitude ($\beta$) | Earth Orbital Plane ($\beta=0$) & Vernal Equinox ($\lambda=0^\circ$) |

---

## 2. Observer Location Model

- `latitudeDeg`: Geodetic latitude $[-90^\circ, +90^\circ]$.
- `longitudeDeg`: Geodetic longitude $[-180^\circ, +180^\circ]$.
- `elevationMeters`: Height above sea level in meters.
- `timezone`: IANA timezone identifier.
