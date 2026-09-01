"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, HelpCircle, Cpu, Palette } from "lucide-react";

export type EpistemicStatus = "OBSERVED" | "INFERRED" | "MODEL_DERIVED" | "ILLUSTRATIVE";

export interface EpistemicBadgeProps {
  status: EpistemicStatus;
  className?: string;
  showIcon?: boolean;
}

const EPISTEMIC_CONFIG: Record<
  EpistemicStatus,
  {
    label: string;
    variant: "cyan" | "amber" | "violet" | "outline";
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badgeClass: string;
  }
> = {
  OBSERVED: {
    label: "Observed",
    variant: "cyan",
    icon: CheckCircle2,
    description: "Direct photometric, astrometric, or spectroscopic measurement",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  INFERRED: {
    label: "Inferred",
    variant: "amber",
    icon: HelpCircle,
    description: "Derived through indirect scientific inference (e.g. radial velocity, transit)",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  MODEL_DERIVED: {
    label: "Model-Derived",
    variant: "violet",
    icon: Cpu,
    description: "Computed using theoretical models (e.g. Keplerian physics, FLRW cosmology)",
    badgeClass: "bg-celestial-violet/15 text-celestial-violet border-celestial-violet/30",
  },
  ILLUSTRATIVE: {
    label: "Illustrative",
    variant: "outline",
    icon: Palette,
    description: "Artistic or procedural representation for spatial intuition",
    badgeClass: "bg-celestial-surface text-celestial-subtle border-celestial-muted",
  },
};

export function EpistemicBadge({ status, className = "", showIcon = true }: EpistemicBadgeProps) {
  const config = EPISTEMIC_CONFIG[status] || EPISTEMIC_CONFIG.MODEL_DERIVED;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      title={config.description}
      className={cn(
        "font-mono text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 gap-1 inline-flex items-center",
        config.badgeClass,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </Badge>
  );
}
