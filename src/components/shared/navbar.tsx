"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Orbit, Rocket, Sparkles, Telescope } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Container } from "../ui/container";

const NAV_ITEMS = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/sky", label: "Sky", icon: Telescope },
  { href: "/objects", label: "Objects", icon: Orbit },
  { href: "/missions", label: "Missions", icon: Rocket },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-celestial-muted/70 bg-celestial-void/80 backdrop-blur-md">
      <Container size="xl" className="flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-celestial-starlight hover:opacity-90 transition-opacity focus:outline-none"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-celestial-cyan/10 border border-celestial-cyan/40 text-celestial-cyan shadow-glow-cyan">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-mono text-base font-bold tracking-widest text-celestial-starlight uppercase">
            CELESTIAL
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-celestial-surface text-celestial-cyan border border-celestial-cyan/30"
                    : "text-celestial-subtle hover:text-celestial-starlight hover:bg-celestial-surface/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
