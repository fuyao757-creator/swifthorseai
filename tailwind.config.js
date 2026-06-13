/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        paper: {
          DEFAULT: "#f7f8fb",
          dark: "#04060c",
        },
        ink: {
          DEFAULT: "#0c1222",
          muted: "#4b5563",
          faint: "#6b7280",
        },
        cinnabar: {
          DEFAULT: "#e11d48",
          light: "#fb7185",
          dark: "#be123c",
        },
        jade: {
          DEFAULT: "#0d9488",
          light: "#2dd4bf",
        },
        tech: {
          cyan: "#06b6d4",
          line: "rgba(6, 182, 212, 0.35)",
        },
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
      },
      boxShadow: {
        soft: "0 2px 16px -2px rgba(12, 18, 34, 0.06)",
        "soft-lg": "0 16px 40px -10px rgba(12, 18, 34, 0.1)",
        "soft-xl": "0 24px 56px -14px rgba(12, 18, 34, 0.14)",
        glow: "0 0 40px -10px rgba(225, 29, 72, 0.35)",
        "glow-cyan": "0 0 32px -10px rgba(6, 182, 212, 0.22)",
        "glow-jade": "0 0 32px -8px rgba(13, 148, 136, 0.25)",
        glass: "0 8px 40px rgba(0, 0, 0, 0.06)",
        hero: "0 20px 64px -24px rgba(12, 18, 34, 0.1), 0 0 0 1px rgba(255,255,255,0.65) inset",
        panel: "0 0 0 1px rgba(15, 23, 42, 0.06), 0 16px 48px -16px rgba(12, 18, 34, 0.1)",
        nav: "0 4px 24px -4px rgba(12, 18, 34, 0.06), 0 0 0 1px rgba(255,255,255,0.75)",
        editorial: "0 1px 2px rgba(12, 18, 34, 0.04), 0 8px 24px -8px rgba(12, 18, 34, 0.08)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(ellipse 70% 50% at 0% -5%, rgba(6, 182, 212, 0.045) 0%, transparent 52%), radial-gradient(ellipse 60% 45% at 100% 5%, rgba(99, 102, 241, 0.035) 0%, transparent 48%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(139, 92, 246, 0.025) 0%, transparent 50%)",
        "mesh-dark":
          "radial-gradient(ellipse 70% 50% at 0% -5%, rgba(6, 182, 212, 0.08) 0%, transparent 52%), radial-gradient(ellipse 60% 45% at 100% 5%, rgba(99, 102, 241, 0.06) 0%, transparent 48%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)",
        "gradient-brand": "linear-gradient(135deg, #0891b2 0%, #4f46e5 55%, #6366f1 100%)",
        "gradient-tech": "linear-gradient(90deg, #0891b2, #4f46e5)",
        "grid-tech":
          "linear-gradient(rgba(71,85,105,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        float: "float 16s ease-in-out infinite",
        shimmer: "shimmer 9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.05)" },
        },
        shimmer: {
          "0%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
          "100%": { opacity: "0.4" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
