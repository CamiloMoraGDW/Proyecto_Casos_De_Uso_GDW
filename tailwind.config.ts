import animations from '@midudev/tailwind-animations'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gdwAzul': '#0471a2',
        'gdwNegro': '#141414'
      },
    },
  },
  plugins: [animations],
};
