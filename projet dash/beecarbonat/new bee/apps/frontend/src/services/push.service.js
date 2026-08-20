import api from './api';

export async function requestPushPermission() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Web Push n\'est pas supporté par ce navigateur.');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission de notification refusée');
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) {
    return existingSub;
  }

  // Clé publique VAPID
  const publicVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-Skv69yViEuiBIa';
  const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });

  await api.post('/notifications/subscribe', { subscription });
  return subscription;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
