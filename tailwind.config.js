/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Poppins', ...require('tailwindcss/defaultTheme').fontFamily.sans],
    },
  },
  plugins: [],
}

