/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F6F0',
        dustyBlue: '#A7BBD6',
        blushPink: '#F7C8D1',
        sageGreen: '#A7B89F',
        champagneGold: '#D4AF37',
        warmCandle: '#FFE4B5',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

