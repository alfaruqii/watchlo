import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      magnatbold: ["var(--font-magnatBold)"],
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
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar"),
    require("@vidstack/react/tailwind.cjs"),
  ],
  daisyui: {
    themes: ["black", "garden"],
  },
};
export default config;
