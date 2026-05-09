const CACHE_NAME = 'story-app-v1';
const API_CACHE = 'story-api-cache';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.origin === 'https://story-api.dicoding.dev' && request.method === 'GET') {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request).then((networkResponse) => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Keep cached response if network fails
        });
        return cachedResponse || fetchPromise;
      })
    );
  } else {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(request).then((networkResponse) => {
             caches.open(CACHE_NAME).then((cache) => {
               if (request.method === 'GET' && !request.url.startsWith('chrome-extension')) {
                 cache.put(request, networkResponse.clone());
               }
             });
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request);
      })
    );
  }
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch(e) {
      data = { title: event.data.text() };
    }
  }
  
  const title = data.title || 'Notification';
  const options = {
    body: data.options?.body || 'Anda mendapat pemberitahuan baru.',
    icon: './favicon.png', 
    badge: './favicon.png',
    data: data.options?.data || {}
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetId = event.notification.data?.id;
  const targetUrl = targetId ? `/#/story/${targetId}` : '/#/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        client.focus();
        if ('navigate' in client) {
          client.navigate(targetUrl);
        }
      } else {
        clients.openWindow(targetUrl);
      }
    })
  );
});
