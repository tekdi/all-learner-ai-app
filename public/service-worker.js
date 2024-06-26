// Define the name for the cache
const CACHE_NAME = 'my-cache-v1';

// Event listener for installation of the service worker
self.addEventListener('install', event => {
  // Perform installation steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // No need to pre-cache any resources during installation
      })
  );
});

// Event listener for fetching assets
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        if (response) {
          // Resource is in cache, return it
          // console.log('Resource is cached:', event.request.url);
          return response;
        }

        // Resource is not in cache, fetch it from network and cache it
        return fetch(event.request).then(networkResponse => {
          // Check if fetched response is valid
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Clone the response because it's a stream that can only be consumed once
          const responseToCache = networkResponse.clone();

          // Cache the fetched response
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          // console.log('Resource is fetched from network and cached:', event.request.url);
          return networkResponse;
        }).catch(error => {
          // Fetch failed, return a fallback response
          console.error('Fetch failed:', error);
          // You can return a custom offline page or a fallback response here
        });
      });
    })
  );
});

// Event listener for activation of the service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete caches not in cacheWhitelist
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});