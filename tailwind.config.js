/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-dark': '#1E3A8A',
        'primary-light': '#DBEAFE',
        'primary-bg': '#EFF6FF',
      },
      fontFamily: {
        body: ['Poppins', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
