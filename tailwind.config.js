// tailwind.config.js
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],

  darkMode: "class",
  plugins: [heroui({
    themes: {
      "dark": {
        colors: {
          background: '#252a33',
          foreground: '#e5e5e5',
          cardBg: '#21212b',
        },
      },
        "light": {
          colors: {
            background: '#c8dafa',
            foreground: '#333333',
            cardBg: '#ffffff',
          },
      }
    }
  })],
}

export default config;