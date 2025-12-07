import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // This ensures all files from public are copied
    copyPublicDir: true
  }
})