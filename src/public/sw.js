self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || 'Notification';
  const options = {
    body: data.options?.body || 'Anda mendapat pemberitahuan baru.',
    icon: '/favicon.png', // Fallback icon
    badge: '/favicon.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Optional: Arahkan user saat notifikasi diklik
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        client.focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});
