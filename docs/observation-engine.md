# CELESTIAL — Observation & Visibility Engine Specification

This document details object visibility classification, twilight thresholds, and target ranking algorithms in **CELESTIAL**.

---

## 1. Solar Twilight Thresholds

| State                     | Solar Altitude $h_\odot$               | Observational Character                                                   |
| :------------------------ | :------------------------------------- | :------------------------------------------------------------------------ |
| **Day**                   | $h_\odot > -0.8333^\circ$              | Full daylight; only Sun, Moon, and Venus observable                       |
| **Civil Twilight**        | $-6^\circ < h_\odot \le -0.8333^\circ$ | Terrestrial horizon visible; bright 1st magnitude stars emerge            |
| **Nautical Twilight**     | $-12^\circ < h_\odot \le -6^\circ$     | Sea horizon vanishes; major navigational stars and constellations visible |
| **Astronomical Twilight** | $-18^\circ < h_\odot \le -12^\circ$    | Faint stars appear; sky brightness fades into darkness                    |
| **True Night**            | $h_\odot \le -18^\circ$                | Complete astronomical darkness; deep sky objects reachable                |

---

## 2. Rise, Upper Transit & Set Times

For an object at declination $\delta$ and observer at latitude $\phi$:
$$\cos(H_0) = \frac{\sin(h_0) - \sin(\phi)\sin(\delta)}{\cos(\phi)\cos(\delta)}$$

where:

- $h_0 = -0.5667^\circ$ for stars and deep-sky objects
- $h_0 = -0.8333^\circ$ for Sun and Moon (correcting for $34'$ refraction $+ 16'$ semi-diameter)

### Boundary Cases:

- $\cos(H_0) < -1.0 \implies$ **Circumpolar** (never sets)
- $\cos(H_0) > +1.0 \implies$ **Never Rises** at this observer latitude
