import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/qc-buddy-frontend/',   // important for GitHub Pages
})
