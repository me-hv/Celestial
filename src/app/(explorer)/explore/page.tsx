import { Metadata } from "next";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ThreeCanvasBoundary } from "@/features/visualization/three-boundary";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Cosmic Exploration — CELESTIAL",
  description: "Navigate astronomical systems and planets in interactive 3D.",
};

export default function ExplorePage() {
  return (
    <div className="flex-1 py-10">
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-celestial-cyan" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Cosmic Explorer
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Interactive astronomical viewport & orbit navigation
            </p>
          </div>
          <Badge variant="cyan">PHASE 1 ENGINE INTEGRATION</Badge>
        </div>

        {/* 3D Viewport Area */}
        <div className="w-full">
          <ThreeCanvasBoundary
            className="w-full h-[600px]"
            fallbackMessage="Solar System 3D Simulation engine ready for mounting in Phase 1."
          />
        </div>
      </Container>
    </div>
  );
}
