/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fa',
          100: '#d9e2f2',
          200: '#b3c6e5',
          300: '#8ca9d8',
          400: '#668dcb',
          500: '#4070be',
          600: '#1D3557', // primary main
          700: '#162a46',
          800: '#0f1e34',
          900: '#080f23',
        },
        secondary: {
          50: '#edf7f6',
          100: '#d0ebe7',
          200: '#a1d7cf',
          300: '#72c3b8',
          400: '#43afa0',
          500: '#2A9D8F', // secondary main
          600: '#227e72',
          700: '#195e55',
          800: '#113f39',
          900: '#081f1c',
        },
        accent: {
          50: '#fef2ee',
          100: '#fcdfd3',
          200: '#f9c0a7',
          300: '#f5a07b',
          400: '#f2814f',
          500: '#E76F51', // accent main
          600: '#b95841',
          700: '#8b4231',
          800: '#5c2c20',
          900: '#2e1610',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};