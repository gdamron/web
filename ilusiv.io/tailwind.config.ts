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
        primary: "rgb(var(--foreground-rgb))",
        accent: "rgb(var(--accent-rgb))",
      },
      fontFamily: {
        headline: ["var(--font-special-elite)", "sans"],
      },
    },
  },
  plugins: [],
};
export default config;
