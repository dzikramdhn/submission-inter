import AuthHelper from '../utils/auth-helper';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/unsubscribe`,
};

export async function subscribePushNotification(payload) {
  const token = AuthHelper.getToken();
  return fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export async function unsubscribePushNotification(payload) {
  const token = AuthHelper.getToken();
  return fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}
