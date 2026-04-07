/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{html,js,jsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
};
