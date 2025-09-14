// // Service Worker for CVATI application
// const CACHE_NAME = 'cvati-cache-v1';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   // Add other important assets
// ];

// // Install event - cache essential files
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         console.log('Cache opened');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// // Activate event - clean up old caches
// self.addEventListener('activate', event => {
//   const cacheWhitelist = [CACHE_NAME];
  
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// // Fetch event - handle API redirects, HTTPS enforcement, and caching
// self.addEventListener('fetch', function(event) {
//   const url = new URL(event.request.url);
  
//   // HTTPS Enforcement for api.cvati.com
//   if (url.hostname.includes('api.cvati.com')) {
//     if (url.protocol === 'http:') {
//       // Create a new URL with HTTPS
//       url.protocol = 'https:';
      
//       // Create a new request with the same parameters but using HTTPS
//       const secureRequest = new Request(url.toString(), {
//         method: event.request.method,
//         headers: event.request.headers,
//         body: event.request.body,
//         mode: event.request.mode,
//         credentials: event.request.credentials,
//         cache: event.request.cache,
//         redirect: event.request.redirect,
//         referrer: event.request.referrer,
//         integrity: event.request.integrity
//       });
      
//       console.log('SW: Upgrading request to HTTPS:', url.toString());
      
//       // Use the secure request instead
//       event.respondWith(fetch(secureRequest));
//       return;
//     }
//   }
  
//   // Handle social-callback redirects specifically
//   if (url.pathname.includes('/auth/social-callback')) {
//     // Ensure we're handling this on the production domain
//     if (url.hostname !== 'www.cvati.com' && url.hostname !== 'cvati.com') {
//       // This is a redirect from OAuth to a non-production domain
//       // Redirect to the production URL with the token
//       const token = url.searchParams.get('token');
//       const productionUrl = new URL('/auth/social-callback', 'https://www.cvati.com');
//       if (token) {
//         productionUrl.searchParams.set('token', token);
//       }
      
//       event.respondWith(Response.redirect(productionUrl.toString(), 302));
//       return;
//     }
//   }
  
//   // For navigation requests (HTML pages), always go to index.html
//   // This helps with client-side routing
//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       fetch(event.request).catch(() => {
//         return caches.match('/index.html');
//       })
//     );
//     return;
//   }
  
//   // For all other requests, try the cache first, then network
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         // Cache hit - return the response from cache
//         if (response) {
//           return response;
//         }
        
//         // Clone the request because it's a one-time use stream
//         const fetchRequest = event.request.clone();
        
//         return fetch(fetchRequest).then(response => {
//           // Check if we received a valid response
//           if (!response || response.status !== 200 || response.type !== 'basic') {
//             return response;
//           }
          
//           // Clone the response because it's a one-time use stream
//           const responseToCache = response.clone();
          
//           caches.open(CACHE_NAME)
//             .then(cache => {
//               cache.put(event.request, responseToCache);
//             });
            
//           return response;
//         });
//       })
//   );
// });