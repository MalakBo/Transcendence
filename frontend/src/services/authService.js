import { apiRequest } from './api';

export async function register(data) {
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: data,
  });
  return result;
}

export async function login(credentials) {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  });
  return result;
}

export async function logout() {
  const result = await apiRequest('/auth/logout', {
    method: 'POST',
  });
  return result;
}

export async function getMe() {
  const result = await apiRequest('/auth/me', {
    method: 'GET',
  });
  return result;
}