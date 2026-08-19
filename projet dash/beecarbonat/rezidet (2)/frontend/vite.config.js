import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'docs/bundle-stats.html', gzipSize: true, template: 'treemap' }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'beecarbonit CAFM',
        short_name: 'CAFM',
        description: 'Plateforme CAFM ESG - Facility Management Intelligence',
        theme_color: '#0f0f0f',
        background_color: '#0f0f0f',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Assets statiques : CacheFirst
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // API GET : NetworkFirst, fallback sur cache
            urlPattern: /\/api\/(assets|workorders|dashboard|spaces|buildings)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [200] }
            }
          },
          {
            // Fichiers IFC/BIM : CacheFirst (fichiers lourds, rarement mis à jour)
            urlPattern: /\/api\/bim\/models/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'bim-cache',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 7, maxEntries: 20 },
              cacheableResponse: { statuses: [200] }
            }
          }
        ],
        // BackgroundSync pour les mutations hors-ligne (WO, Photos)
        // Note : les requêtes POST offline sont gérées via l'outbox Dexie côté app,
        // Workbox couvre les retry automatiques du Service Worker.
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'recharts-vendor': ['recharts'],
          'ui-vendor': ['lucide-react', 'react-hot-toast', 'date-fns', 'framer-motion'],
          'three-vendor': ['three'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/messaging'],
          'socket-vendor': ['socket.io-client']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8081',
      '/socket.io': {
        target: 'http://localhost:8081',
        ws: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**']
  }
});
