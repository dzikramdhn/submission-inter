import { BASE_URL } from '../config';
import AuthHelper from '../utils/auth-helper'; // pastikan sudah ada modul ini

const ENDPOINTS = {
  SUBSCRIBE: `${BASE_URL}/push/web/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/push/web/unsubscribe`,
};


export async function subscribePushNotification({ endpoint, keys }) {
  const accessToken = AuthHelper.getToken?.();
  const body = JSON.stringify({ endpoint, keys });

  const res = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body,
  });
  const json = await res.json();
  return { ...json, ok: res.ok };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = AuthHelper.getToken?.();
  const body = JSON.stringify({ endpoint });

  const res = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body,
  });
  const json = await res.json();
  return { ...json, ok: res.ok };
}
