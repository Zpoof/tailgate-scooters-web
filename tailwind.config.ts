import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cornell: {
          red: "#B31B1B",
          darkred: "#8B0000", 
          lightred: "#D33636",
          gray: "#222222",
          lightgray: "#F7F7F7",
        },
        primary: "#0ea5e9", // sky-500
        "primary-dark": "#0284c7", // sky-600
        destructive: "#ef4444",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
