import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        celestial: {
          void: "#030712", // deepest cosmic void black
          deep: "#070b14", // deep space background layer
          surface: "#0f172a", // elevated surface layer
          elevated: "#1e293b", // higher elevation surface
          muted: "#1e293b", // subdued borders and neutral fills
          border: "#334155", // subtle orbital line & border
          subtle: "#94a3b8", // secondary scientific typography
          starlight: "#f8fafc", // crisp bright primary starlight typography
          cyan: {
            DEFAULT: "#38bdf8", // primary astronomical accent
            glow: "#0ea5e9",
            dim: "#0369a1",
          },
          violet: {
            DEFAULT: "#a855f7", // deep sky nebula accent
            glow: "#9333ea",
            dim: "#581c87",
          },
          amber: {
            DEFAULT: "#f59e0b", // stellar class & warning accent
            glow: "#d97706",
            dim: "#78350f",
          },
          emerald: {
            DEFAULT: "#10b981", // active telemetry & confirmation
            glow: "#059669",
            dim: "#064e3b",
          },
          rose: {
            DEFAULT: "#f43f5e", // cosmic horizon & critical alert
            glow: "#e11d48",
            dim: "#881337",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "cosmic-gradient":
          "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(56, 189, 248, 0.12), rgba(255, 255, 255, 0))",
        "cosmic-radial":
          "radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.04) 45%, rgba(3, 7, 18, 0) 80%)",
        "deep-space":
          "linear-gradient(to bottom, #030712 0%, #070b14 40%, #0b0f19 70%, #030712 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -4px rgba(56, 189, 248, 0.35)",
        "glow-violet": "0 0 25px -4px rgba(168, 85, 247, 0.35)",
        "glow-amber": "0 0 25px -4px rgba(245, 158, 11, 0.35)",
        "glow-emerald": "0 0 25px -4px rgba(16, 185, 129, 0.35)",
        "subtle-card": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "elevated-card": "0 16px 48px -8px rgba(0, 0, 0, 0.6)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-slow": "pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
