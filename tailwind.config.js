/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#fbbf24',
          hover: '#f59e0b',
        },
        'gold-hover': '#f59e0b',
        charcoal: {
          DEFAULT: '#1a1a1a',
          100: '#f5f5f5',
          300: '#a3a3a3',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        radial: 'radial-gradient(var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        gold: '0 8px 30px rgba(251, 191, 36, 0.2)',
        'gold-sm': '0 4px 20px rgba(251, 191, 36, 0.15)',
      },
    },
  },
  plugins: [],
}
