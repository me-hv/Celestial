import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { organizationRepo } from "@/lib/data/organization-repository";
import { datasetRepo } from "@/lib/data/dataset-repository";
import { ORGANIZATIONS_DATA } from "@/lib/data/organization-data";
import { OrganizationContributions } from "@/features/organization/components/OrganizationContributions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Building2,
  Rocket,
  Lightbulb,
  Database,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface OrganizationProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ORGANIZATIONS_DATA.map((org) => ({
    slug: org.slug,
  }));
}

export default async function OrganizationProfilePage({ params }: OrganizationProfilePageProps) {
  const { slug } = await params;
  const org = organizationRepo.getBySlug(slug);

  if (!org) {
    notFound();
  }

  const missions = organizationRepo.getMissionsForOrganization(org.slug);
  const spacecraft = organizationRepo.getSpacecraftForOrganization(org.slug);
  const instruments = organizationRepo.getInstrumentsForOrganization(org.slug);
  const discoveries = organizationRepo.getDiscoveriesForOrganization(org.slug);
  const datasets = datasetRepo.getByOrganization(org.slug);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/organizations"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Global Organizations Registry
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono uppercase bg-muted/40">
              {org.region.replace("_", " ")}
            </Badge>
            <Badge variant="default" className="text-xs uppercase font-semibold">
              {org.organizationType.replace(/_/g, " ")}
            </Badge>
            {org.isHistorical && (
              <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/40">
                Historical ({org.historicalPeriod || "Historical"})
              </Badge>
            )}
          </div>

          {org.officialWebsite && (
            <a
              href={org.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Official Portal
            </a>
          )}
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {org.officialName} ({org.shortName})
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            {org.country} • Founded {org.foundedYear || "N/A"}{" "}
            {org.headquarters ? `• Headquarters: ${org.headquarters}` : ""}
          </p>
        </div>

        <p className="text-foreground/90 max-w-4xl text-sm sm:text-base leading-relaxed">
          {org.description}
        </p>

        {org.primaryFocusAreas && org.primaryFocusAreas.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-1.5">
            {org.primaryFocusAreas.map((area, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full text-xs font-mono bg-muted/60 text-muted-foreground"
              >
                {area}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contributions Breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">
          Space Science & Exploration Contributions
        </h2>
        <OrganizationContributions
          missions={missions}
          spacecraft={spacecraft}
          instruments={instruments}
          discoveries={discoveries}
        />
      </div>

      {/* Missions Fleet */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          Missions & Spacecraft Programmes ({missions.length})
        </h2>

        {missions.length === 0 ? (
          <div className="p-8 text-center border border-dashed rounded-xl text-muted-foreground text-xs">
            No direct spaceflight missions currently indexed for this research organization.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className="border-border/40 hover:border-primary/50 transition-colors bg-card/40"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {mission.type}
                    </Badge>
                    <Badge
                      variant={mission.status === "ACTIVE" ? "emerald" : "outline"}
                      className="text-[10px] uppercase font-semibold"
                    >
                      {mission.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold">
                    <Link href={`/missions/${mission.slug}`} className="hover:underline">
                      {mission.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Target: {mission.destination} • Launch:{" "}
                    {new Date(mission.launchDate).getFullYear()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-3">
                  <p className="line-clamp-2">{mission.summary}</p>
                  <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                    <Link
                      href={`/missions/${mission.slug}`}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      View Mission Profile →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Key Scientific Discoveries */}
      {discoveries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Key Scientific Discoveries ({discoveries.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoveries.map((disc) => (
              <Card key={disc.id} className="border-border/40 bg-card/40">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{disc.date}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-amber-400 border-amber-400/30 font-mono"
                    >
                      {disc.discoveryType}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    <Link href={`/missions/discoveries/${disc.slug}`} className="hover:underline">
                      {disc.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-2">
                  <p>{disc.description}</p>
                  <p className="text-foreground/80 font-medium">
                    <span className="text-primary font-semibold">Significance:</span>{" "}
                    {disc.scientificSignificance}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Authenticated Scientific Datasets */}
      {datasets && datasets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Primary Scientific Datasets ({datasets.length})
            </h2>
            <Link
              href={`/datasets`}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              Explore Global Archive <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasets.map((ds) => (
              <Card key={ds.id} className="border-border/50 bg-card/50 hover:bg-card/70 transition">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono uppercase text-cyan-400 border-cyan-400/30"
                    >
                      {ds.discipline.replace(/_/g, " ")}
                    </Badge>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">
                      [{ds.wavelengthBand}]
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    <Link href={`/datasets/${ds.slug}`} className="hover:underline">
                      {ds.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {ds.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{ds.epistemicStatus}</span>
                  </div>
                  <Link
                    href={`/datasets/${ds.slug}`}
                    className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    View Dataset <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Data Archives & Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {org.dataArchives && org.dataArchives.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Public Science Data Archives
            </h2>
            <div className="space-y-2">
              {org.dataArchives.map((archive) => (
                <Card key={archive.id} className="border-border/40 bg-card/40">
                  <CardContent className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm">{archive.name}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-emerald-400 border-emerald-400/30"
                      >
                        {archive.accessLevel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{archive.description}</p>
                    <div className="pt-1">
                      <a
                        href={archive.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Access Data Repository
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {org.keyFacilities && org.keyFacilities.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-400" />
              Primary Space Centres & Launch Facilities
            </h2>
            <Card className="border-border/40 bg-card/40">
              <CardContent className="p-4 text-xs space-y-2">
                <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
                  {org.keyFacilities.map((facility, idx) => (
                    <li key={idx} className="text-foreground/90 font-medium">
                      {facility}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Provenance & Epistemic Status */}
      <div className="p-4 rounded-xl bg-card/30 border border-border/30 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Authoritative Source: {org.provenance.authoritativeBody} ({org.provenance.catalogName})
          </span>
        </div>
        <span className="font-mono text-[11px]">Verified: {org.provenance.retrievedAt}</span>
      </div>
    </div>
  );
}
