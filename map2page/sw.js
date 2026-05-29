/* ================================================
   SOLARPROPHET — sw.js (Service Worker)

   Saves all your files and map tiles so the
   app works offline after first load online.
================================================ */

const CACHE_NAME = 'solarprophet-v2';

/* All your project files to save on first load */
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/map.html',
  '/map.css',
  '/map.js',
  '/predictions.html',
  '/predictions.css',
  '/predictions.js',
  '/explainability.html',
  '/explainability.css',
  '/explainability.js',
  '/explainability2.html',
  '/explainability2.css',
  '/explainability2.js',
  '/systemconfig.html',
  '/systemconfig.css',
  '/systemconfig.js',
  '/register-sw.js',
  '/favicon.svg'
];


/* ------------------------------------------------
   INSTALL: Save all files to cache on first load
------------------------------------------------ */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Caching all project files...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  /* Take control immediately without waiting */
  self.skipWaiting();
});


/* ------------------------------------------------
   ACTIVATE: Delete old caches
------------------------------------------------ */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});


/* ------------------------------------------------
   FETCH: Serve from network first, cache as backup

   Every request the page makes goes through here.
   - Online: fetch from network AND save to cache
   - Offline: serve from cache (including map tiles)
------------------------------------------------ */
self.addEventListener('fetch', function(event) {

  /* Only handle GET requests */
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(function(networkResponse) {

        /*
          Network worked.
          Save a copy to cache for offline use.
          This is how map tiles get cached —
          every tile you view online is saved.
        */
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });

        return networkResponse;
      })
      .catch(function() {

        /*
          Network failed — we are offline.
          Serve from cache instead.
        */
        return caches.match(event.request).then(function(cached) {
          if (cached) return cached;

          /*
            Not in cache.
            For map tiles = blank tile shown.
            For your pages = should not happen
            since we cached them on install.
          */
        });
      })
  );
});
