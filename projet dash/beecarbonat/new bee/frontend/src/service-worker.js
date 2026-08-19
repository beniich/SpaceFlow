/**
 * service-worker.js — PWA Horizon 2 beecarbonit
 * Workbox : CacheFirst / NetworkFirst / BackgroundSync
 * Architecture conforme à la roadmap stratégique
 */
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// ─── Lifecycle ────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// ─── 1. Fonts & Static (CacheFirst, 1 an) ────────────────────────────────────
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// ─── 2. Images (CacheFirst, 30j) ─────────────────────────────────────────────
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// ─── 3. API GET — NetworkFirst + fallback cache (5s timeout) ─────────────────
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/') && request.method === 'GET',
  new NetworkFirst({
    cacheName: 'api-cache-v2',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  })
);

// ─── 4. API POST/PATCH/PUT — BackgroundSync (outbox pour offline) ─────────────
const bgSyncPlugin = new BackgroundSyncPlugin('beecarbonat-mutations', {
  maxRetentionTime: 24 * 60, // 24h max en file
});

registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/') &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method),
  new NetworkFirst({
    cacheName: 'api-mutations',
    plugins: [bgSyncPlugin],
    networkTimeoutSeconds: 8,
  }),
  'POST'
);

// ─── 5. Navigation SPA (NetworkFirst + fallback index.html) ──────────────────
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
);

// ─── 6. Assets IFC / BIM files (StaleWhileRevalidate, 7j) ────────────────────
registerRoute(
  ({ url }) => url.pathname.endsWith('.ifc') || url.pathname.includes('/bim/'),
  new StaleWhileRevalidate({
    cacheName: 'bim-files',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 }),
    ],
  })
);
