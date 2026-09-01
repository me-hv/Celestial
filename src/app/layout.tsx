import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CELESTIAL — Interactive Astronomical Exploration Platform",
  description:
    "Explore the universe with scientific precision. CELESTIAL is a web-based astronomical atlas, planetarium, and scientific exploration platform.",
  keywords: [
    "astronomy",
    "solar system",
    "planetarium",
    "space exploration",
    "celestial objects",
    "exoplanets",
    "stars",
    "galaxies",
    "cosmic web",
    "observable universe",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-celestial-void font-sans text-celestial-starlight antialiased selection:bg-celestial-cyan/20 selection:text-celestial-cyan overflow-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
