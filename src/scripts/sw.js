import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';


precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);


registerRoute(
  ({ url }) => url.origin === 'https://cdnjs.cloudflare.com' || url.origin.includes('fontawesome'),
  new CacheFirst({
    cacheName: 'fontawesome',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);


registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);


registerRoute(
  ({ request, url }) => {
    return url.origin.includes('story-api.dicoding.dev') && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);


registerRoute(
  ({ request, url }) => {
    return url.origin.includes('story-api.dicoding.dev') && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);


registerRoute(
  ({ url }) => url.origin.includes('maptiler') || url.origin.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);


self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'StoryApp';
  const options = {
    body: data.body || 'Notifikasi baru dari StoryApp!',
    icon: '/images/logo.png',
    badge: '/images/logo.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === notificationUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(notificationUrl);
      }
    }),
  );
});
