import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from '../utils/notification-helper';


export default async function mountNotificationToggle(containerSelector = '#notif-toggle') {
  const el = document.querySelector(containerSelector);
  if (!el) return;
  el.innerHTML = `
    <button id="btn-notif" class="notif-btn notif-inactive">Aktifkan Notifikasi</button>
    <small id="notif-status" class="notif-status">🔕 Notifikasi nonaktif.</small>
  `;
  const btn = el.querySelector('#btn-notif');
  const status = el.querySelector('#notif-status');

  async function updateUI() {
    const on = await isCurrentPushSubscriptionAvailable();
    if (on) {
      btn.textContent = 'Nonaktifkan Notifikasi';
      btn.classList.add('notif-active'); btn.classList.remove('notif-inactive');
      status.textContent = '🔔 Notifikasi aktif.';
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.textContent = 'Aktifkan Notifikasi';
      btn.classList.add('notif-inactive'); btn.classList.remove('notif-active');
      status.textContent = '🔕 Notifikasi nonaktif.';
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      const on = await isCurrentPushSubscriptionAvailable();
      const ok = on ? await unsubscribe() : await subscribe();
      if (ok) await updateUI();
    } finally { btn.disabled = false; }
  });

  await updateUI();
}
