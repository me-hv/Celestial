import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "cyan" | "violet" | "amber" | "emerald" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-mono font-medium transition-colors",
        {
          "bg-celestial-muted text-celestial-starlight border border-celestial-border/50":
            variant === "default",
          "bg-celestial-cyan/15 text-celestial-cyan border border-celestial-cyan/30":
            variant === "cyan",
          "bg-celestial-violet/15 text-celestial-violet border border-celestial-violet/30":
            variant === "violet",
          "bg-celestial-amber/15 text-celestial-amber border border-celestial-amber/30":
            variant === "amber",
          "bg-celestial-emerald/15 text-celestial-emerald border border-celestial-emerald/30":
            variant === "emerald",
          "border border-celestial-border text-celestial-subtle": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
