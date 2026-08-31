import * as THREE from "three";
import { Galaxy } from "@/domain/galaxy/types";

export interface GalaxyVisualParams {
  scaleMultiplier?: number;
  particleDensity?: number;
  showOrientationAxes?: boolean;
}

/**
 * Procedural Deterministic Galaxy Geometry Renderer.
 * Generates Three.js Groups matching astronomical morphology, inclination, and position angles.
 */
export class GalaxyRenderer {
  /**
   * Deterministic pseudo-random number generator from seed.
   */
  private static seededRandom(seed: number): () => number {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  /**
   * Builds a complete 3D Galaxy Node for Three.js.
   */
  public static createGalaxyNode(galaxy: Galaxy, params: GalaxyVisualParams = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = `galaxy-node-${galaxy.slug}`;
    group.userData = { galaxy, slug: galaxy.slug, isGalaxy: true };

    const scaleMult = params.scaleMultiplier ?? 1.0;
    // Map physical diameter (kpc) to visual scene radius (visual scale: 1 kpc diameter -> ~0.08 scene units)
    const baseVisualRadius =
      Math.max(1.5, Math.min(18.0, Math.log10(galaxy.physical.diameterKpc.value + 1) * 6.0)) *
      scaleMult;

    const seed = galaxy.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 100);
    const rng = this.seededRandom(seed);

    // 1. Central Bulge / Nucleus Glow
    const bulgeRadius = baseVisualRadius * 0.25;
    const bulgeGeo = new THREE.SphereGeometry(bulgeRadius, 16, 16);
    const bulgeColor =
      galaxy.morphology.class === "ELLIPTICAL" || galaxy.morphology.class === "DWARF_ELLIPTICAL"
        ? 0xffddaa
        : galaxy.morphology.class === "IRREGULAR" || galaxy.morphology.class === "DWARF_IRREGULAR"
          ? 0xaaddff
          : 0xfff0cc;

    const bulgeMat = new THREE.MeshBasicMaterial({
      color: bulgeColor,
      transparent: true,
      opacity: 0.85,
    });
    const bulgeMesh = new THREE.Mesh(bulgeGeo, bulgeMat);
    group.add(bulgeMesh);

    // 2. Morphology-Specific Stellar Distribution
    switch (galaxy.morphology.class) {
      case "BARRED_SPIRAL":
      case "SPIRAL": {
        const isBarred = galaxy.morphology.class === "BARRED_SPIRAL";
        const diskParticles = this.createSpiralDisk(baseVisualRadius, isBarred, rng);
        group.add(diskParticles);
        break;
      }
      case "ELLIPTICAL":
      case "DWARF_ELLIPTICAL":
      case "DWARF_SPHEROIDAL": {
        const spheroid = this.createSpheroid(baseVisualRadius, galaxy.orientation.axisRatio, rng);
        group.add(spheroid);
        break;
      }
      case "IRREGULAR":
      case "DWARF_IRREGULAR":
      default: {
        const irregularCloud = this.createIrregularCloud(baseVisualRadius, rng);
        group.add(irregularCloud);
        break;
      }
    }

    // 3. Apply Astronomical Orientation (Inclination and Position Angle)
    // Inclination: tilt around local X axis
    const incRad = (galaxy.orientation.inclinationDeg * Math.PI) / 180.0;
    // Position Angle: rotation around local Z axis
    const paRad = (galaxy.orientation.positionAngleDeg * Math.PI) / 180.0;

    group.rotation.x = incRad;
    group.rotation.z = paRad;

    return group;
  }

  /**
   * Procedural Spiral Disk Particle System with logarithmic spiral arms and optional bar.
   */
  private static createSpiralDisk(
    radius: number,
    isBarred: boolean,
    rng: () => number
  ): THREE.Points {
    const particleCount = isBarred ? 1200 : 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const numArms = 2;
    const pitchAngleRad = (13.0 * Math.PI) / 180.0;
    const b = Math.tan(pitchAngleRad);

    for (let i = 0; i < particleCount; i++) {
      let x = 0;
      let y = 0;
      let z = 0;
      let rRatio = 0;

      if (isBarred && i < particleCount * 0.25) {
        // Central Bar points
        const barLength = radius * 0.45;
        const barX = (rng() - 0.5) * 2 * barLength;
        const barY = (rng() - 0.5) * (barLength * 0.22);
        x = barX;
        y = barY;
        z = (rng() - 0.5) * (radius * 0.08);
        rRatio = Math.sqrt(x * x + y * y) / radius;
      } else {
        // Logarithmic Spiral Arms
        const armIndex = i % numArms;
        const theta0 = (armIndex * 2 * Math.PI) / numArms;
        const theta = rng() * 3.5 * Math.PI;
        const r = radius * 0.2 + radius * 0.8 * Math.pow(theta / (3.5 * Math.PI), 0.7);

        // Scatter around arm
        const scatter = (rng() - 0.5) * (radius * 0.18);
        const totalTheta = theta0 + (1 / b) * Math.log(r / (radius * 0.2) + 0.1);

        x = r * Math.cos(totalTheta) + scatter;
        y = r * Math.sin(totalTheta) + scatter;
        z = (rng() - 0.5) * (radius * 0.09) * Math.exp(-r / radius);
        rRatio = r / radius;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient: Warm yellow/orange in center, blue/cyan in outer star-forming spiral arms
      const rColor = THREE.MathUtils.lerp(1.0, 0.4, rRatio);
      const gColor = THREE.MathUtils.lerp(0.9, 0.7, rRatio);
      const bColor = THREE.MathUtils.lerp(0.6, 1.0, rRatio);

      colors[i * 3] = rColor;
      colors[i * 3 + 1] = gColor;
      colors[i * 3 + 2] = bColor;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  /**
   * Procedural Spheroid Particle System for Elliptical / Spheroidal galaxies.
   */
  private static createSpheroid(
    radius: number,
    axisRatio: number,
    rng: () => number
  ): THREE.Points {
    const particleCount = 700;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = rng();
      const v = rng();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * Math.pow(rng(), 1.5);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * axisRatio;
      positions[i * 3 + 2] = r * Math.cos(phi) * axisRatio;

      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.65;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  /**
   * Procedural Irregular Particle Cloud for Irregular / Magellanic galaxies.
   */
  private static createIrregularCloud(radius: number, rng: () => number): THREE.Points {
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // 3 Clumpy centers
      const clusterIdx = Math.floor(rng() * 3);
      const clusterOffset = [
        { x: -radius * 0.2, y: radius * 0.1 },
        { x: radius * 0.15, y: -radius * 0.1 },
        { x: radius * 0.05, y: radius * 0.25 },
      ][clusterIdx];

      const r = rng() * radius * 0.45;
      const angle = rng() * 2 * Math.PI;

      positions[i * 3] = clusterOffset.x + r * Math.cos(angle);
      positions[i * 3 + 1] = clusterOffset.y + r * Math.sin(angle);
      positions[i * 3 + 2] = (rng() - 0.5) * (radius * 0.2);

      // Irregular galaxies have hot young OB stars and H II regions (cyan / blue / pink)
      if (rng() > 0.8) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.4;
        colors[i * 3 + 2] = 0.8;
      } else {
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }
}
