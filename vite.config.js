import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is './' so the build works on Netlify, GitHub Pages, or any static host
export default defineConfig({
  plugins: [react()],
  base: './',
})
