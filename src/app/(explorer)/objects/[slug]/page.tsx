import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Orbit } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ObjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ObjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const capitalized = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${capitalized} — CELESTIAL Object Atlas`,
    description: `Scientific parameters, orbital mechanics, and observations for ${slug}.`,
  };
}

export default async function ObjectDetailPage({ params }: ObjectDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="flex-1 py-10">
      <Container size="lg" className="space-y-6">
        <div>
          <Link href="/objects">
            <Button variant="ghost" size="sm" className="gap-2 text-celestial-subtle">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Atlas</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between border-b border-celestial-muted pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Orbit className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-3xl font-bold font-mono text-celestial-starlight capitalize">
                {slug.replace(/-/g, " ")}
              </h1>
            </div>
            <p className="text-xs font-mono text-celestial-subtle">CANONICAL SLUG: {slug}</p>
          </div>
          <Badge variant="cyan">ASTRONOMICAL RECORD</Badge>
        </div>

        <Card elevated>
          <CardHeader>
            <CardTitle>Telemetry & Physical Characteristics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-celestial-subtle">
            <p>
              Object detail route established. In Phase 1, this view will render live JPL Horizons
              ephemeris data, Keplerian orbit visualizers, and atmospheric compositions.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
