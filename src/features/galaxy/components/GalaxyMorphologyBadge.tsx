import React from "react";
import { GalaxyMorphologyClass } from "@/domain/galaxy/types";
import { Badge } from "@/components/ui/badge";

interface GalaxyMorphologyBadgeProps {
  morphologyClass: GalaxyMorphologyClass;
  hubbleType?: string;
  className?: string;
}

export const GalaxyMorphologyBadge: React.FC<GalaxyMorphologyBadgeProps> = ({
  morphologyClass,
  hubbleType,
  className = "",
}) => {
  let label = morphologyClass.replace(/_/g, " ");
  let colorClasses = "bg-blue-500/10 text-blue-400 border-blue-500/20";

  switch (morphologyClass) {
    case "BARRED_SPIRAL":
      colorClasses = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    case "SPIRAL":
      colorClasses = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      break;
    case "ELLIPTICAL":
    case "DWARF_ELLIPTICAL":
      colorClasses = "bg-orange-500/10 text-orange-400 border-orange-500/20";
      break;
    case "DWARF_SPHEROIDAL":
      colorClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      break;
    case "IRREGULAR":
    case "DWARF_IRREGULAR":
      colorClasses = "bg-purple-500/10 text-purple-400 border-purple-500/20";
      break;
    case "LENTICULAR":
      colorClasses = "bg-slate-500/10 text-slate-300 border-slate-500/20";
      break;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Badge
        variant="outline"
        className={`font-mono text-xs uppercase px-2.5 py-0.5 ${colorClasses}`}
      >
        {label}
      </Badge>
      {hubbleType && (
        <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded">
          {hubbleType}
        </span>
      )}
    </div>
  );
};
