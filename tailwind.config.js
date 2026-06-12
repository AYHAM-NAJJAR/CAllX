/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: "#101B22",
        customButton:'#0D9EF2'
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}

