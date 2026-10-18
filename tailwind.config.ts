import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      display: ["var(--font-display)", "var(--font-magnatBold)", "sans-serif"],
      mono: ["var(--font-mono)", "monospace"],
      magnatbold: ["var(--font-display)", "var(--font-magnatBold)", "sans-serif"],
    },
    container: {
      screens: {
        lg: "100%",
        xl: "100%",
        "2xl": "100%",
        "3xl": "100%",
        "4xl": "100%",
        "5xl": "1920px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        muted: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--muted-foreground)",
        },
        gold: "var(--accent-gold)",
        vermilion: "var(--accent-vermilion)",
        hairline: "var(--border-hairline)",
      },
      boxShadow: {
        sleeve: "0 14px 34px -10px rgba(0, 0, 0, 0.55)",
        "sleeve-light": "0 12px 28px -10px rgba(20, 18, 16, 0.16)",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("@vidstack/react/tailwind.cjs"),
  ],
};
export default config;
