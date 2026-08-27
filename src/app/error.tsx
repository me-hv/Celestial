"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CELESTIAL Application Error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <Container size="sm" className="text-center space-y-6">
        <div className="inline-flex p-3 rounded-full bg-celestial-amber/10 border border-celestial-amber/30 text-celestial-amber">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-mono text-celestial-starlight">
            OBSERVATORY ERROR
          </h2>
          <p className="text-sm text-celestial-subtle max-w-md mx-auto">
            An unexpected error occurred while loading this view. The telemetry report has been
            logged.
          </p>
        </div>
        <div>
          <Button variant="secondary" onClick={() => reset()} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Retry Operation</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
