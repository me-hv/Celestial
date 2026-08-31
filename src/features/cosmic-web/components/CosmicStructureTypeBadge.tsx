import React from "react";
import { CosmicStructureType, StructureObservationStatus } from "@/domain/cosmic-structure/types";

interface CosmicStructureTypeBadgeProps {
  type: CosmicStructureType;
  observationStatus?: StructureObservationStatus;
  className?: string;
}

export function CosmicStructureTypeBadge({
  type,
  observationStatus,
  className = "",
}: CosmicStructureTypeBadgeProps) {
  let typeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  let label = type.replace(/_/g, " ");

  switch (type) {
    case "GALAXY_CLUSTER":
      typeColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
      break;
    case "GALAXY_GROUP":
      typeColor = "bg-sky-500/10 text-sky-300 border-sky-500/30";
      break;
    case "SUPERCLUSTER":
      typeColor = "bg-purple-500/10 text-purple-300 border-purple-500/30";
      break;
    case "VOID":
      typeColor = "bg-slate-700/30 text-slate-300 border-slate-600/40";
      break;
    case "FILAMENT":
      typeColor = "bg-teal-500/10 text-teal-300 border-teal-500/30";
      break;
    case "WALL":
    case "SHEET":
      typeColor = "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      break;
  }

  let statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  let statusText = "OBSERVED";

  if (observationStatus === "MODEL_DERIVED") {
    statusColor = "bg-purple-500/10 text-purple-300 border-purple-500/30";
    statusText = "MODEL DERIVED";
  } else if (observationStatus === "INFERRED") {
    statusColor = "bg-amber-500/10 text-amber-300 border-amber-500/30";
    statusText = "INFERRED";
  } else if (observationStatus === "ILLUSTRATIVE") {
    statusColor = "bg-slate-800/60 text-slate-400 border-white/10";
    statusText = "ILLUSTRATIVE";
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold font-mono uppercase tracking-wider ${typeColor}`}
      >
        {label}
      </span>
      {observationStatus && (
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono tracking-wider ${statusColor}`}
        >
          {statusText}
        </span>
      )}
    </div>
  );
}
