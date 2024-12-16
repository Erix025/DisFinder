import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  themes: {
    light: {
      colors: {
        background: "#FFFFFF", // or DEFAULT
        foreground: "#11181C", // or 50 to 900 DEFAULT
        primary: {
          //... 50 to 900
          foreground: "#FFFFFF",
          DEFAULT: "#006FEE",
        },
        // ... rest of the colors
      },
    },
    dark: {
      colors: {
        background: "#000000", // or DEFAULT
        foreground: "#ECEDEE", // or 50 to 900 DEFAULT
        primary: {
          //... 50 to 900
          foreground: "#FFFFFF",
          DEFAULT: "#006FEE",
        },
      },
      // ... rest of the colors
    }
  },
  darkMode: "class",
  plugins: [require('@tailwindcss/typography'), nextui()],
} satisfies Config;
