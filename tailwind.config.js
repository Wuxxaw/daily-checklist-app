/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    {
      pattern: /(bg|border|text|hover:bg)-(red|blue|green|yellow|purple|pink)-(500|600)/,
    }
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '14': 'repeat(14, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}

