import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-celestial-muted bg-celestial-deep/40",
        className
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-celestial-subtle">{icon}</div>}
      <h4 className="text-base font-medium text-celestial-starlight">{title}</h4>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-celestial-subtle">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
