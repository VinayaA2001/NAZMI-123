/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      /* Centered container with consistent padding */
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "1.25rem",
        },
        screens: {
          lg: "1120px",
        },
      },

      /* Boutique-style card shadows */
      boxShadow: {
        card: "0 6px 30px -12px rgba(0,0,0,.15)",
      },

      /* Font families pulled from next/font variables */
      fontFamily: {
        sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};
