/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#BDB76B', // Cor para detalhes
        navy: '#000080', // Cor para títulos e botões
      },
    },
  },
  plugins: [],
};