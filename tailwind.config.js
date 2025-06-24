/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: ['bg-navy', 'text-navy'],
  theme: {
    extend: {
      colors: {
        navy: '#4A6FA5',
        gold: '#C5A947',
        pure_gold: '#bfa14f',
        light: '#F4F4F4',
      },
    },
  },
  plugins: [],
};