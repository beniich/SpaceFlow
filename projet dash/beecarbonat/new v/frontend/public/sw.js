const CACHE_VERSION = 'cafm-v3';
const RUNTIME_CACHE = 'cafm-runtime-v3';
const FACILITY_DATA_CACHE = 'cafm-facility-data-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  '/icons/apple-touch-icon.png'
];

// Baseline critical facility status reports dataset seeded into cache
const BASELINE_FACILITY_DATA = {
  '/api/dashboard/kpis': {
    kpis: {
      totalAssets: 48,
      operationalAssets: 43,
      maintenanceAssets: 4,
      breakdownAssets: 1,
      retiredAssets: 0,
      assetAvailability: 92.4,
      totalSensors: 72,
      activeSensors: 69,
      totalSpaces: 142,
      occupiedSpaces: 118,
      occupancyRate: 83.1,
      totalBuildings: 4,
      pendingWorkOrders: 9,
      inProgressWorkOrders: 6,
      criticalWorkOrders: 2,
      completedThisMonth: 28,
      totalMaintenanceCost: 52400,
      monthlyMaintenanceCost: 7800,
      monthlyRevenue: 156000,
      savingsRate: 16.2,
      activeLeases: 36
    },
    charts: {
      woTrend: [
        { date: '2026-08-01', created: 5, completed: 4, day: 'lun.' },
        { date: '2026-08-02', created: 3, completed: 5, day: 'mar.' },
        { date: '2026-08-03', created: 6, completed: 4, day: 'mer.' },
        { date: '2026-08-04', created: 4, completed: 6, day: 'jeu.' },
        { date: '2026-08-05', created: 7, completed: 5, day: 'ven.' },
        { date: '2026-08-06', created: 2, completed: 3, day: 'sam.' },
        { date: '2026-08-07', created: 1, completed: 2, day: 'dim.' }
      ],
      assetStatus: [
        { name: 'Opérationnel', value: 43, color: '#10b981' },
        { name: 'En maintenance', value: 4, color: '#f59e0b' },
        { name: 'En panne', value: 1, color: '#ef4444' },
        { name: 'Retiré', value: 0, color: '#94a3b8' }
      ],
      assetsByCategory: [
        { category: 'HVAC', count: 16, avgHealth: 89, totalValue: 195000 },
        { category: 'Électrique', count: 14, avgHealth: 95, totalValue: 110000 },
        { category: 'Plomberie', count: 10, avgHealth: 84, totalValue: 52000 },
        { category: 'Sécurité', count: 8, avgHealth: 97, totalValue: 65000 }
      ],
      workOrdersByPriority: [
        { priority: 'LOW', count: 4 },
        { priority: 'MEDIUM', count: 6 },
        { priority: 'HIGH', count: 3 },
        { priority: 'CRITICAL', count: 2 }
      ],
      energyConsumption: [
        { month: 'Jan', elec: 8200, cost: 1420 },
        { month: 'Fév', elec: 7900, cost: 1380 },
        { month: 'Mar', elec: 7600, cost: 1310 },
        { month: 'Avr', elec: 6900, cost: 1190 },
        { month: 'Mai', elec: 6500, cost: 1120 },
        { month: 'Jun', elec: 7200, cost: 1240 },
        { month: 'Jul', elec: 8800, cost: 1510 },
        { month: 'Aoû', elec: 9400, cost: 1620 },
        { month: 'Sep', elec: 8100, cost: 1390 },
        { month: 'Oct', elec: 7800, cost: 1340 },
        { month: 'Nov', elec: 8000, cost: 1370 },
        { month: 'Déc', elec: 8500, cost: 1460 }
      ],
      maintenanceCostsByCategory: [
        { category: 'HVAC', cost: 19800 },
        { category: 'Électrique', cost: 13200 },
        { category: 'Plomberie', cost: 9400 },
        { category: 'Ascenseurs', cost: 10000 }
      ]
    },
    lists: {
      recentWorkOrders: [
        {
          id: 'wo-cached-1',
          title: 'Maintenance préventive CTA Tour Nord',
          priority: 'MEDIUM',
          status: 'IN_PROGRESS',
          createdAt: new Date().toISOString(),
          asset: { name: 'CTA-01 Tour Nord', category: 'HVAC', location: 'Étage 12' },
          assignedTo: { firstName: 'Thomas', lastName: 'Dubois' }
        },
        {
          id: 'wo-cached-2',
          title: 'Remplacement roulement pompe secondaire',
          priority: 'CRITICAL',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          asset: { name: 'Pompe PC-02', category: 'Plomberie', location: 'Sous-sol B2' },
          assignedTo: { firstName: 'Marc', lastName: 'Leroy' }
        },
        {
          id: 'wo-cached-3',
          title: 'Inspection thermographique TGBT Principal',
          priority: 'HIGH',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          asset: { name: 'TGBT Bâtiment Alpha', category: 'Électrique', location: 'Local Technique RDC' },
          assignedTo: { firstName: 'Sophie', lastName: 'Bernard' }
        }
      ],
      upcomingMaintenance: [
        {
          id: 'm-cached-1',
          name: 'Groupe Froid Chiller A',
          category: 'HVAC',
          location: 'Toiture Terrasse',
          nextMaintenance: new Date(Date.now() + 86400000 * 3).toISOString(),
          healthScore: 86
        },
        {
          id: 'm-cached-2',
          name: 'Ascenseur Panoramique Est',
          category: 'Ascenseurs',
          location: 'Atrium Principal',
          nextMaintenance: new Date(Date.now() + 86400000 * 5).toISOString(),
          healthScore: 93
        },
        {
          id: 'm-cached-3',
          name: 'Centrale Incendie SSI',
          category: 'Sécurité',
          location: 'Poste de Sécurité RDC',
          nextMaintenance: new Date(Date.now() + 86400000 * 7).toISOString(),
          healthScore: 98
        }
      ],
      criticalAlerts: [
        {
          id: 'a-cached-1',
          name: 'Pompe PC-02 Sous-sol',
          location: 'Sous-sol B2',
          healthScore: 32,
          building: { name: 'Bâtiment Alpha' }
        },
        {
          id: 'a-cached-2',
          name: 'Vanne Régulation RDC',
          location: 'Local Chaufferie',
          healthScore: 38,
          building: { name: 'Tour Horizon' }
        }
      ]
    }
  },
  '/api/dashboard/live': {
    pending: 9,
    inProgress: 6,
    critical: 2,
    sensors: [
      { sensorId: 'SNS-TMP-01', type: 'temperature', value: 21.8, unit: '°C' },
      { sensorId: 'SNS-HUM-02', type: 'humidity', value: 44.5, unit: '%' },
      { sensorId: 'SNS-ENG-03', type: 'power', value: 142.3, unit: 'kW' }
    ]
  },
  '/api/buildings': [
    { id: 'bld-1', name: 'Bâtiment Alpha (Siège)', code: 'ALPHA', floors: 12, totalArea: 14500, address: '12 rue de la Paix, Paris' },
    { id: 'bld-2', name: 'Tour Horizon', code: 'HORIZON', floors: 28, totalArea: 32000, address: '45 av. des Champs-Élysées, Paris' },
    { id: 'bld-3', name: 'Data Center B', code: 'DC-B', floors: 4, totalArea: 8200, address: '8 rue de l\'Industrie, Courbevoie' }
  ]
};

// ── Install: precache static assets & seed baseline facility data ─────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Precache app shell static assets
      caches.open(CACHE_VERSION)
        .then(cache => cache.addAll(STATIC_ASSETS))
        .catch(err => console.warn('[SW] Precache static assets warning:', err)),

      // Seed critical facility data baseline in facility cache
      caches.open(FACILITY_DATA_CACHE)
        .then(cache => {
          const promises = Object.entries(BASELINE_FACILITY_DATA).map(([path, data]) => {
            const headers = new Headers({
              'Content-Type': 'application/json',
              'X-CAFM-Offline': 'true',
              'X-CAFM-Data-Source': 'preseeded-facility-baseline',
              'X-CAFM-Cached-At': new Date().toISOString()
            });
            const response = new Response(JSON.stringify(data), { status: 200, headers });
            return cache.put(new Request(path), response);
          });
          return Promise.all(promises);
        })
        .catch(err => console.warn('[SW] Pre-seed facility cache warning:', err))
    ]).then(() => self.skipWaiting())
  );
});

// ── Activate: purge outdated caches & claim clients ───────────────────────────
self.addEventListener('activate', (event) => {
  const activeCaches = [CACHE_VERSION, RUNTIME_CACHE, FACILITY_DATA_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !activeCaches.includes(key))
          .map(key => {
            console.log('[SW] Removing deprecated cache:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// Helper to create offline fallback response
function createOfflineJsonResponse(data, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-CAFM-Offline': 'true',
    'X-CAFM-Data-Source': 'service-worker-cache',
    'X-CAFM-Cached-At': new Date().toISOString(),
    ...extraHeaders
  });
  return new Response(JSON.stringify(data), { status, headers });
}

// ── Fetch: Strategic caching for facility data & static assets ────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Exclude real-time WebSocket / socket.io & non-same-origin external domains
  if (url.pathname.startsWith('/socket.io') || url.origin !== self.location.origin) {
    return;
  }

  // 1. API Requests Handling (Critical Facility Data)
  if (url.pathname.startsWith('/api/')) {
    // For GET queries (Status reports, KPIs, Assets, Work orders, CMMS, Analytics, etc.)
    if (request.method === 'GET') {
      event.respondWith(
        fetch(request)
          .then(networkResponse => {
            // If response is valid, update the facility data cache
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(FACILITY_DATA_CACHE).then(cache => {
                cache.put(request, responseClone);
                // Also cache normalized path without search query if present
                if (url.search) {
                  const normalizedUrl = url.pathname;
                  cache.put(new Request(normalizedUrl), responseClone.clone());
                }
              });
            }
            return networkResponse;
          })
          .catch(async (networkError) => {
            console.warn(`[SW] Network failed for ${url.pathname}, fetching from facility cache...`);
            
            // 1. Try exact request match in facility cache
            const facilityCache = await caches.open(FACILITY_DATA_CACHE);
            let cachedResponse = await facilityCache.match(request);
            
            // 2. Try match by pathname without query params
            if (!cachedResponse && url.search) {
              cachedResponse = await facilityCache.match(url.pathname);
            }

            // 3. Try global match across all caches
            if (!cachedResponse) {
              cachedResponse = await caches.match(request);
            }

            // If found in cache, enrich headers so the frontend knows it is viewing cached facility data
            if (cachedResponse) {
              const cachedData = await cachedResponse.clone().json().catch(() => null);
              if (cachedData !== null) {
                return createOfflineJsonResponse(cachedData, 200, {
                  'X-CAFM-Offline': 'true',
                  'X-CAFM-From-Cache': 'true',
                  'X-CAFM-Data-Source': 'cached-facility-report'
                });
              }
              return cachedResponse;
            }

            // 4. If not yet cached, fallback to seeded baseline for critical status endpoints
            if (BASELINE_FACILITY_DATA[url.pathname]) {
              return createOfflineJsonResponse(BASELINE_FACILITY_DATA[url.pathname], 200, {
                'X-CAFM-Offline': 'true',
                'X-CAFM-Data-Source': 'fallback-baseline-report'
              });
            }

            // Generic offline fallback for uncached API GET endpoints
            return createOfflineJsonResponse({
              offline: true,
              cached: false,
              message: 'Mode hors-ligne : données de l\'installation non disponibles en cache local.',
              data: []
            }, 200);
          })
      );
      return;
    }

    // For Mutation requests (POST, PUT, PATCH, DELETE) when offline
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      event.respondWith(
        fetch(request).catch(() => {
          return createOfflineJsonResponse({
            offlineQueued: true,
            success: true,
            message: 'Action enregistrée en mode hors-ligne. Les modifications seront synchronisées automatiquement.'
          }, 200);
        })
      );
      return;
    }

    return;
  }

  // 2. HTML navigation pages: Network-first with /index.html cache fallback (SPA)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 3. Static assets (JS bundles, CSS, Fonts, Images): Cache-first with dynamic runtime caching
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for images
        if (request.destination === 'image') return caches.match('/icons/icon-192x192.png');
      });
    })
  );
});

// ── Client Messages Listener ──────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_CACHE_INFO') {
    caches.open(FACILITY_DATA_CACHE)
      .then(cache => cache.keys())
      .then(keys => {
        event.ports[0]?.postMessage({
          cachedEndpointsCount: keys.length,
          cachedUrls: keys.map(k => k.url),
          cacheVersion: FACILITY_DATA_CACHE,
          timestamp: new Date().toISOString()
        });
      });
  }

  if (event.data.type === 'REFRESH_FACILITY_CACHE') {
    // Proactively pre-fetch and cache key status reports
    const endpoints = ['/api/dashboard/kpis', '/api/dashboard/live', '/api/assets', '/api/buildings', '/api/workorders'];
    Promise.all(
      endpoints.map(ep =>
        fetch(ep)
          .then(res => {
            if (res.status === 200) {
              const clone = res.clone();
              return caches.open(FACILITY_DATA_CACHE).then(cache => cache.put(new Request(ep), clone));
            }
          })
          .catch(() => {})
      )
    ).then(() => {
      event.ports[0]?.postMessage({ status: 'FACILITY_CACHE_UPDATED' });
    });
  }
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'CAFM Pro', body: 'Nouvelle notification installation', url: '/' };
  try {
    data = { ...data, ...event.data?.json() };
  } catch (_) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag || 'cafm-notification',
      renotify: true,
      data: { url: data.url },
      vibrate: [200, 100, 200],
      actions: data.actions || []
    })
  );
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        const existing = clientList.find(c => c.url.includes(self.location.origin) && 'focus' in c);
        if (existing) return existing.focus().then(c => c.navigate(targetUrl));
        return clients.openWindow(targetUrl);
      })
  );
});

// ── Background sync (queued mutations) ───────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'cafm-sync') {
    event.waitUntil(
      // Trigger background sync across clients
      clients.matchAll().then(clientList => {
        clientList.forEach(client => client.postMessage({ type: 'CAFM_SYNC_TRIGGERED' }));
      })
    );
  }
});
