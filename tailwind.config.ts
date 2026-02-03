import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sendmarc: {
          // Primary Blue Scale
          blue: {
            50: '#E6F0FA',
            100: '#CCE1F5',
            200: '#99C3EB',
            300: '#66A5E1',
            400: '#3387D7',
            500: '#0068D3',   // Primary - buttons, links
            600: '#0073EA',   // Hover state
            700: '#005BB5',
            800: '#004A94',
            900: '#003973',
            950: '#041221',   // Dark backgrounds (hero, results)
          },
          // Gray Scale
          gray: {
            50: '#F9F9F9',    // Page background
            100: '#EEF2F6',   // Input fields, subtle backgrounds
            200: '#E5E7EB',   // Borders
            300: '#D1D5DB',   // Input borders
            400: '#9CA3AF',   // Placeholder text
            500: '#6B7280',   // Muted icons
            600: '#5A6872',   // Secondary text
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          // Status: Success
          success: {
            light: '#D4EDDA',   // Light bg on light theme
            DEFAULT: '#15B546', // Main green
            dark: '#135327',    // Badge bg on dark theme
            muted: '#78D996',   // Text on dark bg
          },
          // Status: Error
          error: {
            light: '#F8D7DA',   // Light bg on light theme
            DEFAULT: '#B71322', // Main red
            dark: '#65131A',    // Badge bg on dark theme
            muted: '#F2BABE',   // Text on dark bg
          },
          // Status: Warning
          warning: {
            light: '#FFF3CD',   // Light bg on light theme
            DEFAULT: '#D4A017', // Main amber
            dark: '#7D5A0B',    // Badge bg on dark theme
            muted: '#F5D78E',   // Text on dark bg
          },
          // Status: Info
          info: {
            light: '#D1ECF1',
            DEFAULT: '#0073EA',
            dark: '#0A3D6E',
          },
        },
      },
      fontFamily: {
        sans: [
          'var(--font-primary)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
        'progress': 'progress 1.5s ease-in-out',
        'flip': 'flip 6s infinite steps(2, end)',
        'rotate': 'rotate 3s linear infinite both',
      },
      keyframes: {
        flip: {
          to: { transform: 'rotate(360deg)' },
        },
        rotate: {
          to: { transform: 'rotate(90deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        progress: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}

export default config
