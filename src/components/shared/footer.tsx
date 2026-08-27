import { Container } from "../ui/container";

export function Footer() {
  return (
    <footer className="border-t border-celestial-muted/50 bg-celestial-void/90 py-8 text-xs text-celestial-subtle">
      <Container size="xl" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-celestial-starlight">CELESTIAL</span>
          <span>— Astronomical Atlas & Exploration Platform</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span>PHASE 0 FOUNDATION</span>
          <span className="text-celestial-muted">|</span>
          <span className="text-celestial-cyan">NASA / ESA / IAU PROVENANCE READY</span>
        </div>
      </Container>
    </footer>
  );
}
