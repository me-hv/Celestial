import * as THREE from "three";
import { KeplerianElements, generateOrbitTrajectoryPoints } from "@/lib/astronomy/kepler-solver";
import { heliocentricToVisualCoordinates } from "@/lib/astronomy/coordinates";

/**
 * Creates a continuous 3D line loop representing the true Keplerian orbital path
 */
export function createOrbitPathLine(
  elements: KeplerianElements,
  color = "#374151",
  opacity = 0.45,
  samples = 180
): THREE.LineLoop {
  const trajectoryPoints = generateOrbitTrajectoryPoints(elements, samples);
  const visualVectors: THREE.Vector3[] = trajectoryPoints.map((pt) => {
    const visual = heliocentricToVisualCoordinates(pt.xAu, pt.yAu, pt.zAu);
    return new THREE.Vector3(visual.x, visual.y, visual.z);
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(visualVectors);
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    linewidth: 1,
  });

  const line = new THREE.LineLoop(geometry, material);
  line.userData = { isOrbitPath: true };
  return line;
}
