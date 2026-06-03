import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        base: '#edebe1',
        command: '#191816',
        gold: '#fdcc6a',
        wealth: '#986e2e',
        foundation: '#3a3226',
        surface: {
          DEFAULT: 'hsl(217, 25%, 14%)',
          deep: 'hsl(216, 26%, 11%)',
          alt: 'hsl(216, 21%, 19%)',
        },
        good: 'hsl(151, 63%, 48%)',
        bad: 'hsl(0, 77%, 58%)',
      },
    },
  },
  plugins: [],
};
export default config;
