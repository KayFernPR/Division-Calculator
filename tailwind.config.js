/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1fde9',
          100: '#defacc',
          200: '#bdf4a0',
          300: '#93ea6d',
          400: '#73df4b',
          500: '#63D43E', // Brand green
          600: '#4db32f',
          700: '#3d8d26',
          800: '#2f6b1e',
          900: '#254f18',
        },
        neutral: {
          50: '#fdfcfb',
          100: '#f9f7f6',
          200: '#f3f0ee',
          300: '#ebe6e3', // Light neutral
          400: '#d4ccc8',
          500: '#907c6d', // Main neutral
          600: '#7a6a5d',
          700: '#5f5248',
          800: '#4a3f38',
          900: '#3d332e',
        },
        success: {
          50: '#f1fde9',
          100: '#defacc',
          200: '#bdf4a0',
          300: '#93ea6d',
          400: '#73df4b',
          500: '#63D43E',
          600: '#4db32f',
          700: '#3d8d26',
          800: '#2f6b1e',
          900: '#254f18',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 