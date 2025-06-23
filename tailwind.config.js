/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    {
      pattern: /(bg|border|text|hover:bg|shadow)-(slate|red|orange|green|emerald|cyan|blue|violet|pink)-(500|600|300|200)/,
    }
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
      },
      colors: {
        slate: {
          500: '#1e293b',
          600: '#0f172a',
          300: '#475569',
          200: '#64748b',
        },
        red: {
          500: '#991b1b',
          600: '#7f1d1d',
          300: '#dc2626',
          200: '#ef4444',
        },
        orange: {
          500: '#92400e',
          600: '#78350f',
          300: '#ea580c',
          200: '#f97316',
        },
        green: {
          500: '#3f6212',
          600: '#365314',
          300: '#65a30d',
          200: '#84cc16',
        },
        emerald: {
          500: '#065f46',
          600: '#064e3b',
          300: '#10b981',
          200: '#34d399',
        },
        cyan: {
          500: '#155e75',
          600: '#164e63',
          300: '#0891b2',
          200: '#22d3ee',
        },
        blue: {
          500: '#1e40af',
          600: '#1e3a8a',
          300: '#3b82f6',
          200: '#60a5fa',
        },
        violet: {
          500: '#6b21a8',
          600: '#581c87',
          300: '#8b5cf6',
          200: '#a78bfa',
        },
        pink: {
          500: '#9d174d',
          600: '#831843',
          300: '#ec4899',
          200: '#f472b6',
        },
      }
    },
  },
  plugins: [],
}

