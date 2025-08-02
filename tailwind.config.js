/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: ['bg-mainblue', 'text-mainblue', 'hover:text-mainblue', 'hover:bg-mainblue'],
  theme: {
    extend: {
      colors: {
        mainblue: '#1F234C',
        gold: '#C5A947',
        puregold: '#bfa14f',
        light: '#F4F4F4',
      },
    },
  },
  plugins: [],
};