/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#6366f1',  // indigo-500
          secondary: '#8b5cf6',  // violet-500
          accent:    '#06b6d4',  // cyan-500
        },
        surface: {
          DEFAULT: '#0f172a',    // slate-900
          card:    '#1e293b',    // slate-800
          glass:   'rgba(30,41,59,0.6)',
        },
      },
      backdropBlur: { glass: '12px' },
    },
  },
  plugins: [],
};
