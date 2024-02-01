import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
      cssCodeSplit: false, // Disable CSS code splitting
      outDir: 'dist', // Output directory
      assetsDir: '.', // Output assets directly in the outDir
      assetsInlineLimit: 0, // Disable asset inlining
      rollupOptions: {
        output: {
          entryFileNames: 'index.js',
          chunkFileNames: 'index.js',
          assetFileNames: 'index.css',
        },
      },
    },
})
