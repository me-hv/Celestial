import * as THREE from "three";
import { RedshiftShell, ObservationalLandmark } from "@/domain/observable-universe/types";

/**
 * Maps cosmological comoving distance (in Mpc) to 3D scene units using calibrated piecewise log scaling.
 * Total visual radius is ~250 scene units for the Particle Horizon (14,250 Mpc).
 */
export function comovingMpcToSceneRadius(distanceMpc: number): number {
  if (distanceMpc <= 0) return 0;

  // Calibrated smooth logarithmic scaling: R = 35 * ln(1 + 0.05 * D_Mpc)
  const sceneRadius = 38.0 * Math.log(1.0 + 0.05 * distanceMpc);
  return Math.min(260.0, sceneRadius);
}

/**
 * Converts Right Ascension (deg), Declination (deg), and Comoving Distance (Mpc) to 3D Scene Vector.
 */
export function equatorialToObservableSceneVector(
  raDeg: number = 0,
  decDeg: number = 0,
  distanceMpc: number = 0
): THREE.Vector3 {
  const r = comovingMpcToSceneRadius(distanceMpc);
  const raRad = (raDeg * Math.PI) / 180.0;
  const decRad = (decDeg * Math.PI) / 180.0;

  // ICRS convention: X = r*cos(dec)*cos(ra), Y = r*sin(dec), Z = -r*cos(dec)*sin(ra)
  const x = r * Math.cos(decRad) * Math.cos(raRad);
  const y = r * Math.sin(decRad);
  const z = -r * Math.cos(decRad) * Math.sin(raRad);

  return new THREE.Vector3(x, y, z);
}

/**
 * Creates the "You Are Here" center observer marker at Earth origin (0, 0, 0).
 */
export function createObserverOriginMarker(): THREE.Group {
  const group = new THREE.Group();
  group.name = "observer-origin";

  // Central glowing core
  const coreGeo = new THREE.SphereGeometry(1.2, 16, 16);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.95,
  });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // Outer pulsating halo ring
  const ringGeo = new THREE.RingGeometry(2.0, 2.4, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  group.add(ringMesh);

  return group;
}

/**
 * Creates nested 3D Redshift Distance Shells with equatorial & meridian rings.
 */
export function createRedshiftShellsGroup(shells: RedshiftShell[]): THREE.Group {
  const group = new THREE.Group();
  group.name = "redshift-shells-group";

  shells.forEach((shell) => {
    const shellRadius = comovingMpcToSceneRadius(shell.maxComovingDistanceMpc);
    if (shellRadius <= 0) return;

    const shellColor = new THREE.Color(shell.colorHex);

    // 1. Equatorial Plane Ring
    const eqCurve = new THREE.EllipseCurve(
      0,
      0,
      shellRadius,
      shellRadius,
      0,
      2 * Math.PI,
      false,
      0
    );
    const eqPoints = eqCurve.getPoints(96);
    const eqGeo = new THREE.BufferGeometry().setFromPoints(
      eqPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
    const eqMat = new THREE.LineBasicMaterial({
      color: shellColor,
      transparent: true,
      opacity: 0.35,
    });
    group.add(new THREE.LineLoop(eqGeo, eqMat));

    // 2. Meridian Ring (XZ plane)
    const merGeo = new THREE.BufferGeometry().setFromPoints(
      eqPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const merMat = new THREE.LineBasicMaterial({
      color: shellColor,
      transparent: true,
      opacity: 0.2,
    });
    group.add(new THREE.LineLoop(merGeo, merMat));

    // 3. Translucent Sphere Shell for major horizons
    if (shell.type === "CMB_LAST_SCATTERING" || shell.type === "HIGH_REDSHIFT_UNIVERSE") {
      const sphereGeo = new THREE.SphereGeometry(shellRadius, 32, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: shellColor,
        transparent: true,
        opacity: 0.03,
        wireframe: true,
      });
      group.add(new THREE.Mesh(sphereGeo, sphereMat));
    }
  });

  return group;
}

/**
 * Generates an illustrative procedural CMB Temperature Anisotropy Canvas Texture
 * with cold spots (blue), average (green/yellow), and hot spots (red/orange).
 */
export function generateProceduralCMBTexture(
  includeGalacticMask: boolean = false,
  width: number = 512,
  height: number = 256
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Multi-frequency noise synthesis simulating spherical acoustic multipoles
    for (let y = 0; y < height; y++) {
      const lat = (y / height) * Math.PI - Math.PI / 2; // -pi/2 to pi/2
      const isGalacticEquator = Math.abs(lat) < 0.12 && includeGalacticMask;

      for (let x = 0; x < width; x++) {
        const lon = (x / width) * 2 * Math.PI; // 0 to 2pi
        const index = (y * width + x) * 4;

        if (isGalacticEquator) {
          // Grayed out foreground mask
          data[index] = 40;
          data[index + 1] = 45;
          data[index + 2] = 55;
          data[index + 3] = 220;
          continue;
        }

        // Multipole simulation: low-l dipole + high-l acoustic peaks
        const dipole = Math.sin(lon) * Math.cos(lat) * 0.4;
        const octupole = Math.sin(lon * 4 + 1.2) * Math.sin(lat * 4) * 0.25;
        const acoustic1 = Math.sin(lon * 12 + 0.8) * Math.cos(lat * 12) * 0.18;
        const acoustic2 = Math.sin(lon * 24 + 2.1) * Math.sin(lat * 24) * 0.1;
        const noise = (Math.sin(x * 0.7 + y * 0.9) * 0.5 + 0.5) * 0.07;

        const val = Math.max(
          -1.0,
          Math.min(1.0, dipole + octupole + acoustic1 + acoustic2 + noise)
        );
        const norm = (val + 1.0) / 2.0; // 0.0 to 1.0

        // Planck thermal color palette: Blue (cold) -> Cyan -> Green -> Orange -> Red (hot)
        let r = 0,
          g = 0,
          b = 0;
        if (norm < 0.25) {
          r = Math.floor(norm * 4 * 30);
          g = Math.floor(norm * 4 * 90);
          b = Math.floor(160 + norm * 4 * 95);
        } else if (norm < 0.5) {
          const t = (norm - 0.25) * 4;
          r = Math.floor(30 + t * 20);
          g = Math.floor(90 + t * 130);
          b = Math.floor(255 - t * 80);
        } else if (norm < 0.75) {
          const t = (norm - 0.5) * 4;
          r = Math.floor(50 + t * 190);
          g = Math.floor(220 - t * 60);
          b = Math.floor(175 - t * 140);
        } else {
          const t = (norm - 0.75) * 4;
          r = Math.floor(240 + t * 15);
          g = Math.floor(160 - t * 120);
          b = Math.floor(35 - t * 30);
        }

        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 230;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates the 3D CMB Last-Scattering Spherical Shell with illustrative temperature map.
 */
export function createCMBLastScatteringSphere(
  radiusMpc: number = 14000,
  includeGalacticMask: boolean = false
): THREE.Group {
  const group = new THREE.Group();
  group.name = "cmb-last-scattering-surface";

  const sceneRadius = comovingMpcToSceneRadius(radiusMpc);
  const sphereGeo = new THREE.SphereGeometry(sceneRadius, 48, 36);

  const texture = generateProceduralCMBTexture(includeGalacticMask);
  const sphereMat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(mesh);

  // CMB Dipole Axis Vector Indicator (+369 km/s towards Crater/Leo: l = 264°, b = +48°)
  const dipoleDir = equatorialToObservableSceneVector(168.0, -7.0, radiusMpc).normalize();
  const dipoleGeo = new THREE.BufferGeometry().setFromPoints([
    dipoleDir.clone().multiplyScalar(-sceneRadius * 1.05),
    dipoleDir.clone().multiplyScalar(sceneRadius * 1.05),
  ]);
  const dipoleMat = new THREE.LineDashedMaterial({
    color: 0xf59e0b,
    dashSize: 3,
    gapSize: 2,
    transparent: true,
    opacity: 0.6,
  });
  const dipoleLine = new THREE.Line(dipoleGeo, dipoleMat);
  dipoleLine.computeLineDistances();
  group.add(dipoleLine);

  return group;
}

/**
 * Creates the outer boundary representing the Particle Horizon (Observable Universe Limit ~46.5 Gly).
 */
export function createParticleHorizonBoundary(radiusMpc: number = 14250): THREE.Group {
  const group = new THREE.Group();
  group.name = "particle-horizon-boundary";

  const sceneRadius = comovingMpcToSceneRadius(radiusMpc);

  // Outer glowing boundary shell
  const boundaryGeo = new THREE.SphereGeometry(sceneRadius, 36, 28);
  const boundaryMat = new THREE.MeshBasicMaterial({
    color: 0xe11d48,
    transparent: true,
    opacity: 0.08,
    wireframe: true,
  });
  group.add(new THREE.Mesh(boundaryGeo, boundaryMat));

  // Prominent dashed boundary equator
  const eqCurve = new THREE.EllipseCurve(0, 0, sceneRadius, sceneRadius, 0, 2 * Math.PI, false, 0);
  const points = eqCurve.getPoints(120);
  const lineGeo = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y))
  );
  const lineMat = new THREE.LineDashedMaterial({
    color: 0xf43f5e,
    dashSize: 4,
    gapSize: 3,
    transparent: true,
    opacity: 0.7,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  line.computeLineDistances();
  group.add(line);

  return group;
}

/**
 * Creates 3D interactive Object Markers for Observational Landmarks.
 */
export function createLandmarkMarkersGroup(
  landmarks: ObservationalLandmark[],
  selectedSlug?: string
): THREE.Group {
  const group = new THREE.Group();
  group.name = "observational-landmarks-group";

  landmarks.forEach((landmark) => {
    if (landmark.comovingDistanceMpc <= 0) return; // Earth handled separately

    const pos = equatorialToObservableSceneVector(
      landmark.coordinates?.rightAscensionDeg ?? 0,
      landmark.coordinates?.declinationDeg ?? 0,
      landmark.comovingDistanceMpc
    );

    const isSelected = selectedSlug === landmark.slug;

    // Stalk line connecting marker to origin
    const stalkGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
    const stalkMat = new THREE.LineBasicMaterial({
      color: isSelected ? 0x38bdf8 : 0x475569,
      transparent: true,
      opacity: isSelected ? 0.6 : 0.2,
    });
    group.add(new THREE.Line(stalkGeo, stalkMat));

    // Marker sphere node
    const markerRadius = isSelected ? 3.0 : 1.8;
    const nodeGeo = new THREE.SphereGeometry(markerRadius, 16, 16);
    let nodeColor = 0x38bdf8;

    switch (landmark.category) {
      case "HIGH_Z_GALAXY":
        nodeColor = 0xf59e0b; // Amber
        break;
      case "QUASAR":
        nodeColor = 0xa855f7; // Purple
        break;
      case "CMB":
        nodeColor = 0xea580c; // Orange
        break;
      case "HORIZON":
        nodeColor = 0xe11d48; // Rose
        break;
      default:
        nodeColor = 0x06b6d4; // Cyan
    }

    const nodeMat = new THREE.MeshBasicMaterial({
      color: isSelected ? 0xffffff : nodeColor,
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.copy(pos);
    nodeMesh.userData = {
      slug: landmark.slug,
      name: landmark.name,
      redshiftZ: landmark.redshiftZ,
      comovingDistanceGly: landmark.comovingDistanceGly,
      lookbackTimeGyr: landmark.lookbackTimeGyr,
    };

    group.add(nodeMesh);
  });

  return group;
}
