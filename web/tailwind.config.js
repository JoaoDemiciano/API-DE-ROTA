/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb',
          DEFAULT: '#1d4ed8',
          dark: '#1e40af'
        }
      }
    }
  },
  plugins: []
};
