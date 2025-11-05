import mountNotificationToggle from './components/notification-toggle';
import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    navigationDrawer: document.querySelector('#navigation-drawer'),
    drawerButton: document.querySelector('#drawer-button'),
    content: document.querySelector('#main-content'),
  });


  await app.renderPage();

  mountNotificationToggle('#notif-toggle');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });


  window.addEventListener('load', async () => {
    await app.renderPage();
  });


  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.bundle.js');
      console.log('✅ Service Worker berhasil didaftarkan.');
    } catch (error) {
      console.error('❌ Gagal mendaftarkan Service Worker:', error);
    }
  }
});
