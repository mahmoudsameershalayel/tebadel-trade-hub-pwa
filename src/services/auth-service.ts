import type { RegisterPayload, LoginPayload } from '@/types/user';
import { REGISTER_URL, LOGIN_URL } from '../config/api-config.js';


export async function register(payload: RegisterPayload) {
  const apiPayload = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    phoneNumber: payload.phone,
    password: payload.password,
  };
  const response = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload),
  });
  const data = await response.json();
  if (!response.ok || !data.data?.succeeded) {
    throw data;
  }
  return data;
}

export async function login(payload: LoginPayload) {
  const apiPayload = {
    phoneNumber: payload.phone,
    password: payload.password,
  };
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload),
  });
  const data = await response.json();
  if (!response.ok || !data.data?.accessToken) {
    throw data;
  }
  return data;
} 