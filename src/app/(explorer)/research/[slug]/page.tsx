import React from "react";
import { notFound } from "next/navigation";
import { TargetIntelligenceEngine } from "@/lib/astronomy/research/target-intelligence-engine";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { TargetIntelligencePanel } from "@/features/research/components/TargetIntelligencePanel";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResearchTargetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "m31-andromeda-galaxy" },
    { slug: "mars" },
    { slug: "jupiter" },
    { slug: "m42-orion-nebula" },
    { slug: "sirius" },
    { slug: "trappist-1" },
    { slug: "james-webb-space-telescope" },
    { slug: "w-m-keck-observatory" },
  ];
}

export default async function ResearchTargetPage({ params }: ResearchTargetPageProps) {
  const { slug } = await params;
  const report = TargetIntelligenceEngine.generateReport(slug, PRESET_OBSERVER_LOCATIONS[0]);

  if (!report) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
          <Link href="/research">
            <ArrowLeft className="w-4 h-4" /> All Research Targets
          </Link>
        </Button>
        <Badge variant="cyan" className="font-mono text-xs uppercase">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Direct Intelligence Profile
        </Badge>
      </div>

      <div className="max-w-5xl mx-auto">
        <TargetIntelligencePanel report={report} />
      </div>
    </div>
  );
}
