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
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celestial-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-celestial-void disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            "bg-celestial-starlight text-celestial-void hover:bg-white":
              variant === "primary" || variant === "default",
            "bg-celestial-surface text-celestial-starlight hover:bg-celestial-muted border border-celestial-border":
              variant === "secondary",
            "border border-celestial-border text-celestial-starlight hover:bg-celestial-surface":
              variant === "outline",
            "text-celestial-subtle hover:text-celestial-starlight hover:bg-celestial-surface/50":
              variant === "ghost",
            "bg-celestial-cyan text-celestial-void hover:bg-celestial-cyan/90 shadow-glow-cyan":
              variant === "cyan",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 py-2 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
