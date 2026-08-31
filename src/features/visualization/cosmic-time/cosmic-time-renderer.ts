import * as THREE from "three";
import { CosmicEpoch, CosmicEpochType } from "@/domain/cosmic-time/types";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";

export interface LightConeObjectMarker {
  id: string;
  name: string;
  slug: string;
  raDeg: number;
  decDeg: number;
  redshiftZ: number;
  lookbackGyr: number;
  epochType: CosmicEpochType;
  type: string;
}

/**
 * Color palette for cosmic epoch visualization
 */
export const EPOCH_COLOR_MAP: Record<
  CosmicEpochType,
  { primary: number; glow: string; hex: string }
> = {
  PLANCK_EPOCH: { primary: 0xffffff, glow: "rgba(255,255,255,0.8)", hex: "#ffffff" },
  INFLATION: { primary: 0xe0e7ff, glow: "rgba(224,231,255,0.8)", hex: "#e0e7ff" },
  ELECTROWEAK_EPOCH: { primary: 0xc084fc, glow: "rgba(192,132,252,0.7)", hex: "#c084fc" },
  QUARK_EPOCH: { primary: 0xf43f5e, glow: "rgba(244,63,94,0.7)", hex: "#f43f5e" },
  HADRON_EPOCH: { primary: 0xf97316, glow: "rgba(249,115,22,0.7)", hex: "#f97316" },
  LEPTON_EPOCH: { primary: 0xfbbf24, glow: "rgba(251,191,36,0.7)", hex: "#fbbf24" },
  NUCLEOSYNTHESIS: { primary: 0xfacc15, glow: "rgba(250,204,21,0.7)", hex: "#facc15" },
  RECOMBINATION: { primary: 0xff6b00, glow: "rgba(255,107,0,0.8)", hex: "#ff6b00" },
  DARK_AGES: { primary: 0x1e1b4b, glow: "rgba(30,27,75,0.4)", hex: "#1e1b4b" },
  FIRST_STARS: { primary: 0x38bdf8, glow: "rgba(56,189,248,0.8)", hex: "#38bdf8" },
  REIONIZATION: { primary: 0x06b6d4, glow: "rgba(6,182,212,0.8)", hex: "#06b6d4" },
  EARLY_GALAXIES: { primary: 0x10b981, glow: "rgba(16,185,129,0.8)", hex: "#10b981" },
  GALAXY_ASSEMBLY: { primary: 0x8b5cf6, glow: "rgba(139,92,246,0.8)", hex: "#8b5cf6" },
  MODERN_UNIVERSE: { primary: 0x22d3ee, glow: "rgba(34,211,238,0.9)", hex: "#22d3ee" },
};

/**
 * Maps Lookback Time (in Gyr) to Light Cone Z position and radial flare radius
 * Observer is at apex (0, 0, 0) [t = 0 Gyr, z = 0]
 * Early universe flaring out along negative Y axis (or along Z axis)
 */
export function lookbackTimeToLightConePos(
  lookbackGyr: number,
  raDeg: number,
  decDeg: number
): THREE.Vector3 {
  const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
  const clampedLookback = Math.max(0, Math.min(universeAgeGyr, lookbackGyr));

  // Distance along time-axis (Y axis points from past to present)
  // Height scale: 13.8 Gyr maps to height of ~350 units
  const heightUnits = (clampedLookback / universeAgeGyr) * 350.0;
  const y = -heightUnits;

  // Transverse comoving radius flaring outward into the past
  // Using comoving expansion geometry
  const radius = Math.pow(clampedLookback / universeAgeGyr, 0.75) * 160.0 + 2.0;

  // Convert RA / Dec to polar angle in horizontal X-Z plane
  const raRad = (raDeg * Math.PI) / 180.0;
  const decRad = (decDeg * Math.PI) / 180.0;

  const cosDec = Math.cos(decRad);
  const x = radius * cosDec * Math.cos(raRad);
  const z = radius * cosDec * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

/**
 * Generates the 3D Past Light-Cone Wireframe & Translucent Hull Mesh
 */
export function createPastLightConeGroup(epochs: CosmicEpoch[]): THREE.Group {
  const group = new THREE.Group();
  group.name = "PastLightConeGroup";

  // 1. Conical Spacetime Shell
  const height = 350;
  const bottomRadius = 162;
  const segments = 64;
  const heightSegments = 32;

  const geometry = new THREE.CylinderGeometry(
    1.0, // Top radius (Apex at observer)
    bottomRadius, // Base radius (CMB surface at z ~ 1100)
    height,
    segments,
    heightSegments,
    true // Open ended
  );

  // Offset geometry so apex is at origin (0,0,0) and base extends down to -height
  geometry.translate(0, -height / 2, 0);

  const material = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });

  const coneMesh = new THREE.Mesh(geometry, material);
  group.add(coneMesh);

  // 2. Translucent Inner Skin
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x0f172a,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
  });
  const innerMesh = new THREE.Mesh(geometry.clone(), innerMat);
  group.add(innerMesh);

  // 3. Spacetime Lookback-Time Rings (1, 3, 5, 8, 10, 12, 13.5 Gyr)
  const lookbackMilestonesGyr = [1, 3, 5, 8, 10, 12, 13.5];
  lookbackMilestonesGyr.forEach((gyr) => {
    const yPos = -(gyr / 13.8) * 350.0;
    const ringRadius = Math.pow(gyr / 13.8, 0.75) * 160.0 + 2.0;

    const ringGeo = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(theta) * ringRadius, yPos, Math.sin(theta) * ringRadius)
      );
    }
    ringGeo.setFromPoints(points);

    const ringMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    const ringLine = new THREE.Line(ringGeo, ringMat);
    ringLine.userData = { label: `${gyr} Gyr Lookback`, lookbackGyr: gyr };
    group.add(ringLine);
  });

  // 4. CMB Recombination Cap / Decoupling Surface at Base
  const cmbGeo = new THREE.CircleGeometry(bottomRadius, 64);
  cmbGeo.rotateX(-Math.PI / 2);
  cmbGeo.translate(0, -height, 0);

  const cmbMat = new THREE.MeshBasicMaterial({
    color: 0xff6b00,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });
  const cmbMesh = new THREE.Mesh(cmbGeo, cmbMat);
  cmbMesh.userData = { name: "CMB Decoupling Surface (z = 1089)" };
  group.add(cmbMesh);

  // 5. Epoch Boundary Rings
  epochs.forEach((epoch) => {
    const avgLookback =
      (epoch.lookbackTimeRangeGyr.minGyr + epoch.lookbackTimeRangeGyr.maxGyr) / 2.0;
    const yPos = -(avgLookback / 13.8) * 350.0;
    const radius = Math.pow(avgLookback / 13.8, 0.75) * 160.0 + 2.0;

    const ringGeo = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const theta = (i / 48) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, yPos, Math.sin(theta) * radius));
    }
    ringGeo.setFromPoints(points);

    const colorConfig = EPOCH_COLOR_MAP[epoch.type] || { primary: 0x06b6d4 };
    const epochLine = new THREE.Line(
      ringGeo,
      new THREE.LineDashedMaterial({
        color: colorConfig.primary,
        dashSize: 3,
        gapSize: 2,
        transparent: true,
        opacity: 0.5,
      })
    );
    epochLine.computeLineDistances();
    epochLine.userData = { epochSlug: epoch.slug, epochName: epoch.name };
    group.add(epochLine);
  });

  // 6. Observer "Present Day" Origin Beacon at (0, 0, 0)
  const beaconGroup = new THREE.Group();
  const coreMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee })
  );
  beaconGroup.add(coreMesh);

  const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4.0, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.35 })
  );
  beaconGroup.add(glowMesh);
  beaconGroup.userData = { name: "Observer / Present Universe (z = 0, Today)" };
  group.add(beaconGroup);

  return group;
}

/**
 * Creates 3D Object Nodes plotted on the Spacetime Light Cone
 */
export function createLightConeObjectMarkersGroup(
  markers: LightConeObjectMarker[],
  selectedId?: string
): THREE.Group {
  const group = new THREE.Group();
  group.name = "LightConeObjectMarkersGroup";

  markers.forEach((m) => {
    const pos = lookbackTimeToLightConePos(m.lookbackGyr, m.raDeg, m.decDeg);
    const colorConfig = EPOCH_COLOR_MAP[m.epochType] || { primary: 0x38bdf8 };
    const isSelected = selectedId === m.id || selectedId === m.slug;

    const markerGroup = new THREE.Group();
    markerGroup.position.copy(pos);

    // Marker sphere
    const sphereRadius = isSelected ? 2.5 : 1.5;
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(sphereRadius, 12, 12),
      new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : colorConfig.primary,
      })
    );
    markerGroup.add(sphere);

    // Selection ring
    if (isSelected) {
      const ringGeo = new THREE.RingGeometry(3.2, 3.8, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMesh = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, side: THREE.DoubleSide })
      );
      markerGroup.add(ringMesh);
    }

    // Line from time-axis center to object position
    const centerPoint = new THREE.Vector3(0, pos.y, 0);
    const lineGeo = new THREE.BufferGeometry().setFromPoints([centerPoint, pos]);
    const lineMesh = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: colorConfig.primary,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.2,
      })
    );
    group.add(lineMesh);

    markerGroup.userData = {
      id: m.id,
      slug: m.slug,
      name: m.name,
      redshiftZ: m.redshiftZ,
      lookbackGyr: m.lookbackGyr,
      epochType: m.epochType,
      type: m.type,
    };

    group.add(markerGroup);
  });

  return group;
}
