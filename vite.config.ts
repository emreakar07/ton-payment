import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  base: './',
  server: {
    fs: {
      allow: ['../sdk', './'],
    },
  },
  define: {
    'process.env': {}
  }
})
