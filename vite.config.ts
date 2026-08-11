/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the same build works on GitHub Pages (/crucible/) and Vercel (root).
  base: './',
  plugins: [react()],
  test: { environment: 'jsdom', globals: true, setupFiles: [] },
})
