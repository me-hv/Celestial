/**
 * Standard Astronomical Object Classifications
 */

export const CelestialCategory = {
  STELLAR: "STELLAR",
  PLANETARY: "PLANETARY",
  SATELLITE: "SATELLITE",
  MINOR_BODY: "MINOR_BODY",
  DEEP_SKY: "DEEP_SKY",
  RELATIVISTIC: "RELATIVISTIC",
} as const;

export type CelestialCategory = (typeof CelestialCategory)[keyof typeof CelestialCategory];

export const CelestialClassificationCode = {
  STAR: "STAR",
  TERRESTRIAL_PLANET: "TERRESTRIAL_PLANET",
  SUPER_EARTH: "SUPER_EARTH",
  EXOPLANET: "EXOPLANET",
  GAS_GIANT: "GAS_GIANT",
  ICE_GIANT: "ICE_GIANT",
  DWARF_PLANET: "DWARF_PLANET",
  MOON: "MOON",
  ASTEROID: "ASTEROID",
  COMET: "COMET",
  GALAXY: "GALAXY",
  NEBULA: "NEBULA",
  BLACK_HOLE: "BLACK_HOLE",
} as const;

export type CelestialClassificationCode =
  (typeof CelestialClassificationCode)[keyof typeof CelestialClassificationCode];

export interface ClassificationMetadata {
  code: CelestialClassificationCode;
  category: CelestialCategory;
  displayName: string;
  description: string;
}

export const CLASSIFICATION_REGISTRY: Record<CelestialClassificationCode, ClassificationMetadata> =
  {
    [CelestialClassificationCode.STAR]: {
      code: CelestialClassificationCode.STAR,
      category: CelestialCategory.STELLAR,
      displayName: "Star",
      description: "Luminous celestial body composed of plasma powered by nuclear fusion.",
    },
    [CelestialClassificationCode.TERRESTRIAL_PLANET]: {
      code: CelestialClassificationCode.TERRESTRIAL_PLANET,
      category: CelestialCategory.PLANETARY,
      displayName: "Terrestrial Planet",
      description: "Rocky planet with a solid surface and silicate or metallic core.",
    },
    [CelestialClassificationCode.SUPER_EARTH]: {
      code: CelestialClassificationCode.SUPER_EARTH,
      category: CelestialCategory.PLANETARY,
      displayName: "Super-Earth",
      description:
        "Extrasolar planet with a mass higher than Earth's, but substantially below that of Uranus and Neptune.",
    },
    [CelestialClassificationCode.EXOPLANET]: {
      code: CelestialClassificationCode.EXOPLANET,
      category: CelestialCategory.PLANETARY,
      displayName: "Exoplanet",
      description: "Planet that orbits a star outside the Solar System.",
    },
    [CelestialClassificationCode.GAS_GIANT]: {
      code: CelestialClassificationCode.GAS_GIANT,
      category: CelestialCategory.PLANETARY,
      displayName: "Gas Giant",
      description: "Massive planet predominantly composed of hydrogen and helium.",
    },
    [CelestialClassificationCode.ICE_GIANT]: {
      code: CelestialClassificationCode.ICE_GIANT,
      category: CelestialCategory.PLANETARY,
      displayName: "Ice Giant",
      description:
        "Giant planet composed mainly of volatile elements heavier than hydrogen and helium.",
    },
    [CelestialClassificationCode.DWARF_PLANET]: {
      code: CelestialClassificationCode.DWARF_PLANET,
      category: CelestialCategory.PLANETARY,
      displayName: "Dwarf Planet",
      description:
        "Celestial body in direct orbit of the Sun with sufficient mass for hydrostatic equilibrium.",
    },
    [CelestialClassificationCode.MOON]: {
      code: CelestialClassificationCode.MOON,
      category: CelestialCategory.SATELLITE,
      displayName: "Moon (Natural Satellite)",
      description: "Natural astronomical body orbiting a planetary or minor planetary parent.",
    },
    [CelestialClassificationCode.ASTEROID]: {
      code: CelestialClassificationCode.ASTEROID,
      category: CelestialCategory.MINOR_BODY,
      displayName: "Asteroid",
      description: "Small rocky body orbiting in the inner or outer solar system.",
    },
    [CelestialClassificationCode.COMET]: {
      code: CelestialClassificationCode.COMET,
      category: CelestialCategory.MINOR_BODY,
      displayName: "Comet",
      description:
        "Icy small Solar System body that displays a visible coma and tail when close to the Sun.",
    },
    [CelestialClassificationCode.GALAXY]: {
      code: CelestialClassificationCode.GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Galaxy",
      description:
        "Gravitationally bound system of stars, stellar remnants, interstellar gas, and dark matter.",
    },
    [CelestialClassificationCode.NEBULA]: {
      code: CelestialClassificationCode.NEBULA,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Nebula",
      description: "Interstellar cloud of dust, hydrogen, helium and other ionized gases.",
    },
    [CelestialClassificationCode.BLACK_HOLE]: {
      code: CelestialClassificationCode.BLACK_HOLE,
      category: CelestialCategory.RELATIVISTIC,
      displayName: "Black Hole",
      description:
        "Region of spacetime exhibiting gravitational acceleration so strong that nothing can escape.",
    },
  };
