import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Optional gzip compression at dev-preview time (prod should use CDN/server compression)
// We avoid adding an extra dependency here to keep dev install lean.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'vendor-react-router'
            if (id.includes('lucide-react')) return 'vendor-icons'
            if (id.includes('axios')) return 'vendor-axios'
            return 'vendor'
          }
        },
        chunkFileNames: 'assets/chunk-[name]-[hash].js',
        entryFileNames: 'assets/entry-[name]-[hash].js',
        assetFileNames: 'assets/asset-[name]-[hash][extname]'
      }
    },
    sourcemap: false,
    target: 'es2019',
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
