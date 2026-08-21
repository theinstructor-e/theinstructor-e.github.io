// E-WIT Service Worker
// Strategy: cache pages as students visit them (no bulk precache of the whole site),
// then serve cached copies instantly on repeat/offline visits while quietly checking
// the network in the background to keep the cache fresh (stale-while-revalidate).
//
// To force everyone's cache to refresh after a content push, bump CACHE_NAME below
// (e.g. 'ewit-cache-v2'). Old caches are automatically deleted on the next activate.

const CACHE_NAME = 'ewit-cache-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle simple same-origin GET requests. Let everything else
  // (Google Fonts CDN, GoatCounter's gc.zgo.at script, POSTs, etc.) pass through untouched.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);

      const networkFetch = fetch(req)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(req, response.clone());
          }
          return response;
        })
        .catch(() => null);

      // Cached copy exists: return it immediately, update cache silently in background.
      if (cached) {
        event.waitUntil(networkFetch);
        return cached;
      }

      // Not cached yet (first visit to this page): wait on the network.
      const fresh = await networkFetch;
      if (fresh) return fresh;

      // Network failed and nothing cached — show the offline fallback for page loads.
      if (req.mode === 'navigate') {
        const offline = await cache.match(OFFLINE_URL);
        if (offline) return offline;
      }
      return new Response('Offline — this page has not been visited yet on this device.', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
