# CELESTIAL — Live Sky & Astronomical Observation Engine Specification

This document describes the architectural, mathematical, and observational foundations of **Phase 10: Live Sky & Astronomical Observation Engine**.

---

## 1. System Overview

The Live Sky Engine enables ground-observer perspective rendering of the celestial sphere from any arbitrary geographical coordinate $(\phi, \lambda)$ on Earth across any temporal epoch $t$.

```
┌────────────────────────────────────────────────────────┐
│                   OBSERVER STATE                       │
│    Latitude φ · Longitude λ · Elevation h · Time t    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              ASTRONOMICAL TIME ENGINE                  │
│       Julian Date (JD) · GMST · LMST (Sidereal)        │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│            HORIZONTAL COORDINATE ENGINE                │
│    (RA α, Dec δ) ──▶ Hour Angle H ──▶ (Alt h, Az A)    │
│           Optical Atmospheric Refraction               │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│      VISIBILITY, TWILIGHT & EPHEMERIS ENGINES          │
│    Planetary Keplerian Positions · Meeus Moon Phase   │
│    Civil/Nautical/Astro Twilights · Rise/Transit/Set   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             OBSERVER VISUALIZATION SUITE               │
│  3D Celestial Sphere (Interior) · 2D Planisphere Map   │
│        88 IAU Constellations · Telemetry & HUD         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Mathematical Formulations

### Local Mean Sidereal Time (LMST)

$$\text{LMST} = \text{GMST} + \frac{\lambda_{\text{observer}}}{15.0} \pmod{24}$$

### Equatorial to Horizontal Transformation

For an object with Right Ascension $\alpha$, Declination $\delta$, and observer latitude $\phi$:
$$H = \text{LMST} - \alpha$$
$$\sin(h_{\text{true}}) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(H)$$
$$\tan(A) = \frac{-\cos(\delta)\sin(H)}{\sin(\delta)\cos(\phi) - \cos(\delta)\sin(\phi)\cos(H)}$$

### Saemundsson Atmospheric Refraction

For true altitude $h \ge -1^\circ$:
$$R = \frac{1.02}{\tan\left(h + \frac{10.3}{h + 5.11}\right)} \times \frac{P}{1010} \times \frac{283}{273 + T}\text{ (arcmin)}$$
$$h_{\text{apparent}} = h_{\text{true}} + \frac{R}{60}$$

---

## 3. Epistemic Classification

All observation data in CELESTIAL is classified under strict scientific rigor:

- **`OBSERVED`**: Gaia DR3 positions, SIMBAD catalog magnitudes, and physical constants.
- **`MODEL_DERIVED`**: Computed Alt/Az coordinates, Keplerian planetary positions, and Bennett refraction corrections.
- **`APPROXIMATE`**: Planar twilight approximations and geometric rise/set times.
- **`ILLUSTRATIVE`**: Constellation stick-figure lines and atmospheric sky gradient shading.
