import { Metadata } from "next";
import { Orbit, Layers } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Celestial Objects Atlas — CELESTIAL",
  description: "Comprehensive scientific atlas of stars, planets, moons, nebulae, and galaxies.",
};

export default function ObjectsPage() {
  return (
    <div className="flex-1 py-10">
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Orbit className="w-5 h-5 text-celestial-amber" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Celestial Atlas
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Classifications, scientific physical metrics, and orbital parameters
            </p>
          </div>
          <Badge variant="amber">ATLAS REGISTRY</Badge>
        </div>

        <EmptyState
          icon={<Layers className="w-10 h-10" />}
          title="Astronomical Atlas Registry Ready"
          description="The database schema and Zod validation layers are initialized. Authoritative solar system records will be ingested during Phase 1."
        />
      </Container>
    </div>
  );
}
