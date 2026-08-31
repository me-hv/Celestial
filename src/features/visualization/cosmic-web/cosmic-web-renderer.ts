import * as THREE from "three";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import {
  cosmicMpcToScene3D,
  supergalacticMpcToScene3D,
  COSMIC_SCALING,
} from "@/lib/astronomy/coordinates/cosmic-scale";

export interface CosmicWebRenderNodes {
  group: THREE.Group;
  clusterMeshes: THREE.Object3D[];
  voidMeshes: THREE.Object3D[];
  filamentMeshes: THREE.Object3D[];
  superclusterMeshes: THREE.Object3D[];
  sheetMeshes: THREE.Object3D[];
  distanceShellsGroup: THREE.Group;
  supergalacticGrid: THREE.Group;
  youAreHereMarker: THREE.Group;
}

export function createDistanceShellsGroup(
  radiiMpc: readonly number[] = COSMIC_SCALING.REFERENCE_SHELLS_MPC
): THREE.Group {
  const group = new THREE.Group();
  group.name = "cosmic-distance-shells";

  radiiMpc.forEach((radiusMpc) => {
    const sceneRadius = radiusMpc * COSMIC_SCALING.UNITS_PER_MPC;

    // Outer circle
    const curve = new THREE.EllipseCurve(0, 0, sceneRadius, sceneRadius, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(128);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    const material = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      opacity: 0.25,
      transparent: true,
      dashSize: 3,
      gapSize: 2,
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    group.add(line);
  });

  return group;
}

export function createSupergalacticGrid(sizeMpc: number = 300): THREE.Group {
  const group = new THREE.Group();
  group.name = "supergalactic-grid";

  const sceneSize = sizeMpc * COSMIC_SCALING.UNITS_PER_MPC;
  const grid = new THREE.GridHelper(sceneSize * 2, 20, 0x06b6d4, 0x1e293b);
  const material = grid.material as THREE.Material;
  material.opacity = 0.2;
  material.transparent = true;
  group.add(grid);

  return group;
}

export function createYouAreHereMarker(): THREE.Group {
  const group = new THREE.Group();
  group.name = "you-are-here-marker";

  // Pulsing core beacon
  const coreGeo = new THREE.SphereGeometry(0.8, 16, 16);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // Outer halo ring
  const ringGeo = new THREE.RingGeometry(1.2, 1.8, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  group.add(ringMesh);

  // Vertical beacon line
  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 8, 0),
  ]);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.6,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  group.add(line);

  return group;
}

export function createCosmicStructure3DObject(
  structure: CosmicStructure,
  useSupergalactic: boolean = false
): THREE.Object3D {
  const [x, y, z] =
    useSupergalactic && structure.coordinates.supergalactic
      ? supergalacticMpcToScene3D(
          structure.coordinates.supergalactic.sgxMpc,
          structure.coordinates.supergalactic.sgyMpc,
          structure.coordinates.supergalactic.sgzMpc
        )
      : cosmicMpcToScene3D(
          structure.coordinates.galactocentricCartesianMpc.xMpc,
          structure.coordinates.galactocentricCartesianMpc.yMpc,
          structure.coordinates.galactocentricCartesianMpc.zMpc
        );

  const container = new THREE.Group();
  container.position.set(x, y, z);
  container.userData = {
    slug: structure.slug,
    name: structure.name,
    type: structure.type,
    distanceMpc: structure.coordinates.distanceMpc.value,
  };

  switch (structure.type) {
    case "GALAXY_CLUSTER": {
      // Dense central cluster core
      const coreRadius = Math.max(1.5, structure.dimensions.characteristicRadiusMpc ?? 2.0);
      const coreGeo = new THREE.SphereGeometry(coreRadius * 0.8, 24, 24);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b, // Amber gold
        transparent: true,
        opacity: 0.85,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.name = `cluster-core-${structure.slug}`;
      container.add(coreMesh);

      // Diffuse halo of member galaxies
      const haloGeo = new THREE.SphereGeometry(coreRadius * 1.8, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      container.add(haloMesh);

      // Particle cloud representing individual cluster galaxies
      const numParticles = 40;
      const partPoints: THREE.Vector3[] = [];
      for (let i = 0; i < numParticles; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * coreRadius * 2.2;
        const sinPhi = Math.sin(phi);
        partPoints.push(
          new THREE.Vector3(
            r * sinPhi * Math.cos(theta),
            r * sinPhi * Math.sin(theta),
            r * Math.cos(phi)
          )
        );
      }
      const pGeo = new THREE.BufferGeometry().setFromPoints(partPoints);
      const pMat = new THREE.PointsMaterial({
        color: 0xfef08a,
        size: 0.6,
        transparent: true,
        opacity: 0.8,
      });
      const pMesh = new THREE.Points(pGeo, pMat);
      container.add(pMesh);
      break;
    }

    case "GALAXY_GROUP": {
      // Compact group node
      const groupRadius = Math.max(1.0, structure.dimensions.characteristicRadiusMpc ?? 1.2);
      const groupGeo = new THREE.SphereGeometry(groupRadius * 0.8, 16, 16);
      const groupMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8, // Cyan sky
        transparent: true,
        opacity: 0.8,
      });
      const groupMesh = new THREE.Mesh(groupGeo, groupMat);
      container.add(groupMesh);

      const ringGeo = new THREE.RingGeometry(groupRadius * 0.9, groupRadius * 1.3, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0284c7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      container.add(ringMesh);
      break;
    }

    case "SUPERCLUSTER": {
      // Vast, diffuse supercluster volume
      const rx = (structure.dimensions.majorAxisMpc.value / 2) * COSMIC_SCALING.UNITS_PER_MPC;
      const ry =
        ((structure.dimensions.minorAxisMpc?.value ?? 40) / 2) * COSMIC_SCALING.UNITS_PER_MPC;
      const rz = ((structure.dimensions.depthMpc?.value ?? 30) / 2) * COSMIC_SCALING.UNITS_PER_MPC;

      const scGeo = new THREE.SphereGeometry(1, 24, 24);
      scGeo.scale(rx, rz, ry);
      const scMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7, // Violet/Purple
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const scMesh = new THREE.Mesh(scGeo, scMat);
      container.add(scMesh);
      break;
    }

    case "VOID": {
      // Translucent volumetric void hull
      const radius =
        (structure.dimensions.characteristicRadiusMpc ?? 30) * COSMIC_SCALING.UNITS_PER_MPC;
      const voidGeo = new THREE.SphereGeometry(radius, 32, 32);
      const voidMat = new THREE.MeshBasicMaterial({
        color: 0x0f172a, // Dark indigo void
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      });
      const voidMesh = new THREE.Mesh(voidGeo, voidMat);
      container.add(voidMesh);

      // Inner faint boundary sphere
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
      });
      const innerMesh = new THREE.Mesh(voidGeo.clone(), innerMat);
      container.add(innerMesh);
      break;
    }

    case "WALL":
    case "SHEET": {
      // Planar sheet/wall disc
      const span = (structure.dimensions.majorAxisMpc.value / 2) * COSMIC_SCALING.UNITS_PER_MPC;
      const planeGeo = new THREE.RingGeometry(0, span, 32);
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0x10b981, // Emerald green
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
      });
      const planeMesh = new THREE.Mesh(planeGeo, planeMat);
      planeMesh.rotation.x = Math.PI / 2;
      container.add(planeMesh);
      break;
    }

    case "FILAMENT": {
      // Curvilinear filament tube
      if (structure.geometry.spinePath && structure.geometry.spinePath.length >= 2) {
        const pathPoints = structure.geometry.spinePath.map((node) => {
          const [nx, ny, nz] = cosmicMpcToScene3D(node.xMpc, node.yMpc, node.zMpc);
          return new THREE.Vector3(nx - x, ny - y, nz - z);
        });

        const curve = new THREE.CatmullRomCurve3(pathPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 1.2, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4, // Cyan filament
          transparent: true,
          opacity: 0.45,
          wireframe: true,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        container.add(tubeMesh);
      }
      break;
    }
  }

  return container;
}
