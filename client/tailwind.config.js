/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#123D2A',
          dark: '#0B2D1E',
          light: '#1B543B',
        },
        sage: {
          DEFAULT: '#789B72',
          light: '#A3BE9E',
          soft: '#EAF1E8',
        },
        cream: {
          DEFAULT: '#F7F2E8',
          light: '#FFFDF8',
          dark: '#EAE1D2',
        },
        gold: {
          DEFAULT: '#C49A52',
          light: '#DAB877',
          dark: '#A37A35',
        },
        earth: {
          DEFAULT: '#7A6248',
          dark: '#5A4633',
        },
        ayurvedaText: '#243229',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(18, 61, 42, 0.08)',
        card: '0 10px 30px -5px rgba(18, 61, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
