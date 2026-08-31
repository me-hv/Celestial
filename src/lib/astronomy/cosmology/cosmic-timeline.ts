import { MilestoneEvent, CosmicEpochType } from "@/domain/cosmic-time/types";
export { defaultCosmology } from "./cosmology-calculator";

/**
 * Standard Cosmological Milestones in Universe Evolution
 */
export const COSMIC_MILESTONES: MilestoneEvent[] = [
  {
    id: "milestone-big-bang",
    name: "The Big Bang",
    cosmicAgeYears: 0,
    redshiftZ: 1e9,
    scaleFactorA: 0,
    description: "Initial singularity and emergence of spacetime, matter, and physical laws.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-inflation-end",
    name: "End of Cosmic Inflation",
    cosmicAgeYears: 1e-32 / 31557600,
    description:
      "Exponential metric expansion flattens spacetime and seeds scale-invariant quantum density fluctuations.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-nucleosynthesis",
    name: "Primordial Nucleosynthesis",
    cosmicAgeYears: 3 / (60 * 24 * 365.25), // ~3 minutes
    redshiftZ: 4e8,
    scaleFactorA: 2.5e-9,
    description:
      "Protons and neutrons fuse into helium-4 (~25% by mass), deuterium, helium-3, and lithium-7.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-recombination",
    name: "Recombination & CMB Decoupling",
    cosmicAgeYears: 379000,
    redshiftZ: 1089,
    scaleFactorA: 0.000917,
    description:
      "Electrons combine with protons to form neutral hydrogen atoms. Photons decouple, creating the Cosmic Microwave Background.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-first-stars",
    name: "First Stars (Cosmic Dawn)",
    cosmicAgeYears: 180000000, // 180 Myr
    redshiftZ: 20,
    scaleFactorA: 0.0476,
    description:
      "Pristine, metal-free Population III massive stars ignite in primordial dark matter minihalos.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-reionization-end",
    name: "Completion of Reionization",
    cosmicAgeYears: 950000000, // 950 Myr
    redshiftZ: 6.0,
    scaleFactorA: 0.1428,
    description: "UV radiation from early galaxies completely ionizes the intergalactic medium.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-cosmic-noon",
    name: "Cosmic Noon (Peak Star Formation)",
    cosmicAgeYears: 3300000000, // 3.3 Gyr
    redshiftZ: 2.0,
    scaleFactorA: 0.3333,
    description:
      "The Universe reaches its highest global star formation rate density and intense quasar activity.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-dark-energy-domination",
    name: "Dark Energy Dominance & Acceleration",
    cosmicAgeYears: 9800000000, // 9.8 Gyr
    redshiftZ: 0.4,
    scaleFactorA: 0.714,
    description:
      "Cosmological constant / Dark Energy overcomes gravitational deceleration, initiating accelerating cosmic expansion.",
    isCosmologicalMilestone: true,
  },
  {
    id: "milestone-solar-system-birth",
    name: "Formation of the Solar System",
    cosmicAgeYears: 9200000000, // 9.2 Gyr (4.6 Gyr ago)
    redshiftZ: 0.44,
    scaleFactorA: 0.694,
    description:
      "Collapse of a molecular cloud core forms the Sun, protoplanetary disk, and planets including Earth.",
    isCosmologicalMilestone: false,
  },
  {
    id: "milestone-present-day",
    name: "Present Day (Observational Horizon)",
    cosmicAgeYears: 13800000000, // 13.8 Gyr
    redshiftZ: 0.0,
    scaleFactorA: 1.0,
    description:
      "The present epoch of astronomical observations, mature galaxy clusters, and the cosmic web.",
    isCosmologicalMilestone: true,
  },
];

/**
 * Maps any cosmological redshift z to its standard CosmicEpochType
 */
export function getEpochTypeForRedshift(z: number): CosmicEpochType {
  if (z <= 0.4) return "MODERN_UNIVERSE";
  if (z <= 2.0) return "GALAXY_ASSEMBLY";
  if (z <= 6.0) return "EARLY_GALAXIES";
  if (z <= 15.0) return "REIONIZATION";
  if (z <= 30.0) return "FIRST_STARS";
  if (z <= 1050.0) return "DARK_AGES";
  if (z <= 1500.0) return "RECOMBINATION";
  if (z <= 1e8) return "NUCLEOSYNTHESIS";
  return "LEPTON_EPOCH";
}

/**
 * Maps cosmic age (in years) to its standard CosmicEpochType
 */
export function getEpochTypeForCosmicAge(ageYears: number): CosmicEpochType {
  const SECONDS_PER_YEAR = 31557600;

  if (ageYears <= 1e-43 / SECONDS_PER_YEAR) return "PLANCK_EPOCH";
  if (ageYears <= 1e-32 / SECONDS_PER_YEAR) return "INFLATION";
  if (ageYears <= 1e-12 / SECONDS_PER_YEAR) return "ELECTROWEAK_EPOCH";
  if (ageYears <= 1e-6 / SECONDS_PER_YEAR) return "QUARK_EPOCH";
  if (ageYears <= 1.0 / SECONDS_PER_YEAR) return "HADRON_EPOCH";
  if (ageYears <= 10.0 / SECONDS_PER_YEAR) return "LEPTON_EPOCH";
  if (ageYears <= 20.0 / (60 * 24 * 365.25)) return "NUCLEOSYNTHESIS"; // 20 minutes
  if (ageYears <= 390000) return "RECOMBINATION";
  if (ageYears <= 100000000) return "DARK_AGES"; // 100 Myr
  if (ageYears <= 250000000) return "FIRST_STARS"; // 250 Myr
  if (ageYears <= 1000000000) return "REIONIZATION"; // 1 Gyr
  if (ageYears <= 3500000000) return "EARLY_GALAXIES"; // 3.5 Gyr
  if (ageYears <= 9000000000) return "GALAXY_ASSEMBLY"; // 9 Gyr

  return "MODERN_UNIVERSE";
}

/**
 * Formats a cosmic age with appropriate SI prefix or astronomical time units
 */
export function formatCosmicAge(ageYears: number): string {
  if (ageYears < 1e-30) return `${(ageYears * 3.15576e7).toExponential(2)} s`;
  if (ageYears < 1e-6) return `${(ageYears * 3.15576e7).toExponential(2)} seconds`;
  if (ageYears < 1.0) return `${(ageYears * 3.15576e7).toFixed(2)} seconds`;
  if (ageYears < 1000) return `${Math.round(ageYears)} years`;
  if (ageYears < 1e6) return `${(ageYears / 1000).toFixed(1)} thousand years`;
  if (ageYears < 1e9) return `${(ageYears / 1e6).toFixed(1)} Million years`;
  return `${(ageYears / 1e9).toFixed(2)} Billion years`;
}
