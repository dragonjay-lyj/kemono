/** @type {import('tailwindcss').Config} */

const { heroui } = require("@heroui/react");

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()]
};