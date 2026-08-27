import * as THREE from "three";

/**
 * Generates a cosmic background particle field with varying star colors and brightness
 */
export function createStarfield(count = 2500, radius = 800): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  // Celestial palette: warm white, starlight cyan, deep nebula violet, solar gold
  const starColors = [
    new THREE.Color("#FFFFFF"),
    new THREE.Color("#F8FAFC"),
    new THREE.Color("#E0F2FE"),
    new THREE.Color("#38BDF8"),
    new THREE.Color("#FDE68A"),
    new THREE.Color("#DDD6FE"),
  ];

  for (let i = 0; i < count; i++) {
    // Distribute uniformly on a sphere shell
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * Math.cbrt(0.7 + 0.3 * Math.random());

    const sinPhi = Math.sin(phi);
    const x = r * sinPhi * Math.cos(theta);
    const y = r * sinPhi * Math.sin(theta);
    const z = r * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const chosenColor = starColors[Math.floor(Math.random() * starColors.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}
