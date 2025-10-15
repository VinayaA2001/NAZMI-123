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

      /* Thin black accent lines */
      colors: {
        line: {
          soft: "rgba(0,0,0,.12)",
          strong: "rgba(0,0,0,.24)",
        },
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [
    // Lean spacing + border utilities
    function ({ addComponents, addBase, theme }) {
      addComponents({
        /* Use on big blocks instead of py-16/py-20 */
        ".section": {
          paddingTop: theme("spacing.8"),
          paddingBottom: theme("spacing.8"),
          "@screen md": { paddingTop: theme("spacing.10"), paddingBottom: theme("spacing.10") },
        },
        ".section-tight": {
          paddingTop: theme("spacing.6"),
          paddingBottom: theme("spacing.6"),
          "@screen md": { paddingTop: theme("spacing.8"), paddingBottom: theme("spacing.8") },
        },
        /* Extra tight when you want almost no gap */
        ".section-xs": {
          paddingTop: theme("spacing.4"),
          paddingBottom: theme("spacing.4"),
          "@screen md": { paddingTop: theme("spacing.6"), paddingBottom: theme("spacing.6") },
        },

        /* Clean divider line between sections */
        ".divider": {
          borderTopWidth: "1px",
          borderTopColor: theme("colors.line.soft"),
        },

        /* Classy card look with thin black border */
        ".card": {
          borderWidth: "1px",
          borderColor: theme("colors.line.strong"),
          borderRadius: theme("borderRadius.card"),
          boxShadow: theme("boxShadow.card"),
          backgroundColor: "#fff",
        },
      });

      // Trim default margins for headings/paragraphs/lists to kill big white gaps
      addBase({
        ".prose :where(h1,h2,h3,h4)": {
          marginTop: ".75em",
          marginBottom: ".45em",
        },
        ".prose :where(p,ul,ol)": {
          marginTop: ".35em",
          marginBottom: ".55em",
        },
        ".prose :where(ul,ol)": {
          paddingLeft: "1.1em",
        },

        /* Also nudge global defaults (even when not using .prose) */
        "h1,h2,h3,h4": { marginTop: "0.6em", marginBottom: "0.35em" },
        "p,ul,ol": { marginTop: "0.35rem", marginBottom: "0.55rem" },
        "ul,ol": { paddingLeft: "1.1em" },
      });
    },
  ],
};
