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
        primary: "#fff",
        accent: "#f0f",
      },
      fontFamily: {
        headline: ["var(--font-special-elite)", "sans"],
      },
    },
  },
  plugins: [],
};
export default config;
