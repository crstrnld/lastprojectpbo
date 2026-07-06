/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F0',
        card: '#F1ECE0',
        ink: '#1F2A24',
        forest: {
          DEFAULT: '#1B4332',
          light: '#2F5233',
          dark: '#10281D',
        },
        brass: {
          DEFAULT: '#B08D57',
          light: '#D9BE8F',
          dark: '#8A6C3F',
        },
        border: '#D8CBB4',
        rust: '#A6402B',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(31, 42, 34, 0.06), 0 4px 12px rgba(31, 42, 34, 0.05)',
      },
    },
  },
  plugins: [],
};
