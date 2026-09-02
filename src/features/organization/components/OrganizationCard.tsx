"use client";

import React from "react";
import Link from "next/link";
import { Organization } from "@/domain/organization/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Rocket, Compass, ExternalLink } from "lucide-react";

interface OrganizationCardProps {
  organization: Organization;
  missionCount?: number;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  missionCount = 0,
}) => {
  const typeLabelMap: Record<string, string> = {
    SPACE_AGENCY: "Space Agency",
    GOVERNMENT_RESEARCH_ORGANIZATION: "Govt Research Org",
    NATIONAL_RESEARCH_INSTITUTE: "National Institute",
    UNIVERSITY: "University",
    OBSERVATORY: "Observatory",
    INTERNATIONAL_ORGANIZATION: "International Org",
    SCIENTIFIC_CONSORTIUM: "Scientific Consortium",
    COMMERCIAL_SPACE_COMPANY: "Commercial Company",
    MISSION_CONSORTIUM: "Mission Consortium",
    OTHER_RESEARCH_ORGANIZATION: "Research Org",
  };

  const regionLabelMap: Record<string, string> = {
    NORTH_AMERICA: "North America",
    EUROPE: "Europe",
    ASIA_PACIFIC: "Asia-Pacific",
    SOUTH_ASIA: "South Asia",
    MIDDLE_EAST: "Middle East",
    LATIN_AMERICA: "Latin America",
    AFRICA: "Africa",
    INTERNATIONAL: "Global Consortium",
  };

  return (
    <Card className="h-full flex flex-col justify-between border-border/40 hover:border-primary/50 transition-colors bg-card/60 backdrop-blur-sm group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs bg-muted/40 font-mono">
            {regionLabelMap[organization.region] || organization.region}
          </Badge>
          <Badge
            variant={organization.organizationType === "SPACE_AGENCY" ? "cyan" : "default"}
            className="text-[10px] uppercase font-semibold tracking-wider"
          >
            {typeLabelMap[organization.organizationType] || organization.organizationType}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors flex items-center justify-between">
          <Link href={`/organizations/${organization.slug}`} className="hover:underline">
            {organization.shortName}
          </Link>
          {organization.isHistorical && (
            <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">
              Historical ({organization.historicalPeriod || "Historical"})
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-1">
          {organization.officialName}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4 text-xs">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {organization.summary || organization.description}
        </p>

        <div className="space-y-2 pt-2 border-t border-border/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary/70" />
              {organization.country}
            </span>
            {organization.foundedYear && (
              <span className="font-mono text-[11px]">Est. {organization.foundedYear}</span>
            )}
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-primary/70" />
              Connected Missions
            </span>
            <span className="font-mono font-semibold text-foreground">{missionCount}</span>
          </div>

          {organization.primaryFocusAreas && organization.primaryFocusAreas.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {organization.primaryFocusAreas.slice(0, 3).map((focus, idx) => (
                <span
                  key={idx}
                  className="inline-block px-1.5 py-0.5 rounded bg-muted/60 text-[10px] text-muted-foreground font-mono"
                >
                  {focus}
                </span>
              ))}
              {organization.primaryFocusAreas.length > 3 && (
                <span className="inline-block px-1.5 py-0.5 rounded bg-muted/30 text-[10px] text-muted-foreground">
                  +{organization.primaryFocusAreas.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-3 flex items-center justify-between">
          <Link
            href={`/organizations/${organization.slug}`}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            View Profile & Fleet
          </Link>
          {organization.officialWebsite && (
            <a
              href={organization.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Portal
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
