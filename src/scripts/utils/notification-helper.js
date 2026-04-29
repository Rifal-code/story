import API from './api';
import Auth from './auth';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Helper function to convert VAPID Key for pushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationHelper = {
  async init() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Browser tidak mendukung Service Worker atau Push Notification');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Jika user sudah login, cek status notifikasi
      if (Auth.isLoggedIn()) {
        await this.requestPermissionAndSubscribe(registration);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  },

  async requestPermissionAndSubscribe(registration) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Izin notifikasi ditolak oleh user.');
      return;
    }

    // Cek apakah sudah subscribe
    let subscription = await registration.pushManager.getSubscription();
    
    // Jika belum subscribe, buat subscription baru
    if (!subscription) {
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      } catch (error) {
        console.error('Failed to subscribe to PushManager:', error);
        return;
      }
    }

    // Ubah format subscription object agar sesuai dengan schema API Dicoding
    const subJson = subscription.toJSON();
    const payload = {
      endpoint: subJson.endpoint,
      keys: {
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth
      }
    };

    try {
      await API.subscribeNotification(payload);
      console.log('Berhasil subscribe web push notification ke server API.');
    } catch (error) {
      console.error('Gagal mengirim subscription ke API:', error);
    }
  }
};

export default NotificationHelper;
