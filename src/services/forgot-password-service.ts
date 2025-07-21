import { API_BASE } from '../config/api-config.js';

export interface SendVerificationPayload {
  phoneNumber: string;
}

export interface VerifyCodePayload {
  phoneNumber: string;
  otp: string;
}

export interface ResetPasswordPayload {
  phoneNumber: string;
  newPassword: string;
  token: string;
}

export async function sendVerificationCode(payload: SendVerificationPayload) {
  const response = await fetch(`${API_BASE}/auth/SendOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function verifyCode(payload: VerifyCodePayload) {
  const response = await fetch(`${API_BASE}/Auth/VerifyOTP`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data.data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await fetch(`${API_BASE}/Auth/ResetPasswordTwilio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}