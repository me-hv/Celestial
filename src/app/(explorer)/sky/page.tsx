import { Metadata } from "next";
import { Telescope, Eye } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Night Sky Observer — CELESTIAL",
  description: "Planetary alignments, constellations, and celestial observer coordinates.",
};

export default function SkyPage() {
  return (
    <div className="flex-1 py-10">
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Telescope className="w-5 h-5 text-celestial-violet" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Night Sky Observer
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Real-time celestial sphere projection from ground observer coordinates
            </p>
          </div>
          <Badge variant="violet">SKY MAP READY</Badge>
        </div>

        <EmptyState
          icon={<Eye className="w-10 h-10" />}
          title="Equatorial Sky Coordinate Engine Prepared"
          description="Astrometric coordinate systems (Right Ascension & Declination) are defined. Observer sky maps will be integrated during Phase 4."
        />
      </Container>
    </div>
  );
}
