import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/3D-web-app-/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, '/');
          if (norm.includes('node_modules/three/')) {
            return 'three-vendor';
          }
          if (norm.includes('node_modules/@react-three/')) {
            return 'r3f-vendor';
          }
          if (norm.includes('node_modules/leva/')) {
            return 'leva-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
