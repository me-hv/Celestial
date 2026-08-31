import React from "react";
import { Galaxy } from "@/domain/galaxy/types";
import { formatGalaxyDistance } from "@/lib/astronomy/cosmology/distance";
import { GalaxyMorphologyBadge } from "./GalaxyMorphologyBadge";

interface GalaxyComparisonTableProps {
  galaxyA: Galaxy;
  galaxyB: Galaxy;
  className?: string;
}

export const GalaxyComparisonTable: React.FC<GalaxyComparisonTableProps> = ({
  galaxyA,
  galaxyB,
  className = "",
}) => {
  // Mass Ratio
  let massRatioStr = "N/A";
  if (galaxyA.physical.totalMassSolar && galaxyB.physical.totalMassSolar) {
    const ratio = galaxyA.physical.totalMassSolar.value / galaxyB.physical.totalMassSolar.value;
    massRatioStr = ratio > 1 ? `${ratio.toFixed(2)} : 1` : `1 : ${(1 / ratio).toFixed(2)}`;
  }

  // Diameter Ratio
  const diamRatio = galaxyA.physical.diameterKpc.value / galaxyB.physical.diameterKpc.value;
  const diamRatioStr =
    diamRatio > 1 ? `${diamRatio.toFixed(2)} : 1` : `1 : ${(1 / diamRatio).toFixed(2)}`;

  const rows = [
    {
      label: "Morphology Class",
      valA: (
        <GalaxyMorphologyBadge
          morphologyClass={galaxyA.morphology.class}
          hubbleType={galaxyA.morphology.hubbleDeVaucouleurs}
        />
      ),
      valB: (
        <GalaxyMorphologyBadge
          morphologyClass={galaxyB.morphology.class}
          hubbleType={galaxyB.morphology.hubbleDeVaucouleurs}
        />
      ),
    },
    {
      label: "Hubble-de Vaucouleurs Type",
      valA: galaxyA.morphology.hubbleDeVaucouleurs,
      valB: galaxyB.morphology.hubbleDeVaucouleurs,
    },
    {
      label: "Physical Diameter",
      valA: `~${Math.round(galaxyA.physical.diameterLy.value).toLocaleString()} ly (${galaxyA.physical.diameterKpc.value.toFixed(1)} kpc)`,
      valB: `~${Math.round(galaxyB.physical.diameterLy.value).toLocaleString()} ly (${galaxyB.physical.diameterKpc.value.toFixed(1)} kpc)`,
      ratio: `Ratio (A/B): ${diamRatioStr}`,
    },
    {
      label: "Total Halo Mass (M_virial)",
      valA: galaxyA.physical.totalMassSolar
        ? `${(galaxyA.physical.totalMassSolar.value / 1e12).toFixed(2)} × 10¹² M☉`
        : "N/A",
      valB: galaxyB.physical.totalMassSolar
        ? `${(galaxyB.physical.totalMassSolar.value / 1e12).toFixed(2)} × 10¹² M☉`
        : "N/A",
      ratio: `Ratio (A/B): ${massRatioStr}`,
    },
    {
      label: "Stellar Mass (M_*)",
      valA: galaxyA.physical.stellarMassSolar
        ? `${(galaxyA.physical.stellarMassSolar.value / 1e10).toFixed(1)} × 10¹⁰ M☉`
        : "N/A",
      valB: galaxyB.physical.stellarMassSolar
        ? `${(galaxyB.physical.stellarMassSolar.value / 1e10).toFixed(1)} × 10¹⁰ M☉`
        : "N/A",
    },
    {
      label: "Star Formation Rate",
      valA: galaxyA.physical.starFormationRateSolarMassPerYr
        ? `${galaxyA.physical.starFormationRateSolarMassPerYr.toFixed(2)} M☉/yr`
        : "N/A",
      valB: galaxyB.physical.starFormationRateSolarMassPerYr
        ? `${galaxyB.physical.starFormationRateSolarMassPerYr.toFixed(2)} M☉/yr`
        : "N/A",
    },
    {
      label: "Heliocentric Radial Velocity (v_r)",
      valA: `${galaxyA.kinematics.heliocentricRadialVelocityKmS.value > 0 ? "+" : ""}${galaxyA.kinematics.heliocentricRadialVelocityKmS.value.toFixed(1)} km/s`,
      valB: `${galaxyB.kinematics.heliocentricRadialVelocityKmS.value > 0 ? "+" : ""}${galaxyB.kinematics.heliocentricRadialVelocityKmS.value.toFixed(1)} km/s`,
    },
    {
      label: "Distance from Earth",
      valA:
        galaxyA.slug === "milky-way-galaxy"
          ? "0 ly (Home)"
          : formatGalaxyDistance(
              galaxyA.distance.distanceLy.value,
              galaxyA.distance.distanceLy.uncertainty
            ),
      valB:
        galaxyB.slug === "milky-way-galaxy"
          ? "0 ly (Home)"
          : formatGalaxyDistance(
              galaxyB.distance.distanceLy.value,
              galaxyB.distance.distanceLy.uncertainty
            ),
    },
    {
      label: "Inclination & Orientation",
      valA: `i = ${galaxyA.orientation.inclinationDeg.toFixed(1)}°, PA = ${galaxyA.orientation.positionAngleDeg.toFixed(1)}°`,
      valB: `i = ${galaxyB.orientation.inclinationDeg.toFixed(1)}°, PA = ${galaxyB.orientation.positionAngleDeg.toFixed(1)}°`,
    },
    {
      label: "Group Membership",
      valA: galaxyA.groupMembership
        ? `${galaxyA.groupMembership.groupName} (${galaxyA.groupMembership.membershipType.replace(/_/g, " ")})`
        : "Isolated",
      valB: galaxyB.groupMembership
        ? `${galaxyB.groupMembership.groupName} (${galaxyB.groupMembership.membershipType.replace(/_/g, " ")})`
        : "Isolated",
    },
    {
      label: "Primary Scientific Source",
      valA: galaxyA.provenance.catalogName,
      valB: galaxyB.provenance.catalogName,
    },
  ];

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-slate-900/60 text-xs font-mono uppercase tracking-wider text-slate-400">
            <th className="py-3 px-4 w-1/3">Property / Metric</th>
            <th className="py-3 px-4 w-1/3 text-cyan-400 font-bold">{galaxyA.name}</th>
            <th className="py-3 px-4 w-1/3 text-purple-400 font-bold">{galaxyB.name}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm text-slate-300">
          {rows.map((r, idx) => (
            <tr key={idx} className="hover:bg-white/[0.02] transition">
              <td className="py-3 px-4 font-medium text-slate-400 text-xs font-mono">
                {r.label}
                {r.ratio && (
                  <span className="block text-[10px] text-emerald-400 font-mono mt-0.5">
                    {r.ratio}
                  </span>
                )}
              </td>
              <td className="py-3 px-4 font-mono text-xs">{r.valA}</td>
              <td className="py-3 px-4 font-mono text-xs">{r.valB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
