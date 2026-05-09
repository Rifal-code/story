import '../styles/styles.css';

import App from './pages/app';
import NotificationHelper from './utils/notification-helper';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  await NotificationHelper.init();

  const pushToggle = document.getElementById('push-toggle');
  if (pushToggle) {
    pushToggle.checked = await NotificationHelper.isSubscribed();
    
    pushToggle.addEventListener('change', async (e) => {
      e.preventDefault();
      const isSubscribed = await NotificationHelper.isSubscribed();
      
      if (isSubscribed) {
        const success = await NotificationHelper.unsubscribe();
        if (success) {
          pushToggle.checked = false;
        } else {
          pushToggle.checked = true;
          alert('Gagal berhenti berlangganan notifikasi.');
        }
      } else {
        const success = await NotificationHelper.subscribe();
        if (success) {
          pushToggle.checked = true;
        } else {
          pushToggle.checked = false;
          alert('Gagal berlangganan notifikasi atau izin ditolak.');
        }
      }
    });
  }
});

