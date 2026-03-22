import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black:  '#020008',
          deep:   '#07001f',
          purple: '#1a0a3d',
          violet: '#2d1b69',
          blue:   '#0d1f4a',
          gold:   '#c9a227',
          amber:  '#f5a623',
          glow:   '#7c3aed',
          cyan:   '#06b6d4',
          rose:   '#9d174d',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Raleway"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-glow':  'pulseGlow 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(124,58,237,0.4)' },
          '50%':     { boxShadow: '0 0 60px rgba(124,58,237,0.9), 0 0 120px rgba(201,162,39,0.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        rotateSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.8) 50%, transparent 100%)',
        'cosmic-grad':  'radial-gradient(ellipse at center, #1a0a3d 0%, #07001f 40%, #020008 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
