import { convertBase64ToUint8Array } from './index';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';


export const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export function isNotificationAvailable() {
  return 'Notification' in window;
}


export function isNotificationGranted() {
  return Notification.permission === 'granted';
}


export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    alert('Browser tidak mendukung Notification API.');
    return false;
  }

  if (isNotificationGranted()) return true;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Izin notifikasi belum diberikan.');
    return false;
  }
  return true;
}


async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Browser tidak mendukung Service Worker.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error('❌ Service Worker belum siap:', error);
    return null;
  }
}


export async function getPushSubscription() {
  const reg = await getServiceWorkerRegistration();
  if (!reg) return null;
  return await reg.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  const sub = await getPushSubscription();
  return !!sub;
}


function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}


export async function subscribe() {
  const permission = await requestNotificationPermission();
  if (!permission) return false;

  const reg = await getServiceWorkerRegistration();
  if (!reg) {
    alert('Service Worker belum siap. Refresh halaman.');
    return false;
  }

  try {
    console.log('🔔 Mencoba subscribe push notification...');
    const subscription = await reg.pushManager.subscribe(generateSubscribeOptions());
    const { endpoint, keys } = subscription.toJSON();

    const response = await subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error('❌ Gagal kirim subscription ke server:', response);
      await subscription.unsubscribe();
      alert('Langganan push gagal diaktifkan.');
      return false;
    }

    alert('✅ Notifikasi berhasil diaktifkan!');
    return true;
  } catch (error) {
    console.error('❌ Error saat subscribe:', error);
    alert('Gagal mengaktifkan notifikasi.');
    return false;
  }
}


export async function unsubscribe() {
  const reg = await getServiceWorkerRegistration();
  if (!reg) {
    alert('Service Worker belum siap.');
    return false;
  }

  try {
    const sub = await reg.pushManager.getSubscription();
    if (!sub) {
      alert('Tidak ada langganan aktif.');
      return true;
    }

    const { endpoint } = sub.toJSON();
    await sub.unsubscribe();

    const response = await unsubscribePushNotification({ endpoint });
    if (!response.ok) {
      console.error('❌ Gagal hapus subscription di server:', response);
      alert('Gagal menonaktifkan notifikasi.');
      return false;
    }

    alert('🚫 Notifikasi dinonaktifkan.');
    return true;
  } catch (error) {
    console.error('❌ Error saat unsubscribe:', error);
    alert('Gagal menonaktifkan notifikasi.');
    return false;
  }
}
