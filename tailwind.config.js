/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      main: '#e4e4e4',
      main_hover: '#d1d1d1',
      select: '#AFFFB7',
      select_hover: '#7dff8a',
      edit: '#EAEAEA',
      
    },
    extend: {},
  },
  plugins: [],
}