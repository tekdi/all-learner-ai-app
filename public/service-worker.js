// service-worker.js

// Define the name for the cache
const CACHE_NAME = 'my-cache-v1';

// List of URLs to be cached
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/image.jpg',
  '/audio.mp3',
  // Add more URLs as needed
];

// Event listener for installation of the service worker
self.addEventListener('install', event => {
  // Perform installation steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for fetching assets
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        // If the image is cached, return a cloned cached response
        if (response) {
          console.log('Image is cached:', event.request.url);
          return response.clone(); // Clone the response to avoid modifying the original cached response
        }
  
        // If the image is not cached, fetch it from the network
        return fetch(event.request);
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
