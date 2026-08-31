import * as THREE from "three";

/**
 * Creates 3D spatial reference grids and boundary distance shells for the Deep Sky Scene:
 * 1. Galactic Plane Equator Reference Ring & Subtle Grid
 * 2. Cosmic Distance Shells (1 kpc / Local Bubble, 50 kpc / Milky Way & Magellanic Clouds, 1 Mpc / Local Group)
 */
export function createGalacticPlaneGrid(): THREE.Group {
  const group = new THREE.Group();
  group.name = "galactic-plane-reference-grid";

  // 1. Galactic Equator Plane Wireframe (Subtle Cyan/Indigo Disc)
  const planeGeo = new THREE.RingGeometry(5, 260, 64, 8);
  planeGeo.rotateX(Math.PI / 2);
  const planeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#4338CA"),
    wireframe: true,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  group.add(planeMesh);

  // 2. Reference Concentric Distance Rings (1 kpc, 10 kpc, 50 kpc, 1 Mpc equivalent units)
  const shellRadii = [
    { r: 40, color: "#06B6D4", label: "Milky Way Local Arm (~1-2 kpc)" },
    { r: 110, color: "#3B82F6", label: "Milky Way Halo / LMC (~50 kpc)" },
    { r: 210, color: "#8B5CF6", label: "Local Group Domain (~1 Mpc)" },
  ];

  shellRadii.forEach(({ r, color }) => {
    const ringPoints: THREE.Vector3[] = [];
    const segments = 96;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineDashedMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3,
      dashSize: 3.0,
      gapSize: 2.0,
    });
    const ringLine = new THREE.LineLoop(ringGeo, ringMat);
    ringLine.computeLineDistances();
    group.add(ringLine);
  });

  return group;
}
