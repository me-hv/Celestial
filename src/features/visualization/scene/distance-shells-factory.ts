import * as THREE from "three";
import { StellarNeighborhoodScale } from "@/lib/astronomy/coordinates/stellar-scale";

export interface DistanceShellConfig {
  radiusPc: number;
  label: string;
  color: string;
}

export const DEFAULT_DISTANCE_SHELLS: DistanceShellConfig[] = [
  { radiusPc: 5.0, label: "5 pc (16.3 ly)", color: "#06B6D4" }, // Cyan
  { radiusPc: 10.0, label: "10 pc (32.6 ly)", color: "#3B82F6" }, // Blue
  { radiusPc: 20.0, label: "20 pc (65.2 ly)", color: "#8B5CF6" }, // Violet
];

/**
 * Creates 3D spatial reference distance shells centered on the Sun (0, 0, 0).
 */
export function createDistanceShellsMesh(
  shells: DistanceShellConfig[] = DEFAULT_DISTANCE_SHELLS,
  scaleFactor: number = StellarNeighborhoodScale.UNITS_PER_PARSEC
): THREE.Group {
  const group = new THREE.Group();
  group.name = "stellar-distance-shells";

  shells.forEach((shell) => {
    const visualRadius = shell.radiusPc * scaleFactor;

    // 1. Equatorial Reference Circle (XZ Plane)
    const circlePoints: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      circlePoints.push(
        new THREE.Vector3(Math.cos(theta) * visualRadius, 0, Math.sin(theta) * visualRadius)
      );
    }

    const circleGeo = new THREE.BufferGeometry().setFromPoints(circlePoints);
    const circleMat = new THREE.LineDashedMaterial({
      color: new THREE.Color(shell.color),
      transparent: true,
      opacity: 0.35,
      dashSize: 2.0,
      gapSize: 1.5,
    });
    const circleLine = new THREE.LineLoop(circleGeo, circleMat);
    circleLine.computeLineDistances();
    group.add(circleLine);

    // 2. Translucent Reference Sphere Shell
    const sphereGeo = new THREE.SphereGeometry(visualRadius, 32, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(shell.color),
      wireframe: true,
      transparent: true,
      opacity: 0.04,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);
  });

  return group;
}
