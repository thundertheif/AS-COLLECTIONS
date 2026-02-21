import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/saree-style-vite-react/',   // important for GitHub Pages
  plugins: [react()],
  server: { host: true }
})
