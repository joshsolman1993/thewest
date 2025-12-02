/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leather: {
          darkest: '#1A0F0A',
          dark: '#3E2816',
          DEFAULT: '#6B4423',
          light: '#A0745C',
        },
        parchment: {
          dark: '#DCC9A8',
          DEFAULT: '#F4E8D8',
          light: '#FFF9ED',
        },
        dust: '#C9B88D',
        gold: {
          DEFAULT: '#D4AF37',
          bright: '#FFD700',
        },
        brass: '#B87333',
        blood: '#8B0000',
      },
      fontFamily: {
        display: ['Rye', 'cursive'],
        heading: ['Playfair Display', 'serif'],
        body: ['Merriweather', 'serif'],
        ui: ['Lato', 'sans-serif'],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.5rem',
        '6': '2rem',
        '8': '3rem',
        '10': '4rem',
      },
      boxShadow: {
        'western-sm': '0 1px 3px rgba(0,0,0,0.3)',
        'western-md': '0 4px 8px rgba(0,0,0,0.4)',
        'western-lg': '0 8px 16px rgba(0,0,0,0.5)',
        'western-xl': '0 12px 24px rgba(0,0,0,0.6)',
        'western-inset': 'inset 0 2px 4px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
