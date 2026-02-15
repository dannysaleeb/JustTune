import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Base must match your GitHub repo name exactly
  base: '/JustTune/', 
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // This helps the PWA find assets like icons/favicons
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      workbox: {
        // 1. Tell Workbox to find and cache all build assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        
        // 2. IMPORTANT for SPAs: If user refreshes on a sub-route or offline, 
        // serve the main index.html from the correct path.
        navigateFallback: '/JustTune/index.html',
        
        // 3. Prevent the 404 by ensuring the service worker doesn't 
        // try to cache things outside its scope.
        cleanupOutdatedCaches: true,
      },

      manifest: {
        name: 'JustTune',
        short_name: 'JustTune',
        description: 'Tuning App',
        theme_color: '#ffffff',
        // start_url and scope must align with your GitHub Pages subfolder
        start_url: '/JustTune/',
        scope: '/JustTune/',
        display: 'standalone',
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
