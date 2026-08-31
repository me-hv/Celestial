import * as THREE from "three";
import { CelestialObject } from "@/domain/celestial-object/types";
import { DeepSkyScale } from "@/lib/astronomy/coordinates/deep-sky-scale";

export interface DeepSkyMeshNode {
  object: CelestialObject;
  group: THREE.Group;
  mesh: THREE.Mesh | THREE.Points;
  selectionRing: THREE.Mesh;
  visualRadius: number;
}

export const DEEP_SKY_COLOR_PALETTE: Record<
  string,
  { primary: string; secondary: string; emissive: string }
> = {
  GALAXY: { primary: "#E0E7FF", secondary: "#A5B4FC", emissive: "#6366F1" }, // Indigo/Violet
  NEBULA: { primary: "#F43F5E", secondary: "#FB7185", emissive: "#E11D48" }, // Crimson / H-Alpha Red
  STAR_CLUSTER: { primary: "#38BDF8", secondary: "#7DD3FC", emissive: "#0284C7" }, // Brilliant Cyan / Blue
  PLANETARY_NEBULA: { primary: "#10B981", secondary: "#34D399", emissive: "#059669" }, // O-III Emerald
  SUPERNOVA_REMNANT: { primary: "#F59E0B", secondary: "#FCD34D", emissive: "#D97706" }, // Amber / Shock Gold
};

export function getDeepSkyPalette(classificationCode: string): {
  primary: string;
  secondary: string;
  emissive: string;
} {
  return DEEP_SKY_COLOR_PALETTE[classificationCode] || DEEP_SKY_COLOR_PALETTE.GALAXY;
}

/**
 * Factory for creating 3D visual representations tailored to Deep Sky object types.
 */
export function createDeepSkyNode(object: CelestialObject): DeepSkyMeshNode {
  const group = new THREE.Group();
  group.name = `deep-sky-${object.slug}`;

  // 1. Position in Scene Space
  const distanceLy = object.positional.distanceLightYears ?? 10000;
  const cartesianPc = object.positional.cartesianCoordinatesPc ?? { x: 0, y: 0, z: 0 };
  const scenePos = DeepSkyScale.parsecsToDeepSkyScene(cartesianPc, distanceLy);
  group.position.set(scenePos.x, scenePos.y, scenePos.z);

  // 2. Magnitude & Classification Visual Scaling
  const scaling = DeepSkyScale.calculateMagnitudeScaling(
    object.physical.apparentMagnitudeV,
    object.classification.code
  );
  const visualRadius = scaling.radius;
  const palette = getDeepSkyPalette(object.classification.code);

  let primaryMesh: THREE.Mesh | THREE.Points;

  // 3. Object-Type-Specific Differentiated Visual Geometry
  switch (object.classification.code) {
    case "GALAXY": {
      // Elliptical disc / spiral galaxy visual representation
      const discGeo = new THREE.RingGeometry(0.2, visualRadius * 1.5, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.primary),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: scaling.opacity * 0.75,
      });
      primaryMesh = new THREE.Mesh(discGeo, discMat);
      // Tilt to face observer subtly
      primaryMesh.rotation.x = Math.PI / 3;

      // Bright nucleus core
      const coreGeo = new THREE.SphereGeometry(visualRadius * 0.45, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FFFFFF"),
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);
      break;
    }

    case "NEBULA": {
      // Diffuse volumetric cloud
      const cloudGeo = new THREE.SphereGeometry(visualRadius * 1.25, 16, 16);
      const cloudMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.primary),
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      });
      primaryMesh = new THREE.Mesh(cloudGeo, cloudMat);

      // Core emission glow
      const glowGeo = new THREE.SphereGeometry(visualRadius * 0.6, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.emissive),
        transparent: true,
        opacity: 0.8,
      });
      group.add(new THREE.Mesh(glowGeo, glowMat));
      break;
    }

    case "STAR_CLUSTER": {
      // Star Cluster: Group of concentrated stellar particle points
      const particleCount =
        object.deepSky?.starCluster?.clusterSubtype === "GLOBULAR_CLUSTER" ? 64 : 28;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = Math.random() * visualRadius * 1.1;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      const clusterGeo = new THREE.BufferGeometry();
      clusterGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const clusterMat = new THREE.PointsMaterial({
        color: new THREE.Color(palette.primary),
        size: 1.8,
        transparent: true,
        opacity: 0.9,
      });
      primaryMesh = new THREE.Points(clusterGeo, clusterMat);
      break;
    }

    case "PLANETARY_NEBULA":
    case "SUPERNOVA_REMNANT":
    default: {
      // Expanding spherical shock shell / torus
      const ringGeo = new THREE.TorusGeometry(visualRadius, visualRadius * 0.25, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(palette.primary),
        transparent: true,
        opacity: 0.75,
      });
      primaryMesh = new THREE.Mesh(ringGeo, ringMat);

      // Central remnant point
      const centralGeo = new THREE.SphereGeometry(visualRadius * 0.25, 12, 12);
      const centralMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FFFFFF"),
      });
      group.add(new THREE.Mesh(centralGeo, centralMat));
      break;
    }
  }

  primaryMesh.name = `deep-sky-body-${object.slug}`;
  primaryMesh.userData = {
    objectId: object.id,
    slug: object.slug,
    deepSkyObject: object,
  };
  group.add(primaryMesh);

  // 4. Selection Indicator Ring (Initially Hidden)
  const selRingGeo = new THREE.RingGeometry(visualRadius * 1.8, visualRadius * 2.05, 36);
  selRingGeo.rotateX(Math.PI / 2);
  const selRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#38BDF8"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
  });
  const selectionRing = new THREE.Mesh(selRingGeo, selRingMat);
  selectionRing.name = "selection-ring";
  group.add(selectionRing);

  return {
    object,
    group,
    mesh: primaryMesh,
    selectionRing,
    visualRadius,
  };
}

export function updateDeepSkySelectionRing(node: DeepSkyMeshNode, isSelected: boolean): void {
  const mat = node.selectionRing.material as THREE.MeshBasicMaterial;
  mat.opacity = isSelected ? 0.95 : 0.0;
}
