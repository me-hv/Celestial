import React from "react";
import Link from "next/link";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import { CosmicStructureTypeBadge } from "./CosmicStructureTypeBadge";
import { calculateInterStructureSeparation } from "@/lib/astronomy/coordinates/cosmic-coordinates";
import { formatLookbackTime } from "@/lib/astronomy/cosmology/distance";

interface CosmicStructureComparisonTableProps {
  structureA: CosmicStructure;
  structureB: CosmicStructure;
}

export function CosmicStructureComparisonTable({
  structureA,
  structureB,
}: CosmicStructureComparisonTableProps) {
  const posA = structureA.coordinates.galactocentricCartesianMpc;
  const posB = structureB.coordinates.galactocentricCartesianMpc;
  const separation = calculateInterStructureSeparation(posA, posB);

  const massA = structureA.physical.estimatedMassSolar?.value;
  const massB = structureB.physical.estimatedMassSolar?.value;
  const massRatio = massA && massB ? massB / massA : undefined;

  const sizeA = structureA.dimensions.majorAxisMpc.value;
  const sizeB = structureB.dimensions.majorAxisMpc.value;
  const sizeRatio = sizeA > 0 ? sizeB / sizeA : undefined;

  return (
    <div className="flex flex-col gap-6 w-full text-slate-200 font-mono text-xs">
      {/* Separation Banner */}
      <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/20 p-4 text-center">
        <span className="text-[11px] text-cyan-400 uppercase tracking-wider block">
          3D Spatial Separation in the Cosmic Web
        </span>
        <span className="text-xl font-bold text-white mt-1 block">
          {separation.separationMpc.toFixed(1)} Mpc ({(separation.separationLy / 1e6).toFixed(1)}{" "}
          Million ly)
        </span>
        <span className="text-[11px] text-slate-400 mt-1 block">
          ΔX: {separation.dxMpc.toFixed(1)} Mpc • ΔY: {separation.dyMpc.toFixed(1)} Mpc • ΔZ:{" "}
          {separation.dzMpc.toFixed(1)} Mpc
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/50">
              <th className="p-3 text-slate-400 font-semibold w-1/3">Property</th>
              <th className="p-3 text-cyan-300 font-bold w-1/3">
                <Link href={`/cosmic-web/${structureA.slug}`} className="hover:underline">
                  {structureA.name}
                </Link>
              </th>
              <th className="p-3 text-purple-300 font-bold w-1/3">
                <Link href={`/cosmic-web/${structureB.slug}`} className="hover:underline">
                  {structureB.name}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="p-3 text-slate-400">Classification & Status</td>
              <td className="p-3">
                <CosmicStructureTypeBadge
                  type={structureA.type}
                  observationStatus={structureA.observationStatus}
                />
              </td>
              <td className="p-3">
                <CosmicStructureTypeBadge
                  type={structureB.type}
                  observationStatus={structureB.observationStatus}
                />
              </td>
            </tr>

            <tr>
              <td className="p-3 text-slate-400">Heliocentric Distance</td>
              <td className="p-3">
                <span className="text-white font-semibold">
                  {structureA.coordinates.distanceMpc.value === 0
                    ? "0 Mpc (Home)"
                    : `${structureA.coordinates.distanceMpc.value.toFixed(1)} Mpc`}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ~{(structureA.coordinates.distanceLy.value / 1e6).toFixed(1)} Mly
                </span>
              </td>
              <td className="p-3">
                <span className="text-white font-semibold">
                  {structureB.coordinates.distanceMpc.value === 0
                    ? "0 Mpc (Home)"
                    : `${structureB.coordinates.distanceMpc.value.toFixed(1)} Mpc`}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  ~{(structureB.coordinates.distanceLy.value / 1e6).toFixed(1)} Mly
                </span>
              </td>
            </tr>

            <tr>
              <td className="p-3 text-slate-400">Redshift & Lookback</td>
              <td className="p-3">
                <span className="text-emerald-300">
                  z = {structureA.coordinates.spectroscopicRedshiftZ?.value.toFixed(4) ?? "0.0000"}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {formatLookbackTime(structureA.coordinates.lookbackTimeYears)}
                </span>
              </td>
              <td className="p-3">
                <span className="text-emerald-300">
                  z = {structureB.coordinates.spectroscopicRedshiftZ?.value.toFixed(4) ?? "0.0000"}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {formatLookbackTime(structureB.coordinates.lookbackTimeYears)}
                </span>
              </td>
            </tr>

            <tr>
              <td className="p-3 text-slate-400">Major Span (Diameter)</td>
              <td className="p-3">
                <span className="text-white">
                  {structureA.dimensions.majorAxisMpc.value.toFixed(1)} Mpc
                </span>
              </td>
              <td className="p-3">
                <span className="text-white">
                  {structureB.dimensions.majorAxisMpc.value.toFixed(1)} Mpc
                </span>
                {sizeRatio !== undefined && (
                  <span className="text-[10px] text-cyan-400 block">
                    (
                    {sizeRatio >= 1
                      ? `${sizeRatio.toFixed(1)}× larger`
                      : `${(1 / sizeRatio).toFixed(1)}× smaller`}
                    )
                  </span>
                )}
              </td>
            </tr>

            <tr>
              <td className="p-3 text-slate-400">Estimated Total Mass</td>
              <td className="p-3">
                <span className="text-amber-300">
                  {massA ? `${(massA / 1e12).toFixed(1)} × 10¹² M☉` : "Unknown"}
                </span>
              </td>
              <td className="p-3">
                <span className="text-amber-300">
                  {massB ? `${(massB / 1e12).toFixed(1)} × 10¹² M☉` : "Unknown"}
                </span>
                {massRatio !== undefined && (
                  <span className="text-[10px] text-amber-400 block">
                    (
                    {massRatio >= 1
                      ? `${massRatio.toFixed(1)}× more massive`
                      : `${(1 / massRatio).toFixed(1)}× less massive`}
                    )
                  </span>
                )}
              </td>
            </tr>

            <tr>
              <td className="p-3 text-slate-400">Galaxy Population</td>
              <td className="p-3">
                {structureA.physical.galaxyCountEstimated?.value
                  ? `~${structureA.physical.galaxyCountEstimated.value.toLocaleString()} galaxies`
                  : "Diffuse"}
              </td>
              <td className="p-3">
                {structureB.physical.galaxyCountEstimated?.value
                  ? `~${structureB.physical.galaxyCountEstimated.value.toLocaleString()} galaxies`
                  : "Diffuse"}
              </td>
            </tr>

            <tr>
              <td className="p-3 text-slate-400">Parent Hierarchy</td>
              <td className="p-3 text-purple-300">
                {structureA.parentStructure
                  ? structureA.parentStructure.name
                  : "Top-Level Structure"}
              </td>
              <td className="p-3 text-purple-300">
                {structureB.parentStructure
                  ? structureB.parentStructure.name
                  : "Top-Level Structure"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
