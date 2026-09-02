# Space Missions & Scientific Discoveries Architecture

CELESTIAL Phase 11 and Phase 11.5 introduce a scientifically rigorous Global Space Missions, Spacecraft, and Scientific Discoveries subsystem.

## 1. Domain Models & Global Collaboration

- **SpaceMission**: Core entity connecting mission objectives, operator/lead agencies, multi-agency participation matrix, launch epochs, target destinations, sub-spacecraft, payload instruments, milestone events, and scientific discoveries.
- **MissionOrganizationParticipation**: Multi-agency collaboration matrix mapping each participating organization to explicit operational and scientific roles (`LEAD_AGENCY`, `MISSION_OPERATOR`, `SPACECRAFT_BUILDER`, `INSTRUMENT_PROVIDER`, `SCIENCE_TEAM`, `LAUNCH_PROVIDER`, `DATA_ARCHIVE`, `INTERNATIONAL_PARTNER`).
- **Spacecraft**: Specific physical crafts (e.g. _Vikram Lander_, _Pragyan Rover_, _Cassini Orbiter_, _Huygens Probe_, _Perseverance Rover_, _Ingenuity Helicopter_). Includes power systems (RTG, Solar), mass, propulsion, and real-time flight telemetry (heliocentric distance, velocity, light delay, interstellar status).
- **MissionInstrument**: Scientific instruments with observing modes, wavelength coverage (gamma-ray, X-ray, deep UV, optical, mid-infrared, sub-mm/radio, magnetometer, particle/plasma), and targeted astrophysical capabilities.
- **PublicDataArchive**: Official data repositories with PDS/PSA/archive specifications, direct portal URLs, and primary data access tiers (e.g. ISSDC, JAXA DARTS, NASA PDS, MAST, ESA PSA, EMM SDC).
- **ScientificDiscovery**: Breakthrough observations with epistemic status (`OBSERVED`, `INFERRED`, `MODEL_DERIVED`), scientific significance, target world cross-linking, and peer-reviewed journal citations (DOI).
- **MissionTrajectory**: 3D heliocentric ecliptic waypoints with Epistemic Accuracy ratings (`HISTORICAL_RECONSTRUCTED`, `MODEL_DERIVED`, `ILLUSTRATIVE`).

## 2. Global Fleet Coverage

Missions are represented from all global space programs without Western-centric bias:

- **South Asia (ISRO / PRL / ISSDC)**: Chandrayaan-1, Chandrayaan-3, Mars Orbiter Mission (Mangalyaan), Aditya-L1, AstroSat.
- **Asia-Pacific (JAXA / ISAS, CNSA / CAS, KARI)**: Hayabusa2, SLIM, XRISM, Chang'e 4, Chang'e 5, Tianwen-1, Danuri (KPLO).
- **Middle East (UAESA / MBRSC)**: Emirates Mars Mission (Hope Probe).
- **Europe (ESA, CNES, DLR, ASI, UKSA)**: Gaia, Euclid, Rosetta, BepiColombo, JUICE, Cassini-Huygens (partner).
- **North America (NASA, JPL, JHU APL, SwRI, CSA)**: JWST, Hubble, Voyager 1 & 2, Perseverance, Curiosity, Parker Solar Probe, New Horizons, DART.
- **Historic Soviet Union (1955–1991)**: Venera 7 (first Venus landing), Luna 9 (first Moon soft landing).

## 3. 3D Trajectory Visualization

- **MissionTrajectoryScene**: Interactive Three.js viewport featuring:
  - Central Sun and planetary reference orbits (Mercury through Pluto).
  - Smooth 3D Catmull-Rom spline trajectory curves scaled into scene coordinates.
  - Active spacecraft probe indicator with glowing antenna halo.
  - Interactive playback scrubber (0% to 100%), speed controls (1x, 5x, 20x), step milestone buttons, and camera tracking mode.

## 4. Cross-Scale Bidirectional Navigation

- Missions targeting celestial bodies (e.g., Moon, Mars, Venus, Saturn, Jupiter, Sun, Asteroids) appear directly on planetary telemetry panels and object profiles.
- Target chips on mission profiles link directly to solar system 3D explorers and deep-space objects.
- Organization profiles link to all associated missions across historical and active programs.
