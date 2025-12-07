import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Optional but good to have:
  base:"/dashboard",
  build: {
    outDir: 'dist',
    copyPublicDir: true  // This ensures files from public/ are copied
  }
})