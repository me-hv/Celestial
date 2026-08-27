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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        celestial: {
          void: "#030712", // deepest space black
          deep: "#0B0F19", // deep space background
          surface: "#111827", // elevated surface
          muted: "#1F2937", // subdued card/border
          border: "#374151", // subtle orbital line
          subtle: "#9CA3AF", // secondary scientific text
          starlight: "#F9FAFB", // crisp bright primary text
          cyan: {
            DEFAULT: "#38BDF8", // primary scientific accent
            glow: "#0284C7",
            dim: "#0C4A6E",
          },
          violet: {
            DEFAULT: "#A855F7", // deep sky accent
            glow: "#7E22CE",
            dim: "#3B0764",
          },
          amber: {
            DEFAULT: "#F59E0B", // stellar class / warning accent
            glow: "#D97706",
            dim: "#78350F",
          },
          emerald: {
            DEFAULT: "#10B981", // active/success mission status
            glow: "#059669",
            dim: "#064E3B",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "cosmic-gradient":
          "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(56, 189, 248, 0.15), rgba(255, 255, 255, 0))",
        "deep-space":
          "linear-gradient(to bottom, #030712, #0B0F19 50%, #030712 100%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(56, 189, 248, 0.3)",
        "glow-violet": "0 0 25px -5px rgba(168, 85, 247, 0.3)",
        "subtle-card": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
