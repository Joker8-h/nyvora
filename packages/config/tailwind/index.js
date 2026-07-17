/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    '../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: 'nx-',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--nx-border))',
        input: 'hsl(var(--nx-input))',
        ring: 'hsl(var(--nx-ring))',
        background: 'hsl(var(--nx-background))',
        foreground: 'hsl(var(--nx-foreground))',
        primary: {
          DEFAULT: 'hsl(var(--nx-primary))',
          foreground: 'hsl(var(--nx-primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--nx-secondary))',
          foreground: 'hsl(var(--nx-secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--nx-destructive))',
          foreground: 'hsl(var(--nx-destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--nx-muted))',
          foreground: 'hsl(var(--nx-muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--nx-accent))',
          foreground: 'hsl(var(--nx-accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--nx-popover))',
          foreground: 'hsl(var(--nx-popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--nx-card))',
          foreground: 'hsl(var(--nx-card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--nx-radius)',
        md: 'calc(var(--nx-radius) - 2px)',
        sm: 'calc(var(--nx-radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--nx-font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--nx-font-mono)', 'monospace'],
      },
      fontSize: {
        xs: ['var(--nx-text-xs)', { lineHeight: '1.5' }],
        sm: ['var(--nx-text-sm)', { lineHeight: '1.5' }],
        base: ['var(--nx-text-base)', { lineHeight: '1.5' }],
        lg: ['var(--nx-text-lg)', { lineHeight: '1.5' }],
        xl: ['var(--nx-text-xl)', { lineHeight: '1.4' }],
        '2xl': ['var(--nx-text-2xl)', { lineHeight: '1.3' }],
        '3xl': ['var(--nx-text-3xl)', { lineHeight: '1.2' }],
      },
      spacing: {
        1: 'var(--nx-space-1)',
        2: 'var(--nx-space-2)',
        3: 'var(--nx-space-3)',
        4: 'var(--nx-space-4)',
        5: 'var(--nx-space-5)',
        6: 'var(--nx-space-6)',
        8: 'var(--nx-space-8)',
        10: 'var(--nx-space-10)',
        12: 'var(--nx-space-12)',
        16: 'var(--nx-space-16)',
        20: 'var(--nx-space-20)',
        24: 'var(--nx-space-24)',
      },
      boxShadow: {
        sm: 'var(--nx-shadow-sm)',
        DEFAULT: 'var(--nx-shadow)',
        md: 'var(--nx-shadow-md)',
        lg: 'var(--nx-shadow-lg)',
        xl: 'var(--nx-shadow-xl)',
      },
      transitionDuration: {
        fast: 'var(--nx-transition-fast)',
        DEFAULT: 'var(--nx-transition-normal)',
        slow: 'var(--nx-transition-slow)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};