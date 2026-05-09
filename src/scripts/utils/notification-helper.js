import API from './api';
import Auth from './auth';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

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
      return;
    }

    try {
      const swUrl = import.meta.env.BASE_URL + 'sw.js';
      this.registration = await navigator.serviceWorker.register(swUrl);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  },

  async isSubscribed() {
    if (!this.registration) return false;
    const subscription = await this.registration.pushManager.getSubscription();
    return !!subscription;
  },

  async subscribe() {
    if (!this.registration) return false;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Izin notifikasi ditolak.');
      return false;
    }

    let subscription = await this.registration.pushManager.getSubscription();
    
    if (!subscription) {
      try {
        subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      } catch (error) {
        console.error('Gagal subscribe PushManager:', error);
        return false;
      }
    }

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
      localStorage.setItem('pushSubscribed', 'true');
      return true;
    } catch (error) {
      console.error('Gagal mengirim subscription ke API:', error);
      return false;
    }
  },

  async unsubscribe() {
    if (!this.registration) return false;

    const subscription = await this.registration.pushManager.getSubscription();
    if (!subscription) return true;

    try {
      await API.unsubscribeNotification(subscription.endpoint);
      await subscription.unsubscribe();
      localStorage.removeItem('pushSubscribed');
      return true;
    } catch (error) {
      console.error('Gagal unsubscribe:', error);
      return false;
    }
  },

  async toggleSubscription() {
    const subscribed = await this.isSubscribed();
    if (subscribed) {
      return await this.unsubscribe();
    } else {
      return await this.subscribe();
    }
  }
};

export default NotificationHelper;
