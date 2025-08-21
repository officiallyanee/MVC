import tailwindScrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        extend: {
            colors: {
                custom: {
                    DEFAULT: '#0D3C17',
                    light: '#d1fae5',
                },
            },
        },
    },
  plugins: [
    tailwindScrollbar({ nocompatible: true }),
  ],
}