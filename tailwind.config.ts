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
        selfit: {
          bg: "#FFF5F7",
          pink: "#FF85A1",
          "pink-light": "#FFB3C1",
          "pink-dark": "#E86B8A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
