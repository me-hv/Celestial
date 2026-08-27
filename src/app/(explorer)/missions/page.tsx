import { Metadata } from "next";
import { Rocket, Radio } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Space Missions & Exploration — CELESTIAL",
  description: "Explore humanity's scientific voyages, space telescopes, and planetary probes.",
};

export default function MissionsPage() {
  return (
    <div className="flex-1 py-10">
      <Container size="xl" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-celestial-emerald" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Space Missions & Spacecraft
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Historical and active missions from NASA, ESA, JAXA, and international agencies
            </p>
          </div>
          <Badge variant="emerald">EXPLORATION REGISTRY</Badge>
        </div>

        <EmptyState
          icon={<Radio className="w-10 h-10" />}
          title="Space Mission Trajectory Engine Ready"
          description="Mission data models and spacecraft relation contracts are established. Milestone timelines and orbital trajectories will be populated in Phase 3."
        />
      </Container>
    </div>
  );
}
