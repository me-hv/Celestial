import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-celestial-void font-sans text-celestial-starlight antialiased selection:bg-celestial-cyan/20 selection:text-celestial-cyan">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
