/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d53f8c',
          strong: '#9d2765',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#111827',
          foreground: '#f9fafb',
        },
        background: '#f8fafc',
        foreground: '#0f172a',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        success: {
          DEFAULT: '#16a34a',
          foreground: '#ecfdf3',
        },
        error: {
          DEFAULT: '#dc2626',
          foreground: '#fef2f2',
        },
        warning: {
          DEFAULT: '#cea500',
          foreground: '#1f2937',
        },
        info: {
          DEFAULT: '#0ea5e9',
          foreground: '#ecfeff',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f1f5f9',
        },
        border: '#e2e8f0',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
