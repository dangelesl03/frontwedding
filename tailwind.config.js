/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqua': {
          50: '#f5f7f2',
          100: '#e8ede0',
          200: '#d1dbc1',
          300: '#bac3a2',
          400: '#a3ab83',
          500: '#6B7E2E', // Verde olivo principal rgb(107, 126, 46)
          600: '#5a6a26',
          700: '#49561f',
          800: '#384217',
          900: '#272e0f',
        },
      },
    },
  },
  plugins: [],
}
