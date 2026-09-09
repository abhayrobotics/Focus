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

        primary: '#0F766E',
        primaryHover: '#115E59',

        success: '#0F766E',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#0284C7',
        focus: '#0F766E',

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
        // Unified High-contrast Green/Brand/Emerald/Teal tokens
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E', // High-contrast primary button green (6.2:1 with white)
          700: '#115E59', // Darker hover
          800: '#134E4A',
          900: '#042F2E',
          950: '#021B1A',
        },
        emerald: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E', // exact same green as brand-600
          700: '#115E59',
          800: '#134E4A',
          900: '#042F2E',
          950: '#021B1A',
        },
        green: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E', // exact same green as brand-600
          700: '#115E59',
          800: '#134E4A',
          900: '#042F2E',
          950: '#021B1A',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E', // exact same green as brand-600
          700: '#115E59',
          800: '#134E4A',
          900: '#042F2E',
          950: '#021B1A',
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
