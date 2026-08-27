# CELESTIAL — Solar System Architecture & Ephemeris Specification

This document details the astronomical foundation, scientific datasets, coordinate conventions, and canonical units implemented for the **Solar System Explorer (Phase 1)**.

---

## 1. Primary Bodies & Taxonomy

Phase 1 models the central star, the 8 primary planets, and Earth's Moon as first-class `CelestialObject` domain entities:

| Body        | Classification       | Standard Designation | Semi-Major Axis ($a$) | Mass ($M$)                       | Mean Radius ($R$)    |
| :---------- | :------------------- | :------------------- | :-------------------- | :------------------------------- | :------------------- |
| **Sun**     | `STAR`               | `Sol`                | 0 AU (Center)         | $1.988 \times 10^{30}\text{ kg}$ | $696,340\text{ km}$  |
| **Mercury** | `TERRESTRIAL_PLANET` | `Sol I`              | $0.387\text{ AU}$     | $3.301 \times 10^{23}\text{ kg}$ | $2,439.7\text{ km}$  |
| **Venus**   | `TERRESTRIAL_PLANET` | `Sol II`             | $0.723\text{ AU}$     | $4.868 \times 10^{24}\text{ kg}$ | $6,051.8\text{ km}$  |
| **Earth**   | `TERRESTRIAL_PLANET` | `Sol III`            | $1.000\text{ AU}$     | $5.972 \times 10^{24}\text{ kg}$ | $6,371.0\text{ km}$  |
| **Moon**    | `MOON`               | `Earth I`            | $384,400\text{ km}$   | $7.342 \times 10^{22}\text{ kg}$ | $1,737.4\text{ km}$  |
| **Mars**    | `TERRESTRIAL_PLANET` | `Sol IV`             | $1.524\text{ AU}$     | $6.417 \times 10^{23}\text{ kg}$ | $3,389.5\text{ km}$  |
| **Jupiter** | `GAS_GIANT`          | `Sol V`              | $5.203\text{ AU}$     | $1.898 \times 10^{27}\text{ kg}$ | $69,911.0\text{ km}$ |
| **Saturn**  | `GAS_GIANT`          | `Sol VI`             | $9.537\text{ AU}$     | $5.683 \times 10^{26}\text{ kg}$ | $58,232.0\text{ km}$ |
| **Uranus**  | `ICE_GIANT`          | `Sol VII`            | $19.191\text{ AU}$    | $8.681 \times 10^{25}\text{ kg}$ | $25,362.0\text{ km}$ |
| **Neptune** | `ICE_GIANT`          | `Sol VIII`           | $30.069\text{ AU}$    | $1.024 \times 10^{26}\text{ kg}$ | $24,622.0\text{ km}$ |

---

## 2. Scientific Provenance

All Solar System telemetry is sourced directly from **NASA JPL Solar System Dynamics (SSD)** and the **IAU Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE)**:

- **Source Provider**: NASA Jet Propulsion Laboratory (JPL)
- **Ephemeris Model**: DE440/DE441 Planetary Ephemerides
- **Catalog Reference**: NASA Planetary Fact Sheets (`NASA-SSD:SOLAR_SYSTEM_J2000`)
- **Reference Epoch**: J2000.0 (Julian Date `2451545.0` = 2000-01-01 12:00:00 TT)
- **Data Confidence**: 0.999 (Authoritative Standard)

---

## 3. Canonical Units

To prevent unit mixing across systems, CELESTIAL enforces standard SI and astronomical units:

| Metric                      | Internal Domain Unit                       | Presentation Unit                                           |
| :-------------------------- | :----------------------------------------- | :---------------------------------------------------------- |
| **Interplanetary Distance** | Astronomical Units ($\text{AU}$)           | $\text{AU}$ / $\text{km}$                                   |
| **Planetary Radius**        | Kilometers ($\text{km}$)                   | $\text{km}$                                                 |
| **Mass**                    | Kilograms ($\text{kg}$)                    | $\text{kg}$ with scientific exponent, $M_\oplus$, $M_\odot$ |
| **Surface Gravity**         | Meters per second squared ($\text{m/s}^2$) | $\text{m/s}^2$                                              |
| **Orbital Period**          | Days ($\text{days}$)                       | $\text{days}$ ($P < 365.25\text{ d}$) / $\text{years}$      |
| **Angles (Math)**           | Radians ($\text{rad}$)                     | Degrees ($^\circ$)                                          |
| **Temperature**             | Kelvin ($\text{K}$)                        | $\text{K}$ and Celsius ($^\circ\text{C}$)                   |
| **Atmospheric Fraction**    | Percentage (%)                             | % mole fraction                                             |

---

## 4. Multi-Catalog Alias Resolution

The Solar System dataset indexes historical and international catalog aliases:

- **Earth**: `Terra`, `Gaia`, `The Blue Planet`, `Sol III`
- **Moon**: `Luna`, `Selene`, `The Moon`, `Earth I`
- **Sun**: `Sol`, `Helios`, `The Sun`
- **Mars**: `The Red Planet`, `Ares`, `Sol IV`
- **Jupiter**: `Jove`, `Zeus`, `King of Planets`, `Sol V`
- **Saturn**: `Ringed Planet`, `Cronus`, `Sol VI`
- **Venus**: `Morning Star`, `Evening Star`, `Phosphorus`, `Hesperus`
