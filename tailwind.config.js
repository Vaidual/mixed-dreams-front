/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('@tailwindcss/forms'),
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

