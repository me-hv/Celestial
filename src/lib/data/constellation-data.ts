import { Constellation } from "@/domain/constellation/types";

export const IAU_CONSTELLATIONS_DATA: Constellation[] = [
  // ==========================================
  // 1. ORION (The Hunter)
  // ==========================================
  {
    id: "const-ori",
    slug: "orion",
    name: "Orion",
    iauCode: "ORI",
    genitive: "Orionis",
    family: "ORION_FAMILY",
    areaSquareDegrees: 594.12,
    quadrant: "NQ1",
    centerCoordinates: { raDeg: 83.82, decDeg: 5.91 },
    brightestStar: {
      name: "Rigel",
      designation: "Beta Orionis",
      magnitudeV: 0.13,
      raDeg: 78.6345,
      decDeg: -8.2016,
    },
    asterismLines: [
      // Left shoulder to head & right shoulder
      {
        startStar: "Betelgeuse (Alpha Ori)",
        endStar: "Meissa (Lambda Ori)",
        startCoords: { raDeg: 88.7929, decDeg: 7.4071 },
        endCoords: { raDeg: 83.7845, decDeg: 9.9341 },
      },
      {
        startStar: "Meissa (Lambda Ori)",
        endStar: "Bellatrix (Gamma Ori)",
        startCoords: { raDeg: 83.7845, decDeg: 9.9341 },
        endCoords: { raDeg: 81.2828, decDeg: 6.3497 },
      },
      // Shoulders to Belt
      {
        startStar: "Betelgeuse (Alpha Ori)",
        endStar: "Alnitak (Zeta Ori)",
        startCoords: { raDeg: 88.7929, decDeg: 7.4071 },
        endCoords: { raDeg: 85.1897, decDeg: -1.9426 },
      },
      {
        startStar: "Bellatrix (Gamma Ori)",
        endStar: "Mintaka (Delta Ori)",
        startCoords: { raDeg: 81.2828, decDeg: 6.3497 },
        endCoords: { raDeg: 83.0016, decDeg: -0.2991 },
      },
      // Orion's Belt (Alnitak -> Alnilam -> Mintaka)
      {
        startStar: "Alnitak (Zeta Ori)",
        endStar: "Alnilam (Epsilon Ori)",
        startCoords: { raDeg: 85.1897, decDeg: -1.9426 },
        endCoords: { raDeg: 84.0534, decDeg: -1.2019 },
      },
      {
        startStar: "Alnilam (Epsilon Ori)",
        endStar: "Mintaka (Delta Ori)",
        startCoords: { raDeg: 84.0534, decDeg: -1.2019 },
        endCoords: { raDeg: 83.0016, decDeg: -0.2991 },
      },
      // Belt to Feet (Rigel & Saiph)
      {
        startStar: "Alnitak (Zeta Ori)",
        endStar: "Saiph (Kappa Ori)",
        startCoords: { raDeg: 85.1897, decDeg: -1.9426 },
        endCoords: { raDeg: 86.9391, decDeg: -9.6696 },
      },
      {
        startStar: "Mintaka (Delta Ori)",
        endStar: "Rigel (Beta Ori)",
        startCoords: { raDeg: 83.0016, decDeg: -0.2991 },
        endCoords: { raDeg: 78.6345, decDeg: -8.2016 },
      },
      {
        startStar: "Saiph (Kappa Ori)",
        endStar: "Rigel (Beta Ori)",
        startCoords: { raDeg: 86.9391, decDeg: -9.6696 },
        endCoords: { raDeg: 78.6345, decDeg: -8.2016 },
      },
    ],
    majorStars: [
      {
        name: "Rigel",
        bayer: "Beta Orionis",
        raDeg: 78.6345,
        decDeg: -8.2016,
        magnitudeV: 0.13,
        spectralClass: "B8Ia",
      },
      {
        name: "Betelgeuse",
        bayer: "Alpha Orionis",
        raDeg: 88.7929,
        decDeg: 7.4071,
        magnitudeV: 0.5,
        spectralClass: "M1-M2Ia-ab",
      },
      {
        name: "Bellatrix",
        bayer: "Gamma Orionis",
        raDeg: 81.2828,
        decDeg: 6.3497,
        magnitudeV: 1.64,
        spectralClass: "B2III",
      },
      {
        name: "Alnilam",
        bayer: "Epsilon Orionis",
        raDeg: 84.0534,
        decDeg: -1.2019,
        magnitudeV: 1.69,
        spectralClass: "B0Ia",
      },
      {
        name: "Alnitak",
        bayer: "Zeta Orionis",
        raDeg: 85.1897,
        decDeg: -1.9426,
        magnitudeV: 1.77,
        spectralClass: "O9.5Ib",
      },
      {
        name: "Saiph",
        bayer: "Kappa Orionis",
        raDeg: 86.9391,
        decDeg: -9.6696,
        magnitudeV: 2.07,
        spectralClass: "B0.5Ia",
      },
      {
        name: "Mintaka",
        bayer: "Delta Orionis",
        raDeg: 83.0016,
        decDeg: -0.2991,
        magnitudeV: 2.23,
        spectralClass: "O9.5II",
      },
    ],
    lore: "In Greek mythology, Orion was a gigantic supernatural hunter who claimed he could defeat any beast on Earth, until Gaia sent Scorpius to challenge his hubris.",
    summary:
      "One of the most recognizable and luminous constellations on the celestial equator, visible worldwide and home to the Great Orion Nebula (M42).",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry & SIMBAD",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-ORI",
      confidenceScore: 1.0,
      citationUrl: "https://www.iau.org/public/themes/constellations/#ori",
    },
  },

  // ==========================================
  // 2. URSA MAJOR (The Great Bear / Big Dipper)
  // ==========================================
  {
    id: "const-uma",
    slug: "ursa-major",
    name: "Ursa Major",
    iauCode: "UMA",
    genitive: "Ursae Majoris",
    family: "URSA_MAJOR_FAMILY",
    areaSquareDegrees: 1279.66,
    quadrant: "NQ2",
    centerCoordinates: { raDeg: 160.0, decDeg: 55.0 },
    brightestStar: {
      name: "Alioth",
      designation: "Epsilon Ursae Majoris",
      magnitudeV: 1.76,
      raDeg: 193.5073,
      decDeg: 55.9598,
    },
    asterismLines: [
      // The Big Dipper Bowl (Dubhe -> Merak -> Phecda -> Megrez -> Dubhe)
      {
        startStar: "Dubhe (Alpha UMa)",
        endStar: "Merak (Beta UMa)",
        startCoords: { raDeg: 165.932, decDeg: 61.7508 },
        endCoords: { raDeg: 165.4603, decDeg: 56.3824 },
      },
      {
        startStar: "Merak (Beta UMa)",
        endStar: "Phecda (Gamma UMa)",
        startCoords: { raDeg: 165.4603, decDeg: 56.3824 },
        endCoords: { raDeg: 178.4577, decDeg: 53.6948 },
      },
      {
        startStar: "Phecda (Gamma UMa)",
        endStar: "Megrez (Delta UMa)",
        startCoords: { raDeg: 178.4577, decDeg: 53.6948 },
        endCoords: { raDeg: 183.8568, decDeg: 57.0326 },
      },
      {
        startStar: "Megrez (Delta UMa)",
        endStar: "Dubhe (Alpha UMa)",
        startCoords: { raDeg: 183.8568, decDeg: 57.0326 },
        endCoords: { raDeg: 165.932, decDeg: 61.7508 },
      },
      // Big Dipper Handle (Megrez -> Alioth -> Mizar -> Alkaid)
      {
        startStar: "Megrez (Delta UMa)",
        endStar: "Alioth (Epsilon UMa)",
        startCoords: { raDeg: 183.8568, decDeg: 57.0326 },
        endCoords: { raDeg: 193.5073, decDeg: 55.9598 },
      },
      {
        startStar: "Alioth (Epsilon UMa)",
        endStar: "Mizar (Zeta UMa)",
        startCoords: { raDeg: 193.5073, decDeg: 55.9598 },
        endCoords: { raDeg: 200.9814, decDeg: 54.9254 },
      },
      {
        startStar: "Mizar (Zeta UMa)",
        endStar: "Alkaid (Eta UMa)",
        startCoords: { raDeg: 200.9814, decDeg: 54.9254 },
        endCoords: { raDeg: 206.8852, decDeg: 49.3133 },
      },
    ],
    majorStars: [
      {
        name: "Alioth",
        bayer: "Epsilon Ursae Majoris",
        raDeg: 193.5073,
        decDeg: 55.9598,
        magnitudeV: 1.76,
        spectralClass: "A1III-IVp",
      },
      {
        name: "Dubhe",
        bayer: "Alpha Ursae Majoris",
        raDeg: 165.932,
        decDeg: 61.7508,
        magnitudeV: 1.79,
        spectralClass: "K0III",
      },
      {
        name: "Alkaid",
        bayer: "Eta Ursae Majoris",
        raDeg: 206.8852,
        decDeg: 49.3133,
        magnitudeV: 1.86,
        spectralClass: "B3V",
      },
      {
        name: "Mizar",
        bayer: "Zeta Ursae Majoris",
        raDeg: 200.9814,
        decDeg: 54.9254,
        magnitudeV: 2.23,
        spectralClass: "A2V",
      },
      {
        name: "Merak",
        bayer: "Beta Ursae Majoris",
        raDeg: 165.4603,
        decDeg: 56.3824,
        magnitudeV: 2.37,
        spectralClass: "A1V",
      },
      {
        name: "Phecda",
        bayer: "Gamma Ursae Majoris",
        raDeg: 178.4577,
        decDeg: 53.6948,
        magnitudeV: 2.44,
        spectralClass: "A0Ve",
      },
      {
        name: "Megrez",
        bayer: "Delta Ursae Majoris",
        raDeg: 183.8568,
        decDeg: 57.0326,
        magnitudeV: 3.31,
        spectralClass: "A3V",
      },
    ],
    lore: "In Greek mythology, Zeus transformed the nymph Callisto into a bear to protect her from Hera's wrath. Merak and Dubhe form the 'Pointers' pointing directly to Polaris.",
    summary:
      "The third-largest constellation in the sky, containing the world-famous Big Dipper (Plough / Saptarishi) asterism and key pointer stars to the North Celestial Pole.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-UMA",
      confidenceScore: 1.0,
      citationUrl: "https://www.iau.org/public/themes/constellations/#uma",
    },
  },

  // ==========================================
  // 3. CASSIOPEIA (The Vain Queen)
  // ==========================================
  {
    id: "const-cas",
    slug: "cassiopeia",
    name: "Cassiopeia",
    iauCode: "CAS",
    genitive: "Cassiopeiae",
    family: "PERSEUS_FAMILY",
    areaSquareDegrees: 598.41,
    quadrant: "NQ1",
    centerCoordinates: { raDeg: 15.0, decDeg: 60.0 },
    brightestStar: {
      name: "Schedar",
      designation: "Alpha Cassiopeiae",
      magnitudeV: 2.24,
      raDeg: 10.1268,
      decDeg: 56.5373,
    },
    asterismLines: [
      // Distinctive 'W' Asterism (Caph -> Schedar -> Navi -> Ruchbah -> Segin)
      {
        startStar: "Caph (Beta Cas)",
        endStar: "Schedar (Alpha Cas)",
        startCoords: { raDeg: 2.2945, decDeg: 59.1498 },
        endCoords: { raDeg: 10.1268, decDeg: 56.5373 },
      },
      {
        startStar: "Schedar (Alpha Cas)",
        endStar: "Navi (Gamma Cas)",
        startCoords: { raDeg: 10.1268, decDeg: 56.5373 },
        endCoords: { raDeg: 14.1772, decDeg: 60.7167 },
      },
      {
        startStar: "Navi (Gamma Cas)",
        endStar: "Ruchbah (Delta Cas)",
        startCoords: { raDeg: 14.1772, decDeg: 60.7167 },
        endCoords: { raDeg: 21.454, decDeg: 60.2353 },
      },
      {
        startStar: "Ruchbah (Delta Cas)",
        endStar: "Segin (Epsilon Cas)",
        startCoords: { raDeg: 21.454, decDeg: 60.2353 },
        endCoords: { raDeg: 26.0461, decDeg: 63.6701 },
      },
    ],
    majorStars: [
      {
        name: "Schedar",
        bayer: "Alpha Cassiopeiae",
        raDeg: 10.1268,
        decDeg: 56.5373,
        magnitudeV: 2.24,
        spectralClass: "K0IIIa",
      },
      {
        name: "Caph",
        bayer: "Beta Cassiopeiae",
        raDeg: 2.2945,
        decDeg: 59.1498,
        magnitudeV: 2.28,
        spectralClass: "F2III",
      },
      {
        name: "Navi",
        bayer: "Gamma Cassiopeiae",
        raDeg: 14.1772,
        decDeg: 60.7167,
        magnitudeV: 2.47,
        spectralClass: "B0.5IVe",
      },
      {
        name: "Ruchbah",
        bayer: "Delta Cassiopeiae",
        raDeg: 21.454,
        decDeg: 60.2353,
        magnitudeV: 2.68,
        spectralClass: "A5III-IV",
      },
      {
        name: "Segin",
        bayer: "Epsilon Cassiopeiae",
        raDeg: 26.0461,
        decDeg: 63.6701,
        magnitudeV: 3.35,
        spectralClass: "B3V",
      },
    ],
    lore: "In Greek mythology, Queen Cassiopeia's boast that she and Andromeda were more beautiful than the Nereids brought the sea monster Cetus upon Ethiopia.",
    summary:
      "A prominent circumpolar northern constellation famed for its bright 'W' (or 'M') asterism, located directly opposite the Big Dipper across Polaris.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-CAS",
      confidenceScore: 1.0,
      citationUrl: "https://www.iau.org/public/themes/constellations/#cas",
    },
  },

  // ==========================================
  // 4. CANIS MAJOR (The Greater Dog)
  // ==========================================
  {
    id: "const-cma",
    slug: "canis-major",
    name: "Canis Major",
    iauCode: "CMA",
    genitive: "Canis Majoris",
    family: "ORION_FAMILY",
    areaSquareDegrees: 380.12,
    quadrant: "SQ2",
    centerCoordinates: { raDeg: 105.0, decDeg: -22.0 },
    brightestStar: {
      name: "Sirius",
      designation: "Alpha Canis Majoris",
      magnitudeV: -1.46,
      raDeg: 101.2872,
      decDeg: -16.7161,
    },
    asterismLines: [
      {
        startStar: "Sirius (Alpha CMa)",
        endStar: "Mirzam (Beta CMa)",
        startCoords: { raDeg: 101.2872, decDeg: -16.7161 },
        endCoords: { raDeg: 95.6749, decDeg: -17.9559 },
      },
      {
        startStar: "Sirius (Alpha CMa)",
        endStar: "Muliphein (Gamma CMa)",
        startCoords: { raDeg: 101.2872, decDeg: -16.7161 },
        endCoords: { raDeg: 106.0152, decDeg: -15.6331 },
      },
      {
        startStar: "Sirius (Alpha CMa)",
        endStar: "Wezen (Delta CMa)",
        startCoords: { raDeg: 101.2872, decDeg: -16.7161 },
        endCoords: { raDeg: 107.0979, decDeg: -26.3932 },
      },
      {
        startStar: "Wezen (Delta CMa)",
        endStar: "Adhara (Epsilon CMa)",
        startCoords: { raDeg: 107.0979, decDeg: -26.3932 },
        endCoords: { raDeg: 104.6565, decDeg: -28.9721 },
      },
      {
        startStar: "Wezen (Delta CMa)",
        endStar: "Aludra (Eta CMa)",
        startCoords: { raDeg: 107.0979, decDeg: -26.3932 },
        endCoords: { raDeg: 111.0238, decDeg: -29.3031 },
      },
    ],
    majorStars: [
      {
        name: "Sirius",
        bayer: "Alpha Canis Majoris",
        raDeg: 101.2872,
        decDeg: -16.7161,
        magnitudeV: -1.46,
        spectralClass: "A0mA1Va",
      },
      {
        name: "Adhara",
        bayer: "Epsilon Canis Majoris",
        raDeg: 104.6565,
        decDeg: -28.9721,
        magnitudeV: 1.5,
        spectralClass: "B2II",
      },
      {
        name: "Wezen",
        bayer: "Delta Canis Majoris",
        raDeg: 107.0979,
        decDeg: -26.3932,
        magnitudeV: 1.83,
        spectralClass: "F8Ia",
      },
      {
        name: "Mirzam",
        bayer: "Beta Canis Majoris",
        raDeg: 95.6749,
        decDeg: -17.9559,
        magnitudeV: 1.98,
        spectralClass: "B1II-III",
      },
      {
        name: "Aludra",
        bayer: "Eta Canis Majoris",
        raDeg: 111.0238,
        decDeg: -29.3031,
        magnitudeV: 2.45,
        spectralClass: "B5Ia",
      },
    ],
    lore: "Canis Major is Orion's loyal hunting dog, following closely on the hunter's heels across the winter sky in pursuit of Lepus the Hare.",
    summary:
      "Southern constellation containing Sirius (the Dog Star), the intrinsically brilliant blue-white star that dominates the entire night sky in visual apparent magnitude.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-CMA",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 5. SCORPIUS (The Scorpion)
  // ==========================================
  {
    id: "const-sco",
    slug: "scorpius",
    name: "Scorpius",
    iauCode: "SCO",
    genitive: "Scorpii",
    family: "ZODIAC",
    areaSquareDegrees: 496.78,
    quadrant: "SQ3",
    centerCoordinates: { raDeg: 250.0, decDeg: -30.0 },
    brightestStar: {
      name: "Antares",
      designation: "Alpha Scorpii",
      magnitudeV: 1.06,
      raDeg: 247.3519,
      decDeg: -26.432,
    },
    asterismLines: [
      // Claws (Graffias -> Dschubba -> Pi Sco)
      {
        startStar: "Graffias (Beta Sco)",
        endStar: "Dschubba (Delta Sco)",
        startCoords: { raDeg: 241.3592, decDeg: -19.8054 },
        endCoords: { raDeg: 240.0833, decDeg: -22.6217 },
      },
      {
        startStar: "Dschubba (Delta Sco)",
        endStar: "Fang (Pi Sco)",
        startCoords: { raDeg: 240.0833, decDeg: -22.6217 },
        endCoords: { raDeg: 239.6978, decDeg: -26.1141 },
      },
      // Heart & Body (Dschubba -> Antares -> Wei)
      {
        startStar: "Dschubba (Delta Sco)",
        endStar: "Antares (Alpha Sco)",
        startCoords: { raDeg: 240.0833, decDeg: -22.6217 },
        endCoords: { raDeg: 247.3519, decDeg: -26.432 },
      },
      {
        startStar: "Antares (Alpha Sco)",
        endStar: "Wei (Epsilon Sco)",
        startCoords: { raDeg: 247.3519, decDeg: -26.432 },
        endCoords: { raDeg: 252.5414, decDeg: -34.2938 },
      },
      // Tail & Stinger (Wei -> Sargas -> Shaula -> Lesath)
      {
        startStar: "Wei (Epsilon Sco)",
        endStar: "Sargas (Theta Sco)",
        startCoords: { raDeg: 252.5414, decDeg: -34.2938 },
        endCoords: { raDeg: 264.3297, decDeg: -42.9978 },
      },
      {
        startStar: "Sargas (Theta Sco)",
        endStar: "Shaula (Lambda Sco)",
        startCoords: { raDeg: 264.3297, decDeg: -42.9978 },
        endCoords: { raDeg: 263.4022, decDeg: -37.1038 },
      },
      {
        startStar: "Shaula (Lambda Sco)",
        endStar: "Lesath (Upsilon Sco)",
        startCoords: { raDeg: 263.4022, decDeg: -37.1038 },
        endCoords: { raDeg: 262.6897, decDeg: -37.2957 },
      },
    ],
    majorStars: [
      {
        name: "Antares",
        bayer: "Alpha Scorpii",
        raDeg: 247.3519,
        decDeg: -26.432,
        magnitudeV: 1.06,
        spectralClass: "M1.5Iab-Ib",
      },
      {
        name: "Shaula",
        bayer: "Lambda Scorpii",
        raDeg: 263.4022,
        decDeg: -37.1038,
        magnitudeV: 1.62,
        spectralClass: "B2IV",
      },
      {
        name: "Sargas",
        bayer: "Theta Scorpii",
        raDeg: 264.3297,
        decDeg: -42.9978,
        magnitudeV: 1.86,
        spectralClass: "F1II",
      },
      {
        name: "Dschubba",
        bayer: "Delta Scorpii",
        raDeg: 240.0833,
        decDeg: -22.6217,
        magnitudeV: 2.29,
        spectralClass: "B0.3IV",
      },
      {
        name: "Wei",
        bayer: "Epsilon Scorpii",
        raDeg: 252.5414,
        decDeg: -34.2938,
        magnitudeV: 2.29,
        spectralClass: "K2.5IIIb",
      },
    ],
    lore: "In Greek mythology, Scorpius stung Orion to death. The gods placed them on opposite sides of the heavens so they never appear in the night sky at the same time.",
    summary:
      "Ancient zodiac constellation situated near the dense center of the Milky Way, distinguished by supergiant Antares (the 'Rival of Mars') and an iconic curving stinger tail.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-SCO",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 6. CYGNUS (The Swan / Northern Cross)
  // ==========================================
  {
    id: "const-cyg",
    slug: "cygnus",
    name: "Cygnus",
    iauCode: "CYG",
    genitive: "Cygni",
    family: "HERCULES_FAMILY",
    areaSquareDegrees: 803.98,
    quadrant: "NQ4",
    centerCoordinates: { raDeg: 310.0, decDeg: 42.0 },
    brightestStar: {
      name: "Deneb",
      designation: "Alpha Cygni",
      magnitudeV: 1.25,
      raDeg: 310.3579,
      decDeg: 45.2803,
    },
    asterismLines: [
      // Northern Cross (Deneb -> Sadr -> Albireo)
      {
        startStar: "Deneb (Alpha Cyg)",
        endStar: "Sadr (Gamma Cyg)",
        startCoords: { raDeg: 310.3579, decDeg: 45.2803 },
        endCoords: { raDeg: 305.5571, decDeg: 40.2567 },
      },
      {
        startStar: "Sadr (Gamma Cyg)",
        endStar: "Albireo (Beta Cyg)",
        startCoords: { raDeg: 305.5571, decDeg: 40.2567 },
        endCoords: { raDeg: 292.6803, decDeg: 27.9597 },
      },
      // Cross Wings (Gienah -> Sadr -> Fawaris)
      {
        startStar: "Gienah (Epsilon Cyg)",
        endStar: "Sadr (Gamma Cyg)",
        startCoords: { raDeg: 311.5528, decDeg: 33.9703 },
        endCoords: { raDeg: 305.5571, decDeg: 40.2567 },
      },
      {
        startStar: "Sadr (Gamma Cyg)",
        endStar: "Fawaris (Delta Cyg)",
        startCoords: { raDeg: 305.5571, decDeg: 40.2567 },
        endCoords: { raDeg: 296.2437, decDeg: 45.1303 },
      },
    ],
    majorStars: [
      {
        name: "Deneb",
        bayer: "Alpha Cygni",
        raDeg: 310.3579,
        decDeg: 45.2803,
        magnitudeV: 1.25,
        spectralClass: "A2Ia",
      },
      {
        name: "Sadr",
        bayer: "Gamma Cygni",
        raDeg: 305.5571,
        decDeg: 40.2567,
        magnitudeV: 2.23,
        spectralClass: "F8Ib",
      },
      {
        name: "Gienah",
        bayer: "Epsilon Cygni",
        raDeg: 311.5528,
        decDeg: 33.9703,
        magnitudeV: 2.48,
        spectralClass: "K0III",
      },
      {
        name: "Fawaris",
        bayer: "Delta Cygni",
        raDeg: 296.2437,
        decDeg: 45.1303,
        magnitudeV: 2.86,
        spectralClass: "B9.5IV",
      },
      {
        name: "Albireo",
        bayer: "Beta Cygni",
        raDeg: 292.6803,
        decDeg: 27.9597,
        magnitudeV: 3.05,
        spectralClass: "K3II+B9.5V",
      },
    ],
    lore: "In Greek myth, Zeus took the form of a swan to seduce Leda. Deneb forms one vertex of the prominent Summer Triangle asterism alongside Vega and Altair.",
    summary:
      "Prominent northern summer constellation flying along the dense Milky Way star clouds, containing the famous Northern Cross asterism and Cygnus X-1 black hole.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-CYG",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 7. CRUX (The Southern Cross)
  // ==========================================
  {
    id: "const-cru",
    slug: "crux",
    name: "Crux",
    iauCode: "CRU",
    genitive: "Crucis",
    family: "BAYER_GROUP",
    areaSquareDegrees: 68.45,
    quadrant: "SQ3",
    centerCoordinates: { raDeg: 186.0, decDeg: -60.0 },
    brightestStar: {
      name: "Acrux",
      designation: "Alpha Crucis",
      magnitudeV: 0.77,
      raDeg: 186.6496,
      decDeg: -63.0991,
    },
    asterismLines: [
      // Major Cross Axes (Acrux -> Gacrux and Mimosa -> Imai)
      {
        startStar: "Acrux (Alpha Cru)",
        endStar: "Gacrux (Gamma Cru)",
        startCoords: { raDeg: 186.6496, decDeg: -63.0991 },
        endCoords: { raDeg: 187.7915, decDeg: -57.1132 },
      },
      {
        startStar: "Mimosa (Beta Cru)",
        endStar: "Imai (Delta Cru)",
        startCoords: { raDeg: 191.9303, decDeg: -59.6888 },
        endCoords: { raDeg: 183.7917, decDeg: -58.7489 },
      },
    ],
    majorStars: [
      {
        name: "Acrux",
        bayer: "Alpha Crucis",
        raDeg: 186.6496,
        decDeg: -63.0991,
        magnitudeV: 0.77,
        spectralClass: "B0.5IV+B1V",
      },
      {
        name: "Mimosa",
        bayer: "Beta Crucis",
        raDeg: 191.9303,
        decDeg: -59.6888,
        magnitudeV: 1.25,
        spectralClass: "B0.5III",
      },
      {
        name: "Gacrux",
        bayer: "Gamma Crucis",
        raDeg: 187.7915,
        decDeg: -57.1132,
        magnitudeV: 1.64,
        spectralClass: "M3.5III",
      },
      {
        name: "Imai",
        bayer: "Delta Crucis",
        raDeg: 183.7917,
        decDeg: -58.7489,
        magnitudeV: 2.79,
        spectralClass: "B2IV",
      },
    ],
    lore: "Used for centuries by Polynesian, Aboriginal Australian, and European navigators to find the South Celestial Pole, featured on the flags of Australia, New Zealand, Brazil, and Samoa.",
    summary:
      "The smallest of all 88 constellations by area (68 sq deg), yet one of the most distinctive and culturally celebrated navigational anchors in the Southern Hemisphere.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-CRU",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 8. TAURUS (The Bull)
  // ==========================================
  {
    id: "const-tau",
    slug: "taurus",
    name: "Taurus",
    iauCode: "TAU",
    genitive: "Tauri",
    family: "ZODIAC",
    areaSquareDegrees: 797.25,
    quadrant: "NQ1",
    centerCoordinates: { raDeg: 65.0, decDeg: 18.0 },
    brightestStar: {
      name: "Aldebaran",
      designation: "Alpha Tauri",
      magnitudeV: 0.85,
      raDeg: 68.9802,
      decDeg: 16.5093,
    },
    asterismLines: [
      {
        startStar: "Aldebaran (Alpha Tau)",
        endStar: "Ain (Epsilon Tau)",
        startCoords: { raDeg: 68.9802, decDeg: 16.5093 },
        endCoords: { raDeg: 67.1472, decDeg: 19.1803 },
      },
      {
        startStar: "Aldebaran (Alpha Tau)",
        endStar: "Hyadum I (Gamma Tau)",
        startCoords: { raDeg: 68.9802, decDeg: 16.5093 },
        endCoords: { raDeg: 64.9547, decDeg: 15.6275 },
      },
      {
        startStar: "Ain (Epsilon Tau)",
        endStar: "Elnath (Beta Tau)",
        startCoords: { raDeg: 67.1472, decDeg: 19.1803 },
        endCoords: { raDeg: 81.573, decDeg: 28.6075 },
      },
      {
        startStar: "Aldebaran (Alpha Tau)",
        endStar: "Zeta Tauri",
        startCoords: { raDeg: 68.9802, decDeg: 16.5093 },
        endCoords: { raDeg: 84.4111, decDeg: 21.1425 },
      },
    ],
    majorStars: [
      {
        name: "Aldebaran",
        bayer: "Alpha Tauri",
        raDeg: 68.9802,
        decDeg: 16.5093,
        magnitudeV: 0.85,
        spectralClass: "K5III",
      },
      {
        name: "Elnath",
        bayer: "Beta Tauri",
        raDeg: 81.573,
        decDeg: 28.6075,
        magnitudeV: 1.65,
        spectralClass: "B7III",
      },
      {
        name: "Alcyone (Pleiades)",
        bayer: "Eta Tauri",
        raDeg: 56.8711,
        decDeg: 24.105,
        magnitudeV: 2.87,
        spectralClass: "B7IIIe",
      },
      {
        name: "Zeta Tauri",
        bayer: "Zeta Tauri",
        raDeg: 84.4111,
        decDeg: 21.1425,
        magnitudeV: 2.97,
        spectralClass: "B2IVe",
      },
    ],
    lore: "In Greek myth, Zeus disguised himself as a magnificent white bull to win Europa. Taurus hosts the Pleiades (Seven Sisters) and Hyades star clusters.",
    summary:
      "Ancient zodiac constellation marked by the fiery orange eye of Aldebaran, the V-shaped Hyades open cluster, and the luminous Pleiades cluster (M45).",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-TAU",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 9. LEO (The Lion)
  // ==========================================
  {
    id: "const-leo",
    slug: "leo",
    name: "Leo",
    iauCode: "LEO",
    genitive: "Leonis",
    family: "ZODIAC",
    areaSquareDegrees: 946.96,
    quadrant: "NQ2",
    centerCoordinates: { raDeg: 160.0, decDeg: 15.0 },
    brightestStar: {
      name: "Regulus",
      designation: "Alpha Leonis",
      magnitudeV: 1.36,
      raDeg: 152.0929,
      decDeg: 11.9672,
    },
    asterismLines: [
      // The Sickle (Regulus -> Eta Leo -> Algieba -> Adhafera -> Ras Elased)
      {
        startStar: "Regulus (Alpha Leo)",
        endStar: "Eta Leonis",
        startCoords: { raDeg: 152.0929, decDeg: 11.9672 },
        endCoords: { raDeg: 151.8329, decDeg: 16.7628 },
      },
      {
        startStar: "Eta Leonis",
        endStar: "Algieba (Gamma Leo)",
        startCoords: { raDeg: 151.8329, decDeg: 16.7628 },
        endCoords: { raDeg: 154.9928, decDeg: 19.8414 },
      },
      {
        startStar: "Algieba (Gamma Leo)",
        endStar: "Adhafera (Zeta Leo)",
        startCoords: { raDeg: 154.9928, decDeg: 19.8414 },
        endCoords: { raDeg: 154.1725, decDeg: 23.4172 },
      },
      // Body & Tail (Algieba -> Zosma -> Denebola -> Chertan -> Regulus)
      {
        startStar: "Algieba (Gamma Leo)",
        endStar: "Zosma (Delta Leo)",
        startCoords: { raDeg: 154.9928, decDeg: 19.8414 },
        endCoords: { raDeg: 168.5268, decDeg: 20.5239 },
      },
      {
        startStar: "Zosma (Delta Leo)",
        endStar: "Denebola (Beta Leo)",
        startCoords: { raDeg: 168.5268, decDeg: 20.5239 },
        endCoords: { raDeg: 177.2649, decDeg: 14.5721 },
      },
      {
        startStar: "Denebola (Beta Leo)",
        endStar: "Chertan (Theta Leo)",
        startCoords: { raDeg: 177.2649, decDeg: 14.5721 },
        endCoords: { raDeg: 168.5599, decDeg: 15.4294 },
      },
      {
        startStar: "Chertan (Theta Leo)",
        endStar: "Regulus (Alpha Leo)",
        startCoords: { raDeg: 168.5599, decDeg: 15.4294 },
        endCoords: { raDeg: 152.0929, decDeg: 11.9672 },
      },
    ],
    majorStars: [
      {
        name: "Regulus",
        bayer: "Alpha Leonis",
        raDeg: 152.0929,
        decDeg: 11.9672,
        magnitudeV: 1.36,
        spectralClass: "B7V",
      },
      {
        name: "Denebola",
        bayer: "Beta Leonis",
        raDeg: 177.2649,
        decDeg: 14.5721,
        magnitudeV: 2.14,
        spectralClass: "A3V",
      },
      {
        name: "Algieba",
        bayer: "Gamma Leonis",
        raDeg: 154.9928,
        decDeg: 19.8414,
        magnitudeV: 2.01,
        spectralClass: "K0III+G7III",
      },
      {
        name: "Zosma",
        bayer: "Delta Leonis",
        raDeg: 168.5268,
        decDeg: 20.5239,
        magnitudeV: 2.56,
        spectralClass: "A4V",
      },
    ],
    lore: "Associated with the fierce Nemean Lion slain by Hercules as the first of his Twelve Labors.",
    summary:
      "Spring zodiac constellation featuring the backwards question mark 'Sickle' asterism and blue-white quadruple star Regulus (Cor Leonis).",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-LEO",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 10. PEGASUS (The Winged Horse)
  // ==========================================
  {
    id: "const-peg",
    slug: "pegasus",
    name: "Pegasus",
    iauCode: "PEG",
    genitive: "Pegasi",
    family: "PERSEUS_FAMILY",
    areaSquareDegrees: 1120.79,
    quadrant: "NQ4",
    centerCoordinates: { raDeg: 340.0, decDeg: 20.0 },
    brightestStar: {
      name: "Enif",
      designation: "Epsilon Pegasi",
      magnitudeV: 2.38,
      raDeg: 326.0465,
      decDeg: 9.875,
    },
    asterismLines: [
      // Great Square of Pegasus (Markab -> Scheat -> Alpheratz [And] -> Algenib -> Markab)
      {
        startStar: "Markab (Alpha Peg)",
        endStar: "Scheat (Beta Peg)",
        startCoords: { raDeg: 346.1903, decDeg: 15.2053 },
        endCoords: { raDeg: 345.9436, decDeg: 28.0828 },
      },
      {
        startStar: "Scheat (Beta Peg)",
        endStar: "Alpheratz (Alpha And)",
        startCoords: { raDeg: 345.9436, decDeg: 28.0828 },
        endCoords: { raDeg: 2.0969, decDeg: 29.0904 },
      },
      {
        startStar: "Alpheratz (Alpha And)",
        endStar: "Algenib (Gamma Peg)",
        startCoords: { raDeg: 2.0969, decDeg: 29.0904 },
        endCoords: { raDeg: 3.309, decDeg: 15.1836 },
      },
      {
        startStar: "Algenib (Gamma Peg)",
        endStar: "Markab (Alpha Peg)",
        startCoords: { raDeg: 3.309, decDeg: 15.1836 },
        endCoords: { raDeg: 346.1903, decDeg: 15.2053 },
      },
      // Neck to Nose (Markab -> Homam -> Baham -> Enif)
      {
        startStar: "Markab (Alpha Peg)",
        endStar: "Homam (Zeta Peg)",
        startCoords: { raDeg: 346.1903, decDeg: 15.2053 },
        endCoords: { raDeg: 340.3275, decDeg: 10.8317 },
      },
      {
        startStar: "Homam (Zeta Peg)",
        endStar: "Enif (Epsilon Peg)",
        startCoords: { raDeg: 340.3275, decDeg: 10.8317 },
        endCoords: { raDeg: 326.0465, decDeg: 9.875 },
      },
    ],
    majorStars: [
      {
        name: "Enif",
        bayer: "Epsilon Pegasi",
        raDeg: 326.0465,
        decDeg: 9.875,
        magnitudeV: 2.38,
        spectralClass: "K2Ib",
      },
      {
        name: "Scheat",
        bayer: "Beta Pegasi",
        raDeg: 345.9436,
        decDeg: 28.0828,
        magnitudeV: 2.44,
        spectralClass: "M2.5II-IIIe",
      },
      {
        name: "Markab",
        bayer: "Alpha Pegasi",
        raDeg: 346.1903,
        decDeg: 15.2053,
        magnitudeV: 2.49,
        spectralClass: "B9III",
      },
      {
        name: "Algenib",
        bayer: "Gamma Pegasi",
        raDeg: 3.309,
        decDeg: 15.1836,
        magnitudeV: 2.84,
        spectralClass: "B2IV",
      },
    ],
    lore: "In Greek mythology, Pegasus was the winged horse sired by Poseidon that sprang from Medusa's neck when Perseus defeated her.",
    summary:
      "Large northern autumn constellation famous for the Great Square of Pegasus asterism and 51 Pegasi (the first Sun-like star discovered to host a hot Jupiter exoplanet).",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-PEG",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 11. LYRA (The Lyre)
  // ==========================================
  {
    id: "const-lyr",
    slug: "lyra",
    name: "Lyra",
    iauCode: "LYR",
    genitive: "Lyrae",
    family: "HERCULES_FAMILY",
    areaSquareDegrees: 286.48,
    quadrant: "NQ4",
    centerCoordinates: { raDeg: 283.0, decDeg: 36.0 },
    brightestStar: {
      name: "Vega",
      designation: "Alpha Lyrae",
      magnitudeV: 0.03,
      raDeg: 279.2347,
      decDeg: 38.7837,
    },
    asterismLines: [
      {
        startStar: "Vega (Alpha Lyr)",
        endStar: "Sheliak (Beta Lyr)",
        startCoords: { raDeg: 279.2347, decDeg: 38.7837 },
        endCoords: { raDeg: 282.5197, decDeg: 33.3627 },
      },
      {
        startStar: "Sheliak (Beta Lyr)",
        endStar: "Sulafat (Gamma Lyr)",
        startCoords: { raDeg: 282.5197, decDeg: 33.3627 },
        endCoords: { raDeg: 283.6067, decDeg: 32.6903 },
      },
      {
        startStar: "Sulafat (Gamma Lyr)",
        endStar: "Delta2 Lyrae",
        startCoords: { raDeg: 283.6067, decDeg: 32.6903 },
        endCoords: { raDeg: 283.6558, decDeg: 36.9025 },
      },
      {
        startStar: "Delta2 Lyrae",
        endStar: "Zeta1 Lyrae",
        startCoords: { raDeg: 283.6558, decDeg: 36.9025 },
        endCoords: { raDeg: 281.3321, decDeg: 37.6047 },
      },
      {
        startStar: "Zeta1 Lyrae",
        endStar: "Vega (Alpha Lyr)",
        startCoords: { raDeg: 281.3321, decDeg: 37.6047 },
        endCoords: { raDeg: 279.2347, decDeg: 38.7837 },
      },
    ],
    majorStars: [
      {
        name: "Vega",
        bayer: "Alpha Lyrae",
        raDeg: 279.2347,
        decDeg: 38.7837,
        magnitudeV: 0.03,
        spectralClass: "A0Va",
      },
      {
        name: "Sulafat",
        bayer: "Gamma Lyrae",
        raDeg: 283.6067,
        decDeg: 32.6903,
        magnitudeV: 3.25,
        spectralClass: "B9III",
      },
      {
        name: "Sheliak",
        bayer: "Beta Lyrae",
        raDeg: 282.5197,
        decDeg: 33.3627,
        magnitudeV: 3.52,
        spectralClass: "B7Ve",
      },
    ],
    lore: "Represents the enchanted celestial lyre crafted by Hermes and given to Orpheus, whose music could charm beasts, trees, and stones.",
    summary:
      "Compact northern constellation anchored by brilliant zero-magnitude Vega, the Ring Nebula (M57), and the famous 'Double Double' quadruple star Epsilon Lyrae.",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-LYR",
      confidenceScore: 1.0,
    },
  },

  // ==========================================
  // 12. CENTAURUS (The Centaur)
  // ==========================================
  {
    id: "const-cen",
    slug: "centaurus",
    name: "Centaurus",
    iauCode: "CEN",
    genitive: "Centauri",
    family: "HERCULES_FAMILY",
    areaSquareDegrees: 1060.42,
    quadrant: "SQ3",
    centerCoordinates: { raDeg: 200.0, decDeg: -50.0 },
    brightestStar: {
      name: "Alpha Centauri",
      designation: "Alpha Centauri A",
      magnitudeV: -0.01,
      raDeg: 219.9021,
      decDeg: -60.834,
    },
    asterismLines: [
      {
        startStar: "Alpha Centauri",
        endStar: "Hadar (Beta Cen)",
        startCoords: { raDeg: 219.9021, decDeg: -60.834 },
        endCoords: { raDeg: 210.9563, decDeg: -60.373 },
      },
      {
        startStar: "Hadar (Beta Cen)",
        endStar: "Menkent (Theta Cen)",
        startCoords: { raDeg: 210.9563, decDeg: -60.373 },
        endCoords: { raDeg: 211.6669, decDeg: -36.3697 },
      },
      {
        startStar: "Hadar (Beta Cen)",
        endStar: "Muhlifain (Gamma Cen)",
        startCoords: { raDeg: 210.9563, decDeg: -60.373 },
        endCoords: { raDeg: 191.5283, decDeg: -48.9606 },
      },
    ],
    majorStars: [
      {
        name: "Alpha Centauri A",
        bayer: "Alpha Centauri A",
        raDeg: 219.9021,
        decDeg: -60.834,
        magnitudeV: -0.01,
        spectralClass: "G2V",
      },
      {
        name: "Hadar",
        bayer: "Beta Centauri",
        raDeg: 210.9563,
        decDeg: -60.373,
        magnitudeV: 0.61,
        spectralClass: "B1III",
      },
      {
        name: "Menkent",
        bayer: "Theta Centauri",
        raDeg: 211.6669,
        decDeg: -36.3697,
        magnitudeV: 2.06,
        spectralClass: "K0IIIb",
      },
      {
        name: "Muhlifain",
        bayer: "Gamma Centauri",
        raDeg: 191.5283,
        decDeg: -48.9606,
        magnitudeV: 2.2,
        spectralClass: "A1IV",
      },
    ],
    lore: "Represents Chiron, the wisest and most just of all centaurs, mentor to Achilles, Hercules, and Asclepius.",
    summary:
      "Vast southern constellation harboring our closest stellar neighbor system Alpha Centauri (4.25–4.37 ly), radio galaxy Centaurus A (NGC 5128), and globular cluster Omega Centauri (NGC 5139).",
    provenance: {
      catalogName: "IAU Official Constellation Boundary Registry",
      authoritativeBody: "IAU",
      recordIdentifier: "IAU-CONST-CEN",
      confidenceScore: 1.0,
    },
  },
];
