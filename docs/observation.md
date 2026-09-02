# CELESTIAL — Live Sky & Astronomical Observation Architecture

This document specifies the scientific coordinate transformations, time models, ephemeris algorithms, and rendering projections implemented in CELESTIAL Phase 10: **Live Sky & Astronomical Observation Explorer**.

---

## 1. Astronomical Time Engine

Astronomical computations require high-precision continuous time scales independent of civil time zones and leap seconds.

### 1.1 Julian Date ($JD$) & Modified Julian Date ($MJD$)

Given a Gregorian calendar date with year $Y$, month $M$, day $D$, hour $H$, minute $Min$, second $S$:

If $M \le 2$:
$$Y' = Y - 1, \quad M' = M + 12$$
Otherwise:
$$Y' = Y, \quad M' = M$$

$$A = \lfloor Y' / 100 \rfloor, \quad B = 2 - A + \lfloor A / 4 \rfloor$$

$$JD = \lfloor 365.25(Y' + 4716) \rfloor + \lfloor 30.6001(M' + 1) \rfloor + D + \frac{H + \frac{Min}{60} + \frac{S}{3600}}{24} + B - 1524.5$$

$$MJD = JD - 2400000.5$$

### 1.2 Julian Centuries from Standard Epoch J2000.0 ($T$)

$$T = \frac{JD - 2451545.0}{36525.0}$$

### 1.3 Greenwich Mean Sidereal Time ($GMST$)

Evaluated via the IAU standard polynomial (Meeus Eq. 12.4):
$$\theta_0 = 280.46061837 + 360.98564736629 \cdot (JD - 2451545.0) + 0.000387933 T^2 - \frac{T^3}{38710000} \pmod{360^\circ}$$

$$\text{GMST}_{\text{hours}} = \frac{\theta_0}{15^\circ} \pmod{24^\text{h}}$$

### 1.4 Local Mean Sidereal Time ($LMST$)

For an observer at geographic longitude $\lambda$ (degrees, East positive):
$$\text{LMST} = \text{GMST} + \frac{\lambda}{15^\circ} \pmod{24^\text{h}}$$

---

## 2. Coordinate Transformations: Equatorial to Horizontal

Given an object with ICRS / J2000 equatorial coordinates $(\alpha, \delta)$ (Right Ascension and Declination) and observer at latitude $\phi$:

### 2.1 Local Hour Angle ($H$)

$$H = \text{LMST} - \alpha \quad (\text{converted to degrees, modulo } 360^\circ)$$

### 2.2 Geometric Altitude ($h_0$) and True Azimuth ($A$)

$$\sin(h_0) = \sin(\phi) \sin(\delta) + \cos(\phi) \cos(\delta) \cos(H)$$

$$h_0 = \arcsin(\sin(h_0))$$

$$\cos(A) = \frac{\sin(\delta) - \sin(\phi) \sin(h_0)}{\cos(\phi) \cos(h_0)}$$

$$\sin(A) = -\frac{\cos(\delta) \sin(H)}{\cos(h_0)}$$

$$A = \text{atan2}(-\cos(\delta)\sin(H), \; \sin(\delta)\cos(\phi) - \cos(\delta)\sin(\phi)\cos(H)) \pmod{360^\circ}$$

_(Azimuth measured from North $0^\circ$ through East $90^\circ$, South $180^\circ$, West $270^\circ$)._

---

## 3. Atmospheric Refraction Correction

Atmospheric refraction bends light rays towards the zenith, increasing apparent altitude for objects near the horizon.

### 3.1 Saemundsson / Bennett Refraction Formula

For true geometric altitude $h_0 \ge -5^\circ$:
$$R = \frac{1.02}{\tan\left(h_0 + \frac{10.3}{h_0 + 5.11}\right)} \quad [\text{arcminutes}]$$

Apparent Altitude ($h$):
$$h = h_0 + \frac{R}{60.0} \quad [\text{degrees}]$$

---

## 4. Plane-Parallel & Young Airmass Approximation

Airmass $X(z)$ quantifies optical path length through Earth's atmosphere relative to zenith ($z = 90^\circ - h$):

$$X(z) \approx \frac{1}{\cos(z) + 0.025 \cdot \exp(-11.0 \cdot \cos(z))}$$

- At Zenith ($z = 0^\circ$): $X = 1.00$
- At $h = 30^\circ$ ($z = 60^\circ$): $X = 2.00$
- At $h = 10^\circ$ ($z = 80^\circ$): $X \approx 5.60$
- At Horizon ($h = 0^\circ$): $X \approx 38.0$

---

## 5. Rise, Transit, and Set Mechanics

An object rises and sets when its center reaches apparent geometric altitude $h_{\text{ref}}$:

- **Stars / Deep Sky**: $h_{\text{ref}} = -0.5667^\circ$ (standard atmospheric refraction)
- **Sun & Moon**: $h_{\text{ref}} = -0.8333^\circ$ (refraction $-34'$ + semi-diameter $-16'$)

### 5.1 Local Hour Angle at Horizon ($H_0$)

$$\cos(H_0) = \frac{\sin(h_{\text{ref}}) - \sin(\phi)\sin(\delta)}{\cos(\phi)\cos(\delta)}$$

- If $\cos(H_0) > 1$: Object is **Never Visible** (always below horizon).
- If $\cos(H_0) < -1$: Object is **Circumpolar** (never sets, always above horizon).
- Otherwise:
  $$H_0 = \arccos\left(\frac{\sin(h_{\text{ref}}) - \sin(\phi)\sin(\delta)}{\cos(\phi)\cos(\delta)}\right)$$

### 5.2 Transit Altitude ($h_{\text{transit}}$)

$$h_{\text{transit}} = 90^\circ - |\phi - \delta|$$

---

## 6. Solar Twilight Stages

Twilight is categorized by the Sun's depression below the astronomical horizon ($h_{\odot}$):

| Twilight Stage              | Solar Altitude Range ($h_{\odot}$)         | Sky Condition & Observational Capability                                    |
| :-------------------------- | :----------------------------------------- | :-------------------------------------------------------------------------- |
| **Daylight**                | $h_{\odot} > -0.8333^\circ$                | Full sunlit sky. Only Sun, Moon, and Venus visible.                         |
| **Civil Twilight**          | $-6.0^\circ < h_{\odot} \le -0.8333^\circ$ | Horizon clearly visible; bright navigation stars appear (mag $< 1$).        |
| **Nautical Twilight**       | $-12.0^\circ < h_{\odot} \le -6.0^\circ$   | Sea horizon dissolves; general constellations become visible (mag $< 3.5$). |
| **Astronomical Twilight**   | $-18.0^\circ < h_{\odot} \le -12.0^\circ$  | Faint stars visible; faint deep sky objects emerge at zenith.               |
| **Full Night (Astro Dark)** | $h_{\odot} \le -18.0^\circ$                | Total sky darkness; optimal for photometry and faint nebulae/galaxies.      |

---

## 7. Planisphere Mathematical Projections

For 2D canvas planispheres centered on the observer's zenith ($z = 0^\circ$ at center, $z = 90^\circ$ at horizon):

### 7.1 Azimuthal Equidistant

Linear radial scaling with zenith angle $z = 90^\circ - h$:
$$r = R \cdot \frac{90^\circ - h}{90^\circ}$$

### 7.2 Stereographic (Conformal)

Preserves local shapes, curves, and angles of constellations:
$$r = R \cdot \tan\left(\frac{90^\circ - h}{2}\right)$$

### 7.3 Orthographic (3D Hemisphere Perspective)

Perspective projection of celestial dome seen from infinity:
$$r = R \cdot \cos(h)$$

In all celestial planispheres (facing up at the dome):
$$x = x_0 - r \cdot \sin(A), \quad y = y_0 - r \cdot \cos(A)$$

---

## 8. Epistemic Classification & Provenance

Every observation includes strict metadata provenance:

- **Planets & Sun**: Jean Meeus Astronomical Algorithms / VSOP87 Theory.
- **Moon**: ELP-2000 / Meeus Lunar Theory with phase angle and fraction illuminated $k = \frac{1 + \cos(\Phi)}{2}$.
- **Stars**: ESA Gaia DR3 (astrometry, parallax, proper motion, $G/G_{\text{RP}}/G_{\text{BP}}$ photometry).
- **Deep Sky**: Messier, New General Catalogue (NGC), and Index Catalogue (IC) verified parameters.
- **Constellations**: 88 official IAU constellation boundaries and stick figures.
