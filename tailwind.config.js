/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1F234C',
        gold: '#C5A947',
        pure_gold: '#bfa14f',
        light: '#F4F4F4',
      },
    },
  },
  plugins: [],
};