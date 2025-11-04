export const BASE_URL = 'https://story-api.dicoding.dev/v1';

export function getToken() {
  return localStorage.getItem('token') || '';
}
