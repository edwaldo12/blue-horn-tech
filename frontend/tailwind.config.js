/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        careviah: {
          primary: '#0a6f5f',
          secondary: '#fbbf24',
          accent: '#ff8c00',
          neutral: '#1f2937',
          'base-100': '#f5f7fb',
          info: '#2563eb',
          success: '#16a34a',
          warning: '#f97316',
          error: '#ef4444',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
