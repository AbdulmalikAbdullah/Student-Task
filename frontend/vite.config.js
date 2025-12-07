export default defineConfig({
  plugins: [react()],
  base: '/Student-Task', // Add trailing slash
  build: {
    outDir: 'dist',
    copyPublicDir: true
  }
})