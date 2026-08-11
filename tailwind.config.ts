import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: { 0: '#0a1620', 1: '#0f2230', 2: '#123246' },
        azure: { DEFAULT: '#5ab0e6', bright: '#9fd8f5' },
        irid: '#b98cff',
        ink: '#eef6fb',
        pos: '#7ee6a8',
        neg: '#ff8080',
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { card: '16px', chip: '10px', node: '14px' },
      transitionTimingFunction: { out: 'cubic-bezier(.23,1,.32,1)' },
    },
  },
  plugins: [],
} satisfies Config
