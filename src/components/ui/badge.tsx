import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "cyan" | "violet" | "amber" | "emerald" | "rose" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium transition-colors tracking-wide",
        {
          "bg-white/[0.08] text-celestial-starlight border border-white/[0.1]":
            variant === "default",
          "bg-celestial-cyan/15 text-celestial-cyan border border-celestial-cyan/35 shadow-sm shadow-celestial-cyan/10":
            variant === "cyan",
          "bg-celestial-violet/15 text-celestial-violet border border-celestial-violet/35 shadow-sm shadow-celestial-violet/10":
            variant === "violet",
          "bg-celestial-amber/15 text-amber-300 border border-amber-500/35 shadow-sm shadow-amber-500/10":
            variant === "amber",
          "bg-celestial-emerald/15 text-emerald-300 border border-emerald-500/35 shadow-sm shadow-emerald-500/10":
            variant === "emerald",
          "bg-rose-500/15 text-rose-300 border border-rose-500/35 shadow-sm shadow-rose-500/10":
            variant === "rose",
          "border border-white/[0.15] text-celestial-subtle bg-white/[0.03]": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

