/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#7c3aed',
          light:   '#8b5cf6',
          dim:     'rgba(124,58,237,0.15)',
          glow:    'rgba(124,58,237,0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cta-dark':  'linear-gradient(135deg, #1a0533 0%, #0d0d0d 50%, #1a0533 100%)',
        'cta-light': 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 50%, #ddd6fe 100%)',
      },
    },
  },
  plugins: [],
};
