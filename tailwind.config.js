/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  darkMode: 'media', // Enable dark mode based on system preference
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
};

