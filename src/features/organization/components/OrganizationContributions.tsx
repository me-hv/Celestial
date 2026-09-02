"use client";

import React from "react";
import {
  SpaceMission,
  Spacecraft,
  MissionInstrument,
  ScientificDiscovery,
} from "@/domain/mission/types";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Satellite, Cpu, Lightbulb, Database, Globe } from "lucide-react";

interface OrganizationContributionsProps {
  missions: SpaceMission[];
  spacecraft: Spacecraft[];
  instruments: MissionInstrument[];
  discoveries: ScientificDiscovery[];
}

export const OrganizationContributions: React.FC<OrganizationContributionsProps> = ({
  missions,
  spacecraft,
  instruments,
  discoveries,
}) => {
  const planetaryMissions = missions.filter((m) =>
    [
      "PLANETARY_EXPLORATION",
      "LUNAR_EXPLORATION",
      "MARS_EXPLORATION",
      "SMALL_BODY_EXPLORATION",
      "ORBITER",
      "LANDER",
      "ROVER",
    ].includes(m.type)
  ).length;

  const astrophysicsMissions = missions.filter((m) =>
    ["ASTROPHYSICS", "COSMOLOGY", "SPACE_TELESCOPE", "SOLAR_PHYSICS", "ASTROMETRY"].includes(m.type)
  ).length;

  const activeMissions = missions.filter(
    (m) => m.status === "ACTIVE" || m.status === "EXTENDED"
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-3 text-center space-y-1">
          <div className="flex items-center justify-center text-primary mb-1">
            <Rocket className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono">{missions.length}</div>
          <div className="text-[11px] text-muted-foreground uppercase font-medium">
            Total Missions
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-3 text-center space-y-1">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <Globe className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">{activeMissions}</div>
          <div className="text-[11px] text-muted-foreground uppercase font-medium">
            Active Missions
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-3 text-center space-y-1">
          <div className="flex items-center justify-center text-cyan-400 mb-1">
            <Satellite className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono">{spacecraft.length}</div>
          <div className="text-[11px] text-muted-foreground uppercase font-medium">Spacecraft</div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-3 text-center space-y-1">
          <div className="flex items-center justify-center text-violet-400 mb-1">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono">{instruments.length}</div>
          <div className="text-[11px] text-muted-foreground uppercase font-medium">Instruments</div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-3 text-center space-y-1">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">{discoveries.length}</div>
          <div className="text-[11px] text-muted-foreground uppercase font-medium">Discoveries</div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/40">
        <CardContent className="p-3 text-center space-y-1">
          <div className="flex items-center justify-center text-indigo-400 mb-1">
            <Database className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-mono">
            {planetaryMissions + astrophysicsMissions}
          </div>
          <div className="text-[11px] text-muted-foreground uppercase font-medium">
            Science Fleets
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
