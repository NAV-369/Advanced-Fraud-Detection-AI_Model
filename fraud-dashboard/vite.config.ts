import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          charts: ['@nivo/bar', '@nivo/core', '@nivo/heatmap', '@nivo/line', '@nivo/pie', 'recharts', 'd3']
        }
      }
    }
  },
  server: {
    cors: true
  }
})
