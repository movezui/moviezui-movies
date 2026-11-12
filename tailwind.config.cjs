// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette
        primary: "#FFD21F",
        secondary: "#E52525",
        background: "#08090D",
        backgroundSecondary: "#11131A",
        card: "#171922",
        "primary-text": "#FFFFFF",
        "secondary-text": "#A5A7B0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
