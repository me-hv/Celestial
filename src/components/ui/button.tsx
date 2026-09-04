import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan" | "default";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestial-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-celestial-void disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] select-none",
          {
            "bg-celestial-starlight text-celestial-void hover:bg-white shadow-sm font-semibold":
              variant === "primary" || variant === "default",
            "bg-celestial-surface text-celestial-starlight hover:bg-celestial-elevated border border-white/[0.08] hover:border-white/[0.15] shadow-sm":
              variant === "secondary",
            "border border-white/[0.12] text-celestial-starlight hover:bg-white/[0.06] hover:border-white/[0.2]":
              variant === "outline",
            "text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.06]":
              variant === "ghost",
            "bg-celestial-cyan text-celestial-void hover:bg-celestial-cyan/90 shadow-glow-cyan font-semibold":
              variant === "cyan",
            "h-9 px-3 text-xs gap-1.5": size === "sm",
            "h-10 px-4 py-2 text-sm gap-2": size === "md",
            "h-12 px-6 text-base gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

