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
        // Core Brand Colors - Refined palette
        brand: {
          red: '#DC2626',      // Slightly deeper, more confident red
          yellow: '#FACC15',   // Warmer, more golden yellow
          blue: '#2563EB',     // Richer, more saturated blue
          black: '#09090B',    // True near-black with slight warmth
          white: '#FAFAFA',    // Soft white
        },
        // Sophisticated Neutrals
        surface: {
          50: '#FAFAF9',       // Warm white
          100: '#F5F5F4',      // Light cream
          200: '#E7E5E4',      // Soft stone
          300: '#D6D3D1',      // Medium stone
          400: '#A8A29E',      // Muted
          500: '#78716C',      // Mid gray
          600: '#57534E',      // Dark stone
          700: '#44403C',      // Charcoal
          800: '#292524',      // Deep charcoal
          900: '#1C1917',      // Near black
          950: '#0C0A09',      // True black
        },
        // Accent variants for depth
        accent: {
          red: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#DC2626',
            600: '#B91C1C',
            700: '#991B1B',
          },
          yellow: {
            50: '#FEFCE8',
            100: '#FEF9C3',
            200: '#FEF08A',
            300: '#FDE047',
            400: '#FACC15',
            500: '#EAB308',
            600: '#CA8A04',
          },
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#2563EB',
            600: '#1D4ED8',
            700: '#1E40AF',
          },
        },
        // Legacy support (for gradual migration)
        bauhaus: {
          red: '#DC2626',
          yellow: '#FACC15',
          blue: '#2563EB',
          black: '#09090B',
          white: '#FAFAFA',
          cream: '#F5F5F4',
          grey: '#E7E5E4',
        },
        primary: '#DC2626',
        secondary: '#2563EB',
        dark: '#09090B',
        light: '#F5F5F4',
      },
      fontFamily: {
        display: ['var(--font-cabinet)', 'system-ui', 'sans-serif'],
        body: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        // Display sizes with optical adjustments
        'display-2xl': ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.85', letterSpacing: '-0.04em', fontWeight: '900' }],
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.88', letterSpacing: '-0.03em', fontWeight: '900' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.9', letterSpacing: '-0.02em', fontWeight: '900' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '800' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'grain': 'grain 8s steps(10) infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        // Refined shadow system
        'brutal': '4px 4px 0px 0px #09090B',
        'brutal-sm': '2px 2px 0px 0px #09090B',
        'brutal-lg': '6px 6px 0px 0px #09090B',
        'brutal-xl': '8px 8px 0px 0px #09090B',
        'brutal-red': '4px 4px 0px 0px #DC2626',
        'brutal-blue': '4px 4px 0px 0px #2563EB',
        'brutal-yellow': '4px 4px 0px 0px #FACC15',
        // Soft shadows for depth
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 16px -4px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 4px 16px -4px rgba(0, 0, 0, 0.15), 0 8px 32px -8px rgba(0, 0, 0, 0.15)',
        'soft-xl': '0 8px 32px -8px rgba(0, 0, 0, 0.2), 0 16px 64px -16px rgba(0, 0, 0, 0.2)',
        // Glow effects
        'glow-red': '0 0 20px rgba(220, 38, 38, 0.3)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3)',
        'glow-yellow': '0 0 20px rgba(250, 204, 21, 0.4)',
        // Inner shadows
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        // Legacy
        'bauhaus': '4px 4px 0px 0px #09090B',
        'bauhaus-sm': '2px 2px 0px 0px #09090B',
        'bauhaus-lg': '6px 6px 0px 0px #09090B',
        'bauhaus-red': '4px 4px 0px 0px #DC2626',
        'bauhaus-blue': '4px 4px 0px 0px #2563EB',
        'bauhaus-yellow': '4px 4px 0px 0px #FACC15',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        // Gradient utilities
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Noise texture (referenced via CSS)
        'noise': "url('/textures/noise.png')",
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
