import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/JustTune/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'favicon.png'],
      workbox: {
        // Updated globPatterns to include audio and fonts
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,mp3,wav,woff,woff2}'],
        
        navigateFallback: '/JustTune/index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'JustTune',
        short_name: 'JustTune',
        description: 'Tuning App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/JustTune/',
        scope: '/JustTune/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
