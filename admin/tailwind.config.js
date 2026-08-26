/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#123D2A',
          dark: '#0B2D1E',
        },
        sage: {
          DEFAULT: '#789B72',
        },
        cream: {
          DEFAULT: '#F7F2E8',
        },
        gold: {
          DEFAULT: '#C49A52',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
