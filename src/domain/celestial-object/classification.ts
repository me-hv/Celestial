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
  COSMIC_STRUCTURE: "COSMIC_STRUCTURE",
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
  SPIRAL_GALAXY: "SPIRAL_GALAXY",
  BARRED_SPIRAL_GALAXY: "BARRED_SPIRAL_GALAXY",
  ELLIPTICAL_GALAXY: "ELLIPTICAL_GALAXY",
  LENTICULAR_GALAXY: "LENTICULAR_GALAXY",
  IRREGULAR_GALAXY: "IRREGULAR_GALAXY",
  DWARF_GALAXY: "DWARF_GALAXY",
  NEBULA: "NEBULA",
  STAR_CLUSTER: "STAR_CLUSTER",
  PLANETARY_NEBULA: "PLANETARY_NEBULA",
  SUPERNOVA_REMNANT: "SUPERNOVA_REMNANT",
  BLACK_HOLE: "BLACK_HOLE",
  GALAXY_GROUP: "GALAXY_GROUP",
  GALAXY_CLUSTER: "GALAXY_CLUSTER",
  SUPERCLUSTER: "SUPERCLUSTER",
  FILAMENT: "FILAMENT",
  VOID: "VOID",
  WALL: "WALL",
  COSMIC_WEB: "COSMIC_WEB",
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
    [CelestialClassificationCode.SPIRAL_GALAXY]: {
      code: CelestialClassificationCode.SPIRAL_GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Spiral Galaxy",
      description:
        "Disk galaxy with rotating spiral arms of young stars and interstellar gas wrapping around a central bulge.",
    },
    [CelestialClassificationCode.BARRED_SPIRAL_GALAXY]: {
      code: CelestialClassificationCode.BARRED_SPIRAL_GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Barred Spiral Galaxy",
      description:
        "Spiral galaxy characterized by a central bar-shaped structure of stars with spiral arms originating from the bar ends.",
    },
    [CelestialClassificationCode.ELLIPTICAL_GALAXY]: {
      code: CelestialClassificationCode.ELLIPTICAL_GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Elliptical Galaxy",
      description:
        "Smooth, nearly featureless ellipsoidal galaxy dominated by older, metal-poor stars with low interstellar matter.",
    },
    [CelestialClassificationCode.LENTICULAR_GALAXY]: {
      code: CelestialClassificationCode.LENTICULAR_GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Lenticular Galaxy",
      description:
        "Intermediate galaxy type featuring a prominent disk and large bulge but lacking prominent spiral arm structure.",
    },
    [CelestialClassificationCode.IRREGULAR_GALAXY]: {
      code: CelestialClassificationCode.IRREGULAR_GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Irregular Galaxy",
      description:
        "Galaxy without distinct regular morphology or rotational symmetry, often shaped by gravitational tidal interactions.",
    },
    [CelestialClassificationCode.DWARF_GALAXY]: {
      code: CelestialClassificationCode.DWARF_GALAXY,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Dwarf Galaxy",
      description:
        "Low-luminosity, compact galaxy containing from several thousand up to a few billion stars, often a satellite.",
    },
    [CelestialClassificationCode.NEBULA]: {
      code: CelestialClassificationCode.NEBULA,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Nebula",
      description: "Interstellar cloud of dust, hydrogen, helium and other ionized gases.",
    },
    [CelestialClassificationCode.STAR_CLUSTER]: {
      code: CelestialClassificationCode.STAR_CLUSTER,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Star Cluster",
      description: "Group of gravitationally bound stars sharing a common origin and age.",
    },
    [CelestialClassificationCode.PLANETARY_NEBULA]: {
      code: CelestialClassificationCode.PLANETARY_NEBULA,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Planetary Nebula",
      description:
        "Expanding glowing shell of ionized gas ejected from red giant stars late in their life.",
    },
    [CelestialClassificationCode.SUPERNOVA_REMNANT]: {
      code: CelestialClassificationCode.SUPERNOVA_REMNANT,
      category: CelestialCategory.DEEP_SKY,
      displayName: "Supernova Remnant",
      description:
        "Structure resulting from the explosion of a star in a supernova, bounded by an expanding shock wave.",
    },
    [CelestialClassificationCode.BLACK_HOLE]: {
      code: CelestialClassificationCode.BLACK_HOLE,
      category: CelestialCategory.RELATIVISTIC,
      displayName: "Black Hole",
      description:
        "Region of spacetime exhibiting gravitational acceleration so strong that nothing can escape.",
    },
    [CelestialClassificationCode.GALAXY_GROUP]: {
      code: CelestialClassificationCode.GALAXY_GROUP,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Galaxy Group",
      description:
        "Small gravitationally bound aggregation of fewer than 50 galaxies spanning 1 to 2 megaparsecs.",
    },
    [CelestialClassificationCode.GALAXY_CLUSTER]: {
      code: CelestialClassificationCode.GALAXY_CLUSTER,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Galaxy Cluster",
      description:
        "Massive, virialized structure containing hundreds to thousands of galaxies embedded in hot intracluster gas and dark matter.",
    },
    [CelestialClassificationCode.SUPERCLUSTER]: {
      code: CelestialClassificationCode.SUPERCLUSTER,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Supercluster",
      description:
        "Large-scale concentration of galaxy clusters and groups spanning tens to hundreds of megaparsecs.",
    },
    [CelestialClassificationCode.FILAMENT]: {
      code: CelestialClassificationCode.FILAMENT,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Cosmic Filament",
      description:
        "Massive thread-like formation of galaxies and dark matter bridging superclusters and bounding cosmic voids.",
    },
    [CelestialClassificationCode.VOID]: {
      code: CelestialClassificationCode.VOID,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Cosmic Void",
      description:
        "Vast, underdense volume of space containing extremely few galaxies and matter between cosmic web filaments.",
    },
    [CelestialClassificationCode.WALL]: {
      code: CelestialClassificationCode.WALL,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Cosmic Wall / Sheet",
      description:
        "Extended, flattened planar structure of galaxy clusters and dark matter bounding large-scale voids.",
    },
    [CelestialClassificationCode.COSMIC_WEB]: {
      code: CelestialClassificationCode.COSMIC_WEB,
      category: CelestialCategory.COSMIC_STRUCTURE,
      displayName: "Cosmic Web",
      description:
        "The overall large-scale matter distribution of the observable universe formed by interconnected filaments, nodes, and voids.",
    },
  };
