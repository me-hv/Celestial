import * as THREE from "three";
import { HabitableZoneBoundaries } from "@/domain/stellar-system/types";
import { SystemScaleStrategy } from "@/lib/astronomy/scaling";

/**
 * Creates a subtle, scientifically honest 3D visual representation
 * of the circumstellar Habitable Zone (Conservative & Optimistic).
 */
export function createHabitableZoneMesh(
  hz: HabitableZoneBoundaries,
  scaleStrategy: SystemScaleStrategy
): THREE.Group {
  const group = new THREE.Group();
  group.name = "habitable-zone-group";

  const rConsInner = scaleStrategy.distanceToVisual(hz.conservativeInnerAu);
  const rConsOuter = scaleStrategy.distanceToVisual(hz.conservativeOuterAu);
  const rOptInner = scaleStrategy.distanceToVisual(hz.optimisticInnerAu);
  const rOptOuter = scaleStrategy.distanceToVisual(hz.optimisticOuterAu);

  // 1. Conservative Habitable Zone (Moist to Maximum Greenhouse)
  const conservativeGeo = new THREE.RingGeometry(
    Math.max(0.1, rConsInner),
    Math.max(rConsInner + 0.1, rConsOuter),
    128
  );
  // Rotate to lie flat on the horizontal X-Z system plane
  conservativeGeo.rotateX(-Math.PI / 2);

  const conservativeMat = new THREE.MeshBasicMaterial({
    color: "#06b6d4", // Subtle cyan/teal
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const conservativeMesh = new THREE.Mesh(conservativeGeo, conservativeMat);
  group.add(conservativeMesh);

  // 2. Optimistic Habitable Zone Outer Extension (Recent Venus to Early Mars)
  const optimisticGeo = new THREE.RingGeometry(
    Math.max(0.1, rOptInner),
    Math.max(rOptInner + 0.1, rOptOuter),
    128
  );
  optimisticGeo.rotateX(-Math.PI / 2);

  const optimisticMat = new THREE.MeshBasicMaterial({
    color: "#0284c7", // Sky blue
    transparent: true,
    opacity: 0.05,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const optimisticMesh = new THREE.Mesh(optimisticGeo, optimisticMat);
  group.add(optimisticMesh);

  // 3. Subtle boundary edge lines
  const createBoundaryLine = (radius: number, color: string, opacity: number) => {
    const segments = 128;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    });
    return new THREE.LineLoop(lineGeo, lineMat);
  };

  group.add(createBoundaryLine(rConsInner, "#22d3ee", 0.3));
  group.add(createBoundaryLine(rConsOuter, "#22d3ee", 0.3));
  group.add(createBoundaryLine(rOptInner, "#38bdf8", 0.15));
  group.add(createBoundaryLine(rOptOuter, "#38bdf8", 0.15));

  return group;
}
