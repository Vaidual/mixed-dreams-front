/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  important: '#root',
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require("daisyui"),
    //require('@tailwindcss/forms'),
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },

}

