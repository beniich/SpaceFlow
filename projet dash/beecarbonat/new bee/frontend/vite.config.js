import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: "BEECARBONAT — Facility Management",
        short_name: "BEECARBONAT",
        description: "Plateforme de gestion des installations assistée par ordinateur et maintenance prédictive.",
        theme_color: "#00dbe7",
        background_color: "#05070a",
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/",
        categories: [
          "business",
          "productivity"
        ],
        icons: [
          {
            src: "/icons/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png"
          },
          {
            src: "/icons/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png"
          },
          {
            src: "/icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        shortcuts: [
          {
            name: "Tableau de bord",
            short_name: "Dashboard",
            description: "Accéder au tableau de bord",
            url: "/",
            icons: [
              {
                src: "/icons/icon-96x96.png",
                sizes: "96x96"
              }
            ]
          },
          {
            name: "Ordres de travail",
            short_name: "Travaux",
            description: "Gérer les ordres de travail",
            url: "/work-orders",
            icons: [
              {
                src: "/icons/icon-96x96.png",
                sizes: "96x96"
              }
            ]
          },
          {
            name: "Assets",
            short_name: "Assets",
            description: "Gestion des actifs",
            url: "/assets",
            icons: [
              {
                src: "/icons/icon-96x96.png",
                sizes: "96x96"
              }
            ]
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
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
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three'],
          'charts-vendor': ['recharts', 'chart.js'],
          'ui-core': ['lucide-react', 'react-hot-toast', 'date-fns']
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
  }
});
