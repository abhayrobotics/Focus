/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // User custom design tokens
        background: '#0F141A',
        surface: '#141B22',
        card: '#19232C',
        cardHover: '#202C36',
        border: '#293641',

        textPrimary: '#E8EEF2',
        textSecondary: '#9BAAB5',
        textMuted: '#64727D',

        primary: '#4CC9B0',
        primaryHover: '#63D8C0',

        success: '#72D572',
        warning: '#E5B85C',
        danger: '#E57373',
        info: '#6FA8DC',
        focus: '#8B9CF6',

        // Dark tokens mapped to custom palette
        dark: {
          950: '#0F141A', // background
          900: '#141B22', // surface
          850: '#19232C', // card
          800: '#293641', // border
          750: '#202C36', // cardHover
          700: '#293641', // border
          600: '#64727D', // textMuted
          500: '#9BAAB5', // textSecondary
          400: '#E8EEF2', // textPrimary
          300: '#F0F4F8',
          200: '#F8FAFC',
          100: '#FFFFFF',
        },
        // Brand tokens mapped to primary (#4CC9B0) & primaryHover (#63D8C0)
        brand: {
          50: '#E6F8F5',
          100: '#C2EFEB',
          200: '#99E5DE',
          300: '#70DBD0',
          400: '#63D8C0', // primaryHover
          500: '#4CC9B0', // primary
          600: '#3BB59D',
          700: '#2E9480',
          800: '#237363',
          900: '#174F44',
          950: '#0E2E28',
        },
        // Slate mapping to match textPrimary / textSecondary / textMuted
        slate: {
          50: '#F8FAFC',
          100: '#E8EEF2',
          200: '#D5DFE6',
          300: '#B8C6D1',
          400: '#9BAAB5', // textSecondary
          500: '#64727D', // textMuted
          600: '#4A5661',
          700: '#293641', // border
          800: '#202C36', // cardHover
          850: '#19232C', // card
          900: '#141B22', // surface
          950: '#0F141A', // background
        },
        // Status colors mapped to exact palette
        emerald: {
          400: '#8AE08A',
          500: '#72D572', // success
          600: '#5CBF5C',
        },
        amber: {
          400: '#ECC675',
          500: '#E5B85C', // warning
          600: '#CFA043',
        },
        rose: {
          400: '#EE8E8E',
          500: '#E57373', // danger
          600: '#D35858',
          950: '#2A1416',
        },
        blue: {
          400: '#89BCED',
          500: '#6FA8DC', // info
          600: '#558FC4',
        },
        indigo: {
          400: '#A4B2F8',
          500: '#8B9CF6', // focus
          600: '#7283E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
