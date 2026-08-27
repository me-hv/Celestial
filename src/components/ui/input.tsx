import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-celestial-subtle">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-lg border border-celestial-border/70 bg-celestial-surface/80 px-4 py-2 text-sm text-celestial-starlight placeholder:text-celestial-subtle/60 focus:border-celestial-cyan focus:outline-none focus:ring-1 focus:ring-celestial-cyan disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans",
            icon && "pl-11",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
