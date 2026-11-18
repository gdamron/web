import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--foreground-rgb)",
        background: "var(--background-rgb)",
        accent: "var(--accent-rgb)",
        anchor: "var(--link-rgb)",
        menu: "var(--menu-rgb)",
        muted: "var(--muted-rgb)",
        rule: "var(--rule-rgb)",
      },
      fontFamily: {
        headline: ["var(--font-special-elite)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
