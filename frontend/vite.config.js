export default defineConfig({
  plugins: [react()],
  base: '/dashboard/', // Add trailing slash
  build: {
    outDir: 'dist',
    copyPublicDir: true
  }
})