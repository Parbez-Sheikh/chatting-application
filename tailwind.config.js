/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#B33771',
        'secondery': '#82589F',
        'third': '##55E6C1',
      },
      fontFamily: {
        'Poppins': ['Poppins','sans-serif'],
      },
    },
  },
  plugins: [],
}
