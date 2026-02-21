/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2174d4',
          hover: '#3b8eed',
          light: '#E8E9FF',
          lighter: '#C7CBFF',
        },
        background: {
          DEFAULT: '#F7F8FC',
          card: '#FFFFFF',
        },
        text: {
          primary: '#1A1D1F',
          secondary: '#6F767E',
        },
        border: {
          DEFAULT: '#E6E8EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
