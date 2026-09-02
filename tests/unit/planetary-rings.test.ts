import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { SOLAR_SYSTEM_OBJECTS } from "@/lib/data/solar-system-data";
import {
  createCelestialBodyNode,
  updateSelectionRingState,
} from "@/features/visualization/scene/planet-mesh-factory";

describe("Planetary Ring Rendering & Data-Driven Domain Rules", () => {
  const getObject = (slug: string) => {
    const found = SOLAR_SYSTEM_OBJECTS.find((o) => o.slug === slug);
    if (!found) throw new Error(`Object with slug ${slug} not found in test dataset`);
    return found;
  };

  describe("Domain Data Configuration", () => {
    it("explicitly configures ring system for Saturn only", () => {
      const saturn = getObject("saturn");
      expect(saturn.physical.hasRingSystem).toBe(true);
      expect(saturn.physical.ringSystem).toBeDefined();
      expect(saturn.physical.ringSystem?.innerRadiusKm).toBeGreaterThan(0);
      expect(saturn.physical.ringSystem?.outerRadiusKm).toBeGreaterThan(
        saturn.physical.ringSystem?.innerRadiusKm || 0
      );
      expect(saturn.physical.ringSystem?.opacity).toBe(0.85);
      expect(saturn.physical.ringSystem?.inclinationDeg).toBeCloseTo(26.73, 1);
    });

    it("verifies ring system is disabled for all other Solar System planets", () => {
      const nonRingSlugs = [
        "sun",
        "mercury",
        "venus",
        "earth",
        "moon",
        "mars",
        "jupiter",
        "uranus",
        "neptune",
      ];

      for (const slug of nonRingSlugs) {
        const obj = getObject(slug);
        expect(obj.physical.hasRingSystem).toBe(false);
        expect(obj.physical.ringSystem).toBeUndefined();
      }
    });
  });

  describe("3D Mesh Factory Rendering Verification", () => {
    it("renders RingGeometry and ringMesh ONLY for Saturn", () => {
      const saturn = getObject("saturn");
      const saturnNode = createCelestialBodyNode(saturn);

      expect(saturnNode.ringMesh).toBeDefined();
      expect(saturnNode.ringMesh?.name).toBe("rings-saturn");
      expect(saturnNode.ringMesh?.geometry).toBeInstanceOf(THREE.RingGeometry);

      // Verify ring geometry is added to group children
      const ringChild = saturnNode.group.children.find(
        (c) => c instanceof THREE.Mesh && c.geometry instanceof THREE.RingGeometry
      );
      expect(ringChild).toBeDefined();
      expect(ringChild).toBe(saturnNode.ringMesh);
    });

    it("does NOT create or attach RingGeometry for Mercury, Venus, Earth, Mars, Jupiter, Uranus, Neptune", () => {
      const nonRingSlugs = [
        "mercury",
        "venus",
        "earth",
        "moon",
        "mars",
        "jupiter",
        "uranus",
        "neptune",
      ];

      for (const slug of nonRingSlugs) {
        const obj = getObject(slug);
        const node = createCelestialBodyNode(obj);

        expect(node.ringMesh).toBeUndefined();

        // Ensure zero RingGeometry instances exist in the entire node hierarchy
        let ringGeometryCount = 0;
        node.group.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
            ringGeometryCount++;
          }
        });

        expect(ringGeometryCount).toBe(0);
      }
    });

    it("maintains selection reticle toggling without spawning planetary ring geometry", () => {
      const earth = getObject("earth");
      const node = createCelestialBodyNode(earth);

      expect(node.selectionRing).toBeDefined();
      expect(node.selectionRing?.visible).toBe(false);

      // Select Earth
      updateSelectionRingState(node, true);
      expect(node.selectionRing?.visible).toBe(true);

      // Deselect Earth
      updateSelectionRingState(node, false);
      expect(node.selectionRing?.visible).toBe(false);

      // Ensure no RingGeometry was created
      let ringGeoCount = 0;
      node.group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
          ringGeoCount++;
        }
      });
      expect(ringGeoCount).toBe(0);
    });
  });
});
