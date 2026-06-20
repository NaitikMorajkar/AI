/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#534AB7',
          50: '#EDECF7',
          100: '#D8D5EF',
          200: '#B4ADE0',
          300: '#8C82CF',
          400: '#6A5FC1',
          500: '#534AB7',
          600: '#423A94',
          700: '#342E74',
          800: '#262252',
          900: '#181532',
        },
        success: {
          DEFAULT: '#0F6E56',
          50: '#E6F5F0',
          100: '#C3EADD',
          200: '#8DD4BF',
          300: '#52BC9D',
          400: '#2A9E7D',
          500: '#0F6E56',
          600: '#0C5A46',
          700: '#094535',
          800: '#062F24',
          900: '#031813',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
