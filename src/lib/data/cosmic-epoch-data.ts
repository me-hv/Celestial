import { CosmicEpoch } from "@/domain/cosmic-time/types";

export const COSMIC_EPOCHS_DATA: CosmicEpoch[] = [
  {
    id: "epoch-planck",
    slug: "planck-epoch",
    name: "Planck Epoch",
    tagline: "Quantum Spacetime & Unification of Fundamental Forces",
    type: "PLANCK_EPOCH",
    category: "VERY_EARLY_UNIVERSE",
    orderIndex: 1,
    ageRange: {
      minYears: 0,
      maxYears: 1e-43 / 31557600,
      minDisplay: "0 s",
      maxDisplay: "10⁻⁴³ s",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "The earliest possible moment of cosmological time where all four fundamental forces were unified and quantum gravitational effects dominated spacetime.",
    description:
      "The Planck Epoch represents the earliest phase of the Universe, spanning from t = 0 to the Planck time (t_P ≈ 5.39 × 10⁻⁴³ seconds). At this scale, the temperature exceeded 10³² Kelvin (the Planck temperature) and quantum fluctuations in the metric itself prevented spacetime from being described by classical General Relativity. All four fundamental forces—gravitation, the strong nuclear force, the weak nuclear force, and electromagnetism—are hypothesized to have been unified into a single primordial superforce.",
    physicalProcesses: [
      {
        title: "Quantum Gravitational Geometry",
        description:
          "Spacetime fluctuates violently on the Planck length scale (l_P ≈ 1.6 × 10⁻³⁵ m), forming a dynamic quantum foam.",
        energyScaleGev: { value: 1.22e19, unit: "GeV" },
        temperatureKelvin: { value: 1.41e32, unit: "K" },
      },
      {
        title: "Superforce Unification",
        description:
          "Gravity is unified with Grand Unified Theory (GUT) gauge symmetries under a single quantum gravitational framework.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Theoretical Quantum Gravity",
        primarySignature:
          "Scale-invariant primordial gravitational wave background (predicted for future B-mode polarization experiments).",
      },
    ],
    keyMilestones: [
      {
        id: "m-planck-singularity",
        name: "Planck Density State",
        cosmicAgeYears: 0,
        description: "Density exceeds 10⁹⁶ kg/m³; classical spacetime descriptions break down.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "THEORETICAL",
    boundaryConfidence: "THEORETICAL_EXTRAPOLATION",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Theoretical High Energy Physics / Cosmology",
      recordIdentifier: "Planck-1899-Preuss-Akad-Wiss",
      confidenceScore: 0.85,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "Beyond the reach of current particle accelerators (LHC reaches ~13 TeV = 1.3 × 10⁴ GeV vs Planck energy 10¹⁹ GeV).",
  },
  {
    id: "epoch-inflation",
    slug: "inflation",
    name: "Cosmic Inflation",
    tagline: "Exponential Metric Expansion & Quantum Seed Imprinting",
    type: "INFLATION",
    category: "VERY_EARLY_UNIVERSE",
    orderIndex: 2,
    ageRange: {
      minYears: 1e-36 / 31557600,
      maxYears: 1e-32 / 31557600,
      minDisplay: "10⁻³⁶ s",
      maxDisplay: "10⁻³² s",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "Vast exponential expansion of space driven by a scalar inflaton field, smoothing the curvature of space and seeding future cosmic structure.",
    description:
      "Cosmic Inflation was an ultra-rapid exponential expansion of spacetime proposed by Alan Guth, Andrei Linde, and Alexei Starobinsky. Between approximately 10⁻³⁶ and 10⁻³² seconds after the Big Bang, the scale factor of the Universe increased by at least 10²⁶ to 10³⁰ (an expansion factor of e⁶⁰ or more). Inflation solves the Horizon Problem (why the CMB temperature is isotropic to 1 part in 100,000) and the Flatness Problem, while magnifying subatomic quantum vacuum fluctuations into macroscopic density perturbations that later collapsed into galaxies and clusters.",
    physicalProcesses: [
      {
        title: "Scalar Field Potential Slow-Roll",
        description:
          "The Universe is dominated by the potential energy of the inflaton field, acting as an effective cosmological constant with negative pressure (p = -ρ).",
        energyScaleGev: { value: 1.0e16, unit: "GeV" },
        temperatureKelvin: { value: 1.0e28, unit: "K" },
      },
      {
        title: "Reheating",
        description:
          "At the end of inflation, the inflaton decays into relativistic Standard Model particles, reheating the Universe to extreme thermal temperatures.",
      },
    ],
    observationalEvidence: [
      {
        technique: "CMB Power Spectrum Analysis",
        observatoryOrMission: "ESA Planck Space Observatory",
        primarySignature:
          "Nearly scale-invariant scalar spectral index n_s = 0.9649 ± 0.0042 and spatial flatness Ω_k = 0.0007 ± 0.0019.",
        bibcode: "2020A&A...641A...6P",
      },
    ],
    keyMilestones: [
      {
        id: "m-inflation-expansion",
        name: "e-Fold Metric Expansion",
        cosmicAgeYears: 1e-35 / 31557600,
        description:
          "Space expands faster than light, expanding causal horizons across macroscopic distances.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "MODEL_DEPENDENT",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "ESA Planck Collaboration",
      recordIdentifier: "Planck-2018-Cosmological-Parameters",
      confidenceScore: 0.95,
      citationUrl: "https://doi.org/10.1051/0004-6361/201833910",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-electroweak",
    slug: "electroweak-epoch",
    name: "Electroweak Epoch",
    tagline: "Electroweak Symmetry Breaking & Mass Generation",
    type: "ELECTROWEAK_EPOCH",
    category: "VERY_EARLY_UNIVERSE",
    orderIndex: 3,
    ageRange: {
      minYears: 1e-32 / 31557600,
      maxYears: 1e-12 / 31557600,
      minDisplay: "10⁻³² s",
      maxDisplay: "10⁻¹² s",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "The epoch during which the electromagnetic and weak nuclear forces remained unified as the electroweak interaction before symmetry breaking.",
    description:
      "During the Electroweak Epoch, the temperature of the Universe was so immense (above 10¹⁵ K, corresponding to energies above ~100 GeV) that electromagnetism and the weak force were indistinguishable, described by the combined SU(2) × U(1) gauge group. At the conclusion of this epoch (t ≈ 10⁻¹² s), the Higgs field acquired a non-zero vacuum expectation value, breaking the electroweak symmetry and granting rest mass to the W and Z bosons, quarks, and charged leptons while leaving photons massless.",
    physicalProcesses: [
      {
        title: "Higgs Vacuum Condensation",
        description:
          "Spontaneous symmetry breaking separates the electroweak force into electromagnetism and the short-range weak nuclear force.",
        energyScaleGev: { value: 100.0, unit: "GeV" },
        temperatureKelvin: { value: 1.0e15, unit: "K" },
      },
    ],
    observationalEvidence: [
      {
        technique: "High-Energy Collider Experiments",
        observatoryOrMission: "CERN Large Hadron Collider (LHC)",
        primarySignature:
          "Confirmation of the Higgs Boson (125.1 GeV) and precision electroweak gauge couplings.",
      },
    ],
    keyMilestones: [
      {
        id: "m-higgs-symmetry-breaking",
        name: "Electroweak Symmetry Breaking",
        cosmicAgeYears: 1e-12 / 31557600,
        description:
          "W and Z gauge bosons acquire mass; fundamental fermions acquire rest mass via Yukawa coupling.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Particle Data Group",
      recordIdentifier: "PDG-2024-Review-Particle-Physics",
      confidenceScore: 0.98,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-quark",
    slug: "quark-epoch",
    name: "Quark Epoch",
    tagline: "Quark-Gluon Plasma & Baryogenesis",
    type: "QUARK_EPOCH",
    category: "VERY_EARLY_UNIVERSE",
    orderIndex: 4,
    ageRange: {
      minYears: 1e-12 / 31557600,
      maxYears: 1e-6 / 31557600,
      minDisplay: "10⁻¹² s",
      maxDisplay: "10⁻⁶ s",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "A hot, dense broth of free quarks, gluons, and leptons where CP violation created the fundamental matter-antimatter asymmetry.",
    description:
      "In the Quark Epoch, temperatures ranged from 10¹⁵ K down to approximately 10¹² K (energies between 100 GeV and 150 MeV). Quarks and gluons were not confined inside composite particles (protons and neutrons) but moved freely as a relativistic Quark-Gluon Plasma (QGP). During or near this era, baryogenesis occurred—Sakharov conditions generated a slight excess of matter over antimatter (roughly one extra quark per billion quark-antiquark pairs).",
    physicalProcesses: [
      {
        title: "Asymptotic Freedom & Deconfinement",
        description:
          "Strong force coupling is weak at high energies, allowing asymptotic freedom for color-charged quarks and gluons.",
        energyScaleGev: { value: 1.0, unit: "GeV" },
        temperatureKelvin: { value: 2.0e12, unit: "K" },
      },
      {
        title: "Baryon Asymmetry Creation",
        description:
          "CP violation and out-of-equilibrium thermodynamics leave a relic baryon-to-photon ratio η ≈ 6.1 × 10⁻¹⁰.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Relativistic Heavy Ion Collisions",
        observatoryOrMission: "RHIC / CERN ALICE Experiment",
        primarySignature:
          "Strongly coupled nearly-perfect fluid behavior of quark-gluon plasma in Pb-Pb collisions.",
      },
    ],
    keyMilestones: [
      {
        id: "m-qgp-fluid",
        name: "Quark-Gluon Fluid Phase",
        cosmicAgeYears: 1e-8 / 31557600,
        description: "Matter exists as a strongly coupled liquid of free quarks and gluons.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "ALICE Collaboration",
      recordIdentifier: "ALICE-2022-QGP-Nature-Physics",
      confidenceScore: 0.97,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-hadron",
    slug: "hadron-epoch",
    name: "Hadron Epoch",
    tagline: "QCD Confinement & Nucleon Formation",
    type: "HADRON_EPOCH",
    category: "VERY_EARLY_UNIVERSE",
    orderIndex: 5,
    ageRange: {
      minYears: 1e-6 / 31557600,
      maxYears: 1.0 / 31557600,
      minDisplay: "10⁻⁶ s",
      maxDisplay: "1.0 s",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "Quarks become permanently bound by gluons into protons, neutrons, and mesons, followed by massive hadron-antihadron annihilation.",
    description:
      "As the Universe cooled below the QCD transition temperature (T_c ≈ 155 MeV or 1.8 × 10¹² K), the strong force became confining. Free quarks and gluons condensed into hadrons—primarily stable protons and neutrons, along with pions and other mesons. Once the temperature dropped below the rest mass of nucleons (~1 GeV), most hadron-antihadron pairs annihilated into high-energy photons, leaving behind the small surviving matter excess.",
    physicalProcesses: [
      {
        title: "QCD Color Confinement",
        description:
          "Color flux tubes bind triplets of quarks into color-singlet baryons (protons, neutrons).",
        temperatureKelvin: { value: 1.8e12, unit: "K" },
      },
      {
        title: "Nucleon-Antinucleon Annihilation",
        description:
          "Almost all antiprotons and antineutrons annihilate, converting mass into photon entropy.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Lattice Quantum Chromodynamics",
        primarySignature:
          "Precision crossover transition temperature T_c = 156.5 ± 1.5 MeV computed in non-perturbative lattice QCD.",
      },
    ],
    keyMilestones: [
      {
        id: "m-hadron-confinement",
        name: "Proton & Neutron Genesis",
        cosmicAgeYears: 2e-5 / 31557600,
        description: "Stable protons and neutrons constitute all baryonic matter in the Universe.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Lattice QCD Literature",
      recordIdentifier: "Aoki-2006-Nature-QCD-Transition",
      confidenceScore: 0.98,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-lepton",
    slug: "lepton-epoch",
    name: "Lepton Epoch",
    tagline: "Neutrino Decoupling & Electron-Positron Annihilation",
    type: "LEPTON_EPOCH",
    category: "VERY_EARLY_UNIVERSE",
    orderIndex: 6,
    ageRange: {
      minYears: 1.0 / 31557600,
      maxYears: 10.0 / 31557600,
      minDisplay: "1.0 s",
      maxDisplay: "10.0 s",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "Leptons dominate the thermal energy density; neutrinos decouple into a cosmic relic background and electron-positron pairs annihilate.",
    description:
      "Between 1 and 10 seconds after the Big Bang, the temperature dropped from 10¹⁰ K down to ~10⁹ K (energies ~1 MeV down to ~0.1 MeV). At t ≈ 1 s, weak interaction rates dropped below the expansion rate of the Universe, causing neutrinos to decouple completely, creating the Cosmic Neutrino Background (CNB, relic temperature ~1.95 K today). Shortly after, the temperature fell below the electron rest-mass threshold (0.511 MeV), triggering massive electron-positron annihilation that heated the photon plasma relative to neutrinos.",
    physicalProcesses: [
      {
        title: "Cosmic Neutrino Decoupling",
        description:
          "Neutrinos freeze out from thermal equilibrium with matter, freely streaming through spacetime.",
        temperatureKelvin: { value: 1.0e10, unit: "K" },
      },
      {
        title: "Electron-Positron Annihilation",
        description:
          "e⁺ + e⁻ → 2γ transfers entropy to the photon bath, setting T_ν = (4/11)¹/³ T_γ.",
      },
    ],
    observationalEvidence: [
      {
        technique: "CMB Damping Tail & Effective Relativistic Species N_eff",
        observatoryOrMission: "Planck Satellite",
        primarySignature:
          "Constraint on N_eff = 2.99 ± 0.17 matching the three Standard Model neutrino families.",
        bibcode: "2020A&A...641A...6P",
      },
    ],
    keyMilestones: [
      {
        id: "m-neutrino-freezeout",
        name: "Neutrino Background Decoupling",
        cosmicAgeYears: 1.0 / 31557600,
        description: "Creation of the Cosmic Neutrino Background (CNB).",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Planck Cosmological Results",
      recordIdentifier: "Planck-2018-Neutrino-Physics",
      confidenceScore: 0.98,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-nucleosynthesis",
    slug: "nucleosynthesis",
    name: "Big Bang Nucleosynthesis",
    tagline: "Primordial Fusion of Helium, Deuterium & Lithium",
    type: "NUCLEOSYNTHESIS",
    category: "EARLY_UNIVERSE",
    orderIndex: 7,
    ageRange: {
      minYears: 10.0 / 31557600,
      maxYears: 20.0 / (60 * 24 * 365.25),
      minDisplay: "10.0 s",
      maxDisplay: "20.0 minutes",
    },
    redshiftRange: {
      minZ: 1e7,
      maxZ: 4e8,
      minDisplay: "z ~ 10⁷",
      maxDisplay: "z ~ 4 × 10⁸",
    },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "The nuclear furnace era where primordial protons and neutrons fused to create the light elements of the cosmos: 75% Hydrogen and 25% Helium.",
    description:
      "Big Bang Nucleosynthesis (BBN) occurred between 10 seconds and 20 minutes after the Big Bang, when temperatures (10⁹ to 10⁷ K) were optimal for nuclear fusion before cosmic expansion thinned the plasma. Free neutrons combined with protons to form deuterium, which rapidly fused into exceptionally stable Helium-4 nuclei, along with trace amounts of Helium-3, Deuterium, and Lithium-7. The exact abundance ratios (75% ¹H, 25% ⁴He, 10⁻⁵ ²H) provide foundational observational proof for the Hot Big Bang model.",
    physicalProcesses: [
      {
        title: "Neutron-to-Proton Freezeout",
        description:
          "Neutron-proton ratio freezes out at n/p ≈ 1/6 (decaying to 1/7 before deuterium bottleneck breaks).",
        temperatureKelvin: { value: 1.0e9, unit: "K" },
      },
      {
        title: "Thermonuclear Helium-4 Synthesis",
        description:
          "Nearly all available neutrons are captured into ⁴He, fixing primordial mass fraction Y_p ≈ 0.247.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Spectroscopy of Metal-Poor Extragalactic HII Regions & Quasar Absorption",
        observatoryOrMission: "Keck HIRES / VLT UVES",
        primarySignature:
          "Measured primordial Deuterium abundance (D/H = 2.54 ± 0.04 × 10⁻⁵) and Helium fraction Y_p = 0.245 ± 0.003.",
        bibcode: "2018ApJ...855..102C",
      },
    ],
    keyMilestones: [
      {
        id: "m-deuterium-bottleneck",
        name: "Breaking of the Deuterium Bottleneck",
        cosmicAgeYears: 3.0 / (60 * 24 * 365.25), // ~3 min
        description:
          "Temperature drops below 0.1 MeV; deuterium survives photo-dissociation and rapid helium fusion commences.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "OBSERVED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Particle Data Group / BBN Review",
      recordIdentifier: "Fields-2020-JCAP-BBN-Review",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1088/1475-7516/2020/03/010",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "The measured primordial deuterium ratio directly measures the baryon density Ω_b h² = 0.0224.",
  },
  {
    id: "epoch-recombination",
    slug: "recombination",
    name: "Recombination & Photon Decoupling",
    tagline: "Formation of Neutral Atoms & Cosmic Microwave Background",
    type: "RECOMBINATION",
    category: "EARLY_UNIVERSE",
    orderIndex: 8,
    ageRange: {
      minYears: 370000,
      maxYears: 390000,
      minDisplay: "370,000 yr",
      maxDisplay: "390,000 yr",
    },
    redshiftRange: {
      minZ: 1050,
      maxZ: 1150,
      minDisplay: "z = 1050",
      maxDisplay: "z = 1150",
    },
    scaleFactorRange: { minA: 0.00086, maxA: 0.00095 },
    lookbackTimeRangeGyr: { minGyr: 13.79, maxGyr: 13.8 },
    summary:
      "The Universe cooled to 3,000 K, allowing electrons to bind with protons to form neutral hydrogen. The fog lifted, and the Cosmic Microwave Background was released.",
    description:
      "Approximately 380,000 years after the Big Bang (at redshift z ≈ 1089), the expanding Universe cooled to approximately 3,000 Kelvin (0.3 eV). At this temperature, photons no longer possessed sufficient energy to instantly ionize hydrogen atoms. Free electrons combined with protons to form neutral hydrogen (Recombination). Without free electrons to Thomson-scatter photons, the optical depth plummeted to zero and the Universe transitioned from an opaque glowing plasma to transparent space (Decoupling). These released photons travel freely to this day, redshifted 1,100-fold into the 2.7255 K Cosmic Microwave Background (CMB).",
    physicalProcesses: [
      {
        title: "Atomic Hydrogen Formation",
        description:
          "p + e⁻ → H(1s) + γ. Peebles three-level atom kinetics govern the recombination rate.",
        temperatureKelvin: { value: 2970, uncertainty: { upper: 50, lower: 50 }, unit: "K" },
      },
      {
        title: "Photon Last Scattering Surface",
        description:
          "The optical depth τ drops to unity; photons decouple and free-stream through cosmic space.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Full-Sky Microwave Radiometry",
        observatoryOrMission: "ESA Planck / NASA WMAP / COBE",
        primarySignature:
          "CMB blackbody spectrum (T = 2.72548 ± 0.00057 K) and acoustic temperature fluctuations ΔT/T ~ 10⁻⁵.",
        bibcode: "2020A&A...641A...1P",
      },
    ],
    keyMilestones: [
      {
        id: "m-last-scattering",
        name: "Last Scattering Surface Peak",
        cosmicAgeYears: 379000,
        redshiftZ: 1089,
        scaleFactorA: 0.000917,
        description:
          "CMB photons scatter for the last time, recording sound horizon acoustic oscillations.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "OBSERVED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Planck 2018 Legacy Archive",
      recordIdentifier: "Planck-2018-Overview-A&A-641-A1",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1051/0004-6361/201833880",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "The sound horizon at recombination r_s ≈ 147.2 Mpc serves as the cosmic standard ruler for Baryon Acoustic Oscillations (BAO).",
  },
  {
    id: "epoch-dark-ages",
    slug: "dark-ages",
    name: "Cosmic Dark Ages",
    tagline: "Cold Neutral Hydrogen & Primordial Gravitational Collapse",
    type: "DARK_AGES",
    category: "EARLY_UNIVERSE",
    orderIndex: 9,
    ageRange: {
      minYears: 380000,
      maxYears: 100000000,
      minDisplay: "380,000 yr",
      maxDisplay: "100 Million yr",
    },
    redshiftRange: {
      minZ: 30,
      maxZ: 1089,
      minDisplay: "z ~ 30",
      maxDisplay: "z = 1089",
    },
    scaleFactorRange: { minA: 0.000917, maxA: 0.032 },
    lookbackTimeRangeGyr: { minGyr: 13.68, maxGyr: 13.79 },
    summary:
      "A vast dark cosmic era containing no stars or galaxies, filled solely with neutral hydrogen and cold dark matter collapsing under gravity.",
    description:
      "The Cosmic Dark Ages spanned from photon decoupling (380,000 years) until the ignition of the first stars (~100–150 million years, z ~ 30). During this period, the Universe was plunged into complete darkness—the brilliant glow of the CMB redshifted into the infrared, and no luminous objects yet existed. Cold dark matter halos steadily grew by gravitational instability, drawing primordial neutral hydrogen gas into their gravitational potential wells. The primary emission from this era is the highly redshifted 21-cm hyperfine spin-flip transition line of neutral hydrogen.",
    physicalProcesses: [
      {
        title: "Linear Perturbation Growth",
        description:
          "Dark matter overdensities grow linearly with scale factor (δ ∝ a in matter-dominated era).",
      },
      {
        title: "21-cm Spin-Flip Coupling",
        description:
          "Spin temperature T_s couples to gas kinetic temperature T_k and CMB radiation field.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Global Low-Frequency Radio Spectrometry",
        observatoryOrMission: "EDGES / SARAS / HERA / SKA-Low",
        primarySignature: "Redshifted 21-cm absorption profile in the 50–100 MHz band.",
      },
    ],
    keyMilestones: [
      {
        id: "m-dark-matter-halos",
        name: "Minihalo Gravitational Virialization",
        cosmicAgeYears: 50000000, // 50 Myr
        redshiftZ: 50,
        scaleFactorA: 0.0196,
        description:
          "Dark matter minihalos reach masses of 10⁶ M☉, sufficient to gravitationally compress neutral gas.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "OBSERVED_WINDOW",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Astrophysical Journal / 21cm Cosmology",
      recordIdentifier: "Furlanetto-2006-PhysRep-21cm",
      confidenceScore: 0.96,
      citationUrl: "https://doi.org/10.1016/j.physrep.2006.08.002",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-first-stars",
    slug: "first-stars",
    name: "Cosmic Dawn (First Stars)",
    tagline: "Population III Star Ignition & First Heavy Elements",
    type: "FIRST_STARS",
    category: "STRUCTURE_FORMATION",
    orderIndex: 10,
    ageRange: {
      minYears: 100000000,
      maxYears: 250000000,
      minDisplay: "100 Million yr",
      maxDisplay: "250 Million yr",
    },
    redshiftRange: {
      minZ: 15,
      maxZ: 30,
      minDisplay: "z = 15",
      maxDisplay: "z = 30",
    },
    scaleFactorRange: { minA: 0.032, maxA: 0.0625 },
    lookbackTimeRangeGyr: { minGyr: 13.55, maxGyr: 13.68 },
    summary:
      "The first stars (Population III) ignite in pristine hydrogen-helium clouds, ending the Cosmic Dark Ages and generating the first heavy elements.",
    description:
      "Cosmic Dawn marks the transition where the first luminous celestial objects ignited, approximately 100 to 250 million years after the Big Bang (z ≈ 30 to 15). Because the primordial gas was completely devoid of elements heavier than helium (zero metallicity), cooling was inefficient and required molecular hydrogen (H₂). Consequently, Population III stars were colossal—typically 50 to 300 times the mass of the Sun—luminous, blue, and short-lived (lifespans of ~2–3 million years). They ended their lives in hypernovae and pair-instability supernovae, scattering the first carbon, oxygen, and iron into the cosmos.",
    physicalProcesses: [
      {
        title: "Molecular Hydrogen Cooling",
        description:
          "H₂ rotational-vibrational transitions cool minihalo gas to ~200 K, enabling Jeans gravitational collapse.",
        temperatureKelvin: { value: 200, unit: "K" },
      },
      {
        title: "Pair-Instability Supernovae",
        description:
          "Massive stars (140–260 M☉) undergo electron-positron pair creation, collapsing and obliterating completely without leaving a black hole remnant.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Ultra-Deep Space Spectroscopy & 21-cm Absorption",
        observatoryOrMission: "James Webb Space Telescope (JWST)",
        primarySignature:
          "Extremely metal-poor stellar populations in high-redshift dwarf systems and Wouthuysen-Field 21-cm coupling.",
      },
    ],
    keyMilestones: [
      {
        id: "m-pop-iii-ignition",
        name: "First Population III Stellar Ignition",
        cosmicAgeYears: 150000000, // 150 Myr
        redshiftZ: 22,
        scaleFactorA: 0.0435,
        description:
          "The first starlight illuminates the Universe, initiating the Wouthuysen-Field effect.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "INFERRED",
    boundaryConfidence: "MODEL_DEPENDENT",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Annual Review of Astronomy and Astrophysics",
      recordIdentifier: "Bromm-2013-ARAA-First-Stars",
      confidenceScore: 0.95,
      citationUrl: "https://doi.org/10.1146/annurev-astro-081811-125608",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-reionization",
    slug: "reionization",
    name: "Epoch of Reionization (EoR)",
    tagline: "Ionization of the Intergalactic Medium by Early Galaxies",
    type: "REIONIZATION",
    category: "STRUCTURE_FORMATION",
    orderIndex: 11,
    ageRange: {
      minYears: 250000000,
      maxYears: 1000000000,
      minDisplay: "250 Million yr",
      maxDisplay: "1.0 Billion yr",
    },
    redshiftRange: {
      minZ: 6.0,
      maxZ: 15.0,
      minDisplay: "z = 6.0",
      maxDisplay: "z = 15.0",
    },
    scaleFactorRange: { minA: 0.0625, maxA: 0.1428 },
    lookbackTimeRangeGyr: { minGyr: 12.8, maxGyr: 13.55 },
    summary:
      "Intense ionizing ultraviolet radiation from early galaxies and quasars created growing ionization bubbles, transforming intergalactic hydrogen into a fully transparent plasma.",
    description:
      "The Epoch of Reionization (EoR) was the major cosmic phase transition during which the neutral hydrogen pervading intergalactic space was reionized into protons and electrons. Spanning from z ≈ 15 down to z ≈ 6 (cosmic age 250 Myr to 1 Gyr), radiation from early faint dwarf galaxies, massive star clusters, and accreting supermassive black holes carved out Strömgren ionization bubbles that gradually expanded and overlapped. By z ≈ 5.8, the Gunn-Peterson optical depth dropped, rendering the intergalactic medium transparent to UV and optical light.",
    physicalProcesses: [
      {
        title: "Percolation of Ionized Bubbles",
        description:
          "HII regions around dwarf galaxies expand and overlap, raising the cosmic ionization fraction x_e from 0.01 to 1.0.",
      },
      {
        title: "Gunn-Peterson Trough Disappearance",
        description:
          "Complete ionization clears the optical depth for resonant Lyman-alpha absorption along quasar sightlines.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Quasar Absorption Spectra & CMB Optical Depth τ",
        observatoryOrMission: "JWST NIRSpec / Keck / Planck",
        primarySignature:
          "Gunn-Peterson troughs in z > 6 quasars and CMB electron scattering optical depth τ = 0.054 ± 0.007.",
        bibcode: "2020A&A...641A...6P",
      },
    ],
    keyMilestones: [
      {
        id: "m-reionization-end",
        name: "Full Intergalactic Ionization",
        cosmicAgeYears: 950000000, // 950 Myr
        redshiftZ: 6.0,
        scaleFactorA: 0.1428,
        description: "Intergalactic hydrogen is 99.9% ionized; cosmic reionization is complete.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "OBSERVED",
    boundaryConfidence: "OBSERVED_WINDOW",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Nature Astronomy / JWST EoR Surveys",
      recordIdentifier: "Robertson-2022-Nature-Reionization",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.1038/s41550-022-01777-6",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-early-galaxies",
    slug: "early-galaxies",
    name: "Early Galaxy Formation",
    tagline: "Protogalactic Mergers & Primeval Disk Assembly",
    type: "EARLY_GALAXIES",
    category: "STRUCTURE_FORMATION",
    orderIndex: 12,
    ageRange: {
      minYears: 1000000000,
      maxYears: 3500000000,
      minDisplay: "1.0 Billion yr",
      maxDisplay: "3.5 Billion yr",
    },
    redshiftRange: {
      minZ: 2.0,
      maxZ: 6.0,
      minDisplay: "z = 2.0",
      maxDisplay: "z = 6.0",
    },
    scaleFactorRange: { minA: 0.1428, maxA: 0.3333 },
    lookbackTimeRangeGyr: { minGyr: 10.5, maxGyr: 12.8 },
    summary:
      "Small, turbulent protogalactic fragments merged rapidly, creating luminous young spiral disks, starburst galaxies, and supermassive black holes.",
    description:
      "Between 1 and 3.5 billion years after the Big Bang (redshift z ≈ 6 to 2), the Universe experienced rapid hierarchical galaxy building. Small, irregular protogalaxies collided and merged within expanding cosmic filaments. JWST observations (e.g. JADES, CEERS) demonstrate that galaxies at this epoch were surprisingly luminous and compact, featuring intense star formation rates and rapid chemical enrichment. Supermassive black holes grew prodigiously at galaxy centers, fueling ultra-luminous high-redshift quasars.",
    physicalProcesses: [
      {
        title: "Hierarchical Merger Assembly",
        description:
          "Turbulent gas-rich mergers drive star formation bursts and build up central stellar bulges.",
      },
      {
        title: "Cold Stream Gas Accretion",
        description:
          "Pristine gas flows from cosmic web filaments directly feed high-density star-forming galactic disks.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Deep Near-Infrared Imaging & Spectroscopy",
        observatoryOrMission: "JWST NIRCam & NIRSpec / HST",
        primarySignature:
          "Spectroscopically confirmed galaxies at z > 10 (e.g. JADES-GS-z14-0, GN-z11) and Lyman-break galaxies.",
        bibcode: "2023Natur.616..266C",
      },
    ],
    keyMilestones: [
      {
        id: "m-jades-discovery",
        name: "Primeval Galaxy Archetypes (z > 10)",
        cosmicAgeYears: 1200000000, // 1.2 Gyr
        redshiftZ: 5.0,
        scaleFactorA: 0.1666,
        description: "Dense, compact stellar disks assemble high stellar mass density.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "OBSERVED",
    boundaryConfidence: "OBSERVED_WINDOW",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "JWST Advanced Deep Extragalactic Survey (JADES)",
      recordIdentifier: "JADES-2023-Nature-Deep-Surveys",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1038/s41586-023-05994-w",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-galaxy-assembly",
    slug: "galaxy-assembly",
    name: "Cosmic Noon & Galaxy Assembly",
    tagline: "Peak Star Formation & Structural Maturation",
    type: "GALAXY_ASSEMBLY",
    category: "STRUCTURE_FORMATION",
    orderIndex: 13,
    ageRange: {
      minYears: 3500000000,
      maxYears: 9000000000,
      minDisplay: "3.5 Billion yr",
      maxDisplay: "9.0 Billion yr",
    },
    redshiftRange: {
      minZ: 0.4,
      maxZ: 2.0,
      minDisplay: "z = 0.4",
      maxDisplay: "z = 2.0",
    },
    scaleFactorRange: { minA: 0.3333, maxA: 0.714 },
    lookbackTimeRangeGyr: { minGyr: 4.4, maxGyr: 10.5 },
    summary:
      "The epoch of Cosmic Noon (z ~ 2), where the Universe reached its all-time peak star formation rate density and mature galaxy morphologies crystallized.",
    description:
      "Cosmic Noon and the Galaxy Assembly Epoch (z ≈ 2 to 0.4, cosmic age 3.5 to 9 billion years) represent the most energetically active period of galaxy growth in cosmic history. At z ≈ 2 (10 billion years ago), the global Cosmic Star Formation Rate Density peaked at roughly 10 times its present-day value. Massive spiral disks stabilized, giant elliptical galaxies formed through major mergers, and Active Galactic Nuclei (AGN) feedback from supermassive black holes began quenching star formation in massive halos.",
    physicalProcesses: [
      {
        title: "Peak Cosmic Star Formation (Madau-Dickinson Peak)",
        description:
          "Global star formation rate reaches ~0.15 M☉ yr⁻¹ Mpc⁻³ before declining exponentially towards the present.",
      },
      {
        title: "Morphological Hubble Sequence Emergence",
        description:
          "Galaxies settle into distinct thin disks, bars, spiral arms, and virialized elliptical spheroids.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Deep Extragalactic Surveys & Multi-wavelength Photometry",
        observatoryOrMission: "Hubble Space Telescope (CANDELS) / ALMA / SDSS",
        primarySignature:
          "Madau-Dickinson star formation curve and high-velocity molecular gas outflows in z ~ 2 submillimeter galaxies.",
        bibcode: "2014ARA&A..52..415M",
      },
    ],
    keyMilestones: [
      {
        id: "m-cosmic-noon-peak",
        name: "Peak Cosmic Star Formation Rate",
        cosmicAgeYears: 3300000000, // 3.3 Gyr
        redshiftZ: 2.0,
        scaleFactorA: 0.3333,
        description: "Peak epoch of star formation and supermassive black hole accretion.",
        isCosmologicalMilestone: true,
      },
      {
        id: "m-milky-way-thick-disk",
        name: "Milky Way Disk Stabilization",
        cosmicAgeYears: 5000000000, // 5.0 Gyr
        redshiftZ: 1.2,
        scaleFactorA: 0.4545,
        description:
          "The Milky Way's thin disk develops and stars begin regular orbital kinematics.",
        isCosmologicalMilestone: false,
      },
    ],
    observationStatus: "OBSERVED",
    boundaryConfidence: "OBSERVED_WINDOW",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Annual Review of Astronomy and Astrophysics",
      recordIdentifier: "Madau-2014-ARAA-Cosmic-Star-Formation",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1146/annurev-astro-081811-125519",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "epoch-modern-universe",
    slug: "modern-universe",
    name: "Modern Universe & Cosmic Acceleration",
    tagline: "Dark Energy Dominance, Solar System & Present Cosmic Web",
    type: "MODERN_UNIVERSE",
    category: "MODERN_UNIVERSE",
    orderIndex: 14,
    ageRange: {
      minYears: 9000000000,
      maxYears: 13800000000,
      minDisplay: "9.0 Billion yr",
      maxDisplay: "13.8 Billion yr (Today)",
    },
    redshiftRange: {
      minZ: 0.0,
      maxZ: 0.4,
      minDisplay: "z = 0",
      maxDisplay: "z = 0.4",
    },
    scaleFactorRange: { minA: 0.714, maxA: 1.0 },
    lookbackTimeRangeGyr: { minGyr: 0.0, maxGyr: 4.4 },
    summary:
      "Dark energy drives accelerating cosmic expansion; the Solar System forms, life emerges on Earth, and mature superclusters define the cosmic web.",
    description:
      "The Modern Universe (the past ~4.8 billion years, z ≈ 0.4 to 0) is characterized by the onset of Dark Energy dominance. Around 5 billion years ago (z ≈ 0.4), the matter density diluted sufficiently for the cosmological constant (Ω_Λ ≈ 0.685) to overcome gravitational deceleration, initiating accelerating metric expansion. During this epoch, our Solar System formed (~4.6 Gyr ago, z ≈ 0.44), life emerged on Earth, and galaxy clusters settled into the immense web of filaments, walls, and superclusters (Laniakea, Virgo, Coma) explored across CELESTIAL.",
    physicalProcesses: [
      {
        title: "Accelerating Spacetime Metric Expansion",
        description:
          "Dark energy with equation of state w ≈ -1 causes the expansion rate a(t) to accelerate exponentially.",
      },
      {
        title: "Quenched Star Formation & Cosmic Web Stabilization",
        description:
          "Galaxy groups and clusters freeze out of the linear Hubble flow and evolve via internal secular mechanisms.",
      },
    ],
    observationalEvidence: [
      {
        technique: "Type Ia Supernovae Standard Candles & BAO",
        observatoryOrMission: "Supernova Cosmology Project / High-Z Team / DESI / Euclid",
        primarySignature:
          "Accelerating luminosity distance relation of Type Ia supernovae (1998 Nobel Prize in Physics).",
        bibcode: "1998AJ....116.1009R",
      },
    ],
    keyMilestones: [
      {
        id: "m-acceleration-start",
        name: "Transition to Cosmic Acceleration",
        cosmicAgeYears: 9000000000, // 9.0 Gyr
        redshiftZ: 0.4,
        scaleFactorA: 0.714,
        description:
          "Dark energy density surpasses matter density; deceleration turns to acceleration.",
        isCosmologicalMilestone: true,
      },
      {
        id: "m-solar-system-formation",
        name: "Solar System Formation",
        cosmicAgeYears: 9200000000, // 9.2 Gyr
        redshiftZ: 0.44,
        scaleFactorA: 0.694,
        description: "Protoplanetary disk collapses around the proto-Sun 4.567 billion years ago.",
        isCosmologicalMilestone: false,
      },
      {
        id: "m-present-observer",
        name: "Present Day Cosmic Observer",
        cosmicAgeYears: 13800000000, // 13.8 Gyr
        redshiftZ: 0.0,
        scaleFactorA: 1.0,
        description: "Present observational epoch of humanity and CELESTIAL astronomical atlas.",
        isCosmologicalMilestone: true,
      },
    ],
    observationStatus: "OBSERVED",
    boundaryConfidence: "SHARP_PHYSICAL",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Supernova Cosmology Project / Riess & Perlmutter",
      recordIdentifier: "Riess-1998-AJ-116-1009",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1086/300499",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
];
