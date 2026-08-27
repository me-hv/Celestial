import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <Container size="sm" className="text-center space-y-6">
        <div className="inline-flex p-3 rounded-full bg-celestial-muted/80 border border-celestial-border text-celestial-cyan">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold font-mono text-celestial-starlight">404</h2>
          <h3 className="text-xl font-semibold text-celestial-starlight">Uncharted Coordinates</h3>
          <p className="text-sm text-celestial-subtle max-w-md mx-auto">
            The celestial body, system, or mission you requested does not exist in our scientific
            atlas.
          </p>
        </div>
        <div>
          <Link href="/">
            <Button variant="secondary" className="gap-2">
              <Compass className="w-4 h-4" />
              <span>Return to Solar Center</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
